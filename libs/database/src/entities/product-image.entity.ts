import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base';
import type { IProduct } from '../interfaces';

@Entity('product_images')
export class ProductImage extends BaseEntity {
  @Column()
  url: string;

  @Column({ nullable: true })
  alt?: string;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: false })
  isPrimary: boolean;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column({ nullable: true })
  metadata?: string; // JSON string for additional image metadata

  @ManyToOne('Product', 'images', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: IProduct;

  @Column()
  productId: string;
}
