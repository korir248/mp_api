import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { type Job } from 'bull';
import { EmailService } from './email.service';
import { EmailJobData, EmailJobType } from './email-queue.service';

@Processor('email-processing')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private emailService: EmailService) {}

  @Process(EmailJobType.WELCOME_EMAIL)
  async handleWelcomeEmail(job: Job<EmailJobData>): Promise<void> {
    try {
      const { user, verificationToken } = job.data.data;
      await this.emailService.sendWelcomeEmail(user, verificationToken);
      this.logger.log(`Welcome email sent successfully for user ${user.id}`);
    } catch (error) {
      this.logger.error(
        `Failed to send welcome email for job ${job.id}:`,
        error,
      );
      throw error;
    }
  }

  @Process(EmailJobType.EMAIL_VERIFICATION)
  async handleEmailVerification(job: Job<EmailJobData>): Promise<void> {
    try {
      const { user, verificationToken } = job.data.data;
      await this.emailService.sendEmailVerification(user, verificationToken);
      this.logger.log(
        `Email verification sent successfully for user ${user.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send email verification for job ${job.id}:`,
        error,
      );
      throw error;
    }
  }

  @Process(EmailJobType.PHONE_VERIFICATION)
  async handlePhoneVerification(job: Job<EmailJobData>): Promise<void> {
    try {
      const { user, otp } = job.data.data;
      await this.emailService.sendPhoneVerification(user, otp);
      this.logger.log(
        `Phone verification sent successfully for user ${user.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send phone verification for job ${job.id}:`,
        error,
      );
      throw error;
    }
  }

  @Process(EmailJobType.PRODUCT_RECOMMENDATION)
  async handleProductRecommendation(job: Job<EmailJobData>): Promise<void> {
    try {
      const { user, product } = job.data.data;
      await this.emailService.sendProductRecommendation(user, product);
      this.logger.log(
        `Product recommendation sent successfully for user ${user.id}, product ${product.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send product recommendation for job ${job.id}:`,
        error,
      );
      throw error;
    }
  }

  @Process(EmailJobType.PRODUCT_VIEW_NOTIFICATION)
  async handleProductViewNotification(job: Job<EmailJobData>): Promise<void> {
    try {
      const { seller, product, viewer } = job.data.data;
      await this.emailService.sendProductViewNotification(
        seller,
        product,
        viewer,
      );
      this.logger.log(
        `Product view notification sent successfully for seller ${seller.id}, product ${product.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send product view notification for job ${job.id}:`,
        error,
      );
      throw error;
    }
  }

  @Process(EmailJobType.PRODUCT_BOOKING_NOTIFICATION)
  async handleProductBookingNotification(
    job: Job<EmailJobData>,
  ): Promise<void> {
    try {
      const { seller, buyer, product, order } = job.data.data;
      await this.emailService.sendProductBookingNotification(
        seller,
        buyer,
        product,
        order,
      );
      this.logger.log(
        `Product booking notification sent successfully for seller ${seller.id}, order ${order.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send product booking notification for job ${job.id}:`,
        error,
      );
      throw error;
    }
  }

  @Process(EmailJobType.ESCROW_LOADED_NOTIFICATION)
  async handleEscrowLoadedNotification(job: Job<EmailJobData>): Promise<void> {
    try {
      const { buyer, seller, escrow, product } = job.data.data;
      await this.emailService.sendEscrowLoadedNotification(
        buyer,
        seller,
        escrow,
        product,
      );
      this.logger.log(
        `Escrow loaded notification sent successfully for escrow ${escrow.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send escrow loaded notification for job ${job.id}:`,
        error,
      );
      throw error;
    }
  }

  @Process(EmailJobType.TRANSACTION_COMPLETE_NOTIFICATION)
  async handleTransactionCompleteNotification(
    job: Job<EmailJobData>,
  ): Promise<void> {
    try {
      const { user, transaction, product } = job.data.data;
      await this.emailService.sendTransactionCompleteNotification(
        user,
        transaction,
        product,
      );
      this.logger.log(
        `Transaction complete notification sent successfully for user ${user.id}, transaction ${transaction.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send transaction complete notification for job ${job.id}:`,
        error,
      );
      throw error;
    }
  }

  @Process(EmailJobType.ESCROW_OTP)
  async handleEscrowOTP(job: Job<EmailJobData>): Promise<void> {
    try {
      const { user, otp, escrow } = job.data.data;
      await this.emailService.sendEscrowOTP(user, otp, escrow);
      this.logger.log(
        `Escrow OTP sent successfully for user ${user.id}, escrow ${escrow.id}`,
      );
    } catch (error) {
      this.logger.error(`Failed to send escrow OTP for job ${job.id}:`, error);
      throw error;
    }
  }
}
