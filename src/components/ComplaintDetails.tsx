/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  User, 
  Send, 
  Bot, 
  CheckCircle2, 
  AlertTriangle, 
  Tag, 
  History,
  ShieldAlert,
  ArrowLeft,
  Sparkles,
  Loader2,
  Check,
  Edit3,
  Zap,
  Smile,
  Frown,
  Meh,
  AlertOctagon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Complaint, Message } from '../types';
import { generateDraftResponse } from '../services/aiService';

interface ComplaintDetailsProps {
  complaint: Complaint;
  onBack: () => void;
  onUpdateStatus: (id: string, status: Complaint['status']) => void;
  onAddMessage: (id: string, message: Message) => void;
  onEscalate: (id: string, reason: string) => void;
}

export default function ComplaintDetails({ complaint, onBack, onUpdateStatus, onAddMessage, onEscalate }: ComplaintDetailsProps) {
  const [draft, setDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [isBreached, setIsBreached] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const deadline = new Date(complaint.slaDeadline).getTime();
      const now = new Date().getTime();
      const diff = deadline - now;

      if (diff <= 0) {
        setIsBreached(true);
        return 'SLA BREACHED';
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 60000);
    return () => clearInterval(timer);
  }, [complaint.slaDeadline]);

  const handleGenerateDraft = async () => {
    setIsGenerating(true);
    const response = await generateDraftResponse(complaint);
    setDraft(response);
    setIsGenerating(false);
  };

  const handleSendResponse = () => {
    if (!draft) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'agent',
      text: draft,
      timestamp: new Date().toISOString()
    };
    
    onAddMessage(complaint.id, newMessage);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      setDraft('');
      onUpdateStatus(complaint.id, 'resolved');
    }, 2000);
  };

  const handleImmediateResponse = () => {
    const immediateMsg = "We've prioritized your request due to the urgency. A specialist is reviewing it right now.";
    setDraft(immediateMsg);
  };

  const handleEscalate = async () => {
    try {
      const response = await fetch(`/api/complaints/${complaint.id}/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'High priority escalation requested by agent.' })
      });
      if (response.ok) {
        alert('Complaint escalated successfully');
        onEscalate(complaint.id, 'High priority escalation requested by agent.');
      }
    } catch (error) {
      console.error('Failed to escalate:', error);
    }
  };

  const severityColors = {
    low: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    critical: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
  };

  const sentimentIcons = {
    positive: <Smile className="w-4 h-4 text-emerald-500" />,
    neutral: <Meh className="w-4 h-4 text-zinc-400" />,
    negative: <Frown className="w-4 h-4 text-orange-500" />,
    frustrated: <AlertOctagon className="w-4 h-4 text-rose-500" />
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {isBreached && (
        <div className="bg-rose-600 text-white px-6 py-2 flex items-center justify-center gap-3 text-sm font-bold animate-pulse">
          <AlertTriangle className="w-4 h-4" />
          SLA BREACH ALERT: IMMEDIATE ACTION REQUIRED
        </div>
      )}
      
      <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-zinc-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight">{complaint.subject}</h2>
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                severityColors[complaint.severity]
              )}>
                {complaint.severity}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
                {complaint.priority}
              </span>
            </div>
            <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-2">
              <span>{complaint.id}</span>
              <span>•</span>
              <span>{complaint.customerName}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                {sentimentIcons[complaint.sentiment]}
                <span className="capitalize">{complaint.sentiment}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-sm",
            isBreached ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
          )}>
            <Clock className="w-4 h-4" />
            <span>SLA: {timeLeft}</span>
          </div>
          <select 
            value={complaint.status}
            onChange={(e) => onUpdateStatus(complaint.id, e.target.value as Complaint['status'])}
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          >
            <option value="unresolved">Unresolved</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden border-r border-zinc-800">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {complaint.messages.map((msg) => (
              <div key={msg.id} className={cn(
                "flex gap-4 max-w-[80%]",
                msg.sender === 'customer' ? "mr-auto" : "ml-auto flex-row-reverse"
              )}>
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0",
                  msg.sender === 'customer' ? "bg-zinc-800 text-zinc-400" : "bg-emerald-500 text-zinc-950"
                )}>
                  {msg.sender === 'customer' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed",
                  msg.sender === 'customer' ? "bg-zinc-900 border border-zinc-800 text-zinc-300" : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-100"
                )}>
                  <div className="font-semibold mb-1 text-xs uppercase tracking-wider opacity-50">
                    {msg.sender === 'customer' ? complaint.customerName : 'AI Agent'}
                  </div>
                  {msg.text}
                  <div className="text-[10px] mt-2 opacity-40">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-zinc-900/30 border-t border-zinc-800">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus-within:border-emerald-500/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  AI Smart Actions
                </div>
                {complaint.sentiment === 'frustrated' && (
                  <button 
                    onClick={handleImmediateResponse}
                    className="text-xs font-bold text-rose-500 flex items-center gap-1 animate-pulse"
                  >
                    <Zap className="w-3 h-3" />
                    Immediate Priority Response
                  </button>
                )}
              </div>
              <textarea 
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type your response or generate an AI draft..."
                className="w-full bg-transparent border-none focus:ring-0 text-sm text-zinc-300 resize-none min-h-[100px] placeholder:text-zinc-600"
              />
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-800/50">
                <div className="flex gap-2">
                  <button 
                    onClick={handleGenerateDraft}
                    disabled={isGenerating}
                    className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg text-xs font-semibold hover:bg-emerald-500/20 transition-all flex items-center gap-2"
                  >
                    {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Bot className="w-3 h-3" />}
                    AI Suggest
                  </button>
                  <button className="px-3 py-1.5 bg-zinc-800 text-zinc-400 rounded-lg text-xs font-semibold hover:bg-zinc-700 transition-all flex items-center gap-2">
                    <Edit3 className="w-3 h-3" />
                    AI Edit
                  </button>
                </div>
                <button 
                  onClick={handleSendResponse}
                  disabled={!draft || showSuccess}
                  className={cn(
                    "px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                    showSuccess ? "bg-emerald-500 text-zinc-950" : "bg-emerald-500 hover:bg-emerald-400 text-zinc-950"
                  )}
                >
                  {showSuccess ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                  {showSuccess ? 'Sent' : 'Send Response'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-80 bg-zinc-900/20 p-6 space-y-8 overflow-y-auto">
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Complaint Analysis</h3>
            <div className="space-y-4">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                  <Tag className="w-3 h-3" />
                  AI Tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {complaint.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded-lg text-[10px] font-medium">#{tag}</span>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                  <ShieldAlert className="w-3 h-3 text-rose-500" />
                  Compliance Check
                </div>
                <div className="text-xs text-zinc-300 leading-relaxed">
                  No critical compliance issues detected. GDPR and data privacy standards maintained.
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Customer Profile</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-100">{complaint.customerName}</div>
                  <div className="text-xs text-zinc-500">Premium Customer</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
                  <div className="text-xs text-zinc-500 mb-1">Total Tickets</div>
                  <div className="text-lg font-bold">12</div>
                </div>
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
                  <div className="text-xs text-zinc-500 mb-1">Avg. Sentiment</div>
                  <div className="text-lg font-bold text-rose-500 capitalize">{complaint.sentiment}</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={handleEscalate}
                className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-sm font-medium transition-colors flex items-center gap-3"
              >
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Escalate to Manager
              </button>
              <button className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-sm font-medium transition-colors flex items-center gap-3">
                <History className="w-4 h-4 text-blue-500" />
                View Full History
              </button>
              <button 
                onClick={() => onUpdateStatus(complaint.id, 'resolved')}
                className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-sm font-medium transition-colors flex items-center gap-3"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Mark as Resolved
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

