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
  ExternalLink
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
    name: '', phone: '', branch: 'Centrio Mall (Waxing)', preferredTechnician: 'Justine Ann Atay', activePackage: 'Underarm Waxing 5-Pack (5/5 left)', skinNotes: ''
  });
  const [crmToast, setCrmToast] = useState('');

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

  // File Upload State
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ loading: false, success: false, message: '' });

  // Add Employee Form State
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ id: '', name: '', branch: '', rate: 600, taxStatus: 'S' });

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
      { id: 33, name: 'Justine Ann Atay', branch: 'Centrio Mall (Waxing)', role: 'Senior Waxing Specialist', rate: 600, tax_status: 'S', bpi_account: '0249821401' },
      { id: 34, name: 'Cherimar Concigo', branch: 'Centrio Mall (Waxing)', role: 'Master Aesthetician', rate: 650, tax_status: 'S', bpi_account: '0249821402' },
      { id: 35, name: 'Kristene HR', branch: 'Limketkai Mall', role: 'Operations & HR Lead', rate: 800, tax_status: 'S', bpi_account: '0249821403' },
      { id: 36, name: 'Cherry Rose Paculanang', branch: 'Passion Nails (Centrio)', role: 'Senior Nail Technician', rate: 580, tax_status: 'ME', bpi_account: '0249821404' }
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
        const totalDeductions = Number((sss + philhealth + pagibig).toFixed(2));
        const netPay = Number((grossPay - totalDeductions).toFixed(2));

        return {
          employeeId: emp.id,
          employeeName: emp.name,
          branch: emp.branch,
          dailyRate: emp.rate,
          taxStatus: emp.tax_status,
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
            deductions: { sss, philhealth, pagibig, tax: 0, totalDeductions },
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
      setNewEmployee({ id: '', name: '', branch: '', rate: 600, taxStatus: 'S' });
      fetchData();
    } catch (err) {
      console.warn('Backend add employee failed. Modifying local array.');
      setEmployees(prev => [...prev, {
        id: parseInt(newEmployee.id),
        name: newEmployee.name,
        branch: newEmployee.branch,
        rate: parseFloat(newEmployee.rate),
        tax_status: newEmployee.taxStatus,
        bpi_account: newEmployee.bpiAccount || `024982140${employees.length + 1}`,
        role: 'Salon Specialist'
      }]);
      setShowAddEmployeeModal(false);
      setNewEmployee({ id: '', name: '', branch: 'Centrio Mall (Waxing)', rate: 600, taxStatus: 'S', bpiAccount: '' });
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
            
            {/* Category 1: OVERVIEW */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#A8A29E] px-3">Overview</span>
              
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
                onClick={() => { setActiveTab('payroll'); setSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-semibold transition-all ${
                  activeTab === 'payroll'
                    ? 'bg-[#77BC2E] text-white shadow-sm shadow-[#77BC2E]/25'
                    : 'text-[#5A534E] hover:bg-[#F7F6F2] hover:text-[#4A2E1B]'
                }`}
              >
                <Calculator className="h-4 w-4" />
                <span>Accounting & Payroll</span>
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

            {/* Category 4: SETHCON ENTERPRISE SUITE */}
            <div className="space-y-1 pt-2 border-t border-[#F2F0E8]">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#031134] px-3 flex items-center justify-between">
                <span>SETHCON Suite</span>
                <Sparkles className="h-3 w-3 text-[#D4AF37]" />
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

              <button
                onClick={() => { setShowSethconModal(true); setSidebarOpen(false); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold text-[#8A817C] hover:bg-[#F7F6F2] hover:text-[#031134] transition-all"
              >
                <div className="flex items-center space-x-2">
                  <Building className="h-3.5 w-3.5 text-[#8A817C]" />
                  <span>About Sethcon Suite</span>
                </div>
                <ChevronRight className="h-3 w-3" />
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
        
        {/* Top Navbar in Content Area (Behance HRMS Style) */}
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
              <p className="text-xs text-[#8A817C] hidden sm:block">Here is the real-time biometric and payroll pulse for Lay Bare branches.</p>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            
            {/* Quick Enterprise Suite Switcher */}
            <div className="hidden lg:flex items-center bg-white border border-[#EAE8E2] p-1 rounded-2xl shadow-2xs space-x-1 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  ['dashboard', 'payroll', 'exceptions', 'tardiness', 'upload'].includes(activeTab)
                    ? 'bg-[#77BC2E] text-white font-bold shadow-2xs'
                    : 'text-[#5A534E] hover:text-[#4A2E1B]'
                }`}
              >
                HR & Payroll
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
                <span>PO &rarr; Accounting</span>
              </button>
            </div>

            {/* Sethcon Enterprise Suite Pill Button */}
            <button
              onClick={() => setShowSethconModal(true)}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-[#031134] to-[#0A1B45] text-white hover:opacity-90 text-xs font-bold rounded-xl px-3 py-2 shadow-sm shadow-[#031134]/20 transition-all border border-white/10"
              title="Explore Sethcon CRM, PO to Accounting, and Enterprise Modules"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Sethcon Suite</span>
            </button>

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
                  onClick={() => setShowAddEmployeeModal(true)}
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
                    <span>Statutory Computation Basis & Labor Standards</span>
                  </span>
                  <span className="text-[10px] text-[#8A817C] font-semibold">Configured for ALRAJJ LEGACY Branches</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-2xl border border-[#F2F0E8]">
                    <span className="text-[10px] font-bold text-[#8A817C] uppercase block">Hourly Wage Formula</span>
                    <strong className="text-[#4A2E1B] block mt-0.5 font-mono text-[11px]">Daily Rate &divide; 8.0 hrs</strong>
                    <span className="text-[10px] text-[#5A534E]">Base for regular work hours</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-[#F2F0E8]">
                    <span className="text-[10px] font-bold text-[#8A817C] uppercase block">Late Penalty Rate</span>
                    <strong className="text-[#D47098] block mt-0.5 font-mono text-[11px]">Hourly Rate &divide; 60 mins</strong>
                    <span className="text-[10px] text-[#5A534E]">Grace period: 5 mins</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-[#F2F0E8]">
                    <span className="text-[10px] font-bold text-[#8A817C] uppercase block">Overtime (OT) Multiplier</span>
                    <strong className="text-[#77BC2E] block mt-0.5 font-mono text-[11px]">125% &times; Hourly Rate</strong>
                    <span className="text-[10px] text-[#5A534E]">Regular work-day overtime</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-[#F2F0E8]">
                    <span className="text-[10px] font-bold text-[#8A817C] uppercase block">Night Diff (10PM - 6AM)</span>
                    <strong className="text-[#77BC2E] block mt-0.5 font-mono text-[11px]">+10% Premium</strong>
                    <span className="text-[10px] text-[#5A534E]">Evening mall shift coverage</span>
                  </div>
                </div>
              </div>

              {/* Staff Table Card */}
              <div className="bg-white border border-[#EAE8E2] rounded-3xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#FAF9F5] border-b border-[#F2F0E8] text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C]">
                        <th className="px-6 py-3.5">Biometric ID</th>
                        <th className="px-6 py-3.5">Employee Name & Role</th>
                        <th className="px-6 py-3.5">Branch Assignment</th>
                        <th className="px-6 py-3.5">Daily Wage (PHP)</th>
                        <th className="px-6 py-3.5">Hourly Rate</th>
                        <th className="px-6 py-3.5">BPI BizLink Account</th>
                        <th className="px-6 py-3.5">Tax / Status</th>
                        <th className="px-6 py-3.5">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2F0E8]">
                      {employees.map((emp, idx) => {
                        const bpiAcct = emp.bpi_account || `024982140${idx + 1}`;
                        const role = emp.role || (emp.name.includes('HR') ? 'Operations & HR Lead' : 'Senior Waxing Specialist');
                        const hourly = (emp.rate / 8).toFixed(2);
                        return (
                          <tr key={emp.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                            <td className="px-6 py-4 font-mono font-extrabold text-[#031134]">
                              <span className="bg-[#FAF9F5] border border-[#EAE8E2] px-2.5 py-1 rounded-lg">
                                #{emp.id}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-bold text-[#4A2E1B]">{emp.name}</p>
                              <p className="text-[11px] text-[#8A817C]">{role}</p>
                            </td>
                            <td className="px-6 py-4 font-semibold text-[#5A534E]">
                              {emp.branch}
                            </td>
                            <td className="px-6 py-4 font-mono font-extrabold text-[#4A2E1B]">
                              ₱{parseFloat(emp.rate).toFixed(2)}/day
                            </td>
                            <td className="px-6 py-4 font-mono text-[#5A534E]">
                              ₱{hourly}/hr
                            </td>
                            <td className="px-6 py-4 font-mono">
                              <span className="bg-[#031134]/10 text-[#031134] font-bold px-2 py-0.5 rounded-md text-[11px]">
                                {bpiAcct}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="bg-[#77BC2E]/15 text-[#5A9A1E] font-bold text-[10px] px-2 py-0.5 rounded-md">
                                {emp.tax_status === 'ME' ? 'Married (ME)' : 'Single (S)'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => setShowAddEmployeeModal(true)}
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

      {/* ADD EMPLOYEE MODAL */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl w-full max-w-md p-7 space-y-6">
            <div className="flex items-center justify-between border-b border-[#F2F0E8] pb-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#77BC2E] uppercase">Staff Registry</span>
                <h3 className="font-extrabold text-lg text-[#4A2E1B]">Create Employee Profile</h3>
              </div>
              <button onClick={() => setShowAddEmployeeModal(false)} className="text-[#8A817C] hover:text-[#4A2E1B]">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Device ID</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 37"
                    value={newEmployee.id}
                    onChange={(e) => setNewEmployee({ ...newEmployee, id: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2.5 font-medium outline-none focus:ring-1 focus:ring-[#77BC2E]"
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
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2.5 font-medium outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Branch Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Centrio Mall (Waxing)"
                    value={newEmployee.branch}
                    onChange={(e) => setNewEmployee({ ...newEmployee, branch: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2.5 font-medium outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Tax Status</label>
                  <select
                    value={newEmployee.taxStatus}
                    onChange={(e) => setNewEmployee({ ...newEmployee, taxStatus: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3 py-2.5 font-medium outline-none"
                  >
                    <option value="S">Single</option>
                    <option value="ME">Married</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Daily Wage Rate (PHP)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 600"
                    value={newEmployee.rate}
                    onChange={(e) => setNewEmployee({ ...newEmployee, rate: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2.5 font-medium outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">10-Digit BPI Account</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0249821405"
                    value={newEmployee.bpiAccount || ''}
                    onChange={(e) => setNewEmployee({ ...newEmployee, bpiAccount: e.target.value })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3.5 py-2.5 font-mono font-medium outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold py-3 rounded-xl text-xs shadow-sm transition-all"
                >
                  Create Profile
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
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl w-full max-w-xl p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#F2F0E8] pb-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#77BC2E] uppercase">Official Statement</span>
                <h3 className="font-extrabold text-lg text-[#4A2E1B]">Semi-Monthly Payslip</h3>
                <p className="text-xs text-[#8A817C] font-mono mt-0.5">Period: {startDate} ~ {endDate}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="p-2.5 rounded-xl border border-[#EAE8E2] hover:bg-[#FAF9F5] flex items-center justify-center transition-colors text-[#4A2E1B]"
                  title="Print Payslip"
                >
                  <Printer className="h-4 w-4" />
                </button>
                <button onClick={() => setSelectedPayslip(null)} className="p-2.5 rounded-xl border border-[#EAE8E2] hover:bg-[#FAF9F5] flex items-center justify-center text-[#8A817C]">
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Payslip body */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-[#FAF9F5] p-4 rounded-2xl border border-[#F2F0E8]">
                <div>
                  <span className="text-[#8A817C] block text-[10px] uppercase font-bold tracking-wider">Employee Name</span>
                  <strong className="text-sm font-bold text-[#4A2E1B]">{selectedPayslip.employeeName}</strong>
                </div>
                <div>
                  <span className="text-[#8A817C] block text-[10px] uppercase font-bold tracking-wider">Biometric ID & Branch</span>
                  <span className="font-mono font-bold text-sm text-[#4A2E1B]">#{selectedPayslip.employeeId}</span> • {selectedPayslip.branch}
                </div>
              </div>

              {/* Earnings & Deductions Table */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <h4 className="font-bold border-b border-[#F2F0E8] pb-1 text-[#77BC2E]">Earnings</h4>
                  <div className="flex justify-between">
                    <span>Basic ({selectedPayslip.daysPresent} days)</span>
                    <span className="font-mono font-medium">₱{selectedPayslip.calculations.basicPay.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overtime ({selectedPayslip.totalOtHours} hrs)</span>
                    <span className="font-mono font-medium">₱{selectedPayslip.calculations.otPay.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Night Diff ({selectedPayslip.totalNdHours} hrs)</span>
                    <span className="font-mono font-medium">₱{selectedPayslip.calculations.ndPay.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <h4 className="font-bold border-b border-[#F2F0E8] pb-1 text-[#D47098]">Deductions</h4>
                  <div className="flex justify-between">
                    <span>Late / Tardiness</span>
                    <span className="font-mono text-[#D47098]">-₱{selectedPayslip.calculations.lateDeduction.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SSS Contribution</span>
                    <span className="font-mono text-[#D47098]">-₱{selectedPayslip.calculations.deductions.sss.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PhilHealth</span>
                    <span className="font-mono text-[#D47098]">-₱{selectedPayslip.calculations.deductions.philhealth.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pag-IBIG</span>
                    <span className="font-mono text-[#D47098]">-₱{selectedPayslip.calculations.deductions.pagibig.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Total gross and net */}
              <div className="border-t border-[#F2F0E8] pt-4 mt-4 space-y-1.5">
                <div className="flex justify-between text-[#8A817C]">
                  <span>Gross Pay</span>
                  <span className="font-mono font-semibold text-[#4A2E1B]">₱{selectedPayslip.calculations.grossPay.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#8A817C]">
                  <span>Total Deductions</span>
                  <span className="font-mono font-semibold text-[#D47098]">-₱{selectedPayslip.calculations.deductions.totalDeductions.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold border-t border-dashed border-[#EAE8E2] pt-3 text-[#4A2E1B]">
                  <span>Net Take-Home Pay</span>
                  <span className="font-mono text-[#77BC2E]">₱{selectedPayslip.calculations.netPay.toFixed(2)}</span>
                </div>
              </div>
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

    </div>
  );
}
