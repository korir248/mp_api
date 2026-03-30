import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { User } from '@app/database';
import { Product } from '@app/database';
import { Order } from '@app/database';
import { Escrow } from '@app/database';
import { Transaction } from '@app/database';

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  tags?: Array<{ name: string; value: string }>;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;
  private readonly fromEmail: string;
  private readonly replyToEmail: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.fromEmail = this.configService.get<string>('EMAIL_FROM') || '';
    this.replyToEmail = this.configService.get<string>('EMAIL_REPLY_TO') || '';

    if (!apiKey) {
      this.logger.warn(
        'RESEND_API_KEY not configured. Email functionality will be limited.',
      );
      return;
    }

    this.resend = new Resend(apiKey);
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (!this.resend) {
        this.logger.error(
          'Resend not initialized. Check RESEND_API_KEY configuration.',
        );
        return false;
      }

      const emailData = {
        from: options.from || this.fromEmail,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
        reply_to: options.replyTo || this.replyToEmail,
        tags: options.tags || [],
      };

      const result = await this.resend.emails.send(emailData);

      if (result.error) {
        this.logger.error('Failed to send email:', result.error);
        return false;
      }

      this.logger.log(
        `Email sent successfully to ${Array.isArray(options.to) ? options.to.join(', ') : options.to}. ID: ${result.data?.id}`,
      );
      return true;
    } catch (error) {
      this.logger.error('Error sending email:', error);
      return false;
    }
  }

  // User Registration Email
  async sendWelcomeEmail(
    user: User,
    verificationToken: string,
  ): Promise<boolean> {
    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${verificationToken}`;

    const template = this.getWelcomeEmailTemplate(user, verificationUrl);

    return this.sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      tags: [
        { name: 'type', value: 'welcome' },
        { name: 'user_id', value: user.id },
      ],
    });
  }

  // Email Verification
  async sendEmailVerification(
    user: User,
    verificationToken: string,
  ): Promise<boolean> {
    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${verificationToken}`;

    const template = this.getEmailVerificationTemplate(user, verificationUrl);

    return this.sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      tags: [
        { name: 'type', value: 'email_verification' },
        { name: 'user_id', value: user.id },
      ],
    });
  }

  // Phone Verification
  async sendPhoneVerification(user: User, otp: string): Promise<boolean> {
    const template = this.getPhoneVerificationTemplate(user, otp);

    return this.sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      tags: [
        { name: 'type', value: 'phone_verification' },
        { name: 'user_id', value: user.id },
      ],
    });
  }

  // Product Recommendation
  async sendProductRecommendation(
    user: User,
    product: Product,
  ): Promise<boolean> {
    const productUrl = `${this.configService.get('FRONTEND_URL')}/products/${product.id}`;

    const template = this.getProductRecommendationTemplate(
      user,
      product,
      productUrl,
    );

    return this.sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      tags: [
        { name: 'type', value: 'product_recommendation' },
        { name: 'user_id', value: user.id },
        { name: 'product_id', value: product.id },
      ],
    });
  }

  // Product View Notification
  async sendProductViewNotification(
    seller: User,
    product: Product,
    viewer: User,
  ): Promise<boolean> {
    const productUrl = `${this.configService.get('FRONTEND_URL')}/products/${product.id}`;

    const template = this.getProductViewNotificationTemplate(
      seller,
      product,
      viewer,
      productUrl,
    );

    return this.sendEmail({
      to: seller.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      tags: [
        { name: 'type', value: 'product_view' },
        { name: 'seller_id', value: seller.id },
        { name: 'product_id', value: product.id },
        { name: 'viewer_id', value: viewer.id },
      ],
    });
  }

  // Product Booking Notification
  async sendProductBookingNotification(
    seller: User,
    buyer: User,
    product: Product,
    order: Order,
  ): Promise<boolean> {
    const orderUrl = `${this.configService.get('FRONTEND_URL')}/orders/${order.id}`;

    const template = this.getProductBookingTemplate(
      seller,
      buyer,
      product,
      order,
      orderUrl,
    );

    return this.sendEmail({
      to: seller.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      tags: [
        { name: 'type', value: 'product_booking' },
        { name: 'seller_id', value: seller.id },
        { name: 'buyer_id', value: buyer.id },
        { name: 'product_id', value: product.id },
        { name: 'order_id', value: order.id },
      ],
    });
  }

  // Escrow Loaded Notification
  async sendEscrowLoadedNotification(
    buyer: User,
    seller: User,
    escrow: Escrow,
    product: Product,
  ): Promise<boolean> {
    const escrowUrl = `${this.configService.get('FRONTEND_URL')}/escrow/${escrow.id}`;

    const template = this.getEscrowLoadedTemplate(
      buyer,
      seller,
      escrow,
      product,
      escrowUrl,
    );

    return this.sendEmail({
      to: [buyer.email, seller.email],
      subject: template.subject,
      html: template.html,
      text: template.text,
      tags: [
        { name: 'type', value: 'escrow_loaded' },
        { name: 'buyer_id', value: buyer.id },
        { name: 'seller_id', value: seller.id },
        { name: 'escrow_id', value: escrow.id },
        { name: 'product_id', value: product.id },
      ],
    });
  }

  // Transaction Complete Notification
  async sendTransactionCompleteNotification(
    user: User,
    transaction: Transaction,
    product?: Product,
  ): Promise<boolean> {
    const template = this.getTransactionCompleteTemplate(
      user,
      transaction,
      product,
    );

    return this.sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      tags: [
        { name: 'type', value: 'transaction_complete' },
        { name: 'user_id', value: user.id },
        { name: 'transaction_id', value: transaction.id },
        { name: 'product_id', value: product?.id || 'N/A' },
      ],
    });
  }

  // OTP for Escrow Approval
  async sendEscrowOTP(
    user: User,
    otp: string,
    escrow: Escrow,
  ): Promise<boolean> {
    const template = this.getEscrowOTPTemplate(user, otp, escrow);

    return this.sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      tags: [
        { name: 'type', value: 'escrow_otp' },
        { name: 'user_id', value: user.id },
        { name: 'escrow_id', value: escrow.id },
      ],
    });
  }
}
