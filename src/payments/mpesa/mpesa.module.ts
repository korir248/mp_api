import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { MpesaController } from './mpesa.controller';
import { MpesaService } from './mpesa.service';
import { PaymentProcessorService } from '../jobs/payment-processor.service';
import { PaymentProcessor } from '../jobs/payment-processor.processor';
import { Transaction, MpesaAuditLog } from '@app/database';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MpesaDirectService } from './mpesa-direct.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, MpesaAuditLog]),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'payment-processing',
    }),
  ],
  controllers: [MpesaController],
  providers: [
    MpesaService,
    PaymentProcessorService,
    PaymentProcessor,
    MpesaDirectService,
  ],
  exports: [MpesaService, PaymentProcessorService],
})
export class MpesaModule {}
