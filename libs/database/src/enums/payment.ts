export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELED = 'canceled',
}

export class PaymentType {
  Listing = 'listing';
  Subscription = 'subscription';
  Purchase = 'purchase';
  Escrow = 'escrow';
  Other = 'other';
}
