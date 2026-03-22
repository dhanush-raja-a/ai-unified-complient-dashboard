/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Users, Clock, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';
import { Complaint, TrendData } from '../types';
import { cn } from '../lib/utils';

interface TrendAnalysisProps {
  complaints: Complaint[];
}

export default function TrendAnalysis({ complaints }: TrendAnalysisProps) {
  const stats = useMemo(() => {
    // Trend data (last 7 days)
    const trendMap: Record<string, number> = {};
    const categoryTrendMap: Record<string, any> = {};
    const slaTrendMap: Record<string, any> = {};
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      trendMap[dateStr] = 0;
      categoryTrendMap[dateStr] = { date: dateStr, billing: 0, technical: 0, internet: 0, general: 0 };
      slaTrendMap[dateStr] = { date: dateStr, within: 0, breached: 0 };
    }

    complaints.forEach(c => {
      const dateStr = c.createdAt.split('T')[0];
      if (trendMap[dateStr] !== undefined) {
        trendMap[dateStr]++;
        
        const cat = c.category.toLowerCase();
        if (cat.includes('billing')) categoryTrendMap[dateStr].billing++;
        else if (cat.includes('technical')) categoryTrendMap[dateStr].technical++;
        else if (cat.includes('internet')) categoryTrendMap[dateStr].internet++;
        else categoryTrendMap[dateStr].general++;

        if (c.status === 'resolved' || c.status === 'in-progress') slaTrendMap[dateStr].within++;
        else slaTrendMap[dateStr].breached++;
      }
    });

    const trend = Object.entries(trendMap).map(([date, count]) => ({ date, count }));
    const categoryTrend = Object.values(categoryTrendMap);
    const slaTrend = Object.values(slaTrendMap);
    
    const currentTrend = trend[trend.length - 1].count;
    const previousTrend = trend[trend.length - 2]?.count || 0;
    const trendDiff = currentTrend - previousTrend;
    const trendPercent = previousTrend > 0 ? ((trendDiff / previousTrend) * 100).toFixed(1) : '0.0';

    const uniqueCustomers = new Set(complaints.map(c => c.customerName)).size;

    return {
      trend,
      categoryTrend,
      slaTrend,
      currentTrend,
      trendDiff,
      trendPercent,
      uniqueCustomers
    };
  }, [complaints]);

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-zinc-950">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Trend Analysis</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg">
            <Clock className="w-4 h-4 text-zinc-500" />
            <span className="text-xs text-zinc-400">Last 7 Days</span>
          </div>
          <button className="px-4 py-2 bg-emerald-500 text-zinc-950 rounded-lg font-bold text-sm hover:bg-emerald-400 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
              <Activity className="w-5 h-5" />
            </div>
            <span className={cn(
              "text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1",
              stats.trendDiff >= 0 ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"
            )}>
              {stats.trendDiff >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {stats.trendPercent}%
            </span>
          </div>
          <div>
            <p className="text-sm text-zinc-500 font-medium">Daily Volume</p>
            <h3 className="text-2xl font-bold text-zinc-100">{stats.currentTrend} Complaints</h3>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-sm text-zinc-500 font-medium">Unique Customers</p>
            <h3 className="text-2xl font-bold text-zinc-100">{stats.uniqueCustomers} Active</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. Volume Trend */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-zinc-100">Volume Trend (7D)</h3>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.trend}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="#52525b" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { weekday: 'short' })}
                />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#10b981', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="count" stroke="#10b981" fillOpacity={1} fill="url(#colorTrend)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Complaint Category Trend */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-zinc-100">Complaint Category Trend</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Which types of complaints are rising</p>
            </div>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="#52525b" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { weekday: 'short' })}
                />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                <Bar dataKey="billing" stackId="a" fill="#3b82f6" />
                <Bar dataKey="technical" stackId="a" fill="#10b981" />
                <Bar dataKey="internet" stackId="a" fill="#f59e0b" />
                <Bar dataKey="general" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. SLA Compliance Trend */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-zinc-100">SLA Compliance Trend</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Within SLA vs Breached SLA</p>
            </div>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.slaTrend}>
                <defs>
                  <linearGradient id="colorWithin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="#52525b" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { weekday: 'short' })}
                />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                <Area type="monotone" dataKey="within" stroke="#10b981" fillOpacity={1} fill="url(#colorWithin)" strokeWidth={2} />
                <Area type="monotone" dataKey="breached" stroke="#ef4444" fillOpacity={0} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Resolution Time Trend */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-zinc-100">Resolution Time Trend</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Average time taken to resolve (Hours)</p>
            </div>
            <Zap className="w-4 h-4 text-violet-500" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="#52525b" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { weekday: 'short' })}
                />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#8b5cf6', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
