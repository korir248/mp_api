import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import {
  FileUpload,
  FileUploadType as FileType,
  FileUploadCategory as FileCategory,
  User,
  UserRole,
  IUser,
} from '@app/database';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private s3Client: S3Client;
  private bucketName: string;

  constructor(
    @InjectRepository(FileUpload)
    private fileUploadRepository: Repository<FileUpload>,
    private configService: ConfigService,
  ) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION') || 'us-east-1',
      endpoint: this.configService.get<string>('AWS_ENDPOINT'), // For Digital Ocean Spaces
      credentials: {
        accessKeyId:
          this.configService.get<string>('AWS_ACCESS_KEY_ID') || 'test',
        secretAccessKey:
          this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || 'test',
      },
      forcePathStyle:
        this.configService.get<string>('AWS_FORCE_PATH_STYLE') === 'true',
    });
    this.bucketName =
      this.configService.get<string>('AWS_BUCKET_NAME') || 'test';
  }

  async onModuleInit() {
    const bucketExists = await this.checkBucketExists();

    try {
      if (!bucketExists) {
        this.logger.warn(
          `Bucket '${this.bucketName}' does not exist. Creating...`,
        );
        await this.createBucket();
      }
      this.logger.log(`Bucket '${this.bucketName}' is ready for use.`);
    } catch (error) {
      this.logger.error('Error during bucket initialization:', error);
    }
  }

  async checkBucketExists(): Promise<boolean> {
    try {
      const command = new HeadBucketCommand({
        Bucket: this.bucketName,
      });
      await this.s3Client.send(command);
      return true;
    } catch (error) {
      this.logger.error('Bucket check failed:', error);
      return false;
    }
  }

  private async createBucket(): Promise<void> {
    try {
      const createCommand = new CreateBucketCommand({
        Bucket: this.bucketName,
      });

      await this.s3Client.send(createCommand);
      this.logger.log(`Bucket '${this.bucketName}' created successfully`);
    } catch (error) {
      this.logger.error(`Failed to create bucket '${this.bucketName}':`, error);
      throw new InternalServerErrorException(
        `Failed to create bucket '${this.bucketName}': ${error.message}`,
      );
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    user: User | null,
    category: FileCategory = FileCategory.OTHER,
    alt?: string,
    description?: string,
  ): Promise<FileUpload> {
    const bucketExists = await this.checkBucketExists();
    if (!bucketExists) {
      try {
        await this.createBucket();
      } catch (error) {
        throw new BadRequestException(
          `Error occured when creating bucket: ${error.message}`,
        );
      }
    }
    // Validate file
    this.validateFile(file);

    // Generate unique filename
    const fileExtension = this.getFileExtension(file.originalname);
    const filename = `${uuidv4()}.${fileExtension}`;
    const key = this.generateFileKey(category, filename);

    try {
      // Upload to S3/Digital Ocean Spaces
      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
        Metadata: {
          originalName: file.originalname,
          uploadedBy: user ? user.id : 'guest',
        },
      });

      await this.s3Client.send(uploadCommand);

      // Generate URLs
      const url = this.generateFileUrl(key);
      const thumbnailUrl = this.shouldGenerateThumbnail(file.mimetype)
        ? this.generateThumbnail(key, file.mimetype)
        : undefined;

      // Save file record to database
      const fileUpload = this.fileUploadRepository.create({
        filename,
        originalName: file.originalname,
        url,
        thumbnailUrl,
        mimeType: file.mimetype,
        size: file.size,
        type: this.getFileType(file.mimetype),
        category,
        alt,
        description,
        isPublic: true,
        uploadedBy: user,
      } as DeepPartial<FileUpload>);

      return await this.fileUploadRepository.save(fileUpload);
    } catch (error) {
      throw new BadRequestException(`Failed to upload file: ${error.message}`);
    }
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    user: User,
    category: FileCategory = FileCategory.OTHER,
  ): Promise<FileUpload[]> {
    const uploadPromises = files.map((file) =>
      this.uploadFile(file, user, category),
    );

    return Promise.all(uploadPromises);
  }

  async deleteFile(fileId: string, user: User): Promise<void> {
    const fileUpload = await this.fileUploadRepository.findOne({
      where: { id: fileId },
      relations: ['uploadedBy'],
    });

    if (!fileUpload) {
      throw new BadRequestException('File not found');
    }

    // Check if user owns the file or is admin
    if (!fileUpload.uploadedBy) {
      if (user.role !== UserRole.ADMIN) {
        throw new BadRequestException(
          'Only administrators can delete orphaned files',
        );
      }
    } else if (
      fileUpload.uploadedBy.id !== user.id &&
      user.role !== UserRole.ADMIN
    ) {
      throw new BadRequestException('You can only delete your own files');
    }

    try {
      // Delete from S3/Digital Ocean Spaces
      const key = this.extractKeyFromUrl(fileUpload.url);
      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(deleteCommand);

      // Delete thumbnail if exists
      if (fileUpload.thumbnailUrl) {
        const thumbnailKey = this.extractKeyFromUrl(fileUpload.thumbnailUrl);
        const deleteThumbnailCommand = new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: thumbnailKey,
        });
        await this.s3Client.send(deleteThumbnailCommand);
      }

      // Delete from database
      await this.fileUploadRepository.softDelete(fileId);
    } catch (error) {
      throw new BadRequestException(`Failed to delete file: ${error.message}`);
    }
  }

  async getSignedUploadUrl(
    filename: string,
    mimeType: string,
    user: User,
    category: FileCategory = FileCategory.OTHER,
  ): Promise<{ uploadUrl: string; fileId: string }> {
    const fileExtension = this.getFileExtension(filename);
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const key = this.generateFileKey(category, uniqueFilename);

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: mimeType,
      ACL: 'public-read',
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    }); // 1 hour

    // Create file record in database
    const fileUpload = this.fileUploadRepository.create({
      filename: uniqueFilename,
      originalName: filename,
      url: this.generateFileUrl(key),
      mimeType,
      size: 0, // Will be updated after upload
      type: this.getFileType(mimeType),
      category,
      isPublic: true,
      uploadedBy: user,
    } as DeepPartial<FileUpload>);

    const savedFile = await this.fileUploadRepository.save(fileUpload);

    return {
      uploadUrl,
      fileId: savedFile.id,
    };
  }

  async getUserFiles(
    userId: string,
    category?: FileCategory,
  ): Promise<FileUpload[]> {
    const queryBuilder = this.fileUploadRepository
      .createQueryBuilder('file')
      .where('file.uploadedById = :userId', { userId });

    if (category) {
      queryBuilder.andWhere('file.category = :category', { category });
    }

    return queryBuilder.orderBy('file.createdAt', 'DESC').getMany();
  }

  private validateFile(file: Express.Multer.File): void {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (file.size > maxSize) {
      throw new BadRequestException(
        'File size too large. Maximum size is 10MB.',
      );
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('File type not allowed.');
    }
  }

  private getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  private getFileType(mimeType: string): FileType {
    if (mimeType.startsWith('image/')) return FileType.IMAGE;
    if (mimeType.startsWith('video/')) return FileType.VIDEO;
    if (mimeType.startsWith('audio/')) return FileType.AUDIO;
    if (mimeType.includes('pdf') || mimeType.includes('document'))
      return FileType.DOCUMENT;
    return FileType.OTHER;
  }

  private generateFileKey(category: FileCategory, filename: string): string {
    const timestamp = new Date().toISOString().split('T')[0];
    return `${category}/${timestamp}/${filename}`;
  }

  private generateFileUrl(key: string): string {
    const endpoint = this.configService.get<string>('AWS_ENDPOINT');
    if (endpoint) {
      if (endpoint.includes('localstack')) {
        return `${this.configService.get<string>('AWS_PUBLIC_ENDPOINT')}/${this.bucketName}/${key}`;
      }
      // Digital Ocean Spaces
      return `${endpoint}/${this.bucketName}/${key}`;
    } else {
      // AWS S3
      return `https://${this.bucketName}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${key}`;
    }
  }

  private extractKeyFromUrl(url: string): string {
    const parts = url.split('/');
    return parts.slice(-3).join('/'); // category/date/filename
  }

  private shouldGenerateThumbnail(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  private generateThumbnail(key: string, mimeType: string): string {
    // For now, return the same URL. In production, you might want to use
    // a service like ImageMagick or Sharp to generate thumbnails
    this.logger.log(mimeType);
    return this.generateFileUrl(key);
  }
}
