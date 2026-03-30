import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base';
import { OrderStatus, DeliveryMethod } from '../enums';
import type { IUser, IProduct, IEscrow, ITransaction } from '../interfaces';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ unique: true })
  orderNumber: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  shippingCost?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  taxAmount?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discountAmount?: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: DeliveryMethod,
    default: DeliveryMethod.PICKUP,
  })
  deliveryMethod: DeliveryMethod;

  @Column({ nullable: true })
  deliveryAddress?: string;

  @Column({ nullable: true })
  deliveryInstructions?: string;

  @Column({ nullable: true })
  trackingNumber?: string;

  @Column({ type: 'timestamp', nullable: true })
  estimatedDeliveryDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt?: Date;

  @Column({ nullable: true })
  notes?: string;

  @ManyToOne('User', 'orders', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'buyerId' })
  buyer: IUser;

  @Column()
  buyerId: string;

  @ManyToOne('User', 'soldOrders', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sellerId' })
  seller: IUser;

  @Column()
  sellerId: string;

  @ManyToOne('Product', 'orders', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: IProduct;

  @Column()
  productId: string;

  @OneToMany('Escrow', 'order')
  escrows: IEscrow[];

  @OneToMany('Transaction', 'order')
  transactions: ITransaction[];
}
