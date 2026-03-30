import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T = any> {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Operation completed successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
    required: false,
  })
  data?: T;

  @ApiProperty({
    description: 'Additional metadata',
    required: false,
    example: {
      timestamp: '2024-01-01T00:00:00Z',
      requestId: 'req_123456789',
      version: '1.0',
    },
  })
  metadata?: {
    timestamp: string;
    requestId: string;
    version: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };

  constructor(
    success: boolean,
    message: string,
    data?: T,
    metadata?: Partial<ApiResponseDto<T>['metadata']>,
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.metadata = {
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId(),
      version: '1.0',
      ...metadata,
    };
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static success<T>(
    message: string,
    data?: T,
    metadata?: any,
  ): ApiResponseDto<T> {
    return new ApiResponseDto(true, message, data, metadata);
  }

  static error(message: string, data?: any, metadata?: any): ApiResponseDto {
    return new ApiResponseDto(false, message, data, metadata);
  }

  static paginated<T>(
    message: string,
    data: T[],
    pagination: {
      page: number;
      limit: number;
      total: number;
    },
  ): ApiResponseDto<T[]> {
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    return new ApiResponseDto(true, message, data, {
      pagination: {
        ...pagination,
        totalPages,
      },
    });
  }
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: false,
  })
  success: false;

  @ApiProperty({
    description: 'Error message',
    example: 'Validation failed',
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error type',
    example: 'BadRequestException',
  })
  error: string;

  @ApiProperty({
    description: 'Detailed error information',
    required: false,
    example: {
      field: 'email',
      message: 'Email must be a valid email address',
    },
  })
  details?: any;

  @ApiProperty({
    description: 'Additional metadata',
    required: false,
    example: {
      timestamp: '2024-01-01T00:00:00Z',
      requestId: 'req_123456789',
      version: '1.0',
    },
  })
  metadata?: {
    timestamp: string;
    requestId: string;
    version: string;
  };

  constructor(
    message: string,
    statusCode: number,
    error: string,
    details?: any,
  ) {
    this.success = false;
    this.message = message;
    this.statusCode = statusCode;
    this.error = error;
    this.details = details;
    this.metadata = {
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      version: '1.0',
    };
  }
}

export class PaginationDto {
  @ApiProperty({
    description: 'Current page number',
    example: 1,
    minimum: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Indicates if there is a next page',
    example: true,
  })
  hasNext: boolean;

  @ApiProperty({
    description: 'Indicates if there is a previous page',
    example: false,
  })
  hasPrevious: boolean;
}
