/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Layers, 
  ChevronRight, 
  Send, 
  Check, 
  Loader2, 
  MessageSquare,
  ArrowLeft,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Complaint, ComplaintGroup } from '../types';

interface GroupedComplaintsProps {
  groups: ComplaintGroup[];
  complaints: Complaint[];
  onBack: () => void;
  onUpdateStatus: (id: string, status: Complaint['status']) => void;
}

export default function GroupedComplaints({ groups, complaints, onBack, onUpdateStatus }: GroupedComplaintsProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isSendingAll, setIsSendingAll] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const selectedGroup = groups.find(g => g.id === selectedGroupId);
  const groupComplaints = selectedGroup ? complaints.filter(c => selectedGroup.complaintIds.includes(c.id)) : [];

  const handleSendAll = () => {
    if (!selectedGroup) return;
    setIsSendingAll(true);
    setTimeout(() => {
      setIsSendingAll(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        selectedGroup.complaintIds.forEach(id => onUpdateStatus(id, 'resolved'));
      }, 2000);
    }, 1500);
  };

  if (selectedGroupId && selectedGroup) {
    return (
      <div className="flex-1 flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden">
        <div className="p-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedGroupId(null)}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-zinc-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold tracking-tight">{selectedGroup.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                  {selectedGroup.complaintIds.length} Complaints
                </span>
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">{selectedGroup.category} • Group ID: {selectedGroup.id}</div>
            </div>
          </div>
          <button 
            onClick={handleSendAll}
            disabled={isSendingAll || showSuccess}
            className={cn(
              "px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              showSuccess ? "bg-emerald-500 text-zinc-950" : "bg-emerald-500 hover:bg-emerald-400 text-zinc-950"
            )}
          >
            {isSendingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : showSuccess ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            {showSuccess ? 'Sent to All' : 'Send All Responses'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              AI Suggested Response for Group
            </div>
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-300 leading-relaxed italic">
              "{selectedGroup.suggestedResponse}"
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Grouped Complaints</h3>
            {groupComplaints.map(complaint => (
              <div key={complaint.id} className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-sm font-bold text-zinc-100">{complaint.customerName}</div>
                    <div className="text-xs text-zinc-500">{complaint.id} • {new Date(complaint.createdAt).toLocaleString()}</div>
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                    complaint.status === 'resolved' ? "bg-emerald-500/10 text-emerald-500" : "bg-zinc-800 text-zinc-500"
                  )}>
                    {complaint.status}
                  </span>
                </div>
                <div className="text-sm text-zinc-300 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
                  {complaint.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden">
      <div className="p-8 border-b border-zinc-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Grouped Messages</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search groups..." 
                className="pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map(group => (
          <div 
            key={group.id}
            onClick={() => setSelectedGroupId(group.id)}
            className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 hover:bg-zinc-800/50 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                <Layers className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-zinc-700 text-zinc-500">
                {group.complaintIds.length} Messages
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100 mb-2 group-hover:text-emerald-400 transition-colors">{group.name}</h3>
            <p className="text-sm text-zinc-500 mb-6 line-clamp-2">{group.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <MessageSquare className="w-4 h-4" />
                <span>{group.category}</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-500">
                View Details
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
