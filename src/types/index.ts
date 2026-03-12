// Re-export database types
export type {
  Database,
  Json,
  Product,
  ProductInsert,
  ProductUpdate,
  Transaction,
  TransactionInsert,
  TransactionUpdate,
  TransactionStatus,
  TransactionWithProduct,
  StorageBucket,
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
} from './database';

// User types (for auth, not stored in public schema)
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface CheckoutForm {
  guestName: string;
  guestEmail: string;
}

// Midtrans callback/webhook types
export interface MidtransNotification {
  order_id: string;
  status_code: string;
  gross_amount: string;
  payment_type: string;
  transaction_status: string;
  transaction_id: string;
  transaction_time: string;
  fraud_status?: string;
  signature_key: string;
}

// Product creation form
export interface ProductForm {
  name: string;
  slug: string;
  description?: string;
  price: number;
  imageFile?: File;
  productFile?: File;
  isActive: boolean;
}
