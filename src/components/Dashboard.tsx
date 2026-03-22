/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Inbox, 
  TrendingUp, 
  Filter,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  ChevronDown,
  AlertTriangle,
  ShieldAlert,
  Star,
  Download,
  Sparkles,
  Users,
  MessageSquare,
  Globe,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Complaint, FilterState, ComplaintStatus, ComplaintCategory, ComplaintSeverity, ComplaintSource } from '../types';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
const SEVERITY_COLORS: Record<string, string> = {
  'low': '#10b981',
  'medium': '#3b82f6',
  'high': '#f59e0b',
  'critical': '#ef4444'
};

interface DashboardProps {
  complaints: Complaint[];
}

export default function Dashboard({ complaints }: DashboardProps) {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: '7d',
    status: 'all',
    category: 'all',
    severity: 'all',
    channel: 'all',
    slaStatus: 'all',
    search: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  const stats = useMemo(() => {
    const total = complaints.length;
    const open = complaints.filter(c => c.status === 'unresolved').length;
    const inProgress = complaints.filter(c => c.status === 'in-progress').length;
    const resolved = complaints.filter(c => c.status === 'resolved').length;
    const highSeverity = complaints.filter(c => c.severity === 'high' || c.severity === 'critical').length;
    const escalated = complaints.filter(c => c.isEscalated).length;
    
    // Group by source
    const sourceMap: Record<string, number> = {};
    complaints.forEach(c => {
      sourceMap[c.source] = (sourceMap[c.source] || 0) + 1;
    });
    const sources = Object.entries(sourceMap).map(([source, count]) => ({ source, count }));

    // Group by severity
    const severityMap: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 };
    complaints.forEach(c => {
      severityMap[c.severity] = (severityMap[c.severity] || 0) + 1;
    });
    const severities = Object.entries(severityMap).map(([severity, count]) => ({ severity, count }));

    // Group by status for bar chart
    const statusMap: Record<string, any> = {};
    complaints.forEach(c => {
      if (!statusMap[c.category]) {
        statusMap[c.category] = { category: c.category, open: 0, pending: 0, resolved: 0 };
      }
      if (c.status === 'unresolved') statusMap[c.category].open++;
      else if (c.status === 'in-progress') statusMap[c.category].pending++;
      else if (c.status === 'resolved') statusMap[c.category].resolved++;
    });
    const statusDistribution = Object.values(statusMap);

    // Trend data (last 7 days)
    const trendMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      trendMap[dateStr] = 0;
    }
    complaints.forEach(c => {
      const dateStr = c.createdAt.split('T')[0];
      if (trendMap[dateStr] !== undefined) {
        trendMap[dateStr]++;
      }
    });
    const trend = Object.entries(trendMap).map(([date, count]) => ({ date, count }));

    return {
      total,
      open,
      pending: inProgress,
      resolved,
      highSeverity,
      escalated,
      sources,
      severities,
      statusDistribution,
      trend,
      slaCompliance: total > 0 ? Math.round(((resolved + inProgress) / total) * 100) : 100
    };
  }, [complaints]);

  const kpis = [
    { label: 'Total Complaints', value: stats.total, change: 12, icon: Inbox, color: 'blue' },
    { label: 'Open Complaints', value: stats.open, change: -5, icon: AlertCircle, color: 'rose' },
    { label: 'Resolved', value: stats.resolved, change: 8, icon: CheckCircle2, color: 'emerald' },
    { label: 'Pending', value: stats.pending, change: 2, icon: Clock, color: 'amber' },
    { label: 'Avg Resolution Time', value: '1.2h', change: -15, icon: Zap, color: 'violet', isTime: true },
    { label: 'SLA Compliance', value: `${stats.slaCompliance}%`, change: 3, icon: ShieldAlert, color: 'emerald' },
    { label: 'Escalated', value: stats.escalated, change: 0, icon: AlertTriangle, color: 'rose' },
    { label: 'High Severity', value: stats.highSeverity, change: -10, icon: ShieldAlert, color: 'orange' },
    { label: 'CSAT Score', value: 4.2, change: 5, icon: Star, color: 'yellow' },
  ];

  const insights = [
    { title: 'Anomaly Detected', description: 'App Crash complaints increased by 40% in the last 24 hours.', type: 'warning' },
    { title: 'SLA Risk', description: '5 billing complaints are approaching SLA breach in the next 2 hours.', type: 'danger' },
    { title: 'Performance Boost', description: 'Average resolution time improved by 15% this week.', type: 'success' },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-950 text-zinc-100 p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI-Powered Dashboard</h1>
          <p className="text-zinc-500 mt-1">Monitor complaints, SLA performance, and real-time trends.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text"
              placeholder="Search complaints..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm font-medium",
              showFilters ? "bg-zinc-800 border-zinc-700 text-zinc-100" : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button 
            onClick={() => window.open('/api/export', '_blank')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl font-bold text-sm transition-all"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Date Range</label>
                <select 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as any })}
                >
                  <option value="today">Today</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Status</label>
                <select 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                >
                  <option value="all">All Status</option>
                  <option value="unresolved">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Category</label>
                <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500">
                  <option value="all">All Categories</option>
                  <option value="billing">Billing</option>
                  <option value="technical">Technical Issue</option>
                  <option value="service">Service Issue</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Severity</label>
                <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500">
                  <option value="all">All Severity</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Department</label>
                <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500">
                  <option value="all">All Teams</option>
                  <option value="support">Support</option>
                  <option value="engineering">Engineering</option>
                  <option value="billing">Billing</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Channel</label>
                <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500">
                  <option value="all">All Channels</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="chat">Chatbot</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">SLA Status</label>
                <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500">
                  <option value="all">All SLA</option>
                  <option value="within">Within SLA</option>
                  <option value="breached">SLA Breached</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => (
          <motion.div 
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={cn(
              "bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-emerald-500/30 transition-all group relative overflow-hidden",
              idx >= 5 && "lg:col-span-1" // This ensures they wrap naturally
            )}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent -mr-8 -mt-8 rounded-full blur-2xl" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={cn(
                "p-2.5 rounded-xl shadow-lg",
                kpi.color === 'blue' && "bg-blue-500/10 text-blue-500 shadow-blue-500/5",
                kpi.color === 'rose' && "bg-rose-500/10 text-rose-500 shadow-rose-500/5",
                kpi.color === 'emerald' && "bg-emerald-500/10 text-emerald-500 shadow-emerald-500/5",
                kpi.color === 'amber' && "bg-amber-500/10 text-amber-500 shadow-amber-500/5",
                kpi.color === 'violet' && "bg-violet-500/10 text-violet-500 shadow-violet-500/5",
                kpi.color === 'orange' && "bg-orange-500/10 text-orange-500 shadow-orange-500/5",
                kpi.color === 'yellow' && "bg-yellow-500/10 text-yellow-500 shadow-yellow-500/5",
              )}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border",
                kpi.change > 0 
                  ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" 
                  : "text-rose-500 bg-rose-500/10 border-rose-500/20"
              )}>
                {kpi.change > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(kpi.change)}%
              </div>
            </div>
            <div className="space-y-1 relative z-10">
              <span className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest">{kpi.label}</span>
              <div className="text-3xl font-bold tracking-tight text-zinc-100 tabular-nums">{kpi.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
              <h3 className="text-lg font-bold flex items-center gap-2 text-zinc-100">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Complaint Volume Dynamics
              </h3>
              <p className="text-xs text-zinc-500">Daily intake and resolution velocity over the last 22 days.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Volume</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg">
                <Calendar className="w-4 h-4 text-zinc-500" />
                <span className="text-xs text-zinc-300">Mar 01 - Mar 22</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  stroke="#52525b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                  tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                />
                <YAxis 
                  stroke="#52525b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ color: '#71717a', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}
                  cursor={{ stroke: '#27272a', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-bold text-zinc-100">AI Intelligence</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">LIVE</span>
          </div>
          <div className="flex-1 space-y-5">
            {insights.map((insight, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "p-4 rounded-2xl border flex gap-4 transition-all hover:scale-[1.02]",
                  insight.type === 'warning' && "bg-amber-500/5 border-amber-500/10",
                  insight.type === 'danger' && "bg-rose-500/5 border-rose-500/10",
                  insight.type === 'success' && "bg-emerald-500/5 border-emerald-500/10",
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm",
                  insight.type === 'warning' && "bg-amber-500/10 text-amber-500",
                  insight.type === 'danger' && "bg-rose-500/10 text-rose-500",
                  insight.type === 'success' && "bg-emerald-500/10 text-emerald-500",
                )}>
                  {insight.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> : insight.type === 'danger' ? <ShieldAlert className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-zinc-100">{insight.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium">{insight.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <button className="mt-8 w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-zinc-700">
            Advanced Analytics Hub
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Second Row of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Distribution */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-zinc-100">Category Mix</h3>
            <Globe className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="h-[280px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.sources}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="count"
                  nameKey="source"
                  stroke="none"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {stats.sources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  formatter={(value: number) => [`${value} complaints`, 'Count']}
                />
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none -mt-6">
              <div className="text-3xl font-bold text-zinc-100">{stats.sources.reduce((acc, curr) => acc + curr.count, 0)}</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Total</div>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-zinc-100">Workflow Status</h3>
            <Zap className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.statusDistribution} layout="vertical" margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} opacity={0.3} />
                <XAxis type="number" stroke="#52525b" fontSize={10} hide />
                <YAxis dataKey="category" type="category" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} width={100} />
                <Tooltip 
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                />
                <Legend 
                  iconType="circle" 
                  iconSize={8}
                  formatter={(value) => <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{value}</span>} 
                />
                <Bar dataKey="open" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} barSize={14} />
                <Bar dataKey="pending" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} barSize={14} />
                <Bar dataKey="resolved" stackId="a" fill="#10b981" radius={[0, 6, 6, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SLA Performance */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-zinc-100">SLA Integrity</h3>
            <ShieldAlert className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex flex-col items-center justify-center h-[280px] space-y-8">
            <div className="relative w-44 h-44">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="slaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
                <circle 
                  className="text-zinc-800 stroke-current" 
                  strokeWidth="10" 
                  cx="50" cy="50" r="40" fill="transparent"
                ></circle>
                <circle 
                  className="stroke-[url(#slaGradient)] drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" 
                  strokeWidth="10" 
                  strokeDasharray={`${stats.slaCompliance * 2.51}, 251.2`}
                  strokeLinecap="round" 
                  cx="50" cy="50" r="40" fill="transparent"
                  transform="rotate(-90 50 50)"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-zinc-100 tabular-nums">{stats.slaCompliance}%</span>
                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Compliance</span>
              </div>
            </div>
            <div className="flex gap-12">
              <div className="text-center space-y-1">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Within SLA</p>
                <p className="text-2xl font-bold text-emerald-500 tabular-nums">{stats.resolved + stats.pending}</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Breached</p>
                <p className="text-2xl font-bold text-rose-500 tabular-nums">{stats.open}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Third Row of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Severity Breakdown */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-zinc-100 mb-8">Severity Profile</h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.severities} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.3} />
                <XAxis dataKey="severity" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                  {stats.severities.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.severity]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agent Efficiency */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-zinc-100">Agent Efficiency (Human Review)</h3>
            <Users className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[]} layout="vertical" margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} opacity={0.3} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} width={80} />
                <Tooltip 
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                  formatter={(value: number, name: string) => [value, name === 'resolved' ? 'Resolved' : 'Human Review Score']}
                />
                <Bar dataKey="resolved" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={12} />
                <Bar dataKey="efficiency" fill="#10b981" radius={[0, 6, 6, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center h-full -mt-20 text-zinc-500 text-xs">
              Insufficient agent data
            </div>
          </div>
        </div>

        {/* Escalation Trends */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-zinc-100 mb-8">Escalation Velocity</h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="#52525b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                  tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { weekday: 'short' })}
                />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Line 
                  type="stepAfter" 
                  dataKey="count" 
                  stroke="#ef4444" 
                  strokeWidth={3} 
                  dot={{ fill: '#ef4444', r: 4, strokeWidth: 2, stroke: '#09090b' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Root Cause Analysis */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-6">Root Cause Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.statusDistribution.map((item, idx) => (
            <div key={item.category} className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-zinc-300">{item.category}</span>
                <span className="text-xs text-zinc-500">{Math.round((item.resolved / (item.open + item.pending + item.resolved || 1)) * 100)}% Resolved</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.resolved / (item.open + item.pending + item.resolved || 1)) * 100}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                  className="h-full bg-emerald-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

