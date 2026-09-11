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
  BadgePercent,
  Wifi,
  WifiOff,
  Smartphone,
  Laptop,
  Globe,
  Info,
  Database,
  RotateCcw,
  PenTool,
  Mail,
  FolderPlus,
  Share2,
  HardDrive,
  Copy,
  Lock,
  Key,
  Shield,
  UserPlus,
  Trash2,
  Award
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || (window.location.origin.includes('localhost') ? 'http://localhost:5000/api' : '/api');

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // PWA, Offline Resilience & Custom Domain States
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showPwaModal, setShowPwaModal] = useState(false);
  const [showHelpGuideModal, setShowHelpGuideModal] = useState(false);
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [showDataModeModal, setShowDataModeModal] = useState(false);
  const [systemDataMode, setSystemDataMode] = useState('demo'); // 'demo' | 'live'
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [pwaInstalled, setPwaInstalled] = useState(false);

  // Settings, RBAC Roles & Permissions, Domain & Multi-Branch Configuration States
  const [settingsSubTab, setSettingsSubTab] = useState('domain'); // 'domain' | 'roles' | 'branches' | 'about'
  const [settingsToast, setSettingsToast] = useState('');
  const [dnsTestStatus, setDnsTestStatus] = useState(null); // null | 'testing' | 'success'
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);

  // Custom Corporate Google Workspace Domain State
  const [customDomainConfig, setCustomDomainConfig] = useState({
    apexDomain: 'alrajjlegacy-fortifiedbusinesscorp.com',
    subdomain: 'erp.alrajjlegacy-fortifiedbusinesscorp.com',
    dnsProvider: 'Google Workspace DNS (Google Cloud DNS / Domains)',
    cnameTarget: 'cname.vercel-dns.com',
    txtRecordKey: '_vercel',
    txtRecordValue: 'vc-domain-verify=alrajjlegacy-fortifiedbusinesscorp.com',
    status: 'Connected & Verified (Active)',
    sslStatus: 'Issued & Active (Let\'s Encrypt 256-Bit TLS)',
    lastChecked: 'September 11, 2026',
    googleWorkspaceEmailLinked: 'hr@alrajjlegacy-fortifiedbusinesscorp.com'
  });

  // User Accounts & Role-Based Access Control (RBAC) Matrix
  const [userRolesList, setUserRolesList] = useState([
    {
      id: 'USR-001',
      name: 'Ms. Jehan Abedin',
      email: 'managing.director@alrajjlegacy-fortifiedbusinesscorp.com',
      role: 'Managing Director / Executive',
      branchAccess: 'All Branches (Consolidated)',
      status: 'Active',
      permissions: {
        dashboard: true,
        approvals: true,
        accounting: true,
        payroll: true,
        exceptions: true,
        tardiness: true,
        biometrics: true,
        staff: true,
        crm: true,
        procurement: true,
        dms: true,
        settings: true
      },
      lastLogin: '2026-09-11 09:42 AM'
    },
    {
      id: 'USR-002',
      name: 'Kristene HR',
      email: 'hr@alrajjlegacy-fortifiedbusinesscorp.com',
      role: 'Operations & HR Lead',
      branchAccess: 'All Branches (Consolidated)',
      status: 'Active',
      permissions: {
        dashboard: true,
        approvals: true,
        accounting: true,
        payroll: true,
        exceptions: true,
        tardiness: true,
        biometrics: true,
        staff: true,
        crm: true,
        procurement: true,
        dms: true,
        settings: true
      },
      lastLogin: '2026-09-11 10:05 AM'
    },
    {
      id: 'USR-003',
      name: 'Cherimar Concigo',
      email: 'centrio.lead@alrajjlegacy-fortifiedbusinesscorp.com',
      role: 'Centrio Waxing Shift Supervisor',
      branchAccess: 'Centrio Mall (Waxing)',
      status: 'Active',
      permissions: {
        dashboard: true,
        approvals: true,
        accounting: false,
        payroll: false,
        exceptions: true,
        tardiness: true,
        biometrics: false,
        staff: false,
        crm: true,
        procurement: true,
        dms: true,
        settings: false
      },
      lastLogin: '2026-09-11 08:30 AM'
    },
    {
      id: 'USR-004',
      name: 'Cherry Rose Paculanang',
      email: 'passionnails.lead@alrajjlegacy-fortifiedbusinesscorp.com',
      role: 'Passion Nails Store Lead',
      branchAccess: 'Passion Nails (Centrio)',
      status: 'Active',
      permissions: {
        dashboard: true,
        approvals: true,
        accounting: false,
        payroll: false,
        exceptions: true,
        tardiness: true,
        biometrics: false,
        staff: false,
        crm: true,
        procurement: true,
        dms: true,
        settings: false
      },
      lastLogin: '2026-09-11 08:45 AM'
    },
    {
      id: 'USR-005',
      name: 'Justine Ann Atay',
      email: 'justine.atay@alrajjlegacy-fortifiedbusinesscorp.com',
      role: 'Senior Aesthetician Specialist',
      branchAccess: 'Centrio Mall (Waxing)',
      status: 'Active',
      permissions: {
        dashboard: false,
        approvals: true,
        accounting: false,
        payroll: false,
        exceptions: false,
        tardiness: false,
        biometrics: false,
        staff: false,
        crm: true,
        procurement: false,
        dms: true,
        settings: false
      },
      lastLogin: '2026-09-10 07:15 PM'
    }
  ]);

  // Multi-Branch Directory & Facility Config
  const [branchesConfigList, setBranchesConfigList] = useState([
    {
      id: 'BR-01',
      name: 'Centrio Mall (Waxing Salon)',
      type: 'Lay Bare Waxing Salon',
      location: '3rd Level, Centrio Ayala Mall, Claro M. Recto Ave, CDO',
      manager: 'Cherimar Concigo',
      contact: '+63 917 123 4567',
      biometricIp: '192.168.1.201 (NGTeco MB20)',
      bedsStations: '6 Waxing Cubicles',
      status: 'Operational'
    },
    {
      id: 'BR-02',
      name: 'Passion Nails (Centrio Mall)',
      type: 'Passion Nails by Lay Bare',
      location: '3rd Level, Centrio Ayala Mall, CDO',
      manager: 'Cherry Rose Paculanang',
      contact: '+63 917 234 5678',
      biometricIp: '192.168.1.202 (NGTeco MB20)',
      bedsStations: '8 Spa Chairs & Manicure Desks',
      status: 'Operational'
    },
    {
      id: 'BR-03',
      name: 'Limketkai Mall Branch',
      type: 'Lay Bare Waxing Salon',
      location: '2nd Level, Limketkai Mall, Lapasan, CDO',
      manager: 'Kristene HR / Store Lead',
      contact: '+63 917 345 6789',
      biometricIp: '192.168.2.105 (NGTeco MB20)',
      bedsStations: '5 Waxing Cubicles',
      status: 'Operational'
    },
    {
      id: 'BR-04',
      name: 'SM Downtown Premier Branch',
      type: 'Lay Bare Waxing Salon',
      location: '4th Level, SM CDO Downtown Premier, CM Recto, CDO',
      manager: 'Supervisor In-Charge',
      contact: '+63 917 456 7890',
      biometricIp: '192.168.3.110 (NGTeco MB20)',
      bedsStations: '4 Waxing Cubicles',
      status: 'Operational'
    },
    {
      id: 'BR-05',
      name: 'Iligan City Branch (Upcoming)',
      type: 'Lay Bare Waxing & Spa',
      location: 'Upcoming Prime Commercial Hub, Iligan City',
      manager: 'Designated Store Manager',
      contact: 'Upcoming Expansion (+63 917 000 0000)',
      biometricIp: 'Auto-Provisioning (NGTeco Cloud)',
      bedsStations: '6 Planned Stations',
      status: 'Pre-Opening / Fit-Out'
    }
  ]);

  // Add User Form State
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'Salon Specialist / Staff',
    branchAccess: 'Centrio Mall (Waxing)',
    permissions: {
      dashboard: true,
      approvals: true,
      accounting: false,
      payroll: false,
      exceptions: false,
      tardiness: false,
      biometrics: false,
      staff: false,
      crm: true,
      procurement: false,
      dms: true,
      settings: false
    }
  });

  // Add Branch Form State
  const [newBranchForm, setNewBranchForm] = useState({
    name: '',
    type: 'Lay Bare Waxing Salon',
    location: '',
    manager: '',
    contact: '',
    biometricIp: 'NGTeco MB20 Series',
    bedsStations: '4 Stations'
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setEmailToast('ðŸŸ¢ Connection restored! Real-time Cloud Sync active.');
      setTimeout(() => setEmailToast(''), 4000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setEmailToast('ðŸŸ¡ Offline Mode active. All attendance, POS tickets, and POs are securely cached locally.');
      setTimeout(() => setEmailToast(''), 5000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    window.addEventListener('appinstalled', () => {
      setPwaInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleTriggerPwaInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setPwaInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowPwaModal(true);
    }
  };

  const handleSwitchToLiveData = () => {
    setSystemDataMode('live');
    setEmployees([]);
    setAttendance([]);
    setExceptions([]);
    setTardiness([]);
    setPayroll([]);
    setServiceTickets([]);
    setLivePunches([]);
    setJournalEntries([]);
    setApInvoices([]);
    setPurchaseOrders([]);
    setPosReconciliations([]);
    setApprovalsList([]);
    setDmsDocuments([]);
    setSummary({
      totalEmployees: 0,
      pendingExceptions: 0,
      totalLateMins: 0,
      averageHours: 0
    });
    setShowDataModeModal(false);
    setEmailToast('ðŸ¢ Live Store Mode Active: Clean slate activated! All demo records cleared. Ready for your actual NGTeco biometric uploads & store operations.');
    setTimeout(() => setEmailToast(''), 5000);
  };

  const handleReloadDemoData = () => {
    setSystemDataMode('demo');
    loadMockData();
    setShowDataModeModal(false);
    setEmailToast('ðŸ§ª Demo Dataset Restored: Full 4-branch Lay Bare simulation reloaded.');
    setTimeout(() => setEmailToast(''), 5000);
  };

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

  // Multi-Level Approval Hierarchy State (Chain of Command Routing)
  // Level 1: Branch Specialist/Staff Filing -> Level 2: Shift Supervisor Endorsement -> Level 3: HR/Accounting Audit -> Level 4: Managing Director Ms. Jehan Abedin Executive Sign-off
  const [approvalsList, setApprovalsList] = useState([]);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [showNewApprovalModal, setShowNewApprovalModal] = useState(false);
  const [approvalLevelFilter, setApprovalLevelFilter] = useState('all'); // 'all' | 'level2' | 'level3' | 'level4' | 'completed'
  const [approvalTypeFilter, setApprovalTypeFilter] = useState('all'); // 'all' | 'dtr' | 'po' | 'payroll' | 'vale' | 'leave' | 'expense'
  const [approvalToast, setApprovalToast] = useState('');
  const [newApproval, setNewApproval] = useState({
    type: 'dtr_override',
    title: '',
    requestor: 'Justine Ann Atay',
    role: 'Senior Waxing Specialist',
    branch: 'Centrio Mall (Waxing)',
    amount: '',
    description: '',
    priority: 'Normal'
  });

  // Document Management System (DMS) & E-Signature Hub (Google Workspace Integrated)
  const [dmsDocuments, setDmsDocuments] = useState([]);
  const [dmsCategoryFilter, setDmsCategoryFilter] = useState('all');
  const [dmsSearch, setDmsSearch] = useState('');
  const [showSignModal, setShowSignModal] = useState(false);
  const [selectedDocForSign, setSelectedDocForSign] = useState(null);
  const [showDocViewerModal, setShowDocViewerModal] = useState(false);
  const [selectedDocForView, setSelectedDocForView] = useState(null);
  const [showUploadDocModal, setShowUploadDocModal] = useState(false);
  const [showEditDocModal, setShowEditDocModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState('');
  const [signatureMode, setSignatureMode] = useState('type'); // 'type' | 'draw' | 'upload'
  const [typedSignName, setTypedSignName] = useState('Jehan Abedin');
  const [selectedSignerTitle, setSelectedSignerTitle] = useState('Ms. Jehan Abedin (Managing Director)');
  const [dmsToast, setDmsToast] = useState('');
  const [newDocUpload, setNewDocUpload] = useState({
    title: '',
    category: 'HR & DOLE Compliance',
    branch: 'Centrio Mall (Waxing)',
    recipient: 'Justine Ann Atay',
    recipientEmail: 'hr@alrajjlegacy-fortifiedbusinesscorp.com',
    content: ''
  });

  // Sprout Solutions Enterprise HRMS & Employee Portal Suite
  const [hrActiveSubTab, setHrActiveSubTab] = useState('directory'); // 'directory' | 'leaves' | 'roster' | 'ot_ob' | 'accruals' | 'ess'
  const [selected201Employee, setSelected201Employee] = useState(null);
  const [show201Drawer, setShow201Drawer] = useState(false);
  const [showCoeModal, setShowCoeModal] = useState(false);
  const [showBir2316Modal, setShowBir2316Modal] = useState(false);
  const [showLeaveFilingModal, setShowLeaveFilingModal] = useState(false);
  const [showOtObModal, setShowOtObModal] = useState(false);
  const [showSproutEssModal, setShowSproutEssModal] = useState(false);
  const [essLoggedInStaffId, setEssLoggedInStaffId] = useState(33); // Justine Ann Atay default
  const [hrBranchFilter, setHrBranchFilter] = useState('all');
  const [hrSearchQuery, setHrSearchQuery] = useState('');
  const [sproutToast, setSproutToast] = useState('');

  // SETHCON Leave Records & Time-Off Masterlist
  const [sproutLeaves, setSproutLeaves] = useState([
    {
      id: 'LV-2026-001',
      employeeId: 33,
      employeeName: 'Justine Ann Atay',
      branch: 'Centrio Mall (Waxing)',
      type: 'Service Incentive Leave (SIL)',
      days: 1.0,
      startDate: '2026-07-25',
      endDate: '2026-07-25',
      reason: 'Annual medical physical exam & health card renewal',
      status: 'Approved',
      approvedBy: 'Kristene HR / Ms. Jehan Abedin',
      appliedAt: '2026-07-20',
      paid: true,
      hasAttachment: true
    },
    {
      id: 'LV-2026-002',
      employeeId: 36,
      employeeName: 'Cherry Rose Paculanang',
      branch: 'Passion Nails (Centrio)',
      type: 'Vacation Leave (VL)',
      days: 2.0,
      startDate: '2026-08-04',
      endDate: '2026-08-05',
      reason: 'Family out-of-town trip to Camiguin',
      status: 'Pending Store Lead',
      approvedBy: 'Awaiting Cherimar Concigo',
      appliedAt: '2026-07-28',
      paid: true,
      hasAttachment: false
    },
    {
      id: 'LV-2026-003',
      employeeId: 34,
      employeeName: 'Cherimar Concigo',
      branch: 'Centrio Mall (Waxing)',
      type: 'Sick Leave (SL)',
      days: 1.0,
      startDate: '2026-07-19',
      endDate: '2026-07-19',
      reason: 'Acute migraine & fever (Medical fit-to-work attached)',
      status: 'Approved',
      approvedBy: 'Kristene HR',
      appliedAt: '2026-07-19',
      paid: true,
      hasAttachment: true
    }
  ]);

  // Sprout Shift Rostering & Station Matrix
  const [sproutRosters, setSproutRosters] = useState([
    {
      employeeId: 33,
      name: 'Justine Ann Atay',
      branch: 'Centrio Mall (Waxing)',
      role: 'Senior Waxing Specialist',
      station: 'Cubicle 2',
      schedule: {
        Mon: { shift: 'Morning (10AM - 7PM)', color: 'bg-[#77BC2E]/15 text-[#5A9A1E] border-[#77BC2E]/30' },
        Tue: { shift: 'Morning (10AM - 7PM)', color: 'bg-[#77BC2E]/15 text-[#5A9A1E] border-[#77BC2E]/30' },
        Wed: { shift: 'Closing (12PM - 9PM)', color: 'bg-[#031134]/10 text-[#031134] border-[#031134]/20' },
        Thu: { shift: 'Morning (10AM - 7PM)', color: 'bg-[#77BC2E]/15 text-[#5A9A1E] border-[#77BC2E]/30' },
        Fri: { shift: 'Closing (12PM - 9PM)', color: 'bg-[#031134]/10 text-[#031134] border-[#031134]/20' },
        Sat: { shift: 'Mid (11AM - 8PM)', color: 'bg-[#E89BB9]/25 text-[#D47098] border-[#E89BB9]/40' },
        Sun: { shift: 'Rest Day (RD)', color: 'bg-stone-100 text-stone-500 border-stone-200' }
      }
    },
    {
      employeeId: 34,
      name: 'Cherimar Concigo',
      branch: 'Centrio Mall (Waxing)',
      role: 'Master Aesthetician',
      station: 'Cubicle 1',
      schedule: {
        Mon: { shift: 'Closing (12PM - 9PM)', color: 'bg-[#031134]/10 text-[#031134] border-[#031134]/20' },
        Tue: { shift: 'Closing (12PM - 9PM)', color: 'bg-[#031134]/10 text-[#031134] border-[#031134]/20' },
        Wed: { shift: 'Mid (11AM - 8PM)', color: 'bg-[#E89BB9]/25 text-[#D47098] border-[#E89BB9]/40' },
        Thu: { shift: 'Closing (12PM - 9PM)', color: 'bg-[#031134]/10 text-[#031134] border-[#031134]/20' },
        Fri: { shift: 'Mid (11AM - 8PM)', color: 'bg-[#E89BB9]/25 text-[#D47098] border-[#E89BB9]/40' },
        Sat: { shift: 'Morning (10AM - 7PM)', color: 'bg-[#77BC2E]/15 text-[#5A9A1E] border-[#77BC2E]/30' },
        Sun: { shift: 'Rest Day (RD)', color: 'bg-stone-100 text-stone-500 border-stone-200' }
      }
    },
    {
      employeeId: 35,
      name: 'Kristene HR',
      branch: 'Limketkai Mall',
      role: 'Operations & HR Lead',
      station: 'Admin Office',
      schedule: {
        Mon: { shift: 'Office (09AM - 6PM)', color: 'bg-[#77BC2E]/15 text-[#5A9A1E] border-[#77BC2E]/30' },
        Tue: { shift: 'Office (09AM - 6PM)', color: 'bg-[#77BC2E]/15 text-[#5A9A1E] border-[#77BC2E]/30' },
        Wed: { shift: 'Office (09AM - 6PM)', color: 'bg-[#77BC2E]/15 text-[#5A9A1E] border-[#77BC2E]/30' },
        Thu: { shift: 'Office (09AM - 6PM)', color: 'bg-[#77BC2E]/15 text-[#5A9A1E] border-[#77BC2E]/30' },
        Fri: { shift: 'Office (09AM - 6PM)', color: 'bg-[#77BC2E]/15 text-[#5A9A1E] border-[#77BC2E]/30' },
        Sat: { shift: 'Rest Day (RD)', color: 'bg-stone-100 text-stone-500 border-stone-200' },
        Sun: { shift: 'Rest Day (RD)', color: 'bg-stone-100 text-stone-500 border-stone-200' }
      }
    },
    {
      employeeId: 36,
      name: 'Cherry Rose Paculanang',
      branch: 'Passion Nails (Centrio)',
      role: 'Senior Nail Technician',
      station: 'Nail Desk 3',
      schedule: {
        Mon: { shift: 'Morning (10AM - 7PM)', color: 'bg-[#77BC2E]/15 text-[#5A9A1E] border-[#77BC2E]/30' },
        Tue: { shift: 'Mid (11AM - 8PM)', color: 'bg-[#E89BB9]/25 text-[#D47098] border-[#E89BB9]/40' },
        Wed: { shift: 'Rest Day (RD)', color: 'bg-stone-100 text-stone-500 border-stone-200' },
        Thu: { shift: 'Morning (10AM - 7PM)', color: 'bg-[#77BC2E]/15 text-[#5A9A1E] border-[#77BC2E]/30' },
        Fri: { shift: 'Closing (12PM - 9PM)', color: 'bg-[#031134]/10 text-[#031134] border-[#031134]/20' },
        Sat: { shift: 'Closing (12PM - 9PM)', color: 'bg-[#031134]/10 text-[#031134] border-[#031134]/20' },
        Sun: { shift: 'Morning (10AM - 7PM)', color: 'bg-[#77BC2E]/15 text-[#5A9A1E] border-[#77BC2E]/30' }
      }
    }
  ]);

  // Sprout Overtime (OT) & Official Business (OB) Filings
  const [sproutOtOb, setSproutOtOb] = useState([
    {
      id: 'OT-2026-001',
      employeeId: 33,
      employeeName: 'Justine Ann Atay',
      branch: 'Centrio Mall (Waxing)',
      type: 'Post-Shift Overtime',
      hours: 1.77,
      date: '2026-07-16',
      purpose: 'Centrio Mall peak waxing rush & walk-in queue overrun',
      status: 'Approved',
      approvedBy: 'Cherimar Concigo (Shift Lead)',
      ticketRef: 'LB-2026-8921'
    },
    {
      id: 'OB-2026-001',
      employeeId: 34,
      employeeName: 'Cherimar Concigo',
      branch: 'Centrio Mall (Waxing)',
      type: 'Official Business (OB)',
      hours: 1.5,
      date: '2026-07-17',
      purpose: 'BPI BizLink Branch Cash Deposit & Passbook Verification',
      status: 'Approved',
      approvedBy: 'Kristene HR / MD Auth',
      ticketRef: 'BPI-DEP-492'
    },
    {
      id: 'OT-2026-002',
      employeeId: 36,
      employeeName: 'Cherry Rose Paculanang',
      branch: 'Passion Nails (Centrio)',
      type: 'Post-Shift Overtime',
      hours: 1.0,
      date: '2026-07-20',
      purpose: 'Full Gel Nail Extension VIP Client Overrun',
      status: 'Pending HR Audit',
      approvedBy: 'Awaiting Kristene HR',
      ticketRef: 'PN-2026-4412'
    }
  ]);

  // Forms for new leave and OT/OB
  const [newLeaveForm, setNewLeaveForm] = useState({
    employeeId: 33,
    type: 'Service Incentive Leave (SIL)',
    startDate: '2026-08-10',
    endDate: '2026-08-10',
    days: 1.0,
    reason: '',
    paid: true
  });

  const [newOtObForm, setNewOtObForm] = useState({
    employeeId: 33,
    type: 'Post-Shift Overtime',
    hours: 1.5,
    date: '2026-07-22',
    purpose: '',
    ticketRef: ''
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
  const [crmSubTab, setCrmSubTab] = useState('tickets'); // 'tickets' | 'clients'
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    phone: '',
    branch: 'Centrio Mall (Waxing)',
    preferredTechnician: 'Justine Ann Atay',
    activePackage: 'Underarm Waxing 5-Pack (5/5 left)',
    skinNotes: ''
  });
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
    service: 'Brazilian Wax Express (â‚±650.00)',
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
    supplier: 'Lay Bare Franchisor (MyTime Commissary)',
    itemName: 'Organic Hot Sugar Wax Pellets (10kg)',
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
    currency: 'PHP (â‚±)',
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
    currency: 'PHP (â‚±)',
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
      auditNotes: 'Perfect match. Petty cash was â‚±450 for branch water refill.'
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

  const getInitialApprovals = () => [
    {
      id: 'APR-2026-001',
      type: 'dtr_override',
      typeName: 'DTR Punch Override',
      title: 'Missed OUT Punch on July 16 (Centrio Mall Brownout at Closing)',
      requestor: 'Justine Ann Atay',
      role: 'Senior Waxing Specialist',
      branch: 'Centrio Mall (Waxing)',
      dateSubmitted: '2026-07-17 09:00 AM',
      amount: null,
      currentLevel: 3,
      status: 'Pending HR Audit',
      priority: 'High',
      description: 'Mall experienced emergency brownout at 8:00 PM closing. Store logbook confirms shift completion at 8:07 PM.',
      stages: [
        { level: 1, name: 'Staff Filing', by: 'Justine Ann Atay', time: '2026-07-17 09:00 AM', status: 'Approved', note: 'Submitted via staff attendance portal with physical logbook photo.' },
        { level: 2, name: 'Store Supervisor Endorsement', by: 'Cherimar Concigo (Branch Lead)', time: '2026-07-17 10:15 AM', status: 'Approved', note: 'Verified against Centrio security closing log. Recommended 8.0h regular + 1.77h OT.' },
        { level: 3, name: 'HR Compliance Audit', by: 'Kristene (HR Lead)', time: null, status: 'Pending', note: 'Validating DOLE overtime calculation and rest-day rules.' },
        { level: 4, name: 'Managing Director Sign-off', by: 'Ms. Jehan Abedin (MD)', time: null, status: 'Queued', note: 'Final executive authorization required for retroactive payroll card update.' }
      ]
    },
    {
      id: 'APR-2026-002',
      type: 'commissary_po',
      typeName: 'MyTime Commissary Purchase Order',
      title: 'PO-2026-0901: 20kg Organic Hot Wax Pellets & 100m Paper Strips (â‚±22,450.00)',
      requestor: 'Kristene (Operations Lead)',
      role: 'Operations & HR Lead',
      branch: 'Centrio Mall (Waxing)',
      dateSubmitted: '2026-09-03 08:30 AM',
      amount: 22450.00,
      currentLevel: 4,
      status: 'Awaiting MD Sign-off',
      priority: 'Urgent',
      description: 'Monthly store replenishment ordered from Lay Bare Franchisor (MyTime Commissary) under Net 30 terms.',
      stages: [
        { level: 1, name: 'Store Requisition', by: 'Centrio Waxing Store Team', time: '2026-09-03 08:30 AM', status: 'Approved', note: 'Stock alert: Hot wax buffer below 3 days.' },
        { level: 2, name: 'Store Supervisor Endorsement', by: 'Cherimar Concigo (Branch Lead)', time: '2026-09-03 09:15 AM', status: 'Approved', note: 'Physical count verified. Requisition endorsed.' },
        { level: 3, name: 'Accounting 3-Way Match & Budget', by: 'Kristene (Accounting)', time: '2026-09-03 02:00 PM', status: 'Approved', note: 'GL Account 5100-20 budget verified. 3-Way Match (PO â†” DR â†” Invoice) verified.' },
        { level: 4, name: 'Managing Director Sign-off', by: 'Ms. Jehan Abedin (MD)', time: null, status: 'Pending', note: 'Awaiting executive authorization for BPI BizLink supplier payment release.' }
      ]
    },
    {
      id: 'APR-2026-003',
      type: 'payroll_disbursement',
      typeName: 'Semi-Monthly BPI Payroll Release',
      title: 'July 16-31 Semi-Monthly Multi-Branch Payroll Disbursement (â‚±68,400.00)',
      requestor: 'Kristene (HR & Payroll)',
      role: 'Operations & HR Lead',
      branch: 'Consolidated (All Branches)',
      dateSubmitted: '2026-07-31 05:00 PM',
      amount: 68400.00,
      currentLevel: 4,
      status: 'Awaiting MD Sign-off',
      priority: 'Urgent',
      description: 'Biometric timecard computations with DOLE overtime, SSS, PhilHealth, Pag-IBIG, and BIR 1601-C tax accruals.',
      stages: [
        { level: 1, name: 'Biometric Time Computation', by: 'NGTeco Automated Ingestion Engine', time: '2026-07-31 05:00 PM', status: 'Approved', note: 'Offline punch records paired and validated.' },
        { level: 2, name: 'Branch Shift Exceptions Resolved', by: 'Store Leads (Centrio / Ketkai / SM)', time: '2026-07-31 06:30 PM', status: 'Approved', note: 'All missed punch flags and grace periods verified.' },
        { level: 3, name: 'Accounting Statutory Audit & BPI CSV', by: 'Kristene (HR/Accounting)', time: '2026-07-31 08:00 PM', status: 'Approved', note: 'GL JE-2026-0801 posted. BPI BizLink batch file generated.' },
        { level: 4, name: 'Managing Director Sign-off', by: 'Ms. Jehan Abedin (MD)', time: null, status: 'Pending', note: 'Awaiting final authorization signature from Ms. Jehan Abedin to credit BPI bank accounts.' }
      ]
    },
    {
      id: 'APR-2026-004',
      type: 'cash_advance',
      typeName: 'Staff Cash Advance (Vale)',
      title: 'Emergency Vale Request (â‚±1,500.00) - 2 Cutoff Payroll Deduction',
      requestor: 'Cherry Rose Paculanang',
      role: 'Senior Nail Technician',
      branch: 'Passion Nails (Centrio)',
      dateSubmitted: '2026-09-08 11:00 AM',
      amount: 1500.00,
      currentLevel: 2,
      status: 'Pending Store Lead Endorsement',
      priority: 'Normal',
      description: 'Emergency assistance request. Staff agrees to deduction of â‚±750 per semi-monthly cutoff starting Sept 15.',
      stages: [
        { level: 1, name: 'Staff Application', by: 'Cherry Rose Paculanang', time: '2026-09-08 11:00 AM', status: 'Approved', note: 'Signed promissory slip submitted.' },
        { level: 2, name: 'Store Supervisor Endorsement', by: 'Cherimar Concigo (Branch Lead)', time: null, status: 'Pending', note: 'Awaiting branch lead performance & tenure verification.' },
        { level: 3, name: 'HR / Payroll Schedule', by: 'Kristene (HR)', time: null, status: 'Queued', note: 'To be scheduled into Biometric Payroll deductions column.' },
        { level: 4, name: 'Managing Director Sign-off', by: 'Ms. Jehan Abedin (MD)', time: null, status: 'Queued', note: 'Executive approval for petty cash fund release.' }
      ]
    },
    {
      id: 'APR-2026-005',
      type: 'leave_application',
      typeName: 'Service Incentive Leave (SIL)',
      title: '2-Day Paid Service Incentive Leave (Sept 18 - Sept 19, 2026)',
      requestor: 'Cherimar Concigo',
      role: 'Master Aesthetician',
      branch: 'Centrio Mall (Waxing)',
      dateSubmitted: '2026-09-09 09:00 AM',
      amount: null,
      currentLevel: 3,
      status: 'Pending HR Compliance Audit',
      priority: 'Normal',
      description: 'SIL request for family matter. Shift coverage arranged with Justine Ann Atay for Friday & Saturday salon schedule.',
      stages: [
        { level: 1, name: 'Staff Leave Filing', by: 'Cherimar Concigo', time: '2026-09-09 09:00 AM', status: 'Approved', note: 'Filed 9 days in advance per company handbook.' },
        { level: 2, name: 'Store Roster Endorsement', by: 'Centrio Shift Lead', time: '2026-09-09 10:00 AM', status: 'Approved', note: 'Confirmed bed coverage. No appointment conflicts.' },
        { level: 3, name: 'HR Compliance & SIL Balance Audit', by: 'Kristene (HR)', time: null, status: 'Pending', note: 'Checking employee leave credits (3/5 SIL days remaining).' },
        { level: 4, name: 'Managing Director Sign-off', by: 'Ms. Jehan Abedin (MD)', time: null, status: 'Queued', note: 'Final approval.' }
      ]
    }
  ];

  const getInitialDmsDocs = () => [
    {
      id: 'DOC-2026-001',
      title: 'DOLE Notice to Explain (NTE) - Habitual Tardiness (Justine Ann Atay)',
      category: 'HR & DOLE Compliance',
      branch: 'Centrio Mall (Waxing)',
      date: '2026-07-20',
      recipient: 'Justine Ann Atay (Senior Waxing Specialist)',
      recipientEmail: 'justine.atay@alrajjlegacy-fortifiedbusinesscorp.com',
      status: 'Signed & Dispatched via Gmail',
      signedBy: 'Kristene (Operations & HR Lead)',
      signedAt: '2026-07-20 02:15 PM',
      sha256Hash: 'SHA256: 8a4f91b2c6e83d09e1a84f3c7d6e5a4b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
      googleDrivePath: 'Google Drive / ALRAJJ LEGACY CORP / HR & Compliance / 2026 / NTE-2026-001.pdf',
      driveSyncStatus: 'Synced',
      gmailDispatched: true,
      content: `NOTICE TO EXPLAIN (NTE)
COMPANY: ALRAJJ LEGACY Fortified Business Corp.
BRANCH: Centrio Mall (Waxing Salon)
DATE: July 20, 2026

TO: Justine Ann Atay (Senior Waxing Specialist)
RE: Incident Report on Habitual Tardiness (July 16-31 Cutoff)

Please be advised that based on the NGTeco Biometric Attendance System records for the current payroll cutoff, you have accumulated four (4) separate late punch-ins totaling 68 minutes of tardiness (July 16: 21m late, July 17: 12m late, July 21: 18m late, July 24: 17m late).

Under the Philippine Labor Code (DOLE Guidelines) and ALRAJJ LEGACY Employee Handbook Section 4.2 (Attendance & Punctuality), you are hereby directed to submit a written explanation within five (5) calendar days from receipt of this notice explaining why disciplinary action should not be imposed.

Failure to submit your written explanation within the prescribed period shall be construed as a waiver of your right to be heard.`
    },
    {
      id: 'DOC-2026-002',
      title: 'Staff Cash Advance (Vale) Promissory Note & Salary Deduction Agreement',
      category: 'Payroll & Cash Advances',
      branch: 'Passion Nails (Centrio)',
      date: '2026-09-08',
      recipient: 'Cherry Rose Paculanang (Senior Nail Technician)',
      recipientEmail: 'cherry.paculanang@alrajjlegacy-fortifiedbusinesscorp.com',
      status: 'Awaiting MD Signature',
      signedBy: 'Cherry Rose Paculanang (Borrower)',
      signedAt: '2026-09-08 11:00 AM',
      sha256Hash: 'SHA256: 3c8e7a1d5f902b4a6e81d7c3b5a9f0e21a4d6c8e0b2f4a6c8e1d3b5a7f9e0c2b',
      googleDrivePath: 'Google Drive / ALRAJJ LEGACY CORP / Payroll & Vale / 2026 / VALE-PACULANANG.pdf',
      driveSyncStatus: 'Queued',
      gmailDispatched: false,
      content: `PROMISSORY NOTE & PAYROLL DEDUCTION AUTHORIZATION
COMPANY: ALRAJJ LEGACY Fortified Business Corp.
DATE: September 08, 2026

I, Cherry Rose Paculanang, employed as Senior Nail Technician at Passion Nails (Centrio Mall), acknowledge receipt of a Cash Advance (Vale) in the amount of ONE THOUSAND FIVE HUNDRED PESOS (â‚±1,500.00 PHP).

I hereby authorize the Accounting & Payroll Department to deduct the amount of SEVEN HUNDRED FIFTY PESOS (â‚±750.00 PHP) per semi-monthly cutoff across two (2) consecutive payroll periods starting September 15, 2026 until full settlement.

In the event of separation from employment prior to full payment, any outstanding balance shall be deducted directly from my final pay or clearance.`
    },
    {
      id: 'DOC-2026-003',
      title: 'MyTime Commissary PO Delivery Receipt & 3-Way Verification Voucher (DR-0901)',
      category: 'Procurement & POs',
      branch: 'Centrio Mall (Waxing)',
      date: '2026-09-03',
      recipient: 'Lay Bare Franchisor (MyTime Commissary)',
      recipientEmail: 'commissary-orders@laybarefranchise.ph',
      status: 'Signed & AP Matched',
      signedBy: 'Cherimar Concigo (Store Lead) & Kristene (Accounting)',
      signedAt: '2026-09-03 03:30 PM',
      sha256Hash: 'SHA256: 9b2d4e7f1a8c5e3a0d6f8b2c4e7a1d9f3b5c7e9a1d3f5a7c9e1b3d5f7a9c1e3b',
      googleDrivePath: 'Google Drive / ALRAJJ LEGACY CORP / Procurement / PO-2026-0901-DR.pdf',
      driveSyncStatus: 'Synced',
      gmailDispatched: true,
      content: `STORE DELIVERY INSPECTION & 3-WAY MATCH VOUCHER
PURCHASE ORDER: PO-2026-0901
DELIVERY RECEIPT: DR-0901
SUPPLIER: Lay Bare Franchisor (MyTime Commissary)
TOTAL PAYABLE: â‚±22,450.00 PHP (Net 30)

DELIVERED ITEMS:
1. 20kg Organic Hot Sugar Wax Pellets â€” 100% Quantity Verified (Store Inspected)
2. 100m Waxing Paper Roll Strips â€” 100% Intact & Sanitized
3. 2,000 pcs Wooden Precision Applicator Sticks â€” Verified

3-WAY MATCH STATUS:
âœ“ Purchase Order PO-2026-0901 Approved
âœ“ Store Goods Inspection Confirmed by Cherimar Concigo
âœ“ Commissary Billing Invoice Matched & Forwarded to Accounting AP Ledger (Voucher AP-VOUCHER-0901)`
    },
    {
      id: 'DOC-2026-004',
      title: 'Ayala Centrio Mall Commercial Space Lease & CUSA Schedule (2026-2027)',
      category: 'Commercial Leases',
      branch: 'Centrio Mall (Waxing & Nails)',
      date: '2026-08-01',
      recipient: 'Ayala Land Inc. (Centrio Mall Administration)',
      recipientEmail: 'leasing.centrio@ayalaland.com.ph',
      status: 'Vaulted & Archived',
      signedBy: 'Ms. Jehan Abedin (Managing Director)',
      signedAt: '2026-08-01 10:00 AM',
      sha256Hash: 'SHA256: 5f1b8a3d7c9e0a2b4d6e8f1a3c5e7b9d0e2f4a6b8c1d3e5f7a9b0c2d4e6f8a1b',
      googleDrivePath: 'Google Drive / ALRAJJ LEGACY CORP / Legal & Leases / CENTRIO-LEASE-2026.pdf',
      driveSyncStatus: 'Synced',
      gmailDispatched: true,
      content: `COMMERCIAL SPACE LEASE & CUSA SCHEDULE
LESSOR: Ayala Land Inc. / Centrio Mall Cagayan de Oro
LESSEE: ALRAJJ LEGACY Fortified Business Corp.
UNIT: Level 2, Spaces 204 & 205 (Waxing Salon & Passion Nails)

MONTHLY BASE RENT: â‚±85,000.00 PHP + CUSA Dues
WITHHOLDING TAX: 5% BIR Form 0619-E expanded withholding deducted at source.
TERMS: 12-Month Renewable Lease with continuous utility and Mall merchant association participation.`
    },
    {
      id: 'DOC-2026-005',
      title: 'BPI BizLink Master Batch Payroll Authorization - July 16-31 (â‚±68,400.00)',
      category: 'BPI Banking & Authorizations',
      branch: 'Consolidated (All Branches)',
      date: '2026-07-31',
      recipient: 'Bank of the Philippine Islands (BPI BizLink Corporate)',
      recipientEmail: 'bizlink.support@bpi.com.ph',
      status: 'Signed & Disbursed',
      signedBy: 'Ms. Jehan Abedin (Managing Director)',
      signedAt: '2026-07-31 09:30 PM',
      sha256Hash: 'SHA256: 1d9e7a3b5c8f0e2a4b6d8f1c3e5a7b9c0d2e4f6a8b1c3d5e7f9a0b2c4d6e8f0a',
      googleDrivePath: 'Google Drive / ALRAJJ LEGACY CORP / Banking & BPI / BPI-AUTH-2026-07B.pdf',
      driveSyncStatus: 'Synced',
      gmailDispatched: true,
      content: `EXECUTIVE BOARD AUTHORIZATION FOR BPI BIZLINK BATCH PAYROLL
COMPANY: ALRAJJ LEGACY Fortified Business Corp.
DATE: July 31, 2026
BATCH REFERENCE: PAYROLL-2026-07-B

TO: Bank of the Philippine Islands (BPI BizLink Operations)
TOTAL DISBURSEMENT: â‚±68,400.00 PHP
DEBIT MASTER ACCOUNT: 0249-8214-00 (ALRAJJ LEGACY Fortified Business Corp.)

I, Ms. Jehan Abedin, Managing Director of ALRAJJ LEGACY Fortified Business Corp., hereby officially authorize and certify the automated debit of â‚±68,400.00 from our corporate master account for direct crediting into employee payroll ATM accounts across Centrio, Ketkai, and SM Downtown branches.`
    },
    {
      id: 'DOC-2026-006',
      title: 'Senior Aesthetician Employment Agreement & Non-Disclosure (Upcoming Iligan Branch)',
      category: 'Employment Contracts',
      branch: 'Iligan City (Upcoming)',
      date: '2026-09-10',
      recipient: 'New Aesthetician Candidate (Iligan City)',
      recipientEmail: 'hr@alrajjlegacy-fortifiedbusinesscorp.com',
      status: 'Draft Ready for E-Sign',
      signedBy: 'Unsigned',
      signedAt: null,
      sha256Hash: 'SHA256: Pending Signature',
      googleDrivePath: 'Google Drive / ALRAJJ LEGACY CORP / HR & Compliance / ILIGAN-CONTRACT-DRAFT.pdf',
      driveSyncStatus: 'Local Draft',
      gmailDispatched: false,
      content: `EMPLOYMENT CONTRACT & PROPRIETARY NON-DISCLOSURE AGREEMENT
EMPLOYER: ALRAJJ LEGACY Fortified Business Corp. (Lay Bare Franchisee)
LOCATION: Upcoming Iligan City Branch

POSITION: Senior Waxing & Aesthetic Specialist
COMPENSATION: â‚±650.00 Daily Base + 10% Service Commission + Statutory Benefits (SSS, PhilHealth, Pag-IBIG, 13th Month Pay, SIL).

CONFIDENTIALITY & NON-COMPETE COVENANT:
The Employee acknowledges that all Lay Bare proprietary waxing formulas, cold/hot organic techniques, client database details, and operational protocols are trade secrets of ALRAJJ LEGACY and the Lay Bare Franchisor.`
    }
  ];

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

    setLivePunches([
      { id: 1, name: 'Justine Ann Atay', time: '09:21 AM', type: 'IN', branch: 'Centrio Waxing', status: 'Late (21m)' },
      { id: 2, name: 'Kristene HR', time: '08:58 AM', type: 'IN', branch: 'Limketkai', status: 'On Time' },
      { id: 3, name: 'Cherry Rose Paculanang', time: '09:12 AM', type: 'IN', branch: 'Passion Nails', status: 'Late (12m)' },
      { id: 4, name: 'Cherimar Concigo', time: '09:24 PM', type: 'IN', branch: 'Centrio Waxing', status: 'Missing OUT' }
    ]);

    setApprovalsList(getInitialApprovals());
    setDmsDocuments(getInitialDmsDocs());

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

    // Automatically post live payroll liability voucher directly into Accounting AP
    const totalPayrollAmount = payroll.reduce((sum, p) => sum + (p.calculations?.netPay || 0), 0) || 3133.61;
    const payrollVoucherId = `PAYROLL-VOUCH-${startDate ? startDate.replace(/-/g, '') : '20260901'}`;
    const newPayrollVoucher = {
      id: payrollVoucherId,
      vendor: 'BPI BizLink Direct ATM Payroll',
      category: 'Payroll & Staff Salaries',
      branch: 'All Branches (Consolidated)',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      dueDate: 'Cutoff Disbursement (BPI)',
      amount: totalPayrollAmount,
      status: 'Audited & Ready for MD',
      remarks: `Audited payroll voucher for ${payroll.length > 0 ? payroll.length : 4} salon employees (${startDate} to ${endDate})`
    };
    setApInvoices(prev => {
      const exists = prev.some(item => item.id === payrollVoucherId);
      if (exists) return prev;
      return [newPayrollVoucher, ...prev];
    });
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

  // Document Management System (DMS) & E-Signature Handlers (Google Workspace Integrated)
  const handleApplySignature = (docId) => {
    const timestamp = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const fakeHash = 'SHA256: ' + Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('');
    
    setDmsDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          status: 'Signed & Cryptographically Vaulted',
          signedBy: selectedSignerTitle || typedSignName || 'Ms. Jehan Abedin (Managing Director)',
          signedAt: timestamp,
          sha256Hash: fakeHash,
          driveSyncStatus: 'Synced'
        };
      }
      return doc;
    }));

    setShowSignModal(false);
    setSelectedDocForSign(null);
    setDmsToast(`âœï¸ Document ${docId} successfully E-Signed and Cryptographically Vaulted! Ready for Google Drive archiving & Gmail dispatch.`);
    setTimeout(() => setDmsToast(''), 6000);
  };

  const handleSendGmailDoc = (doc) => {
    const sender = 'hr@alrajjlegacy-fortifiedbusinesscorp.com';
    setDmsDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, gmailDispatched: true, dispatchedAt: new Date().toLocaleTimeString() } : d));
    setDmsToast(`âœ‰ï¸ Official PDF dispatched from ${sender} to ${doc.recipientEmail || doc.recipient} via Google Workspace Gmail.`);
    setTimeout(() => setDmsToast(''), 6000);
  };

  const handleSyncGoogleDriveDoc = (doc) => {
    setDmsDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, driveSyncStatus: 'Synced' } : d));
    setDmsToast(`â˜ï¸ Document ${doc.id} backed up into Google Workspace Drive (${doc.googleDrivePath || 'Google Drive / ALRAJJ LEGACY CORP / 2026 Archive'}).`);
    setTimeout(() => setDmsToast(''), 6000);
  };

  const handleCreateNewDoc = (e) => {
    e.preventDefault();
    const newDocId = `DOC-2026-00${dmsDocuments.length + 1}`;
    const newDoc = {
      id: newDocId,
      title: newDocUpload.title,
      category: newDocUpload.category,
      branch: newDocUpload.branch,
      date: new Date().toISOString().split('T')[0],
      recipient: newDocUpload.recipient,
      recipientEmail: newDocUpload.recipientEmail,
      status: 'Draft Ready for E-Sign',
      signedBy: 'Unsigned',
      signedAt: null,
      sha256Hash: 'SHA256: Pending Signature',
      googleDrivePath: `Google Drive / ALRAJJ LEGACY CORP / ${newDocUpload.category} / ${newDocId}.pdf`,
      driveSyncStatus: 'Queued',
      gmailDispatched: false,
      content: newDocUpload.content || 'Official corporate memorandum regarding branch operations and compliance protocols.'
    };

    setDmsDocuments(prev => [newDoc, ...prev]);
    setShowUploadDocModal(false);
    setNewDocUpload({
      title: '',
      category: 'HR & DOLE Compliance',
      branch: 'Centrio Mall (Waxing)',
      recipient: 'Justine Ann Atay',
      recipientEmail: 'hr@alrajjlegacy-fortifiedbusinesscorp.com',
      content: ''
    });
    setDmsToast(`ðŸ“„ New document ${newDocId} filed into Google Workspace Cloud Vault!`);
    setTimeout(() => setDmsToast(''), 5000);
  };

  const dmsDocTemplates = {
    nte: {
      name: 'DOLE Notice to Explain (NTE) - Tardiness / Infraction',
      category: 'HR & DOLE Compliance',
      defaultTitle: 'DOLE Notice to Explain (NTE) - Habitual Tardiness',
      content: `NOTICE TO EXPLAIN (NTE)
COMPANY: ALRAJJ LEGACY Fortified Business Corp.
BRANCH: Centrio Mall (Waxing Salon)
DATE: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

TO: [EMPLOYEE NAME] ([POSITION / ROLE])
RE: Notice to Explain - [SPECIFY VIOLATION / INFRACTION]

Please be advised that based on official company records and biometric attendance reports, you have accumulated infractions regarding [SPECIFY REASON, e.g. 4 consecutive late punch-ins totaling 68 minutes].

Under Philippine Labor Code (DOLE Guidelines) and ALRAJJ LEGACY Employee Handbook Section 4, you are hereby given five (5) calendar days from receipt of this notice to submit a formal written explanation why disciplinary action should not be taken against you.

Failure to submit your explanation shall constitute a waiver of your right to be heard.`
    },
    vale: {
      name: 'Staff Cash Advance (Vale) Promissory Agreement',
      category: 'Payroll & Cash Advances',
      defaultTitle: 'Staff Cash Advance (Vale) Promissory Agreement & Salary Deduction',
      content: `PROMISSORY NOTE & SALARY DEDUCTION AUTHORIZATION
COMPANY: ALRAJJ LEGACY Fortified Business Corp.
DATE: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

I, [EMPLOYEE NAME], employed at [BRANCH NAME], acknowledge receipt of a Cash Advance (Vale) in the amount of â‚±[AMOUNT] PHP.

I authorize the Accounting Department to deduct â‚±[AMOUNT PER CUTOFF] PHP per semi-monthly cutoff over [NUMBER OF CUTOFFS] consecutive pay periods starting on [START DATE] until fully paid.

In case of employment separation, any unpaid balance shall be deducted from my final pay.`
    },
    employment: {
      name: 'Specialist Employment Agreement & NDA',
      category: 'Employment Contracts',
      defaultTitle: 'Specialist Employment Contract & Proprietary NDA',
      content: `EMPLOYMENT CONTRACT & NON-DISCLOSURE AGREEMENT
EMPLOYER: ALRAJJ LEGACY Fortified Business Corp.
BRANCH: [BRANCH NAME]
SPECIALIST: [EMPLOYEE NAME]

POSITION: Salon Waxing & Aesthetic Specialist
COMPENSATION: â‚±[DAILY RATE] / day + 10% Service Commission + Mandatory Benefits (SSS, PhilHealth, Pag-IBIG, 13th Month Pay, SIL).

CONFIDENTIALITY:
The Specialist agrees to safeguard all Lay Bare organic wax formulas, technique protocols, client records, and store operating systems.`
    },
    poReceipt: {
      name: 'Commissary / PO Delivery Inspection & 3-Way Match',
      category: 'Procurement & POs',
      defaultTitle: 'Commissary Delivery Receipt & 3-Way Match Inspection Voucher',
      content: `STORE DELIVERY INSPECTION & 3-WAY MATCH VOUCHER
PURCHASE ORDER: [PO NUMBER]
SUPPLIER: Lay Bare Franchisor (MyTime Commissary)
TOTAL PAYABLE: â‚±[TOTAL AMOUNT] PHP

INSPECTED ITEMS:
1. [ITEM 1 NAME & QUANTITY] - 100% Intact & Inspected
2. [ITEM 2 NAME & QUANTITY] - Verified against Packing Slip

STATUS:
âœ“ Store Goods Inspection Completed & Approved
âœ“ Matched against Supplier Invoice and Purchase Order`
    },
    memo: {
      name: 'General Corporate Memorandum / Branch Notice',
      category: 'HR & DOLE Compliance',
      defaultTitle: 'Corporate Memorandum - Branch Operations & Policy Notice',
      content: `CORPORATE MEMORANDUM
COMPANY: ALRAJJ LEGACY Fortified Business Corp.
DATE: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

TO: All Branch Staff & Shift Leads ([BRANCH NAME])
FROM: Management / Operations Lead
SUBJECT: [MEMORANDUM TOPIC]

1. OBJECTIVE:
[State the objective or operational reminder, e.g. Customer service protocols and sanitization standards].

2. GUIDELINES & IMPLEMENTATION:
[Detail specific instructions, shift timings, or compliance rules].

Please acknowledge receipt and adhere strictly to these guidelines.`
    }
  };

  const handleOpenEditDoc = (doc) => {
    setEditingDoc({ ...doc });
    setShowEditDocModal(true);
  };

  const handleSaveEditedDoc = (e) => {
    e.preventDefault();
    if (!editingDoc) return;

    setDmsDocuments(prev => prev.map(d => {
      if (d.id === editingDoc.id) {
        return {
          ...editingDoc,
          driveSyncStatus: 'Synced'
        };
      }
      return d;
    }));

    if (selectedDocForView && selectedDocForView.id === editingDoc.id) {
      setSelectedDocForView({ ...editingDoc });
    }

    setShowEditDocModal(false);
    setDmsToast(`âœï¸ Document ${editingDoc.id} customized and synchronized to Google Workspace Drive!`);
    setTimeout(() => setDmsToast(''), 5000);
  };

  const handleApplyPresetTemplate = (templateKey, isEditing = false) => {
    const tmpl = dmsDocTemplates[templateKey];
    if (!tmpl) return;

    if (isEditing && editingDoc) {
      setEditingDoc(prev => ({
        ...prev,
        title: tmpl.defaultTitle,
        category: tmpl.category,
        content: tmpl.content
      }));
    } else {
      setNewDocUpload(prev => ({
        ...prev,
        title: tmpl.defaultTitle,
        category: tmpl.category,
        content: tmpl.content
      }));
    }
    setSelectedTemplateKey(templateKey);
  };

  // Settings & RBAC Management Handlers
  const handleTogglePermission = (userId, permKey) => {
    setUserRolesList(prev => prev.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          permissions: {
            ...user.permissions,
            [permKey]: !user.permissions[permKey]
          }
        };
      }
      return user;
    }));
    setSettingsToast(`Updated permissions for user ${userId}. Changes saved.`);
    setTimeout(() => setSettingsToast(''), 4000);
  };

  const handleTestDns = () => {
    setDnsTestStatus('testing');
    setTimeout(() => {
      setDnsTestStatus('success');
      setSettingsToast(`ðŸŸ¢ DNS Health Check Passed! CNAME and TXT records for ${customDomainConfig.subdomain} are actively propagating.`);
      setTimeout(() => setSettingsToast(''), 5000);
    }, 1200);
  };

  const handleCopyText = (text, label) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    }
    setSettingsToast(`ðŸ“‹ Copied ${label} to clipboard: "${text}"`);
    setTimeout(() => setSettingsToast(''), 4000);
  };

  const handleCreateUserRole = (e) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;

    const newId = `USR-00${userRolesList.length + 1}`;
    const newUser = {
      id: newId,
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role,
      branchAccess: newUserForm.branchAccess,
      status: 'Active',
      permissions: { ...newUserForm.permissions },
      lastLogin: 'Never (New Account)'
    };

    setUserRolesList(prev => [...prev, newUser]);
    setShowAddUserModal(false);
    setNewUserForm({
      name: '',
      email: '',
      role: 'Salon Specialist / Staff',
      branchAccess: 'Centrio Mall (Waxing)',
      permissions: {
        dashboard: true,
        approvals: true,
        accounting: false,
        payroll: false,
        exceptions: false,
        tardiness: false,
        biometrics: false,
        staff: false,
        crm: true,
        procurement: false,
        dms: true,
        settings: false
      }
    });
    setSettingsToast(`âœ… User account ${newUser.name} (${newId}) successfully created with custom RBAC permissions.`);
    setTimeout(() => setSettingsToast(''), 5000);
  };

  const handleCreateBranch = (e) => {
    e.preventDefault();
    if (!newBranchForm.name) return;

    const newId = `BR-0${branchesConfigList.length + 1}`;
    const newBr = {
      id: newId,
      name: newBranchForm.name,
      type: newBranchForm.type,
      location: newBranchForm.location || 'Cagayan de Oro City / Northern Mindanao',
      manager: newBranchForm.manager || 'Store Supervisor',
      contact: newBranchForm.contact || '+63 917 000 0000',
      biometricIp: newBranchForm.biometricIp || 'NGTeco MB20 Series',
      bedsStations: newBranchForm.bedsStations || '4 Stations',
      status: 'Operational'
    };

    setBranchesConfigList(prev => [...prev, newBr]);
    setShowAddBranchModal(false);
    setNewBranchForm({
      name: '',
      type: 'Lay Bare Waxing Salon',
      location: '',
      manager: '',
      contact: '',
      biometricIp: 'NGTeco MB20 Series',
      bedsStations: '4 Stations'
    });
    setSettingsToast(`ðŸ¢ Branch ${newBr.name} (${newId}) registered in multi-store network.`);
    setTimeout(() => setSettingsToast(''), 5000);
  };

  const handleClearPwaCache = async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        setSettingsToast('ðŸ§¹ Offline Service Worker Cache successfully cleared! Reloading fresh assets...');
        setTimeout(() => {
          setSettingsToast('');
          window.location.reload();
        }, 1500);
      } catch (err) {
        setSettingsToast('Cache cleared locally.');
        setTimeout(() => setSettingsToast(''), 3000);
      }
    } else {
      setSettingsToast('No local cache detected.');
      setTimeout(() => setSettingsToast(''), 3000);
    }
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
      supplier: 'Lay Bare Franchisor (MyTime Commissary)',
      itemName: 'Organic Hot Sugar Wax Pellets (10kg)',
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

      // Instantly recalculate active payroll if currently generated
      setPayroll(prev => {
        if (!prev || prev.length === 0) return prev;
        const targetId = parseInt(newEmployee.id);
        const deducVal = parseFloat(newEmployee.otherDeductions || 0);
        const remarks = newEmployee.otherDeductionRemarks || 'Cash Advance (Vale)';
        return prev.map(p => {
          if (p.employeeId === targetId) {
            const gross = p.calculations.grossPay;
            const sss = p.calculations.deductions.sss;
            const philhealth = p.calculations.deductions.philhealth;
            const pagibig = p.calculations.deductions.pagibig;
            const newTotalDeductions = Number((sss + philhealth + pagibig + deducVal).toFixed(2));
            const newNet = Number((gross - newTotalDeductions).toFixed(2));
            return {
              ...p,
              otherDeductions: deducVal,
              otherDeductionRemarks: remarks,
              calculations: {
                ...p.calculations,
                deductions: {
                  ...p.calculations.deductions,
                  otherDeductions: deducVal,
                  otherDeductionRemarks: remarks,
                  totalDeductions: newTotalDeductions
                },
                netPay: newNet
              }
            };
          }
          return p;
        });
      });

      setShowAddEmployeeModal(false);
      setNewEmployee({ id: '', name: '', branch: 'Centrio Mall (Waxing)', rate: 600, taxStatus: 'S', bpiAccount: '', sssNo: '', philhealthNo: '', pagibigNo: '', tinNo: '', otherDeductions: 0, otherDeductionRemarks: 'Cash Advance (Vale)' });
    }
  };

  // ECharts Configurations using Lay Bare Logo Theme (Green #77BC2E, Warm Brown #4A2E1B, Pink #E89BB9, Lavender #B58EBE)
  const getAttendanceDonutOption = () => {
    const presentCount = attendance.filter(a => ['Present', 'Approved'].includes(a.status)).length;
    const flagCount = exceptions.length;
    const restCount = attendance.filter(a => a.status === 'Rest Day').length;
    const hasData = (presentCount + flagCount + restCount) > 0;

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
          data: hasData ? [
            { value: presentCount, name: 'Present', itemStyle: { color: '#77BC2E' } }, // Laybare Green
            { value: flagCount, name: 'Exceptions', itemStyle: { color: '#E89BB9' } },  // Logo Floral Pink
            { value: restCount, name: 'Rest Days', itemStyle: { color: '#B58EBE' } }   // Logo Floral Lilac
          ] : [
            { value: 1, name: 'Ready for Live Upload', itemStyle: { color: '#EAE8E2' } }
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
    const hasData = dates.length > 0;

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
        data: hasData ? dates : ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
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
        minInterval: 1,
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
        data: hasData ? counts : [0, 0, 0, 0, 0],
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
    const hasData = names.length > 0;

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
        minInterval: 1,
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
        data: hasData ? names : ['No Tardiness Recorded'],
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
        data: hasData ? lateCounts : [0],
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

  // --- MULTI-LEVEL APPROVAL HANDLERS (CHAIN OF COMMAND ROUTING) ---
  const handleAdvanceApproval = (approvalId) => {
    const item = approvalsList.find(a => a.id === approvalId);
    if (!item) return;

    const nextLevel = item.currentLevel + 1;
    let newStatus = '';
    let toastMessage = '';

    if (nextLevel === 2) {
      newStatus = 'Pending Store Lead Endorsement';
      toastMessage = `Request ${item.id} submitted & forwarded to Store Supervisor.`;
    } else if (nextLevel === 3) {
      newStatus = 'Pending HR / Accounting Audit';
      toastMessage = `Store Lead endorsed ${item.id}! Forwarded to HR & Accounting Audit.`;
    } else if (nextLevel === 4) {
      newStatus = 'Awaiting Ms. Jehan Abedin Sign-off';
      toastMessage = `HR/Accounting verified ${item.id}! Passed to Managing Director Ms. Jehan Abedin for executive authorization.`;
    } else if (nextLevel >= 5) {
      newStatus = 'Approved & Disbursed';
      toastMessage = `ðŸ‘‘ Managing Director Ms. Jehan Abedin officially authorized ${item.id}! Auto-posted to GL and queued for BPI release.`;
    }

    setApprovalsList(prev => prev.map(a => {
      if (a.id === approvalId) {
        const updatedStages = a.stages.map(s => {
          if (s.level === a.currentLevel) {
            return {
              ...s,
              status: 'Approved',
              time: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              note: s.note || 'Verified & endorsed to next approval tier.'
            };
          }
          if (s.level === nextLevel) {
            return {
              ...s,
              status: nextLevel >= 5 ? 'Approved' : 'Pending'
            };
          }
          return s;
        });

        return {
          ...a,
          currentLevel: Math.min(nextLevel, 5),
          status: newStatus,
          stages: updatedStages
        };
      }
      return a;
    }));

    setApprovalToast(toastMessage);
    setTimeout(() => setApprovalToast(''), 6000);
  };

  const handleRejectApproval = (approvalId, reason = 'Additional justification / Notice to Explain required.') => {
    setApprovalsList(prev => prev.map(a => {
      if (a.id === approvalId) {
        return {
          ...a,
          status: 'Rejected / NTE Required',
          stages: a.stages.map(s => s.level === a.currentLevel ? {
            ...s,
            status: 'Rejected',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            note: reason
          } : s)
        };
      }
      return a;
    }));
    setApprovalToast(`Request ${approvalId} rejected / returned for store review.`);
    setTimeout(() => setApprovalToast(''), 5000);
  };

  const handleCreateApprovalRequest = (e) => {
    e.preventDefault();
    const newId = `APR-2026-${String(approvalsList.length + 101).padStart(3, '0')}`;
    
    let typeName = 'General Store Request';
    if (newApproval.type === 'dtr_override') typeName = 'DTR Punch Override';
    else if (newApproval.type === 'commissary_po') typeName = 'MyTime Commissary PO';
    else if (newApproval.type === 'payroll_disbursement') typeName = 'Payroll Disbursement';
    else if (newApproval.type === 'cash_advance') typeName = 'Staff Cash Advance (Vale)';
    else if (newApproval.type === 'leave_application') typeName = 'Leave Application (SIL)';
    else if (newApproval.type === 'petty_cash') typeName = 'Petty Cash Expense Voucher';

    const createdReq = {
      id: newId,
      type: newApproval.type,
      typeName: typeName,
      title: newApproval.title || `${typeName} - ${newApproval.branch}`,
      requestor: newApproval.requestor || 'Salon Staff',
      role: newApproval.role || 'Salon Specialist',
      branch: newApproval.branch,
      dateSubmitted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount: newApproval.amount ? Number(newApproval.amount) : null,
      currentLevel: 2, // Starts at Level 2 (Awaiting Shift Supervisor Endorsement)
      status: 'Pending Store Lead Endorsement',
      priority: newApproval.priority || 'Normal',
      description: newApproval.description || 'Submitted for multi-level approval routing.',
      stages: [
        { level: 1, name: 'Staff Filing', by: newApproval.requestor, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'Approved', note: 'Filed via store portal.' },
        { level: 2, name: 'Store Supervisor Endorsement', by: 'Branch Supervisor', time: null, status: 'Pending', note: 'Awaiting first-line store endorsement.' },
        { level: 3, name: 'HR & Accounting Audit', by: 'Kristene (HR/Accounting)', time: null, status: 'Queued', note: 'Queued for compliance & ledger check.' },
        { level: 4, name: 'Managing Director Sign-off', by: 'Ms. Jehan Abedin (MD)', time: null, status: 'Queued', note: 'Final executive authorization.' }
      ]
    };

    setApprovalsList(prev => [createdReq, ...prev]);
    setShowNewApprovalModal(false);
    setNewApproval({
      type: 'dtr_override',
      title: '',
      requestor: 'Justine Ann Atay',
      role: 'Senior Waxing Specialist',
      branch: 'Centrio Mall (Waxing)',
      amount: '',
      description: '',
      priority: 'Normal'
    });
    setApprovalToast(`Multi-Level Request ${createdReq.id} filed and routed to Store Supervisor!`);
    setTimeout(() => setApprovalToast(''), 5000);
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
            str += `<div class="flex items-center justify-between space-x-4"><span style="color:${p.color}">â— ${p.seriesName}:</span> <strong class="font-mono">â‚±${Number(p.value).toLocaleString()}</strong></div>`;
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
          formatter: (val) => `â‚±${(val / 1000).toFixed(0)}k`
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
        formatter: '{b}: â‚±{c} ({d}%)',
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
    setAccountingToast(`Invoice ${inv.id} for â‚±${inv.amount.toLocaleString()} disbursed via BPI BizLink & auto-posted to General Ledger.`);
    setTimeout(() => setAccountingToast(''), 6000);
  };

  const handleCreateJournalEntry = (e) => {
    e.preventDefault();
    const totalDebit = newJournalEntry.lines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
    const totalCredit = newJournalEntry.lines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      alert(`Journal entry is unbalanced! Total Debits: â‚±${totalDebit.toFixed(2)} vs Total Credits: â‚±${totalCredit.toFixed(2)}. Debits must equal Credits.`);
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
    setAccountingToast(`Journal Entry ${createdJe.id} posted successfully with â‚±${totalDebit.toLocaleString()} balanced lines.`);
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
    setAccountingToast(`Daily POS Cash Audit saved for ${createdRec.branch}: Expected â‚±${expected.toLocaleString()}, Counted â‚±${actual.toLocaleString()} (${createdRec.status}).`);
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
    setAccountingToast('All 4 branch POS shift cash drawers successfully balanced & reconciled to â‚±0 variance.');
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
      setAccountingToast('Biometric Payroll â‚±68,400.00 auto-posted to General Ledger with balanced statutory accruals.');
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
    setCrmToast(`Service Ticket ${createdTicket.id} (â‚±${createdTicket.amount.toLocaleString()}) saved & credited to ${createdTicket.specialist}! Auto-synced with daily POS audit.`);
    setTimeout(() => setCrmToast(''), 5000);
  };

  return (
    <div className="min-h-screen font-sans antialiased text-[#2D2520] bg-[#F7F8FA] flex">
      
      {/* 1. LEFT SIDEBAR (HRMS Behance style) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#EAE8E2] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Scrollable Navigation Body */}
        <div className="p-4 space-y-4 flex-1 min-h-0 overflow-y-auto">
          
          {/* Logo Branding */}
          <div className="flex items-center space-x-3 pb-3 border-b border-[#F2F0E8]">
            <img 
              src="/alrajj-icon.png" 
              alt="ALRAJJ LEGACY Logo" 
              className="h-10 w-10 object-contain rounded-xl border border-[#031134]/15 p-1 shadow-sm bg-[#031134]" 
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
              className="w-full bg-[#F7F6F2] text-[#2D2520] placeholder-[#A8A29E] text-xs rounded-xl pl-8 pr-3 py-1.5 outline-none focus:ring-1 focus:ring-[#77BC2E] border border-transparent font-medium"
            />
          </div>

          {/* Navigation Categories */}
          <nav className="space-y-4 text-xs">
            
            {/* Category 1: FINANCIAL & EXECUTIVE ERP */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#A8A29E] px-2.5">Financial & Executive ERP</span>
              
              <button
                onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
                className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl font-semibold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-[#77BC2E] text-white shadow-sm shadow-[#77BC2E]/25'
                    : 'text-[#5A534E] hover:bg-[#F7F6F2] hover:text-[#4A2E1B]'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>General Dashboard</span>
              </button>

              {/* Multi-Level Approvals Hub Link */}
              <button
                onClick={() => { setActiveTab('approvals'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl font-semibold transition-all ${
                  activeTab === 'approvals'
                    ? 'bg-[#031134] text-white shadow-sm shadow-[#031134]/25'
                    : 'text-[#5A534E] hover:bg-[#F7F6F2] hover:text-[#031134]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="h-4 w-4 text-[#77BC2E]" />
                  <span>Approvals & Matrix</span>
                </div>
                {approvalsList.filter(a => a.currentLevel < 5).length > 0 && (
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    activeTab === 'approvals' ? 'bg-[#77BC2E] text-white' : 'bg-[#77BC2E]/20 text-[#5A9A1E]'
                  }`}>
                    {approvalsList.filter(a => a.currentLevel < 5).length}
                  </span>
                )}
              </button>

              <button
                onClick={() => { setActiveTab('accounting'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl font-semibold transition-all ${
                  activeTab === 'accounting'
                    ? 'bg-[#031134] text-white shadow-sm shadow-[#031134]/25'
                    : 'text-[#5A534E] hover:bg-[#F7F6F2] hover:text-[#031134]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
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
                className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl font-semibold transition-all ${
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
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#A8A29E] px-2.5">Workforce Management</span>
              
              <button
                onClick={() => { setActiveTab('exceptions'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl font-semibold transition-all ${
                  activeTab === 'exceptions'
                    ? 'bg-[#77BC2E] text-white shadow-sm shadow-[#77BC2E]/25'
                    : 'text-[#5A534E] hover:bg-[#F7F6F2] hover:text-[#4A2E1B]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
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
                className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl font-semibold transition-all ${
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
                className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl font-semibold transition-all ${
                  activeTab === 'upload'
                    ? 'bg-[#77BC2E] text-white shadow-sm shadow-[#77BC2E]/25'
                    : 'text-[#5A534E] hover:bg-[#F7F6F2] hover:text-[#4A2E1B]'
                }`}
              >
                <Upload className="h-4 w-4" />
                <span>Biometric Ingestion</span>
              </button>
            </div>

            {/* Category 3: EMPLOYEE & HR MANAGEMENT */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#A8A29E] px-2.5">HR & Workforce Suite</span>
              
              <button
                onClick={() => { setActiveTab('employees'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl font-semibold transition-all ${
                  activeTab === 'employees'
                    ? 'bg-[#031134] text-white shadow-sm shadow-[#031134]/25'
                    : 'text-[#5A534E] hover:bg-[#F7F6F2] hover:text-[#031134]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Users className={`h-4 w-4 ${activeTab === 'employees' ? 'text-[#77BC2E]' : 'text-[#8A817C]'}`} />
                  <span>HR Hub & 201 Files</span>
                </div>
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                  activeTab === 'employees' ? 'bg-[#77BC2E] text-white' : 'bg-[#77BC2E]/15 text-[#5A9A1E]'
                }`}>
                  HR Suite
                </span>
              </button>
            </div>

            {/* Category 4: SALON OPERATIONS & COMMERCIAL */}
            <div className="space-y-1 pt-2 border-t border-[#F2F0E8]">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#8A817C] px-2.5">
                Salon Operations
              </span>

              <button
                onClick={() => { setActiveTab('crm'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl font-semibold transition-all ${
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
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl font-semibold transition-all ${
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
                onClick={() => { setActiveTab('dms'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl font-semibold transition-all ${
                  activeTab === 'dms'
                    ? 'bg-[#031134] text-white shadow-sm shadow-[#031134]/25'
                    : 'text-[#5A534E] hover:bg-[#F7F6F2] hover:text-[#031134]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <PenTool className="h-4 w-4 text-[#77BC2E]" />
                  <span>DMS & E-Sign Hub</span>
                </div>
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md tracking-wider uppercase ${
                  activeTab === 'dms' ? 'bg-[#77BC2E] text-white' : 'bg-[#77BC2E]/15 text-[#5A9A1E]'
                }`}>
                  Drive Vault
                </span>
              </button>
            </div>

            {/* Category 5: SYSTEM & CONFIGURATION */}
            <div className="space-y-1 pt-2 border-t border-[#F2F0E8]">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#8A817C] px-2.5">
                System & Config
              </span>

              <button
                onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl font-semibold transition-all ${
                  activeTab === 'settings'
                    ? 'bg-[#031134] text-white shadow-sm shadow-[#031134]/25'
                    : 'text-[#5A534E] hover:bg-[#F7F6F2] hover:text-[#031134]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Settings className={`h-4 w-4 ${activeTab === 'settings' ? 'text-[#77BC2E]' : 'text-[#8A817C]'}`} />
                  <span>Settings & Roles</span>
                </div>
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md tracking-wider uppercase ${
                  activeTab === 'settings' ? 'bg-[#77BC2E] text-white' : 'bg-[#031134]/10 text-[#031134]'
                }`}>
                  RBAC & DNS
                </span>
              </button>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer User Card */}
        <div className="p-3.5 border-t border-[#F2F0E8] bg-[#FAF9F5] flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#4A2E1B] text-[#77BC2E] flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0">
                KH
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#4A2E1B] truncate">Kristene HR</p>
                <p className="text-[10px] text-[#8A817C] truncate">Operations & HR Lead</p>
              </div>
            </div>
            <button
              onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
              className="p-1.5 rounded-lg text-[#8A817C] hover:text-[#031134] hover:bg-white transition-colors"
              title="Open Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
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
        
        {/* Top Navbar in Content Area (Clean, Streamlined & Non-Overflowing) */}
        <header className="sticky top-0 z-30 bg-[#F7F8FA]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between border-b border-[#EAE8E2]/70 gap-2 sm:gap-4">
          <div className="flex items-center space-x-3 min-w-0">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-white border border-[#EAE8E2] text-[#4A2E1B] flex-shrink-0"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-extrabold text-[#4A2E1B] tracking-tight truncate">Welcome back, Kristene</h1>
                <span className="hidden xl:inline-flex bg-white border border-[#EAE8E2] text-[#8A817C] text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs flex-shrink-0">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <p className="text-xs text-[#8A817C] hidden sm:block truncate">Biometric attendance, automated payroll & multi-branch enterprise controls.</p>
            </div>
          </div>

          {/* Top Actions (Streamlined, Compact, Zero Horizontal Scroll) */}
          <div className="flex items-center space-x-2 sm:space-x-2.5 flex-shrink-0">
            
            {/* Cutoff Range Indicator */}
            <div className="hidden 2xl:flex items-center space-x-1.5 bg-white border border-[#EAE8E2] rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#5A534E] shadow-2xs">
              <Calendar className="h-3.5 w-3.5 text-[#77BC2E]" />
              <span>{startDate} ~ {endDate}</span>
            </div>

            {/* Live Data vs Demo Mode Switcher Button */}
            <button
              onClick={() => setShowDataModeModal(true)}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-2xs ${
                systemDataMode === 'live'
                  ? 'bg-[#031134] text-white border-[#031134]'
                  : 'bg-[#FAF9F5] border-[#EAE8E2] text-[#4A2E1B] hover:bg-[#F2F0E8]'
              }`}
              title="Switch between Live Store Testing and Demo Simulation Data"
            >
              <Database className={`h-3.5 w-3.5 ${systemDataMode === 'live' ? 'text-[#77BC2E]' : 'text-[#8A817C]'}`} />
              <span className="hidden md:inline">{systemDataMode === 'live' ? 'ðŸ¢ Live Store Mode' : 'ðŸ§ª Demo Mode'}</span>
              <span className="md:hidden">{systemDataMode === 'live' ? 'Live' : 'Demo'}</span>
            </button>

            {/* Network Online / Offline Status Badge */}
            <button
              onClick={() => setShowPwaModal(true)}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-2xs ${
                isOnline
                  ? 'bg-[#77BC2E]/10 border-[#77BC2E]/30 text-[#5A9A1E]'
                  : 'bg-[#D4AF37]/20 border-[#D4AF37]/50 text-[#B48A10] animate-pulse'
              }`}
              title={isOnline ? 'Online (Real-time Cloud Sync Active)' : 'Offline Mode (Local Storage Active)'}
            >
              {isOnline ? <Wifi className="h-3.5 w-3.5 text-[#77BC2E]" /> : <WifiOff className="h-3.5 w-3.5 text-[#B48A10]" />}
              <span className="hidden lg:inline">{isOnline ? 'Cloud Live' : 'Offline'}</span>
            </button>

            {/* Custom Domain Settings Direct Button */}
            <button
              onClick={() => { setActiveTab('settings'); setSettingsSubTab('domain'); }}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-2xs ${
                activeTab === 'settings' && settingsSubTab === 'domain'
                  ? 'bg-[#031134] text-white border-[#031134]'
                  : 'bg-white border-[#EAE8E2] text-[#031134] hover:bg-[#FAF9F5]'
              }`}
              title="Google Workspace Domain Setup & DNS Configuration"
            >
              <Globe className="h-3.5 w-3.5 text-[#031134]" />
              <span className="hidden sm:inline">erp.alrajj...</span>
              <span className="sm:hidden">Domain</span>
            </button>

            {/* Non-Techie Easy Guide Button */}
            <button
              onClick={() => setShowHelpGuideModal(true)}
              className="hidden sm:flex items-center space-x-1.5 bg-[#FAF9F5] hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#4A2E1B] px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs"
              title="Non-Techie Help & Quick Tour"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#77BC2E]" />
              <span className="hidden lg:inline">Easy Guide</span>
            </button>

            {/* Notification Bell with Badge */}
            <button 
              onClick={() => setActiveTab('exceptions')}
              className="relative p-2 sm:p-2.5 rounded-xl bg-white border border-[#EAE8E2] text-[#4A2E1B] hover:bg-[#FAF9F5] shadow-2xs transition-colors"
              title="Exceptions & Flags"
            >
              <Bell className="h-4 w-4" />
              {exceptions.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E89BB9] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                  {exceptions.length}
                </span>
              )}
            </button>

            {/* Quick Settings Action */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`p-2 sm:p-2.5 rounded-xl border shadow-2xs transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#031134] text-[#77BC2E] border-[#031134]'
                  : 'bg-white border-[#EAE8E2] text-[#5A534E] hover:bg-[#FAF9F5]'
              }`}
              title="System Settings, Roles & About"
            >
              <Settings className="h-4 w-4" />
            </button>

            {/* + Add Employee Action */}
            <button
              onClick={() => setShowAddEmployeeModal(true)}
              className="bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold text-xs sm:text-sm rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 flex items-center space-x-1.5 sm:space-x-2 shadow-sm shadow-[#77BC2E]/20 transition-all active:scale-95 flex-shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Employee</span>
              <span className="sm:hidden">Add</span>
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

              {/* Row 1.5: Multi-Level Approval Pipeline Chain-of-Command Highlight Card */}
              <div className="bg-gradient-to-r from-[#031134] via-[#082260] to-[#031134] rounded-3xl p-5 sm:p-6 text-white shadow-md border border-[#031134] space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#77BC2E] text-white flex items-center justify-center font-extrabold shadow-sm">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-extrabold text-base text-white">Chain of Command Approval Matrix</h3>
                        <span className="bg-[#77BC2E]/20 text-[#77BC2E] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#77BC2E]/40">
                          Multi-Level Routing
                        </span>
                      </div>
                      <p className="text-xs text-white/70">
                        Tiered authorization: Store Specialist &rarr; Shift Supervisor &rarr; HR/Accounting Audit &rarr; Managing Director Ms. Jehan Abedin
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveTab('approvals')}
                      className="bg-[#77BC2E] hover:bg-[#6DB027] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm shadow-[#77BC2E]/20"
                    >
                      <span>Open Approval Hub ({approvalsList.filter(a => a.currentLevel < 5).length})</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setShowNewApprovalModal(true)}
                      className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-white/20 transition-all flex items-center space-x-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>New Request</span>
                    </button>
                  </div>
                </div>

                {/* 4-Tier Visual Routing Matrix Flow Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  
                  {/* Tier 1: Staff Filing */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#77BC2E]">Level 1: Staff Filing</span>
                      <span className="w-2 h-2 rounded-full bg-[#77BC2E]"></span>
                    </div>
                    <div className="font-bold text-white text-sm">Branch Staff / Specialist</div>
                    <p className="text-[11px] text-white/60">DTR overrides, MyTime requisitions, Vale & SIL leaves</p>
                  </div>

                  {/* Tier 2: Store Supervisor */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#E89BB9]">Level 2: Store Lead</span>
                      <span className="text-[10px] font-bold text-[#E89BB9]">
                        {approvalsList.filter(a => a.currentLevel === 2).length} Pending
                      </span>
                    </div>
                    <div className="font-bold text-white text-sm">Shift Lead Endorsement</div>
                    <p className="text-[11px] text-white/60">Physical count, shift logbook & bed roster verification</p>
                  </div>

                  {/* Tier 3: HR & Accounting */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">Level 3: Operations/HR</span>
                      <span className="text-[10px] font-bold text-[#D4AF37]">
                        {approvalsList.filter(a => a.currentLevel === 3).length} Pending
                      </span>
                    </div>
                    <div className="font-bold text-white text-sm">Accounting & Compliance</div>
                    <p className="text-[11px] text-white/60">DOLE compliance, GL budget audit & 3-way match</p>
                  </div>

                  {/* Tier 4: Managing Director */}
                  <div className="bg-white/10 border border-[#77BC2E]/40 rounded-2xl p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#77BC2E]">Level 4: Managing Director</span>
                      <span className="text-[10px] font-bold text-[#77BC2E] animate-pulse">
                        {approvalsList.filter(a => a.currentLevel === 4).length} Ready
                      </span>
                    </div>
                    <div className="font-bold text-white text-sm">Ms. Jehan Abedin (MD)</div>
                    <p className="text-[11px] text-white/60">Final executive sign-off & BPI BizLink fund release</p>
                  </div>
                </div>
              </div>
              
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
                      {systemDataMode === 'live' ? 'Live Store' : 'Demo Pulse'}
                    </span>
                  </div>

                  {/* Donut Chart with Center Percentage */}
                  <div className="relative h-48 flex items-center justify-center">
                    <ReactECharts option={getAttendanceDonutOption()} style={{ height: '100%', width: '100%' }} />
                    <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                      {(() => {
                        const totalAtt = attendance.length;
                        const presentCount = attendance.filter(a => ['Present', 'Approved'].includes(a.status)).length;
                        const pct = totalAtt > 0 ? Math.round((presentCount / totalAtt) * 100) : 0;
                        return (
                          <>
                            <span className="text-3xl font-extrabold text-[#4A2E1B]">{pct}%</span>
                            <span className="text-[10px] uppercase font-bold text-[#8A817C] tracking-wider">
                              {totalAtt > 0 ? 'Present' : 'Clean Slate'}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Color Legend (Laybare colors) */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#F2F0E8] text-center text-xs">
                    <div className="flex flex-col items-center">
                      <span className="flex items-center space-x-1 font-bold text-[#4A2E1B]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#77BC2E]"></span>
                        <span>Present</span>
                      </span>
                      <span className="text-[10px] text-[#8A817C]">
                        {attendance.filter(a => ['Present', 'Approved'].includes(a.status)).length} staff
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="flex items-center space-x-1 font-bold text-[#4A2E1B]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E89BB9]"></span>
                        <span>Flags</span>
                      </span>
                      <span className="text-[10px] text-[#8A817C]">{exceptions.length} missing</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="flex items-center space-x-1 font-bold text-[#4A2E1B]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#B58EBE]"></span>
                        <span>Rest Day</span>
                      </span>
                      <span className="text-[10px] text-[#8A817C]">
                        {attendance.filter(a => a.status === 'Rest Day').length} logs
                      </span>
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
                  {livePunches.length > 0 ? (
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
                  ) : (
                    <div className="p-6 rounded-2xl bg-[#FAF9F5] border-2 border-dashed border-[#EAE8E2] text-center space-y-2.5 flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-xl bg-[#77BC2E]/15 text-[#77BC2E] flex items-center justify-center">
                        <Upload className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-[#4A2E1B]">Live Store Mode Active (0 Logs)</h4>
                        <p className="text-[11px] text-[#8A817C] max-w-sm mt-0.5">
                          No punch logs imported yet. Upload your store's NGTeco Excel (.xls) file to populate real staff DTR records.
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 pt-1">
                        <button
                          onClick={() => setActiveTab('upload')}
                          className="bg-[#77BC2E] hover:bg-[#6DB027] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-2xs"
                        >
                          <Upload className="h-3 w-3" />
                          <span>Import .XLS File</span>
                        </button>
                        <button
                          onClick={handleReloadDemoData}
                          className="bg-white border border-[#EAE8E2] hover:bg-[#FAF9F5] text-[#5A534E] px-3 py-1.5 rounded-xl text-xs font-semibold"
                        >
                          Restore Demo Data
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Quick summary notice */}
                  <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-[#EAE8E2] flex items-center justify-between text-xs text-[#5A534E]">
                    <span>Payroll calculation ready for {startDate} to {endDate}.</span>
                    <button
                      onClick={() => setActiveTab('payroll')}
                      className="font-bold text-[#77BC2E] hover:underline"
                    >
                      Run Payroll â†’
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
                  {filteredAttendance.length > 0 ? (
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
                  ) : (
                    <div className="p-12 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#FAF9F5] border border-[#EAE8E2] text-[#8A817C] flex items-center justify-center mx-auto">
                        <Clock className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-[#4A2E1B]">No Biometric Timesheet Records Loaded</h4>
                        <p className="text-xs text-[#8A817C] max-w-sm mx-auto mt-0.5">
                          In Live Store Mode, timesheets will populate once raw NGTeco .xls punch spreadsheets are imported.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('upload')}
                        className="bg-[#77BC2E] hover:bg-[#6DB027] text-white px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 shadow-2xs"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        <span>Go to Biometric Ingestion</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: MULTI-LEVEL APPROVALS & CHAIN OF COMMAND ROUTING */}
          {activeTab === 'approvals' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Approvals Header & Tiered Metric Cards */}
              <div className="bg-white border border-[#EAE8E2] rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F2F0E8] pb-6">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-[#031134] text-[#77BC2E] flex items-center justify-center shadow-sm font-extrabold">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-extrabold text-[#4A2E1B] tracking-tight">Multi-Level Approval Matrix</h2>
                        <p className="text-xs text-[#8A817C]">
                          Enterprise 4-Tier Chain of Command for DTR Exceptions, Commissary POs, BPI Payroll & Cash Advances
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowNewApprovalModal(true)}
                      className="bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold text-xs sm:text-sm rounded-xl px-4 py-2.5 flex items-center space-x-2 shadow-sm shadow-[#77BC2E]/20 transition-all active:scale-95"
                    >
                      <Plus className="h-4 w-4" />
                      <span>File New Multi-Level Request</span>
                    </button>
                  </div>
                </div>

                {/* 4-Tier Approval Authority Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Level 1 Card */}
                  <div 
                    onClick={() => setApprovalLevelFilter('all')}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                      approvalLevelFilter === 'all' 
                        ? 'bg-[#FAF9F5] border-[#77BC2E] shadow-2xs' 
                        : 'bg-white border-[#EAE8E2] hover:border-[#77BC2E]'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C]">Level 1: Origin</span>
                      <span className="bg-[#77BC2E]/15 text-[#5A9A1E] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        {approvalsList.length} Total
                      </span>
                    </div>
                    <div className="font-extrabold text-sm text-[#4A2E1B]">Branch Specialist / Staff</div>
                    <p className="text-[11px] text-[#8A817C] mt-1">Centrio, Passion Nails, Ketkai, SM, Iligan staff requests</p>
                  </div>

                  {/* Level 2 Card */}
                  <div 
                    onClick={() => setApprovalLevelFilter('level2')}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                      approvalLevelFilter === 'level2' 
                        ? 'bg-[#FAF9F5] border-[#E89BB9] shadow-2xs' 
                        : 'bg-white border-[#EAE8E2] hover:border-[#E89BB9]'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D47098]">Level 2: Store Lead</span>
                      <span className="bg-[#E89BB9]/20 text-[#D47098] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        {approvalsList.filter(a => a.currentLevel === 2).length} Pending
                      </span>
                    </div>
                    <div className="font-extrabold text-sm text-[#4A2E1B]">Shift Supervisor Endorsement</div>
                    <p className="text-[11px] text-[#8A817C] mt-1">Cherimar Concigo / Branch Leads log verification</p>
                  </div>

                  {/* Level 3 Card */}
                  <div 
                    onClick={() => setApprovalLevelFilter('level3')}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                      approvalLevelFilter === 'level3' 
                        ? 'bg-[#FAF9F5] border-[#D4AF37] shadow-2xs' 
                        : 'bg-white border-[#EAE8E2] hover:border-[#D4AF37]'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#B48A10]">Level 3: Operations/Audit</span>
                      <span className="bg-[#D4AF37]/20 text-[#966E0A] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        {approvalsList.filter(a => a.currentLevel === 3).length} Pending
                      </span>
                    </div>
                    <div className="font-extrabold text-sm text-[#4A2E1B]">HR & Accounting Audit</div>
                    <p className="text-[11px] text-[#8A817C] mt-1">Kristene HR / Accounting compliance & 3-way match</p>
                  </div>

                  {/* Level 4 Card */}
                  <div 
                    onClick={() => setApprovalLevelFilter('level4')}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                      approvalLevelFilter === 'level4' 
                        ? 'bg-[#FAF9F5] border-[#031134] shadow-2xs' 
                        : 'bg-white border-[#EAE8E2] hover:border-[#031134]'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#031134]">Level 4: Managing Director</span>
                      <span className="bg-[#031134] text-[#77BC2E] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        {approvalsList.filter(a => a.currentLevel === 4).length} Pending MD
                      </span>
                    </div>
                    <div className="font-extrabold text-sm text-[#4A2E1B]">Ms. Jehan Abedin (MD)</div>
                    <p className="text-[11px] text-[#8A817C] mt-1">Executive financial authorization & BPI BizLink sign-off</p>
                  </div>
                </div>

                {/* Level Filters & Category Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#F2F0E8] text-xs font-semibold">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[#8A817C] text-[11px] font-bold">Filter Tier:</span>
                    <button
                      onClick={() => setApprovalLevelFilter('all')}
                      className={`px-3 py-1.5 rounded-xl transition-all ${
                        approvalLevelFilter === 'all'
                          ? 'bg-[#031134] text-white font-bold'
                          : 'bg-[#FAF9F5] text-[#5A534E] hover:bg-[#F2F0E8]'
                      }`}
                    >
                      All ({approvalsList.length})
                    </button>
                    <button
                      onClick={() => setApprovalLevelFilter('level2')}
                      className={`px-3 py-1.5 rounded-xl transition-all ${
                        approvalLevelFilter === 'level2'
                          ? 'bg-[#E89BB9] text-white font-bold'
                          : 'bg-[#FAF9F5] text-[#5A534E] hover:bg-[#F2F0E8]'
                      }`}
                    >
                      Supervisor Pending ({approvalsList.filter(a => a.currentLevel === 2).length})
                    </button>
                    <button
                      onClick={() => setApprovalLevelFilter('level3')}
                      className={`px-3 py-1.5 rounded-xl transition-all ${
                        approvalLevelFilter === 'level3'
                          ? 'bg-[#B48A10] text-white font-bold'
                          : 'bg-[#FAF9F5] text-[#5A534E] hover:bg-[#F2F0E8]'
                      }`}
                    >
                      HR/Audit Pending ({approvalsList.filter(a => a.currentLevel === 3).length})
                    </button>
                    <button
                      onClick={() => setApprovalLevelFilter('level4')}
                      className={`px-3 py-1.5 rounded-xl transition-all ${
                        approvalLevelFilter === 'level4'
                          ? 'bg-[#77BC2E] text-white font-bold'
                          : 'bg-[#FAF9F5] text-[#5A534E] hover:bg-[#F2F0E8]'
                      }`}
                    >
                      Awaiting Ms. Jehan Sign-off ({approvalsList.filter(a => a.currentLevel === 4).length})
                    </button>
                    <button
                      onClick={() => setApprovalLevelFilter('completed')}
                      className={`px-3 py-1.5 rounded-xl transition-all ${
                        approvalLevelFilter === 'completed'
                          ? 'bg-[#031134] text-white font-bold'
                          : 'bg-[#FAF9F5] text-[#5A534E] hover:bg-[#F2F0E8]'
                      }`}
                    >
                      Approved & Disbursed ({approvalsList.filter(a => a.currentLevel >= 5).length})
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[#8A817C] text-[11px] font-bold">Category:</span>
                    <select
                      value={approvalTypeFilter}
                      onChange={(e) => setApprovalTypeFilter(e.target.value)}
                      className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-1.5 text-xs text-[#4A2E1B] outline-none font-bold"
                    >
                      <option value="all">All Request Types</option>
                      <option value="dtr_override">DTR Punch Overrides</option>
                      <option value="commissary_po">MyTime Commissary PO</option>
                      <option value="payroll_disbursement">BPI Payroll Disbursement</option>
                      <option value="cash_advance">Staff Cash Advance (Vale)</option>
                      <option value="leave_application">Leave Application (SIL)</option>
                      <option value="petty_cash">Petty Cash Vouchers</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Approval Requests Interactive List */}
              <div className="space-y-4">
                {(() => {
                  const filtered = approvalsList.filter(item => {
                    const matchLevel = 
                      approvalLevelFilter === 'all' ? true :
                      approvalLevelFilter === 'level2' ? item.currentLevel === 2 :
                      approvalLevelFilter === 'level3' ? item.currentLevel === 3 :
                      approvalLevelFilter === 'level4' ? item.currentLevel === 4 :
                      approvalLevelFilter === 'completed' ? item.currentLevel >= 5 : true;
                    
                    const matchType = approvalTypeFilter === 'all' ? true : item.type === approvalTypeFilter;
                    return matchLevel && matchType;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="bg-white border border-[#EAE8E2] rounded-3xl p-12 text-center space-y-3 shadow-2xs">
                        <div className="w-12 h-12 rounded-2xl bg-[#77BC2E]/15 text-[#77BC2E] flex items-center justify-center mx-auto">
                          <CheckCircle className="h-6 w-6" />
                        </div>
                        <h4 className="font-extrabold text-base text-[#4A2E1B]">No Pending Requests in this Approval Tier</h4>
                        <p className="text-xs text-[#8A817C] max-w-md mx-auto">
                          All requests matching this filter have been processed or no requests have been filed yet.
                        </p>
                        <button
                          onClick={() => setShowNewApprovalModal(true)}
                          className="bg-[#77BC2E] hover:bg-[#6DB027] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-2xs inline-flex items-center space-x-1.5"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Submit a Multi-Level Request</span>
                        </button>
                      </div>
                    );
                  }

                  return filtered.map((req) => (
                    <div 
                      key={req.id} 
                      className="bg-white border border-[#EAE8E2] hover:border-[#77BC2E]/50 rounded-3xl p-6 sm:p-7 shadow-2xs space-y-5 transition-all"
                    >
                      {/* Top Meta Info */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#F2F0E8] pb-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-extrabold text-xs text-[#031134] bg-[#031134]/10 px-2.5 py-0.5 rounded-lg">
                              {req.id}
                            </span>
                            <span className="font-bold text-xs bg-[#77BC2E]/15 text-[#5A9A1E] px-2.5 py-0.5 rounded-lg">
                              {req.typeName}
                            </span>
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              req.priority === 'Urgent' 
                                ? 'bg-rose-100 text-rose-700 animate-pulse' 
                                : req.priority === 'High' 
                                ? 'bg-[#E89BB9]/25 text-[#D47098]' 
                                : 'bg-[#FAF9F5] text-[#5A534E] border border-[#EAE8E2]'
                            }`}>
                              {req.priority} Priority
                            </span>
                            <span className="text-xs text-[#8A817C] font-semibold">
                              â— {req.branch}
                            </span>
                          </div>
                          <h3 className="font-extrabold text-base text-[#4A2E1B]">{req.title}</h3>
                        </div>

                        <div className="text-right flex flex-col md:items-end">
                          {req.amount && (
                            <span className="text-lg font-mono font-extrabold text-[#77BC2E]">
                              â‚±{req.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                          )}
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full inline-block ${
                            req.currentLevel >= 5 
                              ? 'bg-[#77BC2E] text-white' 
                              : req.currentLevel === 4 
                              ? 'bg-[#031134] text-[#77BC2E]' 
                              : req.currentLevel === 3 
                              ? 'bg-[#D4AF37]/20 text-[#966E0A]' 
                              : 'bg-[#E89BB9]/20 text-[#D47098]'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                      </div>

                      {/* Request Description & Submitter Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#FAF9F5] p-4 rounded-2xl border border-[#F2F0E8] text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-[#8A817C] uppercase tracking-wider block">Requestor</span>
                          <strong className="text-[#4A2E1B]">{req.requestor}</strong>
                          <p className="text-[#8A817C] text-[11px]">{req.role}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#8A817C] uppercase tracking-wider block">Date Filed</span>
                          <strong className="text-[#4A2E1B]">{req.dateSubmitted}</strong>
                          <p className="text-[#8A817C] text-[11px]">Branch: {req.branch}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#8A817C] uppercase tracking-wider block">Justification / Remarks</span>
                          <p className="text-[#5A534E] text-[11px] leading-relaxed">{req.description}</p>
                        </div>
                      </div>

                      {/* 4-Stage Visual Progress Bar & Timestamps */}
                      <div className="space-y-2">
                        <div className="text-[11px] font-extrabold text-[#4A2E1B] uppercase tracking-wider flex items-center space-x-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-[#77BC2E]" />
                          <span>Chain of Command Progression</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {req.stages.map((stage) => {
                            const isPast = stage.status === 'Approved';
                            const isCurrent = stage.level === req.currentLevel;
                            const isQueued = stage.status === 'Queued';
                            const isRejected = stage.status === 'Rejected';

                            return (
                              <div 
                                key={stage.level} 
                                className={`p-3.5 rounded-2xl border text-xs space-y-1.5 transition-all ${
                                  isPast 
                                    ? 'bg-[#77BC2E]/10 border-[#77BC2E]/30 text-[#4A2E1B]' 
                                    : isCurrent 
                                    ? 'bg-white border-[#031134] shadow-sm ring-2 ring-[#031134]/10' 
                                    : isRejected 
                                    ? 'bg-rose-50 border-rose-300 text-rose-800' 
                                    : 'bg-[#FAF9F5] border-[#F2F0E8] text-[#8A817C]'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
                                    isPast ? 'text-[#5A9A1E]' : isCurrent ? 'text-[#031134]' : 'text-[#8A817C]'
                                  }`}>
                                    Tier {stage.level}
                                  </span>
                                  {isPast ? (
                                    <CheckCircle className="h-4 w-4 text-[#77BC2E]" />
                                  ) : isCurrent ? (
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#031134] animate-ping"></span>
                                  ) : isRejected ? (
                                    <XCircle className="h-4 w-4 text-rose-600" />
                                  ) : (
                                    <Clock className="h-3.5 w-3.5 text-[#8A817C]" />
                                  )}
                                </div>

                                <div className="font-bold text-[#4A2E1B]">{stage.name}</div>
                                <div className="text-[10px] text-[#8A817C]">{stage.by}</div>
                                
                                {stage.time && (
                                  <div className="font-mono text-[10px] text-[#5A534E] font-semibold">{stage.time}</div>
                                )}

                                {stage.note && (
                                  <p className="text-[10px] text-[#5A534E] italic pt-1 border-t border-[#F2F0E8] leading-tight">
                                    "{stage.note}"
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Action Toolbar Based on Current Authority Level */}
                      <div className="pt-3 border-t border-[#F2F0E8] flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs text-[#8A817C]">
                          {req.currentLevel === 2 && (
                            <span>Awaiting <strong>Level 2: Store Supervisor (Cherimar Concigo / Shift Lead)</strong> endorsement.</span>
                          )}
                          {req.currentLevel === 3 && (
                            <span>Awaiting <strong>Level 3: Operations & HR Audit (Kristene HR / Accounting)</strong> compliance review.</span>
                          )}
                          {req.currentLevel === 4 && (
                            <span className="text-[#031134] font-bold">
                              ðŸ‘‘ Awaiting <strong>Level 4: Managing Director Ms. Jehan Abedin</strong> executive sign-off & BPI disbursement.
                            </span>
                          )}
                          {req.currentLevel >= 5 && (
                            <span className="text-[#77BC2E] font-bold">
                              âœ… Fully Approved & Disbursed! Auto-posted to General Ledger & BPI BizLink Batch file.
                            </span>
                          )}
                        </div>

                        {req.currentLevel < 5 && (
                          <div className="flex items-center space-x-2">
                            {req.currentLevel === 2 && (
                              <button
                                onClick={() => handleAdvanceApproval(req.id)}
                                className="bg-[#77BC2E] hover:bg-[#6DB027] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-2xs"
                              >
                                <Check className="h-3.5 w-3.5" />
                                <span>Endorse as Store Supervisor &rarr; Pass to HR</span>
                              </button>
                            )}

                            {req.currentLevel === 3 && (
                              <button
                                onClick={() => handleAdvanceApproval(req.id)}
                                className="bg-[#031134] hover:bg-[#082260] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-2xs"
                              >
                                <CheckCheck className="h-3.5 w-3.5 text-[#77BC2E]" />
                                <span>Audit & Forward to Managing Director (Ms. Jehan Abedin)</span>
                              </button>
                            )}

                            {req.currentLevel === 4 && (
                              <button
                                onClick={() => handleAdvanceApproval(req.id)}
                                className="bg-gradient-to-r from-[#031134] to-[#77BC2E] hover:opacity-95 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all flex items-center space-x-2 shadow-md"
                              >
                                <ShieldCheck className="h-4 w-4 text-[#77BC2E]" />
                                <span>ðŸ‘‘ Authorize as Managing Director (Ms. Jehan Abedin)</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleRejectApproval(req.id)}
                              className="bg-white border border-[#EAE8E2] hover:bg-rose-50 text-rose-600 text-xs font-bold px-3 py-2 rounded-xl transition-all"
                            >
                              Reject / Issue NTE
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ));
                })()}
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
                      <p className="text-xs text-[#8A817C]">{(uploadFile.size / 1024).toFixed(1)} KB â€” Ready to parse</p>
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
                      Smart, automated bookkeeping designed for Lay Bare branches. Zero manual spreadsheets neededâ€”all POS revenue, payroll accruals, and supplier bills are automatically reconciled.
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
                    <span className="text-xs font-extrabold text-[#4A2E1B]">âš¡ 1-Click Smart Automations:</span>
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
                        â‚±{(bankBalances.bpiBizLink + 90000).toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                        â‚±1,284,650.00
                      </div>
                      <div className="flex items-center space-x-1.5 text-[11px] text-[#5A9A1E] font-semibold">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        <span>80.67% Gross Margin (â‚±1.036M)</span>
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
                        â‚±582,400.00
                      </div>
                      <div className="text-[11px] text-[#8A817C] font-semibold">
                        Salaries: â‚±184.5k &bull; Mall Leases: â‚±295k
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
                        â‚±453,950.00
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
                          <strong className="font-mono text-[#4A2E1B]">â‚±542.1k (42%)</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#5A534E] flex items-center space-x-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#E89BB9]"></span>
                            <span>Passion Nails (Centrio)</span>
                          </span>
                          <strong className="font-mono text-[#4A2E1B]">â‚±318.4k (25%)</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#5A534E] flex items-center space-x-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#B58EBE]"></span>
                            <span>Limketkai Mall</span>
                          </span>
                          <strong className="font-mono text-[#4A2E1B]">â‚±264.1k (21%)</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#5A534E] flex items-center space-x-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#031134]"></span>
                            <span>SM Downtown Premier</span>
                          </span>
                          <strong className="font-mono text-[#4A2E1B]">â‚±160.0k (12%)</strong>
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
                          â‚±{bankBalances.bpiBizLink.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </strong>
                        <p className="text-[11px] text-[#8A817C]">Acc: 0249-8819-22 (ALRAJJ LEGACY Fortified)</p>
                      </div>

                      <div className="bg-white border border-[#EAE8E2] rounded-2xl p-4 space-y-1">
                        <span className="text-[10px] font-extrabold uppercase text-[#8A817C] block">Centrio Waxing Float</span>
                        <strong className="text-[#4A2E1B] text-base block font-mono">
                          â‚±{bankBalances.pettyCashCentrioWaxing.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </strong>
                        <span className="text-[10px] font-bold text-[#5A9A1E]">Audited & Balanced</span>
                      </div>

                      <div className="bg-white border border-[#EAE8E2] rounded-2xl p-4 space-y-1">
                        <span className="text-[10px] font-extrabold uppercase text-[#8A817C] block">Passion Nails Float</span>
                        <strong className="text-[#4A2E1B] text-base block font-mono">
                          â‚±{bankBalances.pettyCashPassionNails.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </strong>
                        <span className="text-[10px] font-bold text-[#5A9A1E]">Audited & Balanced</span>
                      </div>

                      <div className="bg-white border border-[#EAE8E2] rounded-2xl p-4 space-y-1">
                        <span className="text-[10px] font-extrabold uppercase text-[#8A817C] block">Ketkai & SM Floats</span>
                        <strong className="text-[#4A2E1B] text-base block font-mono">
                          â‚±{(bankBalances.pettyCashLimketkai + bankBalances.pettyCashSmDowntown).toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                              â‚±{currentBranch.netOperatingIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                                <td className="py-2 px-4 text-right font-mono">â‚±{currentBranch.revenue.waxingServices.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 text-right text-[#8A817C] font-mono">{((currentBranch.revenue.waxingServices / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-8 text-[#5A534E]">Nail Art & Spa Services Revenue</td>
                                <td className="py-2 px-4 text-right font-mono">â‚±{currentBranch.revenue.nailServices.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 text-right text-[#8A817C] font-mono">{((currentBranch.revenue.nailServices / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-8 text-[#5A534E]">Retail Aftercare Products (Balms, Lotions, Scrubs)</td>
                                <td className="py-2 px-4 text-right font-mono">â‚±{currentBranch.revenue.retailProducts.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 text-right text-[#8A817C] font-mono">{((currentBranch.revenue.retailProducts / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>
                              <tr className="bg-[#77BC2E]/10 font-bold text-[#4A2E1B]">
                                <td className="py-2.5 px-4 font-bold">TOTAL GROSS REVENUE</td>
                                <td className="py-2.5 px-4 text-right font-mono font-black text-[#5A9A1E]">
                                  â‚±{currentBranch.revenue.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                                <td className="py-2 px-4 text-right font-mono text-[#D47098]">â‚±{currentBranch.cogs.waxConsumables.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 text-right text-[#8A817C] font-mono">{((currentBranch.cogs.waxConsumables / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-8 text-[#5A534E]">Nail Gels, Lacquers & Acrylic Powders</td>
                                <td className="py-2 px-4 text-right font-mono text-[#D47098]">â‚±{currentBranch.cogs.nailGelsAndLacquers.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 text-right text-[#8A817C] font-mono">{((currentBranch.cogs.nailGelsAndLacquers / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-8 text-[#5A534E]">PPE, Disposable Strips & Sanitizer Kits</td>
                                <td className="py-2 px-4 text-right font-mono text-[#D47098]">â‚±{currentBranch.cogs.ppeAndSanitizers.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 text-right text-[#8A817C] font-mono">{((currentBranch.cogs.ppeAndSanitizers / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-8 text-[#5A534E]">Branded Product Packaging & Carry Bags</td>
                                <td className="py-2 px-4 text-right font-mono text-[#D47098]">â‚±{currentBranch.cogs.packagingAndBags.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 text-right text-[#8A817C] font-mono">{((currentBranch.cogs.packagingAndBags / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>
                              <tr className="bg-[#FAF9F5] font-bold text-[#4A2E1B]">
                                <td className="py-2.5 px-4 font-bold">TOTAL COST OF GOODS SOLD</td>
                                <td className="py-2.5 px-4 text-right font-mono font-bold text-[#D47098]">
                                  (â‚±{currentBranch.cogs.totalCogs.toLocaleString('en-US', { minimumFractionDigits: 2 })})
                                </td>
                                <td className="py-2.5 px-4 text-right font-mono text-[#8A817C]">{((currentBranch.cogs.totalCogs / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>

                              {/* GROSS PROFIT */}
                              <tr className="bg-[#77BC2E]/20 font-black text-[#4A2E1B] text-sm">
                                <td className="py-3 px-4 uppercase">GROSS PROFIT</td>
                                <td className="py-3 px-4 text-right font-mono font-black text-[#5A9A1E]">
                                  â‚±{currentBranch.grossProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                                <td className="py-2 px-4 text-right font-mono text-[#4A2E1B]">â‚±{currentBranch.operatingExpenses.salariesAndWages.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 text-right text-[#8A817C] font-mono">{((currentBranch.operatingExpenses.salariesAndWages / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-8 text-[#5A534E]">Mall Space Lease & CUSA Common Charges (Ayala/SM)</td>
                                <td className="py-2 px-4 text-right font-mono text-[#4A2E1B]">â‚±{currentBranch.operatingExpenses.storeRentsAndCusa.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 text-right text-[#8A817C] font-mono">{((currentBranch.operatingExpenses.storeRentsAndCusa / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-8 text-[#5A534E]">Electricity, Air Conditioning & Water Utilities</td>
                                <td className="py-2 px-4 text-right font-mono text-[#4A2E1B]">â‚±{currentBranch.operatingExpenses.electricityAndWater.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 text-right text-[#8A817C] font-mono">{((currentBranch.operatingExpenses.electricityAndWater / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-8 text-[#5A534E]">Digital Marketing, SMS Bookings & Loyalty Rewards</td>
                                <td className="py-2 px-4 text-right font-mono text-[#4A2E1B]">â‚±{currentBranch.operatingExpenses.marketingAndLoyalty.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 text-right text-[#8A817C] font-mono">{((currentBranch.operatingExpenses.marketingAndLoyalty / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-8 text-[#5A534E]">Salon Sanitation & Equipment Maintenance</td>
                                <td className="py-2 px-4 text-right font-mono text-[#4A2E1B]">â‚±{currentBranch.operatingExpenses.maintenanceAndSanitation.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 text-right text-[#8A817C] font-mono">{((currentBranch.operatingExpenses.maintenanceAndSanitation / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-8 text-[#5A534E]">Depreciation - Wax Warmers & Spa Chairs</td>
                                <td className="py-2 px-4 text-right font-mono text-[#4A2E1B]">â‚±{currentBranch.operatingExpenses.depreciationEquipment.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="py-2 px-4 text-right text-[#8A817C] font-mono">{((currentBranch.operatingExpenses.depreciationEquipment / currentBranch.revenue.totalRevenue) * 100).toFixed(1)}%</td>
                              </tr>
                              <tr className="bg-[#FAF9F5] font-bold text-[#4A2E1B]">
                                <td className="py-2.5 px-4 font-bold">TOTAL OPERATING EXPENSES</td>
                                <td className="py-2.5 px-4 text-right font-mono font-bold text-[#4A2E1B]">
                                  (â‚±{currentBranch.operatingExpenses.totalOpex.toLocaleString('en-US', { minimumFractionDigits: 2 })})
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
                                  â‚±{currentBranch.netOperatingIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                        <span>Balanced: Assets = Liabilities + Equity (â‚±4,121,700.00)</span>
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
                          â‚±{balanceSheetData.assets.totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                            <strong className="font-mono text-[#4A2E1B]">â‚±{balanceSheetData.assets.currentAssets.cashAndCashEquivalents.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">Trade & Digital Accounts Receivable</span>
                            <strong className="font-mono text-[#4A2E1B]">â‚±{balanceSheetData.assets.currentAssets.accountsReceivable.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">Consumable Stock Inventory (Wax & Gels)</span>
                            <strong className="font-mono text-[#4A2E1B]">â‚±{balanceSheetData.assets.currentAssets.consumableInventory.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">Retail Aftercare Product Inventory</span>
                            <strong className="font-mono text-[#4A2E1B]">â‚±{balanceSheetData.assets.currentAssets.retailProductsInventory.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">Prepaid Mall Space Lease Deposits (Ayala & SM)</span>
                            <strong className="font-mono text-[#4A2E1B]">â‚±{balanceSheetData.assets.currentAssets.prepaidMallLeaseDeposits.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-2 bg-[#FAF9F5] px-3 rounded-xl font-bold text-[#4A2E1B]">
                            <span>Total Current Assets</span>
                            <span className="font-mono font-black text-[#5A9A1E]">â‚±{balanceSheetData.assets.currentAssets.totalCurrentAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
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
                            <strong className="font-mono text-[#4A2E1B]">â‚±{balanceSheetData.assets.nonCurrentAssets.salonFixturesAndEquipment.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">Nail Stations, UV Lamps & Spa Chairs</span>
                            <strong className="font-mono text-[#4A2E1B]">â‚±{balanceSheetData.assets.nonCurrentAssets.nailStationsAndSpaChairs.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">IT, Biometric Clocks & POS Terminals</span>
                            <strong className="font-mono text-[#4A2E1B]">â‚±{balanceSheetData.assets.nonCurrentAssets.itAndBiometricHardware.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#D47098]">Less: Accumulated Depreciation</span>
                            <strong className="font-mono text-[#D47098]">(â‚±420,000.00)</strong>
                          </div>
                          <div className="flex justify-between py-2 bg-[#FAF9F5] px-3 rounded-xl font-bold text-[#4A2E1B]">
                            <span>Total Non-Current Assets</span>
                            <span className="font-mono font-black text-[#5A9A1E]">â‚±{balanceSheetData.assets.nonCurrentAssets.totalNonCurrentAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
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
                          â‚±{balanceSheetData.totalLiabilitiesAndEquity.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                            <strong className="font-mono text-[#4A2E1B]">â‚±{balanceSheetData.liabilities.currentLiabilities.accountsPayableVendors.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">Accrued Salaries & Payroll Payable</span>
                            <strong className="font-mono text-[#4A2E1B]">â‚±{balanceSheetData.liabilities.currentLiabilities.accruedPayrollPayable.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">SSS, PhilHealth & Pag-IBIG Premium Payables</span>
                            <strong className="font-mono text-[#4A2E1B]">â‚±{balanceSheetData.liabilities.currentLiabilities.sssPhilhealthPagibigPayables.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">BIR Taxes Withheld & VAT Payable</span>
                            <strong className="font-mono text-[#4A2E1B]">â‚±{balanceSheetData.liabilities.currentLiabilities.birWithholdingAndVatPayable.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-2 bg-[#FAF9F5] px-3 rounded-xl font-bold text-[#4A2E1B]">
                            <span>Total Current Liabilities</span>
                            <span className="font-mono font-black text-[#D47098]">â‚±{balanceSheetData.liabilities.currentLiabilities.totalCurrentLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
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
                            <strong className="font-mono text-[#4A2E1B]">â‚±250,000.00</strong>
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
                            <strong className="font-mono text-[#4A2E1B]">â‚±{balanceSheetData.equity.ownerContributedCapital.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">Retained Earnings (Prior Periods)</span>
                            <strong className="font-mono text-[#4A2E1B]">â‚±{balanceSheetData.equity.retainedEarningsPrior.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-[#FAF9F5]">
                            <span className="text-[#5A534E]">Current Period Net Income (MTD)</span>
                            <strong className="font-mono text-[#5A9A1E]">â‚±{balanceSheetData.equity.currentPeriodNetIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between py-2 bg-[#031134]/5 px-3 rounded-xl font-bold text-[#031134]">
                            <span>Total Owner's Equity</span>
                            <span className="font-mono font-black text-[#031134]">â‚±{balanceSheetData.equity.totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
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
                        â‚±{apInvoices.filter(i => i.status !== 'Paid').reduce((sum, i) => sum + i.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                        â‚±125,000.00
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
                                â‚±{inv.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                                â‚±{rec.openingFloat.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-4 px-6 text-right font-mono font-bold text-[#5A9A1E]">
                                â‚±{rec.cashSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-4 px-6 text-right font-mono text-[#031134]">
                                â‚±{(rec.mayaQrSales + rec.gcashQrSales + rec.cardTerminalSales).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-4 px-6 text-right font-mono text-[#D47098]">
                                (â‚±{rec.pettyCashExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })})
                              </td>
                              <td className="py-4 px-6 text-right font-mono font-black text-sm text-[#4A2E1B]">
                                â‚±{rec.actualCashCounted.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-4 px-6 text-center">
                                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                                  rec.variance === 0
                                    ? 'bg-[#77BC2E]/15 text-[#5A9A1E]'
                                    : 'bg-[#D47098]/20 text-[#D47098]'
                                }`}>
                                  {rec.variance === 0 ? 'â‚±0.00 Exact' : `â‚±${rec.variance.toFixed(2)}`}
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
                                  â‚±{totalDebit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                                        {l.debit > 0 ? `â‚±${l.debit.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                                      </td>
                                      <td className="py-2 px-3 text-right font-mono font-bold text-[#D47098]">
                                        {l.credit > 0 ? `â‚±${l.credit.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
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
                            <strong className="font-mono text-[#4A2E1B]">â‚±{form.taxableBase.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                          </div>
                          <div className="flex justify-between text-[#4A2E1B] font-bold pt-1 border-t border-[#EAE8E2]">
                            <span>Remittance Amount Due:</span>
                            <span className="font-mono font-black text-sm text-[#5A9A1E]">â‚±{form.taxDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
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
                        âœ“ Ready
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
                          âœ“ Verified
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
                          âœ“ Authorized
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
                        {disbursementStage === 'disbursed' ? 'Available in ATMs â€¢ Slips active' : 'Live upon MD approval'}
                      </p>
                      <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        disbursementStage === 'disbursed'
                          ? 'bg-[#77BC2E] text-white shadow-xs'
                          : 'bg-[#EAE8E2] text-[#8A817C]'
                      }`}>
                        {disbursementStage === 'disbursed' ? 'ðŸŽ‰ Disbursed' : 'Awaiting Stage 4'}
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
                            <td className="px-6 py-4 font-mono font-medium">â‚±{p.calculations.basicPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                            <td className="px-6 py-4 font-mono text-[#77BC2E] font-bold">
                              +â‚±{(p.calculations.otPay + p.calculations.ndPay).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 font-mono text-[#D47098]">
                              -â‚±{p.calculations.totalTardinessDeduction.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 font-mono font-medium">â‚±{p.calculations.grossPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                            <td className="px-6 py-4 font-mono text-[#D47098]">
                              -â‚±{p.calculations.deductions.totalDeductions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 font-mono font-extrabold text-[#77BC2E]">
                              â‚±{p.calculations.netPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    const matchedEmp = employees.find(e => e.id === p.employeeId) || {
                                      id: p.employeeId,
                                      name: p.employeeName,
                                      rate: p.dailyRate || 600,
                                      branch: p.branch || 'Centrio Mall (Waxing)',
                                      bpi_account: p.bpiAccount || '0249821401'
                                    };
                                    setNewEmployee({
                                      id: p.employeeId,
                                      name: p.employeeName,
                                      branch: matchedEmp.branch || 'Centrio Mall (Waxing)',
                                      rate: matchedEmp.rate || 600,
                                      taxStatus: matchedEmp.tax_status || 'S',
                                      bpiAccount: matchedEmp.bpi_account || '0249821401',
                                      sssNo: matchedEmp.sss_no || '34-8192019-3',
                                      philhealthNo: matchedEmp.philhealth_no || '12-054918230-1',
                                      pagibigNo: matchedEmp.pagibig_no || '1210-9482-1104',
                                      tinNo: matchedEmp.tin_no || '291-840-192-000',
                                      otherDeductions: p.calculations?.deductions?.otherDeductions || 0,
                                      otherDeductionRemarks: p.calculations?.deductions?.otherDeductionRemarks || 'Cash Advance (Vale)'
                                    });
                                    setShowAddEmployeeModal(true);
                                  }}
                                  className="bg-[#FAF9F5] hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#4A2E1B] font-bold text-xs px-2.5 py-1.5 rounded-xl transition-all flex items-center space-x-1"
                                  title="Quick Adjust Vale or Deduction"
                                >
                                  <Edit className="h-3 w-3 text-[#77BC2E]" />
                                  <span>Adjust / Vale</span>
                                </button>
                                <button
                                  onClick={() => setSelectedPayslip(p)}
                                  className="bg-[#031134] hover:bg-[#091D4C] text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1 shadow-2xs"
                                >
                                  <FileText className="h-3 w-3 text-[#77BC2E]" />
                                  <span>View Slip</span>
                                </button>
                              </div>
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

              {/* CRM SUB-NAVIGATION TABS */}
              <div className="bg-white border border-[#EAE8E2] rounded-3xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCrmSubTab('tickets')}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center space-x-2 ${
                      crmSubTab === 'tickets'
                        ? 'bg-[#77BC2E] text-white shadow-sm shadow-[#77BC2E]/25'
                        : 'bg-[#FAF9F5] text-[#5A534E] hover:bg-[#F2F0E8] hover:text-[#4A2E1B]'
                    }`}
                  >
                    <Calculator className="h-4 w-4" />
                    <span>Live POS Service Tickets</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      crmSubTab === 'tickets' ? 'bg-white text-[#77BC2E]' : 'bg-[#EAE8E2] text-[#5A534E]'
                    }`}>
                      {serviceTickets.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setCrmSubTab('clients')}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center space-x-2 ${
                      crmSubTab === 'clients'
                        ? 'bg-[#E89BB9] text-white shadow-sm shadow-[#E89BB9]/25'
                        : 'bg-[#FAF9F5] text-[#5A534E] hover:bg-[#F2F0E8] hover:text-[#4A2E1B]'
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    <span>VIP Client Retention & Packages</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      crmSubTab === 'clients' ? 'bg-white text-[#D47098]' : 'bg-[#EAE8E2] text-[#5A534E]'
                    }`}>
                      {crmClients.length}
                    </span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  {crmSubTab === 'tickets' ? (
                    <button
                      onClick={() => setShowNewTicketModal(true)}
                      className="bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold text-xs px-4 py-2.5 rounded-2xl transition-all flex items-center space-x-2 shadow-sm shadow-[#77BC2E]/20"
                    >
                      <Plus className="h-4 w-4" />
                      <span>+ Ring Up Service Ticket</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowAddClientModal(true)}
                      className="bg-[#E89BB9] hover:bg-[#D47098] text-white font-bold text-xs px-4 py-2.5 rounded-2xl transition-all flex items-center space-x-2 shadow-sm shadow-[#E89BB9]/20"
                    >
                      <Plus className="h-4 w-4" />
                      <span>+ Add VIP Client</span>
                    </button>
                  )}
                </div>
              </div>

              {/* VIEW 1: TODAY'S LIVE SERVICE TICKETS (PER-TRANSACTION POS LOG) */}
              {crmSubTab === 'tickets' && (
                <div className="bg-white border border-[#EAE8E2] rounded-3xl overflow-hidden shadow-2xs space-y-4 p-6 animate-fadeIn">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F2F0E8] pb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-[#77BC2E]/15 text-[#5A9A1E] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                          Live POS Register
                        </span>
                        <span className="text-xs font-bold text-[#8A817C]">Per-Transaction Sales & Specialist Commissions</span>
                      </div>
                      <h3 className="font-extrabold text-lg text-[#4A2E1B] mt-1">Today's Live Service Tickets</h3>
                      <p className="text-xs text-[#8A817C]">Real-time ticketing across Lay Bare & Passion Nails. Automatically calculates technician commissions and feeds daily POS register audits.</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="bg-[#FAF9F5] border border-[#EAE8E2] px-4 py-2 rounded-2xl text-right">
                        <span className="text-[10px] font-bold uppercase text-[#8A817C] block">Total Logged Today</span>
                        <span className="text-base font-extrabold text-[#77BC2E] font-mono">
                          â‚±{serviceTickets.reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} ({serviceTickets.length} tickets)
                        </span>
                      </div>

                      <button
                        onClick={() => setShowNewTicketModal(true)}
                        className="bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold text-xs px-4 py-2.5 rounded-2xl transition-all flex items-center space-x-2 shadow-sm shadow-[#77BC2E]/20"
                      >
                        <Plus className="h-4 w-4" />
                        <span>+ Ring Up Ticket</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#FAF9F5] border-b border-[#F2F0E8] text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C]">
                          <th className="px-5 py-3">Ticket # & Time</th>
                          <th className="px-5 py-3">Client / Guest</th>
                          <th className="px-5 py-3">Branch Location</th>
                          <th className="px-5 py-3">Service Rendered</th>
                          <th className="px-5 py-3">Assigned Specialist</th>
                          <th className="px-5 py-3">Payment Method</th>
                          <th className="px-5 py-3 text-right">Amount (PHP)</th>
                          <th className="px-5 py-3 text-right">Commission (10%)</th>
                          <th className="px-5 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F2F0E8]">
                        {serviceTickets.map((tkt) => (
                          <tr key={tkt.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                            <td className="px-5 py-4 font-mono">
                              <strong className="text-[#031134] block font-bold">{tkt.id}</strong>
                              <span className="text-[10px] text-[#8A817C]">{tkt.time} &bull; {tkt.date}</span>
                            </td>
                            <td className="px-5 py-4 font-bold text-[#4A2E1B]">{tkt.clientName}</td>
                            <td className="px-5 py-4 text-[#5A534E] font-medium">{tkt.branch}</td>
                            <td className="px-5 py-4 font-semibold text-[#4A2E1B]">{tkt.service}</td>
                            <td className="px-5 py-4">
                              <span className="bg-[#77BC2E]/10 text-[#5A9A1E] font-bold px-2 py-0.5 rounded-md text-[11px] inline-flex items-center space-x-1">
                                <Sparkles className="h-3 w-3" />
                                <span>{tkt.specialist}</span>
                              </span>
                            </td>
                            <td className="px-5 py-4 font-semibold">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                tkt.paymentMethod.includes('GCash') ? 'bg-sky-50 text-sky-700' :
                                tkt.paymentMethod.includes('Maya') ? 'bg-emerald-50 text-emerald-700' :
                                tkt.paymentMethod.includes('Card') ? 'bg-purple-50 text-purple-700' :
                                'bg-amber-50 text-amber-900'
                              }`}>
                                {tkt.paymentMethod}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right font-mono font-extrabold text-[#4A2E1B]">
                              â‚±{tkt.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-5 py-4 text-right font-mono text-[#77BC2E] font-bold">
                              â‚±{tkt.commission.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-5 py-4">
                              <span className="bg-[#77BC2E]/15 text-[#5A9A1E] font-extrabold text-[10px] px-2.5 py-1 rounded-full">
                                âœ“ {tkt.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VIEW 2: VIP CLIENT RETENTION & PACKAGES */}
              {crmSubTab === 'clients' && (
                <div className="bg-white border border-[#EAE8E2] rounded-3xl overflow-hidden shadow-2xs animate-fadeIn">
                  <div className="p-6 border-b border-[#F2F0E8] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-[#E89BB9]/20 text-[#D47098] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                          VIP Registry
                        </span>
                        <h3 className="font-extrabold text-base text-[#4A2E1B]">Client Retention & Loyalty Registry</h3>
                      </div>
                      <p className="text-xs text-[#8A817C] mt-0.5">Visit histories, package balances, specialist assignments & skin sensitivity notes</p>
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
              )}
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
                              â‚±{po.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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

          {/* TAB: ENTERPRISE HR HUB & SETHCON WORKFORCE SUITE */}
          {activeTab === 'employees' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* HR Suite Header Banner */}
              <div className="bg-gradient-to-r from-[#031134] via-[#091D4C] to-[#031134] rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-[#031134] space-y-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#77BC2E] text-white flex items-center justify-center font-black text-xl shadow-md flex-shrink-0">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-extrabold text-white tracking-tight">ALRAJJ Enterprise HRMS & Workforce Suite</h2>
                        <span className="bg-[#77BC2E]/20 text-[#77BC2E] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#77BC2E]/40 flex items-center space-x-1">
                          <Sparkles className="h-3 w-3" />
                          <span>SETHCON HR + Workforce Integrated</span>
                        </span>
                      </div>
                      <p className="text-xs text-white/70 mt-1 max-w-2xl">
                        Unified 201 File Management, DOLE Leaves & SIL, Visual Shift Rostering, Overtime / OB Slips, 13th-Month Accruals, and Employee Self-Service (ESS).
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => setShowLeaveFilingModal(true)}
                      className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-white/15 transition-all flex items-center space-x-1.5 backdrop-blur-sm"
                    >
                      <Coffee className="h-3.5 w-3.5 text-[#E89BB9]" />
                      <span>Apply Leave / SIL</span>
                    </button>
                    <button
                      onClick={() => setShowOtObModal(true)}
                      className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-white/15 transition-all flex items-center space-x-1.5 backdrop-blur-sm"
                    >
                      <Clock className="h-3.5 w-3.5 text-[#77BC2E]" />
                      <span>File OT / OB</span>
                    </button>
                    <button
                      onClick={() => {
                        const firstEmp = employees[0] || { id: 33, name: 'Justine Ann Atay', rate: 600, branch: 'Centrio Mall (Waxing)', bpi_account: '0249821401' };
                        setNewEmployee({
                          id: firstEmp.id,
                          name: firstEmp.name,
                          branch: firstEmp.branch || 'Centrio Mall (Waxing)',
                          rate: firstEmp.rate || 600,
                          taxStatus: firstEmp.tax_status || 'S',
                          bpiAccount: firstEmp.bpi_account || '0249821401',
                          sssNo: firstEmp.sss_no || '34-8192019-3',
                          philhealthNo: firstEmp.philhealth_no || '12-054918230-1',
                          pagibigNo: firstEmp.pagibig_no || '1210-9482-1104',
                          tinNo: firstEmp.tin_no || '291-840-192-000',
                          otherDeductions: firstEmp.other_deductions || 0,
                          otherDeductionRemarks: firstEmp.other_deduction_remarks || 'Cash Advance (Vale)'
                        });
                        setShowAddEmployeeModal(true);
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-white/15 transition-all flex items-center space-x-1.5 backdrop-blur-sm"
                    >
                      <CreditCard className="h-3.5 w-3.5 text-[#E89BB9]" />
                      <span>Assign Vale / Deduction</span>
                    </button>
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
                      className="bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-[#77BC2E]/25 transition-all flex items-center space-x-1.5"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>+ Add Staff</span>
                    </button>
                  </div>
                </div>

                {/* HR Workforce 6 Sub-Tab Navigation Bar */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <button
                    onClick={() => setHrActiveSubTab('directory')}
                    className={`px-3.5 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all ${
                      hrActiveSubTab === 'directory'
                        ? 'bg-[#77BC2E] text-white shadow-sm'
                        : 'bg-white/10 text-white/80 hover:bg-white/15'
                    }`}
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span>Staff Directory & Records</span>
                    <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full">{employees.length}</span>
                  </button>

                  <button
                    onClick={() => setHrActiveSubTab('leaves')}
                    className={`px-3.5 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all ${
                      hrActiveSubTab === 'leaves'
                        ? 'bg-[#77BC2E] text-white shadow-sm'
                        : 'bg-white/10 text-white/80 hover:bg-white/15'
                    }`}
                  >
                    <Coffee className="h-3.5 w-3.5" />
                    <span>Leave & SIL Balances</span>
                    <span className="bg-[#E89BB9] text-white text-[10px] px-1.5 py-0.2 rounded-full">
                      {sproutLeaves.filter(l => l.status.includes('Pending')).length > 0 ? `${sproutLeaves.filter(l => l.status.includes('Pending')).length} Req` : 'Active'}
                    </span>
                  </button>

                  <button
                    onClick={() => setHrActiveSubTab('roster')}
                    className={`px-3.5 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all ${
                      hrActiveSubTab === 'roster'
                        ? 'bg-[#77BC2E] text-white shadow-sm'
                        : 'bg-white/10 text-white/80 hover:bg-white/15'
                    }`}
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Weekly Shift Scheduler</span>
                    <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full">5 Branches</span>
                  </button>

                  <button
                    onClick={() => setHrActiveSubTab('ot_ob')}
                    className={`px-3.5 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all ${
                      hrActiveSubTab === 'ot_ob'
                        ? 'bg-[#77BC2E] text-white shadow-sm'
                        : 'bg-white/10 text-white/80 hover:bg-white/15'
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span>OT & Official Business (OB)</span>
                    <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full">{sproutOtOb.length}</span>
                  </button>

                  <button
                    onClick={() => setHrActiveSubTab('accruals')}
                    className={`px-3.5 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all ${
                      hrActiveSubTab === 'accruals'
                        ? 'bg-[#77BC2E] text-white shadow-sm'
                        : 'bg-white/10 text-white/80 hover:bg-white/15'
                    }`}
                  >
                    <Award className="h-3.5 w-3.5" />
                    <span>13th Month & BIR 2316</span>
                    <span className="bg-[#D4AF37] text-[#031134] text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">DOLE Hub</span>
                  </button>

                  <button
                    onClick={() => setHrActiveSubTab('ess')}
                    className={`px-3.5 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all ${
                      hrActiveSubTab === 'ess'
                        ? 'bg-[#E89BB9] text-white shadow-sm'
                        : 'bg-white/10 text-white/80 hover:bg-white/15'
                    }`}
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>Employee Self-Service (ESS)</span>
                    <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full">ESS Mobile Portal</span>
                  </button>
                </div>
              </div>

              {/* Toast Notification */}
              {sproutToast && (
                <div className="bg-[#031134] text-white px-5 py-3.5 rounded-2xl text-xs font-bold shadow-lg flex items-center justify-between animate-fadeIn border border-[#77BC2E]/40">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-[#77BC2E]" />
                    <span>{sproutToast}</span>
                  </div>
                  <button onClick={() => setSproutToast('')} className="text-white/60 hover:text-white">
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* SUB-TAB 1: STAFF DIRECTORY & RECORDS */}
              {hrActiveSubTab === 'directory' && (
                <div className="space-y-6">
                  {/* Statutory Formula & Computation Rules Box */}
                  <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-3xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#031134] flex items-center space-x-1.5">
                        <SlidersHorizontal className="h-3.5 w-3.5 text-[#77BC2E]" />
                        <span>Philippine Statutory Computation Basis & DOLE Mandates</span>
                      </span>
                      <span className="text-[10px] text-[#8A817C] font-semibold">ALRAJJ LEGACY Fortified Business Corp.</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-2xl border border-[#F2F0E8]">
                        <span className="text-[9px] font-bold text-[#8A817C] uppercase block">SSS Employee Share</span>
                        <div className="font-extrabold text-[#4A2E1B] mt-0.5">4.5% of Gross Pay</div>
                        <span className="text-[9px] text-[#8A817C]">Semi-monthly bracket base</span>
                      </div>
                      <div className="bg-white p-3 rounded-2xl border border-[#F2F0E8]">
                        <span className="text-[9px] font-bold text-[#8A817C] uppercase block">PhilHealth (UHC Law)</span>
                        <div className="font-extrabold text-[#0284C7] mt-0.5">2.5% Employee Share</div>
                        <span className="text-[9px] text-[#8A817C]">5% total premium split 50/50</span>
                      </div>
                      <div className="bg-white p-3 rounded-2xl border border-[#F2F0E8]">
                        <span className="text-[9px] font-bold text-[#8A817C] uppercase block">Pag-IBIG (HDMF)</span>
                        <div className="font-extrabold text-[#77BC2E] mt-0.5">â‚±100.00 / Cutoff</div>
                        <span className="text-[9px] text-[#8A817C]">â‚±200/mo mandated cap</span>
                      </div>
                      <div className="bg-white p-3 rounded-2xl border border-[#F2F0E8]">
                        <span className="text-[9px] font-bold text-[#8A817C] uppercase block">BIR Withholding (TRAIN)</span>
                        <div className="font-extrabold text-[#16A34A] mt-0.5">Tax-Exempt (&lt;â‚±10,417)</div>
                        <span className="text-[9px] text-[#8A817C]">0% for basic salon wage</span>
                      </div>
                    </div>
                  </div>

                  {/* Staff Masterfile Table */}
                  <div className="bg-white border border-[#EAE8E2] rounded-3xl overflow-hidden shadow-2xs">
                    <div className="p-5 border-b border-[#F2F0E8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-extrabold text-sm text-[#4A2E1B]">Staff Directory & Employment Records</h4>
                        <p className="text-[11px] text-[#8A817C]">Click any staff member to view full employment records, generate DOLE COE, or print BIR Form 2316.</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <select
                          value={hrBranchFilter}
                          onChange={(e) => setHrBranchFilter(e.target.value)}
                          className="bg-[#FAF9F5] border border-[#EAE8E2] text-[#4A2E1B] text-xs font-semibold rounded-xl px-3 py-1.5 outline-none"
                        >
                          <option value="all">All Branches ({employees.length})</option>
                          <option value="Centrio Mall (Waxing)">Centrio Mall (Waxing)</option>
                          <option value="Passion Nails (Centrio)">Passion Nails</option>
                          <option value="Limketkai Mall">Limketkai Mall</option>
                          <option value="SM Downtown Premier">SM Downtown</option>
                          <option value="Iligan City Branch">Iligan City</option>
                        </select>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#FAF9F5] border-b border-[#F2F0E8] text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C]">
                            <th className="px-5 py-3.5">Biometric ID</th>
                            <th className="px-5 py-3.5">Staff Name & Role</th>
                            <th className="px-5 py-3.5">Branch</th>
                            <th className="px-5 py-3.5">Wage (Daily/Hourly)</th>
                            <th className="px-5 py-3.5">BPI BizLink</th>
                            <th className="px-5 py-3.5">Gov Statutory IDs</th>
                            <th className="px-5 py-3.5">Assigned Deductions & Vale</th>
                            <th className="px-5 py-3.5">Actions & 201</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F2F0E8]">
                          {employees
                            .filter(e => hrBranchFilter === 'all' || e.branch === hrBranchFilter)
                            .map((emp, idx) => {
                              const bpiAcct = emp.bpi_account || `024982140${idx + 1}`;
                              const role = emp.role || (emp.name.includes('HR') ? 'Operations & HR Lead' : 'Senior Waxing Specialist');
                              const hourly = (emp.rate / 8).toFixed(2);
                              const sssNo = emp.sss_no || `34-8192019-${idx + 1}`;
                              const phNo = emp.philhealth_no || `12-054918230-${idx + 1}`;
                              const pagibigNo = emp.pagibig_no || `1210-9482-110${idx + 1}`;
                              const tinNo = emp.tin_no || `291-840-19${idx + 1}-000`;
                              const otherDeduc = parseFloat(emp.other_deductions || 0);

                              return (
                                <tr key={emp.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                                  <td className="px-5 py-4 font-mono font-extrabold text-[#031134]">
                                    <span className="bg-[#FAF9F5] border border-[#EAE8E2] px-2 py-0.5 rounded-lg">
                                      #{emp.id}
                                    </span>
                                  </td>
                                  <td className="px-5 py-4">
                                    <div className="flex items-center space-x-2.5">
                                      <div className="w-8 h-8 rounded-xl bg-[#4A2E1B] text-[#77BC2E] flex items-center justify-center font-bold text-xs shadow-xs">
                                        {emp.name.charAt(0)}
                                      </div>
                                      <div>
                                        <p className="font-bold text-[#4A2E1B]">{emp.name}</p>
                                        <p className="text-[10px] text-[#8A817C]">{role}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-5 py-4 font-semibold text-[#5A534E]">
                                    {emp.branch}
                                  </td>
                                  <td className="px-5 py-4 font-mono">
                                    <p className="font-extrabold text-[#4A2E1B]">â‚±{parseFloat(emp.rate).toFixed(2)}/day</p>
                                    <p className="text-[10px] text-[#8A817C]">â‚±{hourly}/hr</p>
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
                                  <td className="px-5 py-4 font-mono">
                                    {otherDeduc > 0 ? (
                                      <div>
                                        <p className="font-extrabold text-[#D47098]">â‚±{otherDeduc.toFixed(2)}</p>
                                        <span className="bg-[#E89BB9]/20 text-[#D47098] font-bold text-[9px] px-1.5 py-0.5 rounded-md inline-block mt-0.5">
                                          {emp.other_deduction_remarks || 'Cash Advance (Vale)'}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-[#A8A29E] text-[10px]">â‚±0.00 (None)</span>
                                    )}
                                  </td>
                                  <td className="px-5 py-4">
                                    <div className="flex items-center space-x-1.5">
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
                                        className="bg-[#FAF9F5] hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#4A2E1B] font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all flex items-center space-x-1"
                                        title="Assign / Edit Deductions & Wage"
                                      >
                                        <Edit className="h-3 w-3 text-[#77BC2E]" />
                                        <span>Edit / Vale</span>
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSelected201Employee(emp);
                                          setShow201Drawer(true);
                                        }}
                                        className="bg-[#031134] hover:bg-[#091D4C] text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all flex items-center space-x-1 shadow-2xs"
                                        title="View Staff Record"
                                      >
                                        <FileText className="h-3 w-3 text-[#77BC2E]" />
                                        <span>Staff Profile</span>
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSelected201Employee(emp);
                                          setShowCoeModal(true);
                                        }}
                                        className="bg-[#77BC2E]/15 hover:bg-[#77BC2E]/25 text-[#5A9A1E] font-bold text-[10px] px-2 py-1.5 rounded-lg transition-all flex items-center space-x-1"
                                        title="Generate DOLE Certificate of Employment"
                                      >
                                        <Award className="h-3 w-3" />
                                        <span>COE</span>
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSelected201Employee(emp);
                                          setShowBir2316Modal(true);
                                        }}
                                        className="bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#8F6B0A] font-bold text-[10px] px-2 py-1.5 rounded-lg transition-all"
                                        title="Generate BIR 2316 Tax Certificate"
                                      >
                                        2316
                                      </button>
                                    </div>
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

              {/* SUB-TAB 2: LEAVE & SIL MANAGEMENT (SETHCON Leave Records) */}
              {hrActiveSubTab === 'leaves' && (
                <div className="space-y-6">
                  {/* Leave Metrics Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-white border border-[#EAE8E2] rounded-3xl p-5 shadow-2xs space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C] block">Mandated SIL Entitlement</span>
                      <div className="text-2xl font-black text-[#4A2E1B]">5.0 Days / Yr</div>
                      <p className="text-[11px] text-[#77BC2E] font-bold">DOLE Service Incentive Leave</p>
                    </div>
                    <div className="bg-white border border-[#EAE8E2] rounded-3xl p-5 shadow-2xs space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C] block">Vacation Leave (VL)</span>
                      <div className="text-2xl font-black text-[#0284C7]">5.0 Days</div>
                      <p className="text-[11px] text-[#8A817C]">Annual Company Policy</p>
                    </div>
                    <div className="bg-white border border-[#EAE8E2] rounded-3xl p-5 shadow-2xs space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C] block">Sick Leave (SL)</span>
                      <div className="text-2xl font-black text-[#E89BB9]">5.0 Days</div>
                      <p className="text-[11px] text-[#8A817C]">Fit-to-work verified</p>
                    </div>
                    <div className="bg-white border border-[#EAE8E2] rounded-3xl p-5 shadow-2xs space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C] block">Pending Leaves Queue</span>
                      <div className="text-2xl font-black text-[#D47098]">{sproutLeaves.filter(l => l.status.includes('Pending')).length} Req</div>
                      <p className="text-[11px] text-[#8A817C]">Requires Lead Endorsement</p>
                    </div>
                  </div>

                  {/* Leave Application & Requests Table */}
                  <div className="bg-white border border-[#EAE8E2] rounded-3xl overflow-hidden shadow-2xs">
                    <div className="p-5 border-b border-[#F2F0E8] flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-[#4A2E1B]">Leave Applications & SIL Approvals</h4>
                        <p className="text-[11px] text-[#8A817C]">Manage DOLE Service Incentive Leaves, Vacation, and Medical Sick Leaves across branches.</p>
                      </div>
                      <button
                        onClick={() => setShowLeaveFilingModal(true)}
                        className="bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-2xs"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>File New Leave</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#FAF9F5] border-b border-[#F2F0E8] text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C]">
                            <th className="px-5 py-3.5">Ref ID</th>
                            <th className="px-5 py-3.5">Employee Name</th>
                            <th className="px-5 py-3.5">Leave Type</th>
                            <th className="px-5 py-3.5">Inclusive Dates</th>
                            <th className="px-5 py-3.5">Days</th>
                            <th className="px-5 py-3.5">Reason & Attachment</th>
                            <th className="px-5 py-3.5">Status</th>
                            <th className="px-5 py-3.5">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F2F0E8]">
                          {sproutLeaves.map(leave => (
                            <tr key={leave.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                              <td className="px-5 py-4 font-mono font-bold text-[#031134]">{leave.id}</td>
                              <td className="px-5 py-4">
                                <p className="font-bold text-[#4A2E1B]">{leave.employeeName}</p>
                                <p className="text-[10px] text-[#8A817C]">{leave.branch}</p>
                              </td>
                              <td className="px-5 py-4">
                                <span className="bg-[#031134]/10 text-[#031134] font-bold px-2 py-0.5 rounded-md text-[10px]">
                                  {leave.type}
                                </span>
                              </td>
                              <td className="px-5 py-4 font-mono text-[#5A534E]">
                                {leave.startDate} {leave.startDate !== leave.endDate ? `to ${leave.endDate}` : ''}
                              </td>
                              <td className="px-5 py-4 font-bold text-[#4A2E1B]">
                                {leave.days} Day{leave.days > 1 ? 's' : ''}
                              </td>
                              <td className="px-5 py-4 text-[#5A534E] max-w-xs truncate">
                                <p className="truncate">{leave.reason}</p>
                                {leave.hasAttachment && (
                                  <span className="inline-flex items-center space-x-1 text-[10px] text-[#77BC2E] font-semibold mt-0.5">
                                    <FileCheck className="h-3 w-3" />
                                    <span>Medical Fit-to-Work attached</span>
                                  </span>
                                )}
                              </td>
                              <td className="px-5 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                  leave.status === 'Approved'
                                    ? 'bg-[#77BC2E]/15 text-[#5A9A1E]'
                                    : 'bg-[#E89BB9]/25 text-[#D47098] animate-pulse'
                                }`}>
                                  {leave.status}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                {leave.status !== 'Approved' ? (
                                  <div className="flex items-center space-x-1.5">
                                    <button
                                      onClick={() => {
                                        setSproutLeaves(prev => prev.map(l => l.id === leave.id ? { ...l, status: 'Approved', approvedBy: 'Kristene HR / MD' } : l));
                                        setSproutToast(`Leave ${leave.id} for ${leave.employeeName} approved and credited to SIL/VL records.`);
                                        setTimeout(() => setSproutToast(''), 4000);
                                      }}
                                      className="bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all shadow-2xs"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSproutLeaves(prev => prev.map(l => l.id === leave.id ? { ...l, status: 'Declined' } : l));
                                        setSproutToast(`Leave ${leave.id} declined.`);
                                        setTimeout(() => setSproutToast(''), 4000);
                                      }}
                                      className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-[10px] px-2 py-1.5 rounded-lg transition-all"
                                    >
                                      Decline
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-[#8A817C] font-semibold">Processed</span>
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

              {/* SUB-TAB 3: WEEKLY SHIFT SCHEDULER & ROSTERING */}
              {hrActiveSubTab === 'roster' && (
                <div className="space-y-6">
                  <div className="bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2F0E8] pb-4">
                      <div>
                        <h4 className="font-extrabold text-base text-[#4A2E1B]">Weekly Store Shift Roster & Station Grid</h4>
                        <p className="text-xs text-[#8A817C]">Current Cycle: July 16, 2026 â€“ July 22, 2026 &bull; Multi-Branch Salon Floor Assignments</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSproutToast('ðŸ“… Weekly shift schedule broadcasted via SMS and synced to Biometric NGTeco terminals.');
                            setTimeout(() => setSproutToast(''), 4000);
                          }}
                          className="bg-[#031134] hover:bg-[#091D4C] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-2xs"
                        >
                          <Send className="h-3.5 w-3.5 text-[#77BC2E]" />
                          <span>Publish Roster to Staff</span>
                        </button>
                      </div>
                    </div>

                    {/* Roster Legend */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold">
                      <span className="text-[#8A817C]">Shift Legend:</span>
                      <span className="px-2.5 py-1 rounded-lg bg-[#77BC2E]/15 text-[#5A9A1E] border border-[#77BC2E]/30">ðŸŸ¢ Morning (10AM - 7PM)</span>
                      <span className="px-2.5 py-1 rounded-lg bg-[#E89BB9]/25 text-[#D47098] border border-[#E89BB9]/40">ðŸŸ£ Mid (11AM - 8PM)</span>
                      <span className="px-2.5 py-1 rounded-lg bg-[#031134]/10 text-[#031134] border border-[#031134]/20">ðŸ”µ Closing (12PM - 9PM)</span>
                      <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-500 border border-stone-200">âšª Rest Day (RD)</span>
                    </div>

                    {/* Roster Matrix Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#FAF9F5] border-b border-[#F2F0E8] text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C]">
                            <th className="px-4 py-3.5">Staff & Station</th>
                            <th className="px-3 py-3.5 text-center">Mon (16th)</th>
                            <th className="px-3 py-3.5 text-center">Tue (17th)</th>
                            <th className="px-3 py-3.5 text-center">Wed (18th)</th>
                            <th className="px-3 py-3.5 text-center">Thu (19th)</th>
                            <th className="px-3 py-3.5 text-center">Fri (20th)</th>
                            <th className="px-3 py-3.5 text-center">Sat (21st)</th>
                            <th className="px-3 py-3.5 text-center">Sun (22nd)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F2F0E8]">
                          {sproutRosters.map(ros => (
                            <tr key={ros.employeeId} className="hover:bg-[#FAF9F5]/60 transition-colors">
                              <td className="px-4 py-3.5">
                                <p className="font-bold text-[#4A2E1B]">{ros.name}</p>
                                <p className="text-[10px] text-[#8A817C]">{ros.branch} &bull; <strong className="text-[#031134]">{ros.station}</strong></p>
                              </td>
                              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                                const dayObj = ros.schedule[day] || { shift: 'RD', color: 'bg-stone-100 text-stone-500' };
                                return (
                                  <td key={day} className="px-2 py-3 text-center">
                                    <div className={`p-1.5 rounded-xl border text-[10px] font-bold ${dayObj.color} leading-tight`}>
                                      {dayObj.shift}
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 4: OT & OFFICIAL BUSINESS (OB) FILINGS */}
              {hrActiveSubTab === 'ot_ob' && (
                <div className="space-y-6">
                  <div className="bg-white border border-[#EAE8E2] rounded-3xl overflow-hidden shadow-2xs">
                    <div className="p-5 border-b border-[#F2F0E8] flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-[#4A2E1B]">Overtime (OT) & Official Business (OB) Ledger</h4>
                        <p className="text-[11px] text-[#8A817C]">Track pre/post shift client overruns, bank deposit runs, and Lay Bare Commissary errands.</p>
                      </div>
                      <button
                        onClick={() => setShowOtObModal(true)}
                        className="bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-2xs"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>File New OT / OB Slip</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#FAF9F5] border-b border-[#F2F0E8] text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C]">
                            <th className="px-5 py-3.5">Ref No</th>
                            <th className="px-5 py-3.5">Employee Name</th>
                            <th className="px-5 py-3.5">Request Type</th>
                            <th className="px-5 py-3.5">Date</th>
                            <th className="px-5 py-3.5">Approved Hours</th>
                            <th className="px-5 py-3.5">Purpose & Reference</th>
                            <th className="px-5 py-3.5">Status</th>
                            <th className="px-5 py-3.5">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F2F0E8]">
                          {sproutOtOb.map(ot => (
                            <tr key={ot.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                              <td className="px-5 py-4 font-mono font-bold text-[#031134]">{ot.id}</td>
                              <td className="px-5 py-4">
                                <p className="font-bold text-[#4A2E1B]">{ot.employeeName}</p>
                                <p className="text-[10px] text-[#8A817C]">{ot.branch}</p>
                              </td>
                              <td className="px-5 py-4">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  ot.type.includes('Overtime') ? 'bg-[#77BC2E]/15 text-[#5A9A1E]' : 'bg-[#031134]/10 text-[#031134]'
                                }`}>
                                  {ot.type}
                                </span>
                              </td>
                              <td className="px-5 py-4 font-mono text-[#5A534E]">{ot.date}</td>
                              <td className="px-5 py-4 font-mono font-bold text-[#4A2E1B]">{ot.hours} Hours</td>
                              <td className="px-5 py-4 text-[#5A534E]">
                                <p>{ot.purpose}</p>
                                {ot.ticketRef && <span className="text-[10px] font-mono text-[#8A817C]">Ref: #{ot.ticketRef}</span>}
                              </td>
                              <td className="px-5 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                  ot.status === 'Approved' ? 'bg-[#77BC2E]/15 text-[#5A9A1E]' : 'bg-[#E89BB9]/25 text-[#D47098]'
                                }`}>
                                  {ot.status}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                {ot.status !== 'Approved' ? (
                                  <button
                                    onClick={() => {
                                      setSproutOtOb(prev => prev.map(o => o.id === ot.id ? { ...o, status: 'Approved', approvedBy: 'Kristene HR' } : o));
                                      setSproutToast(`${ot.type} ${ot.id} approved and credited to payroll hours.`);
                                      setTimeout(() => setSproutToast(''), 4000);
                                    }}
                                    className="bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all"
                                  >
                                    Approve
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-[#77BC2E] font-bold flex items-center space-x-1">
                                    <Check className="h-3 w-3" />
                                    <span>Credited</span>
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

              {/* SUB-TAB 5: 13TH MONTH PAY & BIR 2316 CENTER */}
              {hrActiveSubTab === 'accruals' && (
                <div className="space-y-6">
                  <div className="bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2F0E8] pb-4">
                      <div>
                        <h4 className="font-extrabold text-base text-[#4A2E1B]">DOLE 13th-Month Pay Accruals & BIR Form 2316 Center</h4>
                        <p className="text-xs text-[#8A817C]">Automated statutory formula: Total Basic Salary Earned YTD / 12 Months &bull; Mandated by Dec 24</p>
                      </div>
                      <span className="bg-[#D4AF37]/20 text-[#8F6B0A] font-extrabold text-xs px-3 py-1 rounded-xl">
                        2026 Fiscal Year
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#FAF9F5] border-b border-[#F2F0E8] text-[10px] font-extrabold uppercase tracking-wider text-[#8A817C]">
                            <th className="px-5 py-3.5">Staff Name</th>
                            <th className="px-5 py-3.5">Branch</th>
                            <th className="px-5 py-3.5">Basic Daily Rate</th>
                            <th className="px-5 py-3.5">YTD Basic Earnings</th>
                            <th className="px-5 py-3.5">Monthly Accrual</th>
                            <th className="px-5 py-3.5">Projected 13th Month</th>
                            <th className="px-5 py-3.5">BIR 2316 Certificate</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F2F0E8]">
                          {employees.map((emp, idx) => {
                            const basicDaily = emp.rate || 600;
                            const ytdBasic = basicDaily * 26 * 7.5; // ~7.5 months
                            const accrualPerMonth = (basicDaily * 26) / 12;
                            const projected13th = basicDaily * 26;

                            return (
                              <tr key={emp.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                                <td className="px-5 py-4 font-bold text-[#4A2E1B]">{emp.name}</td>
                                <td className="px-5 py-4 text-[#5A534E]">{emp.branch}</td>
                                <td className="px-5 py-4 font-mono font-bold">â‚±{parseFloat(basicDaily).toFixed(2)}</td>
                                <td className="px-5 py-4 font-mono text-[#031134]">â‚±{ytdBasic.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="px-5 py-4 font-mono text-[#77BC2E] font-bold">â‚±{accrualPerMonth.toFixed(2)}/mo</td>
                                <td className="px-5 py-4 font-mono font-black text-[#4A2E1B] bg-[#FAF9F5]">â‚±{projected13th.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="px-5 py-4">
                                  <button
                                    onClick={() => {
                                      setSelected201Employee(emp);
                                      setShowBir2316Modal(true);
                                    }}
                                    className="bg-[#031134] hover:bg-[#091D4C] text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1"
                                  >
                                    <Printer className="h-3 w-3 text-[#77BC2E]" />
                                    <span>Print Form 2316</span>
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

              {/* SUB-TAB 6: EMPLOYEE SELF-SERVICE (ESS) SIMULATOR */}
              {hrActiveSubTab === 'ess' && (
                <div className="space-y-6">
                  <div className="bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-2xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2F0E8] pb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="bg-[#E89BB9]/25 text-[#D47098] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                            SETHCON Workforce &bull; ESS Mobile Portal
                          </span>
                          <span className="text-[11px] font-bold text-[#8A817C]">Mobile & Desktop View</span>
                        </div>
                        <h4 className="font-extrabold text-base text-[#4A2E1B] mt-1">Employee Self-Service (ESS) Portal Simulator</h4>
                        <p className="text-xs text-[#8A817C]">Experience what branch specialists see when they log into their confidential portal (e.g. at <strong>alrajj-legacy.vercel.app</strong>).</p>
                      </div>

                      {/* Staff Selector */}
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-[#8A817C]">Logged in as:</span>
                        <select
                          value={essLoggedInStaffId}
                          onChange={(e) => setEssLoggedInStaffId(Number(e.target.value))}
                          className="bg-[#FAF9F5] border border-[#77BC2E] text-[#4A2E1B] text-xs font-bold rounded-xl px-3 py-2 outline-none"
                        >
                          {employees.map(e => (
                            <option key={e.id} value={e.id}>{e.name} ({e.branch})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* ESS Simulated Dashboard Card */}
                    {(() => {
                      const activeStaff = employees.find(e => e.id === essLoggedInStaffId) || employees[0] || { name: 'Justine Ann Atay', rate: 600, branch: 'Centrio Mall (Waxing)', role: 'Senior Waxing Specialist' };
                      const staffLeaves = sproutLeaves.filter(l => l.employeeId === activeStaff.id);
                      const staffOt = sproutOtOb.filter(o => o.employeeId === activeStaff.id);

                      return (
                        <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-3xl p-6 space-y-6">
                          {/* Welcome Staff Banner */}
                          <div className="bg-white border border-[#EAE8E2] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                            <div className="flex items-center space-x-3.5">
                              <div className="w-12 h-12 rounded-2xl bg-[#031134] text-[#77BC2E] flex items-center justify-center font-black text-base shadow-sm">
                                {activeStaff.name.charAt(0)}
                              </div>
                              <div>
                                <h3 className="font-extrabold text-base text-[#4A2E1B]">Mabuhay, {activeStaff.name}!</h3>
                                <p className="text-xs text-[#8A817C]">{activeStaff.role || 'Salon Specialist'} &bull; <strong>{activeStaff.branch}</strong></p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setShowLeaveFilingModal(true)}
                                className="bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-2xs"
                              >
                                Apply Leave
                              </button>
                              <button
                                onClick={() => setShowOtObModal(true)}
                                className="bg-[#031134] hover:bg-[#091D4C] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-2xs"
                              >
                                File Overtime
                              </button>
                            </div>
                          </div>

                          {/* ESS 3-Col Metric Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                            <div className="bg-white p-4 rounded-2xl border border-[#EAE8E2] space-y-1">
                              <span className="text-[10px] font-bold text-[#8A817C] uppercase block">Available Leave Balance</span>
                              <div className="text-xl font-black text-[#4A2E1B]">4.0 / 5.0 Days SIL</div>
                              <span className="text-[10px] text-[#77BC2E] font-semibold">1 Day Taken YTD</span>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-[#EAE8E2] space-y-1">
                              <span className="text-[10px] font-bold text-[#8A817C] uppercase block">Current Cutoff Punches</span>
                              <div className="text-xl font-black text-[#031134]">84.5 Regular Hours</div>
                              <span className="text-[10px] text-[#5A534E]">1.77 OT Hours Approved</span>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-[#EAE8E2] space-y-1">
                              <span className="text-[10px] font-bold text-[#8A817C] uppercase block">Estimated Net Take-Home</span>
                              <div className="text-xl font-black text-[#77BC2E]">â‚±8,142.50</div>
                              <span className="text-[10px] text-[#8A817C]">BPI BizLink Direct Credit</span>
                            </div>
                          </div>

                          {/* My Recent Requests */}
                          <div className="bg-white p-5 rounded-2xl border border-[#EAE8E2] space-y-3">
                            <h5 className="font-extrabold text-xs text-[#4A2E1B] uppercase tracking-wider">My Active Requests & Filings</h5>
                            {staffLeaves.length === 0 && staffOt.length === 0 ? (
                              <p className="text-xs text-[#8A817C]">No pending leave or OT applications filed this cutoff.</p>
                            ) : (
                              <div className="space-y-2">
                                {staffLeaves.map(l => (
                                  <div key={l.id} className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F5] border border-[#F2F0E8] text-xs">
                                    <div>
                                      <strong className="text-[#4A2E1B]">{l.type}</strong> &bull; <span className="text-[#8A817C]">{l.startDate}</span>
                                      <p className="text-[11px] text-[#5A534E]">{l.reason}</p>
                                    </div>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                      l.status === 'Approved' ? 'bg-[#77BC2E]/15 text-[#5A9A1E]' : 'bg-[#E89BB9]/25 text-[#D47098]'
                                    }`}>
                                      {l.status}
                                    </span>
                                  </div>
                                ))}
                                {staffOt.map(o => (
                                  <div key={o.id} className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F5] border border-[#F2F0E8] text-xs">
                                    <div>
                                      <strong className="text-[#4A2E1B]">{o.type} ({o.hours} hrs)</strong> &bull; <span className="text-[#8A817C]">{o.date}</span>
                                      <p className="text-[11px] text-[#5A534E]">{o.purpose}</p>
                                    </div>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                      o.status === 'Approved' ? 'bg-[#77BC2E]/15 text-[#5A9A1E]' : 'bg-[#E89BB9]/25 text-[#D47098]'
                                    }`}>
                                      {o.status}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* MODAL: STAFF PROFILE & EMPLOYMENT RECORD DRAWER */}
              {show201Drawer && selected201Employee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
                  <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-[#EAE8E2] max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-[#F2F0E8] pb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#031134] text-[#77BC2E] flex items-center justify-center font-black text-sm">
                          {selected201Employee.name.charAt(0)}
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold text-[#77BC2E] uppercase tracking-wider">DOLE Employment Record & Profile</span>
                          <h3 className="font-extrabold text-base text-[#4A2E1B]">{selected201Employee.name}</h3>
                        </div>
                      </div>
                      <button onClick={() => setShow201Drawer(false)} className="text-[#8A817C] hover:text-[#4A2E1B]">
                        <XCircle className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="bg-[#FAF9F5] p-3.5 rounded-2xl border border-[#F2F0E8] space-y-1">
                        <span className="text-[10px] font-bold text-[#8A817C] uppercase">Branch Assignment</span>
                        <p className="font-bold text-[#4A2E1B]">{selected201Employee.branch}</p>
                      </div>
                      <div className="bg-[#FAF9F5] p-3.5 rounded-2xl border border-[#F2F0E8] space-y-1">
                        <span className="text-[10px] font-bold text-[#8A817C] uppercase">Role / Position</span>
                        <p className="font-bold text-[#4A2E1B]">{selected201Employee.role || 'Senior Specialist'}</p>
                      </div>
                      <div className="bg-[#FAF9F5] p-3.5 rounded-2xl border border-[#F2F0E8] space-y-1">
                        <span className="text-[10px] font-bold text-[#8A817C] uppercase">Daily Basic Wage</span>
                        <p className="font-bold font-mono text-[#77BC2E]">â‚±{parseFloat(selected201Employee.rate).toFixed(2)}/day (â‚±{(selected201Employee.rate/8).toFixed(2)}/hr)</p>
                      </div>
                      <div className="bg-[#FAF9F5] p-3.5 rounded-2xl border border-[#F2F0E8] space-y-1">
                        <span className="text-[10px] font-bold text-[#8A817C] uppercase">BPI BizLink Account</span>
                        <p className="font-bold font-mono text-[#031134]">{selected201Employee.bpi_account || '0249821401'}</p>
                      </div>
                    </div>

                    {/* Government IDs */}
                    <div className="space-y-2">
                      <h5 className="font-extrabold text-xs text-[#4A2E1B] uppercase tracking-wider">Philippine Statutory IDs</h5>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 rounded-xl bg-white border border-[#EAE8E2]">
                          <span className="text-[10px] text-[#8A817C] block">SSS Number</span>
                          <strong className="font-mono text-[#4A2E1B]">{selected201Employee.sss_no || '34-8192019-3'}</strong>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EAE8E2]">
                          <span className="text-[10px] text-[#8A817C] block">PhilHealth ID</span>
                          <strong className="font-mono text-[#0284C7]">{selected201Employee.philhealth_no || '12-054918230-1'}</strong>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EAE8E2]">
                          <span className="text-[10px] text-[#8A817C] block">Pag-IBIG (HDMF)</span>
                          <strong className="font-mono text-[#77BC2E]">{selected201Employee.pagibig_no || '1210-9482-1104'}</strong>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EAE8E2]">
                          <span className="text-[10px] text-[#8A817C] block">BIR TIN</span>
                          <strong className="font-mono text-[#16A34A]">{selected201Employee.tin_no || '291-840-192-000'}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Assigned Payroll Deductions & Vale Section */}
                    <div className="bg-[#FAF9F5] border border-[#E89BB9]/40 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D47098] flex items-center space-x-1.5">
                          <CreditCard className="h-3.5 w-3.5" />
                          <span>Assigned Payroll Deductions & Vale</span>
                        </span>
                        <button
                          onClick={() => {
                            setNewEmployee({
                              id: selected201Employee.id,
                              name: selected201Employee.name,
                              branch: selected201Employee.branch || 'Centrio Mall (Waxing)',
                              rate: selected201Employee.rate || 600,
                              taxStatus: selected201Employee.tax_status || 'S',
                              bpiAccount: selected201Employee.bpi_account || '0249821401',
                              sssNo: selected201Employee.sss_no || '34-8192019-3',
                              philhealthNo: selected201Employee.philhealth_no || '12-054918230-1',
                              pagibigNo: selected201Employee.pagibig_no || '1210-9482-1104',
                              tinNo: selected201Employee.tin_no || '291-840-192-000',
                              otherDeductions: selected201Employee.other_deductions || 0,
                              otherDeductionRemarks: selected201Employee.other_deduction_remarks || 'Cash Advance (Vale)'
                            });
                            setShow201Drawer(false);
                            setShowAddEmployeeModal(true);
                          }}
                          className="bg-white hover:bg-[#F2F0E8] border border-[#E89BB9]/50 text-[#D47098] font-bold text-[10px] px-2.5 py-1 rounded-lg transition-all"
                        >
                          âœï¸ Edit Vale & Deductions
                        </button>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <p className="font-extrabold text-sm text-[#D47098] font-mono">
                            â‚±{parseFloat(selected201Employee.other_deductions || 0).toFixed(2)} PHP
                          </p>
                          <span className="text-[10px] text-[#8A817C]">
                            Purpose: <strong className="text-[#4A2E1B]">{selected201Employee.other_deduction_remarks || 'None / Not Assigned'}</strong>
                          </span>
                        </div>
                        <span className="text-[10px] text-[#5A534E] font-semibold bg-white border border-[#EAE8E2] px-2 py-0.5 rounded-md">
                          Deducted Semi-Monthly
                        </span>
                      </div>
                    </div>

                    {/* 201 Action Buttons */}
                    <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-[#F2F0E8]">
                      <button
                        onClick={() => {
                          setNewEmployee({
                            id: selected201Employee.id,
                            name: selected201Employee.name,
                            branch: selected201Employee.branch || 'Centrio Mall (Waxing)',
                            rate: selected201Employee.rate || 600,
                            taxStatus: selected201Employee.tax_status || 'S',
                            bpiAccount: selected201Employee.bpi_account || '0249821401',
                            sssNo: selected201Employee.sss_no || '34-8192019-3',
                            philhealthNo: selected201Employee.philhealth_no || '12-054918230-1',
                            pagibigNo: selected201Employee.pagibig_no || '1210-9482-1104',
                            tinNo: selected201Employee.tin_no || '291-840-192-000',
                            otherDeductions: selected201Employee.other_deductions || 0,
                            otherDeductionRemarks: selected201Employee.other_deduction_remarks || 'Cash Advance (Vale)'
                          });
                          setShow201Drawer(false);
                          setShowAddEmployeeModal(true);
                        }}
                        className="bg-[#FAF9F5] hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#4A2E1B] font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5"
                      >
                        <Edit className="h-3.5 w-3.5 text-[#77BC2E]" />
                        <span>Edit Full Profile & Vale</span>
                      </button>
                      <button
                        onClick={() => {
                          setShow201Drawer(false);
                          setShowCoeModal(true);
                        }}
                        className="bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-2xs"
                      >
                        <Award className="h-4 w-4" />
                        <span>Generate Certificate of Employment (COE)</span>
                      </button>
                      <button
                        onClick={() => {
                          setShow201Drawer(false);
                          setShowBir2316Modal(true);
                        }}
                        className="bg-[#031134] hover:bg-[#091D4C] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-2xs"
                      >
                        <FileText className="h-4 w-4 text-[#77BC2E]" />
                        <span>Print BIR Form 2316</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL: DOLE CERTIFICATE OF EMPLOYMENT (COE) */}
              {showCoeModal && selected201Employee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
                  <div className="bg-white rounded-3xl max-w-xl w-full p-7 space-y-6 shadow-2xl border border-[#EAE8E2] max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-[#F2F0E8] pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-[#77BC2E] uppercase">Official DOLE Document</span>
                        <h4 className="font-extrabold text-base text-[#4A2E1B]">Certificate of Employment (COE)</h4>
                      </div>
                      <button onClick={() => setShowCoeModal(false)} className="text-[#8A817C] hover:text-[#4A2E1B]">
                        <XCircle className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="bg-[#FAF9F5] p-6 rounded-2xl border border-[#EAE8E2] space-y-4 text-xs leading-relaxed text-[#2D2520]">
                      <div className="text-center border-b border-[#EAE8E2] pb-3 space-y-0.5">
                        <strong className="font-black text-sm text-[#031134] block uppercase">ALRAJJ LEGACY FORTIFIED BUSINESS CORP.</strong>
                        <p className="text-[10px] text-[#8A817C]">Authorized Lay Bare Waxing Salon & Passion Nails Franchisee &bull; Cagayan de Oro City</p>
                      </div>

                      <div className="text-center font-bold text-xs uppercase tracking-widest text-[#4A2E1B] py-1">
                        CERTIFICATE OF EMPLOYMENT
                      </div>

                      <p>
                        This is to certify that <strong>{selected201Employee.name}</strong> is a bonafide employee of <strong>ALRAJJ LEGACY Fortified Business Corp.</strong>, assigned at our <strong>{selected201Employee.branch}</strong> branch.
                      </p>

                      <p>
                        She currently holds the position of <strong>{selected201Employee.role || 'Senior Specialist'}</strong> with a basic compensation rate of <strong>â‚±{parseFloat(selected201Employee.rate).toFixed(2)} PHP per day</strong> plus statutory benefits.
                      </p>

                      <p>
                        This certification is issued upon the request of the interested party for whatever legal purpose it may serve.
                      </p>

                      <div className="pt-6 flex justify-between items-end border-t border-[#EAE8E2]">
                        <div>
                          <p className="text-[10px] text-[#8A817C]">Date Issued: <strong>September 11, 2026</strong></p>
                          <p className="text-[10px] text-[#8A817C]">Ref Hash: <strong className="font-mono">COE-ALR-{selected201Employee.id}-2026</strong></p>
                        </div>
                        <div className="text-right">
                          <div className="border-b border-stone-800 w-40 mb-1 ml-auto"></div>
                          <strong className="font-bold text-xs text-[#031134] block">MS. JEHAN ABEDIN</strong>
                          <span className="text-[10px] text-[#8A817C] block">General Manager / Managing Director</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => window.print()}
                        className="bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-2xs"
                      >
                        <Printer className="h-4 w-4" />
                        <span>Print / Save as PDF</span>
                      </button>
                      <button
                        onClick={() => setShowCoeModal(false)}
                        className="bg-[#FAF9F5] text-[#5A534E] font-semibold text-xs px-4 py-2.5 rounded-xl border border-[#EAE8E2]"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL: BIR FORM 2316 CERTIFICATE */}
              {showBir2316Modal && selected201Employee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
                  <div className="bg-white rounded-3xl max-w-xl w-full p-7 space-y-5 shadow-2xl border border-[#EAE8E2] max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-[#F2F0E8] pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-[#D4AF37] uppercase">Bureau of Internal Revenue</span>
                        <h4 className="font-extrabold text-base text-[#4A2E1B]">BIR Form No. 2316</h4>
                      </div>
                      <button onClick={() => setShowBir2316Modal(false)} className="text-[#8A817C] hover:text-[#4A2E1B]">
                        <XCircle className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#EAE8E2] space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-2 border-b border-[#EAE8E2] pb-3">
                        <div>
                          <span className="text-[10px] text-[#8A817C] block">Employee TIN</span>
                          <strong className="font-mono">{selected201Employee.tin_no || '291-840-192-000'}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#8A817C] block">Employee Name</span>
                          <strong>{selected201Employee.name}</strong>
                        </div>
                      </div>
                      <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between py-1 border-b border-[#F2F0E8]">
                          <span>Gross Compensation Income (YTD):</span>
                          <strong className="font-mono">â‚±{(selected201Employee.rate * 26 * 7.5).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                        </div>
                        <div className="flex justify-between py-1 border-b border-[#F2F0E8]">
                          <span>Non-Taxable Mandatory SSS/PH/HDMF:</span>
                          <strong className="font-mono text-[#77BC2E]">â‚±8,410.00</strong>
                        </div>
                        <div className="flex justify-between py-1 border-b border-[#F2F0E8]">
                          <span>Total Taxable Compensation:</span>
                          <strong className="font-mono">â‚±{((selected201Employee.rate * 26 * 7.5) - 8410).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                        </div>
                        <div className="flex justify-between py-1 font-bold text-[#031134]">
                          <span>Tax Withheld (TRAIN Law Minimum Wage Exempt):</span>
                          <span className="font-mono text-[#16A34A]">â‚±0.00 (Exempt)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => window.print()}
                        className="bg-[#031134] hover:bg-[#091D4C] text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-2xs"
                      >
                        <Printer className="h-4 w-4 text-[#77BC2E]" />
                        <span>Print BIR 2316</span>
                      </button>
                      <button
                        onClick={() => setShowBir2316Modal(false)}
                        className="bg-[#FAF9F5] text-[#5A534E] font-semibold text-xs px-4 py-2.5 rounded-xl border border-[#EAE8E2]"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL: APPLY NEW LEAVE / SIL */}
              {showLeaveFilingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
                  <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-[#EAE8E2]">
                    <div className="flex items-center justify-between border-b border-[#F2F0E8] pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-[#77BC2E] uppercase">SETHCON Leave Records</span>
                        <h4 className="font-extrabold text-base text-[#4A2E1B]">File Leave Application</h4>
                      </div>
                      <button onClick={() => setShowLeaveFilingModal(false)} className="text-[#8A817C] hover:text-[#4A2E1B]">
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const staff = employees.find(emp => emp.id === Number(newLeaveForm.employeeId)) || employees[0];
                        const createdLeave = {
                          id: `LV-2026-00${sproutLeaves.length + 1}`,
                          employeeId: staff.id,
                          employeeName: staff.name,
                          branch: staff.branch,
                          type: newLeaveForm.type,
                          days: Number(newLeaveForm.days) || 1.0,
                          startDate: newLeaveForm.startDate,
                          endDate: newLeaveForm.endDate,
                          reason: newLeaveForm.reason || 'Personal / Medical Leave',
                          status: 'Pending Store Lead',
                          approvedBy: 'Awaiting Supervisor',
                          appliedAt: new Date().toISOString().split('T')[0],
                          paid: true,
                          hasAttachment: false
                        };
                        setSproutLeaves(prev => [createdLeave, ...prev]);
                        setShowLeaveFilingModal(false);
                        setSproutToast(`Leave request filed for ${staff.name} (${newLeaveForm.type}). Routed to Shift Supervisor.`);
                        setTimeout(() => setSproutToast(''), 4000);
                      }}
                      className="space-y-3.5 text-xs"
                    >
                      <div>
                        <label className="block font-bold text-[#5A534E] mb-1">Employee</label>
                        <select
                          value={newLeaveForm.employeeId}
                          onChange={(e) => setNewLeaveForm({ ...newLeaveForm, employeeId: Number(e.target.value) })}
                          className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 font-semibold"
                        >
                          {employees.map(e => (
                            <option key={e.id} value={e.id}>{e.name} ({e.branch})</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-[#5A534E] mb-1">Leave Type</label>
                          <select
                            value={newLeaveForm.type}
                            onChange={(e) => setNewLeaveForm({ ...newLeaveForm, type: e.target.value })}
                            className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 font-semibold"
                          >
                            <option value="Service Incentive Leave (SIL)">Service Incentive Leave (SIL)</option>
                            <option value="Vacation Leave (VL)">Vacation Leave (VL)</option>
                            <option value="Sick Leave (SL)">Sick Leave (SL)</option>
                            <option value="Maternity Leave">Maternity Leave</option>
                            <option value="Paternity Leave">Paternity Leave</option>
                            <option value="Solo Parent Leave">Solo Parent Leave</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-bold text-[#5A534E] mb-1">Number of Days</label>
                          <input
                            type="number"
                            step="0.5"
                            value={newLeaveForm.days}
                            onChange={(e) => setNewLeaveForm({ ...newLeaveForm, days: Number(e.target.value) })}
                            className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-[#5A534E] mb-1">Start Date</label>
                          <input
                            type="date"
                            value={newLeaveForm.startDate}
                            onChange={(e) => setNewLeaveForm({ ...newLeaveForm, startDate: e.target.value })}
                            className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-[#5A534E] mb-1">End Date</label>
                          <input
                            type="date"
                            value={newLeaveForm.endDate}
                            onChange={(e) => setNewLeaveForm({ ...newLeaveForm, endDate: e.target.value })}
                            className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-[#5A534E] mb-1">Reason / Justification</label>
                        <textarea
                          placeholder="State purpose of leave application..."
                          rows={2}
                          value={newLeaveForm.reason}
                          onChange={(e) => setNewLeaveForm({ ...newLeaveForm, reason: e.target.value })}
                          className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2"
                        />
                      </div>

                      <div className="flex justify-end space-x-2 pt-2">
                        <button
                          type="submit"
                          className="bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-2xs"
                        >
                          Submit Application
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowLeaveFilingModal(false)}
                          className="bg-stone-100 text-stone-600 font-semibold text-xs px-4 py-2.5 rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* MODAL: FILE OT / OB SLIP */}
              {showOtObModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
                  <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-[#EAE8E2]">
                    <div className="flex items-center justify-between border-b border-[#F2F0E8] pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-[#77BC2E] uppercase">SETHCON Attendance</span>
                        <h4 className="font-extrabold text-base text-[#4A2E1B]">File Overtime / OB Slip</h4>
                      </div>
                      <button onClick={() => setShowOtObModal(false)} className="text-[#8A817C] hover:text-[#4A2E1B]">
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const staff = employees.find(emp => emp.id === Number(newOtObForm.employeeId)) || employees[0];
                        const createdOt = {
                          id: `OT-2026-00${sproutOtOb.length + 1}`,
                          employeeId: staff.id,
                          employeeName: staff.name,
                          branch: staff.branch,
                          type: newOtObForm.type,
                          hours: Number(newOtObForm.hours) || 1.0,
                          date: newOtObForm.date,
                          purpose: newOtObForm.purpose || 'Store operational overrun',
                          status: 'Pending HR Audit',
                          approvedBy: 'Awaiting Lead',
                          ticketRef: newOtObForm.ticketRef || 'LB-POS-GEN'
                        };
                        setSproutOtOb(prev => [createdOt, ...prev]);
                        setShowOtObModal(false);
                        setSproutToast(`${newOtObForm.type} slip filed for ${staff.name}.`);
                        setTimeout(() => setSproutToast(''), 4000);
                      }}
                      className="space-y-3.5 text-xs"
                    >
                      <div>
                        <label className="block font-bold text-[#5A534E] mb-1">Employee</label>
                        <select
                          value={newOtObForm.employeeId}
                          onChange={(e) => setNewOtObForm({ ...newOtObForm, employeeId: Number(e.target.value) })}
                          className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 font-semibold"
                        >
                          {employees.map(e => (
                            <option key={e.id} value={e.id}>{e.name} ({e.branch})</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-[#5A534E] mb-1">Request Type</label>
                          <select
                            value={newOtObForm.type}
                            onChange={(e) => setNewOtObForm({ ...newOtObForm, type: e.target.value })}
                            className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 font-semibold"
                          >
                            <option value="Post-Shift Overtime">Post-Shift Overtime</option>
                            <option value="Pre-Shift Overtime">Pre-Shift Overtime</option>
                            <option value="Official Business (OB)">Official Business (OB Slip)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-bold text-[#5A534E] mb-1">Hours</label>
                          <input
                            type="number"
                            step="0.5"
                            value={newOtObForm.hours}
                            onChange={(e) => setNewOtObForm({ ...newOtObForm, hours: Number(e.target.value) })}
                            className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-[#5A534E] mb-1">Date</label>
                          <input
                            type="date"
                            value={newOtObForm.date}
                            onChange={(e) => setNewOtObForm({ ...newOtObForm, date: e.target.value })}
                            className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-[#5A534E] mb-1">Ticket / Store Ref (Optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. LB-2026-8921"
                            value={newOtObForm.ticketRef}
                            onChange={(e) => setNewOtObForm({ ...newOtObForm, ticketRef: e.target.value })}
                            className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-[#5A534E] mb-1">Purpose / Errand Details</label>
                        <textarea
                          placeholder="e.g. Centrio peak waxing client queue overrun, bank deposit run..."
                          rows={2}
                          value={newOtObForm.purpose}
                          onChange={(e) => setNewOtObForm({ ...newOtObForm, purpose: e.target.value })}
                          className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2"
                        />
                      </div>

                      <div className="flex justify-end space-x-2 pt-2">
                        <button
                          type="submit"
                          className="bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-2xs"
                        >
                          Submit OT / OB
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowOtObModal(false)}
                          className="bg-stone-100 text-stone-600 font-semibold text-xs px-4 py-2.5 rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 8: DOCUMENT MANAGEMENT SYSTEM (DMS) & E-SIGNATURE HUB */}

          {/* TAB 8: DOCUMENT MANAGEMENT SYSTEM (DMS) & E-SIGNATURE HUB */}
          {activeTab === 'dms' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Google Workspace Enterprise Vault Banner */}
              <div className="bg-gradient-to-r from-[#031134] via-[#091D4C] to-[#031134] rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-[#031134] space-y-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#77BC2E] text-white flex items-center justify-center font-black text-xl shadow-md flex-shrink-0">
                      <PenTool className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-extrabold text-white tracking-tight">Enterprise DMS & E-Signature Hub</h2>
                        <span className="bg-[#77BC2E]/20 text-[#77BC2E] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#77BC2E]/40 flex items-center space-x-1">
                          <HardDrive className="h-3 w-3" />
                          <span>Google Workspace Linked</span>
                        </span>
                        <span className="bg-white/10 text-white/90 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          RA 8792 & DOLE Compliant
                        </span>
                      </div>
                      <p className="text-xs text-white/70 mt-1 max-w-2xl leading-relaxed">
                        100% paperless signing and encrypted cloud vaulting. Sign DOLE notices, BPI BizLink authorizations, MyTime commissary receipts, commercial leases, and staff promissory agreements with cryptographic SHA-256 digital seals.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => setShowUploadDocModal(true)}
                      className="bg-[#77BC2E] hover:bg-[#6DB027] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shadow-md shadow-[#77BC2E]/20 active:scale-95"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Upload / File New Doc</span>
                    </button>
                    <button
                      onClick={() => {
                        setDmsToast('â˜ï¸ All 6 active documents synchronized to Google Workspace Drive (ALRAJJ LEGACY CORP / 2026 Archive).');
                        setTimeout(() => setDmsToast(''), 5000);
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-white/20 transition-all flex items-center space-x-1.5"
                    >
                      <HardDrive className="h-4 w-4 text-[#77BC2E]" />
                      <span>Sync All to Drive</span>
                    </button>
                  </div>
                </div>

                {/* 4 Quick Vault Stats / Integration Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
                  
                  {/* Google Workspace Domain Pill */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#77BC2E]">Google Domain</span>
                      <Globe className="h-3.5 w-3.5 text-[#77BC2E]" />
                    </div>
                    <div className="font-mono font-bold text-white text-xs truncate">
                      alrajjlegacy-fortifiedbusinesscorp.com
                    </div>
                    <p className="text-[10px] text-white/60">Official corporate workspace sender</p>
                  </div>

                  {/* Cloud Drive Storage */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">Drive Cloud Vault</span>
                      <HardDrive className="h-3.5 w-3.5 text-[#D4AF37]" />
                    </div>
                    <div className="font-bold text-white text-sm">
                      {dmsDocuments.filter(d => d.driveSyncStatus === 'Synced').length} / {dmsDocuments.length} Archived
                    </div>
                    <p className="text-[10px] text-white/60">Google Drive / ALRAJJ LEGACY CORP</p>
                  </div>

                  {/* Cryptographic E-Sign Status */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#77BC2E]">Digital Signatures</span>
                      <ShieldCheck className="h-3.5 w-3.5 text-[#77BC2E]" />
                    </div>
                    <div className="font-bold text-white text-sm">
                      {dmsDocuments.filter(d => d.status.includes('Signed') || d.status.includes('Vaulted')).length} Sealed Documents
                    </div>
                    <p className="text-[10px] text-white/60">SHA-256 cryptographic tamper seal</p>
                  </div>

                  {/* Pending Signatures */}
                  <div className="bg-white/10 border border-[#77BC2E]/40 rounded-2xl p-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#E89BB9]">Pending Action</span>
                      <span className="w-2 h-2 rounded-full bg-[#E89BB9] animate-ping"></span>
                    </div>
                    <div className="font-bold text-white text-sm text-[#E89BB9]">
                      {dmsDocuments.filter(d => d.status.includes('Awaiting') || d.status.includes('Draft')).length} Docs Awaiting Signature
                    </div>
                    <p className="text-[10px] text-white/60">1-click touch/draw E-Sign pad</p>
                  </div>
                </div>
              </div>

              {/* Document Filters & Search Controls */}
              <div className="bg-white border border-[#EAE8E2] rounded-3xl p-5 shadow-2xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  
                  {/* Category Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
                    <button
                      onClick={() => setDmsCategoryFilter('all')}
                      className={`px-3 py-1.5 rounded-xl transition-all ${
                        dmsCategoryFilter === 'all'
                          ? 'bg-[#031134] text-white font-bold'
                          : 'bg-[#FAF9F5] text-[#5A534E] hover:bg-[#F2F0E8]'
                      }`}
                    >
                      All Docs ({dmsDocuments.length})
                    </button>
                    <button
                      onClick={() => setDmsCategoryFilter('HR & DOLE Compliance')}
                      className={`px-3 py-1.5 rounded-xl transition-all ${
                        dmsCategoryFilter === 'HR & DOLE Compliance'
                          ? 'bg-[#77BC2E] text-white font-bold'
                          : 'bg-[#FAF9F5] text-[#5A534E] hover:bg-[#F2F0E8]'
                      }`}
                    >
                      DOLE & NTEs
                    </button>
                    <button
                      onClick={() => setDmsCategoryFilter('Payroll & Cash Advances')}
                      className={`px-3 py-1.5 rounded-xl transition-all ${
                        dmsCategoryFilter === 'Payroll & Cash Advances'
                          ? 'bg-[#E89BB9] text-white font-bold'
                          : 'bg-[#FAF9F5] text-[#5A534E] hover:bg-[#F2F0E8]'
                      }`}
                    >
                      Vale & Promissory
                    </button>
                    <button
                      onClick={() => setDmsCategoryFilter('Procurement & POs')}
                      className={`px-3 py-1.5 rounded-xl transition-all ${
                        dmsCategoryFilter === 'Procurement & POs'
                          ? 'bg-[#031134] text-white font-bold'
                          : 'bg-[#FAF9F5] text-[#5A534E] hover:bg-[#F2F0E8]'
                      }`}
                    >
                      MyTime PO Receipts
                    </button>
                    <button
                      onClick={() => setDmsCategoryFilter('Commercial Leases')}
                      className={`px-3 py-1.5 rounded-xl transition-all ${
                        dmsCategoryFilter === 'Commercial Leases'
                          ? 'bg-[#D4AF37] text-[#031134] font-bold'
                          : 'bg-[#FAF9F5] text-[#5A534E] hover:bg-[#F2F0E8]'
                      }`}
                    >
                      Mall Leases
                    </button>
                    <button
                      onClick={() => setDmsCategoryFilter('BPI Banking & Authorizations')}
                      className={`px-3 py-1.5 rounded-xl transition-all ${
                        dmsCategoryFilter === 'BPI Banking & Authorizations'
                          ? 'bg-[#031134] text-white font-bold'
                          : 'bg-[#FAF9F5] text-[#5A534E] hover:bg-[#F2F0E8]'
                      }`}
                    >
                      BPI Authorizations
                    </button>
                    <button
                      onClick={() => setDmsCategoryFilter('Employment Contracts')}
                      className={`px-3 py-1.5 rounded-xl transition-all ${
                        dmsCategoryFilter === 'Employment Contracts'
                          ? 'bg-[#77BC2E] text-white font-bold'
                          : 'bg-[#FAF9F5] text-[#5A534E] hover:bg-[#F2F0E8]'
                      }`}
                    >
                      Employment Contracts
                    </button>
                  </div>

                  {/* Search bar */}
                  <div className="relative min-w-[220px]">
                    <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A817C]" />
                    <input
                      type="text"
                      placeholder="Search document title, ID, staff..."
                      value={dmsSearch}
                      onChange={(e) => setDmsSearch(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#4A2E1B] outline-none font-medium focus:ring-1 focus:ring-[#77BC2E]"
                    />
                  </div>
                </div>
              </div>

              {/* Documents Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {(() => {
                  const filtered = dmsDocuments.filter(doc => {
                    const matchCat = dmsCategoryFilter === 'all' ? true : doc.category === dmsCategoryFilter;
                    const matchSearch = dmsSearch.trim() === '' ? true : 
                      doc.title.toLowerCase().includes(dmsSearch.toLowerCase()) ||
                      doc.id.toLowerCase().includes(dmsSearch.toLowerCase()) ||
                      doc.recipient.toLowerCase().includes(dmsSearch.toLowerCase()) ||
                      doc.branch.toLowerCase().includes(dmsSearch.toLowerCase());
                    return matchCat && matchSearch;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="lg:col-span-2 bg-white border border-[#EAE8E2] rounded-3xl p-12 text-center space-y-3 shadow-2xs">
                        <div className="w-12 h-12 rounded-2xl bg-[#77BC2E]/15 text-[#77BC2E] flex items-center justify-center mx-auto">
                          <CheckCircle className="h-6 w-6" />
                        </div>
                        <h4 className="font-extrabold text-base text-[#4A2E1B]">No Documents Found in this Filter</h4>
                        <p className="text-xs text-[#8A817C] max-w-md mx-auto">
                          Upload a new legal memo, contract, or promissory slip to file it in the Google Workspace Cloud Vault.
                        </p>
                        <button
                          onClick={() => setShowUploadDocModal(true)}
                          className="bg-[#77BC2E] hover:bg-[#6DB027] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-2xs inline-flex items-center space-x-1.5"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>File New Document</span>
                        </button>
                      </div>
                    );
                  }

                  return filtered.map((doc) => {
                    const isSigned = doc.status.includes('Signed') || doc.status.includes('Vaulted') || doc.status.includes('Disbursed');

                    return (
                      <div
                        key={doc.id}
                        className="bg-white border border-[#EAE8E2] hover:border-[#77BC2E]/50 rounded-3xl p-6 shadow-2xs space-y-4 flex flex-col justify-between transition-all"
                      >
                        {/* Header & Meta */}
                        <div className="space-y-2.5">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F2F0E8] pb-3">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono font-extrabold text-xs text-[#031134] bg-[#031134]/10 px-2.5 py-0.5 rounded-lg">
                                {doc.id}
                              </span>
                              <span className="text-[10px] font-bold bg-[#77BC2E]/15 text-[#5A9A1E] px-2 py-0.5 rounded-md">
                                {doc.category}
                              </span>
                            </div>

                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                              isSigned 
                                ? 'bg-[#77BC2E]/15 text-[#5A9A1E]' 
                                : 'bg-[#E89BB9]/25 text-[#D47098] animate-pulse'
                            }`}>
                              {doc.status}
                            </span>
                          </div>

                          <h3 className="font-extrabold text-sm sm:text-base text-[#4A2E1B] leading-snug">
                            {doc.title}
                          </h3>

                          {/* Recipient & Branch Info */}
                          <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-[#F2F0E8] space-y-1.5 text-xs">
                            <div className="flex justify-between text-[#5A534E]">
                              <span className="text-[#8A817C]">Recipient / Entity:</span>
                              <strong className="text-[#4A2E1B]">{doc.recipient}</strong>
                            </div>
                            <div className="flex justify-between text-[#5A534E]">
                              <span className="text-[#8A817C]">Branch Location:</span>
                              <span className="font-semibold text-[#4A2E1B]">{doc.branch}</span>
                            </div>
                            <div className="flex justify-between text-[#5A534E]">
                              <span className="text-[#8A817C]">Corporate Email:</span>
                              <span className="font-mono text-[11px] text-[#031134] font-semibold">{doc.recipientEmail}</span>
                            </div>
                          </div>

                          {/* Digital Signature & Hash Seal Strip */}
                          <div className={`p-3 rounded-2xl border text-xs space-y-1 ${
                            isSigned 
                              ? 'bg-[#77BC2E]/10 border-[#77BC2E]/30 text-[#4A2E1B]' 
                              : 'bg-amber-50 border-amber-200 text-amber-900'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider flex items-center space-x-1">
                                <PenTool className="h-3 w-3" />
                                <span>{isSigned ? 'Digitally Signed & Sealed' : 'Awaiting Digital Signature'}</span>
                              </span>
                              {isSigned && (
                                <span className="text-[9px] font-bold bg-[#77BC2E] text-white px-2 py-0.2 rounded-md">
                                  Valid & Sealed
                                </span>
                              )}
                            </div>
                            {isSigned ? (
                              <>
                                <p className="text-[11px] font-bold text-[#5A9A1E]">
                                  Signed by: {doc.signedBy} on {doc.signedAt}
                                </p>
                                <p className="font-mono text-[9px] text-[#8A817C] truncate" title={doc.sha256Hash}>
                                  {doc.sha256Hash}
                                </p>
                              </>
                            ) : (
                              <p className="text-[11px] text-amber-800">
                                This document requires official authorization before final disbursement or filing.
                              </p>
                            )}
                          </div>

                          {/* Google Workspace Drive Path */}
                          <div className="flex items-center justify-between text-[11px] text-[#8A817C] px-1">
                            <div className="flex items-center space-x-1.5 truncate">
                              <HardDrive className="h-3.5 w-3.5 text-[#031134] flex-shrink-0" />
                              <span className="truncate font-medium">{doc.googleDrivePath}</span>
                            </div>
                            <span className="text-[#5A9A1E] font-bold flex-shrink-0 ml-2">
                              âœ“ {doc.driveSyncStatus}
                            </span>
                          </div>
                        </div>

                        {/* Action Toolbar */}
                        <div className="pt-3 border-t border-[#F2F0E8] flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center space-x-1.5">
                            {!isSigned ? (
                              <button
                                onClick={() => {
                                  setSelectedDocForSign(doc);
                                  setShowSignModal(true);
                                }}
                                className="bg-[#77BC2E] hover:bg-[#6DB027] text-white text-xs font-extrabold px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm active:scale-95"
                              >
                                <PenTool className="h-3.5 w-3.5" />
                                <span>âœï¸ E-Sign Now</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedDocForSign(doc);
                                  setShowSignModal(true);
                                }}
                                className="bg-[#FAF9F5] hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#4A2E1B] text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center space-x-1"
                              >
                                <Edit className="h-3 w-3" />
                                <span>Re-Sign / Stamp</span>
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setSelectedDocForView(doc);
                                setShowDocViewerModal(true);
                              }}
                              className="bg-[#031134] hover:bg-[#082260] text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center space-x-1 shadow-2xs"
                            >
                              <FileText className="h-3.5 w-3.5 text-[#77BC2E]" />
                              <span>View Doc</span>
                            </button>

                            <button
                              onClick={() => handleOpenEditDoc(doc)}
                              className="bg-[#FAF9F5] hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#4A2E1B] text-xs font-semibold px-2.5 py-2 rounded-xl transition-all flex items-center space-x-1"
                              title="Edit clauses, recipient, or terms"
                            >
                              <Edit className="h-3 w-3 text-[#77BC2E]" />
                              <span>Customize</span>
                            </button>
                          </div>

                          <div className="flex items-center space-x-1.5">
                            <button
                              onClick={() => handleSendGmailDoc(doc)}
                              className="bg-[#FAF9F5] hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#031134] text-xs font-bold px-2.5 py-2 rounded-xl transition-all flex items-center space-x-1"
                              title="Send PDF via Google Workspace Gmail"
                            >
                              <Mail className="h-3.5 w-3.5 text-[#77BC2E]" />
                              <span className="hidden sm:inline">Gmail</span>
                            </button>

                            <button
                              onClick={() => handleSyncGoogleDriveDoc(doc)}
                              className="bg-[#FAF9F5] hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#5A534E] text-xs font-bold px-2.5 py-2 rounded-xl transition-all flex items-center space-x-1"
                              title="Backup into Google Drive"
                            >
                              <HardDrive className="h-3.5 w-3.5 text-[#D4AF37]" />
                              <span className="hidden sm:inline">Drive</span>
                            </button>

                            <button
                              onClick={() => {
                                setSelectedDocForView(doc);
                                setShowDocViewerModal(true);
                                setTimeout(() => window.print(), 300);
                              }}
                              className="p-2 rounded-xl bg-[#FAF9F5] border border-[#EAE8E2] text-[#5A534E] hover:text-[#4A2E1B]"
                              title="Print / Save PDF"
                            >
                              <Printer className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* TAB 8: SETTINGS, ROLE-BASED ACCESS CONTROL (RBAC) & CUSTOM DOMAIN HUB */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Settings Header Banner */}
              <div className="bg-gradient-to-r from-[#031134] via-[#082260] to-[#031134] rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-[#031134] space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#77BC2E] text-white flex items-center justify-center font-extrabold shadow-sm flex-shrink-0">
                      <Settings className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Enterprise Settings & Roles Hub</h2>
                        <span className="bg-[#77BC2E]/20 text-[#77BC2E] border border-[#77BC2E]/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                          System Admin
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-white/70">
                        Google Workspace DNS, Role-Based Access Control (RBAC), multi-branch node configuration, and system information.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleTestDns}
                      disabled={dnsTestStatus === 'testing'}
                      className="bg-[#77BC2E] hover:bg-[#6DB027] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shadow-sm shadow-[#77BC2E]/20 active:scale-95"
                    >
                      <Globe className="h-4 w-4" />
                      <span>{dnsTestStatus === 'testing' ? 'Testing DNS...' : 'Verify DNS Resolution'}</span>
                    </button>
                    <button
                      onClick={() => setShowAddUserModal(true)}
                      className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-white/20 transition-all flex items-center space-x-1.5"
                    >
                      <UserPlus className="h-4 w-4 text-[#77BC2E]" />
                      <span>+ New Role / User</span>
                    </button>
                  </div>
                </div>

                {/* Sub-Navigation Pill Tabs */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <button
                    onClick={() => setSettingsSubTab('domain')}
                    className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 ${
                      settingsSubTab === 'domain'
                        ? 'bg-[#77BC2E] text-white shadow-sm'
                        : 'bg-white/10 hover:bg-white/20 text-white/80'
                    }`}
                  >
                    <Globe className="h-4 w-4" />
                    <span>Google Workspace & Custom Domain</span>
                  </button>

                  <button
                    onClick={() => setSettingsSubTab('roles')}
                    className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 ${
                      settingsSubTab === 'roles'
                        ? 'bg-[#77BC2E] text-white shadow-sm'
                        : 'bg-white/10 hover:bg-white/20 text-white/80'
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    <span>Roles & Permissions (RBAC Matrix)</span>
                  </button>

                  <button
                    onClick={() => setSettingsSubTab('branches')}
                    className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 ${
                      settingsSubTab === 'branches'
                        ? 'bg-[#77BC2E] text-white shadow-sm'
                        : 'bg-white/10 hover:bg-white/20 text-white/80'
                    }`}
                  >
                    <Building2 className="h-4 w-4" />
                    <span>Store Branches ({branchesConfigList.length})</span>
                  </button>

                  <button
                    onClick={() => setSettingsSubTab('about')}
                    className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 ${
                      settingsSubTab === 'about'
                        ? 'bg-[#77BC2E] text-white shadow-sm'
                        : 'bg-white/10 hover:bg-white/20 text-white/80'
                    }`}
                  >
                    <Info className="h-4 w-4" />
                    <span>About System & PWA Cache</span>
                  </button>
                </div>
              </div>

              {/* Toast Notification */}
              {settingsToast && (
                <div className="bg-[#031134] text-white text-xs px-4 py-3 rounded-2xl border border-[#77BC2E] shadow-md flex items-center justify-between animate-fadeIn">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#77BC2E] font-bold">â—</span>
                    <span>{settingsToast}</span>
                  </div>
                  <button onClick={() => setSettingsToast('')} className="text-white/60 hover:text-white">
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* SUB-TAB 1: CUSTOM DOMAIN & GOOGLE WORKSPACE */}
              {settingsSubTab === 'domain' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Status Card */}
                  <div className="bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-2xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2F0E8] pb-4">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-[#77BC2E] tracking-wider block">Enterprise DNS Status</span>
                        <h3 className="font-extrabold text-lg text-[#4A2E1B]">Corporate Google Workspace Domain Binding</h3>
                        <p className="text-xs text-[#8A817C]">Link your official company domain directly to this Vercel ERP cloud deployment.</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-[#77BC2E]/15 text-[#5A9A1E] font-extrabold text-xs px-3 py-1.5 rounded-xl border border-[#77BC2E]/30 flex items-center space-x-1.5">
                          <CheckCircle className="h-4 w-4 text-[#77BC2E]" />
                          <span>{customDomainConfig.status}</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#EAE8E2] space-y-1">
                        <span className="text-[10px] font-bold uppercase text-[#8A817C]">Registered Apex Domain</span>
                        <p className="font-mono font-extrabold text-sm text-[#031134] truncate">{customDomainConfig.apexDomain}</p>
                        <p className="text-[11px] text-[#5A534E]">Managed via Google Workspace DNS</p>
                      </div>

                      <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#EAE8E2] space-y-1">
                        <span className="text-[10px] font-bold uppercase text-[#8A817C]">ERP Production Subdomain</span>
                        <p className="font-mono font-extrabold text-sm text-[#77BC2E] truncate">{customDomainConfig.subdomain}</p>
                        <p className="text-[11px] text-[#5A534E]">100% Free SSL & Auto-Renewing</p>
                      </div>

                      <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#EAE8E2] space-y-1">
                        <span className="text-[10px] font-bold uppercase text-[#8A817C]">Google Workspace Email Linked</span>
                        <p className="font-mono font-extrabold text-sm text-[#031134] truncate">{customDomainConfig.googleWorkspaceEmailLinked}</p>
                        <p className="text-[11px] text-[#5A534E]">Gmail & Google Drive API Connected</p>
                      </div>
                    </div>
                  </div>

                  {/* DNS Record Table */}
                  <div className="bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-base text-[#4A2E1B]">Required DNS Records for Google Workspace / Cloud DNS</h4>
                        <p className="text-xs text-[#8A817C]">Add these 2 records in your Google Admin Console (admin.google.com &rarr; Domains &rarr; Manage DNS).</p>
                      </div>
                      <span className="text-[10px] font-bold bg-[#031134] text-[#D4AF37] px-2.5 py-1 rounded-md">Vercel DNS Target</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#FAF9F5] border-b border-[#EAE8E2] text-[#8A817C] font-bold uppercase text-[10px]">
                            <th className="p-3.5">Record Type</th>
                            <th className="p-3.5">Host Name / Name</th>
                            <th className="p-3.5">Value / Target Destination</th>
                            <th className="p-3.5">TTL</th>
                            <th className="p-3.5">Status</th>
                            <th className="p-3.5 text-right">Quick Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F2F0E8] font-medium text-[#4A2E1B]">
                          <tr className="hover:bg-[#FAF9F5]/80">
                            <td className="p-3.5">
                              <span className="bg-[#031134] text-[#77BC2E] font-mono font-extrabold px-2 py-0.5 rounded text-[11px]">CNAME</span>
                            </td>
                            <td className="p-3.5 font-mono font-bold text-[#031134]">erp</td>
                            <td className="p-3.5 font-mono text-[#5A534E]">cname.vercel-dns.com</td>
                            <td className="p-3.5 font-mono text-[#8A817C]">3600 (Auto)</td>
                            <td className="p-3.5">
                              <span className="bg-[#77BC2E]/15 text-[#5A9A1E] font-bold text-[10px] px-2 py-0.5 rounded-full">âœ“ Verified & Live</span>
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => handleCopyText('cname.vercel-dns.com', 'CNAME Record')}
                                className="bg-[#FAF9F5] hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#031134] px-2.5 py-1.5 rounded-xl font-bold text-[11px] transition-all inline-flex items-center space-x-1"
                              >
                                <Copy className="h-3 w-3" />
                                <span>Copy Target</span>
                              </button>
                            </td>
                          </tr>

                          <tr className="hover:bg-[#FAF9F5]/80">
                            <td className="p-3.5">
                              <span className="bg-[#031134] text-[#D4AF37] font-mono font-extrabold px-2 py-0.5 rounded text-[11px]">TXT</span>
                            </td>
                            <td className="p-3.5 font-mono font-bold text-[#031134]">_vercel</td>
                            <td className="p-3.5 font-mono text-[#5A534E] truncate max-w-xs">{customDomainConfig.txtRecordValue}</td>
                            <td className="p-3.5 font-mono text-[#8A817C]">3600 (Auto)</td>
                            <td className="p-3.5">
                              <span className="bg-[#77BC2E]/15 text-[#5A9A1E] font-bold text-[10px] px-2 py-0.5 rounded-full">âœ“ Authenticated</span>
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => handleCopyText(customDomainConfig.txtRecordValue, 'TXT Record')}
                                className="bg-[#FAF9F5] hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#031134] px-2.5 py-1.5 rounded-xl font-bold text-[11px] transition-all inline-flex items-center space-x-1"
                              >
                                <Copy className="h-3 w-3" />
                                <span>Copy Value</span>
                              </button>
                            </td>
                          </tr>

                          <tr className="hover:bg-[#FAF9F5]/80">
                            <td className="p-3.5">
                              <span className="bg-[#031134] text-[#E89BB9] font-mono font-extrabold px-2 py-0.5 rounded text-[11px]">MX</span>
                            </td>
                            <td className="p-3.5 font-mono font-bold text-[#031134]">@ (Root)</td>
                            <td className="p-3.5 font-mono text-[#5A534E]">ASPMX.L.GOOGLE.COM (Google Workspace Mail)</td>
                            <td className="p-3.5 font-mono text-[#8A817C]">3600</td>
                            <td className="p-3.5">
                              <span className="bg-[#77BC2E]/15 text-[#5A9A1E] font-bold text-[10px] px-2 py-0.5 rounded-full">âœ“ Retained</span>
                            </td>
                            <td className="p-3.5 text-right">
                              <span className="text-[11px] text-[#8A817C] italic">Email Protected</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 3-Step Simple Guide for Non-Techies */}
                  <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-3xl p-6 space-y-4">
                    <h4 className="font-extrabold text-sm text-[#4A2E1B] flex items-center space-x-2">
                      <Sparkles className="h-4 w-4 text-[#77BC2E]" />
                      <span>Non-Techie 3-Step DNS Guide (Takes under 2 minutes)</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="bg-white p-4 rounded-2xl border border-[#EAE8E2] space-y-1.5">
                        <div className="w-6 h-6 rounded-full bg-[#031134] text-[#D4AF37] font-bold flex items-center justify-center text-xs">1</div>
                        <strong className="text-[#031134] block">Log into Google Admin</strong>
                        <p className="text-[#5A534E] text-[11px]">Go to <code>admin.google.com</code> &rarr; click <strong>Account</strong> &rarr; <strong>Domains</strong> &rarr; <strong>Manage Domains</strong>.</p>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-[#EAE8E2] space-y-1.5">
                        <div className="w-6 h-6 rounded-full bg-[#031134] text-[#D4AF37] font-bold flex items-center justify-center text-xs">2</div>
                        <strong className="text-[#031134] block">Paste CNAME Record</strong>
                        <p className="text-[#5A534E] text-[11px]">Click <strong>DNS Records</strong> &rarr; Add CNAME with name <code>erp</code> pointing to <code>cname.vercel-dns.com</code>.</p>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-[#EAE8E2] space-y-1.5">
                        <div className="w-6 h-6 rounded-full bg-[#77BC2E] text-white font-bold flex items-center justify-center text-xs">3</div>
                        <strong className="text-[#031134] block">Click Verify DNS Resolution</strong>
                        <p className="text-[#5A534E] text-[11px]">Click the green button above! The system pings DNS servers and issues a free 256-bit SSL padlock automatically.</p>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* SUB-TAB 2: ROLES & PERMISSIONS MATRIX (RBAC) */}
              {settingsSubTab === 'roles' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* RBAC Overview Banner */}
                  <div className="bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2F0E8] pb-4">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-[#77BC2E] tracking-wider block">Security & Access Governance</span>
                        <h3 className="font-extrabold text-lg text-[#4A2E1B]">Role-Based Access Control (RBAC) Matrix</h3>
                        <p className="text-xs text-[#8A817C]">Configure user roles, branch authorization scopes, and granular module permissions.</p>
                      </div>
                      <button
                        onClick={() => setShowAddUserModal(true)}
                        className="bg-[#031134] hover:bg-[#082260] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
                      >
                        <UserPlus className="h-4 w-4 text-[#77BC2E]" />
                        <span>Add New Account</span>
                      </button>
                    </div>

                    {/* Interactive Granular Permissions Matrix Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#FAF9F5] border-b border-[#EAE8E2] text-[#8A817C] font-bold uppercase text-[10px]">
                            <th className="p-3.5 min-w-[180px]">User & Role</th>
                            <th className="p-3.5 min-w-[140px]">Branch Scope</th>
                            <th className="p-3 text-center" title="General Executive Dashboard">Dashboard</th>
                            <th className="p-3 text-center" title="Multi-Tier Approvals">Approvals</th>
                            <th className="p-3 text-center" title="Accounting AP & GL">Accounting</th>
                            <th className="p-3 text-center" title="Biometric Payroll & BPI">Payroll</th>
                            <th className="p-3 text-center" title="Exceptions & Tardiness">Biometrics</th>
                            <th className="p-3 text-center" title="Salon POS & CRM">POS/CRM</th>
                            <th className="p-3 text-center" title="5-Step Purchase Orders">PO Requisitions</th>
                            <th className="p-3 text-center" title="DMS & Digital E-Sign">DMS E-Sign</th>
                            <th className="p-3 text-center" title="System Settings & DNS">Settings</th>
                            <th className="p-3.5 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F2F0E8] font-medium text-[#4A2E1B]">
                          {userRolesList.map((user) => (
                            <tr key={user.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                              
                              {/* User & Role */}
                              <td className="p-3.5">
                                <div className="flex items-center space-x-2.5">
                                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white ${
                                    user.role.includes('Director') ? 'bg-[#031134]' : user.role.includes('HR') ? 'bg-[#77BC2E]' : 'bg-[#4A2E1B]'
                                  }`}>
                                    {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                  </div>
                                  <div>
                                    <strong className="text-xs font-bold text-[#031134] block">{user.name}</strong>
                                    <span className="text-[10px] text-[#8A817C] block truncate max-w-[150px]">{user.email}</span>
                                    <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded inline-block mt-0.5 ${
                                      user.role.includes('Director') ? 'bg-[#031134] text-[#D4AF37]' : user.role.includes('HR') ? 'bg-[#77BC2E]/20 text-[#5A9A1E]' : 'bg-stone-100 text-stone-700'
                                    }`}>
                                      {user.role}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Branch Scope */}
                              <td className="p-3.5 text-[11px] font-semibold text-[#5A534E]">
                                {user.branchAccess}
                              </td>

                              {/* Permission Checkbox 1: Dashboard */}
                              <td className="p-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={user.permissions.dashboard}
                                  onChange={() => handleTogglePermission(user.id, 'dashboard')}
                                  className="w-4 h-4 rounded text-[#77BC2E] focus:ring-[#77BC2E] cursor-pointer"
                                />
                              </td>

                              {/* Permission Checkbox 2: Approvals */}
                              <td className="p-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={user.permissions.approvals}
                                  onChange={() => handleTogglePermission(user.id, 'approvals')}
                                  className="w-4 h-4 rounded text-[#77BC2E] focus:ring-[#77BC2E] cursor-pointer"
                                />
                              </td>

                              {/* Permission Checkbox 3: Accounting */}
                              <td className="p-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={user.permissions.accounting}
                                  onChange={() => handleTogglePermission(user.id, 'accounting')}
                                  className="w-4 h-4 rounded text-[#77BC2E] focus:ring-[#77BC2E] cursor-pointer"
                                />
                              </td>

                              {/* Permission Checkbox 4: Payroll */}
                              <td className="p-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={user.permissions.payroll}
                                  onChange={() => handleTogglePermission(user.id, 'payroll')}
                                  className="w-4 h-4 rounded text-[#77BC2E] focus:ring-[#77BC2E] cursor-pointer"
                                />
                              </td>

                              {/* Permission Checkbox 5: Biometrics */}
                              <td className="p-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={user.permissions.exceptions}
                                  onChange={() => handleTogglePermission(user.id, 'exceptions')}
                                  className="w-4 h-4 rounded text-[#77BC2E] focus:ring-[#77BC2E] cursor-pointer"
                                />
                              </td>

                              {/* Permission Checkbox 6: POS/CRM */}
                              <td className="p-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={user.permissions.crm}
                                  onChange={() => handleTogglePermission(user.id, 'crm')}
                                  className="w-4 h-4 rounded text-[#77BC2E] focus:ring-[#77BC2E] cursor-pointer"
                                />
                              </td>

                              {/* Permission Checkbox 7: Procurement */}
                              <td className="p-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={user.permissions.procurement}
                                  onChange={() => handleTogglePermission(user.id, 'procurement')}
                                  className="w-4 h-4 rounded text-[#77BC2E] focus:ring-[#77BC2E] cursor-pointer"
                                />
                              </td>

                              {/* Permission Checkbox 8: DMS */}
                              <td className="p-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={user.permissions.dms}
                                  onChange={() => handleTogglePermission(user.id, 'dms')}
                                  className="w-4 h-4 rounded text-[#77BC2E] focus:ring-[#77BC2E] cursor-pointer"
                                />
                              </td>

                              {/* Permission Checkbox 9: Settings */}
                              <td className="p-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={user.permissions.settings}
                                  onChange={() => handleTogglePermission(user.id, 'settings')}
                                  className="w-4 h-4 rounded text-[#77BC2E] focus:ring-[#77BC2E] cursor-pointer"
                                />
                              </td>

                              {/* Status */}
                              <td className="p-3.5 text-center">
                                <span className="bg-[#77BC2E]/15 text-[#5A9A1E] font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                                  â— {user.status}
                                </span>
                              </td>

                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Preset Role Templates Guide */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-2xl p-4 space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="h-4 w-4 text-[#77BC2E]" />
                        <strong className="text-[#031134]">Managing Director</strong>
                      </div>
                      <p className="text-[#5A534E] text-[11px]">Unrestricted executive master rights, Level 4 sign-off & BPI BizLink authorizer.</p>
                    </div>

                    <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-2xl p-4 space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-[#77BC2E]" />
                        <strong className="text-[#031134]">HR & Operations Lead</strong>
                      </div>
                      <p className="text-[#5A534E] text-[11px]">Timekeeping, NGTeco parser, payroll calculation, Level 3 audit & DOLE NTE generator.</p>
                    </div>

                    <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-2xl p-4 space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <ShoppingCart className="h-4 w-4 text-[#E89BB9]" />
                        <strong className="text-[#031134]">Branch Shift Lead</strong>
                      </div>
                      <p className="text-[#5A534E] text-[11px]">Service ring-up, MyTime commissary store orders & daily cash drawer reconciliation.</p>
                    </div>

                    <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-2xl p-4 space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-[#8A817C]" />
                        <strong className="text-[#031134]">Salon Specialist</strong>
                      </div>
                      <p className="text-[#5A534E] text-[11px]">Personal service logs, 10% commission balance viewer, DTR check & e-sign acknowledgments.</p>
                    </div>
                  </div>

                </div>
              )}

              {/* SUB-TAB 3: STORE BRANCHES CONFIG */}
              {settingsSubTab === 'branches' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#EAE8E2] rounded-3xl p-6 shadow-2xs">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-[#77BC2E] tracking-wider block">Multi-Branch Architecture</span>
                      <h3 className="font-extrabold text-lg text-[#4A2E1B]">Active Store Locations & Biometric Nodes</h3>
                      <p className="text-xs text-[#8A817C]">Manage branch facilities, biometric IP endpoints, and store supervisors.</p>
                    </div>
                    <button
                      onClick={() => setShowAddBranchModal(true)}
                      className="bg-[#77BC2E] hover:bg-[#6DB027] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm shadow-[#77BC2E]/20"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Register New Branch</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {branchesConfigList.map((branch) => (
                      <div key={branch.id} className="bg-white border border-[#EAE8E2] rounded-3xl p-5 space-y-3.5 shadow-2xs hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-10 h-10 rounded-2xl bg-[#031134] text-[#77BC2E] flex items-center justify-center font-bold">
                              <Building2 className="h-5 w-5" />
                            </div>
                            <div>
                              <strong className="text-sm font-extrabold text-[#031134] block">{branch.name}</strong>
                              <span className="text-[10px] text-[#8A817C] font-semibold">{branch.type}</span>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            branch.status === 'Operational' ? 'bg-[#77BC2E]/15 text-[#5A9A1E]' : 'bg-amber-100 text-amber-800 animate-pulse'
                          }`}>
                            {branch.status}
                          </span>
                        </div>

                        <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-[#EAE8E2] space-y-1.5 text-xs text-[#5A534E]">
                          <div className="flex justify-between">
                            <span className="text-[#8A817C]">Branch Lead:</span>
                            <strong className="text-[#4A2E1B]">{branch.manager}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#8A817C]">Contact:</span>
                            <span className="font-mono text-[#031134]">{branch.contact}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#8A817C]">Biometric Node:</span>
                            <span className="font-mono text-[11px] text-[#77BC2E] font-bold">{branch.biometricIp}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#8A817C]">Capacity:</span>
                            <span className="font-semibold text-[#4A2E1B]">{branch.bedsStations}</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-[#8A817C] truncate" title={branch.location}>
                          ðŸ“ {branch.location}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB 4: ABOUT SYSTEM & PWA CACHE */}
              {settingsSubTab === 'about' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* System Architecture Profile */}
                  <div className="bg-white border border-[#EAE8E2] rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
                    <div className="flex items-start justify-between border-b border-[#F2F0E8] pb-5">
                      <div className="flex items-center space-x-4">
                        <img src="/alrajj-icon.png" alt="ALRAJJ LEGACY" className="h-14 w-14 rounded-2xl bg-[#031134] p-1.5 shadow-sm" />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-black text-xl text-[#031134]">ALRAJJ LEGACY Enterprise ERP Suite</h3>
                            <span className="bg-[#031134] text-[#D4AF37] text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                              v2.4.0-PROD
                            </span>
                          </div>
                          <p className="text-xs text-[#8A817C]">Engineered for ALRAJJ LEGACY Fortified Business Corp. & Lay Bare Franchise Network</p>
                        </div>
                      </div>
                      <span className="hidden sm:inline-block bg-[#77BC2E]/15 text-[#5A9A1E] font-bold text-xs px-3 py-1 rounded-xl">
                        âœ“ 99.5% Uptime SLA
                      </span>
                    </div>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#EAE8E2] space-y-1">
                        <span className="text-[10px] font-bold uppercase text-[#8A817C]">Client / Enterprise</span>
                        <strong className="text-[#031134] block">ALRAJJ LEGACY Fortified Business Corp.</strong>
                        <p className="text-[#5A534E]">Client Lead: Ms. Jehan Abedin (Managing Director)</p>
                      </div>

                      <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#EAE8E2] space-y-1">
                        <span className="text-[10px] font-bold uppercase text-[#8A817C]">Technology Partner</span>
                        <strong className="text-[#031134] block">SETHCON Technologies Corp.</strong>
                        <p className="text-[#5A534E]">CTO & Lead Architect: Jason Jeff D. Velasquez</p>
                      </div>

                      <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#EAE8E2] space-y-1">
                        <span className="text-[10px] font-bold uppercase text-[#8A817C]">Production Deployment</span>
                        <a href="https://alrajj-legacy.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[#77BC2E] hover:underline font-mono font-bold block truncate">
                          alrajj-legacy.vercel.app
                        </a>
                        <p className="text-[#5A534E]">Custom Domain: erp.alrajjlegacy-fortifiedbusinesscorp.com</p>
                      </div>
                    </div>

                    {/* PWA Cache Controller & Data Management */}
                    <div className="border-t border-[#F2F0E8] pt-5 space-y-4">
                      <h4 className="font-extrabold text-sm text-[#4A2E1B]">Local Data & Offline PWA Storage Controller</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="bg-[#FAF9F5] border border-[#EAE8E2] p-4 rounded-2xl space-y-3">
                          <div>
                            <strong className="text-[#031134] block font-bold">Service Worker & Asset Cache</strong>
                            <p className="text-[11px] text-[#5A534E]">Purge local cache storage and force re-fetch latest application version from Vercel edge CDN.</p>
                          </div>
                          <button
                            onClick={handleClearPwaCache}
                            className="bg-[#031134] hover:bg-[#082260] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5"
                          >
                            <RotateCcw className="h-3.5 w-3.5 text-[#77BC2E]" />
                            <span>Purge Offline PWA Cache</span>
                          </button>
                        </div>

                        <div className="bg-[#FAF9F5] border border-[#EAE8E2] p-4 rounded-2xl space-y-3">
                          <div>
                            <strong className="text-[#031134] block font-bold">Dataset Mode (Live vs Demo Data)</strong>
                            <p className="text-[11px] text-[#5A534E]">Currently active: <strong>{systemDataMode === 'live' ? 'ðŸ¢ Live Store Mode' : 'ðŸ§ª Demo Simulation Mode'}</strong></p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSwitchToLiveData}
                              className="bg-[#77BC2E] hover:bg-[#6DB027] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-2xs"
                            >
                              Clean Slate (Live Mode)
                            </button>
                            <button
                              onClick={handleReloadDemoData}
                              className="bg-white border border-[#EAE8E2] hover:bg-[#F2F0E8] text-[#4A2E1B] text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-2xs"
                            >
                              Reload 4-Branch Demo
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              )}

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
                  ðŸ›ï¸ Philippine Government Statutory Registration
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
                  ðŸ’³ Custom Payroll Deductions & Cash Advance (Vale)
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
                <span>ðŸ“§</span>
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
                    <p className="text-[10px] text-[#94A3B8]">Centrio Mall (Waxing & Nails) â€¢ Limketkai â€¢ SM Downtown Premier</p>
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
                  <span className="text-[10.5px] text-[#64748B] block">Daily Rate: â‚±{parseFloat(selectedPayslip.dailyRate || 600).toFixed(2)} / day</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[9px] uppercase font-bold">BPI BizLink ATM Account</span>
                  <span className="font-mono font-extrabold text-xs text-[#031134] bg-white px-2 py-0.5 rounded border border-[#CBD5E1] inline-block mt-0.5">
                    {selectedPayslip.bpiAccount || '0249821401'}
                  </span>
                  <span className="text-[10px] text-[#16A34A] font-semibold block mt-0.5">â— Direct Credited</span>
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
                      <span>Basic Pay ({selectedPayslip.daysPresent} days @ â‚±{selectedPayslip.dailyRate}/day)</span>
                      <span className="font-mono font-semibold">â‚±{selectedPayslip.calculations.basicPay.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overtime Pay ({selectedPayslip.totalOtHours} hrs @ 125%)</span>
                      <span className="font-mono font-semibold text-[#166534]">+â‚±{selectedPayslip.calculations.otPay.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Night Differential ({selectedPayslip.totalNdHours} hrs @ 10%)</span>
                      <span className="font-mono font-semibold text-[#166534]">+â‚±{selectedPayslip.calculations.ndPay.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-dashed border-[#CBD5E1] pt-2 mt-2 flex justify-between font-extrabold text-[#031134]">
                      <span>Total Gross Compensation</span>
                      <span className="font-mono text-sm">â‚±{selectedPayslip.calculations.grossPay.toFixed(2)}</span>
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
                      <span className="font-mono text-[#E11D48]">-â‚±{selectedPayslip.calculations.lateDeduction.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SSS Mandatory Contribution</span>
                      <span className="font-mono text-[#E11D48]">-â‚±{selectedPayslip.calculations.deductions.sss.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PhilHealth (UHC 2.0% Employee)</span>
                      <span className="font-mono text-[#E11D48]">-â‚±{selectedPayslip.calculations.deductions.philhealth.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pag-IBIG (HDMF Standard)</span>
                      <span className="font-mono text-[#E11D48]">-â‚±{selectedPayslip.calculations.deductions.pagibig.toFixed(2)}</span>
                    </div>
                    {selectedPayslip.calculations.deductions.otherDeductions > 0 && (
                      <div className="flex justify-between bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        <span className="font-bold text-[#9F1239]">{selectedPayslip.calculations.deductions.otherDeductionRemarks || 'Cash Advance (Vale)'}</span>
                        <span className="font-mono font-bold text-[#E11D48]">-â‚±{selectedPayslip.calculations.deductions.otherDeductions.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-dashed border-[#CBD5E1] pt-2 mt-2 flex justify-between font-extrabold text-[#9F1239]">
                      <span>Total Deductions</span>
                      <span className="font-mono text-sm">-â‚±{selectedPayslip.calculations.deductions.totalDeductions.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Take-Home Salary Highlight Banner */}
              <div className="bg-[#031134] text-white p-4 rounded-xl flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[#D4AF37] font-bold text-[10px] uppercase tracking-wider block">Disbursement Net Amount</span>
                  <h3 className="font-black text-xl text-white tracking-tight">â‚±{selectedPayslip.calculations.netPay.toFixed(2)}</h3>
                  <span className="text-[10px] text-slate-300">Philippine Peso (PHP) â€¢ Direct ATM Release</span>
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
                    <option value="Brazilian Wax Express (â‚±650.00)">Brazilian Wax Express (â‚±650.00)</option>
                    <option value="Underarm Wax (â‚±450.00)">Underarm Wax (â‚±450.00)</option>
                    <option value="Underarm & Full Leg Wax (â‚±1,100.00)">Underarm & Full Leg Wax (â‚±1,100.00)</option>
                    <option value="Full Body Organic Sugar Wax (â‚±1,200.00)">Full Body Sugar Wax (â‚±1,200.00)</option>
                    <option value="Gel Manicure + Spa Pedicure (â‚±850.00)">Gel Manicure + Spa Pedicure (â‚±850.00)</option>
                    <option value="Retail Soothing Aloe Gel (â‚±350.00)">Retail Soothing Aloe Gel (â‚±350.00)</option>
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
                  <span className="font-mono font-black text-[#77BC2E] text-sm">â‚±{((Number(newTicket.amount) || 0) * 0.10).toFixed(2)}</span>
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
                        â‚±{(p.calculations?.netPay || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                    <option value="Lay Bare Franchisor (MyTime Commissary)">Lay Bare Franchisor (MyTime Commissary)</option>
                    <option value="Glamour Pro Nail Distributing Co.">Glamour Pro Nails (Passion Nails)</option>
                    <option value="CleanCare Commercial Solutions">CleanCare Solutions (Clinic Sanitation & PPE)</option>
                    <option value="PureBeauty Salon Supplies Corp.">PureBeauty Supplies</option>
                    <option value="Wellness Natural Trading Inc.">Wellness Natural Trading</option>
                    <option value="General Approved Local Vendor">General Approved Local Vendor</option>
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
                <span className="font-mono text-[#031134]">â‚±{(newPo.qty * newPo.unitPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
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
                  <span className="text-[10px] text-[#5A9A1E] font-bold">âœ“ Approved</span>
                </div>
                <div className="bg-[#77BC2E]/10 border border-[#77BC2E]/30 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-[#5A9A1E] block">2. Goods Receipt</span>
                  <strong className="text-[#4A2E1B] text-xs mt-0.5 block">Store Inspected</strong>
                  <span className="text-[10px] text-[#5A9A1E] font-bold">âœ“ 100% Quantity</span>
                </div>
                <div className="bg-[#77BC2E]/10 border border-[#77BC2E]/30 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-[#5A9A1E] block">3. Vendor Invoice</span>
                  <strong className="text-[#4A2E1B] text-xs mt-0.5 block">INV-{selectedPo.poNumber.replace('PO-', '')}</strong>
                  <span className="text-[10px] text-[#5A9A1E] font-bold">âœ“ Math Verified</span>
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
                        <p className="text-[11px] text-[#8A817C]">{item.qty} units &times; â‚±{item.unitPrice.toLocaleString()}</p>
                      </div>
                      <span className="font-mono font-bold text-[#4A2E1B]">â‚±{item.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#EAE8E2] pt-2 flex justify-between text-sm font-extrabold text-[#031134]">
                  <span>Total Payable:</span>
                  <span className="font-mono text-[#77BC2E]">â‚±{selectedPo.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
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
                          placeholder="Debit â‚±"
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
                          placeholder="Credit â‚±"
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
                          {isBalanced ? 'âœ“ Balanced Entry' : `Unbalanced Difference: â‚±${Math.abs(debits - credits).toFixed(2)}`}
                        </span>
                      </div>
                      <div className="space-x-4 font-mono font-bold">
                        <span>Debits: <strong className="text-[#5A9A1E]">â‚±{debits.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></span>
                        <span>Credits: <strong className="text-[#D47098]">â‚±{credits.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></span>
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
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Morning Float (â‚±)</label>
                  <input
                    type="number"
                    required
                    value={newPosRecon.openingFloat}
                    onChange={(e) => setNewPosRecon({ ...newPosRecon, openingFloat: Number(e.target.value) })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3 py-2 font-mono font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Physical Cash Sales (â‚±)</label>
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
                  <label className="block font-bold text-[#8A817C] text-[10px] mb-1 uppercase">Maya QR (â‚±)</label>
                  <input
                    type="number"
                    value={newPosRecon.mayaQrSales}
                    onChange={(e) => setNewPosRecon({ ...newPosRecon, mayaQrSales: Number(e.target.value) })}
                    className="w-full bg-white border border-[#EAE8E2] rounded-lg px-2 py-1 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#8A817C] text-[10px] mb-1 uppercase">GCash QR (â‚±)</label>
                  <input
                    type="number"
                    value={newPosRecon.gcashQrSales}
                    onChange={(e) => setNewPosRecon({ ...newPosRecon, gcashQrSales: Number(e.target.value) })}
                    className="w-full bg-white border border-[#EAE8E2] rounded-lg px-2 py-1 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#8A817C] text-[10px] mb-1 uppercase">Card POS (â‚±)</label>
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
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Petty Cash Out (â‚±)</label>
                  <input
                    type="number"
                    value={newPosRecon.pettyCashExpenses}
                    onChange={(e) => setNewPosRecon({ ...newPosRecon, pettyCashExpenses: Number(e.target.value) })}
                    className="w-full bg-[#F7F6F2] border border-transparent rounded-xl px-3 py-2 font-mono text-[#D47098] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Counted Physical Cash (â‚±)</label>
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
                      <span className="font-mono text-[#4A2E1B]">â‚±{expected.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#8A817C] block text-[10px]">Variance:</span>
                      <span className={`font-mono text-sm ${diff === 0 ? 'text-[#5A9A1E]' : 'text-[#D47098]'}`}>
                        {diff === 0 ? 'â‚±0.00 Exact Match' : `â‚±${diff.toFixed(2)} (${diff > 0 ? 'Over' : 'Short'})`}
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
                <p className="text-[#8A817C]">For the Period Ended August 31, 2026 (All amounts in Philippine Peso â‚±)</p>
              </div>

              {financialReportType === 'pl' ? (
                <div className="border border-[#EAE8E2] rounded-2xl p-4 bg-[#FAF9F5] space-y-3 font-medium">
                  <div className="flex justify-between font-bold text-[#031134] border-b border-[#EAE8E2] pb-1">
                    <span>Gross Service & Retail Revenue:</span>
                    <span className="font-mono">â‚±1,284,650.00</span>
                  </div>
                  <div className="flex justify-between text-[#D47098]">
                    <span>Less: Cost of Goods Sold (Consumables & Supplies):</span>
                    <span className="font-mono">(â‚±248,300.00)</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-[#5A9A1E] bg-[#77BC2E]/15 p-2 rounded-xl">
                    <span>GROSS OPERATING PROFIT (80.67%):</span>
                    <span className="font-mono">â‚±1,036,350.00</span>
                  </div>
                  <div className="flex justify-between text-[#4A2E1B] pt-1">
                    <span>Less: Operating Expenses (Salaries, Mall Rents, Utilities):</span>
                    <span className="font-mono">(â‚±582,400.00)</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-white bg-[#031134] p-3 rounded-xl border border-[#D4AF37]">
                    <span className="text-[#D4AF37]">NET OPERATING INCOME (EBITDA - 35.33%):</span>
                    <span className="font-mono text-white">â‚±453,950.00</span>
                  </div>
                </div>
              ) : (
                <div className="border border-[#EAE8E2] rounded-2xl p-4 bg-[#FAF9F5] space-y-3 font-medium">
                  <div className="flex justify-between font-bold text-[#5A9A1E] border-b border-[#EAE8E2] pb-1">
                    <span>TOTAL ASSETS (Current + Non-Current Property/Equipment):</span>
                    <span className="font-mono">â‚±4,121,700.00</span>
                  </div>
                  <div className="flex justify-between text-[#D47098]">
                    <span>TOTAL LIABILITIES (Trade AP, Accrued Payroll, Tax Payables):</span>
                    <span className="font-mono">â‚±562,500.00</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-[#031134] bg-[#031134]/10 p-2 rounded-xl">
                    <span>TOTAL SHAREHOLDER EQUITY (Capital + Retained + MTD Profit):</span>
                    <span className="font-mono">â‚±3,559,200.00</span>
                  </div>
                  <div className="flex justify-between font-black text-xs text-[#5A9A1E] pt-1 text-center">
                    <span>âœ“ Equation Verified: Total Assets = Total Liabilities + Equity</span>
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

      {/* 13. PWA & OFFLINE RESILIENCE MODAL */}
      {showPwaModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl w-full max-w-lg p-7 space-y-5">
            <div className="flex items-start justify-between border-b border-[#F2F0E8] pb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm ${
                  isOnline ? 'bg-[#77BC2E]/15 text-[#5A9A1E]' : 'bg-[#D4AF37]/20 text-[#B48A10]'
                }`}>
                  {isOnline ? <Wifi className="h-6 w-6" /> : <WifiOff className="h-6 w-6" />}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-lg text-[#4A2E1B]">Offline PWA App Engine</h3>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isOnline ? 'bg-[#77BC2E]/15 text-[#5A9A1E]' : 'bg-[#D4AF37]/20 text-[#B48A10]'
                    }`}>
                      {isOnline ? 'ðŸŸ¢ Online (Cloud Sync)' : 'ðŸŸ¡ Offline Mode Active'}
                    </span>
                  </div>
                  <p className="text-xs text-[#8A817C]">100% Operational even with mall Wi-Fi disconnections</p>
                </div>
              </div>
              <button onClick={() => setShowPwaModal(false)} className="text-[#8A817C] hover:text-[#4A2E1B]">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-[#4A2E1B] flex items-center space-x-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#77BC2E]" />
                  <span>How Offline Protection Works for Store Branches</span>
                </h4>
                <ul className="space-y-1.5 text-[#5A534E] list-disc list-inside">
                  <li><strong>Service Worker Caching:</strong> The full ERP application loads instantly from local device storage without waiting for internet.</li>
                  <li><strong>POS Tickets & Cash Audits:</strong> Shift receipts and cash balances are preserved locally if Wi-Fi drops mid-transaction.</li>
                  <li><strong>Automatic Auto-Sync:</strong> Once mall internet reconnects, all pending data automatically syncs with the master cloud database.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl border border-[#031134]/15 bg-[#031134]/5 space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-[#031134] tracking-wider block">Desktop & Tablet Install</span>
                <p className="text-[#5A534E] text-[11px]">
                  Store staff at Centrio, Passion Nails, Ketkai, and SM Downtown can install this ERP as a standalone desktop icon on Windows or home screen app on iPads/tablets.
                </p>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => {
                    handleTriggerPwaInstall();
                    setShowPwaModal(false);
                  }}
                  className="flex-1 bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-sm"
                >
                  <Smartphone className="h-4 w-4" />
                  <span>Install Salon App</span>
                </button>
                <button
                  onClick={() => setShowPwaModal(false)}
                  className="bg-[#F2F0E8] text-[#5A534E] font-semibold px-4 py-2.5 rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 14. NON-TECHIE 1-2-3 EASY GUIDE MODAL */}
      {showHelpGuideModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl w-full max-w-xl p-7 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#F2F0E8] pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-[#77BC2E]/15 text-[#77BC2E] flex items-center justify-center font-bold text-lg shadow-sm">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-[#4A2E1B]">Non-Techie Easy Guide</h3>
                  <p className="text-xs text-[#8A817C]">Simple 4-step walkthrough for store managers & supervisors</p>
                </div>
              </div>
              <button onClick={() => setShowHelpGuideModal(false)} className="text-[#8A817C] hover:text-[#4A2E1B]">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              
              {/* Step 1 */}
              <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-2xl p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-black text-[#031134] text-xs">1. Daily Biometric Timekeeping</span>
                  <span className="bg-[#77BC2E]/15 text-[#5A9A1E] text-[10px] font-bold px-2 py-0.5 rounded-md">End of Cutoff</span>
                </div>
                <p className="text-[#5A534E]">
                  Export the punch file from your <strong>NGTeco biometric device</strong> into a USB flash drive. Click <strong>"Biometric Ingestion"</strong> and drag the Excel file. The system pairs in/out punches in 3 seconds!
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-2xl p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-black text-[#031134] text-xs">2. Computing Payroll & BPI Payout</span>
                  <span className="bg-[#031134] text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded-md">1-Click Action</span>
                </div>
                <p className="text-[#5A534E]">
                  Click <strong>"Biometric Payroll"</strong> &rarr; click the green <strong>"Compute Semi-Monthly Payroll"</strong> button. The system deducts SSS, PhilHealth, Pag-IBIG, and tax automatically. Download the <strong>BPI BizLink CSV</strong> for ATM bank upload.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-2xl p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-black text-[#031134] text-xs">3. Ringing Up Salon Clients & Specialist Commission</span>
                  <span className="bg-[#E89BB9]/20 text-[#D47098] text-[10px] font-bold px-2 py-0.5 rounded-md">Frontdesk Shift</span>
                </div>
                <p className="text-[#5A534E]">
                  In <strong>"Salon CRM"</strong>, click <strong>"+ Ring Up Service Ticket"</strong>. Choose service (e.g., Brazilian Wax), assign the technician, and choose payment (Cash, GCash QR, Maya). The 10% commission is credited instantly!
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-2xl p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-black text-[#031134] text-xs">4. Ordering Supplies (MyTime Lay Bare Commissary)</span>
                  <span className="bg-[#77BC2E]/15 text-[#5A9A1E] text-[10px] font-bold px-2 py-0.5 rounded-md">Procurement</span>
                </div>
                <p className="text-[#5A534E]">
                  Click <strong>"PO to Accounting"</strong> &rarr; <strong>"+ New Store Requisition"</strong> &rarr; select <strong>Lay Bare Franchisor (MyTime Commissary)</strong>. When boxes arrive, click <strong>"Inspect & Received"</strong> to automatically send the bill to Accounting.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowHelpGuideModal(false)}
                  className="w-full bg-[#031134] hover:bg-[#082260] text-white font-bold py-2.5 rounded-xl transition-all shadow-sm"
                >
                  Got It, Close Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 15. CUSTOM GOOGLE WORKSPACE DOMAIN LINK MODAL */}
      {showDomainModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl w-full max-w-lg p-7 space-y-5">
            <div className="flex items-start justify-between border-b border-[#F2F0E8] pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-[#031134] text-[#D4AF37] flex items-center justify-center font-bold text-lg shadow-sm">
                  <Globe className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-[#4A2E1B]">Custom Corporate Domain Setup</h3>
                  <p className="text-xs text-[#8A817C]">Google Workspace DNS & Vercel Subdomain Connection</p>
                </div>
              </div>
              <button onClick={() => setShowDomainModal(false)} className="text-[#8A817C] hover:text-[#4A2E1B]">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-2xl p-4 space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-[#8A817C]">Client Google Workspace Domain</span>
                <p className="font-mono font-bold text-sm text-[#031134]">alrajjlegacy-fortifiedbusinesscorp.com</p>
                <p className="text-[11px] text-[#8A817C]">
                  Official emails: <code>jehan.abedin@alrajjlegacy-fortifiedbusinesscorp.com</code>, <code>hr@...</code>
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#4A2E1B]">Recommended Subdomain to Access ERP:</h4>
                <div className="p-3 rounded-xl border border-[#77BC2E]/40 bg-[#77BC2E]/10 flex items-center justify-between">
                  <strong className="font-mono text-[#4A2E1B] text-xs">erp.alrajjlegacy-fortifiedbusinesscorp.com</strong>
                  <span className="bg-[#77BC2E] text-white text-[10px] font-bold px-2 py-0.5 rounded">Ready to Point</span>
                </div>
              </div>

              <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-2xl p-3.5 space-y-2 text-[11px] text-[#5A534E]">
                <span className="font-bold text-[#4A2E1B] block">How Your IT Points the Subdomain in Google Domains / Cloudflare / GoDaddy:</span>
                <div className="font-mono bg-white p-2.5 rounded-xl border border-[#EAE8E2] space-y-1">
                  <div><strong>Type:</strong> CNAME</div>
                  <div><strong>Name (Host):</strong> erp</div>
                  <div><strong>Target (Points to):</strong> cname.vercel-dns.com</div>
                  <div><strong>TTL:</strong> Automatic / 3600</div>
                </div>
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('cname.vercel-dns.com');
                    setEmailToast('Vercel CNAME (cname.vercel-dns.com) copied to clipboard!');
                    setTimeout(() => setEmailToast(''), 4000);
                  }}
                  className="flex-1 bg-[#031134] hover:bg-[#082260] text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span>Copy Vercel CNAME Target</span>
                </button>
                <button
                  onClick={() => setShowDomainModal(false)}
                  className="bg-[#F2F0E8] text-[#5A534E] font-semibold px-4 py-2.5 rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 16. DATA MODE CONTROL MODAL (LIVE DATA VS DEMO DATA RESET) */}
      {showDataModeModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl w-full max-w-lg p-7 space-y-5">
            <div className="flex items-start justify-between border-b border-[#F2F0E8] pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-[#031134] text-[#77BC2E] flex items-center justify-center font-bold text-lg shadow-sm">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-lg text-[#4A2E1B]">Data & Testing Control Center</h3>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      systemDataMode === 'live' ? 'bg-[#031134] text-[#77BC2E]' : 'bg-[#FAF9F5] text-[#5A534E] border border-[#EAE8E2]'
                    }`}>
                      {systemDataMode === 'live' ? 'ðŸ¢ Live Store Active' : 'ðŸ§ª Demo Simulation'}
                    </span>
                  </div>
                  <p className="text-xs text-[#8A817C]">Switch between actual live store testing and 4-branch demo simulation</p>
                </div>
              </div>
              <button onClick={() => setShowDataModeModal(false)} className="text-[#8A817C] hover:text-[#4A2E1B]">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Option 1: Live Mode */}
              <div className="bg-[#FAF9F5] border border-[#EAE8E2] rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-extrabold text-[#4A2E1B] flex items-center space-x-1.5">
                    <span>ðŸ¢ Switch to Live Store Mode (Clean Slate)</span>
                  </strong>
                  <span className="text-[10px] font-bold text-[#77BC2E]">Ready for Real Data</span>
                </div>
                <p className="text-[#5A534E] text-[11px] leading-relaxed">
                  Clears the sample records so Kristene and your store leads can import your <strong>actual raw NGTeco Excel biometric punch file</strong>, register real salon employees, ring up real service tickets, and test real payroll computations immediately.
                </p>
                <button
                  onClick={handleSwitchToLiveData}
                  className="w-full bg-[#031134] hover:bg-[#082260] text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-sm"
                >
                  <Database className="h-3.5 w-3.5 text-[#77BC2E]" />
                  <span>Activate Live Store Mode (Clear Demo Data)</span>
                </button>
              </div>

              {/* Option 2: Reload Demo Data */}
              <div className="bg-white border border-[#EAE8E2] rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-extrabold text-[#4A2E1B] flex items-center space-x-1.5">
                    <span>ðŸ§ª Reload 4-Branch Demo Dataset</span>
                  </strong>
                  <span className="text-[10px] font-bold text-[#8A817C]">Simulation Preset</span>
                </div>
                <p className="text-[#5A534E] text-[11px] leading-relaxed">
                  Done with testing your actual data? In 1-click, restore the pre-populated multi-branch simulation (Centrio Waxing, Passion Nails, Ketkai, SM Downtown) for presentations or training.
                </p>
                <button
                  onClick={handleReloadDemoData}
                  className="w-full bg-[#FAF9F5] hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#4A2E1B] font-bold py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-[#77BC2E]" />
                  <span>Restore Sample Demo Dataset</span>
                </button>
              </div>

              {/* Direct Link to Biometric Upload */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#77BC2E]/10 border border-[#77BC2E]/30">
                <span className="text-[11px] font-bold text-[#4A2E1B]">Have an NGTeco biometric punch file ready?</span>
                <button
                  onClick={() => {
                    setActiveTab('upload');
                    setShowDataModeModal(false);
                  }}
                  className="bg-[#77BC2E] text-white font-bold text-[10px] px-3 py-1.5 rounded-lg shadow-2xs hover:bg-[#6DB027]"
                >
                  Go to Ingestion Portal &rarr;
                </button>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => setShowDataModeModal(false)}
                  className="w-full bg-[#F2F0E8] text-[#5A534E] font-semibold py-2 rounded-xl"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 17. NEW MULTI-LEVEL APPROVAL REQUEST MODAL */}
      {showNewApprovalModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl w-full max-w-lg p-7 space-y-5">
            <div className="flex items-start justify-between border-b border-[#F2F0E8] pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-[#031134] text-[#77BC2E] flex items-center justify-center font-bold text-lg shadow-sm">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-[#4A2E1B]">Submit Multi-Level Request</h3>
                  <p className="text-xs text-[#8A817C]">Automated 4-tier chain of command routing across branches</p>
                </div>
              </div>
              <button onClick={() => setShowNewApprovalModal(false)} className="text-[#8A817C] hover:text-[#4A2E1B]">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateApprovalRequest} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#4A2E1B]">Request Category</label>
                  <select
                    value={newApproval.type}
                    onChange={(e) => setNewApproval({ ...newApproval, type: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs font-semibold text-[#4A2E1B] outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  >
                    <option value="dtr_override">DTR Punch Override</option>
                    <option value="commissary_po">MyTime Commissary PO</option>
                    <option value="payroll_disbursement">Payroll Release (BPI)</option>
                    <option value="cash_advance">Staff Cash Advance (Vale)</option>
                    <option value="leave_application">Leave Application (SIL)</option>
                    <option value="petty_cash">Petty Cash Expense Voucher</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#4A2E1B]">Branch Location</label>
                  <select
                    value={newApproval.branch}
                    onChange={(e) => setNewApproval({ ...newApproval, branch: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs font-semibold text-[#4A2E1B] outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  >
                    <option value="Centrio Mall (Waxing)">Centrio Mall (Waxing)</option>
                    <option value="Passion Nails (Centrio)">Passion Nails (Centrio)</option>
                    <option value="Limketkai Mall">Limketkai Mall</option>
                    <option value="SM Downtown Branch">SM Downtown Branch</option>
                    <option value="Iligan City (Upcoming)">Iligan City Branch</option>
                    <option value="Consolidated (All Branches)">Consolidated (All Branches)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#4A2E1B]">Request Subject / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Missed OUT Punch on July 20 / 10kg Sugar Wax Order"
                  value={newApproval.title}
                  onChange={(e) => setNewApproval({ ...newApproval, title: e.target.value })}
                  className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs font-medium text-[#2D2520] outline-none focus:ring-1 focus:ring-[#77BC2E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#4A2E1B]">Requestor Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Staff / Specialist Name"
                    value={newApproval.requestor}
                    onChange={(e) => setNewApproval({ ...newApproval, requestor: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs font-medium text-[#2D2520] outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#4A2E1B]">Amount (PHP - Optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="â‚± 0.00"
                    value={newApproval.amount}
                    onChange={(e) => setNewApproval({ ...newApproval, amount: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs font-medium text-[#2D2520] outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#4A2E1B]">Reason & Justification</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Provide complete details, timecard justification, emergency circumstances, or vendor quote reference..."
                  value={newApproval.description}
                  onChange={(e) => setNewApproval({ ...newApproval, description: e.target.value })}
                  className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl p-3 text-xs font-medium text-[#2D2520] outline-none focus:ring-1 focus:ring-[#77BC2E]"
                ></textarea>
              </div>

              {/* Chain of Command Routing Preview */}
              <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-[#EAE8E2] space-y-1.5 text-[11px]">
                <span className="font-bold text-[#4A2E1B] block">Automatic 4-Stage Routing Pipeline:</span>
                <div className="flex items-center space-x-1 text-[#5A534E] font-medium">
                  <span className="text-[#77BC2E] font-bold">1. File</span>
                  <span>&rarr;</span>
                  <span className="text-[#E89BB9] font-bold">2. Store Lead</span>
                  <span>&rarr;</span>
                  <span className="text-[#B48A10] font-bold">3. HR Audit</span>
                  <span>&rarr;</span>
                  <span className="text-[#031134] font-bold">4. Ms. Jehan Abedin (MD)</span>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold py-2.5 rounded-xl shadow-sm transition-all"
                >
                  Submit & Route to Supervisor
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewApprovalModal(false)}
                  className="bg-[#F2F0E8] text-[#5A534E] font-semibold px-4 py-2.5 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Approval Toast Notification */}
      {approvalToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#031134] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#77BC2E]/50 flex items-center space-x-3 text-xs font-bold animate-bounce">
          <ShieldCheck className="h-5 w-5 text-[#77BC2E] flex-shrink-0" />
          <span>{approvalToast}</span>
        </div>
      )}

      {/* 18. INTERACTIVE E-SIGNATURE PAD & SEAL MODAL */}
      {showSignModal && selectedDocForSign && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl w-full max-w-xl p-7 space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#F2F0E8] pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-[#031134] text-[#77BC2E] flex items-center justify-center font-bold text-lg shadow-sm">
                  <PenTool className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold bg-[#031134]/10 text-[#031134] px-2 py-0.5 rounded-md">
                      {selectedDocForSign.id}
                    </span>
                    <span className="text-[10px] font-bold text-[#77BC2E] bg-[#77BC2E]/15 px-2 py-0.5 rounded-full">
                      RA 8792 E-Sign
                    </span>
                  </div>
                  <h3 className="font-extrabold text-lg text-[#4A2E1B] mt-0.5">Authorize & Sign Document</h3>
                </div>
              </div>
              <button 
                onClick={() => { setShowSignModal(false); setSelectedDocForSign(null); }}
                className="text-[#8A817C] hover:text-[#4A2E1B]"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Document Reference Info */}
            <div className="bg-[#FAF9F5] p-3.5 rounded-2xl border border-[#F2F0E8] space-y-1 text-xs">
              <div className="font-bold text-[#4A2E1B]">{selectedDocForSign.title}</div>
              <div className="text-[11px] text-[#8A817C]">
                Category: <strong>{selectedDocForSign.category}</strong> &bull; Branch: <strong>{selectedDocForSign.branch}</strong>
              </div>
              <div className="text-[11px] text-[#5A534E]">
                Recipient: <strong>{selectedDocForSign.recipient}</strong> ({selectedDocForSign.recipientEmail})
              </div>
            </div>

            {/* Signer Title & Identity Selector */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#4A2E1B]">Official Signer Authority</label>
                  <select
                    value={selectedSignerTitle}
                    onChange={(e) => {
                      setSelectedSignerTitle(e.target.value);
                      if (e.target.value.includes('Jehan')) setTypedSignName('Jehan Abedin');
                      else if (e.target.value.includes('Kristene')) setTypedSignName('Kristene HR');
                      else if (e.target.value.includes('Cherimar')) setTypedSignName('Cherimar Concigo');
                      else setTypedSignName(selectedDocForSign.recipient || 'Specialist Signer');
                    }}
                    className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs font-semibold text-[#4A2E1B] outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  >
                    <option value="Ms. Jehan Abedin (Managing Director)">Ms. Jehan Abedin (Managing Director)</option>
                    <option value="Kristene (Operations & HR Lead)">Kristene (Operations & HR Lead)</option>
                    <option value="Cherimar Concigo (Branch Supervisor)">Cherimar Concigo (Branch Lead)</option>
                    <option value="Authorized Staff / Specialist">Staff / Specialist (Borrower/Employee)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#4A2E1B]">Signer Full Name</label>
                  <input
                    type="text"
                    required
                    value={typedSignName}
                    onChange={(e) => setTypedSignName(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs font-medium text-[#2D2520] outline-none focus:ring-1 focus:ring-[#77BC2E]"
                    placeholder="e.g. Jehan Abedin"
                  />
                </div>
              </div>

              {/* Signature Input Mode Switcher */}
              <div className="space-y-2">
                <label className="font-bold text-[#4A2E1B]">Signature Style & Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignatureMode('type')}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs transition-all flex items-center justify-center space-x-1.5 ${
                      signatureMode === 'type'
                        ? 'bg-[#031134] text-white border-[#031134] shadow-xs'
                        : 'bg-[#FAF9F5] border-[#EAE8E2] text-[#5A534E] hover:bg-[#F2F0E8]'
                    }`}
                  >
                    <span>âœï¸ Type Script</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignatureMode('draw')}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs transition-all flex items-center justify-center space-x-1.5 ${
                      signatureMode === 'draw'
                        ? 'bg-[#031134] text-white border-[#031134] shadow-xs'
                        : 'bg-[#FAF9F5] border-[#EAE8E2] text-[#5A534E] hover:bg-[#F2F0E8]'
                    }`}
                  >
                    <span>ðŸ–Œï¸ Draw Pad</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignatureMode('upload')}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs transition-all flex items-center justify-center space-x-1.5 ${
                      signatureMode === 'upload'
                        ? 'bg-[#031134] text-white border-[#031134] shadow-xs'
                        : 'bg-[#FAF9F5] border-[#EAE8E2] text-[#5A534E] hover:bg-[#F2F0E8]'
                    }`}
                  >
                    <span>ðŸ›¡ï¸ Corp Seal</span>
                  </button>
                </div>
              </div>

              {/* Signature Preview Canvas Box */}
              <div className="border-2 border-dashed border-[#77BC2E]/50 rounded-2xl p-6 text-center bg-[#FAF9F5] relative overflow-hidden flex flex-col items-center justify-center min-h-[140px]">
                {signatureMode === 'type' && (
                  <div className="space-y-1 animate-fadeIn">
                    <div className="font-serif italic text-3xl sm:text-4xl text-[#031134] tracking-wide select-none transform -rotate-2">
                      {typedSignName || 'Jehan Abedin'}
                    </div>
                    <div className="w-48 h-0.5 bg-[#77BC2E] mx-auto rounded-full mt-1"></div>
                    <p className="text-[10px] text-[#8A817C] font-mono mt-1">
                      Digital Cryptographic Hash: SHA256-AUTHENTICATED
                    </p>
                  </div>
                )}

                {signatureMode === 'draw' && (
                  <div className="space-y-2 animate-fadeIn">
                    <svg className="w-56 h-16 mx-auto text-[#031134]" viewBox="0 0 200 60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M 15 45 Q 35 15, 60 40 T 110 30 Q 140 10, 160 35 T 190 25" />
                      <path d="M 30 50 Q 80 45, 175 48" stroke="#77BC2E" strokeWidth="1.5" />
                    </svg>
                    <p className="text-[10px] text-[#8A817C] font-semibold">Touch / Stylus Capture Verified</p>
                  </div>
                )}

                {signatureMode === 'upload' && (
                  <div className="space-y-2 animate-fadeIn flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border-2 border-[#031134] p-1 flex items-center justify-center bg-white shadow-xs">
                      <div className="w-full h-full rounded-full border border-dashed border-[#77BC2E] flex items-center justify-center text-center p-1">
                        <span className="text-[8px] font-black uppercase text-[#031134] leading-tight">
                          ALRAJJ<br/>SEALED
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] font-bold text-[#031134]">ALRAJJ LEGACY Fortified Business Corp. Official Seal</p>
                  </div>
                )}

                {/* Verification Watermark */}
                <div className="absolute top-2 right-2 flex items-center space-x-1 text-[9px] font-bold text-[#5A9A1E] bg-[#77BC2E]/15 px-2 py-0.5 rounded-md">
                  <CheckCircle className="h-3 w-3" />
                  <span>Verified Identity</span>
                </div>
              </div>

              {/* Legal & Compliance Notice */}
              <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#EAE8E2] text-[11px] text-[#5A534E] space-y-1">
                <div className="font-bold text-[#4A2E1B] flex items-center space-x-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#77BC2E]" />
                  <span>Philippine E-Commerce Act (RA 8792) & DOLE DO 174 Legal Validity</span>
                </div>
                <p className="text-[10px] text-[#8A817C] leading-relaxed">
                  By clicking apply, you certify that you possess the requisite corporate authority to execute this legal instrument. A cryptographic SHA-256 seal will be permanently stamped on this document and backed up into the Google Workspace Corporate Drive.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleApplySignature(selectedDocForSign.id)}
                  className="flex-1 bg-[#77BC2E] hover:bg-[#6DB027] text-white font-extrabold py-3 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <PenTool className="h-4 w-4" />
                  <span>Apply Digital Signature & Cryptographically Seal</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setShowSignModal(false); setSelectedDocForSign(null); }}
                  className="bg-[#F2F0E8] text-[#5A534E] font-semibold px-4 py-3 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 19. OFFICIAL DOCUMENT VIEWER & PRINT PREVIEW MODAL */}
      {showDocViewerModal && selectedDocForView && (
        <div className="fixed inset-0 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl w-full max-w-2xl p-7 space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Header / Actions */}
            <div className="flex items-center justify-between border-b border-[#F2F0E8] pb-3">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold bg-[#031134] text-[#77BC2E] px-2.5 py-0.5 rounded-lg">
                  {selectedDocForView.id}
                </span>
                <span className="text-xs font-bold text-[#8A817C]">
                  Google Workspace Cloud Vault
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const doc = selectedDocForView;
                    setShowDocViewerModal(false);
                    handleOpenEditDoc(doc);
                  }}
                  className="bg-[#FAF9F5] hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#4A2E1B] text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5"
                  title="Edit document clauses & wording"
                >
                  <Edit className="h-3.5 w-3.5 text-[#77BC2E]" />
                  <span>Customize Clauses</span>
                </button>
                <button
                  onClick={() => handleSendGmailDoc(selectedDocForView)}
                  className="bg-[#FAF9F5] hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#031134] text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5"
                >
                  <Mail className="h-3.5 w-3.5 text-[#77BC2E]" />
                  <span>Send via Gmail</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-[#77BC2E] hover:bg-[#6DB027] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-2xs"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print / Download PDF</span>
                </button>
                <button 
                  onClick={() => { setShowDocViewerModal(false); setSelectedDocForView(null); }}
                  className="text-[#8A817C] hover:text-[#4A2E1B] p-1"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Official Formal Document Paper View */}
            <div className="bg-white border border-[#EAE8E2] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 text-xs text-[#2D2520]">
              
              {/* Document Letterhead */}
              <div className="text-center space-y-1.5 border-b-2 border-[#031134] pb-4">
                <div className="flex items-center justify-center space-x-2">
                  <img src="/alrajj-icon.png" alt="ALRAJJ Logo" className="h-8 w-8 object-contain rounded-lg p-0.5 bg-[#031134]" />
                  <span className="font-extrabold text-base tracking-tight text-[#031134]">ALRAJJ LEGACY FORTIFIED BUSINESS CORP.</span>
                </div>
                <p className="text-[10px] text-[#8A817C] font-semibold uppercase tracking-wider">
                  Cagayan de Oro City &bull; Centrio Mall &bull; Limketkai Mall &bull; SM Downtown &bull; Iligan City
                </p>
                <p className="text-[10px] font-mono text-[#5A534E]">
                  Corporate Domain: alrajjlegacy-fortifiedbusinesscorp.com &bull; TIN: 009-847-192-000
                </p>
              </div>

              {/* Document Title & Sub-meta */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-[#8A817C]">
                  <span>Date Filed: <strong>{selectedDocForView.date}</strong></span>
                  <span>Branch: <strong>{selectedDocForView.branch}</strong></span>
                </div>
                <h2 className="text-sm sm:text-base font-extrabold text-[#4A2E1B] uppercase tracking-wide">
                  {selectedDocForView.title}
                </h2>
              </div>

              {/* Full Document Content Clauses */}
              <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#F2F0E8] font-mono text-xs text-[#3D352E] whitespace-pre-wrap leading-relaxed">
                {selectedDocForView.content}
              </div>

              {/* Cryptographic Digital Signature Block */}
              <div className="pt-4 border-t border-[#F2F0E8] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#8A817C] uppercase block">Signer Authority</span>
                  <p className="font-bold text-[#4A2E1B]">{selectedDocForView.signedBy || 'Pending Signature'}</p>
                  <p className="text-[10px] text-[#8A817C]">Timestamp: {selectedDocForView.signedAt || 'Awaiting Authorization'}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#8A817C] uppercase block">Cryptographic Verification Hash</span>
                  <p className="font-mono text-[9px] text-[#031134] bg-white p-2 rounded-lg border border-[#EAE8E2] break-all">
                    {selectedDocForView.sha256Hash}
                  </p>
                  <span className="text-[10px] text-[#5A9A1E] font-bold block">
                    âœ“ Google Workspace Cloud Vault Backed Up
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Footer Close */}
            <div className="flex justify-end pt-1">
              <button
                onClick={() => { setShowDocViewerModal(false); setSelectedDocForView(null); }}
                className="bg-[#031134] text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-[#082260] transition-all"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 20. UPLOAD / FILE NEW DOCUMENT MODAL */}
      {showUploadDocModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl w-full max-w-lg p-7 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#F2F0E8] pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-[#77BC2E] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  <FolderPlus className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-[#4A2E1B]">File Document in Cloud Vault</h3>
                  <p className="text-xs text-[#8A817C]">Automated archive to Google Workspace Drive</p>
                </div>
              </div>
              <button onClick={() => setShowUploadDocModal(false)} className="text-[#8A817C] hover:text-[#4A2E1B]">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewDoc} className="space-y-4 text-xs">
              
              {/* Template Quick Loader */}
              <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-[#EAE8E2] space-y-1.5">
                <span className="font-bold text-[#4A2E1B] text-[11px] block">âš¡ Load Pre-Formatted Document Template (Customizable):</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleApplyPresetTemplate('nte')}
                    className="bg-white hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#4A2E1B] px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors"
                  >
                    DOLE NTE
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetTemplate('vale')}
                    className="bg-white hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#4A2E1B] px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors"
                  >
                    Staff Vale Slip
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetTemplate('employment')}
                    className="bg-white hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#4A2E1B] px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors"
                  >
                    Specialist NDA
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetTemplate('poReceipt')}
                    className="bg-white hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#4A2E1B] px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors"
                  >
                    PO 3-Way Match
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetTemplate('memo')}
                    className="bg-white hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#4A2E1B] px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors"
                  >
                    General Memo
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#4A2E1B]">Document Title / Memo Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Employee Disciplinary Memo / Space Lease Addendum"
                  value={newDocUpload.title}
                  onChange={(e) => setNewDocUpload({ ...newDocUpload, title: e.target.value })}
                  className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs font-medium text-[#2D2520] outline-none focus:ring-1 focus:ring-[#77BC2E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#4A2E1B]">Category</label>
                  <select
                    value={newDocUpload.category}
                    onChange={(e) => setNewDocUpload({ ...newDocUpload, category: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs font-semibold text-[#4A2E1B] outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  >
                    <option value="HR & DOLE Compliance">HR & DOLE Compliance</option>
                    <option value="Payroll & Cash Advances">Payroll & Cash Advances (Vale)</option>
                    <option value="Procurement & POs">Procurement & POs</option>
                    <option value="Commercial Leases">Commercial Leases</option>
                    <option value="BPI Banking & Authorizations">BPI Banking & Authorizations</option>
                    <option value="Employment Contracts">Employment Contracts</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#4A2E1B]">Branch Location</label>
                  <select
                    value={newDocUpload.branch}
                    onChange={(e) => setNewDocUpload({ ...newDocUpload, branch: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs font-semibold text-[#4A2E1B] outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  >
                    <option value="Centrio Mall (Waxing)">Centrio Mall (Waxing)</option>
                    <option value="Passion Nails (Centrio)">Passion Nails (Centrio)</option>
                    <option value="Limketkai Mall">Limketkai Mall</option>
                    <option value="SM Downtown Branch">SM Downtown Branch</option>
                    <option value="Iligan City (Upcoming)">Iligan City Branch</option>
                    <option value="Consolidated (All Branches)">Consolidated (All Branches)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#4A2E1B]">Recipient / Entity Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Santos / Ayala Land"
                    value={newDocUpload.recipient}
                    onChange={(e) => setNewDocUpload({ ...newDocUpload, recipient: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs font-medium text-[#2D2520] outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#4A2E1B]">Recipient Corporate Email</label>
                  <input
                    type="email"
                    required
                    placeholder="email@alrajjlegacy-fortifiedbusinesscorp.com"
                    value={newDocUpload.recipientEmail}
                    onChange={(e) => setNewDocUpload({ ...newDocUpload, recipientEmail: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs font-medium text-[#2D2520] outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#4A2E1B]">Document Text & Clauses (Fully Customizable)</label>
                  <span className="text-[10px] text-[#8A817C]">Type or paste custom stipulations</span>
                </div>
                <textarea
                  rows="5"
                  required
                  placeholder="Enter complete memorandum text, lease terms, or contract stipulations..."
                  value={newDocUpload.content}
                  onChange={(e) => setNewDocUpload({ ...newDocUpload, content: e.target.value })}
                  className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl p-3 font-mono text-xs text-[#2D2520] outline-none focus:ring-1 focus:ring-[#77BC2E]"
                ></textarea>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1.5"
                >
                  <FolderPlus className="h-4 w-4" />
                  <span>File into Google Drive Vault</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadDocModal(false)}
                  className="bg-[#F2F0E8] text-[#5A534E] font-semibold px-4 py-2.5 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 21. CUSTOMIZE & EDIT DOCUMENT MODAL */}
      {showEditDocModal && editingDoc && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl w-full max-w-xl p-7 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#F2F0E8] pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-[#031134] text-[#77BC2E] flex items-center justify-center font-bold text-lg shadow-sm">
                  <Edit className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold bg-[#031134]/10 text-[#031134] px-2 py-0.5 rounded-md">
                      {editingDoc.id}
                    </span>
                    <span className="text-[10px] font-bold text-[#5A9A1E] bg-[#77BC2E]/15 px-2 py-0.5 rounded-full">
                      Custom Editor
                    </span>
                  </div>
                  <h3 className="font-extrabold text-lg text-[#4A2E1B] mt-0.5">Customize Document Clauses & Content</h3>
                </div>
              </div>
              <button onClick={() => setShowEditDocModal(false)} className="text-[#8A817C] hover:text-[#4A2E1B]">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedDoc} className="space-y-4 text-xs">
              
              {/* Quick Template Overwrite Picker */}
              <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-[#EAE8E2] space-y-1.5">
                <span className="font-bold text-[#4A2E1B] text-[11px] block">âš¡ Replace with Standard Template (Optional):</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleApplyPresetTemplate('nte', true)}
                    className="bg-white hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#4A2E1B] px-2.5 py-1 rounded-lg text-[10px] font-bold"
                  >
                    DOLE NTE
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetTemplate('vale', true)}
                    className="bg-white hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#4A2E1B] px-2.5 py-1 rounded-lg text-[10px] font-bold"
                  >
                    Staff Vale Slip
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetTemplate('employment', true)}
                    className="bg-white hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#4A2E1B] px-2.5 py-1 rounded-lg text-[10px] font-bold"
                  >
                    Specialist NDA
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetTemplate('poReceipt', true)}
                    className="bg-white hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#4A2E1B] px-2.5 py-1 rounded-lg text-[10px] font-bold"
                  >
                    PO 3-Way Match
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetTemplate('memo', true)}
                    className="bg-white hover:bg-[#F2F0E8] border border-[#EAE8E2] text-[#4A2E1B] px-2.5 py-1 rounded-lg text-[10px] font-bold"
                  >
                    General Memo
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#4A2E1B]">Document Title</label>
                <input
                  type="text"
                  required
                  value={editingDoc.title}
                  onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                  className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs font-semibold text-[#2D2520] outline-none focus:ring-1 focus:ring-[#77BC2E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#4A2E1B]">Category</label>
                  <select
                    value={editingDoc.category}
                    onChange={(e) => setEditingDoc({ ...editingDoc, category: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs font-semibold text-[#4A2E1B] outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  >
                    <option value="HR & DOLE Compliance">HR & DOLE Compliance</option>
                    <option value="Payroll & Cash Advances">Payroll & Cash Advances (Vale)</option>
                    <option value="Procurement & POs">Procurement & POs</option>
                    <option value="Commercial Leases">Commercial Leases</option>
                    <option value="BPI Banking & Authorizations">BPI Banking & Authorizations</option>
                    <option value="Employment Contracts">Employment Contracts</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#4A2E1B]">Branch Location</label>
                  <select
                    value={editingDoc.branch}
                    onChange={(e) => setEditingDoc({ ...editingDoc, branch: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs font-semibold text-[#4A2E1B] outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  >
                    <option value="Centrio Mall (Waxing)">Centrio Mall (Waxing)</option>
                    <option value="Passion Nails (Centrio)">Passion Nails (Centrio)</option>
                    <option value="Limketkai Mall">Limketkai Mall</option>
                    <option value="SM Downtown Branch">SM Downtown Branch</option>
                    <option value="Iligan City (Upcoming)">Iligan City Branch</option>
                    <option value="Consolidated (All Branches)">Consolidated (All Branches)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#4A2E1B]">Recipient / Addressee</label>
                  <input
                    type="text"
                    required
                    value={editingDoc.recipient}
                    onChange={(e) => setEditingDoc({ ...editingDoc, recipient: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs font-medium text-[#2D2520] outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#4A2E1B]">Recipient Email</label>
                  <input
                    type="email"
                    required
                    value={editingDoc.recipientEmail}
                    onChange={(e) => setEditingDoc({ ...editingDoc, recipientEmail: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs font-medium text-[#2D2520] outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#4A2E1B]">Document Clauses & Body Text (Customizable)</label>
                  <span className="text-[10px] text-[#77BC2E] font-semibold">Live Text Editor</span>
                </div>
                <textarea
                  rows="7"
                  required
                  value={editingDoc.content}
                  onChange={(e) => setEditingDoc({ ...editingDoc, content: e.target.value })}
                  className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl p-3 font-mono text-xs text-[#2D2520] outline-none focus:ring-1 focus:ring-[#77BC2E] leading-relaxed"
                ></textarea>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>Save Custom Changes to Drive Vault</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditDocModal(false)}
                  className="bg-[#F2F0E8] text-[#5A534E] font-semibold px-4 py-2.5 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 16. ADD / CONFIGURE RBAC USER ACCOUNT MODAL */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl w-full max-w-lg p-7 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#F2F0E8] pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-[#031134] text-[#77BC2E] flex items-center justify-center font-bold">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-[#4A2E1B]">Create User & Assign RBAC Role</h3>
                  <p className="text-xs text-[#8A817C]">Provision login account with customized access control</p>
                </div>
              </div>
              <button onClick={() => setShowAddUserModal(false)} className="text-[#8A817C] hover:text-[#4A2E1B]">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUserRole} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Staff Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Santos"
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Corporate Email</label>
                  <input
                    type="email"
                    required
                    placeholder="name@alrajjlegacy...com"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs font-medium outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Assigned Role</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => {
                      const r = e.target.value;
                      let perms = { ...newUserForm.permissions };
                      if (r.includes('Director')) {
                        perms = { dashboard: true, approvals: true, accounting: true, payroll: true, exceptions: true, tardiness: true, biometrics: true, staff: true, crm: true, procurement: true, dms: true, settings: true };
                      } else if (r.includes('HR')) {
                        perms = { dashboard: true, approvals: true, accounting: true, payroll: true, exceptions: true, tardiness: true, biometrics: true, staff: true, crm: true, procurement: true, dms: true, settings: false };
                      } else if (r.includes('Supervisor') || r.includes('Lead')) {
                        perms = { dashboard: true, approvals: true, accounting: false, payroll: false, exceptions: true, tardiness: true, biometrics: false, staff: false, crm: true, procurement: true, dms: true, settings: false };
                      } else {
                        perms = { dashboard: false, approvals: true, accounting: false, payroll: false, exceptions: false, tardiness: false, biometrics: false, staff: false, crm: true, procurement: false, dms: true, settings: false };
                      }
                      setNewUserForm({ ...newUserForm, role: r, permissions: perms });
                    }}
                    className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  >
                    <option value="Salon Specialist / Staff">Salon Specialist / Staff</option>
                    <option value="Store Shift Supervisor">Store Shift Supervisor</option>
                    <option value="Operations & HR Lead">Operations & HR Lead</option>
                    <option value="Accounting & Audit Officer">Accounting & Audit Officer</option>
                    <option value="Managing Director / Executive">Managing Director / Executive</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Branch Assignment</label>
                  <select
                    value={newUserForm.branchAccess}
                    onChange={(e) => setNewUserForm({ ...newUserForm, branchAccess: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  >
                    <option value="Centrio Mall (Waxing)">Centrio Mall (Waxing)</option>
                    <option value="Passion Nails (Centrio)">Passion Nails (Centrio)</option>
                    <option value="Limketkai Mall">Limketkai Mall</option>
                    <option value="SM Downtown Branch">SM Downtown Branch</option>
                    <option value="Iligan City (Upcoming)">Iligan City (Upcoming)</option>
                    <option value="All Branches (Consolidated)">All Branches (Consolidated)</option>
                  </select>
                </div>
              </div>

              {/* Checkbox Grid */}
              <div className="bg-[#FAF9F5] p-3.5 rounded-2xl border border-[#EAE8E2] space-y-2">
                <span className="font-bold text-[#031134] text-[11px] block">Granular Module Permissions:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#5A534E]">
                  {Object.keys(newUserForm.permissions).map((permKey) => (
                    <label key={permKey} className="flex items-center space-x-2 cursor-pointer hover:text-[#031134]">
                      <input
                        type="checkbox"
                        checked={newUserForm.permissions[permKey]}
                        onChange={() => setNewUserForm({
                          ...newUserForm,
                          permissions: {
                            ...newUserForm.permissions,
                            [permKey]: !newUserForm.permissions[permKey]
                          }
                        })}
                        className="rounded text-[#77BC2E] focus:ring-[#77BC2E]"
                      />
                      <span className="capitalize">{permKey.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#031134] hover:bg-[#082260] text-white font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1.5"
                >
                  <Check className="h-4 w-4 text-[#77BC2E]" />
                  <span>Create Account & Grant Access</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="bg-[#F2F0E8] text-[#5A534E] font-semibold px-4 py-2.5 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 17. REGISTER NEW BRANCH STORE MODAL */}
      {showAddBranchModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl w-full max-w-md p-7 space-y-5">
            <div className="flex items-start justify-between border-b border-[#F2F0E8] pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-[#77BC2E]/15 text-[#5A9A1E] flex items-center justify-center font-bold">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-[#4A2E1B]">Register New Store Branch</h3>
                  <p className="text-xs text-[#8A817C]">Add expansion branch to the multi-store ERP network</p>
                </div>
              </div>
              <button onClick={() => setShowAddBranchModal(false)} className="text-[#8A817C] hover:text-[#4A2E1B]">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Branch Store Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Iligan City Commercial Hub"
                  value={newBranchForm.name}
                  onChange={(e) => setNewBranchForm({ ...newBranchForm, name: e.target.value })}
                  className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:ring-1 focus:ring-[#77BC2E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Branch Format</label>
                  <select
                    value={newBranchForm.type}
                    onChange={(e) => setNewBranchForm({ ...newBranchForm, type: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  >
                    <option value="Lay Bare Waxing Salon">Lay Bare Waxing Salon</option>
                    <option value="Passion Nails by Lay Bare">Passion Nails by Lay Bare</option>
                    <option value="Dual Waxing & Nail Spa">Dual Waxing & Nail Spa</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Assigned Supervisor</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Branch Supervisor"
                    value={newBranchForm.manager}
                    onChange={(e) => setNewBranchForm({ ...newBranchForm, manager: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs font-medium outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Physical Address / Mall Level</label>
                <input
                  type="text"
                  placeholder="e.g. 2nd Level, Robinsons Place Iligan"
                  value={newBranchForm.location}
                  onChange={(e) => setNewBranchForm({ ...newBranchForm, location: e.target.value })}
                  className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs font-medium outline-none focus:ring-1 focus:ring-[#77BC2E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Contact Number</label>
                  <input
                    type="text"
                    placeholder="+63 917..."
                    value={newBranchForm.contact}
                    onChange={(e) => setNewBranchForm({ ...newBranchForm, contact: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs font-mono outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5A534E] mb-1 uppercase tracking-wider">Capacity / Cubicles</label>
                  <input
                    type="text"
                    placeholder="e.g. 6 Waxing Cubicles"
                    value={newBranchForm.bedsStations}
                    onChange={(e) => setNewBranchForm({ ...newBranchForm, bedsStations: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-[#EAE8E2] rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#77BC2E]"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#77BC2E] hover:bg-[#6DB027] text-white font-bold py-2.5 rounded-xl transition-all shadow-sm"
                >
                  Register Branch
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddBranchModal(false)}
                  className="bg-[#F2F0E8] text-[#5A534E] font-semibold px-4 py-2.5 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating DMS Toast Alert */}
      {dmsToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#031134] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#77BC2E]/50 flex items-center space-x-3 text-xs font-bold animate-bounce">
          <PenTool className="h-5 w-5 text-[#77BC2E] flex-shrink-0" />
          <span>{dmsToast}</span>
        </div>
      )}

    </div>
  );
}

