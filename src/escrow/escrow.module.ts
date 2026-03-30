import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { EscrowController } from './escrow.controller';
import { EscrowService } from './escrow.service';
import { MpesaEscrowService } from './mpesa-escrow.service';
import { MpesaEscrowProcessor } from './mpesa-escrow.processor';
import { Escrow, Order, Transaction, User } from '@app/database';
import { EmailModule } from '../common/email/email.module';
import { NotificationsModule } from '../common/notifications/notifications.module';
import { MpesaModule } from '../payments/mpesa/mpesa.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Escrow, Order, Transaction, User]),
    BullModule.registerQueue({
      name: 'mpesa-escrow-processing',
    }),
    EmailModule,
    NotificationsModule,
    MpesaModule,
  ],
  controllers: [EscrowController],
  providers: [EscrowService, MpesaEscrowService, MpesaEscrowProcessor],
  exports: [EscrowService, MpesaEscrowService],
})
export class EscrowModule {}
