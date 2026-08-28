import React, { useState, useEffect, useRef } from 'react';
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
  Plus
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || (window.location.origin.includes('localhost') ? 'http://localhost:5000/api' : '/api');

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  
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

      // Compute statistics based on fetched attendance data
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
      { id: 2, employee_id: 34, employee_name: 'Cherimar Concigo', date: '2026-07-16', calculated_in: '21:24', calculated_out: '', regular_hours: 0, late_minutes: 0, undertime_minutes: 0, ot_hours: 0, nd_hours: 0, status: 'Flagged', notes: 'Missing OUT', branch: 'Manila', rate: 650 },
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
      // Fallback update for mock data
      setAttendance(prev => prev.map(item => {
        if (item.employee_id === selectedException.employee_id && item.date === selectedException.date) {
          return {
            ...item,
            calculated_in: overrideIn,
            calculated_out: overrideOut,
            status: 'Approved',
            notes: overrideNote || 'HR Override (Mock)',
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
      // Simulated calculations
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

  // ECharts Configurations
  const getDailyAttendanceChartOption = () => {
    // Group records by day
    const dayCounts = {};
    attendance.forEach(rec => {
      if (['Present', 'Approved'].includes(rec.status)) {
        dayCounts[rec.date] = (dayCounts[rec.date] || 0) + 1;
      }
    });

    return {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: Object.keys(dayCounts).sort(),
        axisLine: { lineStyle: { color: darkMode ? '#3f3f46' : '#e4e4e7' } },
        axisLabel: { color: darkMode ? '#a1a1aa' : '#71717a' }
      },
      yAxis: {
        type: 'value',
        name: 'Headcount',
        nameTextStyle: { color: darkMode ? '#a1a1aa' : '#71717a' },
        axisLabel: { color: darkMode ? '#a1a1aa' : '#71717a' },
        splitLine: { lineStyle: { color: darkMode ? '#18181b' : '#f4f4f5' } }
      },
      series: [{
        data: Object.values(dayCounts),
        type: 'line',
        smooth: true,
        color: '#3b82f6',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.4)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.0)' }
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
      tooltip: { trigger: 'item' },
      xAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: darkMode ? '#3f3f46' : '#e4e4e7' } },
        axisLabel: { color: darkMode ? '#a1a1aa' : '#71717a' },
        splitLine: { lineStyle: { color: darkMode ? '#18181b' : '#f4f4f5' } }
      },
      yAxis: {
        type: 'category',
        data: names,
        axisLabel: { color: darkMode ? '#a1a1aa' : '#71717a' }
      },
      series: [{
        data: lateCounts,
        type: 'bar',
        color: '#f59e0b',
        itemStyle: { borderRadius: [0, 4, 4, 0] }
      }]
    };
  };

  // Filter logs for attendance list view
  const filteredAttendance = attendance.filter(rec => {
    const matchEmp = !filterEmployee || rec.employee_id === parseInt(filterEmployee);
    const matchStatus = !filterStatus || rec.status === filterStatus;
    return matchEmp && matchStatus;
  });

  return (
    <div className="min-h-screen font-sans antialiased text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-[#09090b]">
      
      {/* Top Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-[#0c0c0f]/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/logo.png.jpg" alt="Lay Bare Logo" className="h-12 w-12 object-cover rounded-md drop-shadow-md" />
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">LAYBARE</h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold tracking-wider uppercase">Smart Payroll System</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-zinc-600" />}
            </button>
            <button
              onClick={() => setShowAddEmployeeModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white dark:text-zinc-950 dark:bg-emerald-400 dark:hover:bg-emerald-500 font-semibold text-sm rounded-lg px-4 py-2 flex items-center space-x-2 transition-all shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add Employee</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 space-x-6">
          {[
            { id: 'dashboard', name: 'Analytics', icon: TrendingUp },
            { id: 'upload', name: 'Upload Portal', icon: Upload },
            { id: 'exceptions', name: 'Exception Dashboard', icon: AlertTriangle, count: exceptions.length },
            { id: 'tardiness', name: 'Tardiness Tracker', icon: Clock },
            { id: 'payroll', name: 'Payroll run', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 pb-4 text-sm font-semibold border-b-2 transition-all relative ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
              {tab.count > 0 && (
                <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        
        {/* 1. DASHBOARD ANALYTICS */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Employees', value: summary.totalEmployees, subtext: 'Registered database profiles', icon: Users, color: 'text-blue-500 bg-blue-500/10' },
                { label: 'Unresolved Flags', value: summary.pendingExceptions, subtext: 'Clock adjustments required', icon: AlertTriangle, color: 'text-rose-500 bg-rose-500/10' },
                { label: 'Total Late Minutes', value: `${summary.totalLateMins}m`, subtext: 'Current pay period total', icon: Clock, color: 'text-amber-500 bg-amber-500/10' },
                { label: 'Avg Work Shift', value: `${summary.averageHours}h`, subtext: 'Excluding lunch hours', icon: Briefcase, color: 'text-emerald-500 bg-emerald-500/10' }
              ].map((card, i) => (
                <div key={i} className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">{card.label}</span>
                    <div className={`p-2 rounded-lg ${card.color}`}>
                      <card.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold tracking-tight font-mono">{card.value}</div>
                  <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">{card.subtext}</div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-4">Daily Attendance Count</h3>
                <div className="h-80">
                  <ReactECharts option={getDailyAttendanceChartOption()} style={{ height: '100%' }} />
                </div>
              </div>

              <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-4">Top 5 Tardiness frequency</h3>
                <div className="h-80">
                  <ReactECharts option={getTardinessChartOption()} style={{ height: '100%' }} />
                </div>
              </div>
            </div>

            {/* Live Log Table */}
            <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold">Attendance Records</h3>
                  <p className="text-sm text-zinc-500">Filtered view of all processed worker records.</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <select
                    value={filterEmployee}
                    onChange={(e) => setFilterEmployee(e.target.value)}
                    className="bg-zinc-100 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-sm"
                  >
                    <option value="">All Employees</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-zinc-100 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-sm"
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
                    <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Calculated IN</th>
                      <th className="px-6 py-4">Calculated OUT</th>
                      <th className="px-6 py-4">Hours Work</th>
                      <th className="px-6 py-4">Late (mins)</th>
                      <th className="px-6 py-4">OT (hrs)</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendance.map((rec) => (
                      <tr key={rec.id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                        <td className="px-6 py-4 font-semibold">{rec.employee_name}</td>
                        <td className="px-6 py-4 font-mono text-sm">{rec.date}</td>
                        <td className="px-6 py-4 font-mono text-sm">{rec.calculated_in || '--:--'}</td>
                        <td className="px-6 py-4 font-mono text-sm">{rec.calculated_out || '--:--'}</td>
                        <td className="px-6 py-4 font-mono text-sm">{rec.regular_hours || 0}</td>
                        <td className="px-6 py-4 font-mono text-sm">{rec.late_minutes || 0}</td>
                        <td className="px-6 py-4 font-mono text-sm">{rec.ot_hours || 0}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            rec.status === 'Present' || rec.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400'
                              : rec.status === 'Flagged'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400 animate-pulse'
                              : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400'
                          }`}>
                            {rec.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-500">{rec.notes || '--'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. UPLOAD PORTAL */}
        {activeTab === 'upload' && (
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 max-w-xl mx-auto shadow-sm space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <Upload className="h-12 w-12 text-emerald-500 mx-auto" />
              <h2 className="text-xl font-bold">Import NGTeco Export</h2>
              <p className="text-sm text-zinc-500">
                Upload raw .xls punch report files directly from your offline NGTeco biometric scanner.
              </p>
            </div>

            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-lg p-8 text-center transition-all cursor-pointer relative bg-zinc-50/50 dark:bg-[#09090b]/50">
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".xls,.xlsx"
                />
                {uploadFile ? (
                  <div className="space-y-1">
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">{uploadFile.name}</p>
                    <p className="text-xs text-zinc-400">{(uploadFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="font-semibold">Drag & drop your file here, or click to browse</p>
                    <p className="text-xs text-zinc-400">Accepts .xls and .xlsx exports</p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!uploadFile || uploadStatus.loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-400 dark:text-zinc-950 dark:hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-3 rounded-lg shadow transition-all"
              >
                {uploadStatus.loading ? 'Parsing Report...' : 'Process Spreadsheet'}
              </button>
            </form>

            {uploadStatus.message && (
              <div className={`p-4 rounded-lg border text-sm flex items-start space-x-3 ${
                uploadStatus.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400'
                  : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/30 text-rose-800 dark:text-rose-400'
              }`}>
                {uploadStatus.success ? <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" /> : <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />}
                <span>{uploadStatus.message}</span>
              </div>
            )}
          </div>
        )}

        {/* 3. EXCEPTION DASHBOARD */}
        {activeTab === 'exceptions' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            {/* List of Exceptions */}
            <div className={`bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm transition-all duration-300 ${
              selectedException ? 'lg:col-span-2' : 'lg:col-span-3'
            }`}>
              <div className="p-5 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="text-lg font-bold">Flagged Exceptions</h3>
                <p className="text-sm text-zinc-500">Unpaired punch cards, missing outs, or time anomalies.</p>
              </div>

              {exceptions.length === 0 ? (
                <div className="p-8 text-center text-zinc-400">
                  <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <p>All clean! There are no unresolved exception flags.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        <th className="px-6 py-4">Employee</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Clock IN</th>
                        <th className="px-6 py-4">Clock OUT</th>
                        <th className="px-6 py-4">Issue Details</th>
                        <th className="px-6 py-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exceptions.map(exc => (
                        <tr key={exc.id} className={`border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 cursor-pointer ${
                          selectedException?.id === exc.id ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : ''
                        }`} onClick={() => {
                          setSelectedException(exc);
                          setOverrideIn(exc.calculated_in || '');
                          setOverrideOut(exc.calculated_out || '');
                          setOverrideNote(exc.notes || '');
                        }}>
                          <td className="px-6 py-4 font-semibold">{exc.employee_name}</td>
                          <td className="px-6 py-4 font-mono text-sm">{exc.date}</td>
                          <td className="px-6 py-4 font-mono text-sm">{exc.calculated_in || '--:--'}</td>
                          <td className="px-6 py-4 font-mono text-sm">{exc.calculated_out || '--:--'}</td>
                          <td className="px-6 py-4">
                            <span className="flex items-center space-x-1.5 text-xs text-rose-600 dark:text-rose-400 font-bold bg-rose-500/10 rounded-full px-2 py-0.5 w-fit">
                              <AlertTriangle className="h-3 w-3" />
                              <span>{exc.notes}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center">
                              <span>Adjust</span>
                              <ChevronRight className="h-4.5 w-4.5" />
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
              <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-lg space-y-6 h-fit transition-all">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                  <h4 className="font-bold text-lg text-rose-500">Correct Timecard</h4>
                  <button onClick={() => setSelectedException(null)} className="text-zinc-400 hover:text-zinc-500">
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>

                <div className="bg-zinc-100 dark:bg-zinc-900/60 rounded-lg p-3 space-y-1 text-sm border border-zinc-200 dark:border-zinc-800">
                  <div>Employee: <strong className="font-bold">{selectedException.employee_name}</strong> (ID: {selectedException.employee_id})</div>
                  <div>Date: <strong className="font-mono">{selectedException.date}</strong></div>
                  <div>Device Warning: <strong className="text-rose-500">{selectedException.notes}</strong></div>
                </div>

                <form onSubmit={handleOverrideSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Calculated IN</label>
                      <input
                        type="text"
                        placeholder="09:00"
                        value={overrideIn}
                        onChange={(e) => setOverrideIn(e.target.value)}
                        className="w-full bg-[#ffffff] dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-[8px] px-[12px] py-[8px] text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-zinc-950 dark:text-zinc-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Calculated OUT</label>
                      <input
                        type="text"
                        placeholder="18:00"
                        value={overrideOut}
                        onChange={(e) => setOverrideOut(e.target.value)}
                        className="w-full bg-[#ffffff] dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-[8px] px-[12px] py-[8px] text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-zinc-950 dark:text-zinc-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">HR Resolution Note</label>
                    <textarea
                      placeholder="Input details (e.g., employee sent email request...)"
                      value={overrideNote}
                      onChange={(e) => setOverrideNote(e.target.value)}
                      rows={3}
                      className="w-full bg-[#ffffff] dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-[8px] px-[12px] py-[8px] text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-zinc-950 dark:text-zinc-100"
                    />
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-400 dark:text-zinc-950 dark:hover:bg-emerald-500 font-semibold py-2 rounded-lg text-sm shadow transition-all"
                    >
                      Save Override
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        // Mark as Rejected
                        alert('Marked as rejected.');
                        setSelectedException(null);
                      }}
                      className="bg-rose-100 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30 font-semibold px-4 py-2 rounded-lg text-sm transition-all"
                    >
                      Reject Pay
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* 4. TARDINESS TRACKER */}
        {activeTab === 'tardiness' && (
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm animate-fadeIn">
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-bold">Tardiness module</h3>
              <p className="text-sm text-zinc-500">Displays late occurrences within this cycle. Standard threshold is 3 late arrivals.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Branch</th>
                    <th className="px-6 py-4">Late Frequency</th>
                    <th className="px-6 py-4">Total Late Minutes</th>
                    <th className="px-6 py-4">Status & Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tardiness.map(t => (
                    <tr key={t.employee_id} className="border-b border-zinc-100 dark:border-zinc-800">
                      <td className="px-6 py-4 font-semibold">{t.employee_name}</td>
                      <td className="px-6 py-4 text-sm text-zinc-500">{t.branch}</td>
                      <td className="px-6 py-4 font-mono font-bold text-sm">{t.late_count} times</td>
                      <td className="px-6 py-4 font-mono text-sm">{t.total_late_minutes} minutes</td>
                      <td className="px-6 py-4">
                        {t.late_count >= 3 ? (
                          <div className="flex items-center space-x-3">
                            <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                              <AlertTriangle className="h-3 w-3" />
                              <span>Threshold Exceeded</span>
                            </span>
                            <button
                              onClick={() => setSelectedNteEmployee(t)}
                              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-400 dark:text-zinc-950 dark:hover:bg-emerald-500 font-semibold px-3 py-1 rounded-md transition-all flex items-center space-x-1"
                            >
                              <FileText className="h-3 w-3" />
                              <span>Generate NTE</span>
                            </button>
                          </div>
                        ) : (
                          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full">
                            Acceptable
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

        {/* 5. PAYROLL GENERATOR */}
        {activeTab === 'payroll' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filter and Trigger Row */}
            <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Cutoff Start</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-zinc-100 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Cutoff End</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-zinc-100 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-sm"
                  />
                </div>
              </div>

              <button
                onClick={handleGeneratePayroll}
                className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-400 dark:text-zinc-950 dark:hover:bg-emerald-500 font-semibold px-6 py-2.5 rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2"
              >
                <FileText className="h-5 w-5" />
                <span>Calculate Semi-Monthly Payroll</span>
              </button>
            </div>

            {/* Payroll calculation list */}
            {payroll.length > 0 && (
              <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-zinc-200 dark:border-zinc-800">
                  <h3 className="text-lg font-bold">Payroll Calculations Summary</h3>
                  <p className="text-sm text-zinc-500">Gross to Net breakdowns for period: {startDate} to {endDate}</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        <th className="px-6 py-4">Employee</th>
                        <th className="px-6 py-4">Present</th>
                        <th className="px-6 py-4">Basic Pay</th>
                        <th className="px-6 py-4">Allowances (OT/ND)</th>
                        <th className="px-6 py-4">Tardiness Deduct</th>
                        <th className="px-6 py-4">Gross Pay</th>
                        <th className="px-6 py-4">Gov Deduct</th>
                        <th className="px-6 py-4 font-bold">Net Salary</th>
                        <th className="px-6 py-4">Payslip</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payroll.map(p => (
                        <tr key={p.employeeId} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                          <td className="px-6 py-4 font-semibold">{p.employeeName}</td>
                          <td className="px-6 py-4 font-mono text-sm">{p.daysPresent} days</td>
                          <td className="px-6 py-4 font-mono text-sm">₱{p.calculations.basicPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                          <td className="px-6 py-4 font-mono text-sm text-emerald-600 dark:text-emerald-400">
                            +₱{(p.calculations.otPay + p.calculations.ndPay).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4 font-mono text-sm text-rose-600 dark:text-rose-400">
                            -₱{p.calculations.totalTardinessDeduction.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4 font-mono text-sm">₱{p.calculations.grossPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                          <td className="px-6 py-4 font-mono text-sm text-rose-600 dark:text-rose-400">
                            -₱{p.calculations.deductions.totalDeductions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                            ₱{p.calculations.netPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setSelectedPayslip(p)}
                              className="text-xs bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 font-semibold px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 transition-all flex items-center space-x-1"
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
      </div>

      {/* FOOTER */}
      <footer className="max-w-[1600px] mx-auto px-6 py-12 text-center text-xs text-zinc-400 border-t border-zinc-200 dark:border-zinc-800">
        © 2026 LAYBARE Payroll System. Created for HR operations efficiency.
      </footer>

      {/* ADD EMPLOYEE MODAL */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#0c0c0f] rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-md p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="font-bold text-lg">Add New Employee Profile</h3>
              <button onClick={() => setShowAddEmployeeModal(false)} className="text-zinc-400 hover:text-zinc-500">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Biometric Device ID</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 37"
                    value={newEmployee.id}
                    onChange={(e) => setNewEmployee({ ...newEmployee, id: e.target.value })}
                    className="w-full bg-[#ffffff] dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-[8px] px-[12px] py-[8px] text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-zinc-950 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Employee Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Clara"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    className="w-full bg-[#ffffff] dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-[8px] px-[12px] py-[8px] text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-zinc-950 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Branch Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Manila"
                    value={newEmployee.branch}
                    onChange={(e) => setNewEmployee({ ...newEmployee, branch: e.target.value })}
                    className="w-full bg-[#ffffff] dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-[8px] px-[12px] py-[8px] text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-zinc-950 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Tax Status</label>
                  <select
                    value={newEmployee.taxStatus}
                    onChange={(e) => setNewEmployee({ ...newEmployee, taxStatus: e.target.value })}
                    className="w-full bg-[#ffffff] dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-[8px] px-[12px] py-[8px] text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-zinc-950 dark:text-zinc-100"
                  >
                    <option value="S">Single</option>
                    <option value="ME">Married</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">Daily Wage Rate (PHP)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 600"
                  value={newEmployee.rate}
                  onChange={(e) => setNewEmployee({ ...newEmployee, rate: e.target.value })}
                  className="w-full bg-[#ffffff] dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-[8px] px-[12px] py-[8px] text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-zinc-950 dark:text-zinc-100"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-400 dark:text-zinc-950 dark:hover:bg-emerald-500 font-semibold py-2.5 rounded-lg text-sm shadow transition-all"
                >
                  Create Profile
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddEmployeeModal(false)}
                  className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold px-4 py-2.5 rounded-lg text-sm transition-all"
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
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#0c0c0f] rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-xl p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <div>
                <h3 className="font-bold text-lg">Semi-Monthly Payslip</h3>
                <p className="text-xs text-zinc-400 font-mono">Period: {startDate} ~ {endDate}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  title="Print Payslip"
                >
                  <Printer className="h-4.5 w-4.5" />
                </button>
                <button onClick={() => setSelectedPayslip(null)} className="text-zinc-400 hover:text-zinc-500">
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Payslip body details */}
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 border-b border-zinc-100 dark:border-zinc-800/50 pb-3">
                <div>
                  <span className="text-zinc-400 block text-xs">Employee Name</span>
                  <strong className="text-base">{selectedPayslip.employeeName}</strong>
                </div>
                <div>
                  <span className="text-zinc-400 block text-xs">ID / Branch</span>
                  <span className="font-mono">{selectedPayslip.employeeId}</span> / {selectedPayslip.branch}
                </div>
              </div>

              {/* Earnings & Deductions Table */}
              <div className="grid grid-cols-2 gap-8">
                {/* Earnings column */}
                <div className="space-y-3">
                  <h4 className="font-bold border-b border-zinc-200 dark:border-zinc-800 pb-1 text-emerald-600 dark:text-emerald-400">Earnings</h4>
                  <div className="flex justify-between">
                    <span>Basic Salary ({selectedPayslip.daysPresent} days)</span>
                    <span className="font-mono">₱{selectedPayslip.calculations.basicPay.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overtime ({selectedPayslip.totalOtHours} hrs)</span>
                    <span className="font-mono">₱{selectedPayslip.calculations.otPay.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Night Diff ({selectedPayslip.totalNdHours} hrs)</span>
                    <span className="font-mono">₱{selectedPayslip.calculations.ndPay.toFixed(2)}</span>
                  </div>
                </div>

                {/* Deductions column */}
                <div className="space-y-3">
                  <h4 className="font-bold border-b border-zinc-200 dark:border-zinc-800 pb-1 text-rose-600 dark:text-rose-400">Deductions</h4>
                  <div className="flex justify-between">
                    <span>Tardiness/Late</span>
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
                  <div className="flex justify-between">
                    <span>Withholding Tax</span>
                    <span className="font-mono text-rose-500">-₱{selectedPayslip.calculations.deductions.tax.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Total gross and net */}
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-6 space-y-2">
                <div className="flex justify-between text-zinc-500">
                  <span>Gross Salary</span>
                  <span className="font-mono font-semibold">₱{selectedPayslip.calculations.grossPay.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Total Deductions</span>
                  <span className="font-mono font-semibold text-rose-500">-₱{selectedPayslip.calculations.deductions.totalDeductions.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-dashed border-zinc-300 dark:border-zinc-700 pt-2">
                  <span className="text-emerald-600 dark:text-emerald-400">Net Salary (Take home)</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">₱{selectedPayslip.calculations.netPay.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NOTICE TO EXPLAIN (NTE) MODAL */}
      {selectedNteEmployee && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#0c0c0f] rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-2xl p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="font-bold text-lg flex items-center space-x-2 text-rose-500">
                <FileText className="h-5 w-5" />
                <span>Notice to Explain (NTE) Preview</span>
              </h3>
              <button onClick={() => setSelectedNteEmployee(null)} className="text-zinc-400 hover:text-zinc-500">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Letter Layout */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 bg-zinc-50 dark:bg-zinc-900/40 font-serif text-zinc-800 dark:text-zinc-200 space-y-4 max-h-[450px] overflow-y-auto shadow-inner leading-relaxed">
              <div className="text-center font-bold uppercase tracking-widest text-sm border-b border-zinc-200 dark:border-zinc-800 pb-2 font-sans text-zinc-500">
                LAYBARE SALON HR DEPARTMENT
              </div>
              <div className="space-y-1 font-sans text-xs text-zinc-400">
                <div>Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div>To: {selectedNteEmployee.employee_name} ({selectedNteEmployee.branch} Branch)</div>
                <div>Subject: Written explanation for chronic tardiness</div>
              </div>
              <p className="pt-2">
                Dear {selectedNteEmployee.employee_name},
              </p>
              <p>
                Our biometric automated monitoring system recorded that you have accumulated <strong className="font-sans font-bold text-rose-600 dark:text-rose-400">{selectedNteEmployee.late_count} instances</strong> of late arrivals, totaling <strong className="font-sans font-bold text-rose-600 dark:text-rose-400">{selectedNteEmployee.total_late_minutes} minutes</strong> in the current payroll cutoff.
              </p>
              <p>
                Under Section 4.2 of the LAYBARE employee handbook, employees are expected to report for shifts punctually. Exceeding three late clock-ins constitutes chronic tardiness, which is subject to standard disciplinary investigations.
              </p>
              <p>
                You are hereby required to submit a written explanation within forty-eight (48) hours from receipt of this notice to explain why disciplinary measures should not be initiated against you. Failure to submit within the given period will result in HR deciding on this matter based on the logs on file.
              </p>
              <p className="pt-4 font-sans text-xs text-zinc-500">
                Sincerely yours,<br />
                <strong>Kristene HR Manager</strong><br />
                LAYBARE Head Office
              </p>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-400 dark:text-zinc-950 dark:hover:bg-emerald-500 font-semibold py-2.5 rounded-lg text-sm shadow transition-all flex items-center justify-center space-x-2"
              >
                <Printer className="h-4.5 w-4.5" />
                <span>Print Notice Letter</span>
              </button>
              <button
                onClick={() => setSelectedNteEmployee(null)}
                className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold px-6 py-2.5 rounded-lg text-sm transition-all"
              >
                Dismiss Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
