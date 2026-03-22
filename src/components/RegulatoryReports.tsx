/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { FileText, Download, Filter, Search, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Complaint, RegulatoryReport } from '../types';
import { cn } from '../lib/utils';
import { mockReports } from '../mockData';

interface RegulatoryReportsProps {
  complaints: Complaint[];
}

export default function RegulatoryReports({ complaints }: RegulatoryReportsProps) {
  const stats = useMemo(() => {
    const submittedCount = mockReports.filter(r => r.status === 'Submitted').length;
    const pendingCount = mockReports.filter(r => r.status === 'Draft').length;
    const criticalComplaints = complaints.filter(c => c.severity === 'critical' && c.status !== 'resolved').length;

    return {
      submittedCount,
      pendingCount,
      criticalComplaints
    };
  }, [complaints]);

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-zinc-950">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Regulatory Reports</h1>
          <p className="text-sm text-zinc-500">Compliance and automated reporting for regulatory authorities.</p>
        </div>
        <button className="px-4 py-2 bg-emerald-500 text-zinc-950 rounded-lg font-bold text-sm hover:bg-emerald-400 transition-colors flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Generate New Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-sm text-zinc-500 font-medium">Reports Submitted</p>
            <h3 className="text-2xl font-bold text-zinc-100">{stats.submittedCount}</h3>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-sm text-zinc-500 font-medium">Pending Review</p>
            <h3 className="text-2xl font-bold text-zinc-100">{stats.pendingCount}</h3>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-sm text-zinc-500 font-medium">Critical Issues (Unresolved)</p>
            <h3 className="text-2xl font-bold text-zinc-100">{stats.criticalComplaints}</h3>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-zinc-100">Report History</h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-zinc-800 rounded-lg border border-zinc-700">
              <Search className="w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search reports..." 
                className="bg-transparent border-none text-xs text-zinc-300 focus:ring-0 w-48"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-all">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-950/50 text-zinc-500 text-[10px] font-bold uppercase tracking-widest border-b border-zinc-800">
                <th className="px-6 py-4">Report Title</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {mockReports.map(report => (
                <tr key={report.id} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                      <span className="text-sm font-medium text-zinc-200">{report.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-zinc-400 font-medium">{report.type}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-500">
                    {new Date(report.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                      report.status === 'Submitted' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                    )}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-all">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
