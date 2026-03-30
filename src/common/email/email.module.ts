import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { EmailService } from './email.service';
import { OTPService } from '../otp/otp.service';
import { EmailQueueService } from './email-queue.service';
import { EmailProcessor } from './email-processor.processor';

@Module({
  imports: [
    ConfigModule,
    BullModule.registerQueue({
      name: 'email-processing',
    }),
  ],
  providers: [EmailService, OTPService, EmailQueueService, EmailProcessor],
  exports: [EmailService, OTPService, EmailQueueService],
})
export class EmailModule {}
