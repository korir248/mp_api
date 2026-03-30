import { IBaseEntity } from './base.interface';
import { UserRole, UserStatus } from '../enums';

export interface IUser extends IBaseEntity {
  email: string;
  password: string;
  isEmailVerified: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profileImage?: string;
  bio?: string;
  location?: string;
  isPhoneVerified: boolean;
  isIdentityVerified: boolean;
  mpesaNumber?: string;
  bankAccount?: string;
  rating: number;
  totalReviews: number;
  status: UserStatus;
  role: UserRole;
  refreshTokens?: IRefreshToken[];
  products?: IProduct[];
  orders?: IOrder[];
  soldOrders?: IOrder[];
  transactions?: ITransaction[];
  fileUploads?: IFileUpload[];
}

// Forward declarations for circular dependencies
export interface IRefreshToken extends IBaseEntity {
  token: string;
  user?: IUser;
  isRevoked: boolean;
  expiresAt?: Date;
}

export interface IProduct extends IBaseEntity {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  sellerId: string;
  condition: string;
  location: string;
  isActive: boolean;
  viewCount: number;
  status: string;
  quantity: number;
  seller?: IUser;
  category?: ICategory;
  orders?: IOrder[];
  images?: IProductImage[];
}

export interface IOrder extends IBaseEntity {
  orderNumber: string;
  totalAmount: number;
  shippingCost?: number;
  deliveryMethod: string;
  status: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  quantity: number;
  buyer?: IUser;
  seller?: IUser;
  product?: IProduct;
  transactions?: ITransaction[];
  escrow?: IEscrow;
}

export interface ITransaction extends IBaseEntity {
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  reference: string;
  userId: string;
  orderId?: string;
  user?: IUser;
  order?: IOrder;
  processedAt?: Date;
  failedAt?: Date;
  failureReason?: string;
}

export interface IFileUpload extends IBaseEntity {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  uploadedById: string;
  isPublic: boolean;
  metadata?: string;
  uploadedBy?: IUser;
}

export interface ICategory extends IBaseEntity {
  name: string;
  description?: string;
  parentId?: string;
  parent?: ICategory;
  children?: ICategory[];
  products?: IProduct[];
}

export interface IProductImage extends IBaseEntity {
  url: string;
  type: string;
  uploadedAt: Date;
  productId: string;
  product?: IProduct;
}

export interface IEscrow extends IBaseEntity {
  orderId: string;
  amount: number;
  status: string;
  releasedAt?: Date;
  order?: IOrder;
}
