import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
} from '@nestjs/swagger';
import { FileUploadService } from './file-upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { User, FileUploadCategory as FileCategory } from '@app/database';
import { CurrentUserOptional } from 'src/auth/decorators/current-user-optional.decorator';

@ApiTags('File Upload')
@Controller('files')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Public()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a single file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file or upload failed' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUserOptional() user: User | null,
    @Body('category') category?: FileCategory,
    @Body('alt') alt?: string,
    @Body('description') description?: string,
  ) {
    return this.fileUploadService.uploadFile(
      file,
      user,
      category || FileCategory.OTHER,
      alt,
      description,
    );
  }

  @Post('upload-multiple')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB per file
    }),
  ) // Max 10 files
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Files uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid files or upload failed' })
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: User,
    @Body('category') category?: FileCategory,
  ) {
    return this.fileUploadService.uploadMultipleFiles(
      files,
      user,
      category || FileCategory.OTHER,
    );
  }

  @Post('presigned-url')
  @ApiOperation({ summary: 'Get presigned URL for direct upload' })
  @ApiResponse({
    status: 201,
    description: 'Presigned URL generated successfully',
  })
  async getPresignedUploadUrl(
    @Body('filename') filename: string,
    @Body('mimeType') mimeType: string,
    @Body('category') category: FileCategory,
    @CurrentUser() user: User,
  ) {
    return this.fileUploadService.getSignedUploadUrl(
      filename,
      mimeType,
      user,
      category,
    );
  }

  @Get('my-files')
  @ApiOperation({ summary: 'Get current user files' })
  @ApiQuery({ name: 'category', required: false, enum: FileCategory })
  @ApiResponse({ status: 200, description: 'Files retrieved successfully' })
  async getUserFiles(
    @CurrentUser() user: User,
    @Query('category') category?: FileCategory,
  ) {
    return this.fileUploadService.getUserFiles(user.id, category);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a file' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @ApiResponse({ status: 400, description: 'File not found or access denied' })
  async deleteFile(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    await this.fileUploadService.deleteFile(id, user);
    return { message: 'File deleted successfully' };
  }
}
