/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  AlertCircle,
  MoreVertical,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Download,
  Database
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Complaint, ComplaintStatus, ComplaintSeverity, ComplaintPriority, ComplaintSource, ComplaintCategory } from '../types';

interface ComplaintListProps {
  complaints: Complaint[];
  onSelectComplaint: (id: string) => void;
}

export default function ComplaintList({ complaints, onSelectComplaint, onRefresh }: ComplaintListProps & { onRefresh?: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  const downloadTemplate = () => {
    const headers = ['ID', 'Customer Name', 'Subject', 'Description', 'Status', 'Severity', 'Priority', 'Source', 'Category'];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "complaints_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = () => {
    window.open('/api/export', '_blank');
  };

  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<ComplaintSeverity | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<ComplaintPriority | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<ComplaintSource | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<ComplaintCategory | 'all'>('all');

  const filteredComplaints = useMemo(() => {
    return complaints.filter(complaint => {
      const matchesSearch = 
        complaint.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
      const matchesSeverity = severityFilter === 'all' || complaint.severity === severityFilter;
      const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter;
      const matchesSource = sourceFilter === 'all' || complaint.source === sourceFilter;
      const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesSeverity && matchesPriority && matchesSource && matchesCategory;
    });
  }, [complaints, searchQuery, statusFilter, severityFilter, priorityFilter, sourceFilter, categoryFilter]);

  const severityColors = {
    low: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    critical: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
  };

  const priorityColors = {
    P0: 'text-rose-500',
    P1: 'text-orange-500',
    P2: 'text-amber-500',
    P3: 'text-blue-500'
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden">
      <div className="p-8 border-b border-zinc-800">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Complaints</h1>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-sm font-bold">
              {complaints.length} Total
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            <button 
              onClick={async () => {
                try {
                  const response = await fetch('/api/seed-more', { method: 'POST' });
                  if (response.ok) {
                    window.location.reload();
                  }
                } catch (error) {
                  console.error('Failed to seed:', error);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-all"
            >
              <Database className="w-3.5 h-3.5" />
              Seed 50 More
            </button>
            <div className="w-px h-8 bg-zinc-800 mx-2" />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search complaints..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all w-64"
              />
            </div>
            <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1">
              <button 
                onClick={() => setStatusFilter('all')}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-bold transition-all",
                  statusFilter === 'all' ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                All
              </button>
              <button 
                onClick={() => setStatusFilter('unresolved')}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                  statusFilter === 'unresolved' ? "bg-rose-500/10 text-rose-500" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <AlertCircle className="w-3 h-3" />
                Unresolved
              </button>
              <button 
                onClick={() => setStatusFilter('in-progress')}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                  statusFilter === 'in-progress' ? "bg-amber-500/10 text-amber-500" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <Clock className="w-3 h-3" />
                In Progress
              </button>
              <button 
                onClick={() => setStatusFilter('resolved')}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                  statusFilter === 'resolved' ? "bg-emerald-500/10 text-emerald-500" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <CheckCircle2 className="w-3 h-3" />
                Resolved
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Severity:</span>
            <select 
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
            >
              <option value="all">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Priority:</span>
            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
            >
              <option value="all">All</option>
              <option value="P0">P0</option>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Source:</span>
            <select 
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as any)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
            >
              <option value="all">All</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Facebook">Facebook</option>
              <option value="Twitter">Twitter</option>
              <option value="Gmail">Gmail</option>
              <option value="Phone">Phone</option>
              <option value="Chat">Chat</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Category:</span>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
            >
              <option value="all">All</option>
              <option value="Technical">Technical</option>
              <option value="App Crash">App Crash</option>
              <option value="Internet">Internet</option>
              <option value="Billing">Billing</option>
              <option value="General">General</option>
            </select>
          </div>

          {(severityFilter !== 'all' || priorityFilter !== 'all' || sourceFilter !== 'all' || categoryFilter !== 'all' || statusFilter !== 'all' || searchQuery !== '') && (
            <button 
              onClick={() => {
                setSeverityFilter('all');
                setPriorityFilter('all');
                setSourceFilter('all');
                setCategoryFilter('all');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="text-[10px] font-bold text-rose-500 hover:text-rose-400 uppercase tracking-wider underline underline-offset-4"
            >
              Clear All Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-12 px-4 py-3 bg-zinc-900/50 rounded-xl border border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-500">
          <div className="col-span-4">Complaint & Customer</div>
          <div className="col-span-2 text-center">Severity</div>
          <div className="col-span-1 text-center">Priority</div>
          <div className="col-span-2 text-center">SLA Status</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 pt-0 space-y-2">
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map(complaint => (
            <div 
              key={complaint.id}
              onClick={() => onSelectComplaint(complaint.id)}
              className="grid grid-cols-12 items-center px-4 py-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 hover:bg-zinc-800/50 transition-all cursor-pointer group"
            >
              <div className="col-span-4 flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs",
                  complaint.sentiment === 'frustrated' ? "bg-rose-500/20 text-rose-500" : "bg-zinc-800 text-zinc-400"
                )}>
                  {complaint.id.split('-')[1]}
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">{complaint.subject}</div>
                  <div className="text-xs text-zinc-500">{complaint.customerName} • {complaint.source}</div>
                </div>
              </div>

              <div className="col-span-2 flex justify-center">
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                  severityColors[complaint.severity]
                )}>
                  {complaint.severity}
                </span>
              </div>

              <div className="col-span-1 text-center">
                <span className={cn("font-bold text-xs", priorityColors[complaint.priority])}>
                  {complaint.priority}
                </span>
              </div>

              <div className="col-span-2 flex justify-center">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Clock className="w-3 h-3" />
                  <span>2h 15m</span>
                </div>
              </div>

              <div className="col-span-2 flex justify-center">
                <span className={cn(
                  "px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                  complaint.status === 'resolved' ? "bg-emerald-500/10 text-emerald-500" : 
                  complaint.status === 'in-progress' ? "bg-amber-500/10 text-amber-500" : "bg-zinc-800 text-zinc-500"
                )}>
                  {complaint.status.replace('-', ' ')}
                </span>
              </div>

              <div className="col-span-1 flex justify-end">
                <button className="p-2 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-700 rounded-lg transition-all">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500 space-y-4">
            <XCircle className="w-12 h-12 opacity-20" />
            <p className="text-sm font-medium">No complaints found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
