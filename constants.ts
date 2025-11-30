
import { Carrier, Shipment, ShipmentStatus, SourceChannel, Transaction, TransactionStatus, TransactionType, SystemUser, Customer, SupportTicket, Invoice } from './types';

export const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: 'SH-001',
    trackingNumber: 'OTO-1001',
    carrierTracking: 'ARX-998877',
    carrier: Carrier.ARAMEX,
    status: ShipmentStatus.DELIVERED,
    customerName: 'Ahmed Al-Fahad',
    destination: 'Riyadh',
    cost: 25,
    price: 35,
    source: SourceChannel.WHATSAPP,
    date: '2023-10-25',
  },
  {
    id: 'SH-002',
    trackingNumber: 'OTO-1002',
    carrierTracking: 'SMS-223344',
    carrier: Carrier.SMSA,
    status: ShipmentStatus.IN_TRANSIT,
    customerName: 'Sarah Khalid',
    destination: 'Jeddah',
    cost: 22,
    price: 32,
    source: SourceChannel.STORE,
    date: '2023-10-26',
  },
  {
    id: 'SH-003',
    trackingNumber: 'OTO-1003',
    carrierTracking: 'DHL-556677',
    carrier: Carrier.DHL,
    status: ShipmentStatus.CREATED,
    customerName: 'Omar Bin Saleh',
    destination: 'Dammam',
    cost: 45,
    price: 60,
    source: SourceChannel.API,
    date: '2023-10-27',
  },
  {
    id: 'SH-004',
    trackingNumber: 'OTO-1004',
    carrierTracking: 'SPL-112233',
    carrier: Carrier.SPL,
    status: ShipmentStatus.PICKED_UP,
    customerName: 'Fatima Al-Otaibi',
    destination: 'Abha',
    cost: 20,
    price: 30,
    source: SourceChannel.TELEGRAM,
    date: '2023-10-27',
  },
  {
    id: 'SH-005',
    trackingNumber: 'OTO-1005',
    carrierTracking: 'ARX-112299',
    carrier: Carrier.ARAMEX,
    status: ShipmentStatus.EXCEPTION,
    customerName: 'Khalid Al-Malki',
    destination: 'Tabuk',
    cost: 28,
    price: 38,
    source: SourceChannel.LANDING,
    date: '2023-10-24',
  },
  {
    id: 'SH-006',
    trackingNumber: 'OTO-1006',
    carrierTracking: 'OTO-LOG-8822',
    carrier: Carrier.OTO,
    status: ShipmentStatus.IN_TRANSIT,
    customerName: 'Mona Al-Shehri',
    destination: 'Mecca',
    cost: 18,
    price: 28,
    source: SourceChannel.WHATSAPP,
    date: '2023-10-28',
  },
  {
    id: 'SH-007',
    trackingNumber: 'OTO-1007',
    carrierTracking: 'MAPT-Express-001',
    carrier: Carrier.MAPT,
    status: ShipmentStatus.DELIVERED,
    customerName: 'Faisal Al-Saud',
    destination: 'Riyadh',
    cost: 30,
    price: 45,
    source: SourceChannel.STORE,
    date: '2023-10-28',
  },
  {
    id: 'SH-008',
    trackingNumber: 'OTO-1008',
    carrierTracking: 'OTO-LOG-9911',
    carrier: Carrier.OTO,
    status: ShipmentStatus.CREATED,
    customerName: 'Laila Mahmoud',
    destination: 'Jazan',
    cost: 22,
    price: 35,
    source: SourceChannel.API,
    date: '2023-10-29',
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TRX-991', type: TransactionType.DEBIT, amount: 28.75, currency: 'SAR', description: 'Shipment Created (OTO-1006)', date: '2023-10-28 10:30', status: TransactionStatus.COMPLETED, referenceId: 'SH-006' },
  { id: 'TRX-992', type: TransactionType.CREDIT, amount: 1500.00, currency: 'SAR', description: 'Wallet Top-up via Moyasar', date: '2023-10-27 09:15', status: TransactionStatus.COMPLETED },
  { id: 'TRX-993', type: TransactionType.DEBIT, amount: 35.00, currency: 'SAR', description: 'Shipment Created (OTO-1008)', date: '2023-10-29 14:20', status: TransactionStatus.PENDING, referenceId: 'SH-008' },
  { id: 'TRX-994', type: TransactionType.CREDIT, amount: 45.00, currency: 'SAR', description: 'Refund: Shipment Cancelled (OTO-1009)', date: '2023-10-26 11:00', status: TransactionStatus.COMPLETED },
  { id: 'TRX-995', type: TransactionType.FEE, amount: 5.00, currency: 'SAR', description: 'Monthly Subscription Fee', date: '2023-10-01 00:00', status: TransactionStatus.COMPLETED },
];

