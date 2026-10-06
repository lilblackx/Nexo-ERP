/** Tipos de los datos de demostración (lib/demo/data.json, generado por scripts/generar-demo.mjs). */

export type InvoiceStatus = "EMITIDA" | "PAGADA" | "PARCIAL" | "VENCIDA" | "ANULADA";
export type Currency = "USD" | "VES" | "COP" | "USDT";

export interface RateRow {
  fecha: string;
  bcv: number;
  paralelo: number;
  cop: number;
  brecha: number;
}

export interface Rates {
  bcv: number;
  paralelo: number;
  cop: number;
  gapPct: number;
  bcvVsAyerPct: number;
  paraleloVsAyerPct: number;
  vigenteDesde: string;
  actualizado: string;
}

export interface DemoUser {
  username: string;
  name: string;
  role: "ADMIN" | "CAJERO" | "VENDEDOR";
  status: string;
}

export interface Product {
  code: string;
  name: string;
  category: string;
  perBox: number;
  units: number;
  boxes: number;
  loose: number;
  min: number;
  cost: number;
  p1: number;
  p2: number;
  p3: number;
  expires: string | null;
  status: string;
  lowStock: boolean;
}

export interface InvoiceLine {
  code: string;
  product: string;
  saleType: "bulto" | "unidad";
  qty: number;
  level: string;
  price: number;
  subtotal: number;
}

export interface Payment {
  method: string;
  currency: Currency;
  amount: number;
  usd: number;
  origin: string;
  reference: string | null;
}

export interface Change {
  usd: number;
  method: string;
  origin: string;
  reference?: string | null;
  authorizedBy?: string | null;
  note?: string;
}

export interface LaterPayment {
  date: string;
  method: string;
  currency: Currency;
  amount: number;
  usd: number;
  rate: number | null;
  origin: string;
  reference: string | null;
}

export interface Invoice {
  number: string;
  control: string;
  issued: string;
  client: string;
  clientId: number;
  seller: string;
  condition: "contado" | "credito";
  paymentColumn: string;
  subtotal: number;
  discount: number;
  discountReason: string | null;
  discountAuthorizedBy: string | null;
  ivaPct: number;
  iva: number;
  total: number;
  rate: number;
  creditDays: number | null;
  due: string | null;
  status: InvoiceStatus;
  lines: InvoiceLine[];
  payments: Payment[];
  paidUsd: number | null;
  change: Change | null;
  laterPayments: LaterPayment[];
  voided: { date: string; reason: string; user: string; creditNote: string } | null;
}

/** Extensión de los datos demo: la factura del hero (un diálogo sin guardar). */
export interface InvoiceDraft {
  extension: true;
  number: string;
  client: string;
  seller: string;
  condition: "contado";
  subtotal: number;
  discount: number;
  ivaPct: number;
  iva: number;
  total: number;
  rate: number;
  lines: InvoiceLine[];
  payments: Payment[];
  paidUsd: number;
  change: Change & { note: string };
}

export interface CreditNote {
  number: string;
  client: string;
  invoice: string;
  amount: number;
  available: number;
  status: string;
  date: string;
  reason: string;
}

export interface BankAccount {
  bank: string;
  masked: string;
  type: string;
  initialUsd: number;
  initialVes: number;
  balanceUsd: number;
  balanceVes: number;
}

export interface BankMovement {
  date: string;
  account: string;
  type: "abono" | "cargo";
  usd: number;
  ves: number | null;
  rate: number | null;
  origin: string;
  reference: string;
  description: string;
  user: string;
}

export interface CashRegister {
  name: string;
  status: "ABIERTA" | "CERRADA";
  cashier: string;
  opened: string;
  closed: string | null;
  openingBalance: number;
  closingBalance: number | null;
  movements: number;
  inflow: number;
  outflow: number;
  computedBalance: number;
}

export interface CashMovement {
  register: string;
  date: string;
  type: "entrada" | "salida";
  amount: number;
  description: string;
  origin: string;
}

export type CxcStatus = "vencida" | "parcial" | "pagada" | "pendiente";

