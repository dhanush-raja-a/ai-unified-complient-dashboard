/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  UserCircle, 
  TrendingUp, 
  Layers, 
  FileBarChart, 
  AlertTriangle,
  Settings, 
  Plus, 
  ChevronRight, 
  ChevronLeft,
  Smartphone,
  MessageSquare,
  Facebook,
  Twitter,
  Mail,
  Database,
  FileText,
  HelpCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export type ViewState = 
  | 'overview' 
  | 'inbox' 
  | 'trend' 
  | 'dedup' 
  | 'grouped'
  | 'reports' 
  | 'escalation'
  | 'details';

interface SidebarProps {
  complaintCount: number;
  groupCount: number;
  onViewChange: (view: ViewState) => void;
  onManualEntry: () => void;
  currentView: ViewState;
}

export default function Sidebar({ 
  complaintCount,
  groupCount,
  onViewChange,
  onManualEntry,
  currentView
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [showIntegrate, setShowIntegrate] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const integrationOptions = [
    { name: 'Manual Entry', icon: <Plus className="w-4 h-4" />, action: onManualEntry },
    { name: 'WhatsApp', icon: <Smartphone className="w-4 h-4" /> },
    { name: 'Facebook', icon: <Facebook className="w-4 h-4" /> },
    { name: 'Twitter', icon: <Twitter className="w-4 h-4" /> },
    { name: 'Gmail', icon: <Mail className="w-4 h-4" /> },
    { name: 'Excel/CSV', icon: <Database className="w-4 h-4" /> },
    { name: 'PDF/Text', icon: <FileText className="w-4 h-4" /> }
  ];

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, section: 'Main' },
    { id: 'inbox', label: 'Complaints', icon: Inbox, section: 'Main', count: complaintCount },
    { id: 'trend', label: 'Trend Analysis', icon: TrendingUp, section: 'Analysis' },
    { id: 'dedup', label: 'Dedup Cluster', icon: Layers, section: 'Analysis', count: groupCount },
    { id: 'grouped', label: 'Grouped Messages', icon: MessageSquare, section: 'Analysis' },
    { id: 'reports', label: 'Regulatory Reports', icon: FileBarChart, section: 'Operations' },
    { id: 'escalation', label: 'Escalation Queue', icon: AlertTriangle, section: 'Operations' },
  ];

  const sections = ['Main', 'Analysis', 'Operations'];

  return (
    <div 
      className={cn(
        "h-screen bg-zinc-950 text-zinc-400 border-r border-zinc-800 transition-all duration-300 flex flex-col relative",
        isOpen ? "w-72" : "w-16"
      )}
    >
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-10 bg-zinc-800 border border-zinc-700 rounded-full p-1 text-zinc-300 hover:text-white z-50"
      >
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      <div className="p-4 flex items-center gap-3 border-b border-zinc-800">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-zinc-950 font-bold">
          U
        </div>
        {isOpen && <span className="font-semibold text-zinc-100 truncate">Unified AI Dashboard</span>}
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        <div className="px-2">
          <div className="relative">
            <button 
              onClick={() => setShowIntegrate(!showIntegrate)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 group",
                !isOpen && "justify-center px-0"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Plus className={cn("w-5 h-5 transition-transform duration-300", showIntegrate && "rotate-45")} />
                {isOpen && <span>Integrate</span>}
              </div>
              
              {isOpen && (
                <div className="flex -space-x-2 group-hover:space-x-0.5 transition-all duration-300">
                  <div className="w-6 h-6 rounded-full bg-zinc-950/10 flex items-center justify-center border border-emerald-600/20 backdrop-blur-sm">
                    <Mail className="w-3 h-3" />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-zinc-950/10 flex items-center justify-center border border-emerald-600/20 backdrop-blur-sm">
                    <Facebook className="w-3 h-3" />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-zinc-950/10 flex items-center justify-center border border-emerald-600/20 backdrop-blur-sm">
                    <Smartphone className="w-3 h-3" />
                  </div>
                </div>
              )}
            </button>

            <AnimatePresence>
              {showIntegrate && isOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 p-1"
                >
                  {integrationOptions.map(opt => (
                    <button 
                      key={opt.name}
                      onClick={() => {
                        if (opt.action) {
                          opt.action();
                          setShowIntegrate(false);
                        }
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-800 rounded-lg text-sm text-zinc-300 hover:text-emerald-400 transition-all group/item"
                    >
                      <div className="p-1.5 rounded-md bg-zinc-800 group-hover/item:bg-emerald-500/10 group-hover/item:text-emerald-500 transition-colors">
                        {opt.icon}
                      </div>
                      <span className="font-medium">{opt.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {sections.map(section => (
          <div key={section} className="space-y-1">
            {isOpen && (
              <div className="px-3 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{section}</span>
              </div>
            )}
            {menuItems.filter(item => item.section === section).map(item => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as ViewState)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left group",
                  currentView === item.id ? "bg-zinc-800 text-zinc-100" : "hover:bg-zinc-900 hover:text-zinc-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn(
                    "w-5 h-5 flex-shrink-0 transition-colors",
                    currentView === item.id ? "text-emerald-500" : "text-zinc-500 group-hover:text-zinc-300"
                  )} />
                  {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                </div>
                {isOpen && item.count !== undefined && (
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-bold",
                    item.id === 'inbox' 
                      ? "bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20" 
                      : "bg-zinc-800 border border-zinc-700 text-zinc-400"
                  )}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-zinc-800 space-y-1">
        <button className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-900 transition-colors",
          !isOpen && "justify-center px-0"
        )}>
          <Settings className="w-5 h-5" />
          {isOpen && <span className="text-sm font-medium">Settings</span>}
        </button>
        <button className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-900 transition-colors",
          !isOpen && "justify-center px-0"
        )}>
          <HelpCircle className="w-5 h-5" />
          {isOpen && <span className="text-sm font-medium">Help</span>}
        </button>
      </div>
    </div>
  );
}