export const MOCK_USERS: SystemUser[] = [
  { id: 'U-1', name: 'Admin User', email: 'admin@logisa.com', role: 'Admin', status: 'Active', lastLogin: '2023-10-30 10:00' },
  { id: 'U-2', name: 'Sara Support', email: 'sara@logisa.com', role: 'Support', status: 'Active', lastLogin: '2023-10-30 09:30' },
  { id: 'U-3', name: 'Khalid Ops', email: 'khalid@logisa.com', role: 'Supervisor', status: 'Inactive', lastLogin: '2023-10-25 14:00' },
];

// --- New Mock Data for CRM, Support, Accounting ---

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'C-001', name: 'Ahmed Al-Fahad', email: 'ahmed@example.com', phone: '+966500000001', city: 'Riyadh', totalSpent: 1250, orderCount: 15, lastOrderDate: '2023-10-25', status: 'Active' },
  { id: 'C-002', name: 'Sarah Khalid', email: 'sarah@example.com', phone: '+966500000002', city: 'Jeddah', totalSpent: 3400, orderCount: 42, lastOrderDate: '2023-10-26', status: 'Active' },
  { id: 'C-003', name: 'Omar Bin Saleh', email: 'omar@example.com', phone: '+966500000003', city: 'Dammam', totalSpent: 450, orderCount: 5, lastOrderDate: '2023-10-20', status: 'Inactive' },
  { id: 'C-004', name: 'Mona Al-Shehri', email: 'mona@example.com', phone: '+966500000004', city: 'Mecca', totalSpent: 890, orderCount: 12, lastOrderDate: '2023-10-28', status: 'Active' },
];

export const MOCK_TICKETS: SupportTicket[] = [
  { id: 'T-1001', subject: 'Delayed Shipment #SH-005', customer: 'Khalid Al-Malki', status: 'Open', priority: 'High', date: '2023-10-28' },
  { id: 'T-1002', subject: 'Refund Request', customer: 'Omar Bin Saleh', status: 'Resolved', priority: 'Medium', date: '2023-10-25' },
  { id: 'T-1003', subject: 'Address Change', customer: 'Sarah Khalid', status: 'In Progress', priority: 'Low', date: '2023-10-29' },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2023-001', customerName: 'Al-Nour Trading Est.', amount: 5400.00, date: '2023-10-01', status: 'Paid', items: 'Logistics Services - Sep 2023' },
  { id: 'INV-2023-002', customerName: 'Modern Solutions Co.', amount: 2150.50, date: '2023-10-05', status: 'Unpaid', items: 'Express Shipping Bulk' },
  { id: 'INV-2023-003', customerName: 'Green Valley', amount: 980.00, date: '2023-10-15', status: 'Paid', items: 'International Freight' },
];

export const NAV_ITEMS = [
  { name: 'Dashboard', nameAr: 'لوحة التحكم', path: '/' },
  { name: 'Shipments', nameAr: 'الشحنات', path: '/shipments' },
  { name: 'Tracking', nameAr: 'تتبع الشحنات', path: '/tracking' }, // New
  { name: 'CRM', nameAr: 'إدارة العملاء', path: '/crm' }, // New
  { name: 'Finance', nameAr: 'المالية', path: '/finance' },
  { name: 'Accounting', nameAr: 'المحاسبة', path: '/accounting' }, // New
  { name: 'Integrations', nameAr: 'التكاملات والربط', path: '/integrations' },
  { name: 'Support', nameAr: 'الدعم الفني', path: '/support' }, // New
  { name: 'AI Advisor', nameAr: 'المستشار الذكي', path: '/advisor' },
  { name: 'Settings', nameAr: 'الإعدادات', path: '/settings' },
];
