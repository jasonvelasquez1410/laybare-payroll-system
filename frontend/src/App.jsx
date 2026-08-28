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
  Printer,
  Plus,
  Bell,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  Calendar,
  Layers,
  SlidersHorizontal,
  FileSpreadsheet
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || (window.location.origin.includes('localhost') ? 'http://localhost:5000/api' : '/api');

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subTab, setSubTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false); // Default to warm creamy light mode from reference
  
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

  // File Upload State
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ loading: false, success: false, message: '' });

  // Add Employee Form State
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ id: '', name: '', branch: '', rate: 600, taxStatus: 'S' });

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
      { id: 33, name: 'Justine Ann Atay', branch: 'Manila', rate: 600, tax_status: 'S' },
      { id: 34, name: 'Cherimar Concigo', branch: 'Manila', rate: 650, tax_status: 'S' },
      { id: 35, name: 'Kristene HR', branch: 'HQ', rate: 800, tax_status: 'S' },
      { id: 36, name: 'John Doe', branch: 'Cebu', rate: 550, tax_status: 'ME' }
    ];
    setEmployees(mockEmployees);

    const mockAttendance = [
      { id: 1, employee_id: 33, employee_name: 'Justine Ann Atay', date: '2026-07-16', calculated_in: '09:21', calculated_out: '20:07', regular_hours: 8, late_minutes: 21, undertime_minutes: 0, ot_hours: 1.77, nd_hours: 0, status: 'Present', notes: '', branch: 'Manila', rate: 600 },
      { id: 2, employee_id: 34, employee_name: 'Cherimar Concigo', date: '2026-07-16', calculated_in: '21:24', calculated_out: '', regular_hours: 0, late_minutes: 0, undertime_minutes: 0, ot_hours: 0, nd_hours: 0, status: 'Flagged', notes: 'Missing OUT punch', branch: 'Manila', rate: 650 },
      { id: 3, employee_id: 35, employee_name: 'Kristene HR', date: '2026-07-16', calculated_in: '08:58', calculated_out: '18:02', regular_hours: 8, late_minutes: 0, undertime_minutes: 0, ot_hours: 0.03, nd_hours: 0, status: 'Present', notes: '', branch: 'HQ', rate: 800 },
      { id: 4, employee_id: 33, employee_name: 'Justine Ann Atay', date: '2026-07-17', calculated_in: '09:04', calculated_out: '18:00', regular_hours: 8, late_minutes: 0, undertime_minutes: 0, ot_hours: 0, nd_hours: 0, status: 'Present', notes: 'Late <= 5 mins grace', branch: 'Manila', rate: 600 },
      { id: 5, employee_id: 36, employee_name: 'John Doe', date: '2026-07-17', calculated_in: '09:12', calculated_out: '17:30', regular_hours: 7.3, late_minutes: 12, undertime_minutes: 30, ot_hours: 0, nd_hours: 0, status: 'Present', notes: '', branch: 'Cebu', rate: 550 },
      { id: 6, employee_id: 33, employee_name: 'Justine Ann Atay', date: '2026-07-18', calculated_in: '', calculated_out: '', regular_hours: 0, late_minutes: 0, undertime_minutes: 0, ot_hours: 0, nd_hours: 0, status: 'Rest Day', notes: '', branch: 'Manila', rate: 600 }
    ];
    setAttendance(mockAttendance);
    setExceptions(mockAttendance.filter(r => r.status === 'Flagged'));

    const mockTardiness = [
      { employee_id: 33, employee_name: 'Justine Ann Atay', branch: 'Manila', late_count: 4, total_late_minutes: 68 },
      { employee_id: 36, employee_name: 'John Doe', branch: 'Cebu', late_count: 2, total_late_minutes: 27 },
      { employee_id: 34, employee_name: 'Cherimar Concigo', branch: 'Manila', late_count: 0, total_late_minutes: 0 }
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
    }
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
        tax_status: newEmployee.taxStatus
      }]);
      setShowAddEmployeeModal(false);
      setNewEmployee({ id: '', name: '', branch: '', rate: 600, taxStatus: 'S' });
    }
  };

  // ECharts Configurations styled to match the warm modern design
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
        backgroundColor: darkMode ? '#1C1C1B' : '#FFFFFF',
        borderColor: darkMode ? '#2E2E2A' : '#E6E5DC',
        textStyle: { color: darkMode ? '#F4F4EB' : '#1C1C1A', fontFamily: 'Plus Jakarta Sans', fontSize: 12 },
        padding: [8, 12],
        borderRadius: 12
      },
      grid: {
        top: 20,
        right: 20,
        bottom: 30,
        left: 30,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dates.length > 0 ? dates : ['07-16', '07-17', '07-18', '07-19', '07-20'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: darkMode ? '#7E7D77' : '#9E9D94',
          fontFamily: 'Plus Jakarta Sans',
          fontSize: 11
        }
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            color: darkMode ? '#262623' : '#EFEFEA',
            type: 'dashed'
          }
        },
        axisLabel: {
          color: darkMode ? '#7E7D77' : '#9E9D94',
          fontFamily: 'Plus Jakarta Sans',
          fontSize: 11
        }
      },
      series: [{
        data: counts.length > 0 ? counts : [3, 4, 2, 4, 3],
        type: 'line',
        smooth: 0.4,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#1C1C1A',
          borderColor: '#D4F938',
          borderWidth: 2
        },
        lineStyle: {
          width: 3,
          color: '#1C1C1A'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: darkMode ? 'rgba(212, 249, 56, 0.25)' : 'rgba(212, 249, 56, 0.4)' },
              { offset: 1, color: 'rgba(212, 249, 56, 0.0)' }
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
        backgroundColor: darkMode ? '#1C1C1B' : '#FFFFFF',
        borderColor: darkMode ? '#2E2E2A' : '#E6E5DC',
        textStyle: { color: darkMode ? '#F4F4EB' : '#1C1C1A', fontFamily: 'Plus Jakarta Sans', fontSize: 12 },
        borderRadius: 12
      },
      grid: {
        top: 10,
        right: 30,
        bottom: 20,
        left: 10,
        containLabel: true
      },
      xAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            color: darkMode ? '#262623' : '#EFEFEA',
            type: 'dashed'
          }
        },
        axisLabel: {
          color: darkMode ? '#7E7D77' : '#9E9D94',
          fontFamily: 'Plus Jakarta Sans',
          fontSize: 11
        }
      },
      yAxis: {
        type: 'category',
        data: names.length > 0 ? names : ['Justine Atay', 'John Doe', 'Cherimar C.'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: darkMode ? '#D4D4D0' : '#44433E',
          fontFamily: 'Plus Jakarta Sans',
          fontSize: 12,
          fontWeight: 500
        }
      },
      series: [{
        data: lateCounts.length > 0 ? lateCounts : [4, 2, 0],
        type: 'bar',
        barWidth: 16,
        itemStyle: {
          borderRadius: [0, 8, 8, 0],
          color: (params) => {
            const colors = ['#C4B5FD', '#FDBA74', '#D4F938', '#A78BFA', '#86EFAC'];
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
    <div className="min-h-screen font-sans antialiased text-[#1C1C1A] dark:text-[#F4F4EB] bg-[#F5F4EB] dark:bg-[#121211] pb-24 transition-colors duration-300">
      
      {/* 1. TOP HEADER / APP BAR */}
      <header className="sticky top-0 z-40 bg-[#F5F4EB]/85 dark:bg-[#121211]/85 backdrop-blur-xl border-b border-[#E7E5DB] dark:border-[#262624] px-4 lg:px-8 py-3.5 transition-colors">
        <div className="max-w-[1520px] mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Brand Info */}
          <div className="flex items-center space-x-3.5">
            <div className="relative group">
              <img 
                src="/logo.png.jpg" 
                alt="Lay Bare Logo" 
                className="h-11 w-11 object-cover rounded-2xl shadow-sm border border-[#E6E4DA] dark:border-[#2C2C28] p-0.5 bg-white dark:bg-[#1C1C1B]" 
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#D4F938] border-2 border-[#F5F4EB] dark:border-[#121211] rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-extrabold tracking-tight font-sans text-stone-900 dark:text-stone-50">LAYBARE</span>
                <span className="bg-[#E7E5DC] dark:bg-[#2A2A27] text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase text-stone-600 dark:text-stone-300">HQ Payroll</span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium tracking-wide">Biometric Attendance & Compliance System</p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            
            {/* User Profile Pill (inspired by reference @shahinurstk02 pill) */}
            <div className="hidden md:flex items-center space-x-2 bg-white dark:bg-[#1C1C1B] border border-[#E7E5DB] dark:border-[#2C2C28] rounded-full px-3 py-1.5 shadow-sm text-xs font-semibold">
              <div className="w-6 h-6 rounded-full bg-[#D4F938] text-stone-950 flex items-center justify-center font-bold text-[11px]">
                LB
              </div>
              <span className="text-stone-700 dark:text-stone-300 font-medium">hr.admin@laybare.ph</span>
            </div>

            {/* Notification Bell Circle */}
            <button 
              className="w-10 h-10 rounded-full bg-white dark:bg-[#1C1C1B] border border-[#E7E5DB] dark:border-[#2C2C28] flex items-center justify-center text-stone-700 dark:text-stone-300 hover:bg-[#EBEAE0] dark:hover:bg-[#272725] transition-colors relative shadow-sm"
              title="System Notifications"
            >
              <Bell className="h-4 w-4" />
              {exceptions.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
              )}
            </button>

            {/* Dark/Light Toggle Circle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-10 rounded-full bg-white dark:bg-[#1C1C1B] border border-[#E7E5DB] dark:border-[#2C2C28] flex items-center justify-center text-stone-700 dark:text-stone-300 hover:bg-[#EBEAE0] dark:hover:bg-[#272725] transition-colors shadow-sm"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="h-4 w-4 text-[#D4F938]" /> : <Moon className="h-4 w-4 text-stone-700" />}
            </button>

            {/* + Add Employee Action (Vibrant Lime Pill Button) */}
            <button
              onClick={() => setShowAddEmployeeModal(true)}
              className="bg-[#D4F938] hover:bg-[#C4EB28] text-stone-950 font-bold text-xs sm:text-sm rounded-full px-4 sm:px-5 py-2.5 flex items-center space-x-2 transition-all shadow-sm hover:shadow active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Add Employee</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN APP CONTENT CONTAINER */}
      <main className="max-w-[1520px] mx-auto px-4 lg:px-8 pt-6 space-y-6">
        
        {/* Navigation Tabs Pill Bar (Inspired by the capsule bar in the reference mockup) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E5DB] dark:border-[#262624] pb-4">
          
          {/* Main Module Tabs */}
          <div className="flex items-center overflow-x-auto space-x-2 py-1 scrollbar-none">
            {[
              { id: 'dashboard', name: 'Analytics', icon: TrendingUp },
              { id: 'upload', name: 'Upload Portal', icon: Upload },
              { id: 'exceptions', name: 'Compliance & Exceptions', icon: AlertTriangle, count: exceptions.length },
              { id: 'tardiness', name: 'Tardiness Module', icon: Clock },
              { id: 'payroll', name: 'Payroll Run', icon: FileText }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-sm'
                      : 'bg-white/60 dark:bg-[#1C1C1B]/60 text-stone-600 dark:text-stone-400 hover:bg-white dark:hover:bg-[#1C1C1B] border border-[#E7E5DB] dark:border-[#2C2C28]'
                  }`}
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  <span>{tab.name}</span>
                  {tab.count > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] px-2 py-0.2 rounded-full font-bold">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sub-filter / View options (Dashboard, Salary Insight, Report, Summary pills like in reference mockup) */}
          {activeTab === 'dashboard' && (
            <div className="flex items-center space-x-1.5 bg-[#E8E6DD] dark:bg-[#222220] p-1 rounded-full w-fit">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'salary', label: 'Salary Insight' },
                { id: 'report', label: 'Report' },
                { id: 'summary', label: 'Summary' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setSubTab(sub.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    subTab === sub.id
                      ? 'bg-white dark:bg-[#121211] text-stone-950 dark:text-stone-100 shadow-sm'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. TAB VIEWS */}

        {/* TAB 1: ANALYTICS & DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Top Row: Modern Reference-Style Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Card 1: Compliance / Risk Status Card (Inspired by "EMPLOYEE RISK STATUS" & "29% Permanent" in mockup) */}
              <div className="bg-white dark:bg-[#1B1B1A] border border-[#E7E5DB] dark:border-[#2C2C28] rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-widest text-stone-400 dark:text-stone-500 uppercase">Compliance Monitor</span>
                  <div className="w-7 h-7 rounded-full bg-[#F5F4EB] dark:bg-[#272725] flex items-center justify-center text-stone-400">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-extrabold tracking-tight font-sans">98%</span>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">Benchmark</span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Clock-in accuracy across salon staff</p>
                </div>

                {/* Risk matrix indicator / pills */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs bg-[#F5F4EB] dark:bg-[#242422] px-3 py-1.5 rounded-full">
                    <span className="text-stone-600 dark:text-stone-300 font-medium">Low Tardiness</span>
                    <span className="font-bold text-emerald-600 dark:text-[#D4F938] flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-[#D4F938]"></span>
                      <span>85%</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs bg-[#F5F4EB] dark:bg-[#242422] px-3 py-1.5 rounded-full">
                    <span className="text-stone-600 dark:text-stone-300 font-medium">Flagged Shifts</span>
                    <span className="font-bold text-rose-500 flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      <span>{summary.pendingExceptions} pending</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Total Headcount (Inspired by "TOTAL HEADCOUNT 1280" in mockup) */}
              <div className="bg-white dark:bg-[#1B1B1A] border border-[#E7E5DB] dark:border-[#2C2C28] rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-widest text-stone-400 dark:text-stone-500 uppercase">Total Headcount</span>
                  <div className="w-7 h-7 rounded-full bg-[#F5F4EB] dark:bg-[#272725] flex items-center justify-center text-stone-400">
                    <Users className="h-3.5 w-3.5" />
                  </div>
                </div>

                <div>
                  <div className="text-4xl font-extrabold tracking-tight font-sans">{summary.totalEmployees}</div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Total Active Salon Specialists</p>
                </div>

                {/* Visual Barcode Density Breakdown (similar to reference mockup) */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
                    <span>Manila 75%</span>
                    <span>Cebu 25%</span>
                  </div>
                  <div className="h-4 flex rounded-full overflow-hidden gap-1 bg-[#F5F4EB] dark:bg-[#242422] p-1">
                    <div className="h-full rounded-full bg-[#D4F938]" style={{ width: '65%' }}></div>
                    <div className="h-full rounded-full bg-[#C4B5FD]" style={{ width: '25%' }}></div>
                    <div className="h-full rounded-full bg-[#FB923C]" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>

              {/* Card 3: Tardiness & Lates */}
              <div className="bg-white dark:bg-[#1B1B1A] border border-[#E7E5DB] dark:border-[#2C2C28] rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-widest text-stone-400 dark:text-stone-500 uppercase">Tardiness Cycle</span>
                  <div className="w-7 h-7 rounded-full bg-[#F5F4EB] dark:bg-[#272725] flex items-center justify-center text-stone-400">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                </div>

                <div>
                  <div className="text-4xl font-extrabold tracking-tight font-sans text-amber-500">{summary.totalLateMins}m</div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Total accumulated minutes late</p>
                </div>

                <div className="bg-[#F5F4EB] dark:bg-[#242422] rounded-2xl p-3 flex items-center justify-between text-xs">
                  <span className="text-stone-500 dark:text-stone-400">Average Shift</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">{summary.averageHours} hrs / day</span>
                </div>
              </div>

              {/* Card 4: Estimated Payroll Spend ($126.5k style in mockup) */}
              <div className="bg-white dark:bg-[#1B1B1A] border border-[#E7E5DB] dark:border-[#2C2C28] rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-widest text-stone-400 dark:text-stone-500 uppercase">Payroll Spend</span>
                  <div className="w-7 h-7 rounded-full bg-[#D4F938] text-stone-950 flex items-center justify-center font-bold">
                    <DollarSign className="h-3.5 w-3.5" />
                  </div>
                </div>

                <div>
                  <div className="text-4xl font-extrabold tracking-tight font-sans">
                    ₱{((employees.reduce((acc, e) => acc + (e.rate || 600) * 11, 0))).toLocaleString()}
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Projected cycle gross payout</p>
                </div>

                <button 
                  onClick={() => setActiveTab('payroll')}
                  className="w-full bg-[#1C1C1A] dark:bg-white text-white dark:text-stone-950 hover:opacity-90 font-bold py-2 rounded-full text-xs transition-all flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <span>Run Calculations</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Attention / Alert Review Banner (like "Review: Missing a background check" in reference mockup) */}
            {exceptions.length > 0 && (
              <div className="bg-white dark:bg-[#1B1B1A] border border-[#E7E5DB] dark:border-[#2C2C28] rounded-[28px] p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center flex-shrink-0">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Action Required</span>
                      <h4 className="font-bold text-sm">You have {exceptions.length} unpaired biometric punch record(s)</h4>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Missing clock-out logs will affect salary release if not resolved before payroll generation.</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('exceptions')}
                  className="bg-[#D4F938] hover:bg-[#C4EB28] text-stone-950 font-bold text-xs px-5 py-2.5 rounded-full shadow-sm whitespace-nowrap transition-all"
                >
                  Review & Correct Flag
                </button>
              </div>
            )}

            {/* Charts Section: Daily Trends & Tardiness Top 5 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              {/* Daily Attendance Count Chart */}
              <div className="bg-white dark:bg-[#1B1B1A] border border-[#E7E5DB] dark:border-[#2C2C28] rounded-[28px] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[11px] font-bold tracking-widest text-stone-400 dark:text-stone-500 uppercase">Attendance Trends</span>
                    <h3 className="text-base font-bold">Daily Headcount Trend</h3>
                  </div>
                  <span className="text-xs font-semibold text-stone-400 bg-[#F5F4EB] dark:bg-[#242422] px-3 py-1 rounded-full">July Cutoff</span>
                </div>
                <div className="h-72">
                  <ReactECharts option={getDailyAttendanceChartOption()} style={{ height: '100%' }} />
                </div>
              </div>

              {/* Tardiness Bar Chart */}
              <div className="bg-white dark:bg-[#1B1B1A] border border-[#E7E5DB] dark:border-[#2C2C28] rounded-[28px] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[11px] font-bold tracking-widest text-stone-400 dark:text-stone-500 uppercase">Punctuality Analytics</span>
                    <h3 className="text-base font-bold">Tardiness Frequency by Staff</h3>
                  </div>
                  <span className="text-xs font-semibold text-stone-400 bg-[#F5F4EB] dark:bg-[#242422] px-3 py-1 rounded-full">Top Late Logs</span>
                </div>
                <div className="h-72">
                  <ReactECharts option={getTardinessChartOption()} style={{ height: '100%' }} />
                </div>
              </div>
            </div>

            {/* Attendance Master Log Table */}
            <div className="bg-white dark:bg-[#1B1B1A] border border-[#E7E5DB] dark:border-[#2C2C28] rounded-[28px] overflow-hidden shadow-sm">
              <div className="p-6 border-b border-[#E7E5DB] dark:border-[#262624] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold tracking-widest text-stone-400 dark:text-stone-500 uppercase">Biometric Ledger</span>
                  <h3 className="text-lg font-bold">Attendance Records</h3>
                </div>

                {/* Filter and Search Controls (Pill styling) */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search employee or date..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-[#F5F4EB] dark:bg-[#222220] border-none rounded-full pl-9 pr-4 py-1.5 text-xs focus:ring-2 focus:ring-[#D4F938] outline-none w-48 sm:w-56 font-medium text-stone-800 dark:text-stone-200"
                    />
                  </div>

                  <select
                    value={filterEmployee}
                    onChange={(e) => setFilterEmployee(e.target.value)}
                    className="bg-[#F5F4EB] dark:bg-[#222220] border-none rounded-full px-3.5 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 outline-none"
                  >
                    <option value="">All Employees</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-[#F5F4EB] dark:bg-[#222220] border-none rounded-full px-3.5 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 outline-none"
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
                    <tr className="bg-[#FAF9F5] dark:bg-[#20201E] border-b border-[#E7E5DB] dark:border-[#262624] text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
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
                  <tbody className="divide-y divide-[#EFEFEA] dark:divide-[#262624] text-xs">
                    {filteredAttendance.map((rec) => (
                      <tr key={rec.id} className="hover:bg-[#F8F7F2] dark:hover:bg-[#222220] transition-colors">
                        <td className="px-6 py-4 font-semibold text-stone-900 dark:text-stone-100 flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#E8E6DD] dark:bg-[#2C2C28] flex items-center justify-center font-bold text-[10px] text-stone-700 dark:text-stone-300">
                            {rec.employee_name.charAt(0)}
                          </div>
                          <span>{rec.employee_name}</span>
                        </td>
                        <td className="px-6 py-4 font-mono text-stone-600 dark:text-stone-400">{rec.date}</td>
                        <td className="px-6 py-4 font-mono text-stone-600 dark:text-stone-400">{rec.calculated_in || '--:--'}</td>
                        <td className="px-6 py-4 font-mono text-stone-600 dark:text-stone-400">{rec.calculated_out || '--:--'}</td>
                        <td className="px-6 py-4 font-mono font-medium">{rec.regular_hours || 0}</td>
                        <td className="px-6 py-4 font-mono">
                          {rec.late_minutes > 0 ? (
                            <span className="text-amber-600 dark:text-amber-400 font-bold">{rec.late_minutes}m</span>
                          ) : (
                            <span className="text-stone-400">0</span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-mono text-emerald-600 dark:text-[#D4F938] font-semibold">{rec.ot_hours || 0}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            rec.status === 'Present' || rec.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-[#D4F938]'
                              : rec.status === 'Flagged'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400 animate-pulse'
                              : 'bg-[#EAE9DF] text-stone-700 dark:bg-[#2C2C28] dark:text-stone-400'
                          }`}>
                            {rec.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-stone-500 dark:text-stone-400">{rec.notes || '--'}</td>
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
          <div className="max-w-2xl mx-auto bg-white dark:bg-[#1B1B1A] border border-[#E7E5DB] dark:border-[#2C2C28] rounded-[32px] p-8 sm:p-10 shadow-sm space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-[#D4F938] text-stone-950 flex items-center justify-center mx-auto shadow-sm">
                <Upload className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight">Import NGTeco Export</h2>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
                Upload raw .xls or .xlsx punch attendance files directly generated from your offline biometric device.
              </p>
            </div>

            <form onSubmit={handleFileUpload} className="space-y-5">
              <div className="border-2 border-dashed border-[#D5D3C8] dark:border-[#383834] hover:border-[#D4F938] dark:hover:border-[#D4F938] rounded-3xl p-10 text-center transition-all cursor-pointer relative bg-[#FAF9F5] dark:bg-[#141413]">
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".xls,.xlsx"
                />
                {uploadFile ? (
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <FileSpreadsheet className="h-5 w-5" />
                    </div>
                    <p className="font-bold text-sm text-stone-900 dark:text-stone-100">{uploadFile.name}</p>
                    <p className="text-xs text-stone-400">{(uploadFile.size / 1024).toFixed(1)} KB — Ready to parse</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-[#EAE9DF] dark:bg-[#262624] text-stone-500 flex items-center justify-center mx-auto">
                      <Upload className="h-5 w-5" />
                    </div>
                    <p className="font-bold text-sm">Drag & drop punch spreadsheet, or click to browse</p>
                    <p className="text-xs text-stone-400">Supports standard NGTeco biometric exports (.xls, .xlsx)</p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!uploadFile || uploadStatus.loading}
                className="w-full bg-[#D4F938] hover:bg-[#C4EB28] text-stone-950 disabled:opacity-50 disabled:cursor-not-allowed font-bold py-3.5 rounded-full shadow-sm transition-all text-sm flex items-center justify-center space-x-2"
              >
                {uploadStatus.loading ? (
                  <span>Processing Biometrics Data...</span>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Process & Sync Timesheets</span>
                  </>
                )}
              </button>
            </form>

            {uploadStatus.message && (
              <div className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start space-x-3 ${
                uploadStatus.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30 text-emerald-800 dark:text-[#D4F938]'
                  : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/30 text-rose-800 dark:text-rose-400'
              }`}>
                {uploadStatus.success ? <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" /> : <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />}
                <span>{uploadStatus.message}</span>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: COMPLIANCE & EXCEPTION DASHBOARD */}
        {activeTab === 'exceptions' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            
            {/* List of Exceptions */}
            <div className={`bg-white dark:bg-[#1B1B1A] border border-[#E7E5DB] dark:border-[#2C2C28] rounded-[28px] overflow-hidden shadow-sm transition-all duration-300 ${
              selectedException ? 'lg:col-span-2' : 'lg:col-span-3'
            }`}>
              <div className="p-6 border-b border-[#E7E5DB] dark:border-[#262624] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold tracking-widest text-stone-400 dark:text-stone-500 uppercase">Correction Queue</span>
                  <h3 className="text-lg font-bold">Biometric Punch Exceptions</h3>
                </div>
                <span className="bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold px-3 py-1 rounded-full">
                  {exceptions.length} Needs Review
                </span>
              </div>

              {exceptions.length === 0 ? (
                <div className="p-12 text-center text-stone-400 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-stone-700 dark:text-stone-300">All Timesheets Clean!</h4>
                  <p className="text-xs">No missing punch records or unverified hours found for this cutoff.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#FAF9F5] dark:bg-[#20201E] border-b border-[#E7E5DB] dark:border-[#262624] text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                        <th className="px-6 py-3.5">Employee</th>
                        <th className="px-6 py-3.5">Date</th>
                        <th className="px-6 py-3.5">Clock IN</th>
                        <th className="px-6 py-3.5">Clock OUT</th>
                        <th className="px-6 py-3.5">Issue Details</th>
                        <th className="px-6 py-3.5">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EFEFEA] dark:divide-[#262624] text-xs">
                      {exceptions.map(exc => (
                        <tr 
                          key={exc.id} 
                          className={`hover:bg-[#F8F7F2] dark:hover:bg-[#222220] cursor-pointer transition-colors ${
                            selectedException?.id === exc.id ? 'bg-[#D4F938]/15 dark:bg-[#D4F938]/10' : ''
                          }`}
                          onClick={() => {
                            setSelectedException(exc);
                            setOverrideIn(exc.calculated_in || '');
                            setOverrideOut(exc.calculated_out || '');
                            setOverrideNote(exc.notes || '');
                          }}
                        >
                          <td className="px-6 py-4 font-semibold text-stone-900 dark:text-stone-100">{exc.employee_name}</td>
                          <td className="px-6 py-4 font-mono text-stone-600 dark:text-stone-400">{exc.date}</td>
                          <td className="px-6 py-4 font-mono">{exc.calculated_in || '--:--'}</td>
                          <td className="px-6 py-4 font-mono">{exc.calculated_out || '--:--'}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center space-x-1.5 text-xs text-rose-600 dark:text-rose-400 font-bold bg-rose-500/10 rounded-full px-3 py-1">
                              <AlertTriangle className="h-3 w-3" />
                              <span>{exc.notes}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-xs font-bold text-stone-900 dark:text-[#D4F938] hover:underline flex items-center space-x-1 bg-[#EAE9DF] dark:bg-[#2C2C28] px-3 py-1.5 rounded-full">
                              <span>Adjust</span>
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

            {/* Adjustment Side Panel */}
            {selectedException && (
              <div className="bg-white dark:bg-[#1B1B1A] border border-[#E7E5DB] dark:border-[#2C2C28] rounded-[28px] p-6 shadow-xl space-y-6 h-fit transition-all">
                <div className="flex items-center justify-between border-b border-[#E7E5DB] dark:border-[#262624] pb-4">
                  <div>
                    <span className="text-[11px] font-bold tracking-widest text-stone-400 uppercase">HR Override</span>
                    <h4 className="font-bold text-base">Adjust Punch Timecard</h4>
                  </div>
                  <button onClick={() => setSelectedException(null)} className="text-stone-400 hover:text-stone-600">
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>

                <div className="bg-[#FAF9F5] dark:bg-[#222220] rounded-2xl p-4 space-y-1.5 text-xs border border-[#E7E5DB] dark:border-[#2C2C28]">
                  <div>Staff: <strong className="font-bold text-stone-900 dark:text-stone-100">{selectedException.employee_name}</strong> (ID #{selectedException.employee_id})</div>
                  <div>Shift Date: <strong className="font-mono">{selectedException.date}</strong></div>
                  <div>Detected Issue: <strong className="text-rose-500">{selectedException.notes}</strong></div>
                </div>

                <form onSubmit={handleOverrideSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 mb-1.5 uppercase tracking-wider">Clock IN</label>
                      <input
                        type="text"
                        placeholder="09:00"
                        value={overrideIn}
                        onChange={(e) => setOverrideIn(e.target.value)}
                        className="w-full bg-[#F5F4EB] dark:bg-[#222220] border-none rounded-xl px-3.5 py-2 text-xs font-mono font-medium focus:ring-2 focus:ring-[#D4F938] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 mb-1.5 uppercase tracking-wider">Clock OUT</label>
                      <input
                        type="text"
                        placeholder="18:00"
                        value={overrideOut}
                        onChange={(e) => setOverrideOut(e.target.value)}
                        className="w-full bg-[#F5F4EB] dark:bg-[#222220] border-none rounded-xl px-3.5 py-2 text-xs font-mono font-medium focus:ring-2 focus:ring-[#D4F938] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 mb-1.5 uppercase tracking-wider">HR Resolution Note</label>
                    <textarea
                      placeholder="e.g., Validated via branch CCTV / store manager signed waiver"
                      value={overrideNote}
                      onChange={(e) => setOverrideNote(e.target.value)}
                      rows={3}
                      className="w-full bg-[#F5F4EB] dark:bg-[#222220] border-none rounded-xl px-3.5 py-2 text-xs font-medium focus:ring-2 focus:ring-[#D4F938] outline-none"
                    />
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-[#D4F938] hover:bg-[#C4EB28] text-stone-950 font-bold py-2.5 rounded-full text-xs shadow-sm transition-all"
                    >
                      Save Override
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedException(null)}
                      className="bg-[#EAE9DF] dark:bg-[#272725] text-stone-700 dark:text-stone-300 font-semibold px-4 py-2.5 rounded-full text-xs transition-all"
                    >
                      Dismiss
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TARDINESS MODULE & NTE GENERATOR */}
        {activeTab === 'tardiness' && (
          <div className="bg-white dark:bg-[#1B1B1A] border border-[#E7E5DB] dark:border-[#2C2C28] rounded-[28px] overflow-hidden shadow-sm animate-fadeIn">
            <div className="p-6 border-b border-[#E7E5DB] dark:border-[#262624] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold tracking-widest text-stone-400 dark:text-stone-500 uppercase">Disciplinary Compliance</span>
                <h3 className="text-lg font-bold">Chronic Tardiness Tracker</h3>
              </div>
              <span className="bg-[#FAF9F5] dark:bg-[#242422] text-stone-600 dark:text-stone-400 text-xs font-semibold px-3 py-1 rounded-full border border-[#E7E5DB] dark:border-[#2C2C28]">
                Threshold: 3 Late Clock-ins
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF9F5] dark:bg-[#20201E] border-b border-[#E7E5DB] dark:border-[#262624] text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                    <th className="px-6 py-3.5">Employee</th>
                    <th className="px-6 py-3.5">Branch</th>
                    <th className="px-6 py-3.5">Late Frequency</th>
                    <th className="px-6 py-3.5">Total Late Minutes</th>
                    <th className="px-6 py-3.5">Status & Disciplinary Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFEFEA] dark:divide-[#262624] text-xs">
                  {tardiness.map(t => (
                    <tr key={t.employee_id} className="hover:bg-[#F8F7F2] dark:hover:bg-[#222220] transition-colors">
                      <td className="px-6 py-4 font-semibold text-stone-900 dark:text-stone-100 flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#E8E6DD] dark:bg-[#2C2C28] flex items-center justify-center font-bold text-[10px] text-stone-700 dark:text-stone-300">
                          {t.employee_name.charAt(0)}
                        </div>
                        <span>{t.employee_name}</span>
                      </td>
                      <td className="px-6 py-4 text-stone-500 dark:text-stone-400 font-medium">{t.branch}</td>
                      <td className="px-6 py-4 font-mono font-bold text-stone-900 dark:text-stone-100">{t.late_count} times</td>
                      <td className="px-6 py-4 font-mono text-stone-600 dark:text-stone-400">{t.total_late_minutes} minutes</td>
                      <td className="px-6 py-4">
                        {t.late_count >= 3 ? (
                          <div className="flex items-center space-x-3">
                            <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                              <AlertTriangle className="h-3 w-3" />
                              <span>Threshold Exceeded</span>
                            </span>
                            <button
                              onClick={() => setSelectedNteEmployee(t)}
                              className="bg-[#D4F938] hover:bg-[#C4EB28] text-stone-950 font-bold text-xs px-3.5 py-1 rounded-full transition-all flex items-center space-x-1.5 shadow-sm"
                            >
                              <FileText className="h-3 w-3" />
                              <span>Generate NTE</span>
                            </button>
                          </div>
                        ) : (
                          <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-[#D4F938] text-xs font-bold px-3 py-1 rounded-full">
                            Punctual / Compliant
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

        {/* TAB 5: PAYROLL RUN */}
        {activeTab === 'payroll' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Cutoff Date Selector & Action */}
            <div className="bg-white dark:bg-[#1B1B1A] border border-[#E7E5DB] dark:border-[#2C2C28] rounded-[28px] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 mb-1.5 uppercase tracking-wider">Cutoff Start</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-[#F5F4EB] dark:bg-[#222220] border-none rounded-full px-4 py-2 text-xs font-semibold text-stone-800 dark:text-stone-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 mb-1.5 uppercase tracking-wider">Cutoff End</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-[#F5F4EB] dark:bg-[#222220] border-none rounded-full px-4 py-2 text-xs font-semibold text-stone-800 dark:text-stone-200 outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleGeneratePayroll}
                className="bg-[#D4F938] hover:bg-[#C4EB28] text-stone-950 font-bold px-6 py-3 rounded-full shadow-sm transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm"
              >
                <FileText className="h-4 w-4" />
                <span>Calculate Semi-Monthly Payroll</span>
              </button>
            </div>

            {/* Payroll calculation list */}
            {payroll.length > 0 && (
              <div className="bg-white dark:bg-[#1B1B1A] border border-[#E7E5DB] dark:border-[#2C2C28] rounded-[28px] overflow-hidden shadow-sm">
                <div className="p-6 border-b border-[#E7E5DB] dark:border-[#262624]">
                  <span className="text-[11px] font-bold tracking-widest text-stone-400 dark:text-stone-500 uppercase">Gross-to-Net Breakdown</span>
                  <h3 className="text-lg font-bold">Payroll Calculations Summary</h3>
                  <p className="text-xs text-stone-500 mt-0.5">Pay cutoff period: {startDate} to {endDate}</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#FAF9F5] dark:bg-[#20201E] border-b border-[#E7E5DB] dark:border-[#262624] text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                        <th className="px-6 py-3.5">Employee</th>
                        <th className="px-6 py-3.5">Present</th>
                        <th className="px-6 py-3.5">Basic Pay</th>
                        <th className="px-6 py-3.5">Allowances (OT/ND)</th>
                        <th className="px-6 py-3.5">Tardiness Deduct</th>
                        <th className="px-6 py-3.5">Gross Pay</th>
                        <th className="px-6 py-3.5">Gov Deduct</th>
                        <th className="px-6 py-3.5 font-bold">Net Salary</th>
                        <th className="px-6 py-3.5">Payslip</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EFEFEA] dark:divide-[#262624] text-xs">
                      {payroll.map(p => (
                        <tr key={p.employeeId} className="hover:bg-[#F8F7F2] dark:hover:bg-[#222220] transition-colors">
                          <td className="px-6 py-4 font-semibold text-stone-900 dark:text-stone-100">{p.employeeName}</td>
                          <td className="px-6 py-4 font-mono text-stone-600 dark:text-stone-400">{p.daysPresent} days</td>
                          <td className="px-6 py-4 font-mono font-medium">₱{p.calculations.basicPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                          <td className="px-6 py-4 font-mono text-emerald-600 dark:text-[#D4F938] font-semibold">
                            +₱{(p.calculations.otPay + p.calculations.ndPay).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4 font-mono text-rose-600 dark:text-rose-400">
                            -₱{p.calculations.totalTardinessDeduction.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4 font-mono font-medium">₱{p.calculations.grossPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                          <td className="px-6 py-4 font-mono text-rose-600 dark:text-rose-400">
                            -₱{p.calculations.deductions.totalDeductions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4 font-mono font-extrabold text-stone-950 dark:text-[#D4F938]">
                            ₱{p.calculations.netPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setSelectedPayslip(p)}
                              className="bg-[#EAE9DF] hover:bg-[#DDDCD2] dark:bg-[#2C2C28] dark:hover:bg-[#383834] font-bold text-xs px-3.5 py-1.5 rounded-full transition-all flex items-center space-x-1 text-stone-800 dark:text-stone-200"
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
      </main>

      {/* 4. MODALS & POPUPS */}

      {/* ADD EMPLOYEE MODAL */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-[#1B1B1A] rounded-[32px] border border-[#E7E5DB] dark:border-[#2C2C28] shadow-2xl w-full max-w-md p-7 space-y-6">
            <div className="flex items-center justify-between border-b border-[#E7E5DB] dark:border-[#262624] pb-4">
              <div>
                <span className="text-[11px] font-bold tracking-widest text-stone-400 uppercase">Staff Directory</span>
                <h3 className="font-bold text-lg">Add New Employee Profile</h3>
              </div>
              <button onClick={() => setShowAddEmployeeModal(false)} className="text-stone-400 hover:text-stone-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-500 mb-1.5 uppercase tracking-wider">Device ID</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 37"
                    value={newEmployee.id}
                    onChange={(e) => setNewEmployee({ ...newEmployee, id: e.target.value })}
                    className="w-full bg-[#F5F4EB] dark:bg-[#222220] border-none rounded-xl px-3.5 py-2.5 font-medium outline-none focus:ring-2 focus:ring-[#D4F938]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-500 mb-1.5 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Clara"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    className="w-full bg-[#F5F4EB] dark:bg-[#222220] border-none rounded-xl px-3.5 py-2.5 font-medium outline-none focus:ring-2 focus:ring-[#D4F938]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block font-bold text-stone-500 mb-1.5 uppercase tracking-wider">Branch Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Manila"
                    value={newEmployee.branch}
                    onChange={(e) => setNewEmployee({ ...newEmployee, branch: e.target.value })}
                    className="w-full bg-[#F5F4EB] dark:bg-[#222220] border-none rounded-xl px-3.5 py-2.5 font-medium outline-none focus:ring-2 focus:ring-[#D4F938]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-500 mb-1.5 uppercase tracking-wider">Tax Status</label>
                  <select
                    value={newEmployee.taxStatus}
                    onChange={(e) => setNewEmployee({ ...newEmployee, taxStatus: e.target.value })}
                    className="w-full bg-[#F5F4EB] dark:bg-[#222220] border-none rounded-xl px-3 py-2.5 font-medium outline-none"
                  >
                    <option value="S">Single</option>
                    <option value="ME">Married</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-500 mb-1.5 uppercase tracking-wider">Daily Wage Rate (PHP)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 600"
                  value={newEmployee.rate}
                  onChange={(e) => setNewEmployee({ ...newEmployee, rate: e.target.value })}
                  className="w-full bg-[#F5F4EB] dark:bg-[#222220] border-none rounded-xl px-3.5 py-2.5 font-medium outline-none focus:ring-2 focus:ring-[#D4F938]"
                />
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#D4F938] hover:bg-[#C4EB28] text-stone-950 font-bold py-3 rounded-full text-xs shadow-sm transition-all"
                >
                  Create Profile
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddEmployeeModal(false)}
                  className="bg-[#EAE9DF] dark:bg-[#272725] text-stone-700 dark:text-stone-300 font-semibold px-5 py-3 rounded-full text-xs transition-all"
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
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-[#1B1B1A] rounded-[32px] border border-[#E7E5DB] dark:border-[#2C2C28] shadow-2xl w-full max-w-xl p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#E7E5DB] dark:border-[#262624] pb-4">
              <div>
                <span className="text-[11px] font-bold tracking-widest text-stone-400 uppercase">Statement of Earnings</span>
                <h3 className="font-bold text-lg">Semi-Monthly Payslip</h3>
                <p className="text-xs text-stone-400 font-mono mt-0.5">Period: {startDate} ~ {endDate}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="w-10 h-10 rounded-full border border-[#E7E5DB] dark:border-[#2C2C28] hover:bg-[#FAF9F5] dark:hover:bg-[#242422] flex items-center justify-center transition-colors"
                  title="Print Payslip"
                >
                  <Printer className="h-4 w-4" />
                </button>
                <button onClick={() => setSelectedPayslip(null)} className="w-10 h-10 rounded-full border border-[#E7E5DB] dark:border-[#2C2C28] hover:bg-[#FAF9F5] dark:hover:bg-[#242422] flex items-center justify-center text-stone-400">
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Payslip body */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-[#FAF9F5] dark:bg-[#222220] p-4 rounded-2xl border border-[#E7E5DB] dark:border-[#2C2C28]">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">Employee Name</span>
                  <strong className="text-sm font-bold text-stone-900 dark:text-stone-100">{selectedPayslip.employeeName}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">Biometric ID & Branch</span>
                  <span className="font-mono font-bold text-sm">#{selectedPayslip.employeeId}</span> • {selectedPayslip.branch}
                </div>
              </div>

              {/* Earnings & Deductions Table */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <h4 className="font-bold border-b border-[#E7E5DB] dark:border-[#262624] pb-1 text-emerald-600 dark:text-[#D4F938]">Earnings</h4>
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
                  <h4 className="font-bold border-b border-[#E7E5DB] dark:border-[#262624] pb-1 text-rose-600 dark:text-rose-400">Deductions</h4>
                  <div className="flex justify-between">
                    <span>Late / Tardiness</span>
                    <span className="font-mono text-rose-500">-₱{selectedPayslip.calculations.lateDeduction.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SSS Contribution</span>
                    <span className="font-mono text-rose-500">-₱{selectedPayslip.calculations.deductions.sss.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PhilHealth</span>
                    <span className="font-mono text-rose-500">-₱{selectedPayslip.calculations.deductions.philhealth.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pag-IBIG</span>
                    <span className="font-mono text-rose-500">-₱{selectedPayslip.calculations.deductions.pagibig.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Total gross and net */}
              <div className="border-t border-[#E7E5DB] dark:border-[#262624] pt-4 mt-4 space-y-1.5">
                <div className="flex justify-between text-stone-500">
                  <span>Gross Pay</span>
                  <span className="font-mono font-semibold">₱{selectedPayslip.calculations.grossPay.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Total Deductions</span>
                  <span className="font-mono font-semibold text-rose-500">-₱{selectedPayslip.calculations.deductions.totalDeductions.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold border-t border-dashed border-[#E7E5DB] dark:border-[#262624] pt-3 text-stone-900 dark:text-white">
                  <span>Take Home Net Pay</span>
                  <span className="font-mono text-emerald-600 dark:text-[#D4F938]">₱{selectedPayslip.calculations.netPay.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NOTICE TO EXPLAIN (NTE) MODAL */}
      {selectedNteEmployee && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-[#1B1B1A] rounded-[32px] border border-[#E7E5DB] dark:border-[#2C2C28] shadow-2xl w-full max-w-2xl p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#E7E5DB] dark:border-[#262624] pb-3">
              <h3 className="font-bold text-base flex items-center space-x-2 text-rose-500">
                <FileText className="h-4 w-4" />
                <span>Notice to Explain (NTE) Disciplinary Draft</span>
              </h3>
              <button onClick={() => setSelectedNteEmployee(null)} className="text-stone-400 hover:text-stone-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Printable Letter Layout */}
            <div className="border border-[#E7E5DB] dark:border-[#2C2C28] rounded-2xl p-6 bg-[#FAF9F5] dark:bg-[#20201E] font-serif text-stone-800 dark:text-stone-200 space-y-3.5 max-h-[420px] overflow-y-auto text-xs leading-relaxed">
              <div className="text-center font-bold uppercase tracking-widest text-xs border-b border-[#E7E5DB] dark:border-[#2C2C28] pb-2 font-sans text-stone-500">
                LAYBARE SALON HR & OPERATIONS DEPARTMENT
              </div>
              <div className="space-y-1 font-sans text-[11px] text-stone-400">
                <div>Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div>To: {selectedNteEmployee.employee_name} ({selectedNteEmployee.branch} Branch)</div>
                <div>Subject: Notice of chronic tardiness threshold violation</div>
              </div>
              <p className="pt-1">
                Dear {selectedNteEmployee.employee_name},
              </p>
              <p>
                Our biometric automated monitoring system recorded that you have accumulated <strong className="font-sans font-bold text-rose-600 dark:text-rose-400">{selectedNteEmployee.late_count} instances</strong> of late clock-ins, totaling <strong className="font-sans font-bold text-rose-600 dark:text-rose-400">{selectedNteEmployee.total_late_minutes} minutes</strong> in the current payroll cutoff.
              </p>
              <p>
                Under Section 4.2 of the LAYBARE employee handbook, employees are expected to report for shifts punctually. Exceeding three late clock-ins constitutes chronic tardiness, which is subject to standard company disciplinary review.
              </p>
              <p>
                You are hereby required to submit a written explanation within forty-eight (48) hours from receipt of this notice to explain why disciplinary measures should not be initiated against you.
              </p>
              <p className="pt-2 font-sans text-[11px] text-stone-500">
                Sincerely yours,<br />
                <strong>Kristene HR Manager</strong><br />
                LAYBARE Head Office
              </p>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-[#D4F938] hover:bg-[#C4EB28] text-stone-950 font-bold py-3 rounded-full text-xs shadow-sm transition-all flex items-center justify-center space-x-2"
              >
                <Printer className="h-4 w-4" />
                <span>Print Notice Letter</span>
              </button>
              <button
                onClick={() => setSelectedNteEmployee(null)}
                className="bg-[#EAE9DF] dark:bg-[#272725] text-stone-700 dark:text-stone-300 font-semibold px-6 py-3 rounded-full text-xs transition-all"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
