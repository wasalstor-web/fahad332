
export enum Carrier {
  ARAMEX = 'Aramex',
  SMSA = 'SMSA',
  DHL = 'DHL',
  SPL = 'SPL',
  OTO = 'OTO',
  MAPT = 'MAPT'
}

export enum ShipmentStatus {
  CREATED = 'Created',
  PICKED_UP = 'Picked Up',
  IN_TRANSIT = 'In Transit',
  DELIVERED = 'Delivered',
  EXCEPTION = 'Exception'
}

export enum SourceChannel {
  WHATSAPP = 'WhatsApp',
  TELEGRAM = 'Telegram',
  API = 'API',
  STORE = 'My Store',
  LANDING = 'Landing Page',
  SALLA = 'Salla',
  ODOO = 'Odoo',
  WORDPRESS = 'WordPress',
  SHOPIFY = 'Shopify'
}

export enum TransactionType {
  CREDIT = 'Credit', // Refund or Top-up
  DEBIT = 'Debit',   // Payment for shipment or Withdrawal
  FEE = 'Fee'        // Platform fee
}

export enum TransactionStatus {
  COMPLETED = 'Completed',
  PENDING = 'Pending',
  FAILED = 'Failed'
}

export type Language = 'en' | 'ar';
export type AIProvider = 'gemini' | 'openai' | 'anthropic' | 'deepseek' | 'vertex';

export interface Shipment {
  id: string;
  trackingNumber: string; // Unified tracking (OTO-xxxxx)
  carrierTracking: string;
  carrier: Carrier;
  status: ShipmentStatus;
  customerName: string;
  destination: string;
  cost: number; // Cost from carrier
  price: number; // Price to customer
  source: SourceChannel;
  date: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface KPIData {
  totalShipments: number;
  totalRevenue: number;
  totalProfit: number;
  successRate: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  date: string;
  status: TransactionStatus;
  referenceId?: string; // Links to Shipment ID if applicable
}

export interface WalletStats {
  balance: number;
  pending: number;
  currency: string;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Supervisor' | 'Support';
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    totalSpent: number;
    orderCount: number;
    lastOrderDate: string;
    status: 'Active' | 'Inactive';
}

export interface SupportTicket {
    id: string;
    subject: string;
    customer: string;
    status: 'Open' | 'In Progress' | 'Resolved';
    priority: 'Low' | 'Medium' | 'High';
    date: string;
}

export interface Invoice {
    id: string;
    customerName: string;
    amount: number;
    date: string;
    status: 'Paid' | 'Unpaid';
    items: string;
}