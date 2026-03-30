import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base';
import { PaymentStatus, PaymentProvider, TransactionType } from '../enums';
import type { IUser, IOrder } from '../interfaces';

@Entity('transactions')
export class Transaction extends BaseEntity {
  @Column({ unique: true })
  transactionId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentProvider,
    nullable: true,
  })
  provider?: PaymentProvider;

  @Column({ nullable: true })
  providerTransactionId?: string;

  @Column({ nullable: true })
  reference?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  metadata?: string; // JSON string for additional transaction data

  @Column({ type: 'timestamp', nullable: true })
  processedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  failedAt?: Date;

  @Column({ nullable: true })
  failureReason?: string;

  @ManyToOne('User', 'transactions', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: IUser;

  @Column({ nullable: true })
  userId?: string | null;

  @ManyToOne('Order', 'transactions', {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'orderId' })
  order?: IOrder;

  @Column({ nullable: true })
  orderId?: string;
}
