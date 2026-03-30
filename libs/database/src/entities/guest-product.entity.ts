import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base';
import { GuestSeller } from './guest-seller.entity';

export enum GuestProductStatus {
  DRAFT = 'draft',
  PAYMENT_PENDING = 'payment_pending',
  PAYMENT_COMPLETED = 'payment_completed',
  PUBLISHED = 'published',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('guest_products')
@Index(['status', 'createdAt'])
@Index(['guestSellerId', 'status'])
export class GuestProduct extends BaseEntity {
  @Column({ nullable: true })
  productId?: string;

  @Column()
  guestSellerId: string;

  @Column({ nullable: true })
  paymentTransactionId?: string;

  @Column({
    type: 'enum',
    enum: GuestProductStatus,
    default: GuestProductStatus.DRAFT,
  })
  status: GuestProductStatus;

  @Column('jsonb')
  productData: {
    title: string;
    description: string;
    price: number;
    condition: string;
    categoryId: string;
    location: string;
    brand?: string;
    model?: string;
    tags?: string[];
    images: string[];
    reasonForSelling: string;
    deliveryAvailable: boolean;
    deliveryRadius?: number;
  };

  @Column('jsonb')
  sellerData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    location: string;
    deliveryAvailable: boolean;
    deliveryRadius?: number;
    bankAccount?: {
      bankName: string;
      accountNumber: string;
      accountName: string;
    };
  };

  @Column('jsonb', { nullable: true })
  paymentData?: {
    amount: number;
    phoneNumber: string;
    checkoutRequestId?: string;
    merchantRequestId?: string;
    receiptNumber?: string;
    transactionDate?: string;
    mpesaResponse?: {
      MerchantRequestID?: string;
      CheckoutRequestID?: string;
      ResponseCode?: string;
      ResponseDescription?: string;
      CustomerMessage?: string;
      MpesaReceiptNumber?: string;
      TransactionDate?: string;
    };
  };

  @Column('jsonb', { nullable: true })
  metadata?: {
    listingFee: number;
    listingFeePercentage: number;
    paymentProvider: string;
    publishedAt?: string;
    failedReason?: string;
  };

  @Column({ nullable: true })
  publishedProductId?: string;

  @Column({ nullable: true })
  createdUserId?: string;

  @ManyToOne(() => GuestSeller, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guestSellerId' })
  guestSeller: GuestSeller;
}
