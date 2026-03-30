// Product Enums
export enum ProductStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  SOLD = 'sold',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export enum ProductCondition {
  NEW = 'new',
  LIKE_NEW = 'like_new',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
}

export enum ProductType {
  GENERAL = 'general',
  VEHICLE = 'vehicle',
  REAL_ESTATE = 'real_estate',
  BUSINESS = 'business',
  ELECTRONICS = 'electronics',
  FURNITURE = 'furniture',
  CLOTHING = 'clothing',
  BOOKS = 'books',
  SPORTS = 'sports',
  OTHER = 'other',
}

// Vehicle Enums
export enum VehicleType {
  CAR = 'car',
  MOTORCYCLE = 'motorcycle',
  TRUCK = 'truck',
  BUS = 'bus',
  BOAT = 'boat',
  AIRCRAFT = 'aircraft',
  OTHER = 'other',
}

export enum FuelType {
  PETROL = 'petrol',
  DIESEL = 'diesel',
  ELECTRIC = 'electric',
  HYBRID = 'hybrid',
  LPG = 'lpg',
  CNG = 'cng',
  OTHER = 'other',
}

export enum TransmissionType {
  MANUAL = 'manual',
  AUTOMATIC = 'automatic',
  SEMI_AUTOMATIC = 'semi_automatic',
  CVT = 'cvt',
}

// Real Estate Enums
export enum PropertyType {
  HOUSE = 'house',
  APARTMENT = 'apartment',
  LAND = 'land',
  COMMERCIAL = 'commercial',
  INDUSTRIAL = 'industrial',
  AGRICULTURAL = 'agricultural',
  OTHER = 'other',
}

// Business Enums
export enum BusinessType {
  RETAIL = 'retail',
  RESTAURANT = 'restaurant',
  SERVICE = 'service',
  MANUFACTURING = 'manufacturing',
  TECHNOLOGY = 'technology',
  HEALTHCARE = 'healthcare',
  EDUCATION = 'education',
  OTHER = 'other',
}

// User Enums
export enum UserRole {
  ADMIN = 'admin',
  SELLER = 'seller',
  BUYER = 'buyer',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
  DELETED = 'deleted',
}

// Order Enums
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum DeliveryMethod {
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
  SHIPPING = 'shipping',
}

// Payment Enums
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentProvider {
  MPESA = 'mpesa',
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
}

export enum TransactionType {
  PAYMENT = 'payment',
  WITHDRAWAL = 'withdrawal',
  REFUND = 'refund',
  COMMISSION = 'commission',
  ESCROW = 'escrow',
  ESCROW_HOLD = 'escrow_hold',
  ESCROW_RELEASE = 'escrow_release',
}

// Escrow Enums
export enum EscrowStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  FUNDED = 'funded',
  RELEASED = 'released',
  DISPUTED = 'disputed',
  REFUNDED = 'refunded',
  EXPIRED = 'expired',
}

// M-Pesa Audit Enums
export enum MpesaAuditType {
  STK_PUSH_REQUEST = 'STK_PUSH_REQUEST',
  STK_PUSH_RESPONSE = 'STK_PUSH_RESPONSE',
  STK_PUSH_CALLBACK = 'STK_PUSH_CALLBACK',
  B2C_REQUEST = 'B2C_REQUEST',
  B2C_RESPONSE = 'B2C_RESPONSE',
  B2C_CALLBACK = 'B2C_CALLBACK',
  C2B_REGISTER_URL = 'C2B_REGISTER_URL',
  C2B_VALIDATION = 'C2B_VALIDATION',
  C2B_CONFIRMATION = 'C2B_CONFIRMATION',
  C2B_RESPONSE = 'C2B_RESPONSE',
  C2B_CALLBACK = 'C2B_CALLBACK',
  C2B_REQUEST = 'C2B_REQUEST',
  TRANSACTION_STATUS_REQUEST = 'TRANSACTION_STATUS_REQUEST',
  TRANSACTION_STATUS_RESPONSE = 'TRANSACTION_STATUS_RESPONSE',
}

export enum MpesaAuditStatus {
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

// File Upload Enums
export enum FileUploadType {
  IMAGE = 'image',
  DOCUMENT = 'document',
  VIDEO = 'video',
  AUDIO = 'audio',
  OTHER = 'other',
}

export enum FileUploadCategory {
  PRODUCT_IMAGE = 'product_image',
  USER_AVATAR = 'user_avatar',
  IDENTITY_DOCUMENT = 'identity_document',
  BUSINESS_LICENSE = 'business_license',
  PROPERTY_DOCUMENT = 'property_document',
  VEHICLE_DOCUMENT = 'vehicle_document',
  OTHER = 'other',
}

// Notification Enums
export enum NotificationType {
  ORDER_CREATED = 'order_created',
  ORDER_UPDATED = 'order_updated',
  ORDER_CANCELLED = 'order_cancelled',
  ORDER_DELIVERED = 'order_delivered',
  ESCROW_CREATED = 'escrow_created',
  ESCROW_FUNDED = 'escrow_funded',
  ESCROW_RELEASED = 'escrow_released',
  ESCROW_DISPUTED = 'escrow_disputed',
  ESCROW_REFUNDED = 'escrow_refunded',
  PAYMENT_RECEIVED = 'payment_received',
  PAYMENT_SENT = 'payment_sent',
  PAYMENT_FAILED = 'payment_failed',
  PRODUCT_VIEWED = 'product_viewed',
  PRODUCT_BOOKED = 'product_booked',
  PRODUCT_APPROVED = 'product_approved',
  PRODUCT_REJECTED = 'product_rejected',
  ACCOUNT_VERIFIED = 'account_verified',
  ACCOUNT_SUSPENDED = 'account_suspended',
  SYSTEM_ANNOUNCEMENT = 'system_announcement',
  SECURITY_ALERT = 'security_alert',
  MESSAGE_RECEIVED = 'message_received',
  MESSAGE_SENT = 'message_sent',
  CONVERSATION_CREATED = 'conversation_created',
  CONVERSATION_UPDATED = 'conversation_updated',
  PARTICIPANT_ADDED = 'participant_added',
  PARTICIPANT_REMOVED = 'participant_removed',
  INDEPENDENT_ESCROW_CREATED = 'independent_escrow_created',
  INDEPENDENT_ESCROW_FUNDED = 'independent_escrow_funded',
  INDEPENDENT_ESCROW_RELEASED = 'independent_escrow_released',
  INDEPENDENT_ESCROW_DISPUTED = 'independent_escrow_disputed',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
}
