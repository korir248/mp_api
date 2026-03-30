import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base';
import { Category } from './category.entity';
import { ProductImage } from './product-image.entity';
import { Order } from './order.entity';
import { Favorite } from './favorite.entity';
import type { IUser } from '../interfaces';
import {
  ProductStatus,
  ProductCondition,
  ProductType,
  VehicleType,
  FuelType,
  TransmissionType,
  PropertyType,
  BusinessType,
} from '../enums';

@Entity('products')
export class Product extends BaseEntity {
  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  originalPrice?: number;

  @Column({
    type: 'enum',
    enum: ProductCondition,
    default: ProductCondition.NEW,
  })
  condition: ProductCondition;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.DRAFT,
  })
  status: ProductStatus;

  @Column({ nullable: true })
  brand?: string;

  @Column({ nullable: true })
  model?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  size?: string;

  @Column({ nullable: true })
  weight?: string;

  @Column({ nullable: true })
  dimensions?: string;

  @Column({ default: 1 })
  quantity: number;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  tags?: string; // JSON string of tags

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  favoriteCount: number;

  // Enhanced product properties for high-value items
  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.GENERAL,
  })
  productType: ProductType;

  // Vehicle-specific properties
  @Column({
    type: 'enum',
    enum: VehicleType,
    nullable: true,
  })
  vehicleType?: VehicleType;

  @Column({ nullable: true })
  year?: number;

  @Column({ nullable: true })
  mileage?: number;

  @Column({
    type: 'enum',
    enum: FuelType,
    nullable: true,
  })
  fuelType?: FuelType;

  @Column({
    type: 'enum',
    enum: TransmissionType,
    nullable: true,
  })
  transmission?: TransmissionType;

  @Column({ nullable: true })
  engineSize?: string;

  @Column({ nullable: true })
  registrationNumber?: string;

  @Column({ nullable: true })
  vinNumber?: string;

  @Column({ nullable: true })
  previousOwners?: number;

  @Column({ nullable: true })
  accidentHistory?: boolean;

  @Column({ nullable: true })
  serviceHistory?: boolean;

  // Real Estate properties
  @Column({
    type: 'enum',
    enum: PropertyType,
    nullable: true,
  })
  propertyType?: PropertyType;

  @Column({ nullable: true })
  bedrooms?: number;

  @Column({ nullable: true })
  bathrooms?: number;

  @Column({ nullable: true })
  squareFootage?: number;

  @Column({ nullable: true })
  lotSize?: number;

  @Column({ nullable: true })
  yearBuilt?: number;

  @Column({ nullable: true })
  parkingSpaces?: number;

  @Column({ nullable: true })
  hasGarden?: boolean;

  @Column({ nullable: true })
  hasPool?: boolean;

  @Column({ nullable: true })
  hasSecurity?: boolean;

  @Column({ nullable: true })
  propertyTax?: number;

  @Column({ nullable: true })
  hoaFees?: number;

  // Business properties
  @Column({
    type: 'enum',
    enum: BusinessType,
    nullable: true,
  })
  businessType?: BusinessType;

  @Column({ nullable: true })
  annualRevenue?: number;

  @Column({ nullable: true })
  monthlyRevenue?: number;

  @Column({ nullable: true })
  numberOfEmployees?: number;

  @Column({ nullable: true })
  yearsInBusiness?: number;

  @Column({ nullable: true })
  hasInventory?: boolean;

  @Column({ nullable: true })
  inventoryValue?: number;

  @Column({ nullable: true })
  hasLease?: boolean;

  @Column({ nullable: true })
  leaseExpiry?: Date;

  @Column({ nullable: true })
  monthlyRent?: number;

  // Enhanced tracking and verification
  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  verifiedAt?: Date;

  @Column({ nullable: true })
  verifiedBy?: string;

  @Column({ default: false })
  requiresInspection: boolean;

  @Column({ nullable: true })
  inspectionDate?: Date;

  @Column({ nullable: true })
  inspectionReport?: string;

  @Column({ default: false })
  hasWarranty: boolean;

  @Column({ nullable: true })
  warrantyExpiry?: Date;

  @Column({ nullable: true })
  warrantyDetails?: string;

  @Column({ default: false })
  isUrgent: boolean;

  @Column({ nullable: true })
  urgentReason?: string;

  @Column({ default: false })
  isNegotiable: boolean;

  @Column({ nullable: true })
  minimumPrice?: number;

  @Column({ nullable: true })
  maximumPrice?: number;

  @Column({ default: 0 })
  inquiryCount: number;

  @Column({ default: 0 })
  offerCount: number;

  @Column({ nullable: true })
  lastInquiryAt?: Date;

  @Column({ nullable: true })
  lastOfferAt?: Date;

  @Column({ nullable: true })
  estimatedValue?: number;

  @Column({ nullable: true })
  marketValue?: number;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ nullable: true })
  featuredUntil?: Date;

  @Column({ default: false })
  isSponsored: boolean;

  @Column({ nullable: true })
  sponsoredUntil?: Date;

  @Column({ nullable: true })
  sponsoredAmount?: number;

  // Additional metadata
  @Column({ type: 'jsonb', nullable: true })
  customAttributes?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  specifications?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  features?: string[];

  @Column({ type: 'jsonb', nullable: true })
  documents?: Array<{
    name: string;
    url: string;
    type: string;
    uploadedAt: Date;
  }>;

  @ManyToOne('User', 'products', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sellerId' })
  seller: IUser;

  @Column()
  sellerId: string;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ nullable: true })
  categoryId?: string;

  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images: ProductImage[];

  @OneToMany(() => Order, (order) => order.product)
  orders: Order[];

  // @OneToMany('Favorite', 'product')
  @OneToMany(() => Favorite, (favorite) => favorite.product)
  favorites: Favorite[];
}
