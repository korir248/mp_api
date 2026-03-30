import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SecurityService } from './security.service';
import { SecurityAuditController } from './security-audit.controller';
import {
  SecurityMiddleware,
  RateLimitMiddleware,
  RequestValidationMiddleware,
} from './security.middleware';
import { SecurityValidationPipe } from './security-validation.pipe';
import securityConfig from './security.config';

@Module({
  imports: [ConfigModule.forFeature(securityConfig)],
  providers: [SecurityService, SecurityValidationPipe],
  controllers: [SecurityAuditController],
  exports: [SecurityService, SecurityValidationPipe],
})
export class SecurityModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestValidationMiddleware).forRoutes('*');

    consumer.apply(SecurityMiddleware).forRoutes('*');

    consumer.apply(RateLimitMiddleware).forRoutes('*');
  }
}
