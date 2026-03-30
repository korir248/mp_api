import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base';
import type { IUser } from '../interfaces';

@Entity('refresh_tokens')
export class RefreshToken extends BaseEntity {
  @Column({ unique: true })
  token: string;

  @ManyToOne('User', 'refreshTokens', { onDelete: 'CASCADE' })
  user: IUser;

  @Column({ default: false })
  isRevoked: boolean;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;
}
