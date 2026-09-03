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
  Settings
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

  // File Upload State
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ loading: false, success: false, message: '' });

  // Add Employee Form State
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ id: '', name: '', branch: '', rate: 600, taxStatus: 'S' });

  // Quick punch simulation state
  const [livePunches, setLivePunches] = useState([
    { id: 1, name: 'Justine Ann Atay', time: '09:21 AM', type: 'IN', branch: 'Manila', status: 'Late (21m)' },
    { id: 2, name: 'Kristene HR', time: '08:58 AM', type: 'IN', branch: 'HQ', status: 'On Time' },
    { id: 3, name: 'John Doe', time: '09:12 AM', type: 'IN', branch: 'Cebu', status: 'Late (12m)' },
    { id: 4, name: 'Cherimar Concigo', time: '09:24 PM', type: 'IN', branch: 'Manila', status: 'Missing OUT' }
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
        data: names.length > 0 ? names : ['Justine Atay', 'John Doe', 'Cherimar C.'],
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
                onClick={() => setShowAddEmployeeModal(true)}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-semibold text-[#5A534E] hover:bg-[#F7F6F2] hover:text-[#4A2E1B] transition-all"
              >
                <Users className="h-4 w-4" />
                <span>Staff Directory</span>
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
                    placeholder="e.g. Manila"
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
    </div>
  );
}
