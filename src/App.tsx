/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Sidebar, { ViewState } from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ComplaintDetails from './components/ComplaintDetails';
import ComplaintList from './components/ComplaintList';
import GroupedComplaints from './components/GroupedComplaints';
import TrendAnalysis from './components/TrendAnalysis';
import DedupCluster from './components/DedupCluster';
import RegulatoryReports from './components/RegulatoryReports';
import EscalationQueue from './components/EscalationQueue';
import Chatbot from './components/Chatbot';
import ManualEntryModal from './components/ManualEntryModal';
import { mockComplaints, mockGroups, mockClusters, mockReports, mockEscalations, trendData } from './mockData';
import { Complaint, ComplaintGroup, Message, DedupCluster as DedupClusterType, RegulatoryReport, EscalationItem } from './types';

export default function App() {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [groups, setGroups] = useState<ComplaintGroup[]>(mockGroups);
  const [clusters] = useState<DedupClusterType[]>(mockClusters);
  const [reports] = useState<RegulatoryReport[]>(mockReports);
  const [escalations] = useState<EscalationItem[]>(mockEscalations);
  
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('overview');
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);

  const selectedComplaint = complaints.find(c => c.id === selectedComplaintId);

  const handleSelectComplaint = (id: string) => {
    setSelectedComplaintId(id);
    setCurrentView('details');
  };

  const handleViewChange = (view: ViewState) => {
    setCurrentView(view);
    if (view !== 'details') {
      setSelectedComplaintId(null);
    }
  };

  const handleUpdateStatus = (id: string, status: Complaint['status']) => {
    setComplaints(prev => prev.map(c => 
      c.id === id ? { ...c, status } : c
    ));
  };

  const handleAddMessage = (id: string, message: Message) => {
    setComplaints(prev => prev.map(c => 
      c.id === id ? { ...c, messages: [...c.messages, message] } : c
    ));
  };

  const handleManualEntrySubmit = (data: Partial<Complaint>) => {
    const newComplaint: Complaint = {
      id: `CMP-${(complaints.length + 1).toString().padStart(3, '0')}`,
      customerName: data.customerName || 'Unknown',
      subject: data.subject || 'No Subject',
      description: data.description || '',
      status: 'unresolved',
      severity: data.severity || 'medium',
      priority: data.severity === 'critical' ? 'P0' : data.severity === 'high' ? 'P1' : 'P2',
      source: 'Manual',
      category: data.category || 'General',
      sentiment: 'neutral',
      createdAt: new Date().toISOString(),
      slaDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      tags: [],
      messages: [
        {
          id: 'm-initial',
          sender: 'customer',
          text: data.description || '',
          timestamp: new Date().toISOString()
        }
      ]
    };

    setComplaints(prev => [newComplaint, ...prev]);
    setCurrentView('inbox');
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Sidebar 
        complaintCount={complaints.length}
        groupCount={clusters.length}
        onViewChange={handleViewChange}
        onManualEntry={() => setIsManualEntryOpen(true)}
        currentView={currentView}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {currentView === 'overview' && <Dashboard />}
        
        {currentView === 'inbox' && (
          <ComplaintList 
            complaints={complaints} 
            onSelectComplaint={handleSelectComplaint} 
          />
        )}

        {currentView === 'trend' && (
          <TrendAnalysis trendData={trendData} />
        )}

        {currentView === 'dedup' && (
          <DedupCluster clusters={clusters} />
        )}

        {currentView === 'grouped' && (
          <GroupedComplaints 
            groups={groups} 
            complaints={complaints} 
            onBack={() => handleViewChange('inbox')}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {currentView === 'reports' && (
          <RegulatoryReports reports={reports} />
        )}

        {currentView === 'escalation' && (
          <EscalationQueue escalations={escalations} />
        )}
        
        {currentView === 'details' && selectedComplaint && (
          <ComplaintDetails 
            complaint={selectedComplaint}
            onBack={() => handleViewChange('inbox')}
            onUpdateStatus={handleUpdateStatus}
            onAddMessage={handleAddMessage}
          />
        )}

        {currentView === 'details' && !selectedComplaint && (
          <div className="flex-1 flex items-center justify-center text-zinc-500">
            Complaint not found
          </div>
        )}
      </main>

      <Chatbot complaints={complaints} />
      
      <ManualEntryModal 
        isOpen={isManualEntryOpen}
        onClose={() => setIsManualEntryOpen(false)}
        onSubmit={handleManualEntrySubmit}
      />
    </div>
  );
}



