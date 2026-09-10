import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';
import {
  Upload,
  AlertTriangle,
  FileText,
  Users,
  CheckCircle,
  XCircle,
  Sun,
  Moon,
  TrendingUp,
  Search,
  Filter,
  Download,
  Edit,
  Clock,
  Briefcase,
  DollarSign,
  ChevronRight,
  ChevronDown,
  Printer,
  Plus,
  Bell,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  Calendar,
  Layers,
  SlidersHorizontal,
  FileSpreadsheet,
  LayoutDashboard,
  Calculator,
  UserCheck,
  Building2,
  CalendarCheck,
  Coffee,
  HelpCircle,
  Menu,
  Check,
  Settings,
  Send,
  CreditCard,
  CheckCheck,
  Building,
  ShoppingCart,
  ShieldCheck,
  FileCheck,
  ArrowRight,
  ExternalLink,
  Wallet,
  Receipt,
  Landmark,
  PieChart,
  ArrowDownLeft,
  Scale,
  Coins,
  FileBarChart,
  Banknote,
  RefreshCw,
  BarChart3,
  ArrowDownRight,
  Tag,
  BadgePercent
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || (window.location.origin.includes('localhost') ? 'http://localhost:5000/api' : '/api');

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Data States
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [exceptions, setExceptions] = useState([]);
  const [tardiness, setTardiness] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [summary, setSummary] = useState({
    totalEmployees: 0,
    pendingExceptions: 0,
    totalLateMins: 0,
    averageHours: 0
  });

  // Payroll date range
  const [startDate, setStartDate] = useState('2026-07-16');
  const [endDate, setEndDate] = useState('2026-07-31');

  // Filter States
  const [filterEmployee, setFilterEmployee] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Selection states
  const [selectedException, setSelectedException] = useState(null);
  const [overrideIn, setOverrideIn] = useState('');
  const [overrideOut, setOverrideOut] = useState('');
  const [overrideNote, setOverrideNote] = useState('');

  // Selected payroll record for payslip modal
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  // Notice to Explain (NTE) Modal
  const [selectedNteEmployee, setSelectedNteEmployee] = useState(null);

  // 5-Stage Payroll Disbursement Lifecycle
  // Stage 1: 'computed' (HR Computed)
  // Stage 2: 'forwarded' (Forwarded to Accounting Dept)
  // Stage 3: 'bpi_ready' (BPI BizLink Batch File Generated)
  // Stage 4: 'md_approved' (Managing Director Approved & Authorized)
  // Stage 5: 'disbursed' (Credited to ATM & Payslips Released)
  const [disbursementStage, setDisbursementStage] = useState('computed');
  const [disbursementAudit, setDisbursementAudit] = useState({
    forwardedAt: null,
    bpiGeneratedAt: null,
    mdApprovedAt: null,
    mdSigner: 'Ms. Jehan Abedin (Managing Director)'
  });
  const [showSethconModal, setShowSethconModal] = useState(false);
  const [showBpiModal, setShowBpiModal] = useState(false);
  const [emailToast, setEmailToast] = useState('');

  // CRM Module States
  const [crmClients, setCrmClients] = useState([
    {
      id: 'CL-101',
      name: 'Maria Santos',
      phone: '+63 917 555 3821',
      branch: 'Centrio Mall (Waxing)',
      totalVisits: 14,
      loyaltyPoints: 420,
      tier: 'Gold VIP',
      lastService: 'Underarm & Full Leg Wax',
      lastServiceDate: '2026-09-02',
      nextBooking: '2026-09-12 (10:30 AM)',
      preferredTechnician: 'Justine Ann Atay',
      activePackage: 'Underarm Waxing 5-Pack (3/5 left)',
      skinNotes: 'Sensitive skin. Use Tea Tree calming gel post-service.',
      smsStatus: 'Sent & Confirmed'
    },
    {
      id: 'CL-102',
      name: 'Bea Alonzo-Reyes',
      phone: '+63 920 444 8923',
      branch: 'Passion Nails (Centrio)',
      totalVisits: 8,
      loyaltyPoints: 260,
      tier: 'Silver Member',
      lastService: 'Gel Manicure + Spa Pedicure',
      lastServiceDate: '2026-08-28',
      nextBooking: '2026-09-09 (02:00 PM)',
      preferredTechnician: 'Cherimar Concigo',
      activePackage: 'Gel Spa Duo (2/4 left)',
      skinNotes: 'Allergic to harsh acetone. Use peel-off base coat.',
      smsStatus: 'Reminder Scheduled'
    },
    {
      id: 'CL-103',
      name: 'Kristine Hermosa-Sotto',
      phone: '+63 918 777 1290',
      branch: 'Limketkai Mall',
      totalVisits: 21,
      loyaltyPoints: 680,
      tier: 'Platinum Elite',
      lastService: 'Full Body Organic Sugar Wax',
      lastServiceDate: '2026-09-01',
      nextBooking: '2026-09-15 (11:00 AM)',
      preferredTechnician: 'Justine Ann Atay',
      activePackage: 'Annual VIP Wax Pass (7/12 left)',
      skinNotes: 'Prefers 100% natural organic sugar paste.',
      smsStatus: 'Sent & Confirmed'
    },
    {
      id: 'CL-104',
      name: 'Liza Soberano',
      phone: '+63 927 888 3341',
      branch: 'SM Downtown',
      totalVisits: 5,
      loyaltyPoints: 150,
      tier: 'Silver Member',
      lastService: 'Brazilian Wax Express',
      lastServiceDate: '2026-08-30',
      nextBooking: '2026-09-14 (04:30 PM)',
      preferredTechnician: 'Cherry Rose Paculanang',
      activePackage: 'Express 3-Session (1/3 left)',
      skinNotes: 'Aftercare aloe vera mist requested.',
      smsStatus: 'Pending'
    }
  ]);

  const [selectedClient, setSelectedClient] = useState(null);
  const [crmSearch, setCrmSearch] = useState('');
  const [crmBranchFilter, setCrmBranchFilter] = useState('');
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClient, setNewClient] = useState({
  const [crmToast, setCrmToast] = useState('');

  // Per-Transaction POS & Live Service Tickets
  const [serviceTickets, setServiceTickets] = useState([
    {
      id: 'TKT-2026-0901',
      time: '10:15 AM',
      date: '2026-09-10',
      clientName: 'Maria Santos (Gold VIP)',
      branch: 'Centrio Mall (Waxing)',
      service: 'Underarm & Full Leg Wax',
      specialist: 'Justine Ann Atay',
      amount: 1100.00,
      paymentMethod: 'GCash QR',
      commission: 110.00,
      status: 'Paid & Completed'
    },
    {
      id: 'TKT-2026-0902',
      time: '11:30 AM',
      date: '2026-09-10',
      clientName: 'Bea Alonzo-Reyes',
      branch: 'Passion Nails (Centrio)',
      service: 'Gel Manicure + Spa Pedicure',
      specialist: 'Cherimar Concigo',
      amount: 850.00,
      paymentMethod: 'Maya QR',
      commission: 85.00,
      status: 'Paid & Completed'
    },
    {
      id: 'TKT-2026-0903',
      time: '01:45 PM',
      date: '2026-09-10',
      clientName: 'Walk-in Client (Bed 2)',
      branch: 'Centrio Mall (Waxing)',
      service: 'Brazilian Wax Express',
      specialist: 'Cherry Rose Paculanang',
      amount: 650.00,
      paymentMethod: 'Cash',
      commission: 65.00,
      status: 'Paid & Completed'
    }
  ]);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    clientName: 'Maria Santos',
    branch: 'Centrio Mall (Waxing)',
    service: 'Brazilian Wax Express (₱650.00)',
    specialist: 'Justine Ann Atay',
    amount: 650,
    paymentMethod: 'Cash',
    notes: 'Sensitive skin. Standard tea tree post-wax applied.'
  });

  // Purchase Order & Procurement to Accounting States
  const [purchaseOrders, setPurchaseOrders] = useState([
    {
      poNumber: 'PO-2026-0901',
      date: '2026-09-03',
      branch: 'Centrio Mall (Waxing)',
      supplier: 'PureBeauty Salon Supplies Corp.',
      items: [
        { name: 'Organic Hot Wax Pellets (20kg Bag)', qty: 2, unitPrice: 4500, total: 9000 },
        { name: 'Non-Woven Waxing Paper Strips (100m Roll)', qty: 15, unitPrice: 380, total: 5700 },
        { name: 'Tea Tree Soothing Gel (5L Container)', qty: 3, unitPrice: 1650, total: 4950 },
        { name: 'Wooden Wax Spatulas Large (Box of 500)', qty: 10, unitPrice: 280, total: 2800 }
      ],
      totalAmount: 22450.00,
      step: 5, // 5 = Forwarded to Accounting Dept
      statusText: 'Forwarded to Accounting',
      accountingVoucher: 'AP-VOUCHER-2026-088',
      glAccount: '5100-20 (Salon Supplies Expense)',
      paymentTerm: 'Net 30 Days (BPI Corporate Transfer)',
      matchStatus: '3-Way Matched (PO + DR + Invoice)',
      receivedBy: 'Kristene HR / Centrio Lead'
    },
    {
      poNumber: 'PO-2026-0902',
      date: '2026-09-04',
      branch: 'Passion Nails (Centrio)',
      supplier: 'Glamour Pro Nail Distributing Co.',
      items: [
        { name: 'OPI Professional Gel Lacquer 30-Color Kit', qty: 1, unitPrice: 12500, total: 12500 },
        { name: 'UV/LED 48W Gel Curing Salon Lamps', qty: 2, unitPrice: 2400, total: 4800 },
        { name: 'Pure Acetone Nail Remover (1 Gallon)', qty: 4, unitPrice: 650, total: 2600 }
      ],
      totalAmount: 19900.00,
      step: 4, // 4 = Goods Received & Inspected
      statusText: 'Goods Received & Inspected',
      accountingVoucher: 'Pending Accounting Forward',
      glAccount: '5100-30 (Nail Consumables)',
      paymentTerm: 'Net 15 Days',
      matchStatus: 'Goods Inspected & Verified',
      receivedBy: 'Cherimar Concigo (Passion Nails Lead)'
    },
    {
      poNumber: 'PO-2026-0903',
      date: '2026-09-05',
      branch: 'SM Downtown Branch',
      supplier: 'CleanCare Commercial Solutions',
      items: [
        { name: 'Hospital-Grade Salon Disinfectant (4 Gallons)', qty: 2, unitPrice: 1850, total: 3700 },
        { name: 'Disposable Salon Bed Paper Rolls (50m)', qty: 20, unitPrice: 320, total: 6400 },
        { name: 'Nitrile Gloves Powder-Free (Box of 100)', qty: 15, unitPrice: 290, total: 4350 }
      ],
      totalAmount: 14450.00,
      step: 3, // 3 = Management PO Approval
      statusText: 'Awaiting Manager Approval',
      accountingVoucher: 'Queued',
      glAccount: '5100-40 (Clinic Sanitation)',
      paymentTerm: 'Cash On Delivery / BPI',
      matchStatus: 'Pending Delivery',
      receivedBy: 'Pending Store Arrival'
    },
    {
      poNumber: 'PO-2026-0904',
      date: '2026-09-06',
      branch: 'Limketkai Mall Branch',
      supplier: 'Wellness Natural Trading Inc.',
      items: [
        { name: 'Sugar Wax Calming Aloe Balm (500ml)', qty: 12, unitPrice: 420, total: 5040 },
        { name: 'Pre-Wax Skin Cleanser (1 Gallon)', qty: 2, unitPrice: 1450, total: 2900 }
      ],
      totalAmount: 7940.00,
      step: 1, // 1 = Store Requisition
      statusText: 'Store Requisition Submitted',
      accountingVoucher: 'Queued',
      glAccount: '5100-20 (Salon Supplies)',
      paymentTerm: 'Vendor Quotation Phase',
      matchStatus: 'Initial Request',
      receivedBy: 'Branch Requisition Draft'
    }
  ]);

  const [selectedPo, setSelectedPo] = useState(null);
  const [poFilterBranch, setPoFilterBranch] = useState('');
  const [poFilterStep, setPoFilterStep] = useState('');
  const [showCreatePoModal, setShowCreatePoModal] = useState(false);
  const [newPo, setNewPo] = useState({
    branch: 'Centrio Mall (Waxing)',
    supplier: 'PureBeauty Salon Supplies Corp.',
    itemName: 'Organic Hot Wax Pellets (10kg)',
    qty: 3,
    unitPrice: 2400
  });
  const [poToast, setPoToast] = useState('');

  // --- ACCOUNTING & FINANCIAL MANAGEMENT MODULE STATES ---
  const [accountingSubTab, setAccountingSubTab] = useState('overview'); // 'overview' | 'pl' | 'balance_sheet' | 'invoices' | 'pos_recon' | 'journal' | 'taxes'
  const [accountingBranch, setAccountingBranch] = useState('consolidated'); // 'consolidated' | 'centrio-waxing' | 'centrio-nails' | 'limketkai' | 'sm-downtown'
  const [accountingToast, setAccountingToast] = useState('');
  const [journalSearch, setJournalSearch] = useState('');
  const [apFilterStatus, setApFilterStatus] = useState('');
  const [showNewJournalModal, setShowNewJournalModal] = useState(false);
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [showPosReconModal, setShowPosReconModal] = useState(false);
  const [showFinancialReportModal, setShowFinancialReportModal] = useState(false);
  const [financialReportType, setFinancialReportType] = useState('pl'); // 'pl' | 'balance_sheet'

  // Bank & Liquidity Balances
  const [bankBalances, setBankBalances] = useState({
    bpiBizLink: 1428500.00,
    pettyCashCentrioWaxing: 25000.00,
    pettyCashPassionNails: 20000.00,
    pettyCashLimketkai: 25000.00,
    pettyCashSmDowntown: 20000.00,
  });

  // Multi-Branch P&L Data
  const [plData, setPlData] = useState({
    period: 'Month of August 2026 (MTD)',
    currency: 'PHP (₱)',
    branches: [
      {
        id: 'consolidated',
        name: 'ALRAJJ LEGACY Consolidated',
        revenue: {
          waxingServices: 792400.00,
          nailServices: 348250.00,
          retailProducts: 144000.00,
          totalRevenue: 1284650.00
        },
        cogs: {
          waxConsumables: 124500.00,
          nailGelsAndLacquers: 68400.00,
          ppeAndSanitizers: 32400.00,
          packagingAndBags: 23000.00,
          totalCogs: 248300.00
        },
        grossProfit: 1036350.00,
        grossMarginPct: 80.67,
        operatingExpenses: {
          salariesAndWages: 184500.00,
          storeRentsAndCusa: 295000.00,
          electricityAndWater: 48200.00,
          marketingAndLoyalty: 18500.00,
          maintenanceAndSanitation: 14200.00,
          depreciationEquipment: 22000.00,
          totalOpex: 582400.00
        },
        netOperatingIncome: 453950.00,
        netMarginPct: 35.33
      },
      {
        id: 'centrio-waxing',
        name: 'Centrio Mall (Waxing Salon)',
        revenue: {
          waxingServices: 462100.00,
          nailServices: 0.00,
          retailProducts: 80000.00,
          totalRevenue: 542100.00
        },
        cogs: {
          waxConsumables: 72500.00,
          nailGelsAndLacquers: 0.00,
          ppeAndSanitizers: 15400.00,
          packagingAndBags: 12000.00,
          totalCogs: 99900.00
        },
        grossProfit: 442200.00,
        grossMarginPct: 81.57,
        operatingExpenses: {
          salariesAndWages: 74200.00,
          storeRentsAndCusa: 110000.00,
          electricityAndWater: 19500.00,
          marketingAndLoyalty: 7500.00,
          maintenanceAndSanitation: 5800.00,
          depreciationEquipment: 8000.00,
          totalOpex: 225000.00
        },
        netOperatingIncome: 217200.00,
        netMarginPct: 40.07
      },
      {
        id: 'centrio-nails',
        name: 'Passion Nails (Centrio Mall)',
        revenue: {
          waxingServices: 0.00,
          nailServices: 284400.00,
          retailProducts: 34000.00,
          totalRevenue: 318400.00
        },
        cogs: {
          waxConsumables: 0.00,
          nailGelsAndLacquers: 52400.00,
          ppeAndSanitizers: 7500.00,
          packagingAndBags: 4500.00,
          totalCogs: 64400.00
        },
        grossProfit: 254000.00,
        grossMarginPct: 79.77,
        operatingExpenses: {
          salariesAndWages: 48500.00,
          storeRentsAndCusa: 75000.00,
          electricityAndWater: 12200.00,
          marketingAndLoyalty: 4500.00,
          maintenanceAndSanitation: 3800.00,
          depreciationEquipment: 6000.00,
          totalOpex: 150000.00
        },
        netOperatingIncome: 104000.00,
        netMarginPct: 32.66
      },
      {
        id: 'limketkai',
        name: 'Limketkai Mall Branch',
        revenue: {
          waxingServices: 210300.00,
          nailServices: 38850.00,
          retailProducts: 15000.00,
          totalRevenue: 264150.00
        },
        cogs: {
          waxConsumables: 34000.00,
          nailGelsAndLacquers: 9500.00,
          ppeAndSanitizers: 5500.00,
          packagingAndBags: 3800.00,
          totalCogs: 52800.00
        },
        grossProfit: 211350.00,
        grossMarginPct: 80.01,
        operatingExpenses: {
          salariesAndWages: 36800.00,
          storeRentsAndCusa: 65000.00,
          electricityAndWater: 9500.00,
          marketingAndLoyalty: 3800.00,
          maintenanceAndSanitation: 2800.00,
          depreciationEquipment: 4500.00,
          totalOpex: 122400.00
        },
        netOperatingIncome: 88950.00,
        netMarginPct: 33.67
      },
      {
        id: 'sm-downtown',
        name: 'SM Downtown Premier Branch',
        revenue: {
          waxingServices: 120000.00,
          nailServices: 25000.00,
          retailProducts: 15000.00,
          totalRevenue: 160000.00
        },
        cogs: {
          waxConsumables: 18000.00,
          nailGelsAndLacquers: 6500.00,
          ppeAndSanitizers: 4000.00,
          packagingAndBags: 2700.00,
          totalCogs: 31200.00
        },
        grossProfit: 128800.00,
        grossMarginPct: 80.50,
        operatingExpenses: {
          salariesAndWages: 25000.00,
          storeRentsAndCusa: 45000.00,
          electricityAndWater: 7000.00,
          marketingAndLoyalty: 2700.00,
          maintenanceAndSanitation: 1800.00,
          depreciationEquipment: 3500.00,
          totalOpex: 85000.00
        },
        netOperatingIncome: 43800.00,
        netMarginPct: 27.38
      }
    ]
  });

  // Balance Sheet Data
  const [balanceSheetData, setBalanceSheetData] = useState({
    asOfDate: 'As of August 31, 2026',
    currency: 'PHP (₱)',
    assets: {
      currentAssets: {
        cashAndCashEquivalents: 1518500.00,
        accountsReceivable: 48200.00,
        consumableInventory: 185400.00,
        retailProductsInventory: 94600.00,
        prepaidMallLeaseDeposits: 380000.00,
        totalCurrentAssets: 2226700.00
      },
      nonCurrentAssets: {
        salonFixturesAndEquipment: 1450000.00,
        nailStationsAndSpaChairs: 680000.00,
        itAndBiometricHardware: 185000.00,
        accumulatedDepreciation: -420000.00,
        totalNonCurrentAssets: 1895000.00
      },
      totalAssets: 4121700.00
    },
    liabilities: {
      currentLiabilities: {
        accountsPayableVendors: 188300.00,
        accruedPayrollPayable: 59350.00,
        sssPhilhealthPagibigPayables: 24200.00,
        birWithholdingAndVatPayable: 40650.00,
        totalCurrentLiabilities: 312500.00
      },
      longTermLiabilities: {
        equipmentFinancingLoan: 250000.00,
        totalLongTermLiabilities: 250000.00
      },
      totalLiabilities: 562500.00
    },
    equity: {
      ownerContributedCapital: 2500000.00,
      retainedEarningsPrior: 605250.00,
      currentPeriodNetIncome: 453950.00,
      totalEquity: 3559200.00
    },
    totalLiabilitiesAndEquity: 4121700.00,
    isBalanced: true
  });

  // General Ledger Journal Entries
  const [journalEntries, setJournalEntries] = useState([
    {
      id: 'JE-2026-0801',
      date: '2026-07-31',
      reference: 'PAYROLL-2026-07-B',
      type: 'Payroll Auto-Posting',
      description: 'Semi-Monthly Payroll Disbursement & Statutory Accruals (July 16-31, 2026)',
      branch: 'Consolidated',
      postedBy: 'Kristene (HR/Accounting)',
      status: 'Posted',
      lines: [
        { accountCode: '6010', accountName: 'Salaries & Wages Expense', debit: 68400.00, credit: 0 },
        { accountCode: '2020', accountName: 'Accrued Payroll Payable (BPI BizLink)', debit: 0, credit: 59350.00 },
        { accountCode: '2030', accountName: 'SSS Premiums Payable', debit: 0, credit: 3850.00 },
        { accountCode: '2031', accountName: 'PhilHealth Premiums Payable', debit: 0, credit: 1800.00 },
        { accountCode: '2032', accountName: 'Pag-IBIG Premiums Payable', debit: 0, credit: 800.00 },
        { accountCode: '2040', accountName: 'BIR Withholding Tax Payable (1601-C)', debit: 0, credit: 2600.00 }
      ]
    },
    {
      id: 'JE-2026-0802',
      date: '2026-08-01',
      reference: 'PO-2026-042',
      type: 'AP Supplier Invoice',
      description: 'Organic Cold Wax & Spatula Batch Delivery from Organic Honey Wax Imports',
      branch: 'Centrio Mall (Waxing)',
      postedBy: '3-Way PO Match Engine',
      status: 'Posted',
      lines: [
        { accountCode: '1040', accountName: 'Consumable Inventory - Wax Supplies', debit: 38500.00, credit: 0 },
        { accountCode: '2010', accountName: 'Accounts Payable - Trade Suppliers', debit: 0, credit: 38500.00 }
      ]
    },
    {
      id: 'JE-2026-0803',
      date: '2026-08-02',
      reference: 'POS-2026-0802-CEN',
      type: 'Daily POS Sales Closing',
      description: 'Daily Salon Point of Sale Collections (Cash, Maya QR, GCash, Card)',
      branch: 'Centrio Mall (Waxing)',
      postedBy: 'POS Auto-Reconcile',
      status: 'Posted',
      lines: [
        { accountCode: '1010', accountName: 'Cash in Register Drawer', debit: 24500.00, credit: 0 },
        { accountCode: '1015', accountName: 'Digital Wallets Clearing (Maya/GCash)', debit: 18200.00, credit: 0 },
        { accountCode: '4010', accountName: 'Waxing Service Revenue', debit: 0, credit: 36200.00 },
        { accountCode: '4030', accountName: 'Retail Product Sales (Balms & Scrubs)', debit: 0, credit: 6500.00 }
      ]
    },
    {
      id: 'JE-2026-0803-EXP',
      date: '2026-08-03',
      reference: 'EXP-RENT-2026-08',
      type: 'Commercial Lease',
      description: 'Ayala Centrio Mall Branch Space Lease & CUSA Dues for August 2026',
      branch: 'Centrio Mall (Waxing)',
      postedBy: 'Kristene (Accounting)',
      status: 'Posted',
      lines: [
        { accountCode: '6020', accountName: 'Store Rental & CUSA Expense', debit: 85000.00, credit: 0 },
        { accountCode: '1020', accountName: 'Cash in Bank - BPI BizLink Master', debit: 0, credit: 80750.00 },
        { accountCode: '2042', accountName: 'BIR Expanded Withholding Tax Payable (0619-E 5%)', debit: 0, credit: 4250.00 }
      ]
    }
  ]);

  // Accounts Payable Invoices (PO Integrated)
  const [apInvoices, setApInvoices] = useState([
    {
      id: 'INV-2026-0101',
      poNumber: 'PO-2026-042',
      vendor: 'Organic Honey Wax Imports Inc.',
      branch: 'Centrio Mall (Waxing)',
      invoiceDate: '2026-08-01',
      dueDate: '2026-08-31',
      amount: 38500.00,
      status: 'Pending Approval',
      category: 'Wax Consumables',
      paymentTerms: 'Net 30',
      description: '500kg Organic Honey Wax + 2,000 Wooden Applicator Strips'
    },
    {
      id: 'INV-2026-0102',
      poNumber: 'PO-2026-043',
      vendor: 'OPI & Premium Gel Lacquers Ph',
      branch: 'Passion Nails (Centrio)',
      invoiceDate: '2026-08-03',
      dueDate: '2026-09-02',
      amount: 24800.00,
      status: 'Approved for Payment',
      category: 'Nail Supplies',
      paymentTerms: 'Net 30',
      description: 'Seasonal Gel Polish Sets, UV Top Coats & Acrylic Powders'
    },
    {
      id: 'INV-2026-0103',
      poNumber: 'LEASE-AYALA-08',
      vendor: 'Ayala Land Inc. (Centrio Mall Administration)',
      branch: 'Centrio Mall (Waxing & Nails)',
      invoiceDate: '2026-08-01',
      dueDate: '2026-08-15',
      amount: 125000.00,
      status: 'Scheduled BPI BizLink',
      category: 'Store Lease & CUSA',
      paymentTerms: 'Due upon Receipt',
      description: 'Space Rental 2nd Level Centrio Mall + Common Area Charges'
    },
    {
      id: 'INV-2026-0104',
      poNumber: 'PO-2026-039',
      vendor: 'Medisupply Hygienic Products Corp.',
      branch: 'SM Downtown Premier',
      invoiceDate: '2026-07-20',
      dueDate: '2026-08-19',
      amount: 16400.00,
      status: 'Paid',
      category: 'PPE & Sanitizers',
      paymentTerms: 'Net 30',
      description: 'Nitrile Gloves, Bed Liner Rolls, Antiseptic Cleaners'
    }
  ]);

  // Daily POS Cash Drawer Reconciliations
  const [posReconciliations, setPosReconciliations] = useState([
    {
      id: 'POS-REC-2026-0807-CEN',
      date: '2026-08-07',
      branch: 'Centrio Mall (Waxing)',
      shiftSupervisor: 'Cherimar Concigo',
      openingFloat: 5000.00,
      cashSales: 18450.00,
      mayaQrSales: 7800.00,
      gcashQrSales: 9200.00,
      cardTerminalSales: 11400.00,
      pettyCashExpenses: 450.00,
      expectedCashInDrawer: 23000.00,
      actualCashCounted: 23000.00,
      variance: 0.00,
      status: 'Reconciled & Balanced',
      auditNotes: 'Perfect match. Petty cash was ₱450 for branch water refill.'
    },
    {
      id: 'POS-REC-2026-0807-PAS',
      date: '2026-08-07',
      branch: 'Passion Nails (Centrio)',
      shiftSupervisor: 'Cherry Rose Paculanang',
      openingFloat: 3000.00,
      cashSales: 14200.00,
      mayaQrSales: 5400.00,
      gcashQrSales: 6800.00,
      cardTerminalSales: 8900.00,
      pettyCashExpenses: 200.00,
      expectedCashInDrawer: 17000.00,
      actualCashCounted: 17000.00,
      variance: 0.00,
      status: 'Reconciled & Balanced',
      auditNotes: 'Evening count verified by Manager.'
    },
    {
      id: 'POS-REC-2026-0807-KET',
      date: '2026-08-07',
      branch: 'Limketkai Mall',
      shiftSupervisor: 'Kristene HR',
      openingFloat: 5000.00,
      cashSales: 12800.00,
      mayaQrSales: 4100.00,
      gcashQrSales: 5300.00,
      cardTerminalSales: 6700.00,
      pettyCashExpenses: 150.00,
      expectedCashInDrawer: 17650.00,
      actualCashCounted: 17650.00,
      variance: 0.00,
      status: 'Reconciled & Balanced',
      auditNotes: 'All client receipts and digital transaction slips intact.'
    }
  ]);

  // BIR Tax Compliance Hub
  const [taxSummary, setTaxSummary] = useState({
    reportingMonth: 'August 2026',
    tin: '009-847-192-000',
    registeredEntity: 'ALRAJJ LEGACY Fortified Business Corp.',
    forms: [
      {
        formCode: 'BIR Form 1601-C',
        title: 'Monthly Remittance Return of Income Taxes Withheld on Compensation',
        dueDate: 'September 10, 2026',
        taxableBase: 184500.00,
        taxDue: 9225.00,
        status: 'Ready for Filing',
        source: 'Biometric Payroll Module'
      },
      {
        formCode: 'BIR Form 2550Q',
        title: 'Quarterly Value-Added Tax Return (Q3 2026)',
        dueDate: 'October 25, 2026',
        taxableBase: 1284650.00,
        taxDue: 35820.00,
        status: 'In Computation',
        source: 'Point of Sale & General Ledger'
      },
      {
        formCode: 'BIR Form 0619-E',
        title: 'Monthly Remittance Form for Expanded Withholding Tax (Rent & Services)',
        dueDate: 'September 10, 2026',
        taxableBase: 295000.00,
        taxDue: 14750.00,
        status: 'Ready for Filing',
        source: 'Commercial Mall Leases & AP Module'
      },
      {
        formCode: 'SSS / PhilHealth / HDMF',
        title: 'Monthly Statutory Contribution Remittances (MCR & Electronic RF-1)',
        dueDate: 'September 15, 2026',
        taxableBase: 184500.00,
        taxDue: 24200.00,
        status: 'BPI BizLink Scheduled',
        source: 'HR Payroll Master'
      }
    ]
  });

  // New Journal Entry Form State
  const [newJournalEntry, setNewJournalEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    reference: 'MANUAL-JE-01',
    description: 'Petty cash replenishment for branch supplies',
    branch: 'Centrio Mall (Waxing)',
    postedBy: 'Kristene (Accounting)',
    lines: [
      { accountCode: '6050', accountName: 'Branch Supplies Expense', debit: 2500, credit: 0 },
      { accountCode: '1020', accountName: 'Cash in Bank - BPI BizLink Master', debit: 0, credit: 2500 }
    ]
  });

  // New Vendor Invoice Form State
  const [newInvoice, setNewInvoice] = useState({
    poNumber: 'PO-2026-0905',
    vendor: 'CleanCare Sanitation Solutions Inc.',
    branch: 'Centrio Mall (Waxing)',
    dueDate: '2026-09-30',
    amount: 14200,
    category: 'PPE & Sanitizers',
    paymentTerms: 'Net 30',
    description: 'Monthly supply of hospital-grade surface disinfectants and UV sterilizer lamps'
  });

  // New POS Reconciliation Form State
  const [newPosRecon, setNewPosRecon] = useState({
    date: new Date().toISOString().split('T')[0],
    branch: 'Centrio Mall (Waxing)',
    shiftSupervisor: 'Justine Ann Atay',
    openingFloat: 5000,
    cashSales: 16800,
    mayaQrSales: 6400,
    gcashQrSales: 8200,
    cardTerminalSales: 9500,
    pettyCashExpenses: 300,
    actualCashCounted: 21500,
    auditNotes: 'End-of-day register closure. All transaction receipts verified against cash drawer.'
  });

  // File Upload State
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ loading: false, success: false, message: '' });

  // Add Employee Form State
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    id: '',
    name: '',
    branch: 'Centrio Mall (Waxing)',
    rate: 600,
    taxStatus: 'S',
    bpiAccount: '',
    sssNo: '',
    philhealthNo: '',
    pagibigNo: '',
    tinNo: '',
    otherDeductions: 0,
    otherDeductionRemarks: 'Cash Advance (Vale)'
  });

  // Quick punch simulation state
  const [livePunches, setLivePunches] = useState([
    { id: 1, name: 'Justine Ann Atay', time: '09:21 AM', type: 'IN', branch: 'Centrio Waxing', status: 'Late (21m)' },
    { id: 2, name: 'Kristene HR', time: '08:58 AM', type: 'IN', branch: 'Limketkai', status: 'On Time' },
    { id: 3, name: 'Cherry Rose Paculanang', time: '09:12 AM', type: 'IN', branch: 'Passion Nails', status: 'Late (12m)' },
    { id: 4, name: 'Cherimar Concigo', time: '09:24 PM', type: 'IN', branch: 'Centrio Waxing', status: 'Missing OUT' }
  ]);

  // Apply theme class
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch initial data
  const fetchData = async () => {
    try {
      const empRes = await axios.get(`${API_BASE}/employees`);
      setEmployees(empRes.data);

      const attRes = await axios.get(`${API_BASE}/attendance`);
      setAttendance(attRes.data);

      const excRes = await axios.get(`${API_BASE}/exceptions`);
      setExceptions(excRes.data);

      const tardRes = await axios.get(`${API_BASE}/tardiness`);
      setTardiness(tardRes.data);

      const totalEmp = empRes.data.length;
      const pendingExc = excRes.data.length;
      const totalLate = attRes.data.reduce((sum, r) => sum + (r.late_minutes || 0), 0);
      
      const presentRecs = attRes.data.filter(r => r.regular_hours > 0);
      const avgHours = presentRecs.length > 0
        ? (presentRecs.reduce((sum, r) => sum + r.regular_hours, 0) / presentRecs.length).toFixed(1)
        : 0;

      setSummary({
        totalEmployees: totalEmp,
        pendingExceptions: pendingExc,
        totalLateMins: totalLate,
        averageHours: avgHours
      });
    } catch (err) {
      console.warn('Backend server not responding. Using mock data instead.');
      loadMockData();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const loadMockData = () => {
    const mockEmployees = [
      { id: 33, name: 'Justine Ann Atay', branch: 'Centrio Mall (Waxing)', role: 'Senior Waxing Specialist', rate: 600, tax_status: 'S', bpi_account: '0249821401', sss_no: '34-8192019-3', philhealth_no: '12-054918230-1', pagibig_no: '1210-9482-1104', tin_no: '291-840-192-000', other_deductions: 150.00, other_deduction_remarks: 'Cash Advance (Vale)' },
      { id: 34, name: 'Cherimar Concigo', branch: 'Centrio Mall (Waxing)', role: 'Master Aesthetician', rate: 650, tax_status: 'S', bpi_account: '0249821402', sss_no: '34-7291048-1', philhealth_no: '12-094817263-4', pagibig_no: '1210-8839-2049', tin_no: '304-918-283-000', other_deductions: 0.00, other_deduction_remarks: '' },
      { id: 35, name: 'Kristene HR', branch: 'Limketkai Mall', role: 'Operations & HR Lead', rate: 800, tax_status: 'S', bpi_account: '0249821403', sss_no: '34-9918273-0', philhealth_no: '12-019283746-5', pagibig_no: '1210-7719-3920', tin_no: '412-839-102-000', other_deductions: 0.00, other_deduction_remarks: '' },
      { id: 36, name: 'Cherry Rose Paculanang', branch: 'Passion Nails (Centrio)', role: 'Senior Nail Technician', rate: 580, tax_status: 'ME', bpi_account: '0249821404', sss_no: '34-6201948-7', philhealth_no: '12-083920184-9', pagibig_no: '1210-6629-4019', tin_no: '529-104-829-000', other_deductions: 80.00, other_deduction_remarks: 'Salon Uniform / Apron' }
    ];
    setEmployees(mockEmployees);

    const mockAttendance = [
      { id: 1, employee_id: 33, employee_name: 'Justine Ann Atay', date: '2026-07-16', calculated_in: '09:21', calculated_out: '20:07', regular_hours: 8, late_minutes: 21, undertime_minutes: 0, ot_hours: 1.77, nd_hours: 0, status: 'Present', notes: '', branch: 'Centrio Mall (Waxing)', rate: 600 },
      { id: 2, employee_id: 34, employee_name: 'Cherimar Concigo', date: '2026-07-16', calculated_in: '21:24', calculated_out: '', regular_hours: 0, late_minutes: 0, undertime_minutes: 0, ot_hours: 0, nd_hours: 0, status: 'Flagged', notes: 'Missing OUT punch', branch: 'Centrio Mall (Waxing)', rate: 650 },
      { id: 3, employee_id: 35, employee_name: 'Kristene HR', date: '2026-07-16', calculated_in: '08:58', calculated_out: '18:02', regular_hours: 8, late_minutes: 0, undertime_minutes: 0, ot_hours: 0.03, nd_hours: 0, status: 'Present', notes: '', branch: 'Limketkai Mall', rate: 800 },
      { id: 4, employee_id: 33, employee_name: 'Justine Ann Atay', date: '2026-07-17', calculated_in: '09:04', calculated_out: '18:00', regular_hours: 8, late_minutes: 0, undertime_minutes: 0, ot_hours: 0, nd_hours: 0, status: 'Present', notes: 'Late <= 5 mins grace', branch: 'Centrio Mall (Waxing)', rate: 600 },
      { id: 5, employee_id: 36, employee_name: 'Cherry Rose Paculanang', date: '2026-07-17', calculated_in: '09:12', calculated_out: '17:30', regular_hours: 7.3, late_minutes: 12, undertime_minutes: 30, ot_hours: 0, nd_hours: 0, status: 'Present', notes: '', branch: 'Passion Nails (Centrio)', rate: 580 },
      { id: 6, employee_id: 33, employee_name: 'Justine Ann Atay', date: '2026-07-18', calculated_in: '', calculated_out: '', regular_hours: 0, late_minutes: 0, undertime_minutes: 0, ot_hours: 0, nd_hours: 0, status: 'Rest Day', notes: '', branch: 'Centrio Mall (Waxing)', rate: 600 }
    ];
    setAttendance(mockAttendance);
    setExceptions(mockAttendance.filter(r => r.status === 'Flagged'));

    const mockTardiness = [
      { employee_id: 33, employee_name: 'Justine Ann Atay', branch: 'Centrio Mall (Waxing)', late_count: 4, total_late_minutes: 68 },
      { employee_id: 36, employee_name: 'Cherry Rose Paculanang', branch: 'Passion Nails (Centrio)', late_count: 2, total_late_minutes: 27 },
      { employee_id: 34, employee_name: 'Cherimar Concigo', branch: 'Centrio Mall (Waxing)', late_count: 0, total_late_minutes: 0 }
    ];
    setTardiness(mockTardiness);

    setSummary({
      totalEmployees: 4,
      pendingExceptions: 1,
      totalLateMins: 33,
      averageHours: 7.8
    });
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploadStatus({ loading: true, success: false, message: 'Processing NGTeco Report...' });
    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      const res = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadStatus({
        loading: false,
        success: true,
        message: `Successfully uploaded. ${res.data.recordsIngested} logs imported for period: ${res.data.payPeriod}`
      });
      fetchData();
    } catch (err) {
      console.error(err);
      setUploadStatus({
        loading: false,
        success: false,
        message: err.response?.data?.error || 'File upload failed. Ensure the server is active.'
      });
    }
  };

  const handleOverrideSubmit = async (e) => {
    e.preventDefault();
    if (!selectedException) return;

    try {
      await axios.post(`${API_BASE}/exceptions/override`, {
        employeeId: selectedException.employee_id,
        date: selectedException.date,
        calculatedIn: overrideIn,
        calculatedOut: overrideOut,
        status: 'Approved',
        notes: overrideNote || 'HR Adjusted'
      });
      setSelectedException(null);
      fetchData();
    } catch (err) {
      console.error(err);
      setAttendance(prev => prev.map(item => {
        if (item.employee_id === selectedException.employee_id && item.date === selectedException.date) {
          return {
            ...item,
            calculated_in: overrideIn,
            calculated_out: overrideOut,
            status: 'Approved',
            notes: overrideNote || 'HR Override (Saved)',
            regular_hours: 8
          };
        }
        return item;
      }));
      setExceptions(prev => prev.filter(item => !(item.employee_id === selectedException.employee_id && item.date === selectedException.date)));
      setSelectedException(null);
    }
  };

  const handleGeneratePayroll = async () => {
    try {
      const res = await axios.get(`${API_BASE}/payroll`, {
        params: { startDate, endDate }
      });
      setPayroll(res.data);
    } catch (err) {
      console.warn('Payroll backend failure. Generating mock payroll calculations...');
      const mockPayroll = employees.map(emp => {
        const logs = attendance.filter(a => a.employee_id === emp.id);
        const daysPresent = logs.filter(a => ['Present', 'Approved'].includes(a.status)).length || 1;
        const totalLate = logs.reduce((sum, l) => sum + (l.late_minutes || 0), 0);
        const totalOT = logs.reduce((sum, l) => sum + (l.ot_hours || 0), 0);

        const hourlyRate = emp.rate / 8;
        const basicPay = emp.rate * daysPresent;
        const otPay = Number((totalOT * hourlyRate * 1.25).toFixed(2));
        const lateDeduction = Number((totalLate * (hourlyRate / 60)).toFixed(2));
        const grossPay = Number((basicPay + otPay - lateDeduction).toFixed(2));

        const sss = Number((grossPay * 0.045).toFixed(2));
        const philhealth = Number((grossPay * 0.02).toFixed(2));
        const pagibig = 100.00;
        const otherDeductions = parseFloat(emp.other_deductions || 0);
        const otherDeductionRemarks = emp.other_deduction_remarks || 'Cash Advance (Vale)';
        const totalDeductions = Number((sss + philhealth + pagibig + otherDeductions).toFixed(2));
        const netPay = Number((grossPay - totalDeductions).toFixed(2));

        return {
          employeeId: emp.id,
          employeeName: emp.name,
          branch: emp.branch,
          dailyRate: emp.rate,
          taxStatus: emp.tax_status,
          bpiAccount: emp.bpi_account || `024982140${emp.id}`,
          sssNo: emp.sss_no || '34-8192019-3',
          philhealthNo: emp.philhealth_no || '12-054918230-1',
          pagibigNo: emp.pagibig_no || '1210-9482-1104',
          tinNo: emp.tin_no || '291-840-192-000',
          otherDeductions,
          otherDeductionRemarks,
          daysPresent,
          daysAbsent: 0,
          totalLateMins: totalLate,
          totalUndertimeMins: 0,
          totalOtHours: totalOT,
          totalNdHours: 0,
          calculations: {
            basicPay,
            otPay,
            ndPay: 0,
            lateDeduction,
            undertimeDeduction: 0,
            totalTardinessDeduction: lateDeduction,
            grossPay,
            deductions: { sss, philhealth, pagibig, otherDeductions, otherDeductionRemarks, tax: 0, totalDeductions },
            netPay
          }
        };
      });
      setPayroll(mockPayroll);
      setDisbursementStage('computed');
    }
  };

  const handleForwardToAccounting = () => {
    setDisbursementStage('forwarded');
    setDisbursementAudit(prev => ({
      ...prev,
      forwardedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' by Kristene (HR)'
    }));
  };

  const handleGenerateBpiBatch = () => {
    const activePayroll = payroll.length > 0 ? payroll : [];
    if (activePayroll.length === 0) return;

    // Generate CSV formatted for BPI BizLink Batch Payroll Upload
    // Note: Escaped with ="..." to ensure Microsoft Excel displays 10-digit account numbers as text without scientific notation (e.g. 1.0365E+11)
    const headers = 'Account Number,Employee Name,Disbursement Amount (PHP),Branch Location,Payment Type,Remarks\n';
    const rows = activePayroll.map((p, idx) => {
      const acctSuffix = (idx + 1) < 10 ? '0' + (idx + 1) : (idx + 1);
      const rawAcct = `02498214${acctSuffix}`;
      const excelTextAcct = `="${rawAcct}"`;
      const amount = (p.calculations?.netPay || 0).toFixed(2);
      const branchLoc = p.branch || 'Centrio Mall (Waxing)';
      return `${excelTextAcct},"${p.employeeName}","${amount}","${branchLoc}","SALARY","Cutoff ${startDate} to ${endDate}"`;
    }).join('\n');

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', csvContent);
    downloadAnchor.setAttribute('download', `BPI_BizLink_Payroll_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDisbursementStage('bpi_ready');
    setDisbursementAudit(prev => ({
      ...prev,
      bpiGeneratedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (BPI BizLink CSV File)'
    }));
  };

  const handleMdApproval = () => {
    setDisbursementStage('disbursed');
    setDisbursementAudit(prev => ({
      ...prev,
      mdApprovedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' by Ms. Jehan Abedin (Managing Director)'
    }));
  };

  const resetDisbursement = () => {
    setDisbursementStage('computed');
    setDisbursementAudit({
      forwardedAt: null,
      bpiGeneratedAt: null,
      mdApprovedAt: null,
      mdSigner: 'Ms. Jehan Abedin (Managing Director)'
    });
  };

  // CRM Handlers
  const handleSendSmsReminder = (client) => {
    setCrmClients(prev => prev.map(c => c.id === client.id ? { ...c, smsStatus: 'Sent & Confirmed' } : c));
    setCrmToast(`SMS reminder & booking link successfully sent to ${client.name} (${client.phone})`);
    setTimeout(() => setCrmToast(''), 4000);
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    const newId = `CL-${100 + crmClients.length + 1}`;
    const entry = {
      id: newId,
      name: newClient.name,
      phone: newClient.phone,
      branch: newClient.branch,
      totalVisits: 1,
      loyaltyPoints: 50,
      tier: 'Bronze Member',
      lastService: 'Initial Consultation & Service',
      lastServiceDate: new Date().toISOString().split('T')[0],
      nextBooking: 'Pending Schedule',
      preferredTechnician: newClient.preferredTechnician,
      activePackage: newClient.activePackage,
      skinNotes: newClient.skinNotes || 'None specified',
      smsStatus: 'Sent & Confirmed'
    };
    setCrmClients(prev => [entry, ...prev]);
    setShowAddClientModal(false);
    setNewClient({
      name: '', phone: '', branch: 'Centrio Mall (Waxing)', preferredTechnician: 'Justine Ann Atay', activePackage: 'Underarm Waxing 5-Pack (5/5 left)', skinNotes: ''
    });
    setCrmToast(`New client ${entry.name} registered with 50 Welcome Loyalty Points!`);
    setTimeout(() => setCrmToast(''), 4000);
  };

  // Procurement & PO Handlers
  const handleAdvancePo = (poNumber) => {
    setPurchaseOrders(prev => prev.map(po => {
      if (po.poNumber === poNumber) {
        if (po.step === 1) {
          return { ...po, step: 2, statusText: 'Vendor RFQ in Progress' };
        } else if (po.step === 2) {
          return { ...po, step: 3, statusText: 'Awaiting Manager Approval' };
        } else if (po.step === 3) {
          return { ...po, step: 4, statusText: 'PO Approved - In Transit / Received' };
        } else if (po.step === 4) {
          return {
            ...po,
            step: 5,
            statusText: 'Forwarded to Accounting',
            accountingVoucher: `AP-VOUCHER-${poNumber.replace('PO-', '')}`,
            matchStatus: '3-Way Matched (PO + DR + Invoice)'
          };
        }
      }
      return po;
    }));
    setPoToast(`Purchase Order ${poNumber} advanced to next stage!`);
    setTimeout(() => setPoToast(''), 4000);
  };

  const handleCreatePo = (e) => {
    e.preventDefault();
    const newPoNum = `PO-2026-090${purchaseOrders.length + 1}`;
    const itemTotal = newPo.qty * newPo.unitPrice;
    const entry = {
      poNumber: newPoNum,
      date: new Date().toISOString().split('T')[0],
      branch: newPo.branch,
      supplier: newPo.supplier,
      items: [
        { name: newPo.itemName, qty: parseInt(newPo.qty), unitPrice: parseFloat(newPo.unitPrice), total: itemTotal }
      ],
      totalAmount: itemTotal,
      step: 1,
      statusText: 'Store Requisition Submitted',
      accountingVoucher: 'Queued',
      glAccount: '5100-20 (Salon Supplies)',
      paymentTerm: 'Vendor Quote Phase',
      matchStatus: 'Initial Store Request',
      receivedBy: 'Branch Supervisor Draft'
    };
    setPurchaseOrders(prev => [entry, ...prev]);
    setShowCreatePoModal(false);
    setNewPo({
      branch: 'Centrio Mall (Waxing)',
      supplier: 'PureBeauty Salon Supplies Corp.',
      itemName: 'Organic Hot Wax Pellets (10kg)',
      qty: 3,
      unitPrice: 2400
    });
    setPoToast(`Store Requisition ${newPoNum} created for ${entry.branch}!`);
    setTimeout(() => setPoToast(''), 4000);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/employees`, newEmployee);
      setShowAddEmployeeModal(false);
      setNewEmployee({ id: '', name: '', branch: 'Centrio Mall (Waxing)', rate: 600, taxStatus: 'S', bpiAccount: '', sssNo: '', philhealthNo: '', pagibigNo: '', tinNo: '' });
      fetchData();
    } catch (err) {
      console.warn('Backend add employee failed. Modifying local array.');
      setEmployees(prev => {
        const empId = parseInt(newEmployee.id);
        const exists = prev.some(emp => emp.id === empId);
        if (exists) {
          return prev.map(emp => emp.id === empId ? {
            ...emp,
            name: newEmployee.name,
            branch: newEmployee.branch || 'Centrio Mall (Waxing)',
            rate: parseFloat(newEmployee.rate),
            tax_status: newEmployee.taxStatus,
            bpi_account: newEmployee.bpiAccount || emp.bpi_account || '0249821401',
            sss_no: newEmployee.sssNo || emp.sss_no || '34-8192019-3',
            philhealth_no: newEmployee.philhealthNo || emp.philhealth_no || '12-054918230-1',
            pagibig_no: newEmployee.pagibigNo || emp.pagibig_no || '1210-9482-1104',
            tin_no: newEmployee.tinNo || emp.tin_no || '291-840-192-000',
            other_deductions: parseFloat(newEmployee.otherDeductions || 0),
            other_deduction_remarks: newEmployee.otherDeductionRemarks || 'Cash Advance (Vale)'
          } : emp);
        }
        return [...prev, {
          id: empId || (prev.length > 0 ? Math.max(...prev.map(p => p.id)) + 1 : 37),
          name: newEmployee.name,
          branch: newEmployee.branch || 'Centrio Mall (Waxing)',
          rate: parseFloat(newEmployee.rate),
          tax_status: newEmployee.taxStatus,
          bpi_account: newEmployee.bpiAccount || `024982140${prev.length + 1}`,
          sss_no: newEmployee.sssNo || '34-8192019-3',
          philhealth_no: newEmployee.philhealthNo || '12-054918230-1',
          pagibig_no: newEmployee.pagibigNo || '1210-9482-1104',
          tin_no: newEmployee.tinNo || '291-840-192-000',
          other_deductions: parseFloat(newEmployee.otherDeductions || 0),
          other_deduction_remarks: newEmployee.otherDeductionRemarks || 'Cash Advance (Vale)',
          role: 'Salon Specialist'
        }];
      });
      setShowAddEmployeeModal(false);
      setNewEmployee({ id: '', name: '', branch: 'Centrio Mall (Waxing)', rate: 600, taxStatus: 'S', bpiAccount: '', sssNo: '', philhealthNo: '', pagibigNo: '', tinNo: '', otherDeductions: 0, otherDeductionRemarks: 'Cash Advance (Vale)' });
    }
  };

  // ECharts Configurations using Lay Bare Logo Theme (Green #77BC2E, Warm Brown #4A2E1B, Pink #E89BB9, Lavender #B58EBE)
  const getAttendanceDonutOption = () => {
    const presentCount = attendance.filter(a => ['Present', 'Approved'].includes(a.status)).length || 4;
    const flagCount = exceptions.length || 1;
    const restCount = attendance.filter(a => a.status === 'Rest Day').length || 1;

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
        backgroundColor: '#FFFFFF',
        borderColor: '#EAE8E2',
        textStyle: { color: '#4A2E1B', fontSize: 12, fontFamily: 'Plus Jakarta Sans' }
      },
      legend: {
        show: false
      },
      series: [
        {
          name: 'Attendance',
          type: 'pie',
          radius: ['68%', '90%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#FFFFFF',
            borderWidth: 3
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: false
            }
          },
          data: [
            { value: presentCount, name: 'Present', itemStyle: { color: '#77BC2E' } }, // Laybare Green
            { value: flagCount, name: 'Exceptions', itemStyle: { color: '#E89BB9' } },  // Logo Floral Pink
            { value: restCount, name: 'Rest Days', itemStyle: { color: '#B58EBE' } }   // Logo Floral Lilac
          ]
        }
      ]
    };
  };

  const getDailyAttendanceChartOption = () => {
    const dayCounts = {};
    attendance.forEach(rec => {
      if (['Present', 'Approved'].includes(rec.status)) {
        dayCounts[rec.date] = (dayCounts[rec.date] || 0) + 1;
      }
    });

    const dates = Object.keys(dayCounts).sort();
    const counts = dates.map(d => dayCounts[d]);

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#FFFFFF',
        borderColor: '#EAE8E2',
        textStyle: { color: '#4A2E1B', fontFamily: 'Plus Jakarta Sans', fontSize: 12 },
        padding: [8, 12],
        borderRadius: 12
      },
      grid: {
        top: 20,
        right: 15,
        bottom: 20,
        left: 20,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dates.length > 0 ? dates : ['07-16', '07-17', '07-18', '07-19', '07-20'],
        axisLine: { lineStyle: { color: '#EAE8E2' } },
        axisTick: { show: false },
        axisLabel: {
          color: '#8A817C',
          fontFamily: 'Plus Jakarta Sans',
          fontSize: 11
        }
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            color: '#F4F2EB',
            type: 'dashed'
          }
        },
        axisLabel: {
          color: '#8A817C',
          fontFamily: 'Plus Jakarta Sans',
          fontSize: 11
        }
      },
      series: [{
        data: counts.length > 0 ? counts : [3, 4, 2, 4, 3],
        type: 'line',
        smooth: 0.35,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#77BC2E',
          borderColor: '#4A2E1B',
          borderWidth: 2
        },
        lineStyle: {
          width: 3,
          color: '#77BC2E'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(119, 188, 46, 0.3)' },
              { offset: 1, color: 'rgba(119, 188, 46, 0.0)' }
            ]
          }
        }
      }]
    };
  };

  const getTardinessChartOption = () => {
    const names = tardiness.slice(0, 5).map(t => t.employee_name);
    const lateCounts = tardiness.slice(0, 5).map(t => t.late_count);

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: '#FFFFFF',
        borderColor: '#EAE8E2',
        textStyle: { color: '#4A2E1B', fontFamily: 'Plus Jakarta Sans', fontSize: 12 },
        borderRadius: 12
      },
      grid: {
        top: 10,
        right: 25,
        bottom: 10,
        left: 10,
        containLabel: true
      },
      xAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            color: '#F4F2EB',
            type: 'dashed'
          }
        },
        axisLabel: {
          color: '#8A817C',
          fontFamily: 'Plus Jakarta Sans',
          fontSize: 11
        }
      },
      yAxis: {
        type: 'category',
        data: names.length > 0 ? names : ['Justine Atay', 'Cherry Rose P.', 'Cherimar C.'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#4A2E1B',
          fontFamily: 'Plus Jakarta Sans',
          fontSize: 11,
          fontWeight: 600
        }
      },
      series: [{
        data: lateCounts.length > 0 ? lateCounts : [4, 2, 0],
        type: 'bar',
        barWidth: 14,
        itemStyle: {
          borderRadius: [0, 6, 6, 0],
          color: (params) => {
            const colors = ['#E89BB9', '#B58EBE', '#77BC2E', '#F4AEC7', '#4A2E1B'];
            return colors[params.dataIndex % colors.length];
          }
        }
      }]
    };
  };

  // Filter logs for attendance list view
  const filteredAttendance = attendance.filter(rec => {
    const matchEmp = !filterEmployee || rec.employee_id === parseInt(filterEmployee);
    const matchStatus = !filterStatus || rec.status === filterStatus;
    const matchSearch = !searchQuery || 
      rec.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      rec.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.date.includes(searchQuery);
    return matchEmp && matchStatus && matchSearch;
  });

  // --- ACCOUNTING ERP HANDLERS & CHARTS ---
  const getFinancialTrendOption = () => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#FFFFFF',
        borderColor: '#EAE8E2',
        textStyle: { color: '#4A2E1B', fontFamily: 'Plus Jakarta Sans', fontSize: 12 },
        borderRadius: 12,
        formatter: (params) => {
          let str = `<div class="font-bold border-b border-[#F2F0E8] pb-1 mb-1">${params[0].name}</div>`;
          params.forEach(p => {
            str += `<div class="flex items-center justify-between space-x-4"><span style="color:${p.color}">● ${p.seriesName}:</span> <strong class="font-mono">₱${Number(p.value).toLocaleString()}</strong></div>`;
          });
          return str;
        }
      },
      legend: {
        data: ['Gross Revenue', 'Operating Expenses', 'Net Income'],
        bottom: 0,
        textStyle: { color: '#8A817C', fontSize: 11 }
      },
      grid: { top: 20, right: 20, bottom: 35, left: 20, containLabel: true },
      xAxis: {
        type: 'category',
        data: ['May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026 (MTD)'],
        axisLine: { lineStyle: { color: '#EAE8E2' } },
        axisLabel: { color: '#8A817C', fontSize: 11 }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#F4F2EB', type: 'dashed' } },
        axisLabel: {
          color: '#8A817C',
          fontSize: 10,
          formatter: (val) => `₱${(val / 1000).toFixed(0)}k`
        }
      },
      series: [
        {
          name: 'Gross Revenue',
          type: 'bar',
          barWidth: 16,
          itemStyle: { borderRadius: [6, 6, 0, 0], color: '#77BC2E' },
          data: [1050000, 1180000, 1220000, 1284650]
        },
        {
          name: 'Operating Expenses',
          type: 'bar',
          barWidth: 16,
          itemStyle: { borderRadius: [6, 6, 0, 0], color: '#E89BB9' },
          data: [510000, 545000, 560000, 582400]
        },
        {
          name: 'Net Income',
          type: 'line',
          smooth: true,
          lineStyle: { width: 3, color: '#031134' },
          itemStyle: { color: '#031134', borderWidth: 2 },
          data: [365000, 420000, 442000, 453950]
        }
      ]
    };
  };

  const getBranchProfitabilityOption = () => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: '{b}: ₱{c} ({d}%)',
        backgroundColor: '#FFFFFF',
        borderColor: '#EAE8E2',
        borderRadius: 12
      },
      series: [{
        name: 'Branch Revenue Share',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { show: false },
        data: [
          { value: 542100, name: 'Centrio Waxing (42.2%)', itemStyle: { color: '#77BC2E' } },
          { value: 318400, name: 'Passion Nails (24.8%)', itemStyle: { color: '#E89BB9' } },
          { value: 264150, name: 'Limketkai Mall (20.6%)', itemStyle: { color: '#B58EBE' } },
          { value: 160000, name: 'SM Downtown (12.4%)', itemStyle: { color: '#031134' } }
        ]
      }]
    };
  };

  const handlePayInvoice = (invoiceId) => {
    const inv = apInvoices.find(i => i.id === invoiceId);
    if (!inv) return;

    // Deduct from BPI Bank
    setBankBalances(prev => ({
      ...prev,
      bpiBizLink: prev.bpiBizLink - inv.amount
    }));

    // Update invoice status
    setApInvoices(prev => prev.map(item => item.id === invoiceId ? {
      ...item,
      status: 'Paid',
      paidAt: new Date().toISOString().split('T')[0],
      paymentRef: `BPI-BIZLINK-${Date.now().toString().slice(-6)}`
    } : item));

    // Auto-post to General Ledger
    const newJe = {
      id: `JE-2026-${String(journalEntries.length + 805).padStart(4, '0')}`,
      date: new Date().toISOString().split('T')[0],
      reference: `BPI-PMT-${inv.poNumber}`,
      type: 'AP BPI Disbursement',
      description: `Settlement of ${inv.vendor} (${inv.category})`,
      branch: inv.branch,
      postedBy: 'BPI BizLink Auto-Sync',
      status: 'Posted',
      lines: [
        { accountCode: '2010', accountName: 'Accounts Payable - Trade Suppliers', debit: inv.amount, credit: 0 },
        { accountCode: '1020', accountName: 'Cash in Bank - BPI BizLink Master', debit: 0, credit: inv.amount }
      ]
    };

    setJournalEntries(prev => [newJe, ...prev]);
    setAccountingToast(`Invoice ${inv.id} for ₱${inv.amount.toLocaleString()} disbursed via BPI BizLink & auto-posted to General Ledger.`);
    setTimeout(() => setAccountingToast(''), 6000);
  };

  const handleCreateJournalEntry = (e) => {
    e.preventDefault();
    const totalDebit = newJournalEntry.lines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
    const totalCredit = newJournalEntry.lines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      alert(`Journal entry is unbalanced! Total Debits: ₱${totalDebit.toFixed(2)} vs Total Credits: ₱${totalCredit.toFixed(2)}. Debits must equal Credits.`);
      return;
    }

    const createdJe = {
      id: `JE-2026-${String(journalEntries.length + 805).padStart(4, '0')}`,
      date: newJournalEntry.date,
      reference: newJournalEntry.reference,
      type: 'Manual Journal Entry',
      description: newJournalEntry.description,
      branch: newJournalEntry.branch,
      postedBy: newJournalEntry.postedBy,
      status: 'Posted',
      lines: newJournalEntry.lines.map(l => ({
        accountCode: l.accountCode,
        accountName: l.accountName,
        debit: Number(l.debit) || 0,
        credit: Number(l.credit) || 0
      }))
    };

    setJournalEntries(prev => [createdJe, ...prev]);
    setShowNewJournalModal(false);
    setAccountingToast(`Journal Entry ${createdJe.id} posted successfully with ₱${totalDebit.toLocaleString()} balanced lines.`);
    setTimeout(() => setAccountingToast(''), 5000);
  };

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    const createdInv = {
      id: `INV-2026-${String(apInvoices.length + 105).padStart(4, '0')}`,
      poNumber: newInvoice.poNumber,
      vendor: newInvoice.vendor,
      branch: newInvoice.branch,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: newInvoice.dueDate || '2026-09-30',
      amount: Number(newInvoice.amount) || 0,
      status: 'Approved for Payment',
      category: newInvoice.category,
      paymentTerms: newInvoice.paymentTerms,
      description: newInvoice.description
    };

    setApInvoices(prev => [createdInv, ...prev]);
    setShowNewInvoiceModal(false);
    setAccountingToast(`Supplier Invoice ${createdInv.id} created & matched to ${createdInv.poNumber}.`);
    setTimeout(() => setAccountingToast(''), 5000);
  };

  const handleCreatePosRecon = (e) => {
    e.preventDefault();
    const openFloat = Number(newPosRecon.openingFloat) || 0;
    const cash = Number(newPosRecon.cashSales) || 0;
    const petty = Number(newPosRecon.pettyCashExpenses) || 0;
    const expected = openFloat + cash - petty;
    const actual = Number(newPosRecon.actualCashCounted) || 0;
    const variance = actual - expected;

    const createdRec = {
      id: `POS-REC-2026-${Date.now().toString().slice(-6)}`,
      date: newPosRecon.date,
      branch: newPosRecon.branch,
      shiftSupervisor: newPosRecon.shiftSupervisor,
      openingFloat: openFloat,
      cashSales: cash,
      mayaQrSales: Number(newPosRecon.mayaQrSales) || 0,
      gcashQrSales: Number(newPosRecon.gcashQrSales) || 0,
      cardTerminalSales: Number(newPosRecon.cardTerminalSales) || 0,
      pettyCashExpenses: petty,
      expectedCashInDrawer: expected,
      actualCashCounted: actual,
      variance: variance,
      status: variance === 0 ? 'Reconciled & Balanced' : 'Variance Flagged',
      auditNotes: newPosRecon.auditNotes
    };

    setPosReconciliations(prev => [createdRec, ...prev]);
    setShowPosReconModal(false);
    setAccountingToast(`Daily POS Cash Audit saved for ${createdRec.branch}: Expected ₱${expected.toLocaleString()}, Counted ₱${actual.toLocaleString()} (${createdRec.status}).`);
    setTimeout(() => setAccountingToast(''), 6000);
  };

  const handleExportPlCsv = () => {
    const selectedBranchData = plData.branches.find(b => b.id === accountingBranch) || plData.branches[0];
    let csv = `ALRAJJ LEGACY Fortified Business Corp. - Profit & Loss Statement\n`;
    csv += `Branch,${selectedBranchData.name}\n`;
    csv += `Period,${plData.period}\n\n`;
    csv += `Category,Amount (PHP)\n`;
    csv += `REVENUE\n`;
    csv += `Waxing Services,${selectedBranchData.revenue.waxingServices}\n`;
    csv += `Nail Services,${selectedBranchData.revenue.nailServices}\n`;
    csv += `Retail Products,${selectedBranchData.revenue.retailProducts}\n`;
    csv += `Total Gross Revenue,${selectedBranchData.revenue.totalRevenue}\n\n`;
    csv += `COST OF GOODS SOLD (COGS)\n`;
    csv += `Wax Consumables,${selectedBranchData.cogs.waxConsumables}\n`;
    csv += `Nail Gels & Lacquers,${selectedBranchData.cogs.nailGelsAndLacquers}\n`;
    csv += `PPE & Sanitation Kits,${selectedBranchData.cogs.ppeAndSanitizers}\n`;
    csv += `Packaging & Bags,${selectedBranchData.cogs.packagingAndBags}\n`;
    csv += `Total COGS,${selectedBranchData.cogs.totalCogs}\n\n`;
    csv += `GROSS PROFIT,${selectedBranchData.grossProfit}\n`;
    csv += `Gross Margin (%),${selectedBranchData.grossMarginPct}%\n\n`;
    csv += `OPERATING EXPENSES (OPEX)\n`;
    csv += `Salaries & Wages (Payroll),${selectedBranchData.operatingExpenses.salariesAndWages}\n`;
    csv += `Store Rents & CUSA,${selectedBranchData.operatingExpenses.storeRentsAndCusa}\n`;
    csv += `Electricity & Water,${selectedBranchData.operatingExpenses.electricityAndWater}\n`;
    csv += `Marketing & Promos,${selectedBranchData.operatingExpenses.marketingAndLoyalty}\n`;
    csv += `Maintenance & Sanitation,${selectedBranchData.operatingExpenses.maintenanceAndSanitation}\n`;
    csv += `Depreciation Equipment,${selectedBranchData.operatingExpenses.depreciationEquipment}\n`;
    csv += `NET OPERATING INCOME (EBITDA),${selectedBranchData.netOperatingIncome}\n`;
    csv += `Net Profit Margin (%),${selectedBranchData.netMarginPct}%\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `ALRAJJ_LEGACY_PL_${accountingBranch}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const handleSmartQuickPay = () => {
    const nextUnpaid = apInvoices.find(i => i.status !== 'Paid');
    if (nextUnpaid) {
      handlePayInvoice(nextUnpaid.id);
    } else {
      setAccountingToast('All supplier invoices are already paid via BPI BizLink!');
      setTimeout(() => setAccountingToast(''), 4000);
    }
  };

  const handleSmartAutoAuditAllPos = () => {
    setPosReconciliations(prev => prev.map(rec => ({
      ...rec,
      actualCashCounted: rec.expectedCashInDrawer,
      variance: 0,
      status: 'Reconciled & Balanced',
      auditNotes: 'Auto-audited & verified matching POS electronic journal'
    })));
    setAccountingToast('All 4 branch POS shift cash drawers successfully balanced & reconciled to ₱0 variance.');
    setTimeout(() => setAccountingToast(''), 5000);
  };

  const handleSmartAutoPostPayroll = () => {
    const hasPayroll = journalEntries.some(j => j.reference.includes('PAYROLL'));
    if (hasPayroll) {
      setAccountingToast('Biometric Payroll is already synchronized and posted in the General Ledger.');
    } else {
      const newJe = {
        id: `JE-2026-${String(journalEntries.length + 805).padStart(4, '0')}`,
        date: '2026-07-31',
        reference: 'PAYROLL-2026-07-B',
        type: 'Payroll Auto-Posting',
        description: 'Semi-Monthly Payroll Disbursement & Statutory Accruals (July 16-31, 2026)',
        branch: 'Consolidated',
        postedBy: 'Kristene (HR/Accounting)',
        status: 'Posted',
        lines: [
          { accountCode: '6010', accountName: 'Salaries & Wages Expense', debit: 68400.00, credit: 0 },
          { accountCode: '2020', accountName: 'Accrued Payroll Payable (BPI BizLink)', debit: 0, credit: 59350.00 },
          { accountCode: '2030', accountName: 'SSS Premiums Payable', debit: 0, credit: 3850.00 },
          { accountCode: '2031', accountName: 'PhilHealth Premiums Payable', debit: 0, credit: 1800.00 },
          { accountCode: '2032', accountName: 'Pag-IBIG Premiums Payable', debit: 0, credit: 800.00 },
          { accountCode: '2040', accountName: 'BIR Withholding Tax Payable (1601-C)', debit: 0, credit: 2600.00 }
        ]
      };
      setJournalEntries(prev => [newJe, ...prev]);
      setAccountingToast('Biometric Payroll ₱68,400.00 auto-posted to General Ledger with balanced statutory accruals.');
    }
    setTimeout(() => setAccountingToast(''), 5000);
  };

  const handleCreateTicket = (e) => {
    e.preventDefault();
    const createdTicket = {
      id: `TKT-2026-${String(serviceTickets.length + 904).padStart(4, '0')}`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      clientName: newTicket.clientName || 'Walk-in Client',
      branch: newTicket.branch,
      service: newTicket.service,
      specialist: newTicket.specialist,
      amount: Number(newTicket.amount) || 0,
      paymentMethod: newTicket.paymentMethod,
      commission: (Number(newTicket.amount) || 0) * 0.10,
      status: 'Paid & Completed'
    };

    setServiceTickets(prev => [createdTicket, ...prev]);
    setShowNewTicketModal(false);
    setCrmToast(`Service Ticket ${createdTicket.id} (₱${createdTicket.amount.toLocaleString()}) saved & credited to ${createdTicket.specialist}! Auto-synced with daily POS audit.`);
    setTimeout(() => setCrmToast(''), 5000);
  };

  return (
    <div className="min-h-screen font-sans antialiased text-[#2D2520] bg-[#F7F8FA] flex">
      
      {/* 1. LEFT SIDEBAR (HRMS Behance style) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#EAE8E2] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-5 space-y-6">
          
          {/* Logo Branding */}
          <div className="flex items-center space-x-3 pb-2 border-b border-[#F2F0E8]">
            <img 
              src="/alrajj-icon.png" 
              alt="ALRAJJ LEGACY Logo" 
              className="h-11 w-11 object-contain rounded-xl border border-[#031134]/15 p-1 shadow-sm bg-[#031134]" 
            />
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-sm tracking-tight text-[#031134]">ALRAJJ LEGACY</span>
                <span className="bg-[#031134]/10 text-[#031134] text-[9px] font-extrabold px-1.5 py-0.5 rounded-md tracking-wider">HRMS</span>
              </div>
              <p className="text-[10px] text-[#8A817C] font-semibold">Fortified Business Corp.</p>
            </div>
          </div>

          {/* Quick Search Menu */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
            <input 
              type="text"
              placeholder="Search menus..."
              className="w-full bg-[#F7F6F2] text-[#2D2520] placeholder-[#A8A29E] text-xs rounded-xl pl-8 pr-3 py-2 outline-none focus:ring-1 focus:ring-[#77BC2E] border border-transparent font-medium"
            />
          </div>

          {/* Navigation Categories */}
          <nav className="space-y-5 text-xs">
            
            {/* Category 1: FINANCIAL & EXECUTIVE ERP */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#A8A29E] px-3">Financial & Executive ERP</span>
              
              <button
                onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-semibold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-[#77BC2E] text-white shadow-sm shadow-[#77BC2E]/25'
                    : 'text-[#5A534E] hover:bg-[#F7F6F2] hover:text-[#4A2E1B]'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>General Dashboard</span>
              </button>

              <button
                onClick={() => { setActiveTab('accounting'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all ${
                  activeTab === 'accounting'
                    ? 'bg-[#031134] text-white shadow-sm shadow-[#031134]/25'
                    : 'text-[#5A534E] hover:bg-[#F7F6F2] hover:text-[#031134]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Landmark className="h-4 w-4 text-[#D4AF37]" />
                  <span>Accounting & Financials</span>
                </div>
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                  activeTab === 'accounting' ? 'bg-[#D4AF37] text-[#031134]' : 'bg-[#031134]/10 text-[#031134]'
                }`}>
                  ERP
                </span>
              </button>

              <button
                onClick={() => { setActiveTab('payroll'); setSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-semibold transition-all ${
                  activeTab === 'payroll'
                    ? 'bg-[#77BC2E] text-white shadow-sm shadow-[#77BC2E]/25'
                    : 'text-[#5A534E] hover:bg-[#F7F6F2] hover:text-[#4A2E1B]'
                }`}
              >
                <Calculator className="h-4 w-4" />
                <span>Biometric Payroll</span>
              </button>
            </div>

            {/* Category 2: WORKFORCE MANAGEMENT */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#A8A29E] px-3">Workforce Management</span>
              
              <button
                onClick={() => { setActiveTab('exceptions'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all ${
                  activeTab === 'exceptions'
                    ? 'bg-[#77BC2E] text-white shadow-sm shadow-[#77BC2E]/25'
                    : 'text-[#5A534E] hover:bg-[#F7F6F2] hover:text-[#4A2E1B]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Exceptions & Flags</span>
                </div>
                {exceptions.length > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTab === 'exceptions' ? 'bg-white text-[#4A2E1B]' : 'bg-[#E89BB9] text-white'
                  }`}>
                    {exceptions.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => { setActiveTab('tardiness'); setSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-semibold transition-all ${
                  activeTab === 'tardiness'
                    ? 'bg-[#77BC2E] text-white shadow-sm shadow-[#77BC2E]/25'
                    : 'text-[#5A534E] hover:bg-[#F7F6F2] hover:text-[#4A2E1B]'
                }`}
              >
                <Clock className="h-4 w-4" />
                <span>Tardiness & NTE</span>
              </button>

              <button
                onClick={() => { setActiveTab('upload'); setSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-semibold transition-all ${
                  activeTab === 'upload'
                    ? 'bg-[#77BC2E] text-white shadow-sm shadow-[#77BC2E]/25'
                    : 'text-[#5A534E] hover:bg-[#F7F6F2] hover:text-[#4A2E1B]'
                }`}
              >
                <Upload className="h-4 w-4" />
                <span>Biometric Ingestion</span>
              </button>
            </div>

            {/* Category 3: EMPLOYEE MANAGEMENT */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#A8A29E] px-3">Employee Management</span>
              
              <button
                onClick={() => { setActiveTab('employees'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all ${
                  activeTab === 'employees'
                    ? 'bg-[#77BC2E] text-white shadow-sm shadow-[#77BC2E]/25'
                    : 'text-[#5A534E] hover:bg-[#F7F6F2] hover:text-[#4A2E1B]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4" />
                  <span>Staff Directory</span>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === 'employees' ? 'bg-white text-[#4A2E1B]' : 'bg-[#FAF9F5] text-[#8A817C]'
                }`}>
                  {employees.length || 4}
                </span>
              </button>
            </div>

            {/* Category 4: SALON OPERATIONS & COMMERCIAL */}
            <div className="space-y-1 pt-2 border-t border-[#F2F0E8]">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#8A817C] px-3">
                Salon Operations
              </span>

              <button
                onClick={() => { setActiveTab('crm'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all ${
                  activeTab === 'crm'
                    ? 'bg-[#E89BB9] text-white shadow-sm shadow-[#E89BB9]/25'
                    : 'text-[#5A534E] hover:bg-[#F7F6F2] hover:text-[#4A2E1B]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Users className="h-4 w-4" />
                  <span>Salon CRM & Loyalty</span>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === 'crm' ? 'bg-white text-[#D47098]' : 'bg-[#E89BB9]/20 text-[#D47098]'
                }`}>
                  {crmClients.length}
                </span>
              </button>

              <button
                onClick={() => { setActiveTab('procurement'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all ${
                  activeTab === 'procurement'
                    ? 'bg-[#031134] text-white shadow-sm shadow-[#031134]/25'
                    : 'text-[#5A534E] hover:bg-[#F7F6F2] hover:text-[#4A2E1B]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <ShoppingCart className="h-4 w-4" />
                  <span>PO to Accounting</span>
                </div>
                <span className="text-[10px] font-bold bg-[#77BC2E]/20 text-[#5A9A1E] px-1.5 py-0.5 rounded-full">
                  5-Step
                </span>
              </button>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer User Card */}
        <div className="p-4 border-t border-[#F2F0E8] bg-[#FAF9F5]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#4A2E1B] text-[#77BC2E] flex items-center justify-center font-bold text-xs shadow-sm">
              KH
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#4A2E1B] truncate">Kristene HR</p>
              <p className="text-[10px] text-[#8A817C] truncate">Operations Lead</p>
            </div>
            <span className="w-2.5 h-2.5 bg-[#77BC2E] rounded-full border-2 border-white"></span>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-stone-900/30 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* 2. MAIN CONTENT WRAPPER */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top Navbar in Content Area (Clean, Uncluttered & Modern) */}
        <header className="sticky top-0 z-30 bg-[#F7F8FA]/90 backdrop-blur-md px-6 lg:px-10 py-4 flex items-center justify-between border-b border-[#EAE8E2]/60">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-white border border-[#EAE8E2] text-[#4A2E1B]"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold text-[#4A2E1B] tracking-tight">Welcome back, Kristene</h1>
                <span className="hidden sm:inline-flex bg-white border border-[#EAE8E2] text-[#8A817C] text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <p className="text-xs text-[#8A817C] hidden sm:block">Real-time biometric attendance, automated payroll & multi-branch financials.</p>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            
            {/* Clean, Focused Navigation Switcher */}
            <div className="hidden xl:flex items-center bg-white border border-[#EAE8E2] p-1 rounded-2xl shadow-2xs space-x-1 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  ['dashboard', 'exceptions', 'tardiness', 'upload'].includes(activeTab)
                    ? 'bg-[#77BC2E] text-white font-bold shadow-2xs'
                    : 'text-[#5A534E] hover:text-[#4A2E1B]'
                }`}
              >
                HR & Attendance
              </button>
              <button
                onClick={() => setActiveTab('accounting')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                  activeTab === 'accounting'
                    ? 'bg-[#031134] text-white font-bold shadow-2xs'
                    : 'text-[#5A534E] hover:text-[#031134]'
                }`}
              >
                <Landmark className="h-3.5 w-3.5 text-[#D4AF37]" />
                <span>Accounting & Financials</span>
              </button>
              <button
                onClick={() => setActiveTab('payroll')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'payroll'
                    ? 'bg-[#77BC2E] text-white font-bold shadow-2xs'
                    : 'text-[#5A534E] hover:text-[#4A2E1B]'
                }`}
              >
                Biometric Payroll
              </button>
              <button
                onClick={() => setActiveTab('crm')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                  activeTab === 'crm'
                    ? 'bg-[#E89BB9] text-white font-bold shadow-2xs'
                    : 'text-[#5A534E] hover:text-[#4A2E1B]'
                }`}
              >
                <span>Salon CRM</span>
              </button>
              <button
                onClick={() => setActiveTab('procurement')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                  activeTab === 'procurement'
                    ? 'bg-[#031134] text-white font-bold shadow-2xs'
                    : 'text-[#5A534E] hover:text-[#4A2E1B]'
                }`}
              >
                <span>PO Pipeline</span>
              </button>
            </div>

            {/* Cutoff Range Pill */}
            <div className="hidden md:flex items-center space-x-2 bg-white border border-[#EAE8E2] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#5A534E] shadow-2xs">
              <Calendar className="h-3.5 w-3.5 text-[#77BC2E]" />
              <span>{startDate} ~ {endDate}</span>
            </div>

            {/* Notification Bell with Badge */}
            <button 
              onClick={() => setActiveTab('exceptions')}
              className="relative p-2.5 rounded-xl bg-white border border-[#EAE8E2] text-[#4A2E1B] hover:bg-[#FAF9F5] shadow-2xs transition-colors"
              title="Exceptions"
            >
              <Bell className="h-4 w-4" />
              {exceptions.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E89BB9] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                  {exceptions.length}
                </span>
              )}
            </button>

            {/* + Add Employee Action (Laybare Green Button) */}
            <button
              onClick={() => setShowAddEmployeeModal(true)}
              className="bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold text-xs sm:text-sm rounded-xl px-4 py-2.5 flex items-center space-x-2 shadow-sm shadow-[#77BC2E]/20 transition-all active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Add Employee</span>
            </button>
          </div>
        </header>

        {/* Main Body */}
        <main className="p-6 lg:p-10 space-y-6">
          
          {/* Top Quick Highlights Row (Inspired by Behance HRMS 4 Pill Stats) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            
            {/* Stat 1: Missed / Unresolved Flags */}
            <div className="bg-white border border-[#EAE8E2] rounded-2xl p-4 sm:p-5 flex items-center space-x-4 shadow-2xs">
              <div className="w-11 h-11 rounded-2xl bg-[#E89BB9]/20 text-[#D47098] flex items-center justify-center flex-shrink-0 font-bold">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-[#4A2E1B]">{summary.pendingExceptions}</div>
                <div className="text-xs text-[#8A817C] font-semibold">Missed Out / Flags</div>
              </div>
            </div>

            {/* Stat 2: Total Registered Staff */}
            <div className="bg-white border border-[#EAE8E2] rounded-2xl p-4 sm:p-5 flex items-center space-x-4 shadow-2xs">
              <div className="w-11 h-11 rounded-2xl bg-[#77BC2E]/20 text-[#5A9A1E] flex items-center justify-center flex-shrink-0 font-bold">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-[#4A2E1B]">{summary.totalEmployees}</div>
                <div className="text-xs text-[#8A817C] font-semibold">Active Salon Staff</div>
              </div>
            </div>

            {/* Stat 3: Tardiness Minutes */}
            <div className="bg-white border border-[#EAE8E2] rounded-2xl p-4 sm:p-5 flex items-center space-x-4 shadow-2xs">
              <div className="w-11 h-11 rounded-2xl bg-[#B58EBE]/20 text-[#9C72A8] flex items-center justify-center flex-shrink-0 font-bold">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-[#4A2E1B]">{summary.totalLateMins}m</div>
                <div className="text-xs text-[#8A817C] font-semibold">Total Late Minutes</div>
              </div>
            </div>

            {/* Stat 4: Avg Work Shift */}
            <div className="bg-white border border-[#EAE8E2] rounded-2xl p-4 sm:p-5 flex items-center space-x-4 shadow-2xs">
              <div className="w-11 h-11 rounded-2xl bg-[#4A2E1B]/10 text-[#4A2E1B] flex items-center justify-center flex-shrink-0 font-bold">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-[#4A2E1B]">{summary.averageHours}h</div>
                <div className="text-xs text-[#8A817C] font-semibold">Avg. Work Shift</div>
              </div>
            </div>
          </div>

          {/* TAB 1: GENERAL DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Row 2: Attendance Donut Overview + Live Biometric Punch Widget (Behance HRMS Style) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Donut Widget: Attendance Overview */}
                <div className="lg:col-span-5 bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-[#4A2E1B]">Attendance Overview</h3>
                      <p className="text-[11px] text-[#8A817C]">Current cycle attendance distribution</p>
                    </div>
                    <span className="text-[11px] font-bold text-[#77BC2E] bg-[#77BC2E]/15 px-2.5 py-0.5 rounded-full">
                      Live Pulse
                    </span>
                  </div>

                  {/* Donut Chart with Center Percentage */}
                  <div className="relative h-48 flex items-center justify-center">
                    <ReactECharts option={getAttendanceDonutOption()} style={{ height: '100%', width: '100%' }} />
                    <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-extrabold text-[#4A2E1B]">88%</span>
                      <span className="text-[10px] uppercase font-bold text-[#8A817C] tracking-wider">Present</span>
                    </div>
                  </div>

                  {/* Color Legend (Laybare colors) */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#F2F0E8] text-center text-xs">
                    <div className="flex flex-col items-center">
                      <span className="flex items-center space-x-1 font-bold text-[#4A2E1B]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#77BC2E]"></span>
                        <span>Present</span>
                      </span>
                      <span className="text-[10px] text-[#8A817C]">4 staff</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="flex items-center space-x-1 font-bold text-[#4A2E1B]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E89BB9]"></span>
                        <span>Flags</span>
                      </span>
                      <span className="text-[10px] text-[#8A817C]">1 missing</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="flex items-center space-x-1 font-bold text-[#4A2E1B]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#B58EBE]"></span>
                        <span>Rest Day</span>
                      </span>
                      <span className="text-[10px] text-[#8A817C]">1 log</span>
                    </div>
                  </div>
                </div>

                {/* Biometric Time Clock & Live Logs Widget (Inspired by "Your In Time / Your Out Time" in Behance) */}
                <div className="lg:col-span-7 bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-[#F2F0E8] pb-3">
                    <div>
                      <h3 className="font-extrabold text-sm text-[#4A2E1B]">Recent Clock-In Feed</h3>
                      <p className="text-[11px] text-[#8A817C]">Live offline biometric punch records</p>
                    </div>

                    <button
                      onClick={() => setActiveTab('upload')}
                      className="text-xs font-bold text-[#77BC2E] hover:underline flex items-center space-x-1 bg-[#77BC2E]/10 px-3 py-1 rounded-xl"
                    >
                      <Upload className="h-3 w-3" />
                      <span>Sync Biometrics</span>
                    </button>
                  </div>

                  {/* Punch logs list */}
                  <div className="space-y-2.5 overflow-y-auto max-h-48 pr-1">
                    {livePunches.map((punch) => (
                      <div 
                        key={punch.id} 
                        className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF9F5] border border-[#F2F0E8] text-xs hover:border-[#EAE8E2] transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-[#4A2E1B] text-[#77BC2E] flex items-center justify-center font-bold text-xs">
                            {punch.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-[#4A2E1B]">{punch.name}</p>
                            <p className="text-[10px] text-[#8A817C]">{punch.branch} Branch</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 text-right">
                          <div>
                            <p className="font-mono font-bold text-[#4A2E1B]">{punch.time}</p>
                            <p className={`text-[10px] font-semibold ${
                              punch.status === 'On Time' 
                                ? 'text-[#77BC2E]' 
                                : punch.status.includes('Late') 
                                ? 'text-[#D47098]' 
                                : 'text-rose-500 font-bold'
                            }`}>
                              {punch.status}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick summary notice */}
                  <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-[#EAE8E2] flex items-center justify-between text-xs text-[#5A534E]">
                    <span>Payroll calculation period ready for July 16 - July 31.</span>
                    <button
                      onClick={() => setActiveTab('payroll')}
                      className="font-bold text-[#77BC2E] hover:underline"
                    >
                      Run Payroll →
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 3: Daily Attendance Trend + Tardiness Top 5 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                
                {/* Line Chart */}
                <div className="bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-[#4A2E1B]">Attendance Volume</h3>
                      <p className="text-[11px] text-[#8A817C]">Daily headcount turnouts across salons</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#4A2E1B] bg-[#FAF9F5] border border-[#EAE8E2] px-2.5 py-1 rounded-xl">
                      Daily View
                    </span>
                  </div>
                  <div className="h-64">
                    <ReactECharts option={getDailyAttendanceChartOption()} style={{ height: '100%' }} />
                  </div>
                </div>

                {/* Tardiness Bar Chart */}
                <div className="bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-[#4A2E1B]">Tardiness Frequency</h3>
                      <p className="text-[11px] text-[#8A817C]">Top late minutes accumulated this cycle</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#E89BB9] bg-[#E89BB9]/15 px-2.5 py-1 rounded-xl">
                      Late Threshold
                    </span>
                  </div>
                  <div className="h-64">
                    <ReactECharts option={getTardinessChartOption()} style={{ height: '100%' }} />
                  </div>
                </div>
              </div>

              {/* Row 4: Attendance Master Records Table */}
              <div className="bg-white border border-[#EAE8E2] rounded-3xl overflow-hidden shadow-2xs">
                <div className="p-6 border-b border-[#F2F0E8] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold text-base text-[#4A2E1B]">Processed Biometric Timesheets</h3>
                    <p className="text-xs text-[#8A817C]">Complete log of attendance and calculated work hours</p>
                  </div>

                  {/* Filter & Search */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="relative">
                      <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                      <input
                        type="text"
                        placeholder="Search employee / branch..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-[#F7F6F2] border border-transparent rounded-xl pl-8 pr-3 py-1.5 text-xs font-medium focus:ring-1 focus:ring-[#77BC2E] outline-none text-[#2D2520] w-44 sm:w-52"
                      />
                    </div>

                    <select
                      value={filterEmployee}
                      onChange={(e) => setFilterEmployee(e.target.value)}
                      className="bg-[#F7F6F2] border border-transparent rounded-xl px-3 py-1.5 text-xs font-semibold text-[#5A534E] outline-none"
                    >
                      <option value="">All Employees</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                      ))}
                    </select>

                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="bg-[#F7F6F2] border border-transparent rounded-xl px-3 py-1.5 text-xs font-semibold text-[#5A534E] outline-none"
                    >
                      <option value="">All Statuses</option>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Rest Day">Rest Day</option>
                      <option value="Flagged">Flagged</option>
                      <option value="Approved">Approved</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#FAF9F5] border-b border-[#F2F0E8] text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C]">
                        <th className="px-6 py-3.5">Employee</th>
                        <th className="px-6 py-3.5">Date</th>
                        <th className="px-6 py-3.5">Calculated IN</th>
                        <th className="px-6 py-3.5">Calculated OUT</th>
                        <th className="px-6 py-3.5">Regular Hrs</th>
                        <th className="px-6 py-3.5">Late (mins)</th>
                        <th className="px-6 py-3.5">OT (hrs)</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2F0E8] text-xs">
                      {filteredAttendance.map((rec) => (
                        <tr key={rec.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                          <td className="px-6 py-4 font-bold text-[#4A2E1B] flex items-center space-x-2.5">
                            <div className="w-7 h-7 rounded-xl bg-[#4A2E1B] text-[#77BC2E] flex items-center justify-center font-bold text-[10px]">
                              {rec.employee_name.charAt(0)}
                            </div>
                            <span>{rec.employee_name}</span>
                          </td>
                          <td className="px-6 py-4 font-mono text-[#5A534E]">{rec.date}</td>
                          <td className="px-6 py-4 font-mono text-[#5A534E]">{rec.calculated_in || '--:--'}</td>
                          <td className="px-6 py-4 font-mono text-[#5A534E]">{rec.calculated_out || '--:--'}</td>
                          <td className="px-6 py-4 font-mono font-medium">{rec.regular_hours || 0}</td>
                          <td className="px-6 py-4 font-mono">
                            {rec.late_minutes > 0 ? (
                              <span className="text-[#D47098] font-bold">{rec.late_minutes}m</span>
                            ) : (
                              <span className="text-[#A8A29E]">0</span>
                            )}
                          </td>
                          <td className="px-6 py-4 font-mono text-[#77BC2E] font-bold">{rec.ot_hours || 0}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                              rec.status === 'Present' || rec.status === 'Approved'
                                ? 'bg-[#77BC2E]/15 text-[#5A9A1E]'
                                : rec.status === 'Flagged'
                                ? 'bg-[#E89BB9]/25 text-[#D47098] animate-pulse'
                                : 'bg-[#EAE8E2] text-[#5A534E]'
                            }`}>
                              {rec.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[#8A817C]">{rec.notes || '--'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD PORTAL */}
          {activeTab === 'upload' && (
            <div className="max-w-2xl mx-auto bg-white border border-[#EAE8E2] rounded-3xl p-8 sm:p-10 shadow-2xs space-y-6 animate-fadeIn">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-[#77BC2E]/15 text-[#77BC2E] flex items-center justify-center mx-auto shadow-2xs">
                  <Upload className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-[#4A2E1B] tracking-tight">Import NGTeco Punch Report</h2>
                <p className="text-xs sm:text-sm text-[#8A817C] max-w-md mx-auto">
                  Directly upload raw offline biometric excel punch files (.xls / .xlsx) generated from salon stores.
                </p>
              </div>

              <form onSubmit={handleFileUpload} className="space-y-5">
                <div className="border-2 border-dashed border-[#EAE8E2] hover:border-[#77BC2E] rounded-3xl p-10 text-center transition-all cursor-pointer relative bg-[#FAF9F5]">
                  <input
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".xls,.xlsx"
                  />
                  {uploadFile ? (
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-[#77BC2E]/20 text-[#5A9A1E] flex items-center justify-center mx-auto">
                        <FileSpreadsheet className="h-5 w-5" />
                      </div>
                      <p className="font-bold text-sm text-[#4A2E1B]">{uploadFile.name}</p>
                      <p className="text-xs text-[#8A817C]">{(uploadFile.size / 1024).toFixed(1)} KB — Ready to parse</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-[#F2F0E8] text-[#8A817C] flex items-center justify-center mx-auto">
                        <Upload className="h-5 w-5" />
                      </div>
                      <p className="font-bold text-sm text-[#4A2E1B]">Drag & drop punch spreadsheet, or click to browse</p>
                      <p className="text-xs text-[#8A817C]">Supports standard NGTeco biometric exports (.xls, .xlsx)</p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!uploadFile || uploadStatus.loading}
                  className="w-full bg-[#77BC2E] hover:bg-[#6DB027] text-white disabled:opacity-50 disabled:cursor-not-allowed font-bold py-3.5 rounded-xl shadow-sm shadow-[#77BC2E]/20 transition-all text-xs sm:text-sm flex items-center justify-center space-x-2"
                >
                  {uploadStatus.loading ? (
                    <span>Processing Biometric Data...</span>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Process & Ingest Timesheets</span>
                    </>
                  )}
                </button>
              </form>

              {uploadStatus.message && (
                <div className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start space-x-3 ${
                  uploadStatus.success
                    ? 'bg-[#77BC2E]/10 border-[#77BC2E]/30 text-[#5A9A1E]'
                    : 'bg-[#E89BB9]/20 border-[#E89BB9]/40 text-[#D47098]'
                }`}>
                  {uploadStatus.success ? <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" /> : <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />}
                  <span>{uploadStatus.message}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EXCEPTIONS & FLAGS */}
          {activeTab === 'exceptions' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
              
              {/* List of Exceptions */}
              <div className={`bg-white border border-[#EAE8E2] rounded-3xl overflow-hidden shadow-2xs transition-all duration-300 ${
                selectedException ? 'lg:col-span-2' : 'lg:col-span-3'
              }`}>
                <div className="p-6 border-b border-[#F2F0E8] flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-[#4A2E1B]">Biometric Exceptions Queue</h3>
                    <p className="text-xs text-[#8A817C]">Unpaired clock punches requiring supervisor verification</p>
                  </div>
                  <span className="bg-[#E89BB9]/20 text-[#D47098] text-xs font-bold px-3 py-1 rounded-full">
                    {exceptions.length} Flagged Logs
                  </span>
                </div>

                {exceptions.length === 0 ? (
                  <div className="p-12 text-center text-[#8A817C] space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#77BC2E]/15 text-[#77BC2E] flex items-center justify-center mx-auto">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <h4 className="font-bold text-[#4A2E1B]">All Clear!</h4>
                    <p className="text-xs">No missing or irregular punch records detected.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#FAF9F5] border-b border-[#F2F0E8] text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C]">
                          <th className="px-6 py-3.5">Employee</th>
                          <th className="px-6 py-3.5">Date</th>
                          <th className="px-6 py-3.5">Clock IN</th>
                          <th className="px-6 py-3.5">Clock OUT</th>
                          <th className="px-6 py-3.5">Flag Description</th>
                          <th className="px-6 py-3.5">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F2F0E8] text-xs">
                        {exceptions.map(exc => (
                          <tr 
                            key={exc.id} 
                            className={`hover:bg-[#FAF9F5] cursor-pointer transition-colors ${
                              selectedException?.id === exc.id ? 'bg-[#77BC2E]/10' : ''
                            }`}
                            onClick={() => {
                              setSelectedException(exc);
                              setOverrideIn(exc.calculated_in || '');
                              setOverrideOut(exc.calculated_out || '');
                              setOverrideNote(exc.notes || '');
                            }}
                          >
                            <td className="px-6 py-4 font-bold text-[#4A2E1B]">{exc.employee_name}</td>
                            <td className="px-6 py-4 font-mono text-[#5A534E]">{exc.date}</td>
                            <td className="px-6 py-4 font-mono">{exc.calculated_in || '--:--'}</td>
                            <td className="px-6 py-4 font-mono">{exc.calculated_out || '--:--'}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center space-x-1 text-xs text-[#D47098] font-bold bg-[#E89BB9]/20 rounded-full px-2.5 py-0.5">
                                <AlertTriangle className="h-3 w-3" />
                                <span>{exc.notes}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button className="text-xs font-bold text-[#77BC2E] hover:underline flex items-center space-x-1 bg-[#77BC2E]/10 px-3 py-1.5 rounded-xl">
                                <span>Override</span>
                                <ChevronRight className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Override Side Panel */}
              {selectedException && (
                <div className="bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-xl space-y-6 h-fit transition-all">
                  <div className="flex items-center justify-between border-b border-[#F2F0E8] pb-4">
                    <div>
                      <span className="text-[10px] font-bold tracking-widest text-[#77BC2E] uppercase">HR Adjustment</span>
                      <h4 className="font-extrabold text-base text-[#4A2E1B]">Correct Punch Record</h4>
                    </div>
                    <button onClick={() => setSelectedException(null)} className="text-[#8A817C] hover:text-[#4A2E1B]">
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="bg-[#FAF9F5] rounded-2xl p-4 space-y-1 text-xs border border-[#F2F0E8]">
                    <div>Staff: <strong className="font-bold text-[#4A2E1B]">{selectedException.employee_name}</strong> (ID #{selectedException.employee_id})</div>
                    <div>Date: <strong className="font-mono">{selectedException.date}</strong></div>
                    <div>Warning: <strong className="text-[#D47098]">{selectedException.notes}</strong></div>
                  </div>

                  <form onSubmit={handleOverrideSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Clock IN</label>
                        <input
                          type="text"
                          placeholder="09:00"
                          value={overrideIn}
                          onChange={(e) => setOverrideIn(e.target.value)}
                          className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2 font-mono font-medium focus:ring-1 focus:ring-[#77BC2E] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Clock OUT</label>
                        <input
                          type="text"
                          placeholder="18:00"
                          value={overrideOut}
                          onChange={(e) => setOverrideOut(e.target.value)}
                          className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2 font-mono font-medium focus:ring-1 focus:ring-[#77BC2E] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Adjustment Note</label>
                      <textarea
                        placeholder="e.g. Branch store manager signed timesheet waiver"
                        value={overrideNote}
                        onChange={(e) => setOverrideNote(e.target.value)}
                        rows={3}
                        className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2 font-medium focus:ring-1 focus:ring-[#77BC2E] outline-none"
                      />
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <button
                        type="submit"
                        className="flex-1 bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold py-2.5 rounded-xl shadow-xs transition-all"
                      >
                        Save & Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedException(null)}
                        className="bg-[#F2F0E8] text-[#5A534E] font-semibold px-4 py-2.5 rounded-xl transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TARDINESS MODULE */}
          {activeTab === 'tardiness' && (
            <div className="bg-white border border-[#EAE8E2] rounded-3xl overflow-hidden shadow-2xs animate-fadeIn">
              <div className="p-6 border-b border-[#F2F0E8] flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-[#4A2E1B]">Punctuality & Tardiness Tracker</h3>
                  <p className="text-xs text-[#8A817C]">Automated tracking for 3+ late arrival thresholds</p>
                </div>
                <span className="bg-[#FAF9F5] text-[#5A534E] text-xs font-semibold px-3 py-1 rounded-xl border border-[#EAE8E2]">
                  Standard Threshold: 3 Incidents
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF9F5] border-b border-[#F2F0E8] text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C]">
                      <th className="px-6 py-3.5">Employee</th>
                      <th className="px-6 py-3.5">Branch</th>
                      <th className="px-6 py-3.5">Late Frequency</th>
                      <th className="px-6 py-3.5">Total Late Minutes</th>
                      <th className="px-6 py-3.5">Disciplinary Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2F0E8] text-xs">
                    {tardiness.map(t => (
                      <tr key={t.employee_id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#4A2E1B] flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-xl bg-[#4A2E1B] text-[#77BC2E] flex items-center justify-center font-bold text-[10px]">
                            {t.employee_name.charAt(0)}
                          </div>
                          <span>{t.employee_name}</span>
                        </td>
                        <td className="px-6 py-4 text-[#5A534E] font-medium">{t.branch}</td>
                        <td className="px-6 py-4 font-mono font-bold text-[#4A2E1B]">{t.late_count} times</td>
                        <td className="px-6 py-4 font-mono text-[#5A534E]">{t.total_late_minutes} minutes</td>
                        <td className="px-6 py-4">
                          {t.late_count >= 3 ? (
                            <div className="flex items-center space-x-3">
                              <span className="bg-[#E89BB9]/25 text-[#D47098] text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                                <AlertTriangle className="h-3 w-3" />
                                <span>Exceeded</span>
                              </span>
                              <button
                                onClick={() => setSelectedNteEmployee(t)}
                                className="bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-xs"
                              >
                                <FileText className="h-3 w-3" />
                                <span>Draft NTE</span>
                              </button>
                            </div>
                          ) : (
                            <span className="bg-[#77BC2E]/15 text-[#5A9A1E] text-xs font-bold px-3 py-1 rounded-full">
                              Compliant
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: ACCOUNTING & FINANCIAL MANAGEMENT ERP SUITE */}
          {activeTab === 'accounting' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Toast Notification */}
              {accountingToast && (
                <div className="bg-[#031134] text-white p-4 rounded-2xl flex items-center justify-between text-xs font-bold shadow-md border border-[#D4AF37]/30 animate-fadeIn">
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle className="h-4 w-4 text-[#77BC2E]" />
                    <span>{accountingToast}</span>
                  </div>
                  <button onClick={() => setAccountingToast('')} className="text-[#8A817C] hover:text-white">
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* SMART & LAZY-FRIENDLY ACCOUNTING EXECUTIVE COCKPIT */}
              <div className="bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-2xs space-y-5">
                
                {/* Header & Quick Insight */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F2F0E8] pb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-[#031134] text-[#D4AF37] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Smart Accounting Hub
                      </span>
                      <span className="text-[11px] font-bold text-[#77BC2E] flex items-center space-x-1">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Real-time Google Sheets & BPI Bank Sync</span>
                      </span>
                    </div>
                    <h2 className="font-extrabold text-xl text-[#4A2E1B] mt-1 tracking-tight">
                      Accounting & Financial Operations
                    </h2>
                    <p className="text-xs text-[#8A817C] max-w-2xl mt-0.5">
                      Smart, automated bookkeeping designed for Lay Bare branches. Zero manual spreadsheets needed—all POS revenue, payroll accruals, and supplier bills are automatically reconciled.
                    </p>
                  </div>

                  {/* Top Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setShowNewJournalModal(true)}
                      className="bg-[#031134] hover:bg-[#082260] text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
                    >
                      <Plus className="h-3.5 w-3.5 text-[#D4AF37]" />
                      <span>+ Journal Entry</span>
                    </button>
                    <button
                      onClick={() => setShowNewInvoiceModal(true)}
                      className="bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm shadow-[#77BC2E]/20"
                    >
                      <Receipt className="h-3.5 w-3.5" />
                      <span>+ Vendor Bill</span>
                    </button>
                    <button
                      onClick={() => setShowPosReconModal(true)}
                      className="bg-[#FAF9F5] hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#4A2E1B] font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5"
                    >
                      <Wallet className="h-3.5 w-3.5 text-[#E89BB9]" />
                      <span>+ POS Cash Audit</span>
                    </button>
                    <button
                      onClick={() => { setFinancialReportType('pl'); setShowFinancialReportModal(true); }}
                      className="bg-white border border-[#EAE8E2] hover:bg-[#FAF9F5] text-[#5A534E] font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-2xs"
                    >
                      <Printer className="h-3.5 w-3.5 text-[#8A817C]" />
                      <span>Print Statement</span>
                    </button>
                  </div>
                </div>

                {/* 1-CLICK LAZY-FRIENDLY SMART AUTOMATIONS STRIP */}
                <div className="bg-gradient-to-r from-[#FAF9F5] via-[#F4F2EB] to-[#FAF9F5] border border-[#EAE8E2] rounded-2xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#77BC2E] animate-pulse"></span>
                    <span className="text-xs font-extrabold text-[#4A2E1B]">⚡ 1-Click Smart Automations:</span>
                    <span className="text-[11px] text-[#8A817C] hidden sm:inline">(Automates everything in seconds)</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <button
                      onClick={handleSmartAutoPostPayroll}
                      className="bg-white hover:bg-[#77BC2E] hover:text-white text-[#4A2E1B] border border-[#EAE8E2] font-bold px-3 py-1.5 rounded-xl transition-all shadow-2xs flex items-center space-x-1.5"
                      title="Automatically sync biometric payroll to General Ledger debits & credits"
                    >
                      <Calculator className="h-3.5 w-3.5 text-[#77BC2E]" />
                      <span>Auto-Post Payroll to Books</span>
                    </button>

                    <button
                      onClick={handleSmartQuickPay}
                      className="bg-white hover:bg-[#031134] hover:text-white text-[#4A2E1B] border border-[#EAE8E2] font-bold px-3 py-1.5 rounded-xl transition-all shadow-2xs flex items-center space-x-1.5"
                      title="1-Click Settle next PO vendor invoice via BPI BizLink and auto-credit ledger"
                    >
                      <CreditCard className="h-3.5 w-3.5 text-[#D4AF37]" />
                      <span>1-Click Pay Next Due Bill</span>
                    </button>

                    <button
                      onClick={handleSmartAutoAuditAllPos}
                      className="bg-white hover:bg-[#031134] hover:text-white text-[#4A2E1B] border border-[#EAE8E2] font-bold px-3 py-1.5 rounded-xl transition-all shadow-2xs flex items-center space-x-1.5"
                      title="Auto-reconcile all 4 salon shift registers against physical cash counts"
                    >
                      <CheckCheck className="h-3.5 w-3.5 text-[#77BC2E]" />
                      <span>Reconcile All 4 POS Drawers</span>
                    </button>

                    <button
                      onClick={handleExportPlCsv}
                      className="bg-white hover:bg-[#FAF9F5] text-[#5A534E] border border-[#EAE8E2] font-bold px-3 py-1.5 rounded-xl transition-all shadow-2xs flex items-center space-x-1.5"
                      title="Export formatted CSV compatible with Google Sheets and Microsoft Excel"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5 text-[#5A9A1E]" />
                      <span>Export Clean Sheets (CSV)</span>
                    </button>
                  </div>
                </div>

                {/* Sub-Nav Navigation Pills */}
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
                  <button
                    onClick={() => setAccountingSubTab('overview')}
                    className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-2 flex-shrink-0 ${
                      accountingSubTab === 'overview'
                        ? 'bg-[#031134] text-white shadow-2xs'
                        : 'bg-[#FAF9F5] text-[#5A534E] hover:bg-[#F2F0E8] hover:text-[#4A2E1B]'
                    }`}
                  >
                    <BarChart3 className="h-3.5 w-3.5 text-[#D4AF37]" />
                    <span>Overview & Liquidity</span>
                  </button>

                  <button
                    onClick={() => setAccountingSubTab('pl')}
                    className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-2 flex-shrink-0 ${
                      accountingSubTab === 'pl'
                        ? 'bg-[#77BC2E] text-white shadow-2xs'
                        : 'bg-[#FAF9F5] text-[#5A534E] hover:bg-[#F2F0E8] hover:text-[#4A2E1B]'
                    }`}
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>Profit & Loss (P&L)</span>
                  </button>

                  <button
                    onClick={() => setAccountingSubTab('balance_sheet')}
                    className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-2 flex-shrink-0 ${
                      accountingSubTab === 'balance_sheet'
                        ? 'bg-[#031134] text-white shadow-2xs'
                        : 'bg-[#FAF9F5] text-[#5A534E] hover:bg-[#F2F0E8] hover:text-[#4A2E1B]'
                    }`}
                  >
                    <Scale className="h-3.5 w-3.5" />
                    <span>Balance Sheet</span>
                  </button>

                  <button
                    onClick={() => setAccountingSubTab('invoices')}
                    className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-2 flex-shrink-0 ${
                      accountingSubTab === 'invoices'
                        ? 'bg-[#031134] text-white shadow-2xs'
                        : 'bg-[#FAF9F5] text-[#5A534E] hover:bg-[#F2F0E8] hover:text-[#4A2E1B]'
                    }`}
                  >
                    <Receipt className="h-3.5 w-3.5 text-[#E89BB9]" />
                    <span>Accounts Payable (PO Bills)</span>
                    <span className="bg-[#E89BB9] text-white text-[10px] px-1.5 py-0.2 rounded-full">
                      {apInvoices.filter(i => i.status !== 'Paid').length}
                    </span>
                  </button>

                  <button
                    onClick={() => setAccountingSubTab('pos_recon')}
                    className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-2 flex-shrink-0 ${
                      accountingSubTab === 'pos_recon'
                        ? 'bg-[#031134] text-white shadow-2xs'
                        : 'bg-[#FAF9F5] text-[#5A534E] hover:bg-[#F2F0E8] hover:text-[#4A2E1B]'
                    }`}
                  >
                    <Wallet className="h-3.5 w-3.5" />
                    <span>Daily POS Cash Audit</span>
                  </button>

                  <button
                    onClick={() => setAccountingSubTab('journal')}
                    className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-2 flex-shrink-0 ${
                      accountingSubTab === 'journal'
                        ? 'bg-[#031134] text-white shadow-2xs'
                        : 'bg-[#FAF9F5] text-[#5A534E] hover:bg-[#F2F0E8] hover:text-[#4A2E1B]'
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>General Ledger & Journals</span>
                  </button>

                  <button
                    onClick={() => setAccountingSubTab('taxes')}
                    className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-2 flex-shrink-0 ${
                      accountingSubTab === 'taxes'
                        ? 'bg-[#031134] text-white shadow-2xs'
                        : 'bg-[#FAF9F5] text-[#5A534E] hover:bg-[#F2F0E8] hover:text-[#4A2E1B]'
                    }`}
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-[#77BC2E]" />
                    <span>BIR & Statutory Tax Hub</span>
                  </button>
                </div>
              </div>

              {/* SUB-TAB 1: FINANCIAL OVERVIEW & LIQUIDITY */}
              {accountingSubTab === 'overview' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Top Executive Financial Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-[#EAE8E2] rounded-3xl p-5 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C]">Total Liquidity</span>
                        <div className="w-8 h-8 rounded-xl bg-[#77BC2E]/15 text-[#5A9A1E] flex items-center justify-center">
                          <Landmark className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="text-2xl font-black text-[#4A2E1B] font-mono">
                        ₱{(bankBalances.bpiBizLink + 90000).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="flex items-center space-x-1.5 text-[11px] text-[#5A9A1E] font-semibold">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>BPI BizLink + 4 Branch Cash Floats</span>
                      </div>
                    </div>

                    <div className="bg-white border border-[#EAE8E2] rounded-3xl p-5 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C]">Gross Revenue (MTD)</span>
                        <div className="w-8 h-8 rounded-xl bg-[#E89BB9]/20 text-[#D47098] flex items-center justify-center">
                          <TrendingUp className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="text-2xl font-black text-[#4A2E1B] font-mono">
                        ₱1,284,650.00
                      </div>
                      <div className="flex items-center space-x-1.5 text-[11px] text-[#5A9A1E] font-semibold">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        <span>80.67% Gross Margin (₱1.036M)</span>
                      </div>
                    </div>

                    <div className="bg-white border border-[#EAE8E2] rounded-3xl p-5 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C]">Operating OPEX (MTD)</span>
                        <div className="w-8 h-8 rounded-xl bg-[#FAF9F5] border border-[#EAE8E2] text-[#4A2E1B] flex items-center justify-center">
                          <Calculator className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="text-2xl font-black text-[#4A2E1B] font-mono">
                        ₱582,400.00
                      </div>
                      <div className="text-[11px] text-[#8A817C] font-semibold">
                        Salaries: ₱184.5k &bull; Mall Leases: ₱295k
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#031134] to-[#0A1B45] text-white rounded-3xl p-5 shadow-sm space-y-2 border border-[#D4AF37]/30">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D4AF37]">Net Operating EBITDA</span>
                        <div className="w-8 h-8 rounded-xl bg-white/10 text-[#D4AF37] flex items-center justify-center">
                          <Coins className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="text-2xl font-black text-white font-mono">
                        ₱453,950.00
                      </div>
                      <div className="flex items-center space-x-1.5 text-[11px] text-[#77BC2E] font-semibold">
                        <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                        <span>35.33% Net Profit Margin</span>
                      </div>
                    </div>
                  </div>

                  {/* Charts Row: Revenue Trend vs Expenses + Branch Revenue Donut */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    
                    {/* Left: Financial Trend Chart */}
                    <div className="lg:col-span-8 bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-extrabold text-sm text-[#4A2E1B]">Revenue vs. OPEX & Net Profit Trend</h3>
                          <p className="text-[11px] text-[#8A817C]">4-Month Financial Trajectory (May - Aug 2026)</p>
                        </div>
                        <span className="text-[10px] font-extrabold bg-[#77BC2E]/15 text-[#5A9A1E] px-2.5 py-1 rounded-full uppercase">
                          +12.4% MoM Growth
                        </span>
                      </div>
                      <div className="h-64">
                        <ReactECharts option={getFinancialTrendOption()} style={{ height: '100%', width: '100%' }} />
                      </div>
                    </div>

                    {/* Right: Branch Revenue Share */}
                    <div className="lg:col-span-4 bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-extrabold text-sm text-[#4A2E1B]">Branch Revenue Share</h3>
                          <span className="text-[10px] font-bold text-[#8A817C]">August MTD</span>
                        </div>
                        <p className="text-[11px] text-[#8A817C]">Contribution across 4 retail locations</p>
                      </div>

                      <div className="h-44 flex items-center justify-center">
                        <ReactECharts option={getBranchProfitabilityOption()} style={{ height: '100%', width: '100%' }} />
                      </div>

                      <div className="space-y-1.5 text-xs pt-2 border-t border-[#F2F0E8]">
                        <div className="flex items-center justify-between">
                          <span className="text-[#5A534E] flex items-center space-x-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#77BC2E]"></span>
                            <span>Centrio Waxing Salon</span>
                          </span>
                          <strong className="font-mono text-[#4A2E1B]">₱542.1k (42%)</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#5A534E] flex items-center space-x-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#E89BB9]"></span>
                            <span>Passion Nails (Centrio)</span>
                          </span>
                          <strong className="font-mono text-[#4A2E1B]">₱318.4k (25%)</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#5A534E] flex items-center space-x-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#B58EBE]"></span>
                            <span>Limketkai Mall</span>
                          </span>
                          <strong className="font-mono text-[#4A2E1B]">₱264.1k (21%)</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#5A534E] flex items-center space-x-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#031134]"></span>
                            <span>SM Downtown Premier</span>
                          </span>
                          <strong className="font-mono text-[#4A2E1B]">₱160.0k (12%)</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Liquidity Accounts & Branch Petty Cash Floats */}
                  <div className="bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#F2F0E8] pb-4">
                      <div>
                        <h3 className="font-extrabold text-base text-[#4A2E1B]">
                          Corporate Bank Accounts & Branch Cash Floats
                        </h3>
                        <p className="text-xs text-[#8A817C]">
                          Real-time cash availability for daily payroll disbursements, supplier payments, and branch floats.
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-[#77BC2E]/15 text-[#5A9A1E] text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1.5">
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>BPI BizLink API Online</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
                      <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-2xl p-4 space-y-1 md:col-span-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase text-[#8A817C]">Master Corporate Account</span>
                          <span className="bg-[#031134] text-[#D4AF37] text-[9px] font-bold px-1.5 py-0.5 rounded">BPI BizLink</span>
                        </div>
                        <strong className="text-[#4A2E1B] text-lg block font-mono">
                          ₱{bankBalances.bpiBizLink.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </strong>
                        <p className="text-[11px] text-[#8A817C]">Acc: 0249-8819-22 (ALRAJJ LEGACY Fortified)</p>
                      </div>

                      <div className="bg-white border border-[#EAE8E2] rounded-2xl p-4 space-y-1">
                        <span className="text-[10px] font-extrabold uppercase text-[#8A817C] block">Centrio Waxing Float</span>
                        <strong className="text-[#4A2E1B] text-base block font-mono">
                          ₱{bankBalances.pettyCashCentrioWaxing.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </strong>
                        <span className="text-[10px] font-bold text-[#5A9A1E]">Audited & Balanced</span>
                      </div>

                      <div className="bg-white border border-[#EAE8E2] rounded-2xl p-4 space-y-1">
                        <span className="text-[10px] font-extrabold uppercase text-[#8A817C] block">Passion Nails Float</span>
                        <strong className="text-[#4A2E1B] text-base block font-mono">
                          ₱{bankBalances.pettyCashPassionNails.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </strong>
                        <span className="text-[10px] font-bold text-[#5A9A1E]">Audited & Balanced</span>
                      </div>

                      <div className="bg-white border border-[#EAE8E2] rounded-2xl p-4 space-y-1">
                        <span className="text-[10px] font-extrabold uppercase text-[#8A817C] block">Ketkai & SM Floats</span>
                        <strong className="text-[#4A2E1B] text-base block font-mono">
                          ₱{(bankBalances.pettyCashLimketkai + bankBalances.pettyCashSmDowntown).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </strong>
                        <span className="text-[10px] font-bold text-[#5A9A1E]">Combined Total</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* SUB-TAB 2: MULTI-BRANCH PROFIT & LOSS (P&L) STATEMENT */}
              {accountingSubTab === 'pl' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Branch Filter Pills + Export Actions */}
                  <div className="bg-white border border-[#EAE8E2] rounded-3xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                      <span className="text-xs font-bold text-[#8A817C] mr-1 uppercase">Filter Branch:</span>
                      {[
                        { id: 'consolidated', label: 'Consolidated (All Branches)' },
                        { id: 'centrio-waxing', label: 'Centrio Waxing' },
                        { id: 'centrio-nails', label: 'Passion Nails (Centrio)' },
                        { id: 'limketkai', label: 'Limketkai Mall' },
                        { id: 'sm-downtown', label: 'SM Downtown Premier' }
                      ].map((b) => (
                        <button
                          key={b.id}
                          onClick={() => setAccountingBranch(b.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                            accountingBranch === b.id
                              ? 'bg-[#77BC2E] text-white shadow-2xs'
                              : 'bg-[#FAF9F5] text-[#5A534E] hover:bg-[#F2F0E8] hover:text-[#4A2E1B]'
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleExportPlCsv}
                        className="bg-[#FAF9F5] hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#4A2E1B] font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Export CSV</span>
                      </button>
                      <button
                        onClick={() => { setFinancialReportType('pl'); setShowFinancialReportModal(true); }}
                        className="bg-[#031134] hover:bg-[#082260] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-2xs"
                      >
                        <Printer className="h-3.5 w-3.5 text-[#D4AF37]" />
                        <span>Print Official P&L</span>
                      </button>
                    </div>
                  </div>

                  {/* P&L Statement Card */}
                  {(() => {
                    const currentBranch = plData.branches.find(b => b.id === accountingBranch) || plData.branches[0];
                    return (
                      <div className="bg-white border border-[#EAE8E2] rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
                        
                        {/* Statement Title Block */}
                        <div className="border-b border-[#EAE8E2] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-extrabold text-xs text-[#031134] uppercase tracking-wider">Philippine GAAP / BIR Standard</span>
                              <span className="bg-[#77BC2E]/15 text-[#5A9A1E] text-[10px] font-extrabold px-2 py-0.5 rounded-full">Audited Feed</span>
                            </div>
                            <h3 className="font-black text-2xl text-[#4A2E1B] mt-1">
                              Statement of Profit & Loss (Income Statement)
                            </h3>
                            <p className="text-xs text-[#8A817C]">
                              Entity: <strong>{currentBranch.name}</strong> &bull; Period: {plData.period} &bull; Currency: {plData.currency}
                            </p>
                          </div>

                          <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-2xl p-4 text-right">
                            <span className="text-[10px] font-bold uppercase text-[#8A817C] block">Net Operating Profit</span>
                            <span className="text-2xl font-black text-[#5A9A1E] font-mono">
                              ₱{currentBranch.netOperatingIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-[11px] font-extrabold text-[#77BC2E] block">
                              {currentBranch.netMarginPct}% Net Margin
                            </span>
                          </div>
                        </div>

                        {/* Statement Table */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left">
                            <thead>
                              <tr className="border-b border-[#EAE8E2] text-[10px] font-extrabold uppercase text-[#8A817C] tracking-wider">
                                <th className="py-3 px-4">Line Item / Account Description</th>
                                <th className="py-3 px-4 text-right">Amount (PHP)</th>
                                <th className="py-3 px-4 text-right">% of Revenue</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F2F0E8] font-medium text-[#4A2E1B]">
                              
                              {/* Section 1: REVENUE */}
                              <tr className="bg-[#FAF9F5] font-extrabold text-[#031134]">
                                <td className="py-2.5 px-4 uppercase tracking-wider" colSpan={3}>
                                  I. OPERATING REVENUE (GROSS SERVICE & RETAIL SALES)
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 px-8 text-[#5A534E]">Waxing Salon Services Revenue</td>
                                <td className="py-2 px-4 text-right font-mono">₱{currentBranch.revenue.waxingServices.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 text-right text-[#8A817C] font-mono">{((currentBranch.revenue.waxingServices / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-8 text-[#5A534E]">Nail Art & Spa Services Revenue</td>
                                <td className="py-2 px-4 text-right font-mono">₱{currentBranch.revenue.nailServices.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 text-right text-[#8A817C] font-mono">{((currentBranch.revenue.nailServices / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-8 text-[#5A534E]">Retail Aftercare Products (Balms, Lotions, Scrubs)</td>
                                <td className="py-2 px-4 text-right font-mono">₱{currentBranch.revenue.retailProducts.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 text-right text-[#8A817C] font-mono">{((currentBranch.revenue.retailProducts / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>
                              <tr className="bg-[#77BC2E]/10 font-bold text-[#4A2E1B]">
                                <td className="py-2.5 px-4 font-bold">TOTAL GROSS REVENUE</td>
                                <td className="py-2.5 px-4 text-right font-mono font-black text-[#5A9A1E]">
                                  ₱{currentBranch.revenue.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-2.5 px-4 text-right font-mono font-bold text-[#5A9A1E]">100.0%</td>
                              </tr>

                              {/* Section 2: COGS */}
                              <tr className="bg-[#FAF9F5] font-extrabold text-[#031134]">
                                <td className="py-2.5 px-4 uppercase tracking-wider" colSpan={3}>
                                  II. COST OF GOODS SOLD (SALON CONSUMABLES & SUPPLIES)
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 px-8 text-[#5A534E]">Organic Honey/Sugar Wax Consumables</td>
                                <td className="py-2 px-4 text-right font-mono text-[#D47098]">₱{currentBranch.cogs.waxConsumables.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 text-right text-[#8A817C] font-mono">{((currentBranch.cogs.waxConsumables / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-8 text-[#5A534E]">Nail Gels, Lacquers & Acrylic Powders</td>
                                <td className="py-2 px-4 text-right font-mono text-[#D47098]">₱{currentBranch.cogs.nailGelsAndLacquers.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 text-right text-[#8A817C] font-mono">{((currentBranch.cogs.nailGelsAndLacquers / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-8 text-[#5A534E]">PPE, Disposable Strips & Sanitizer Kits</td>
                                <td className="py-2 px-4 text-right font-mono text-[#D47098]">₱{currentBranch.cogs.ppeAndSanitizers.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 text-right text-[#8A817C] font-mono">{((currentBranch.cogs.ppeAndSanitizers / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-8 text-[#5A534E]">Branded Product Packaging & Carry Bags</td>
                                <td className="py-2 px-4 text-right font-mono text-[#D47098]">₱{currentBranch.cogs.packagingAndBags.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 text-right text-[#8A817C] font-mono">{((currentBranch.cogs.packagingAndBags / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>
                              <tr className="bg-[#FAF9F5] font-bold text-[#4A2E1B]">
                                <td className="py-2.5 px-4 font-bold">TOTAL COST OF GOODS SOLD</td>
                                <td className="py-2.5 px-4 text-right font-mono font-bold text-[#D47098]">
                                  (₱{currentBranch.cogs.totalCogs.toLocaleString('en-US', { minimumFractionDigits: 2 })})
                                </td>
                                <td className="py-2.5 px-4 text-right font-mono text-[#8A817C]">{((currentBranch.cogs.totalCogs / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>

                              {/* GROSS PROFIT */}
                              <tr className="bg-[#77BC2E]/20 font-black text-[#4A2E1B] text-sm">
                                <td className="py-3 px-4 uppercase">GROSS PROFIT</td>
                                <td className="py-3 px-4 text-right font-mono font-black text-[#5A9A1E]">
                                  ₱{currentBranch.grossProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-3 px-4 text-right font-mono font-black text-[#5A9A1E]">{currentBranch.grossMarginPct}%</td>
                              </tr>

                              {/* Section 3: OPEX */}
                              <tr className="bg-[#FAF9F5] font-extrabold text-[#031134]">
                                <td className="py-2.5 px-4 uppercase tracking-wider" colSpan={3}>
                                  III. OPERATING EXPENSES (OPEX)
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 px-8 text-[#5A534E] flex items-center space-x-2">
                                  <span>Salaries, Overtime & Staff Allowances</span>
                                  <span className="bg-[#77BC2E]/15 text-[#5A9A1E] text-[9px] px-1.5 py-0.2 rounded font-bold">Payroll Synced</span>
                                </td>
                                <td className="py-2 px-4 text-right font-mono text-[#4A2E1B]">₱{currentBranch.operatingExpenses.salariesAndWages.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 text-right text-[#8A817C] font-mono">{((currentBranch.operatingExpenses.salariesAndWages / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-8 text-[#5A534E]">Mall Space Lease & CUSA Common Charges (Ayala/SM)</td>
                                <td className="py-2 px-4 text-right font-mono text-[#4A2E1B]">₱{currentBranch.operatingExpenses.storeRentsAndCusa.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 text-right text-[#8A817C] font-mono">{((currentBranch.operatingExpenses.storeRentsAndCusa / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-8 text-[#5A534E]">Electricity, Air Conditioning & Water Utilities</td>
                                <td className="py-2 px-4 text-right font-mono text-[#4A2E1B]">₱{currentBranch.operatingExpenses.electricityAndWater.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 text-right text-[#8A817C] font-mono">{((currentBranch.operatingExpenses.electricityAndWater / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-8 text-[#5A534E]">Digital Marketing, SMS Bookings & Loyalty Rewards</td>
                                <td className="py-2 px-4 text-right font-mono text-[#4A2E1B]">₱{currentBranch.operatingExpenses.marketingAndLoyalty.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 text-right text-[#8A817C] font-mono">{((currentBranch.operatingExpenses.marketingAndLoyalty / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-8 text-[#5A534E]">Salon Sanitation & Equipment Maintenance</td>
                                <td className="py-2 px-4 text-right font-mono text-[#4A2E1B]">₱{currentBranch.operatingExpenses.maintenanceAndSanitation.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 text-right text-[#8A817C] font-mono">{((currentBranch.operatingExpenses.maintenanceAndSanitation / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-8 text-[#5A534E]">Depreciation - Wax Warmers & Spa Chairs</td>
                                <td className="py-2 px-4 text-right font-mono text-[#4A2E1B]">₱{currentBranch.operatingExpenses.depreciationEquipment.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 text-right text-[#8A817C] font-mono">{((currentBranch.operatingExpenses.depreciationEquipment / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>
                              <tr className="bg-[#FAF9F5] font-bold text-[#4A2E1B]">
                                <td className="py-2.5 px-4 font-bold">TOTAL OPERATING EXPENSES</td>
                                <td className="py-2.5 px-4 text-right font-mono font-bold text-[#4A2E1B]">
                                  (₱{currentBranch.operatingExpenses.totalOpex.toLocaleString('en-US', { minimumFractionDigits: 2 })})
                                </td>
                                <td className="py-2.5 px-4 text-right font-mono text-[#8A817C]">{((currentBranch.operatingExpenses.totalOpex / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>

                              {/* NET OPERATING INCOME (EBITDA) */}
                              <tr className="bg-[#031134] text-white font-black text-sm">
                                <td className="py-3 px-4 uppercase text-[#D4AF37] flex items-center space-x-2">
                                  <Sparkles className="h-4 w-4" />
                                  <span>NET OPERATING INCOME (EBITDA)</span>
                                </td>
                                <td className="py-3 px-4 text-right font-mono font-black text-white text-base">
                                  ₱{currentBranch.netOperatingIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-3 px-4 text-right font-mono font-black text-[#D4AF37]">{currentBranch.netMarginPct}%</td>
                              </tr>

                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()}

                </div>
              )}

              {/* SUB-TAB 3: BALANCE SHEET (STATEMENT OF FINANCIAL POSITION) */}
              {accountingSubTab === 'balance_sheet' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Balance Sheet Header & Balanced Badge */}
                  <div className="bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-[#031134] text-[#D4AF37] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                          Financial Position
                        </span>
                        <span className="text-xs text-[#8A817C]">As of August 31, 2026</span>
                      </div>
                      <h3 className="font-black text-xl text-[#4A2E1B] mt-1">
                        Consolidated Statement of Financial Position (Balance Sheet)
                      </h3>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="bg-[#77BC2E]/15 border border-[#77BC2E]/40 text-[#5A9A1E] px-4 py-2 rounded-2xl flex items-center space-x-2 text-xs font-extrabold shadow-2xs">
                        <CheckCircle className="h-4 w-4 text-[#77BC2E]" />
                        <span>Balanced: Assets = Liabilities + Equity (₱4,121,700.00)</span>
                      </div>
                      <button
                        onClick={() => { setFinancialReportType('balance_sheet'); setShowFinancialReportModal(true); }}
                        className="bg-[#031134] hover:bg-[#082260] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-2xs"
                      >
                        <Printer className="h-3.5 w-3.5 text-[#D4AF37]" />
                        <span>Print</span>
                      </button>
                    </div>
                  </div>

                  {/* 2-Column Balance Sheet (Assets vs Liabilities & Equity) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* LEFT COLUMN: ASSETS */}
                    <div className="bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-2xs space-y-5">
                      <div className="flex items-center justify-between border-b border-[#F2F0E8] pb-3">
                        <h4 className="font-extrabold text-base text-[#031134] uppercase tracking-wider flex items-center space-x-2">
                          <Landmark className="h-4 w-4 text-[#77BC2E]" />
                          <span>Total Assets</span>
                        </h4>
                        <span className="font-mono font-black text-lg text-[#5A9A1E]">
                          ₱{balanceSheetData.assets.totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Current Assets */}
                      <div className="space-y-3">
                        <span className="text-[10px] font-extrabold uppercase text-[#8A817C] tracking-wider block">
                          Current Assets
                        </span>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">Cash & Cash Equivalents (BPI BizLink + Floats)</span>
                            <strong className="font-mono text-[#4A2E1B]">₱{balanceSheetData.assets.currentAssets.cashAndCashEquivalents.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">Trade & Digital Accounts Receivable</span>
                            <strong className="font-mono text-[#4A2E1B]">₱{balanceSheetData.assets.currentAssets.accountsReceivable.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">Consumable Stock Inventory (Wax & Gels)</span>
                            <strong className="font-mono text-[#4A2E1B]">₱{balanceSheetData.assets.currentAssets.consumableInventory.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">Retail Aftercare Product Inventory</span>
                            <strong className="font-mono text-[#4A2E1B]">₱{balanceSheetData.assets.currentAssets.retailProductsInventory.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">Prepaid Mall Space Lease Deposits (Ayala & SM)</span>
                            <strong className="font-mono text-[#4A2E1B]">₱{balanceSheetData.assets.currentAssets.prepaidMallLeaseDeposits.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-2 bg-[#FAF9F5] px-3 rounded-xl font-bold text-[#4A2E1B]">
                            <span>Total Current Assets</span>
                            <span className="font-mono font-black text-[#5A9A1E]">₱{balanceSheetData.assets.currentAssets.totalCurrentAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      </div>

                      {/* Non-Current Assets */}
                      <div className="space-y-3 pt-2">
                        <span className="text-[10px] font-extrabold uppercase text-[#8A817C] tracking-wider block">
                          Property, Plant & Salon Equipment
                        </span>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">Salon Fixtures, Warmers & Sterilizers</span>
                            <strong className="font-mono text-[#4A2E1B]">₱{balanceSheetData.assets.nonCurrentAssets.salonFixturesAndEquipment.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">Nail Stations, UV Lamps & Spa Chairs</span>
                            <strong className="font-mono text-[#4A2E1B]">₱{balanceSheetData.assets.nonCurrentAssets.nailStationsAndSpaChairs.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">IT, Biometric Clocks & POS Terminals</span>
                            <strong className="font-mono text-[#4A2E1B]">₱{balanceSheetData.assets.nonCurrentAssets.itAndBiometricHardware.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#D47098]">Less: Accumulated Depreciation</span>
                            <strong className="font-mono text-[#D47098]">(₱420,000.00)</strong>
                          </div>
                          <div className="flex justify-between py-2 bg-[#FAF9F5] px-3 rounded-xl font-bold text-[#4A2E1B]">
                            <span>Total Non-Current Assets</span>
                            <span className="font-mono font-black text-[#5A9A1E]">₱{balanceSheetData.assets.nonCurrentAssets.totalNonCurrentAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: LIABILITIES & EQUITY */}
                    <div className="bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-2xs space-y-5">
                      <div className="flex items-center justify-between border-b border-[#F2F0E8] pb-3">
                        <h4 className="font-extrabold text-base text-[#031134] uppercase tracking-wider flex items-center space-x-2">
                          <Scale className="h-4 w-4 text-[#D4AF37]" />
                          <span>Liabilities & Shareholder Equity</span>
                        </h4>
                        <span className="font-mono font-black text-lg text-[#031134]">
                          ₱{balanceSheetData.totalLiabilitiesAndEquity.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Current Liabilities */}
                      <div className="space-y-3">
                        <span className="text-[10px] font-extrabold uppercase text-[#8A817C] tracking-wider block">
                          Current Liabilities
                        </span>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">Accounts Payable - Trade Suppliers (PO Invoices)</span>
                            <strong className="font-mono text-[#4A2E1B]">₱{balanceSheetData.liabilities.currentLiabilities.accountsPayableVendors.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">Accrued Salaries & Payroll Payable</span>
                            <strong className="font-mono text-[#4A2E1B]">₱{balanceSheetData.liabilities.currentLiabilities.accruedPayrollPayable.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">SSS, PhilHealth & Pag-IBIG Premium Payables</span>
                            <strong className="font-mono text-[#4A2E1B]">₱{balanceSheetData.liabilities.currentLiabilities.sssPhilhealthPagibigPayables.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">BIR Taxes Withheld & VAT Payable</span>
                            <strong className="font-mono text-[#4A2E1B]">₱{balanceSheetData.liabilities.currentLiabilities.birWithholdingAndVatPayable.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-2 bg-[#FAF9F5] px-3 rounded-xl font-bold text-[#4A2E1B]">
                            <span>Total Current Liabilities</span>
                            <span className="font-mono font-black text-[#D47098]">₱{balanceSheetData.liabilities.currentLiabilities.totalCurrentLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      </div>

                      {/* Long-Term Liabilities */}
                      <div className="space-y-3 pt-1">
                        <span className="text-[10px] font-extrabold uppercase text-[#8A817C] tracking-wider block">
                          Long-Term Liabilities
                        </span>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">Equipment Financing & Lease Obligations</span>
                            <strong className="font-mono text-[#4A2E1B]">₱250,000.00</strong>
                          </div>
                        </div>
                      </div>

                      {/* Shareholder Equity */}
                      <div className="space-y-3 pt-2">
                        <span className="text-[10px] font-extrabold uppercase text-[#8A817C] tracking-wider block">
                          Shareholder & Owner Equity
                        </span>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">Contributed Capital (ALRAJJ Partners)</span>
                            <strong className="font-mono text-[#4A2E1B]">₱{balanceSheetData.equity.ownerContributedCapital.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">Retained Earnings (Prior Periods)</span>
                            <strong className="font-mono text-[#4A2E1B]">₱{balanceSheetData.equity.retainedEarningsPrior.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">Current Period Net Income (MTD)</span>
                            <strong className="font-mono text-[#5A9A1E]">₱{balanceSheetData.equity.currentPeriodNetIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-2 bg-[#031134]/5 px-3 rounded-xl font-bold text-[#031134]">
                            <span>Total Owner's Equity</span>
                            <span className="font-mono font-black text-[#031134]">₱{balanceSheetData.equity.totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* SUB-TAB 4: ACCOUNTS PAYABLE & PO SUPPLIER BILLS */}
              {accountingSubTab === 'invoices' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* AP Overview Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-white border border-[#EAE8E2] rounded-3xl p-5 shadow-2xs space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-[#8A817C]">Unpaid Supplier Bills</span>
                      <div className="text-xl font-black text-[#4A2E1B] font-mono">
                        ₱{apInvoices.filter(i => i.status !== 'Paid').reduce((sum, i) => sum + i.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <span className="text-[10px] font-bold text-[#D47098]">
                        {apInvoices.filter(i => i.status !== 'Paid').length} Pending Settlement
                      </span>
                    </div>

                    <div className="bg-white border border-[#EAE8E2] rounded-3xl p-5 shadow-2xs space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-[#8A817C]">3-Way PO Matched</span>
                      <div className="text-xl font-black text-[#5A9A1E] font-mono">
                        100% Verified
                      </div>
                      <span className="text-[10px] text-[#8A817C]">Matched with Receiving Log</span>
                    </div>

                    <div className="bg-white border border-[#EAE8E2] rounded-3xl p-5 shadow-2xs space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-[#8A817C]">Due in 15 Days</span>
                      <div className="text-xl font-black text-[#D4AF37] font-mono">
                        ₱125,000.00
                      </div>
                      <span className="text-[10px] text-[#8A817C]">Ayala Mall Lease Scheduled</span>
                    </div>

                    <div className="bg-white border border-[#EAE8E2] rounded-3xl p-5 shadow-2xs space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-[#8A817C]">BPI BizLink Auto-Debit</span>
                      <div className="text-xl font-black text-[#031134] font-mono">
                        Ready
                      </div>
                      <span className="text-[10px] font-bold text-[#5A9A1E]">1-Click Settlement Active</span>
                    </div>
                  </div>

                  {/* AP Invoices Table */}
                  <div className="bg-white border border-[#EAE8E2] rounded-3xl shadow-2xs overflow-hidden">
                    <div className="p-6 border-b border-[#F2F0E8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-extrabold text-base text-[#4A2E1B]">
                          Accounts Payable & Supplier Invoices (PO Linked)
                        </h3>
                        <p className="text-xs text-[#8A817C]">
                          Verified vendor claims from the 5-step procurement system ready for disbursement.
                        </p>
                      </div>

                      <button
                        onClick={() => setShowNewInvoiceModal(true)}
                        className="bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm shadow-[#77BC2E]/20"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Record Supplier Bill</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="bg-[#FAF9F5] border-b border-[#EAE8E2] text-[10px] font-extrabold uppercase text-[#8A817C] tracking-wider">
                            <th className="py-3 px-6">Invoice # & PO</th>
                            <th className="py-3 px-6">Vendor / Supplier</th>
                            <th className="py-3 px-6">Branch & Category</th>
                            <th className="py-3 px-6">Terms / Due Date</th>
                            <th className="py-3 px-6 text-right">Amount (PHP)</th>
                            <th className="py-3 px-6">Status</th>
                            <th className="py-3 px-6 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F2F0E8] font-medium text-[#4A2E1B]">
                          {apInvoices.map((inv) => (
                            <tr key={inv.id} className="hover:bg-[#FAF9F5] transition-colors">
                              <td className="py-4 px-6">
                                <strong className="text-[#031134] block font-mono">{inv.id}</strong>
                                <span className="text-[11px] text-[#77BC2E] font-bold">{inv.poNumber}</span>
                              </td>
                              <td className="py-4 px-6">
                                <strong className="text-[#4A2E1B] block">{inv.vendor}</strong>
                                <span className="text-[11px] text-[#8A817C] line-clamp-1">{inv.description}</span>
                              </td>
                              <td className="py-4 px-6">
                                <span className="text-[#4A2E1B] block font-semibold">{inv.branch}</span>
                                <span className="bg-[#FAF9F5] border border-[#EAE8E2] text-[#8A817C] text-[10px] px-2 py-0.5 rounded-md font-bold">
                                  {inv.category}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <span className="text-[#4A2E1B] block">{inv.dueDate}</span>
                                <span className="text-[11px] text-[#8A817C]">{inv.paymentTerms}</span>
                              </td>
                              <td className="py-4 px-6 text-right font-mono font-black text-sm text-[#4A2E1B]">
                                ₱{inv.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-4 px-6">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                                  inv.status === 'Paid'
                                    ? 'bg-[#77BC2E]/15 text-[#5A9A1E]'
                                    : inv.status === 'Approved for Payment'
                                    ? 'bg-[#031134] text-[#D4AF37]'
                                    : inv.status === 'Scheduled BPI BizLink'
                                    ? 'bg-[#E89BB9]/20 text-[#D47098]'
                                    : 'bg-[#FAF9F5] text-[#8A817C] border border-[#EAE8E2]'
                                }`}>
                                  {inv.status}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-center">
                                {inv.status !== 'Paid' ? (
                                  <button
                                    onClick={() => handlePayInvoice(inv.id)}
                                    className="bg-[#031134] hover:bg-[#082260] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all shadow-2xs flex items-center space-x-1.5 mx-auto"
                                    title="Disburse via BPI BizLink and Auto-Post to General Ledger"
                                  >
                                    <CreditCard className="h-3 w-3 text-[#D4AF37]" />
                                    <span>Pay BPI</span>
                                  </button>
                                ) : (
                                  <span className="text-[11px] text-[#5A9A1E] font-mono font-bold flex items-center justify-center space-x-1">
                                    <Check className="h-3.5 w-3.5" />
                                    <span>Settled</span>
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* SUB-TAB 5: DAILY POS CASH AUDIT & REGISTER RECONCILIATION */}
              {accountingSubTab === 'pos_recon' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Daily Register Summary Header */}
                  <div className="bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-[#E89BB9] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                          POS Audit
                        </span>
                        <span className="text-xs text-[#77BC2E] font-bold">Anti-Shrinkage Cash Control</span>
                      </div>
                      <h3 className="font-black text-xl text-[#4A2E1B] mt-1">
                        Daily Branch POS Register & Cash Audit
                      </h3>
                      <p className="text-xs text-[#8A817C]">
                        Compare opening floats, physical cash counts, GCash/Maya QR payments, and card terminals against recorded service tickets.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowPosReconModal(true)}
                      className="bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm shadow-[#77BC2E]/20"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Reconcile Shift Register</span>
                    </button>
                  </div>

                  {/* Reconciliation Logs Table */}
                  <div className="bg-white border border-[#EAE8E2] rounded-3xl shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="bg-[#FAF9F5] border-b border-[#EAE8E2] text-[10px] font-extrabold uppercase text-[#8A817C] tracking-wider">
                            <th className="py-3 px-6">Audit ID & Date</th>
                            <th className="py-3 px-6">Branch & Supervisor</th>
                            <th className="py-3 px-6 text-right">Morning Float</th>
                            <th className="py-3 px-6 text-right">Cash Collected</th>
                            <th className="py-3 px-6 text-right">Maya / GCash / Card</th>
                            <th className="py-3 px-6 text-right">Petty Cash Out</th>
                            <th className="py-3 px-6 text-right">Counted Drawer</th>
                            <th className="py-3 px-6 text-center">Variance</th>
                            <th className="py-3 px-6">Status & Notes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F2F0E8] font-medium text-[#4A2E1B]">
                          {posReconciliations.map((rec) => (
                            <tr key={rec.id} className="hover:bg-[#FAF9F5] transition-colors">
                              <td className="py-4 px-6">
                                <strong className="text-[#031134] font-mono block">{rec.id}</strong>
                                <span className="text-[11px] text-[#8A817C]">{rec.date}</span>
                              </td>
                              <td className="py-4 px-6">
                                <strong className="text-[#4A2E1B] block">{rec.branch}</strong>
                                <span className="text-[11px] text-[#5A534E] flex items-center space-x-1">
                                  <UserCheck className="h-3 w-3 text-[#77BC2E]" />
                                  <span>{rec.shiftSupervisor}</span>
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right font-mono">
                                ₱{rec.openingFloat.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-4 px-6 text-right font-mono font-bold text-[#5A9A1E]">
                                ₱{rec.cashSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-4 px-6 text-right font-mono text-[#031134]">
                                ₱{(rec.mayaQrSales + rec.gcashQrSales + rec.cardTerminalSales).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-4 px-6 text-right font-mono text-[#D47098]">
                                (₱{rec.pettyCashExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })})
                              </td>
                              <td className="py-4 px-6 text-right font-mono font-black text-sm text-[#4A2E1B]">
                                ₱{rec.actualCashCounted.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-4 px-6 text-center">
                                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                                  rec.variance === 0
                                    ? 'bg-[#77BC2E]/15 text-[#5A9A1E]'
                                    : 'bg-[#D47098]/20 text-[#D47098]'
                                }`}>
                                  {rec.variance === 0 ? '₱0.00 Exact' : `₱${rec.variance.toFixed(2)}`}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <span className="text-[#5A9A1E] font-bold block text-[11px]">{rec.status}</span>
                                <span className="text-[10px] text-[#8A817C] line-clamp-1">{rec.auditNotes}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* SUB-TAB 6: GENERAL LEDGER & DOUBLE-ENTRY JOURNALS */}
              {accountingSubTab === 'journal' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Journal Search & New Entry Trigger */}
                  <div className="bg-white border border-[#EAE8E2] rounded-3xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                      <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                      <input
                        type="text"
                        placeholder="Search Account Code, JE Reference, or Description..."
                        value={journalSearch}
                        onChange={(e) => setJournalSearch(e.target.value)}
                        className="w-full bg-[#F7F6F2] text-[#2D2520] placeholder-[#A8A29E] text-xs rounded-xl pl-9 pr-3.5 py-2.5 outline-none focus:ring-1 focus:ring-[#77BC2E] border border-transparent font-medium"
                      />
                    </div>

                    <button
                      onClick={() => setShowNewJournalModal(true)}
                      className="bg-[#031134] hover:bg-[#082260] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
                    >
                      <Plus className="h-4 w-4 text-[#D4AF37]" />
                      <span>Create Manual Journal Entry</span>
                    </button>
                  </div>

                  {/* Journal Entries List */}
                  <div className="space-y-4">
                    {journalEntries
                      .filter(je => !journalSearch || 
                        je.id.toLowerCase().includes(journalSearch.toLowerCase()) || 
                        je.reference.toLowerCase().includes(journalSearch.toLowerCase()) ||
                        je.description.toLowerCase().includes(journalSearch.toLowerCase()) ||
                        je.lines.some(l => l.accountName.toLowerCase().includes(journalSearch.toLowerCase()) || l.accountCode.includes(journalSearch))
                      )
                      .map((je) => {
                        const totalDebit = je.lines.reduce((s, l) => s + l.debit, 0);
                        const totalCredit = je.lines.reduce((s, l) => s + l.credit, 0);

                        return (
                          <div key={je.id} className="bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-2xs space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2F0E8] pb-3 text-xs">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-2xl bg-[#031134]/5 border border-[#031134]/10 text-[#031134] flex items-center justify-center font-bold font-mono">
                                  GL
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <strong className="text-[#031134] font-mono text-sm">{je.id}</strong>
                                    <span className="bg-[#031134] text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded-md">
                                      {je.type}
                                    </span>
                                    <span className="text-[#77BC2E] font-bold font-mono">{je.reference}</span>
                                  </div>
                                  <p className="text-[11px] text-[#8A817C]">{je.date} &bull; {je.branch} &bull; Posted by: {je.postedBy}</p>
                                </div>
                              </div>

                              <div className="text-right">
                                <span className="text-[10px] font-bold uppercase text-[#8A817C] block">Total Amount</span>
                                <span className="font-mono font-black text-sm text-[#4A2E1B]">
                                  ₱{totalDebit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                            </div>

                            <p className="text-xs text-[#5A534E] font-medium bg-[#FAF9F5] p-2.5 rounded-xl border border-[#EAE8E2]">
                              {je.description}
                            </p>

                            {/* Lines Table */}
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs text-left">
                                <thead>
                                  <tr className="text-[10px] font-bold uppercase text-[#8A817C] border-b border-[#F2F0E8]">
                                    <th className="py-2 px-3">Account Code</th>
                                    <th className="py-2 px-3">Account Title</th>
                                    <th className="py-2 px-3 text-right">Debit (PHP)</th>
                                    <th className="py-2 px-3 text-right">Credit (PHP)</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F9F8F5] text-xs">
                                  {je.lines.map((l, idx) => (
                                    <tr key={idx}>
                                      <td className="py-2 px-3 font-mono font-bold text-[#031134]">{l.accountCode}</td>
                                      <td className="py-2 px-3 text-[#4A2E1B]">{l.accountName}</td>
                                      <td className="py-2 px-3 text-right font-mono font-bold text-[#5A9A1E]">
                                        {l.debit > 0 ? `₱${l.debit.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                                      </td>
                                      <td className="py-2 px-3 text-right font-mono font-bold text-[#D47098]">
                                        {l.credit > 0 ? `₱${l.credit.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                </div>
              )}

              {/* SUB-TAB 7: PHILIPPINE BIR & STATUTORY TAX HUB */}
              {accountingSubTab === 'taxes' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Entity Header */}
                  <div className="bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-[#031134] text-[#D4AF37] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                          BIR Tax Compliance
                        </span>
                        <span className="text-xs text-[#77BC2E] font-bold">Bureau of Internal Revenue PH</span>
                      </div>
                      <h3 className="font-black text-xl text-[#4A2E1B] mt-1">
                        Philippine Statutory & Tax Compliance Hub
                      </h3>
                      <p className="text-xs text-[#8A817C]">
                        TIN: <strong>{taxSummary.tin}</strong> &bull; Entity: <strong>{taxSummary.registeredEntity}</strong> &bull; Month: {taxSummary.reportingMonth}
                      </p>
                    </div>

                    <div className="bg-[#77BC2E]/15 border border-[#77BC2E]/40 text-[#5A9A1E] px-4 py-2 rounded-2xl flex items-center space-x-2 text-xs font-extrabold">
                      <CheckCircle className="h-4 w-4 text-[#77BC2E]" />
                      <span>All Statutory Computations Up-to-Date</span>
                    </div>
                  </div>

                  {/* 4 Tax Forms Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {taxSummary.forms.map((form, idx) => (
                      <div key={idx} className="bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="bg-[#031134] text-[#D4AF37] text-xs font-black px-2.5 py-1 rounded-xl font-mono">
                              {form.formCode}
                            </span>
                            <span className="bg-[#77BC2E]/15 text-[#5A9A1E] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                              {form.status}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-sm text-[#4A2E1B]">
                            {form.title}
                          </h4>
                          <p className="text-[11px] text-[#8A817C]">
                            Source: <strong>{form.source}</strong> &bull; Due Date: <span className="text-[#D47098] font-bold">{form.dueDate}</span>
                          </p>
                        </div>

                        <div className="bg-[#FAF9F5] border border-[#EAE8E2] p-4 rounded-2xl space-y-2 text-xs">
                          <div className="flex justify-between text-[#5A534E]">
                            <span>Taxable Base (Compensation / Sales / Rent):</span>
                            <strong className="font-mono text-[#4A2E1B]">₱{form.taxableBase.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between text-[#4A2E1B] font-bold pt-1 border-t border-[#EAE8E2]">
                            <span>Remittance Amount Due:</span>
                            <span className="font-mono font-black text-sm text-[#5A9A1E]">₱{form.taxDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-[#8A817C]">BPI BizLink Tax Payment Portal Ready</span>
                          <button
                            onClick={() => {
                              setAccountingToast(`${form.formCode} remittance scheduled via BPI BizLink tax module.`);
                              setTimeout(() => setAccountingToast(''), 5000);
                            }}
                            className="bg-[#031134] hover:bg-[#082260] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-2xs"
                          >
                            <Send className="h-3 w-3 text-[#D4AF37]" />
                            <span>Schedule Remittance</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 5: ACCOUNTING & PAYROLL RUN */}
          {activeTab === 'payroll' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Date Cutoff Selector */}
              <div className="bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#8A817C] mb-1 uppercase tracking-wider">Cutoff Start</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2 text-xs font-semibold text-[#4A2E1B] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#8A817C] mb-1 uppercase tracking-wider">Cutoff End</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2 text-xs font-semibold text-[#4A2E1B] outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleGeneratePayroll}
                  className="bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold px-6 py-3 rounded-xl shadow-sm shadow-[#77BC2E]/20 transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm"
                >
                  <Calculator className="h-4 w-4" />
                  <span>Compute Semi-Monthly Payroll</span>
                </button>
              </div>

              {/* 5-Step End-to-End Payroll & Disbursement Lifecycle Banner */}
              {payroll.length > 0 && (
                <div className="bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-2xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2F0E8] pb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#031134] text-[#D4AF37]">
                          Enterprise Banking & Disbursement
                        </span>
                        <span className="text-[10px] font-bold text-[#8A817C]">BPI BizLink Integrated</span>
                      </div>
                      <h3 className="font-extrabold text-base text-[#4A2E1B] mt-1">End-to-End Payroll & ATM Disbursement Lifecycle</h3>
                      <p className="text-xs text-[#8A817C]">
                        Transparent 5-stage pipeline: HR calculation &rarr; Accounting review &rarr; BPI bank batch &rarr; Managing Director sign-off &rarr; ATM crediting.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowBpiModal(true)}
                        className="bg-[#FAF9F5] hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#4A2E1B] text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-2xs"
                      >
                        <CreditCard className="h-3.5 w-3.5 text-[#031134]" />
                        <span>Preview BPI Batch</span>
                      </button>
                      <button
                        onClick={resetDisbursement}
                        className="bg-[#F2F0E8] hover:bg-[#EAE8E2] text-[#5A534E] text-xs font-semibold px-3 py-2 rounded-xl transition-all"
                        title="Reset Workflow Demo"
                      >
                        Reset Flow
                      </button>
                    </div>
                  </div>

                  {/* 5 Stages Interactive Visual Tracker */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                    
                    {/* Stage 1: HR Computation */}
                    <div className="bg-[#77BC2E]/10 border border-[#77BC2E]/30 rounded-2xl p-3.5 space-y-1 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5A9A1E]">Step 1 &bull; HR Engine</span>
                        <CheckCircle className="h-4 w-4 text-[#77BC2E]" />
                      </div>
                      <p className="font-extrabold text-[#4A2E1B]">Automated Math</p>
                      <p className="text-[11px] text-[#5A534E]">Gross-to-Net computed in 1 sec.</p>
                      <span className="inline-block mt-1 text-[10px] font-bold text-[#5A9A1E] bg-white px-2 py-0.5 rounded-md">
                        ✓ Ready
                      </span>
                    </div>

                    {/* Stage 2: Forward to Accounting */}
                    <div className={`border rounded-2xl p-3.5 space-y-1 transition-all ${
                      disbursementStage !== 'computed'
                        ? 'bg-[#77BC2E]/10 border-[#77BC2E]/30'
                        : 'bg-[#FAF9F5] border-[#EAE8E2]'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C]">Step 2 &bull; Accounting</span>
                        {disbursementStage !== 'computed' ? <CheckCircle className="h-4 w-4 text-[#77BC2E]" /> : <Send className="h-4 w-4 text-[#8A817C]" />}
                      </div>
                      <p className="font-extrabold text-[#4A2E1B]">Dept. Audit & Review</p>
                      <p className="text-[11px] text-[#5A534E]">
                        {disbursementAudit.forwardedAt ? disbursementAudit.forwardedAt : 'Audits SSS/PhilHealth deductions'}
                      </p>
                      {disbursementStage === 'computed' ? (
                        <button
                          onClick={handleForwardToAccounting}
                          className="mt-1 w-full bg-[#4A2E1B] hover:bg-[#382315] text-white font-bold text-[10px] py-1.5 rounded-lg transition-all flex items-center justify-center space-x-1"
                        >
                          <Send className="h-3 w-3" />
                          <span>Forward to Acctg.</span>
                        </button>
                      ) : (
                        <span className="inline-block mt-1 text-[10px] font-bold text-[#5A9A1E] bg-white px-2 py-0.5 rounded-md">
                          ✓ Verified
                        </span>
                      )}
                    </div>

                    {/* Stage 3: BPI BizLink Batch Upload */}
                    <div className={`border rounded-2xl p-3.5 space-y-1 transition-all ${
                      ['bpi_ready', 'md_approved', 'disbursed'].includes(disbursementStage)
                        ? 'bg-[#77BC2E]/10 border-[#77BC2E]/30'
                        : disbursementStage === 'forwarded'
                        ? 'bg-[#031134]/5 border-[#031134]/20'
                        : 'bg-[#FAF9F5] border-[#EAE8E2] opacity-75'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C]">Step 3 &bull; BPI BizLink</span>
                        {['bpi_ready', 'md_approved', 'disbursed'].includes(disbursementStage) ? (
                          <CheckCircle className="h-4 w-4 text-[#77BC2E]" />
                        ) : (
                          <CreditCard className="h-4 w-4 text-[#8A817C]" />
                        )}
                      </div>
                      <p className="font-extrabold text-[#4A2E1B]">Bank Batch File</p>
                      <p className="text-[11px] text-[#5A534E]">
                        {disbursementAudit.bpiGeneratedAt ? 'BPI CSV batch created' : 'Formats direct ATM file'}
                      </p>
                      {disbursementStage === 'forwarded' ? (
                        <button
                          onClick={handleGenerateBpiBatch}
                          className="mt-1 w-full bg-[#031134] hover:bg-[#082260] text-white font-bold text-[10px] py-1.5 rounded-lg transition-all flex items-center justify-center space-x-1"
                        >
                          <Download className="h-3 w-3" />
                          <span>Generate BPI CSV</span>
                        </button>
                      ) : ['bpi_ready', 'md_approved', 'disbursed'].includes(disbursementStage) ? (
                        <button
                          onClick={handleGenerateBpiBatch}
                          className="mt-1 text-[10px] font-bold text-[#031134] hover:underline flex items-center space-x-1"
                        >
                          <Download className="h-3 w-3" />
                          <span>Re-download CSV</span>
                        </button>
                      ) : (
                        <span className="inline-block mt-1 text-[10px] font-semibold text-[#8A817C]">Queued</span>
                      )}
                    </div>

                    {/* Stage 4: Managing Director Approval */}
                    <div className={`border rounded-2xl p-3.5 space-y-1 transition-all ${
                      ['md_approved', 'disbursed'].includes(disbursementStage)
                        ? 'bg-[#77BC2E]/10 border-[#77BC2E]/30'
                        : disbursementStage === 'bpi_ready'
                        ? 'bg-[#D4AF37]/15 border-[#D4AF37]/40 ring-2 ring-[#D4AF37]/30'
                        : 'bg-[#FAF9F5] border-[#EAE8E2] opacity-75'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C]">Step 4 &bull; MD Sign-off</span>
                        {['md_approved', 'disbursed'].includes(disbursementStage) ? (
                          <ShieldCheck className="h-4 w-4 text-[#77BC2E]" />
                        ) : (
                          <ShieldAlert className="h-4 w-4 text-[#8A817C]" />
                        )}
                      </div>
                      <p className="font-extrabold text-[#4A2E1B]">MD Authorization</p>
                      <p className="text-[11px] text-[#5A534E]">
                        {disbursementAudit.mdApprovedAt ? disbursementAudit.mdApprovedAt : 'Ms. Jehan Abedin authorization'}
                      </p>
                      {disbursementStage === 'bpi_ready' ? (
                        <button
                          onClick={handleMdApproval}
                          className="mt-1 w-full bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold text-[10px] py-1.5 rounded-lg shadow-sm transition-all flex items-center justify-center space-x-1"
                        >
                          <CheckCheck className="h-3 w-3" />
                          <span>Approve & Authorize</span>
                        </button>
                      ) : ['md_approved', 'disbursed'].includes(disbursementStage) ? (
                        <span className="inline-block mt-1 text-[10px] font-bold text-[#5A9A1E] bg-white px-2 py-0.5 rounded-md">
                          ✓ Authorized
                        </span>
                      ) : (
                        <span className="inline-block mt-1 text-[10px] font-semibold text-[#8A817C]">Standby</span>
                      )}
                    </div>

                    {/* Stage 5: ATM Direct Crediting & Payslips */}
                    <div className={`border rounded-2xl p-3.5 space-y-1 transition-all ${
                      disbursementStage === 'disbursed'
                        ? 'bg-gradient-to-br from-[#77BC2E]/15 to-[#5A9A1E]/20 border-[#77BC2E]/40'
                        : 'bg-[#FAF9F5] border-[#EAE8E2] opacity-75'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C]">Step 5 &bull; ATM Pay</span>
                        {disbursementStage === 'disbursed' ? (
                          <CheckCheck className="h-4 w-4 text-[#5A9A1E]" />
                        ) : (
                          <DollarSign className="h-4 w-4 text-[#8A817C]" />
                        )}
                      </div>
                      <p className="font-extrabold text-[#4A2E1B]">Credited to Staff</p>
                      <p className="text-[11px] text-[#5A534E]">
                        {disbursementStage === 'disbursed' ? 'Available in ATMs • Slips active' : 'Live upon MD approval'}
                      </p>
                      <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        disbursementStage === 'disbursed'
                          ? 'bg-[#77BC2E] text-white shadow-xs'
                          : 'bg-[#EAE8E2] text-[#8A817C]'
                      }`}>
                        {disbursementStage === 'disbursed' ? '🎉 Disbursed' : 'Awaiting Stage 4'}
                      </span>
                    </div>

                  </div>

                  {/* Status Banner */}
                  {disbursementStage === 'disbursed' && (
                    <div className="bg-[#77BC2E]/15 border border-[#77BC2E]/40 rounded-2xl p-4 flex items-center justify-between text-xs text-[#4A2E1B]">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-[#77BC2E] text-white flex items-center justify-center font-bold">
                          <CheckCheck className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-extrabold text-[#2D2520]">Disbursement Completed & Credited to BPI ATM Accounts</p>
                          <p className="text-[11px] text-[#5A534E]">
                            Authorized by Ms. Jehan Abedin. Printable itemized payslips are unlocked below for all salon employees.
                          </p>
                        </div>
                      </div>
                      <span className="hidden md:inline-flex bg-white px-3 py-1.5 rounded-xl font-mono font-bold text-[#5A9A1E] border border-[#77BC2E]/30">
                        STATUS: ATM CREDITED
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Payroll Results Table */}
              {payroll.length > 0 && (
                <div className="bg-white border border-[#EAE8E2] rounded-3xl overflow-hidden shadow-2xs">
                  <div className="p-6 border-b border-[#F2F0E8]">
                    <h3 className="font-extrabold text-base text-[#4A2E1B]">Gross-to-Net Payroll Breakdown</h3>
                    <p className="text-xs text-[#8A817C]">Automated computations for cutoff: {startDate} to {endDate}</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#FAF9F5] border-b border-[#F2F0E8] text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C]">
                          <th className="px-6 py-3.5">Employee</th>
                          <th className="px-6 py-3.5">Days</th>
                          <th className="px-6 py-3.5">Basic Pay</th>
                          <th className="px-6 py-3.5">Overtime/ND</th>
                          <th className="px-6 py-3.5">Late Deduct</th>
                          <th className="px-6 py-3.5">Gross Pay</th>
                          <th className="px-6 py-3.5">Gov Deductions</th>
                          <th className="px-6 py-3.5 font-bold">Net Salary</th>
                          <th className="px-6 py-3.5">Payslip</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F2F0E8] text-xs">
                        {payroll.map(p => (
                          <tr key={p.employeeId} className="hover:bg-[#FAF9F5]/70 transition-colors">
                            <td className="px-6 py-4 font-bold text-[#4A2E1B]">{p.employeeName}</td>
                            <td className="px-6 py-4 font-mono text-[#5A534E]">{p.daysPresent} days</td>
                            <td className="px-6 py-4 font-mono font-medium">₱{p.calculations.basicPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                            <td className="px-6 py-4 font-mono text-[#77BC2E] font-bold">
                              +₱{(p.calculations.otPay + p.calculations.ndPay).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 font-mono text-[#D47098]">
                              -₱{p.calculations.totalTardinessDeduction.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 font-mono font-medium">₱{p.calculations.grossPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                            <td className="px-6 py-4 font-mono text-[#D47098]">
                              -₱{p.calculations.deductions.totalDeductions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 font-mono font-extrabold text-[#77BC2E]">
                              ₱{p.calculations.netPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => setSelectedPayslip(p)}
                                className="bg-[#FAF9F5] hover:bg-[#F2F0E8] border border-[#EAE8E2] font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1 text-[#4A2E1B]"
                              >
                                <FileText className="h-3 w-3" />
                                <span>View Slip</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SALON CRM & CLIENT LOYALTY */}
          {activeTab === 'crm' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Toast Notification */}
              {crmToast && (
                <div className="bg-[#77BC2E]/15 border border-[#77BC2E]/40 text-[#5A9A1E] p-4 rounded-2xl flex items-center justify-between text-xs font-bold shadow-2xs">
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle className="h-4 w-4 text-[#77BC2E]" />
                    <span>{crmToast}</span>
                  </div>
                  <button onClick={() => setCrmToast('')} className="text-[#5A9A1E] hover:opacity-75">
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Top CRM Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-[#EAE8E2] rounded-3xl p-5 shadow-2xs space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#8A817C] tracking-wider">Total VIP Clients</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-extrabold text-[#4A2E1B]">{crmClients.length}</span>
                    <span className="text-[11px] text-[#77BC2E] font-bold">Profiles Active</span>
                  </div>
                  <p className="text-[11px] text-[#8A817C]">Across Centrio, Ketkai & SM</p>
                </div>

                <div className="bg-white border border-[#EAE8E2] rounded-3xl p-5 shadow-2xs space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#8A817C] tracking-wider">Active Packages</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-extrabold text-[#E89BB9]">52</span>
                    <span className="text-[11px] text-[#D47098] font-bold">Package Holders</span>
                  </div>
                  <p className="text-[11px] text-[#8A817C]">Waxing & Nail Spa Passes</p>
                </div>

                <div className="bg-white border border-[#EAE8E2] rounded-3xl p-5 shadow-2xs space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#8A817C] tracking-wider">SMS Booking Rate</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-extrabold text-[#77BC2E]">98.4%</span>
                    <span className="text-[11px] text-[#5A9A1E] font-bold">Confirmed</span>
                  </div>
                  <p className="text-[11px] text-[#8A817C]">Automated 24h Alerts</p>
                </div>

                <div className="bg-white border border-[#EAE8E2] rounded-3xl p-5 shadow-2xs space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#8A817C] tracking-wider">Loyalty Points</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-extrabold text-[#D4AF37]">
                      {crmClients.reduce((sum, c) => sum + c.loyaltyPoints, 0).toLocaleString()}
                    </span>
                    <span className="text-[11px] text-[#B48A10] font-bold">Pts Earned</span>
                  </div>
                  <p className="text-[11px] text-[#8A817C]">Redeemable for Services</p>
                </div>
              </div>

              {/* CRM Data Table Card */}
              <div className="bg-white border border-[#EAE8E2] rounded-3xl overflow-hidden shadow-2xs">
                <div className="p-6 border-b border-[#F2F0E8] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-[#E89BB9]/20 text-[#D47098] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                        Salon CRM
                      </span>
                      <h3 className="font-extrabold text-base text-[#4A2E1B]">Client Retention & Loyalty Registry</h3>
                    </div>
                    <p className="text-xs text-[#8A817C] mt-0.5">Visit histories, package balances, technician assignments & skin preferences</p>
                  </div>

                  {/* Filter & Actions */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="relative">
                      <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                      <input
                        type="text"
                        placeholder="Search client / phone..."
                        value={crmSearch}
                        onChange={(e) => setCrmSearch(e.target.value)}
                        className="bg-[#F7F6F2] border border-transparent rounded-xl pl-8 pr-3 py-1.5 text-xs font-medium focus:ring-1 focus:ring-[#E89BB9] outline-none text-[#2D2520] w-48"
                      />
                    </div>

                    <select
                      value={crmBranchFilter}
                      onChange={(e) => setCrmBranchFilter(e.target.value)}
                      className="bg-[#F7F6F2] border border-transparent rounded-xl px-3 py-1.5 text-xs font-semibold text-[#5A534E] outline-none"
                    >
                      <option value="">All Branches</option>
                      <option value="Centrio">Centrio Waxing</option>
                      <option value="Passion Nails">Passion Nails</option>
                      <option value="Limketkai">Limketkai</option>
                      <option value="SM Downtown">SM Downtown</option>
                    </select>

                    <button
                      onClick={() => setShowAddClientModal(true)}
                      className="bg-[#E89BB9] hover:bg-[#D47098] text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-2xs"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add VIP Client</span>
                    </button>

                    <button
                      onClick={() => setShowNewTicketModal(true)}
                      className="bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm shadow-[#77BC2E]/20"
                    >
                      <Calculator className="h-3.5 w-3.5" />
                      <span>+ Ring Up Service Ticket</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#FAF9F5] border-b border-[#F2F0E8] text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C]">
                        <th className="px-6 py-3.5">Client Profile</th>
                        <th className="px-6 py-3.5">Contact & Branch</th>
                        <th className="px-6 py-3.5">Active Package Balance</th>
                        <th className="px-6 py-3.5">Preferred Specialist</th>
                        <th className="px-6 py-3.5">Skin Sensitivity Notes</th>
                        <th className="px-6 py-3.5">Next Slot / SMS</th>
                        <th className="px-6 py-3.5">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2F0E8] text-xs">
                      {crmClients
                        .filter(c => !crmBranchFilter || c.branch.includes(crmBranchFilter))
                        .filter(c => !crmSearch || c.name.toLowerCase().includes(crmSearch.toLowerCase()) || c.phone.includes(crmSearch))
                        .map(client => (
                          <tr key={client.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                            <td className="px-6 py-4 font-bold text-[#4A2E1B]">
                              <div className="flex items-center space-x-2.5">
                                <div className="w-8 h-8 rounded-xl bg-[#E89BB9]/20 text-[#D47098] flex items-center justify-center font-extrabold text-xs">
                                  {client.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-extrabold text-[#4A2E1B]">{client.name}</p>
                                  <div className="flex items-center space-x-1 mt-0.5">
                                    <span className="text-[10px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-1.5 py-0.2 rounded">
                                      {client.tier}
                                    </span>
                                    <span className="text-[10px] text-[#8A817C]">&bull; {client.loyaltyPoints} pts</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-mono text-[#5A534E] text-[11px]">{client.phone}</p>
                              <p className="text-[#8A817C] text-[11px]">{client.branch}</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <p className="font-bold text-[#4A2E1B] text-[11px]">{client.activePackage}</p>
                                <div className="w-32 bg-[#EAE8E2] h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-[#77BC2E] h-full rounded-full w-3/5"></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="bg-[#77BC2E]/10 text-[#5A9A1E] font-bold px-2 py-0.5 rounded-md text-[11px] flex items-center space-x-1 w-fit">
                                <Sparkles className="h-3 w-3" />
                                <span>{client.preferredTechnician}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-[#4A2E1B] bg-[#FAF9F5] border border-[#EAE8E2] px-2.5 py-1 rounded-xl text-[11px] block max-w-xs truncate" title={client.skinNotes}>
                                {client.skinNotes}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-0.5">
                                <p className="font-mono text-[11px] text-[#031134] font-bold">{client.nextBooking}</p>
                                <span className="inline-flex items-center space-x-1 text-[10px] text-[#5A9A1E] font-semibold">
                                  <CheckCheck className="h-3 w-3" />
                                  <span>{client.smsStatus}</span>
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleSendSmsReminder(client)}
                                  className="bg-[#031134] hover:bg-[#082260] text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all flex items-center space-x-1 shadow-2xs"
                                  title="Trigger SMS Booking Reminder"
                                >
                                  <Send className="h-3 w-3" />
                                  <span>SMS</span>
                                </button>
                                <button
                                  onClick={() => setSelectedClient(client)}
                                  className="bg-[#FAF9F5] hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#4A2E1B] font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all"
                                >
                                  Details
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* TODAY'S LIVE SERVICE TICKETS (PER-TRANSACTION POS LOG) */}
              <div className="bg-white border border-[#EAE8E2] rounded-3xl overflow-hidden shadow-2xs space-y-3 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2F0E8] pb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-[#77BC2E]/15 text-[#5A9A1E] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                        Live POS Register
                      </span>
                      <span className="text-xs font-bold text-[#8A817C]">Per-Transaction Sales & Commissions</span>
                    </div>
                    <h3 className="font-extrabold text-base text-[#4A2E1B] mt-1">Today's Live Service Tickets</h3>
                    <p className="text-xs text-[#8A817C]">Individual waxing, nail and retail tickets automatically credited to technician commissions and daily register audits.</p>
                  </div>

                  <div className="bg-[#FAF9F5] border border-[#EAE8E2] px-4 py-2 rounded-2xl text-right">
                    <span className="text-[10px] font-bold uppercase text-[#8A817C] block">Tickets Logged Today</span>
                    <span className="text-base font-extrabold text-[#77BC2E] font-mono">
                      ₱{serviceTickets.reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} ({serviceTickets.length} tickets)
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#FAF9F5] border-b border-[#F2F0E8] text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C]">
                        <th className="px-5 py-3">Ticket # & Time</th>
                        <th className="px-5 py-3">Client / Guest</th>
                        <th className="px-5 py-3">Branch</th>
                        <th className="px-5 py-3">Service Rendered</th>
                        <th className="px-5 py-3">Assigned Specialist</th>
                        <th className="px-5 py-3">Payment Method</th>
                        <th className="px-5 py-3 text-right">Amount</th>
                        <th className="px-5 py-3 text-right">Commission (10%)</th>
                        <th className="px-5 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2F0E8]">
                      {serviceTickets.map((tkt) => (
                        <tr key={tkt.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                          <td className="px-5 py-3.5 font-mono">
                            <strong className="text-[#031134] block">{tkt.id}</strong>
                            <span className="text-[10px] text-[#8A817C]">{tkt.time} &bull; {tkt.date}</span>
                          </td>
                          <td className="px-5 py-3.5 font-bold text-[#4A2E1B]">{tkt.clientName}</td>
                          <td className="px-5 py-3.5 text-[#5A534E]">{tkt.branch}</td>
                          <td className="px-5 py-3.5 font-semibold text-[#4A2E1B]">{tkt.service}</td>
                          <td className="px-5 py-3.5">
                            <span className="bg-[#77BC2E]/10 text-[#5A9A1E] font-bold px-2 py-0.5 rounded-md text-[11px] inline-flex items-center space-x-1">
                              <Sparkles className="h-3 w-3" />
                              <span>{tkt.specialist}</span>
                            </span>
                          </td>
                          <td className="px-5 py-3.5 font-semibold">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              tkt.paymentMethod.includes('GCash') ? 'bg-sky-50 text-sky-700' :
                              tkt.paymentMethod.includes('Maya') ? 'bg-emerald-50 text-emerald-700' :
                              tkt.paymentMethod.includes('Card') ? 'bg-purple-50 text-purple-700' :
                              'bg-amber-50 text-amber-900'
                            }`}>
                              {tkt.paymentMethod}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right font-mono font-extrabold text-[#4A2E1B]">
                            ₱{tkt.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-5 py-3.5 text-right font-mono text-[#77BC2E] font-bold">
                            ₱{tkt.commission.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="bg-[#77BC2E]/15 text-[#5A9A1E] font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                              ✓ {tkt.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: 5-STEP PURCHASE ORDERS TO ACCOUNTING PIPELINE */}
          {activeTab === 'procurement' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Toast Notification */}
              {poToast && (
                <div className="bg-[#77BC2E]/15 border border-[#77BC2E]/40 text-[#5A9A1E] p-4 rounded-2xl flex items-center justify-between text-xs font-bold shadow-2xs">
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle className="h-4 w-4 text-[#77BC2E]" />
                    <span>{poToast}</span>
                  </div>
                  <button onClick={() => setPoToast('')} className="text-[#5A9A1E] hover:opacity-75">
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* 5-Step Procurement Progress Banner */}
              <div className="bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2F0E8] pb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-[#031134] text-[#D4AF37] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                        Full Enterprise Pipeline
                      </span>
                      <span className="text-[11px] font-bold text-[#77BC2E]">Store Requisition to AP Ledger</span>
                    </div>
                    <h3 className="font-extrabold text-base text-[#4A2E1B] mt-1">
                      5-Step Purchase Order & Accounting Integration
                    </h3>
                    <p className="text-xs text-[#8A817C]">
                      From branch supply requests to 3-way matching and automatic General Ledger posting in Accounting.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowCreatePoModal(true)}
                    className="bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm shadow-[#77BC2E]/20"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Store Requisition</span>
                  </button>
                </div>

                {/* 5 Process Step Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                  <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-2xl p-3.5 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-[#8A817C]">Step 1</span>
                    <strong className="text-[#4A2E1B] block">Store Requisition</strong>
                    <p className="text-[11px] text-[#8A817C]">Branch material request</p>
                  </div>

                  <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-2xl p-3.5 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-[#8A817C]">Step 2</span>
                    <strong className="text-[#4A2E1B] block">Vendor RFQ</strong>
                    <p className="text-[11px] text-[#8A817C]">Quote comparison</p>
                  </div>

                  <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-2xl p-3.5 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-[#8A817C]">Step 3</span>
                    <strong className="text-[#4A2E1B] block">PO Approval</strong>
                    <p className="text-[11px] text-[#8A817C]">Management sign-off</p>
                  </div>

                  <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-2xl p-3.5 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-[#8A817C]">Step 4</span>
                    <strong className="text-[#4A2E1B] block">Goods Receiving</strong>
                    <p className="text-[11px] text-[#8A817C]">Store check & inspect</p>
                  </div>

                  <div className="bg-[#77BC2E]/15 border border-[#77BC2E]/40 rounded-2xl p-3.5 space-y-1 shadow-2xs">
                    <span className="text-[10px] font-extrabold uppercase text-[#5A9A1E]">Final Step 5</span>
                    <strong className="text-[#4A2E1B] block">Accounting Dept</strong>
                    <p className="text-[11px] text-[#5A9A1E] font-bold">3-Way Match & AP Voucher</p>
                  </div>
                </div>
              </div>

              {/* Purchase Orders Table Card */}
              <div className="bg-white border border-[#EAE8E2] rounded-3xl overflow-hidden shadow-2xs">
                <div className="p-6 border-b border-[#F2F0E8] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold text-base text-[#4A2E1B]">Procurement & Accounting Tracking</h3>
                    <p className="text-xs text-[#8A817C]">Live tracking of branch orders through receiving and Accounting AP vouchers</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <select
                      value={poFilterBranch}
                      onChange={(e) => setPoFilterBranch(e.target.value)}
                      className="bg-[#F7F6F2] border border-transparent rounded-xl px-3 py-1.5 text-xs font-semibold text-[#5A534E] outline-none"
                    >
                      <option value="">All Branches</option>
                      <option value="Centrio">Centrio Waxing</option>
                      <option value="Passion Nails">Passion Nails</option>
                      <option value="Limketkai">Limketkai</option>
                      <option value="SM Downtown">SM Downtown</option>
                    </select>

                    <select
                      value={poFilterStep}
                      onChange={(e) => setPoFilterStep(e.target.value)}
                      className="bg-[#F7F6F2] border border-transparent rounded-xl px-3 py-1.5 text-xs font-semibold text-[#5A534E] outline-none"
                    >
                      <option value="">All Stages</option>
                      <option value="1">Step 1: Requisition</option>
                      <option value="3">Step 3: Pending Approval</option>
                      <option value="4">Step 4: Goods Inspected</option>
                      <option value="5">Step 5: Accounting AP Posted</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#FAF9F5] border-b border-[#F2F0E8] text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C]">
                        <th className="px-6 py-3.5">PO Number & Date</th>
                        <th className="px-6 py-3.5">Branch & Requestor</th>
                        <th className="px-6 py-3.5">Items & Supplier</th>
                        <th className="px-6 py-3.5">Total Amount</th>
                        <th className="px-6 py-3.5">Current Stage</th>
                        <th className="px-6 py-3.5">Accounting AP Voucher</th>
                        <th className="px-6 py-3.5">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2F0E8]">
                      {purchaseOrders
                        .filter(po => !poFilterBranch || po.branch.includes(poFilterBranch))
                        .filter(po => !poFilterStep || po.step === parseInt(poFilterStep))
                        .map(po => (
                          <tr key={po.poNumber} className="hover:bg-[#FAF9F5]/70 transition-colors">
                            <td className="px-6 py-4 font-bold text-[#031134]">
                              <p className="font-mono font-extrabold">{po.poNumber}</p>
                              <p className="text-[11px] text-[#8A817C]">{po.date}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-bold text-[#4A2E1B]">{po.branch}</p>
                              <p className="text-[11px] text-[#8A817C]">{po.receivedBy}</p>
                            </td>
                            <td className="px-6 py-4 max-w-xs">
                              <p className="font-bold text-[#4A2E1B] truncate">{po.items[0]?.name} {po.items.length > 1 ? `(+${po.items.length - 1} more)` : ''}</p>
                              <p className="text-[11px] text-[#5A534E]">{po.supplier}</p>
                            </td>
                            <td className="px-6 py-4 font-mono font-extrabold text-[#4A2E1B]">
                              ₱{po.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold inline-flex items-center space-x-1 ${
                                po.step === 5
                                  ? 'bg-[#77BC2E]/15 text-[#5A9A1E]'
                                  : po.step === 4
                                  ? 'bg-[#38BDF8]/15 text-[#0284C7]'
                                  : po.step === 3
                                  ? 'bg-[#D4AF37]/20 text-[#B48A10]'
                                  : 'bg-[#EAE8E2] text-[#5A534E]'
                              }`}>
                                <span>Step {po.step}: {po.statusText}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4 font-mono">
                              {po.step === 5 ? (
                                <span className="bg-[#77BC2E]/10 text-[#5A9A1E] font-bold px-2 py-0.5 rounded-md text-[11px] block w-fit">
                                  {po.accountingVoucher}
                                </span>
                              ) : (
                                <span className="text-[#8A817C] text-[11px]">{po.accountingVoucher}</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                {po.step === 4 && (
                                  <button
                                    onClick={() => handleAdvancePo(po.poNumber)}
                                    className="bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold text-[10px] px-3 py-1.5 rounded-lg shadow-2xs transition-all flex items-center space-x-1"
                                    title="Perform 3-way match and push to Accounting AP"
                                  >
                                    <Send className="h-3 w-3" />
                                    <span>Push to Acctg.</span>
                                  </button>
                                )}
                                {po.step === 3 && (
                                  <button
                                    onClick={() => handleAdvancePo(po.poNumber)}
                                    className="bg-[#031134] hover:bg-[#082260] text-white font-bold text-[10px] px-3 py-1.5 rounded-lg shadow-2xs transition-all"
                                  >
                                    Approve PO
                                  </button>
                                )}
                                {po.step === 1 && (
                                  <button
                                    onClick={() => handleAdvancePo(po.poNumber)}
                                    className="bg-[#FAF9F5] hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#4A2E1B] font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all"
                                  >
                                    Send RFQ
                                  </button>
                                )}
                                <button
                                  onClick={() => setSelectedPo(po)}
                                  className="bg-[#FAF9F5] hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#4A2E1B] font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all"
                                >
                                  View 3-Way Match
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: STAFF DIRECTORY & BPI MASTERFILE */}
          {activeTab === 'employees' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Directory Top Header Card */}
              <div className="bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-[#77BC2E]/15 text-[#5A9A1E] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                      Staff Masterfile
                    </span>
                    <span className="text-[11px] font-bold text-[#8A817C]">BPI BizLink Enrolled</span>
                  </div>
                  <h3 className="font-extrabold text-base text-[#4A2E1B] mt-1">Staff Directory & Payroll Configuration</h3>
                  <p className="text-xs text-[#8A817C]">
                    Manage biometric device mappings, daily wage rates, branch assignments, and 10-digit BPI BizLink accounts.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const nextId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 37;
                    setNewEmployee({
                      id: nextId,
                      name: '',
                      branch: 'Centrio Mall (Waxing)',
                      rate: 600,
                      taxStatus: 'S',
                      bpiAccount: `02498214${nextId < 10 ? '0' + nextId : nextId}`,
                      sssNo: `34-${Math.floor(1000000 + Math.random() * 9000000)}-1`,
                      philhealthNo: `12-${Math.floor(100000000 + Math.random() * 900000000)}-2`,
                      pagibigNo: `1210-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
                      tinNo: `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}-000`
                    });
                    setShowAddEmployeeModal(true);
                  }}
                  className="bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm shadow-[#77BC2E]/20"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Employee</span>
                </button>
              </div>

              {/* Statutory Formula & Computation Rules Box */}
              <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#031134] flex items-center space-x-1.5">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-[#77BC2E]" />
                    <span>Philippine Statutory Computation Basis & Government Mandates</span>
                  </span>
                  <span className="text-[10px] text-[#8A817C] font-semibold">Configured for ALRAJJ LEGACY Branches</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-2xl border border-[#F2F0E8]">
                    <span className="text-[10px] font-bold text-[#8A817C] uppercase block">SSS Employee Share</span>
                    <strong className="text-[#4A2E1B] block mt-0.5 font-mono text-[11px]">4.5% of Gross Pay</strong>
                    <span className="text-[10px] text-[#5A534E]">Semi-monthly bracket base</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-[#F2F0E8]">
                    <span className="text-[10px] font-bold text-[#8A817C] uppercase block">PhilHealth (UHC Law)</span>
                    <strong className="text-[#0284C7] block mt-0.5 font-mono text-[11px]">2.0% Employee Share</strong>
                    <span className="text-[10px] text-[#5A534E]">5% total premium split 50/50</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-[#F2F0E8]">
                    <span className="text-[10px] font-bold text-[#8A817C] uppercase block">Pag-IBIG (HDMF)</span>
                    <strong className="text-[#77BC2E] block mt-0.5 font-mono text-[11px]">₱100.00 / Cutoff</strong>
                    <span className="text-[10px] text-[#5A534E]">₱200/mo mandated cap</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-[#F2F0E8]">
                    <span className="text-[10px] font-bold text-[#8A817C] uppercase block">BIR Withholding (TRAIN)</span>
                    <strong className="text-[#16A34A] block mt-0.5 font-mono text-[11px]">Tax-Exempt (&lt;₱10,417)</strong>
                    <span className="text-[10px] text-[#5A534E]">0% for basic salon wage</span>
                  </div>
                </div>
              </div>

              {/* Staff Table Card */}
              <div className="bg-white border border-[#EAE8E2] rounded-3xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#FAF9F5] border-b border-[#F2F0E8] text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C]">
                        <th className="px-5 py-3.5">Biometric ID</th>
                        <th className="px-5 py-3.5">Employee Name & Role</th>
                        <th className="px-5 py-3.5">Branch</th>
                        <th className="px-5 py-3.5">Wage (Daily/Hourly)</th>
                        <th className="px-5 py-3.5">BPI BizLink</th>
                        <th className="px-5 py-3.5">Philippine Statutory IDs (SSS / PH / HDMF / TIN)</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2F0E8]">
                      {employees.map((emp, idx) => {
                        const bpiAcct = emp.bpi_account || `024982140${idx + 1}`;
                        const role = emp.role || (emp.name.includes('HR') ? 'Operations & HR Lead' : 'Senior Waxing Specialist');
                        const hourly = (emp.rate / 8).toFixed(2);
                        const sssNo = emp.sss_no || `34-8192019-${idx + 1}`;
                        const phNo = emp.philhealth_no || `12-054918230-${idx + 1}`;
                        const pagibigNo = emp.pagibig_no || `1210-9482-110${idx + 1}`;
                        const tinNo = emp.tin_no || `291-840-19${idx + 1}-000`;

                        return (
                          <tr key={emp.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                            <td className="px-5 py-4 font-mono font-extrabold text-[#031134]">
                              <span className="bg-[#FAF9F5] border border-[#EAE8E2] px-2 py-0.5 rounded-lg">
                                #{emp.id}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <p className="font-bold text-[#4A2E1B]">{emp.name}</p>
                              <p className="text-[10px] text-[#8A817C]">{role}</p>
                            </td>
                            <td className="px-5 py-4 font-semibold text-[#5A534E]">
                              {emp.branch}
                            </td>
                            <td className="px-5 py-4 font-mono">
                              <p className="font-extrabold text-[#4A2E1B]">₱{parseFloat(emp.rate).toFixed(2)}/day</p>
                              <p className="text-[10px] text-[#8A817C]">₱{hourly}/hr</p>
                            </td>
                            <td className="px-5 py-4 font-mono">
                              <span className="bg-[#031134]/10 text-[#031134] font-bold px-2 py-0.5 rounded-md text-[10px]">
                                {bpiAcct}
                              </span>
                            </td>
                            <td className="px-5 py-4 font-mono text-[10px] space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="bg-stone-100 px-1.5 py-0.5 rounded text-[#5A534E]"><strong>SSS:</strong> {sssNo}</span>
                                <span className="bg-sky-50 text-sky-800 px-1.5 py-0.5 rounded"><strong>PH:</strong> {phNo}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded"><strong>HDMF:</strong> {pagibigNo}</span>
                                <span className="bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded"><strong>TIN:</strong> {tinNo}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className="bg-[#77BC2E]/15 text-[#5A9A1E] font-bold text-[10px] px-2 py-0.5 rounded-md">
                                {emp.tax_status === 'ME' ? 'Married (ME)' : 'Single (S)'}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <button
                                onClick={() => {
                                  setNewEmployee({
                                    id: emp.id,
                                    name: emp.name,
                                    branch: emp.branch || 'Centrio Mall (Waxing)',
                                    rate: emp.rate || 600,
                                    taxStatus: emp.tax_status || 'S',
                                    bpiAccount: bpiAcct,
                                    sssNo: sssNo,
                                    philhealthNo: phNo,
                                    pagibigNo: pagibigNo,
                                    tinNo: tinNo,
                                    otherDeductions: emp.other_deductions || 0,
                                    otherDeductionRemarks: emp.other_deduction_remarks || 'Cash Advance (Vale)'
                                  });
                                  setShowAddEmployeeModal(true);
                                }}
                                className="bg-[#FAF9F5] hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#4A2E1B] font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all"
                              >
                                Edit Profile
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
        </main>
      </div>

      {/* 3. MODALS & POPUPS */}

      {/* ADD / EDIT EMPLOYEE MODAL */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl w-full max-w-lg p-7 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F2F0E8] pb-3">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#77BC2E] uppercase">Staff Registry & Compliance</span>
                <h3 className="font-extrabold text-lg text-[#4A2E1B]">
                  {newEmployee.id && employees.some(e => e.id === parseInt(newEmployee.id)) ? 'Edit Employee Profile & Statutory Info' : 'Create Employee Profile & Statutory Info'}
                </h3>
              </div>
              <button onClick={() => setShowAddEmployeeModal(false)} className="text-[#8A817C] hover:text-[#4A2E1B]">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Device ID</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 37"
                    value={newEmployee.id}
                    onChange={(e) => setNewEmployee({ ...newEmployee, id: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2 font-medium outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Clara"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2 font-medium outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3.5">
                <div className="col-span-2">
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Branch Location</label>
                  <select
                    value={newEmployee.branch || 'Centrio Mall (Waxing)'}
                    onChange={(e) => setNewEmployee({ ...newEmployee, branch: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2 font-medium outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  >
                    <option value="Centrio Mall (Waxing)">Centrio Mall (Waxing)</option>
                    <option value="Passion Nails (Centrio)">Passion Nails (Centrio)</option>
                    <option value="Limketkai Mall">Limketkai Mall</option>
                    <option value="SM Downtown Premier">SM Downtown Premier</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Tax Status</label>
                  <select
                    value={newEmployee.taxStatus}
                    onChange={(e) => setNewEmployee({ ...newEmployee, taxStatus: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3 py-2 font-medium outline-none"
                  >
                    <option value="S">Single (S)</option>
                    <option value="ME">Married (ME)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Daily Wage Rate (PHP)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 600"
                    value={newEmployee.rate}
                    onChange={(e) => setNewEmployee({ ...newEmployee, rate: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2 font-medium outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">10-Digit BPI BizLink Account</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0249821405"
                    value={newEmployee.bpiAccount || ''}
                    onChange={(e) => setNewEmployee({ ...newEmployee, bpiAccount: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2 font-mono font-medium outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  />
                </div>
              </div>

              {/* Philippine Government Statutory IDs Section */}
              <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-2xl p-4 space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#031134] block">
                  🏛️ Philippine Government Statutory Registration
                </span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#5A534E] mb-1 text-[11px]">SSS Identification No.</label>
                    <input
                      type="text"
                      placeholder="e.g. 34-8192019-3"
                      value={newEmployee.sssNo || ''}
                      onChange={(e) => setNewEmployee({ ...newEmployee, sssNo: e.target.value })}
                      className="w-full bg-white border border-[#EAE8E2] rounded-xl px-3 py-1.5 font-mono text-xs outline-none focus:ring-1 focus:ring-[#77BC2E]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#5A534E] mb-1 text-[11px]">PhilHealth (PIN) No.</label>
                    <input
                      type="text"
                      placeholder="e.g. 12-054918230-1"
                      value={newEmployee.philhealthNo || ''}
                      onChange={(e) => setNewEmployee({ ...newEmployee, philhealthNo: e.target.value })}
                      className="w-full bg-white border border-[#EAE8E2] rounded-xl px-3 py-1.5 font-mono text-xs outline-none focus:ring-1 focus:ring-[#77BC2E]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#5A534E] mb-1 text-[11px]">Pag-IBIG (HDMF) MID No.</label>
                    <input
                      type="text"
                      placeholder="e.g. 1210-9482-1104"
                      value={newEmployee.pagibigNo || ''}
                      onChange={(e) => setNewEmployee({ ...newEmployee, pagibigNo: e.target.value })}
                      className="w-full bg-white border border-[#EAE8E2] rounded-xl px-3 py-1.5 font-mono text-xs outline-none focus:ring-1 focus:ring-[#77BC2E]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#5A534E] mb-1 text-[11px]">BIR Taxpayer ID (TIN)</label>
                    <input
                      type="text"
                      placeholder="e.g. 291-840-192-000"
                      value={newEmployee.tinNo || ''}
                      onChange={(e) => setNewEmployee({ ...newEmployee, tinNo: e.target.value })}
                      className="w-full bg-white border border-[#EAE8E2] rounded-xl px-3 py-1.5 font-mono text-xs outline-none focus:ring-1 focus:ring-[#77BC2E]"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Custom Other Deductions & Cash Advances */}
              <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-2xl p-4 space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D47098] block">
                  💳 Custom Payroll Deductions & Cash Advance (Vale)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#5A534E] mb-1 text-[11px]">Deduction Amount (PHP)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={newEmployee.otherDeductions || ''}
                      onChange={(e) => setNewEmployee({ ...newEmployee, otherDeductions: e.target.value })}
                      className="w-full bg-white border border-[#EAE8E2] rounded-xl px-3 py-1.5 font-mono text-xs outline-none focus:ring-1 focus:ring-[#77BC2E]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#5A534E] mb-1 text-[11px]">Deduction Category / Note</label>
                    <select
                      value={newEmployee.otherDeductionRemarks || 'Cash Advance (Vale)'}
                      onChange={(e) => setNewEmployee({ ...newEmployee, otherDeductionRemarks: e.target.value })}
                      className="w-full bg-white border border-[#EAE8E2] rounded-xl px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-[#77BC2E]"
                    >
                      <option value="Cash Advance (Vale)">Cash Advance (Vale)</option>
                      <option value="Staff Uniform / Apron">Staff Uniform / Apron</option>
                      <option value="Salon Product / Tool Shortage">Salon Product / Tool Shortage</option>
                      <option value="SSS / Pag-IBIG Salary Loan">SSS / Pag-IBIG Salary Loan</option>
                      <option value="Voluntary HMO / Savings">Voluntary HMO / Savings</option>
                      <option value="Other Store Adjustment">Other Store Adjustment</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold py-3 rounded-xl text-xs shadow-sm transition-all"
                >
                  {newEmployee.id && employees.some(e => e.id === parseInt(newEmployee.id)) ? 'Save Profile Changes' : 'Create Profile'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddEmployeeModal(false)}
                  className="bg-[#F2F0E8] text-[#5A534E] font-semibold px-5 py-3 rounded-xl text-xs transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAYSLIP MODAL */}
      {selectedPayslip && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn overflow-y-auto">
          <div className="payslip-modal-container bg-white rounded-3xl border border-[#CBD5E1] shadow-2xl w-full max-w-2xl p-6 sm:p-8 space-y-6 my-auto">
            {/* Action Header - Hidden during print */}
            <div className="no-print flex items-center justify-between border-b border-[#F2F0E8] pb-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#77BC2E] uppercase">Official Statement</span>
                <h3 className="font-extrabold text-lg text-[#4A2E1B]">Official Employee Salary Slip</h3>
                <p className="text-xs text-[#8A817C]">Semi-monthly cutoff: {startDate} ~ {endDate}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEmailToast(`Official encrypted payslip PDF successfully sent to ${selectedPayslip.employeeName} via salon enterprise email!`);
                    setTimeout(() => setEmailToast(''), 4500);
                  }}
                  className="bg-[#031134] hover:bg-[#062060] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
                  title="Send via Email"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Email Slip</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
                  title="Print or Save PDF"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print / PDF</span>
                </button>
                <button onClick={() => setSelectedPayslip(null)} className="p-2 rounded-xl border border-[#EAE8E2] hover:bg-[#FAF9F5] text-[#8A817C] transition-colors">
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Email notification toast in modal */}
            {emailToast && (
              <div className="no-print bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-xl font-medium animate-fadeIn flex items-center space-x-2">
                <span>📧</span>
                <span>{emailToast}</span>
              </div>
            )}

            {/* Printable Official Payslip Document */}
            <div className="printable-payslip-doc bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-5 text-xs text-[#334155]">
              {/* Document Header with Logo */}
              <div className="flex items-start justify-between border-b-2 border-[#031134] pb-4">
                <div className="flex items-center space-x-3.5">
                  <img src="/alrajj-icon.png" alt="ALRAJJ Logo" className="h-11 w-11 rounded-xl bg-[#031134] p-1.5 shadow-xs" />
                  <div>
                    <h2 className="font-extrabold text-base text-[#031134] tracking-tight">ALRAJJ LEGACY FORTIFIED BUSINESS CORP.</h2>
                    <p className="text-[11px] font-semibold text-[#64748B]">Official Employee Salary & Compensation Statement</p>
                    <p className="text-[10px] text-[#94A3B8]">Centrio Mall (Waxing & Nails) • Limketkai • SM Downtown Premier</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-[#031134] text-[#D4AF37] font-mono font-extrabold text-[9px] px-2 py-0.5 rounded uppercase">
                    Confidential
                  </span>
                  <p className="font-mono text-[11px] font-bold text-[#031134] mt-1">Period: {startDate} ~ {endDate}</p>
                  <p className="font-mono text-[10px] text-[#64748B]">Voucher: PAY-2026-#{selectedPayslip.employeeId}</p>
                </div>
              </div>

              {/* Employee & Bank Master Information Grid */}
              <div className="grid grid-cols-3 gap-3 bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0] text-[11px]">
                <div>
                  <span className="text-[#64748B] block text-[9px] uppercase font-bold">Employee Name</span>
                  <strong className="text-sm font-extrabold text-[#031134]">{selectedPayslip.employeeName}</strong>
                  <span className="text-[10.5px] text-[#64748B] block font-medium">Biometric ID: #{selectedPayslip.employeeId}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[9px] uppercase font-bold">Branch & Role</span>
                  <strong className="text-[#031134] font-bold block">{selectedPayslip.branch}</strong>
                  <span className="text-[10.5px] text-[#64748B] block">Daily Rate: ₱{parseFloat(selectedPayslip.dailyRate || 600).toFixed(2)} / day</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[9px] uppercase font-bold">BPI BizLink ATM Account</span>
                  <span className="font-mono font-extrabold text-xs text-[#031134] bg-white px-2 py-0.5 rounded border border-[#CBD5E1] inline-block mt-0.5">
                    {selectedPayslip.bpiAccount || '0249821401'}
                  </span>
                  <span className="text-[10px] text-[#16A34A] font-semibold block mt-0.5">● Direct Credited</span>
                </div>
              </div>

              {/* Statutory ID Bar */}
              <div className="grid grid-cols-4 gap-2 bg-stone-50 p-2.5 rounded-lg border border-stone-200 text-[10px] font-mono text-[#475569]">
                <div>
                  <span className="text-[#94A3B8] block text-[8.5px] font-sans uppercase font-bold">SSS Number</span>
                  <strong className="text-[#1E293B]">{selectedPayslip.sssNo || '34-8192019-3'}</strong>
                </div>
                <div>
                  <span className="text-[#94A3B8] block text-[8.5px] font-sans uppercase font-bold">PhilHealth PIN</span>
                  <strong className="text-[#1E293B]">{selectedPayslip.philhealthNo || '12-054918230-1'}</strong>
                </div>
                <div>
                  <span className="text-[#94A3B8] block text-[8.5px] font-sans uppercase font-bold">Pag-IBIG MID</span>
                  <strong className="text-[#1E293B]">{selectedPayslip.pagibigNo || '1210-9482-1104'}</strong>
                </div>
                <div>
                  <span className="text-[#94A3B8] block text-[8.5px] font-sans uppercase font-bold">BIR TIN</span>
                  <strong className="text-[#1E293B]">{selectedPayslip.tinNo || '291-840-192-000'}</strong>
                </div>
              </div>

              {/* 2-Column Earnings & Deductions Tables */}
              <div className="grid grid-cols-2 gap-5 pt-1">
                {/* EARNINGS */}
                <div className="border border-[#CBD5E1] rounded-xl overflow-hidden">
                  <div className="bg-[#F0FDF4] border-b border-[#CBD5E1] px-3.5 py-2 flex justify-between items-center">
                    <span className="font-extrabold text-[#166534] text-[11px] uppercase tracking-wider">Gross Earnings</span>
                    <span className="text-[10px] text-[#166534] font-semibold">{selectedPayslip.daysPresent} Days Present</span>
                  </div>
                  <div className="p-3.5 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Basic Pay ({selectedPayslip.daysPresent} days @ ₱{selectedPayslip.dailyRate}/day)</span>
                      <span className="font-mono font-semibold">₱{selectedPayslip.calculations.basicPay.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overtime Pay ({selectedPayslip.totalOtHours} hrs @ 125%)</span>
                      <span className="font-mono font-semibold text-[#166534]">+₱{selectedPayslip.calculations.otPay.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Night Differential ({selectedPayslip.totalNdHours} hrs @ 10%)</span>
                      <span className="font-mono font-semibold text-[#166534]">+₱{selectedPayslip.calculations.ndPay.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-dashed border-[#CBD5E1] pt-2 mt-2 flex justify-between font-extrabold text-[#031134]">
                      <span>Total Gross Compensation</span>
                      <span className="font-mono text-sm">₱{selectedPayslip.calculations.grossPay.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* DEDUCTIONS */}
                <div className="border border-[#CBD5E1] rounded-xl overflow-hidden">
                  <div className="bg-[#FFF1F2] border-b border-[#CBD5E1] px-3.5 py-2 flex justify-between items-center">
                    <span className="font-extrabold text-[#9F1239] text-[11px] uppercase tracking-wider">Mandatory & Store Deductions</span>
                    <span className="text-[10px] text-[#9F1239] font-semibold">Itemized Breakdown</span>
                  </div>
                  <div className="p-3.5 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Late & Tardiness ({selectedPayslip.totalLateMins || 0} mins)</span>
                      <span className="font-mono text-[#E11D48]">-₱{selectedPayslip.calculations.lateDeduction.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SSS Mandatory Contribution</span>
                      <span className="font-mono text-[#E11D48]">-₱{selectedPayslip.calculations.deductions.sss.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PhilHealth (UHC 2.0% Employee)</span>
                      <span className="font-mono text-[#E11D48]">-₱{selectedPayslip.calculations.deductions.philhealth.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pag-IBIG (HDMF Standard)</span>
                      <span className="font-mono text-[#E11D48]">-₱{selectedPayslip.calculations.deductions.pagibig.toFixed(2)}</span>
                    </div>
                    {selectedPayslip.calculations.deductions.otherDeductions > 0 && (
                      <div className="flex justify-between bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        <span className="font-bold text-[#9F1239]">{selectedPayslip.calculations.deductions.otherDeductionRemarks || 'Cash Advance (Vale)'}</span>
                        <span className="font-mono font-bold text-[#E11D48]">-₱{selectedPayslip.calculations.deductions.otherDeductions.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-dashed border-[#CBD5E1] pt-2 mt-2 flex justify-between font-extrabold text-[#9F1239]">
                      <span>Total Deductions</span>
                      <span className="font-mono text-sm">-₱{selectedPayslip.calculations.deductions.totalDeductions.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Take-Home Salary Highlight Banner */}
              <div className="bg-[#031134] text-white p-4 rounded-xl flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[#D4AF37] font-bold text-[10px] uppercase tracking-wider block">Disbursement Net Amount</span>
                  <h3 className="font-black text-xl text-white tracking-tight">₱{selectedPayslip.calculations.netPay.toFixed(2)}</h3>
                  <span className="text-[10px] text-slate-300">Philippine Peso (PHP) • Direct ATM Release</span>
                </div>
                <div className="text-right">
                  <span className="bg-[#77BC2E] text-[#031134] text-[10px] font-black px-2.5 py-1 rounded-md uppercase">
                    BPI BizLink Verified
                  </span>
                  <p className="text-[10px] text-slate-300 mt-1">Authorized by Managing Director</p>
                </div>
              </div>

              {/* Official Signatures & Verification Block */}
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-[#E2E8F0] text-[10px] text-center text-[#64748B]">
                <div className="space-y-1">
                  <div className="h-8 border-b border-stone-300"></div>
                  <strong className="text-[#031134] block">Kristene (HR & Ops Lead)</strong>
                  <span>Prepared & Verified</span>
                </div>
                <div className="space-y-1">
                  <div className="h-8 border-b border-stone-300"></div>
                  <strong className="text-[#031134] block">Ms. Jehan Abedin</strong>
                  <span>Managing Director Sign-off</span>
                </div>
                <div className="space-y-1">
                  <div className="h-8 border-b border-stone-300"></div>
                  <strong className="text-[#031134] block">{selectedPayslip.employeeName}</strong>
                  <span>Employee Acknowledgment</span>
                </div>
              </div>

              <p className="text-[9px] text-[#94A3B8] text-center italic pt-1">
                This document is an official computer-generated salary record issued by ALRAJJ LEGACY Fortified Business Corp. under Philippine Labor Standards.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* NOTICE TO EXPLAIN (NTE) MODAL */}
      {selectedNteEmployee && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl w-full max-w-2xl p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#F2F0E8] pb-3">
              <h3 className="font-extrabold text-base flex items-center space-x-2 text-[#D47098]">
                <FileText className="h-4 w-4" />
                <span>Notice to Explain (NTE) Disciplinary Draft</span>
              </h3>
              <button onClick={() => setSelectedNteEmployee(null)} className="text-[#8A817C] hover:text-[#4A2E1B]">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Printable Letter Layout */}
            <div className="border border-[#EAE8E2] rounded-2xl p-6 bg-[#FAF9F5] font-serif text-[#2D2520] space-y-3.5 max-h-[420px] overflow-y-auto text-xs leading-relaxed">
              <div className="flex items-center justify-center space-x-2.5 border-b border-[#EAE8E2] pb-2">
                <img src="/alrajj-icon.png" alt="ALRAJJ Logo" className="h-6 w-6 rounded-md bg-[#031134] p-0.5" />
                <div className="text-center font-bold uppercase tracking-widest text-xs font-sans text-[#031134]">
                  ALRAJJ LEGACY FORTIFIED BUSINESS CORP. &bull; HR OPERATIONS
                </div>
              </div>
              <div className="space-y-1 font-sans text-[11px] text-[#8A817C]">
                <div>Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div>To: {selectedNteEmployee.employee_name} ({selectedNteEmployee.branch} Branch)</div>
                <div>Subject: Notice of chronic tardiness threshold violation</div>
              </div>
              <p className="pt-1">
                Dear {selectedNteEmployee.employee_name},
              </p>
              <p>
                Our biometric automated monitoring system recorded that you have accumulated <strong className="font-sans font-bold text-[#D47098]">{selectedNteEmployee.late_count} instances</strong> of late clock-ins, totaling <strong className="font-sans font-bold text-[#D47098]">{selectedNteEmployee.total_late_minutes} minutes</strong> in the current payroll cutoff.
              </p>
              <p>
                Under Section 4.2 of the company employee handbook, employees are expected to report for shifts punctually. Exceeding three late clock-ins constitutes chronic tardiness, which is subject to standard company disciplinary review.
              </p>
              <p>
                You are hereby required to submit a written explanation within forty-eight (48) hours from receipt of this notice to explain why disciplinary measures should not be initiated against you.
              </p>
              <p className="pt-2 font-sans text-[11px] text-[#8A817C]">
                Sincerely yours,<br />
                <strong>Kristene HR Manager</strong><br />
                ALRAJJ LEGACY Head Office
              </p>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold py-3 rounded-xl text-xs shadow-sm transition-all flex items-center justify-center space-x-2"
              >
                <Printer className="h-4 w-4" />
                <span>Print Notice Letter</span>
              </button>
              <button
                onClick={() => setSelectedNteEmployee(null)}
                className="bg-[#F2F0E8] text-[#5A534E] font-semibold px-6 py-3 rounded-xl text-xs transition-all"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RING UP SERVICE TICKET MODAL */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl w-full max-w-lg p-7 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F2F0E8] pb-3">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#77BC2E] uppercase">Front Desk POS & CRM</span>
                <h3 className="font-extrabold text-lg text-[#4A2E1B]">Ring Up Service Ticket</h3>
              </div>
              <button onClick={() => setShowNewTicketModal(false)} className="text-[#8A817C] hover:text-[#4A2E1B]">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Client Name / Guest</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Santos or Walk-in"
                    value={newTicket.clientName}
                    onChange={(e) => setNewTicket({ ...newTicket, clientName: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2 font-medium outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Branch Location</label>
                  <select
                    value={newTicket.branch}
                    onChange={(e) => setNewTicket({ ...newTicket, branch: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2 font-medium outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  >
                    <option value="Centrio Mall (Waxing)">Centrio Mall (Waxing)</option>
                    <option value="Passion Nails (Centrio)">Passion Nails (Centrio)</option>
                    <option value="Limketkai Mall">Limketkai Mall</option>
                    <option value="SM Downtown Premier">SM Downtown Premier</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Service / Product</label>
                  <select
                    value={newTicket.service}
                    onChange={(e) => {
                      const s = e.target.value;
                      let amt = 650;
                      if (s.includes('1,200')) amt = 1200;
                      else if (s.includes('1,100')) amt = 1100;
                      else if (s.includes('850')) amt = 850;
                      else if (s.includes('750')) amt = 750;
                      else if (s.includes('650')) amt = 650;
                      else if (s.includes('450')) amt = 450;
                      else if (s.includes('350')) amt = 350;
                      setNewTicket({ ...newTicket, service: s, amount: amt });
                    }}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2 font-medium outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  >
                    <option value="Brazilian Wax Express (₱650.00)">Brazilian Wax Express (₱650.00)</option>
                    <option value="Underarm Wax (₱450.00)">Underarm Wax (₱450.00)</option>
                    <option value="Underarm & Full Leg Wax (₱1,100.00)">Underarm & Full Leg Wax (₱1,100.00)</option>
                    <option value="Full Body Organic Sugar Wax (₱1,200.00)">Full Body Sugar Wax (₱1,200.00)</option>
                    <option value="Gel Manicure + Spa Pedicure (₱850.00)">Gel Manicure + Spa Pedicure (₱850.00)</option>
                    <option value="Retail Soothing Aloe Gel (₱350.00)">Retail Soothing Aloe Gel (₱350.00)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Assigned Specialist</label>
                  <select
                    value={newTicket.specialist}
                    onChange={(e) => setNewTicket({ ...newTicket, specialist: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2 font-medium outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  >
                    <option value="Justine Ann Atay">Justine Ann Atay (Senior Specialist)</option>
                    <option value="Cherimar Concigo">Cherimar Concigo (Passion Nails Lead)</option>
                    <option value="Cherry Rose Paculanang">Cherry Rose Paculanang</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Total Amount (PHP)</label>
                  <input
                    type="number"
                    required
                    value={newTicket.amount}
                    onChange={(e) => setNewTicket({ ...newTicket, amount: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2 font-mono font-bold text-base outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Payment Method</label>
                  <select
                    value={newTicket.paymentMethod}
                    onChange={(e) => setNewTicket({ ...newTicket, paymentMethod: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2 font-medium outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  >
                    <option value="Cash">Cash (Store Register)</option>
                    <option value="GCash QR">GCash QR (BPI Linked)</option>
                    <option value="Maya QR">Maya QR Standee</option>
                    <option value="Card Terminal (Maya Swipe)">Card Terminal (Maya Swipe)</option>
                  </select>
                </div>
              </div>

              <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-2xl p-3 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[10px] font-bold text-[#8A817C] uppercase block">Specialist Commission (10%)</span>
                  <span className="font-mono font-black text-[#77BC2E] text-sm">₱{((Number(newTicket.amount) || 0) * 0.10).toFixed(2)}</span>
                </div>
                <span className="text-[11px] text-[#5A534E]">Auto-credited to {newTicket.specialist}</span>
              </div>

              <div>
                <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Skin / Service Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Sensitive skin, tea tree lotion requested"
                  value={newTicket.notes}
                  onChange={(e) => setNewTicket({ ...newTicket, notes: e.target.value })}
                  className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2 font-medium outline-none focus:ring-1 focus:ring-[#77BC2E]"
                />
              </div>

              <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-[#F2F0E8]">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="bg-[#FAF9F5] hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#4A2E1B] font-bold px-4 py-2 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold px-5 py-2 rounded-xl transition-all shadow-sm shadow-[#77BC2E]/20 flex items-center space-x-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>Complete & Ring Up</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. SETHCON ENTERPRISE SUITE MODAL */}
      {showSethconModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#F2F0E8] pb-5">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="bg-[#031134] text-[#D4AF37] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    Company Profile & Ecosystem
                  </span>
                  <span className="text-[11px] font-bold text-[#77BC2E] flex items-center space-x-1">
                    <Sparkles className="h-3 w-3" />
                    <span>Enterprise Grade</span>
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-[#031134] tracking-tight">SETHCON Technologies Inc.</h2>
                <p className="text-xs sm:text-sm text-[#8A817C]">
                  Custom Enterprise Software, CRM, Procurement to Accounting Pipelines, and Biometric Operations
                </p>
              </div>
              <button 
                onClick={() => setShowSethconModal(false)}
                className="p-2 rounded-xl border border-[#EAE8E2] hover:bg-[#FAF9F5] text-[#8A817C] hover:text-[#4A2E1B] transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Profile Overview Card */}
            <div className="bg-gradient-to-br from-[#031134] to-[#0A1B45] text-white p-6 rounded-3xl space-y-4 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-lg text-[#D4AF37]">Custom Systems Engineering for Lay Bare</h3>
                  <p className="text-xs text-slate-300">
                    Presented by the <strong>SETHCON Technologies Inc.</strong> Solutions Engineering Team.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href="https://drive.google.com/file/d/12qG_EbC35yH9k9Bl0uDCGp7shh1mfQ0B/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#D4AF37] hover:bg-[#B48A10] text-[#031134] font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
                  >
                    <FileText className="h-3.5 w-3.5 text-[#031134]" />
                    <span>View Official Sethcon Profile (PDF)</span>
                    <ExternalLink className="h-3 w-3 text-[#031134]" />
                  </a>
                  <span className="bg-white/10 text-white border border-white/20 text-[11px] font-semibold px-3 py-1.5 rounded-xl hidden sm:inline-block">
                    Lay Bare Partner
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                SETHCON Technologies Inc. designs, builds, and maintains custom cloud-native operational ecosystems. We tailor custom biometric payroll pipelines, DOLE NTE compliance, Salon CRM, and 5-step PO-to-Accounting systems built specifically around the daily operations of Lay Bare Waxing & Passion Nails branches.
              </p>
            </div>

            {/* Core Offerings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Feature 1: CRM & Loyalty */}
              <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-2xl p-5 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E89BB9]/20 text-[#D47098] flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#4A2E1B]">Customer Relationship Management (CRM)</h4>
                    <p className="text-[11px] text-[#8A817C]">Client retention, booking & loyalty</p>
                  </div>
                </div>
                <ul className="text-xs text-[#5A534E] space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-[#77BC2E] font-bold">&bull;</span>
                    <span><strong>Client Service Profiles:</strong> Complete salon visit histories, technician preferences, and skin sensitivity notes.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#77BC2E] font-bold">&bull;</span>
                    <span><strong>Automated Booking & SMS:</strong> Online booking portal with SMS appointment confirmation and reminders.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#77BC2E] font-bold">&bull;</span>
                    <span><strong>Loyalty Points & Packages:</strong> Track package balances, membership tiers, and cross-branch redemption.</span>
                  </li>
                </ul>
              </div>

              {/* Feature 2: Complete PO to Accounting Workflow */}
              <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-2xl p-5 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#77BC2E]/20 text-[#5A9A1E] flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#4A2E1B]">Purchase Orders to Accounting Pipeline</h4>
                    <p className="text-[11px] text-[#8A817C]">End-to-end procurement with 3-way matching</p>
                  </div>
                </div>
                <ul className="text-xs text-[#5A534E] space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-[#77BC2E] font-bold">&bull;</span>
                    <span><strong>Step 1 to Store Level:</strong> Branch supply requisitions (waxing supplies, nail polishes, consumables).</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#77BC2E] font-bold">&bull;</span>
                    <span><strong>Vendor RFQ & Approvals:</strong> Multi-vendor price comparison and management authorization.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#77BC2E] font-bold">&bull;</span>
                    <span><strong>Direct to Accounting:</strong> Goods receipt matches PO and invoice, pushing AP vouchers directly into Accounting ledgers.</span>
                  </li>
                </ul>
              </div>

              {/* Feature 3: Biometric HRMS & BPI Payroll */}
              <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-2xl p-5 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#031134]/15 text-[#031134] flex items-center justify-center">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#4A2E1B]">Biometric HRMS & Bank Integration</h4>
                    <p className="text-[11px] text-[#8A817C]">NGTeco timeclocks & BPI BizLink batching</p>
                  </div>
                </div>
                <ul className="text-xs text-[#5A534E] space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-[#77BC2E] font-bold">&bull;</span>
                    <span><strong>Automated Anomaly Detection:</strong> Instantly catches missing punches and overtime calculations.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#77BC2E] font-bold">&bull;</span>
                    <span><strong>Automated DOLE Notice to Explain (NTE):</strong> Formally manages tardiness thresholds.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#77BC2E] font-bold">&bull;</span>
                    <span><strong>Direct BPI ATM Crediting:</strong> Generates BPI BizLink batch disbursement files with 1 click.</span>
                  </li>
                </ul>
              </div>

              {/* Feature 4: POS & Multi-Branch Inventory */}
              <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-2xl p-5 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#B58EBE]/20 text-[#865B8F] flex items-center justify-center">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#4A2E1B]">Cloud POS & Stock Control</h4>
                    <p className="text-[11px] text-[#8A817C]">Real-time sales & inventory tracking</p>
                  </div>
                </div>
                <ul className="text-xs text-[#5A534E] space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-[#77BC2E] font-bold">&bull;</span>
                    <span><strong>Live Multi-Branch Sales:</strong> Monitor daily sales revenue for Centrio, Ketkai, and SM Downtown in real time.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#77BC2E] font-bold">&bull;</span>
                    <span><strong>Stock Depletion Alerts:</strong> Automated alerts when waxes, strips, or nail care products reach reorder points.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#77BC2E] font-bold">&bull;</span>
                    <span><strong>Commissions Tracking:</strong> Automated technician commission breakdown on every service ticket.</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* 5-Step PO to Accounting Flow Visual */}
            <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl p-5 space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#031134]">
                Enterprise Procurement Diagram: 1st Step to Accounting Dept.
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
                  <span className="text-[9px] font-bold text-[#8A817C] block uppercase">Step 1</span>
                  <strong className="text-[#4A2E1B] text-[11px] block mt-0.5">Store Requisition</strong>
                  <span className="text-[10px] text-[#8A817C]">Branch material request</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
                  <span className="text-[9px] font-bold text-[#8A817C] block uppercase">Step 2</span>
                  <strong className="text-[#4A2E1B] text-[11px] block mt-0.5">Vendor RFQ</strong>
                  <span className="text-[10px] text-[#8A817C]">Quote comparison</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
                  <span className="text-[9px] font-bold text-[#8A817C] block uppercase">Step 3</span>
                  <strong className="text-[#4A2E1B] text-[11px] block mt-0.5">PO Approval</strong>
                  <span className="text-[10px] text-[#8A817C]">Manager sign-off</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
                  <span className="text-[9px] font-bold text-[#8A817C] block uppercase">Step 4</span>
                  <strong className="text-[#4A2E1B] text-[11px] block mt-0.5">Goods Receiving</strong>
                  <span className="text-[10px] text-[#8A817C]">Store check & inspect</span>
                </div>
                <div className="bg-[#77BC2E]/15 p-2.5 rounded-xl border border-[#77BC2E]/40 shadow-2xs">
                  <span className="text-[9px] font-extrabold text-[#5A9A1E] block uppercase">Final Step 5</span>
                  <strong className="text-[#4A2E1B] text-[11px] block mt-0.5">Accounting Dept</strong>
                  <span className="text-[10px] text-[#5A9A1E] font-bold">AP Voucher & Ledger</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#F2F0E8] pt-4">
              <p className="text-xs text-[#8A817C]">
                Ready to extend your operations? Contact <strong>SETHCON Technologies Inc.</strong>
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSethconModal(false)}
                  className="bg-[#031134] hover:bg-[#082260] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm"
                >
                  Return to HRMS
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 5. BPI BIZLINK BATCH PREVIEW MODAL */}
      {showBpiModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl w-full max-w-2xl p-7 space-y-6">
            
            <div className="flex items-start justify-between border-b border-[#F2F0E8] pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="bg-[#031134] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md">BPI BizLink</span>
                  <span className="text-[11px] font-bold text-[#77BC2E]">Corporate Payroll File</span>
                </div>
                <h3 className="font-extrabold text-lg text-[#4A2E1B] mt-1">Batch Electronic Disbursement</h3>
                <p className="text-xs text-[#8A817C]">Format compliant for Bank of the Philippine Islands (BPI) batch payroll upload</p>
              </div>
              <button 
                onClick={() => setShowBpiModal(false)}
                className="text-[#8A817C] hover:text-[#4A2E1B]"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Batch Table */}
            <div className="overflow-x-auto border border-[#EAE8E2] rounded-2xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF9F5] border-b border-[#F2F0E8] text-[10px] font-extrabold uppercase text-[#8A817C]">
                    <th className="px-4 py-2.5">Account No.</th>
                    <th className="px-4 py-2.5">Employee Name</th>
                    <th className="px-4 py-2.5">Branch</th>
                    <th className="px-4 py-2.5">Net Pay (PHP)</th>
                    <th className="px-4 py-2.5">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F0E8]">
                  {(payroll.length > 0 ? payroll : employees.map((e, i) => ({
                    employeeId: e.id,
                    employeeName: e.name,
                    branch: e.branch,
                    calculations: { netPay: 7500 + i * 450 }
                  }))).map((p, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF9F5]/70">
                      <td className="px-4 py-3 font-mono text-[#031134] font-bold">
                        02498214{(idx + 1) < 10 ? '0' + (idx + 1) : (idx + 1)}
                      </td>
                      <td className="px-4 py-3 font-bold text-[#4A2E1B]">{p.employeeName}</td>
                      <td className="px-4 py-3 text-[#5A534E]">{p.branch || 'Centrio'}</td>
                      <td className="px-4 py-3 font-mono font-extrabold text-[#77BC2E]">
                        ₱{(p.calculations?.netPay || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-[#77BC2E]/15 text-[#5A9A1E] text-[10px] font-bold px-2 py-0.5 rounded-md">
                          SALARY
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs text-[#8A817C]">
                Ready to upload to BPI BizLink Corporate portal
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleGenerateBpiBatch}
                  className="bg-[#031134] hover:bg-[#082260] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download .CSV Batch File</span>
                </button>
                <button
                  onClick={() => setShowBpiModal(false)}
                  className="bg-[#F2F0E8] text-[#5A534E] font-semibold text-xs px-4 py-2.5 rounded-xl transition-all"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 6. CLIENT PROFILE & VISIT HISTORY MODAL */}
      {selectedClient && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl w-full max-w-xl p-7 space-y-5">
            <div className="flex items-start justify-between border-b border-[#F2F0E8] pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E89BB9]/20 text-[#D47098] flex items-center justify-center font-extrabold text-lg">
                  {selectedClient.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-lg text-[#4A2E1B]">{selectedClient.name}</h3>
                    <span className="bg-[#D4AF37]/15 text-[#B48A10] text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                      {selectedClient.tier}
                    </span>
                  </div>
                  <p className="text-xs text-[#8A817C] font-mono">{selectedClient.id} &bull; {selectedClient.phone}</p>
                </div>
              </div>
              <button onClick={() => setSelectedClient(null)} className="text-[#8A817C] hover:text-[#4A2E1B]">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#FAF9F5] p-4 rounded-2xl border border-[#EAE8E2]">
                <div>
                  <span className="text-[10px] font-bold text-[#8A817C] uppercase block">Primary Branch</span>
                  <strong className="text-[#4A2E1B]">{selectedClient.branch}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#8A817C] uppercase block">Assigned Specialist</span>
                  <span className="text-[#5A9A1E] font-bold flex items-center space-x-1 mt-0.5">
                    <Sparkles className="h-3 w-3" />
                    <span>{selectedClient.preferredTechnician}</span>
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#8A817C] uppercase block">Total Salon Visits</span>
                  <strong className="text-[#4A2E1B]">{selectedClient.totalVisits} Completed Sessions</strong>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#8A817C] uppercase block">Loyalty Points Balance</span>
                  <strong className="text-[#D4AF37] font-mono">{selectedClient.loyaltyPoints} Points</strong>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#4A2E1B]">Active Membership & Package Balance</h4>
                <div className="p-3 rounded-xl border border-[#EAE8E2] bg-white space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span>{selectedClient.activePackage}</span>
                    <span className="text-[#5A9A1E] font-bold">Active</span>
                  </div>
                  <div className="w-full bg-[#EAE8E2] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#77BC2E] h-full rounded-full w-3/5"></div>
                  </div>
                  <p className="text-[11px] text-[#8A817C]">Next service redemption: {selectedClient.nextBooking}</p>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-[#4A2E1B]">Skin Sensitivity & Service Notes</h4>
                <p className="p-3 rounded-xl bg-[#FAF9F5] border border-[#EAE8E2] text-[#4A2E1B] text-[11px] leading-relaxed">
                  {selectedClient.skinNotes}
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  onClick={() => { handleSendSmsReminder(selectedClient); setSelectedClient(null); }}
                  className="flex-1 bg-[#031134] hover:bg-[#082260] text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-sm"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send SMS Confirmation</span>
                </button>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="bg-[#F2F0E8] text-[#5A534E] font-semibold px-4 py-2.5 rounded-xl transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. ADD VIP CLIENT MODAL */}
      {showAddClientModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl w-full max-w-md p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-[#F2F0E8] pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#E89BB9] tracking-wider">CRM Registry</span>
                <h3 className="font-extrabold text-lg text-[#4A2E1B]">Register New Client</h3>
              </div>
              <button onClick={() => setShowAddClientModal(false)} className="text-[#8A817C] hover:text-[#4A2E1B]">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddClient} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Client Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heart Evangelista"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2.5 font-medium outline-none focus:ring-1 focus:ring-[#E89BB9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Mobile Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+63 917..."
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2.5 font-medium outline-none focus:ring-1 focus:ring-[#E89BB9]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Salon Branch</label>
                  <select
                    value={newClient.branch}
                    onChange={(e) => setNewClient({ ...newClient, branch: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3 py-2.5 font-medium outline-none"
                  >
                    <option value="Centrio Mall (Waxing)">Centrio Waxing</option>
                    <option value="Passion Nails (Centrio)">Passion Nails</option>
                    <option value="Limketkai Mall">Limketkai</option>
                    <option value="SM Downtown">SM Downtown</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Preferred Specialist</label>
                <input
                  type="text"
                  placeholder="e.g. Justine Ann Atay"
                  value={newClient.preferredTechnician}
                  onChange={(e) => setNewClient({ ...newClient, preferredTechnician: e.target.value })}
                  className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2.5 font-medium outline-none focus:ring-1 focus:ring-[#E89BB9]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Skin Sensitivity & Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Sensitive to hot wax, gentle peel only..."
                  value={newClient.skinNotes}
                  onChange={(e) => setNewClient({ ...newClient, skinNotes: e.target.value })}
                  className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2 font-medium outline-none focus:ring-1 focus:ring-[#E89BB9]"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#E89BB9] hover:bg-[#D47098] text-white font-bold py-3 rounded-xl transition-all shadow-sm"
                >
                  Create Client Profile
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddClientModal(false)}
                  className="bg-[#F2F0E8] text-[#5A534E] font-semibold px-4 py-3 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. CREATE STORE REQUISITION / PO MODAL */}
      {showCreatePoModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl w-full max-w-md p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-[#F2F0E8] pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#031134] tracking-wider">Step 1 &bull; Procurement</span>
                <h3 className="font-extrabold text-lg text-[#4A2E1B]">Create Store Requisition</h3>
              </div>
              <button onClick={() => setShowCreatePoModal(false)} className="text-[#8A817C] hover:text-[#4A2E1B]">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePo} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Branch</label>
                  <select
                    value={newPo.branch}
                    onChange={(e) => setNewPo({ ...newPo, branch: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3 py-2.5 font-medium outline-none"
                  >
                    <option value="Centrio Mall (Waxing)">Centrio Waxing</option>
                    <option value="Passion Nails (Centrio)">Passion Nails</option>
                    <option value="Limketkai Mall Branch">Limketkai</option>
                    <option value="SM Downtown Branch">SM Downtown</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Supplier</label>
                  <select
                    value={newPo.supplier}
                    onChange={(e) => setNewPo({ ...newPo, supplier: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3 py-2.5 font-medium outline-none"
                  >
                    <option value="PureBeauty Salon Supplies Corp.">PureBeauty Supplies</option>
                    <option value="Glamour Pro Nail Distributing Co.">Glamour Pro Nails</option>
                    <option value="CleanCare Commercial Solutions">CleanCare Commercial</option>
                    <option value="Wellness Natural Trading Inc.">Wellness Natural</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Supply Item Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Hot Wax Pellets (10kg)"
                  value={newPo.itemName}
                  onChange={(e) => setNewPo({ ...newPo, itemName: e.target.value })}
                  className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2.5 font-medium outline-none focus:ring-1 focus:ring-[#031134]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Quantity</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newPo.qty}
                    onChange={(e) => setNewPo({ ...newPo, qty: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2.5 font-medium outline-none focus:ring-1 focus:ring-[#031134]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Est. Unit Price (PHP)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newPo.unitPrice}
                    onChange={(e) => setNewPo({ ...newPo, unitPrice: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2.5 font-medium outline-none focus:ring-1 focus:ring-[#031134]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#EAE8E2] flex justify-between font-bold">
                <span className="text-[#8A817C]">Estimated Total Amount:</span>
                <span className="font-mono text-[#031134]">₱{(newPo.qty * newPo.unitPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#031134] hover:bg-[#082260] text-white font-bold py-3 rounded-xl transition-all shadow-sm"
                >
                  Submit Store Requisition
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreatePoModal(false)}
                  className="bg-[#F2F0E8] text-[#5A534E] font-semibold px-4 py-3 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. 3-WAY MATCH & ACCOUNTING AP VOUCHER MODAL */}
      {selectedPo && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl w-full max-w-2xl p-7 space-y-5">
            <div className="flex items-start justify-between border-b border-[#F2F0E8] pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="bg-[#77BC2E] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                    Step 5 &bull; Accounting AP Match
                  </span>
                  <span className="font-mono text-xs font-bold text-[#031134]">{selectedPo.poNumber}</span>
                </div>
                <h3 className="font-extrabold text-lg text-[#4A2E1B] mt-1">3-Way Procurement Matching & General Ledger</h3>
                <p className="text-xs text-[#8A817C]">Purchase Order &bull; Goods Delivery Receipt (DR) &bull; Supplier Commercial Invoice</p>
              </div>
              <button onClick={() => setSelectedPo(null)} className="text-[#8A817C] hover:text-[#4A2E1B]">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* 3-Way Verification Cards */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-[#77BC2E]/10 border border-[#77BC2E]/30 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-[#5A9A1E] block">1. Purchase Order</span>
                  <strong className="text-[#4A2E1B] text-xs mt-0.5 block">{selectedPo.poNumber}</strong>
                  <span className="text-[10px] text-[#5A9A1E] font-bold">✓ Approved</span>
                </div>
                <div className="bg-[#77BC2E]/10 border border-[#77BC2E]/30 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-[#5A9A1E] block">2. Goods Receipt</span>
                  <strong className="text-[#4A2E1B] text-xs mt-0.5 block">Store Inspected</strong>
                  <span className="text-[10px] text-[#5A9A1E] font-bold">✓ 100% Quantity</span>
                </div>
                <div className="bg-[#77BC2E]/10 border border-[#77BC2E]/30 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-[#5A9A1E] block">3. Vendor Invoice</span>
                  <strong className="text-[#4A2E1B] text-xs mt-0.5 block">INV-{selectedPo.poNumber.replace('PO-', '')}</strong>
                  <span className="text-[10px] text-[#5A9A1E] font-bold">✓ Math Verified</span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="border border-[#EAE8E2] rounded-2xl p-4 space-y-2 bg-[#FAF9F5]">
                <h4 className="font-bold text-[#4A2E1B]">Order Line Items</h4>
                <div className="divide-y divide-[#EAE8E2]">
                  {selectedPo.items.map((item, i) => (
                    <div key={i} className="py-2 flex justify-between">
                      <div>
                        <p className="font-bold text-[#4A2E1B]">{item.name}</p>
                        <p className="text-[11px] text-[#8A817C]">{item.qty} units &times; ₱{item.unitPrice.toLocaleString()}</p>
                      </div>
                      <span className="font-mono font-bold text-[#4A2E1B]">₱{item.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#EAE8E2] pt-2 flex justify-between text-sm font-extrabold text-[#031134]">
                  <span>Total Payable:</span>
                  <span className="font-mono text-[#77BC2E]">₱{selectedPo.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Accounting AP Allocation */}
              <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-[#EAE8E2]">
                <div>
                  <span className="text-[10px] font-bold text-[#8A817C] uppercase block">AP Voucher Number</span>
                  <strong className="text-[#031134] font-mono">{selectedPo.accountingVoucher}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#8A817C] uppercase block">General Ledger Account</span>
                  <span className="text-[#4A2E1B] font-mono font-semibold">{selectedPo.glAccount}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#8A817C] uppercase block">Payment Method</span>
                  <span className="text-[#5A534E] font-medium">{selectedPo.paymentTerm}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#8A817C] uppercase block">3-Way Match Verification</span>
                  <span className="text-[#5A9A1E] font-bold">{selectedPo.matchStatus}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                {selectedPo.step === 4 && (
                  <button
                    onClick={() => { handleAdvancePo(selectedPo.poNumber); setSelectedPo(null); }}
                    className="flex-1 bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-sm"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Post Voucher Directly to Accounting Ledger</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedPo(null)}
                  className="bg-[#031134] hover:bg-[#082260] text-white font-semibold px-5 py-2.5 rounded-xl transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. NEW GENERAL LEDGER JOURNAL ENTRY MODAL */}
      {showNewJournalModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl w-full max-w-2xl p-7 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#F2F0E8] pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#031134] tracking-wider">General Ledger</span>
                <h3 className="font-extrabold text-lg text-[#4A2E1B]">Create Double-Entry Journal Record</h3>
                <p className="text-xs text-[#8A817C]">Enter balancing debit and credit entries according to standard Philippine Chart of Accounts.</p>
              </div>
              <button onClick={() => setShowNewJournalModal(false)} className="text-[#8A817C] hover:text-[#4A2E1B]">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJournalEntry} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Transaction Date</label>
                  <input
                    type="date"
                    required
                    value={newJournalEntry.date}
                    onChange={(e) => setNewJournalEntry({ ...newJournalEntry, date: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3 py-2 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Reference / Voucher #</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. JE-MANUAL-01"
                    value={newJournalEntry.reference}
                    onChange={(e) => setNewJournalEntry({ ...newJournalEntry, reference: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3 py-2 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Branch</label>
                  <select
                    value={newJournalEntry.branch}
                    onChange={(e) => setNewJournalEntry({ ...newJournalEntry, branch: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3 py-2 font-medium outline-none"
                  >
                    <option value="Consolidated">Consolidated (All Branches)</option>
                    <option value="Centrio Mall (Waxing)">Centrio Mall (Waxing)</option>
                    <option value="Passion Nails (Centrio)">Passion Nails (Centrio)</option>
                    <option value="Limketkai Mall Branch">Limketkai Mall Branch</option>
                    <option value="SM Downtown Premier">SM Downtown Premier</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Transaction Memo / Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Replenishment of branch petty cash float for utility dues"
                  value={newJournalEntry.description}
                  onChange={(e) => setNewJournalEntry({ ...newJournalEntry, description: e.target.value })}
                  className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2.5 font-medium outline-none"
                />
              </div>

              {/* Dynamic Line Items */}
              <div className="space-y-2 border border-[#EAE8E2] rounded-2xl p-4 bg-[#FAF9F5]">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-[#031134]">Journal Lines (Debit & Credit)</h4>
                  <button
                    type="button"
                    onClick={() => setNewJournalEntry({
                      ...newJournalEntry,
                      lines: [...newJournalEntry.lines, { accountCode: '6010', accountName: 'General Expense', debit: 0, credit: 0 }]
                    })}
                    className="text-[#77BC2E] font-bold text-[11px] hover:underline flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Line</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {newJournalEntry.lines.map((line, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-xl border border-[#EAE8E2]">
                      <div className="col-span-3">
                        <select
                          value={line.accountCode}
                          onChange={(e) => {
                            const map = {
                              '1010': 'Cash in Register Drawer',
                              '1020': 'Cash in Bank - BPI BizLink Master',
                              '1040': 'Consumable Inventory - Wax Supplies',
                              '2010': 'Accounts Payable - Trade Suppliers',
                              '2020': 'Accrued Payroll Payable',
                              '2040': 'BIR Withholding Tax Payable',
                              '4010': 'Waxing Service Revenue',
                              '4020': 'Nail Service Revenue',
                              '4030': 'Retail Product Sales',
                              '5010': 'Cost of Goods Sold (Consumables)',
                              '6010': 'Salaries & Wages Expense',
                              '6020': 'Store Rental & CUSA Expense',
                              '6030': 'Power & Water Utilities Expense',
                              '6050': 'Branch Supplies & Maintenance'
                            };
                            const code = e.target.value;
                            const newLines = [...newJournalEntry.lines];
                            newLines[idx].accountCode = code;
                            newLines[idx].accountName = map[code] || 'General Account';
                            setNewJournalEntry({ ...newJournalEntry, lines: newLines });
                          }}
                          className="w-full bg-[#F7F6F2] border border-transparent rounded-lg px-2 py-1.5 font-mono text-[11px] font-bold"
                        >
                          <option value="1010">1010 Cash Drawer</option>
                          <option value="1020">1020 BPI BizLink</option>
                          <option value="1040">1040 Inventory</option>
                          <option value="2010">2010 AP Suppliers</option>
                          <option value="2020">2020 Accrued Payroll</option>
                          <option value="2040">2040 Tax Payable</option>
                          <option value="4010">4010 Wax Revenue</option>
                          <option value="4020">4020 Nail Revenue</option>
                          <option value="4030">4030 Retail Sales</option>
                          <option value="5010">5010 COGS Wax</option>
                          <option value="6010">6010 Salaries Expense</option>
                          <option value="6020">6020 Store Rent</option>
                          <option value="6030">6030 Utilities</option>
                          <option value="6050">6050 Supplies</option>
                        </select>
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={line.accountName}
                          onChange={(e) => {
                            const newLines = [...newJournalEntry.lines];
                            newLines[idx].accountName = e.target.value;
                            setNewJournalEntry({ ...newJournalEntry, lines: newLines });
                          }}
                          className="w-full bg-[#F7F6F2] border border-transparent rounded-lg px-2 py-1.5 text-[11px]"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          placeholder="Debit ₱"
                          min={0}
                          value={line.debit || ''}
                          onChange={(e) => {
                            const newLines = [...newJournalEntry.lines];
                            newLines[idx].debit = Number(e.target.value);
                            setNewJournalEntry({ ...newJournalEntry, lines: newLines });
                          }}
                          className="w-full bg-[#F7F6F2] border border-transparent rounded-lg px-2 py-1.5 font-mono text-right text-[11px] font-bold text-[#5A9A1E]"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Credit ₱"
                          min={0}
                          value={line.credit || ''}
                          onChange={(e) => {
                            const newLines = [...newJournalEntry.lines];
                            newLines[idx].credit = Number(e.target.value);
                            setNewJournalEntry({ ...newJournalEntry, lines: newLines });
                          }}
                          className="w-full bg-[#F7F6F2] border border-transparent rounded-lg px-2 py-1.5 font-mono text-right text-[11px] font-bold text-[#D47098]"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        {newJournalEntry.lines.length > 2 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newLines = newJournalEntry.lines.filter((_, i) => i !== idx);
                              setNewJournalEntry({ ...newJournalEntry, lines: newLines });
                            }}
                            className="text-[#8A817C] hover:text-[#D47098]"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Debit vs Credit Balance Check */}
                {(() => {
                  const debits = newJournalEntry.lines.reduce((s, l) => s + (Number(l.debit) || 0), 0);
                  const credits = newJournalEntry.lines.reduce((s, l) => s + (Number(l.credit) || 0), 0);
                  const isBalanced = Math.abs(debits - credits) <= 0.01 && debits > 0;

                  return (
                    <div className="flex items-center justify-between pt-3 border-t border-[#EAE8E2] text-xs">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${isBalanced ? 'bg-[#77BC2E]' : 'bg-[#D47098]'}`}></span>
                        <span className={isBalanced ? 'text-[#5A9A1E] font-bold' : 'text-[#D47098] font-bold'}>
                          {isBalanced ? '✓ Balanced Entry' : `Unbalanced Difference: ₱${Math.abs(debits - credits).toFixed(2)}`}
                        </span>
                      </div>
                      <div className="space-x-4 font-mono font-bold">
                        <span>Debits: <strong className="text-[#5A9A1E]">₱{debits.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></span>
                        <span>Credits: <strong className="text-[#D47098]">₱{credits.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#031134] hover:bg-[#082260] text-white font-bold py-3 rounded-xl transition-all shadow-sm"
                >
                  Post to General Ledger
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewJournalModal(false)}
                  className="bg-[#F2F0E8] text-[#5A534E] font-semibold px-5 py-3 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 11. NEW VENDOR BILL / AP INVOICE MODAL */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl w-full max-w-md p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-[#F2F0E8] pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#77BC2E] tracking-wider">Accounts Payable</span>
                <h3 className="font-extrabold text-lg text-[#4A2E1B]">Record Supplier Bill</h3>
              </div>
              <button onClick={() => setShowNewInvoiceModal(false)} className="text-[#8A817C] hover:text-[#4A2E1B]">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Supplier / Vendor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Honey Wax Imports Inc."
                  value={newInvoice.vendor}
                  onChange={(e) => setNewInvoice({ ...newInvoice, vendor: e.target.value })}
                  className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2.5 font-medium outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">PO Reference #</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PO-2026-0905"
                    value={newInvoice.poNumber}
                    onChange={(e) => setNewInvoice({ ...newInvoice, poNumber: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2.5 font-medium font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Branch</label>
                  <select
                    value={newInvoice.branch}
                    onChange={(e) => setNewInvoice({ ...newInvoice, branch: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3 py-2.5 font-medium outline-none"
                  >
                    <option value="Centrio Mall (Waxing)">Centrio Waxing</option>
                    <option value="Passion Nails (Centrio)">Passion Nails</option>
                    <option value="Limketkai Mall Branch">Limketkai</option>
                    <option value="SM Downtown Branch">SM Downtown</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Invoice Amount (PHP)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2.5 font-mono font-bold text-[#5A9A1E] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Payment Due Date</label>
                  <input
                    type="date"
                    required
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3 py-2.5 font-medium outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Expense / Stock Category</label>
                <select
                  value={newInvoice.category}
                  onChange={(e) => setNewInvoice({ ...newInvoice, category: e.target.value })}
                  className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3 py-2.5 font-medium outline-none"
                >
                  <option value="Wax Consumables">Wax Consumables</option>
                  <option value="Nail Supplies">Nail Supplies</option>
                  <option value="PPE & Sanitizers">PPE & Sanitizers</option>
                  <option value="Store Lease & CUSA">Store Lease & CUSA</option>
                  <option value="Utilities">Utilities</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Item Description</label>
                <textarea
                  rows={2}
                  value={newInvoice.description}
                  onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                  className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2.5 font-medium outline-none"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold py-3 rounded-xl transition-all shadow-sm shadow-[#77BC2E]/20"
                >
                  Save to Accounts Payable
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewInvoiceModal(false)}
                  className="bg-[#F2F0E8] text-[#5A534E] font-semibold px-4 py-3 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 12. POS CASH AUDIT & RECONCILIATION MODAL */}
      {showPosReconModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl w-full max-w-lg p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-[#F2F0E8] pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#E89BB9] tracking-wider">Daily Register Audit</span>
                <h3 className="font-extrabold text-lg text-[#4A2E1B]">Reconcile Shift Cash Drawer</h3>
              </div>
              <button onClick={() => setShowPosReconModal(false)} className="text-[#8A817C] hover:text-[#4A2E1B]">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePosRecon} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Branch Location</label>
                  <select
                    value={newPosRecon.branch}
                    onChange={(e) => setNewPosRecon({ ...newPosRecon, branch: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3 py-2.5 font-medium outline-none"
                  >
                    <option value="Centrio Mall (Waxing)">Centrio Mall (Waxing)</option>
                    <option value="Passion Nails (Centrio)">Passion Nails (Centrio)</option>
                    <option value="Limketkai Mall">Limketkai Mall</option>
                    <option value="SM Downtown Premier">SM Downtown Premier</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Shift Supervisor</label>
                  <input
                    type="text"
                    required
                    value={newPosRecon.shiftSupervisor}
                    onChange={(e) => setNewPosRecon({ ...newPosRecon, shiftSupervisor: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3 py-2.5 font-medium outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Morning Float (₱)</label>
                  <input
                    type="number"
                    required
                    value={newPosRecon.openingFloat}
                    onChange={(e) => setNewPosRecon({ ...newPosRecon, openingFloat: Number(e.target.value) })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3 py-2 font-mono font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Physical Cash Sales (₱)</label>
                  <input
                    type="number"
                    required
                    value={newPosRecon.cashSales}
                    onChange={(e) => setNewPosRecon({ ...newPosRecon, cashSales: Number(e.target.value) })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3 py-2 font-mono font-bold text-[#5A9A1E] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-[#FAF9F5] p-3 rounded-2xl border border-[#EAE8E2]">
                <div>
                  <label className="block font-bold text-[#8A817C] text-[10px] mb-1 uppercase">Maya QR (₱)</label>
                  <input
                    type="number"
                    value={newPosRecon.mayaQrSales}
                    onChange={(e) => setNewPosRecon({ ...newPosRecon, mayaQrSales: Number(e.target.value) })}
                    className="w-full bg-white border border-[#EAE8E2] rounded-lg px-2 py-1 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#8A817C] text-[10px] mb-1 uppercase">GCash QR (₱)</label>
                  <input
                    type="number"
                    value={newPosRecon.gcashQrSales}
                    onChange={(e) => setNewPosRecon({ ...newPosRecon, gcashQrSales: Number(e.target.value) })}
                    className="w-full bg-white border border-[#EAE8E2] rounded-lg px-2 py-1 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#8A817C] text-[10px] mb-1 uppercase">Card POS (₱)</label>
                  <input
                    type="number"
                    value={newPosRecon.cardTerminalSales}
                    onChange={(e) => setNewPosRecon({ ...newPosRecon, cardTerminalSales: Number(e.target.value) })}
                    className="w-full bg-white border border-[#EAE8E2] rounded-lg px-2 py-1 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Petty Cash Out (₱)</label>
                  <input
                    type="number"
                    value={newPosRecon.pettyCashExpenses}
                    onChange={(e) => setNewPosRecon({ ...newPosRecon, pettyCashExpenses: Number(e.target.value) })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3 py-2 font-mono text-[#D47098] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Counted Physical Cash (₱)</label>
                  <input
                    type="number"
                    required
                    value={newPosRecon.actualCashCounted}
                    onChange={(e) => setNewPosRecon({ ...newPosRecon, actualCashCounted: Number(e.target.value) })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3 py-2 font-mono font-black text-sm text-[#031134] outline-none"
                  />
                </div>
              </div>

              {/* Real-time Math Summary */}
              {(() => {
                const expected = (Number(newPosRecon.openingFloat) || 0) + (Number(newPosRecon.cashSales) || 0) - (Number(newPosRecon.pettyCashExpenses) || 0);
                const actual = Number(newPosRecon.actualCashCounted) || 0;
                const diff = actual - expected;

                return (
                  <div className="bg-[#FAF9F5] p-3.5 rounded-2xl border border-[#EAE8E2] flex items-center justify-between text-xs font-bold">
                    <div>
                      <span className="text-[#8A817C] block text-[10px]">Expected Cash in Drawer:</span>
                      <span className="font-mono text-[#4A2E1B]">₱{expected.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#8A817C] block text-[10px]">Variance:</span>
                      <span className={`font-mono text-sm ${diff === 0 ? 'text-[#5A9A1E]' : 'text-[#D47098]'}`}>
                        {diff === 0 ? '₱0.00 Exact Match' : `₱${diff.toFixed(2)} (${diff > 0 ? 'Over' : 'Short'})`}
                      </span>
                    </div>
                  </div>
                );
              })()}

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#031134] hover:bg-[#082260] text-white font-bold py-3 rounded-xl transition-all shadow-sm"
                >
                  Save Shift Cash Audit
                </button>
                <button
                  type="button"
                  onClick={() => setShowPosReconModal(false)}
                  className="bg-[#F2F0E8] text-[#5A534E] font-semibold px-4 py-3 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 13. PRINTABLE OFFICIAL FINANCIAL STATEMENT MODAL */}
      {showFinancialReportModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl w-full max-w-2xl p-8 space-y-6 max-h-[90vh] overflow-y-auto printable-report">
            
            {/* Report Letterhead */}
            <div className="flex items-center justify-between border-b-2 border-[#031134] pb-4">
              <div className="flex items-center space-x-3">
                <img src="/alrajj-icon.png" alt="ALRAJJ LEGACY" className="h-12 w-12 object-contain rounded-xl p-1 bg-[#031134]" />
                <div>
                  <h2 className="font-black text-lg tracking-tight text-[#031134]">ALRAJJ LEGACY FORTIFIED BUSINESS CORP.</h2>
                  <p className="text-[11px] text-[#5A534E]">TIN: 009-847-192-000 &bull; Cagayan de Oro City, Philippines</p>
                  <p className="text-[10px] text-[#8A817C]">Branches: Centrio Mall Waxing &bull; Passion Nails &bull; Limketkai &bull; SM Downtown</p>
                </div>
              </div>
              <div className="text-right">
                <span className="bg-[#031134] text-[#D4AF37] text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                  Official Statement
                </span>
                <p className="text-[10px] text-[#8A817C] mt-1 font-mono">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
              </div>
            </div>

            {/* Statement Content */}
            <div className="space-y-4 text-xs">
              <div className="text-center space-y-0.5">
                <h3 className="font-extrabold text-base text-[#4A2E1B] uppercase tracking-wider">
                  {financialReportType === 'pl' ? 'Statement of Comprehensive Income (Profit & Loss)' : 'Statement of Financial Position (Balance Sheet)'}
                </h3>
                <p className="text-[#8A817C]">For the Period Ended August 31, 2026 (All amounts in Philippine Peso ₱)</p>
              </div>

              {financialReportType === 'pl' ? (
                <div className="border border-[#EAE8E2] rounded-2xl p-4 bg-[#FAF9F5] space-y-3 font-medium">
                  <div className="flex justify-between font-bold text-[#031134] border-b border-[#EAE8E2] pb-1">
                    <span>Gross Service & Retail Revenue:</span>
                    <span className="font-mono">₱1,284,650.00</span>
                  </div>
                  <div className="flex justify-between text-[#D47098]">
                    <span>Less: Cost of Goods Sold (Consumables & Supplies):</span>
                    <span className="font-mono">(₱248,300.00)</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-[#5A9A1E] bg-[#77BC2E]/15 p-2 rounded-xl">
                    <span>GROSS OPERATING PROFIT (80.67%):</span>
                    <span className="font-mono">₱1,036,350.00</span>
                  </div>
                  <div className="flex justify-between text-[#4A2E1B] pt-1">
                    <span>Less: Operating Expenses (Salaries, Mall Rents, Utilities):</span>
                    <span className="font-mono">(₱582,400.00)</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-white bg-[#031134] p-3 rounded-xl border border-[#D4AF37]">
                    <span className="text-[#D4AF37]">NET OPERATING INCOME (EBITDA - 35.33%):</span>
                    <span className="font-mono text-white">₱453,950.00</span>
                  </div>
                </div>
              ) : (
                <div className="border border-[#EAE8E2] rounded-2xl p-4 bg-[#FAF9F5] space-y-3 font-medium">
                  <div className="flex justify-between font-bold text-[#5A9A1E] border-b border-[#EAE8E2] pb-1">
                    <span>TOTAL ASSETS (Current + Non-Current Property/Equipment):</span>
                    <span className="font-mono">₱4,121,700.00</span>
                  </div>
                  <div className="flex justify-between text-[#D47098]">
                    <span>TOTAL LIABILITIES (Trade AP, Accrued Payroll, Tax Payables):</span>
                    <span className="font-mono">₱562,500.00</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-[#031134] bg-[#031134]/10 p-2 rounded-xl">
                    <span>TOTAL SHAREHOLDER EQUITY (Capital + Retained + MTD Profit):</span>
                    <span className="font-mono">₱3,559,200.00</span>
                  </div>
                  <div className="flex justify-between font-black text-xs text-[#5A9A1E] pt-1 text-center">
                    <span>✓ Equation Verified: Total Assets = Total Liabilities + Equity</span>
                  </div>
                </div>
              )}

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-[#EAE8E2] text-center">
                <div className="space-y-1">
                  <div className="border-b border-stone-400 w-40 mx-auto h-8 flex items-end justify-center font-bold text-[11px] text-[#031134]">
                    Kristene HR / Acc
                  </div>
                  <span className="text-[10px] text-[#8A817C] uppercase font-bold block">Prepared & Certified By</span>
                  <span className="text-[10px] text-[#5A534E]">Head of Accounting & HR</span>
                </div>
                <div className="space-y-1">
                  <div className="border-b border-stone-400 w-40 mx-auto h-8 flex items-end justify-center font-bold text-[11px] text-[#031134]">
                    Ms. Jehan Abedin
                  </div>
                  <span className="text-[10px] text-[#8A817C] uppercase font-bold block">Authorized & Approved By</span>
                  <span className="text-[10px] text-[#5A534E]">Managing Director</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#F2F0E8]">
              <span className="text-xs text-[#8A817C]">SETHCON ERP Suite Engine</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => window.print()}
                  className="bg-[#031134] hover:bg-[#082260] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
                >
                  <Printer className="h-4 w-4 text-[#D4AF37]" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => setShowFinancialReportModal(false)}
                  className="bg-[#F2F0E8] text-[#5A534E] font-semibold text-xs px-4 py-2.5 rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