export interface Receivable {
  invoice: string;
  client: string;
  clientId: number;
  seller: string;
  total: number;
  paid: number;
  balance: number;
  creditBalance: number;
  days: number;
  issued: string;
  due: string;
  overdueDays: number;
  status: CxcStatus;
}

export interface ReceivableByClient {
  clientId: number;
  client: string;
  balance: number;
  creditBalance: number;
  days: number;
  issued: string;
  status: CxcStatus;
  invoices: string[];
}

export type AgingRange = "Vigente" | "1-30" | "31-60" | "61-90" | "90+";

export interface Aging {
  cutoff: string;
  rows: {
    invoice: string;
    client: string;
    due: string;
    balance: number;
    overdueDays: number;
    elapsedDays: number;
    range: AgingRange;
  }[];
  totals: Record<AgingRange, number>;
  total: number;
}

export interface Payable {
  purchase: string;
  supplier: string;
  balance: number;
  issued: string;
  days: number;
  due: string;
  overdueDays: number;
  status: string;
}

export type CommissionStatus = "pendiente" | "liberada" | "pagada";

export interface Commission {
  id: number;
  invoice: string;
  client: string;
  seller: string;
  date: string;
  lines: number;
  base: number;
  sale: number;
  commission: number;
  status: CommissionStatus;
  breakdown: { product: string; qty: number; base: number; sale: number; commission: number }[];
}

export interface Purchases {
  orders: {
    number: string;
    supplier: string;
    date: string;
    expected: string;
    products: number;
    received: number;
    total: number;
    status: "PENDIENTE" | "PARCIAL" | "COMPLETA" | "ANULADA";
  }[];
  receptions: {
    number: string;
    order: string;
    supplier: string;
    date: string;
    user: string;
    status: "RECIBIDA" | "PARCIAL" | "FACTURADA" | "ANULADA";
  }[];
  returns: { number: string; reception: string; reason: string; qty: number; status: string; date: string }[];
  invoices: {
    number: string;
    order: string;
    supplier: string;
    date: string;
    condition: string;
    creditDays: number | null;
    due: string | null;
    total: number;
    status: "EMITIDA" | "ANULADA";
    paid: number;
    balance: number;
  }[];
}

export interface Dashboard {
  salesToday: number;
  salesVsYesterdayPct: number;
  receivable: number;
  receivableOverdueInvoices: number;
  payable: number;
  payableOverdue: number;
  lowStock: number;
  week: { day: string; amount: number }[];
  activeRegisters: { name: string; cashier: string; status: string }[];
  recentInvoices: { number: string; client: string; amount: number; status: string }[];
  stockAlerts: { code: string; name: string; category: string; units: number; expires: string | null }[];
}

export interface AuditRow {
  date: string;
  user: string;
  module: string;
  action: string;
  detail: string;
}

export interface DemoData {
  company: { name: string; initials: string; app: string };
  today: string;
  ivaPct: number;
  rates: Rates;
  rateHistory: RateRow[];
  users: DemoUser[];
  sellers: { code: string; name: string }[];
  clients: { id: number; name: string; category: string; creditLimit: number; creditDays: number }[];
  suppliers: { name: string; creditDays: number }[];
  products: Product[];
  invoices: Invoice[];
  invoiceDraft: InvoiceDraft;
  creditNotes: CreditNote[];
  banks: { name: string; type: string; status: string }[];
  bankAccounts: BankAccount[];
  bankMovements: BankMovement[];
  cashRegisters: CashRegister[];
  cashMovements: CashMovement[];
  receivables: Receivable[];
  receivablesByClient: ReceivableByClient[];
  aging: Aging;
  payables: Payable[];
  commissions: Commission[];
  commissionPayments: {
    seller: string;
    date: string;
    method: string;
    origin: string;
    amount: number;
    reference: string;
    invoices: string[];
  }[];
  purchases: Purchases;
  dashboard: Dashboard;
  notifications: { title: string; detail: string; severity: string; goesTo: string }[];
  audit: AuditRow[];
}
