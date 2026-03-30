import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

interface B2CResponse {
  OriginatorConversationID: string;
  ConversationID: string;
  ResponseCode: string;
  ResponseDescription: string;
}

interface OAuthResponse {
  access_token: string;
  expires_in: string;
}

@Injectable()
export class MpesaDirectService {
  private readonly logger = new Logger(MpesaDirectService.name);
  private httpClient: AxiosInstance;
  private baseUrl: string;
  private accessToken: string | null;
  private tokenExpiry: Date | null;

  constructor(private configService: ConfigService) {
    const environment = this.configService.get<string>(
      'MPESA_ENVIRONMENT',
      'production',
    );
    this.baseUrl =
      environment === 'production'
        ? 'https://api.safaricom.co.ke'
        : 'https://sandbox.safaricom.co.ke';

    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
    });
  }

  /**
   * Get OAuth access token
   */
  private async getAccessToken(forceNewToken: boolean): Promise<string> {
    if (
      !forceNewToken &&
      this.accessToken &&
      this.tokenExpiry &&
      new Date() < this.tokenExpiry
    ) {
      return this.accessToken;
    }

    this.accessToken = null;
    this.tokenExpiry = null;

    const consumerKey = this.configService.get<string>(
      'MPESA_CONSUMER_KEY',
      '',
    );
    const consumerSecret = this.configService.get<string>(
      'MPESA_CONSUMER_SECRET',
      '',
    );

    if (!consumerKey || !consumerSecret) {
      throw new BadRequestException('M-Pesa credentials not configured');
    }

    try {
      const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
        'base64',
      );

      const { data } = await this.httpClient.get<OAuthResponse>(
        '/oauth/v1/generate?grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        },
      );

      this.accessToken = data.access_token;
      // Token expires in 3599 seconds, cache for 3500 seconds (safe margin)
      this.tokenExpiry = new Date(Date.now() + 3500 * 1000);

      this.logger.log('Access token generated successfully');
      return this.accessToken;
    } catch (error) {
      this.logger.error(
        'Failed to get access token:',
        error.response?.data || error.message,
      );
      throw new BadRequestException('Failed to authenticate with M-Pesa');
    }
  }
  async initiateB2C(
    securityCredential: string,
    phoneNumber: string,
    amount: number,
    remarks: string,
    shortCode: string,
    initiatorName: string,
  ): Promise<B2CResponse> {
    try {
      return this._initiateB2C(
        securityCredential,
        phoneNumber,
        amount,
        remarks,
        shortCode,
        initiatorName,
      );
    } catch (error) {
      this.logger.error('B2C request failed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      if (error.response?.status === 401) {
        this.logger.warn('Token expired, retrying with fresh token...');
        return await this._initiateB2C(
          securityCredential,
          phoneNumber,
          amount,
          remarks,
          shortCode,
          initiatorName,
          true,
        );
      }
      throw error;
    }
  }

  /**
   * Initiate B2C payment
   */
  private async _initiateB2C(
    securityCredential: string,
    phoneNumber: string,
    amount: number,
    remarks: string,
    shortCode: string,
    initiatorName: string,
    forceNewToken = false,
  ): Promise<B2CResponse> {
    const token = await this.getAccessToken(forceNewToken);

    const apiBaseUrl = this.configService.get('API_BASE_URL') as string;

    const payload = {
      InitiatorName: initiatorName,
      SecurityCredential: securityCredential,
      CommandID: 'BusinessPayment',
      Amount: amount,
      PartyA: shortCode,
      PartyB: phoneNumber,
      Remarks: remarks,
      QueueTimeOutURL: `${apiBaseUrl}/api/v1/payments/mpesa/callback`,
      ResultURL: `${apiBaseUrl}/api/v1/payments/mpesa/callback`,
      Occasion: remarks,
    };

    this.logger.debug('B2C Request payload:', {
      ...payload,
      SecurityCredential: '[REDACTED]',
    });

    const { data } = await this.httpClient.post<B2CResponse>(
      '/mpesa/b2c/v1/paymentrequest',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return data;
  }
}
