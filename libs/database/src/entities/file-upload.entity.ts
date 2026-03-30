import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base';
import { FileUploadType, FileUploadCategory } from '../enums';
import type { IUser } from '../interfaces';

@Entity('file_uploads')
export class FileUpload extends BaseEntity {
  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column()
  mimeType: string;

  @Column('bigint')
  size: number;

  @Column({
    type: 'enum',
    enum: FileUploadType,
  })
  type: FileUploadType;

  @Column({
    type: 'enum',
    enum: FileUploadCategory,
    default: FileUploadCategory.OTHER,
  })
  category: FileUploadCategory;

  @Column({ nullable: true })
  alt?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ nullable: true })
  metadata?: string; // JSON string for additional file metadata

  @ManyToOne('User', { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'uploadedById' })
  uploadedBy: IUser | null;

  @Column({ nullable: true })
  uploadedById: string | null;
}
