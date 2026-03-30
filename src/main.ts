import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { SecurityValidationPipe } from './common/security/security-validation.pipe';
import { ConfigService } from '@nestjs/config';
import { SecurityService } from './common/security/security.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const isDevelopment = process.env.NODE_ENV !== 'production';

  // Global filters
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor(),
  );

  // Global validation pipe
  const configService = app.get(ConfigService);
  const securityService = app.get(SecurityService);
  app.useGlobalPipes(
    new SecurityValidationPipe(configService, securityService),
  );

  // CORS configuration - allow all origins in development
  if (isDevelopment) {
    app.enableCors({
      origin: true, // Allow all origins in development
      methods: process.env.CORS_METHODS?.split(',') || [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'OPTIONS',
      ],
      allowedHeaders: process.env.CORS_ALLOWED_HEADERS?.split(',') || [
        'Content-Type',
        'Authorization',
        'Upgrade',
        'Sec-WebSocket-Key',
        'Sec-WebSocket-Version',
        'Sec-WebSocket-Extensions',
        'Connection',
      ],
      credentials: process.env.CORS_CREDENTIALS === 'true',
    });
    logger.log('🔓 CORS enabled for all origins (development mode)');
  } else {
    app.enableCors({
      origin: process.env.CORS_ORIGIN?.split(',') || [],
      methods: process.env.CORS_METHODS?.split(',') || [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'OPTIONS',
      ],
      allowedHeaders: process.env.CORS_ALLOWED_HEADERS?.split(',') || [
        'Content-Type',
        'Authorization',
      ],
      credentials: process.env.CORS_CREDENTIALS === 'true',
    });
  }

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('MP API')
    .setDescription(
      'A marketplace API for selling new and second-hand items with escrow functionality',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Users', 'User management and profiles')
    .addTag('Products', 'Product listings and management')
    .addTag('Categories', 'Product categories')
    .addTag('File Upload', 'File upload and management')
    .addTag('Health', 'Health check endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3001;
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);

  const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
  logger.log(`🚀 Application is running on: ${baseUrl}`);
  logger.log(`📚 API Documentation: ${baseUrl}/api/docs`);
  logger.log(`🏥 Health Check: ${baseUrl}/api/v1/health`);
}

bootstrap().catch((error) => {
  console.error('Error starting application:', error);
  process.exit(1);
});
