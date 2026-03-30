import { Entity, Column, ManyToOne, JoinColumn, Index, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { User } from './user.entity';
import { ProductRequest } from './product-request.entity';
import { Product } from './product.entity';

export enum ResponseStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

@Entity('product_request_responses')
@Index(['productRequestId', 'status'])
@Index(['sellerId', 'status'])
@Unique(['productRequestId', 'sellerId'])
export class ProductRequestResponse extends BaseEntity {
  @Column()
  productRequestId: string;

  @ManyToOne(() => ProductRequest, (request) => request.responses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productRequestId' })
  productRequest: Promise<ProductRequest>;

  @Column()
  sellerId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sellerId' })
  seller: User;

  @Column({ nullable: true })
  productId?: string;

  @ManyToOne(() => Product, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'productId' })
  product?: Product;

  @Column({
    type: 'enum',
    enum: ResponseStatus,
    default: ResponseStatus.PENDING,
  })
  status: ResponseStatus;

  @Column('text')
  message: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  offeredPrice?: number;

  @Column({ nullable: true })
  offeredCondition?: string;

  @Column({ nullable: true })
  deliveryTime?: string;

  @Column({ nullable: true })
  additionalNotes?: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  readAt?: Date;

  @Column({ nullable: true })
  respondedAt?: Date;

  @Column('jsonb', { nullable: true })
  metadata?: {
    images?: string[];
    documents?: string[];
    customFields?: Record<string, any>;
  };
}
