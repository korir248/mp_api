import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base';
import { UserRole, UserStatus } from '../enums';
import { RefreshToken } from './refresh-token.entity';
import { Product } from './product.entity';
import { Order } from './order.entity';
import { Transaction } from './transaction.entity';
import { FileUpload } from './file-upload.entity';
import { Favorite } from './favorite.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  profileImage?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({ default: false })
  isIdentityVerified: boolean;

  @Column({ nullable: true })
  mpesaNumber?: string;

  @Column({ nullable: true })
  bankAccount?: string;

  @Column({ default: 0 })
  rating: number;

  @Column({ default: 0 })
  totalReviews: number;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.BUYER,
  })
  role: UserRole;

  @OneToMany('RefreshToken', 'user')
  refreshTokens: RefreshToken[];

  @OneToMany('Product', 'seller')
  products: Product[];

  @OneToMany('Order', 'buyer')
  orders: Order[];

  @OneToMany('Order', 'seller')
  soldOrders: Order[];

  @OneToMany('Transaction', 'user')
  transactions: Transaction[];

  @OneToMany('FileUpload', 'uploadedBy')
  fileUploads: FileUpload[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];
}
