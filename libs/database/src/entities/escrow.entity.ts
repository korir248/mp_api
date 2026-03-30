import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base';
import { EscrowStatus } from '../enums';
import type { IOrder, IUser } from '../interfaces';

@Entity('escrows')
export class Escrow extends BaseEntity {
  @Column({ unique: true })
  escrowId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: EscrowStatus,
    default: EscrowStatus.PENDING,
  })
  status: EscrowStatus;

  @Column({ type: 'timestamp', nullable: true })
  fundedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  releasedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  refundedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Column({ nullable: true })
  releaseCode?: string;

  @Column({ nullable: true })
  disputeReason?: string;

  @Column({ nullable: true })
  disputeDescription?: string;

  @Column({ type: 'timestamp', nullable: true })
  disputedAt?: Date;

  @Column({ nullable: true })
  resolution?: string;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt?: Date;

  @ManyToOne('Order', 'escrows', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: IOrder;

  @Column()
  orderId: string;

  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'buyerId' })
  buyer: IUser;

  @Column()
  buyerId: string;

  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sellerId' })
  seller: IUser;

  @Column()
  sellerId: string;
}
