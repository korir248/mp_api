import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from './base';
import { User } from './user.entity';
import { Message } from './message.entity';
import { ConversationParticipant } from './conversation-participant.entity';
import type { ConversationMetadata } from '../interfaces/messaging.interfaces';

export enum ConversationType {
  DIRECT = 'direct',
  GROUP = 'group',
  DISPUTE = 'dispute',
  SUPPORT = 'support',
}

export enum ConversationStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

@Entity('conversations')
@Index(['type', 'status'])
@Index(['createdAt'])
export class Conversation extends BaseEntity {
  @Column({
    type: 'enum',
    enum: ConversationType,
    default: ConversationType.DIRECT,
  })
  type: ConversationType;

  @Column({
    type: 'enum',
    enum: ConversationStatus,
    default: ConversationStatus.ACTIVE,
  })
  status: ConversationStatus;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  orderId?: string; // Link to order if conversation is about a specific order

  @Column({ nullable: true })
  productId?: string; // Link to product if conversation is about a specific product

  @Column({ nullable: true })
  escrowId?: string; // Link to escrow if conversation is about escrow

  @Column({ nullable: true })
  disputeId?: string; // Link to dispute if this is a dispute conversation

  @Column({ nullable: true })
  createdById: string; // User who created the conversation

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ nullable: true })
  lastMessageId?: string; // ID of the last message for quick access

  @Column({ nullable: true })
  lastMessageAt?: Date; // Timestamp of last message

  @Column({ default: false })
  isRead: boolean; // Whether the conversation has unread messages

  @Column('jsonb', { nullable: true })
  metadata?: ConversationMetadata; // Additional metadata (tags, custom fields, etc.)

  // Relations
  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @OneToMany(
    () => ConversationParticipant,
    (participant) => participant.conversation,
  )
  participants: ConversationParticipant[];
}
