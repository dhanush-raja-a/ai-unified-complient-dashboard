/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, ChevronRight, User, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { EscalationItem } from '../types';
import { cn } from '../lib/utils';

interface EscalationQueueProps {
  escalations: EscalationItem[];
}

export default function EscalationQueue({ escalations }: EscalationQueueProps) {
  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-zinc-950">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Escalation Queue</h1>
          <p className="text-sm text-zinc-500">High-priority complaints escalated for management review.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Active Escalations</p>
              <h3 className="text-xl font-bold text-zinc-100">{escalations.length}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {escalations.map(item => (
          <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-red-500/30 transition-all">
            <div className="p-6 flex items-start justify-between border-b border-zinc-800">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-100">Escalation: {item.id}</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-red-500/10 text-red-500 rounded-full font-bold uppercase tracking-wider">
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <User className="w-4 h-4" />
                    <span className="text-xs font-medium">Escalated to: {item.escalatedTo}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-medium">{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <div className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800">
                  <p className="text-sm text-zinc-300 italic">"{item.reason}"</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-4">
                <div className="text-right">
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Complaint ID</p>
                  <p className="text-sm font-bold text-zinc-200">{item.complaintId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-bold hover:bg-zinc-700 transition-colors">
                    View Complaint
                  </button>
                  <button className="px-3 py-1.5 bg-emerald-500 text-zinc-950 rounded-lg text-xs font-bold hover:bg-emerald-400 transition-colors flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
