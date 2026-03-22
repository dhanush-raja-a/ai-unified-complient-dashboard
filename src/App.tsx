/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
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
import { mockReports } from './mockData';
import { Complaint, ComplaintGroup, Message, DedupCluster as DedupClusterType, RegulatoryReport, EscalationItem } from './types';

export default function App() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('overview');
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);

  const groups = useMemo<ComplaintGroup[]>(() => {
    const categories = Array.from(new Set(complaints.map(c => c.category || 'Uncategorized')));
    return categories.map((cat: string, idx: number) => ({
      id: `GRP-${idx + 1}`,
      name: `${cat} Issues Group`,
      description: `Automatically grouped complaints related to ${cat.toLowerCase()} problems.`,
      category: cat,
      complaintIds: complaints.filter(c => c.category === cat).map(c => c.id),
      suggestedResponse: `We are currently experiencing a high volume of ${cat.toLowerCase()} related issues. Our team is working on a fix and will update you shortly.`
    }));
  }, [complaints]);

  const clusters = useMemo<DedupClusterType[]>(() => {
    // Basic clustering by subject first word
    const subjects = complaints.map(c => (c.subject || '').split(' ')[0]);
    const uniqueSubjects = Array.from(new Set(subjects)).filter((s: string) => s.length > 3);
    return uniqueSubjects.map((sub: string, idx: number) => {
      const related = complaints.filter(c => (c.subject || '').startsWith(sub));
      return {
        id: `CLS-${idx + 1}`,
        name: `${sub} Related Cluster`,
        complaintCount: related.length,
        similarityScore: 0.85 + Math.random() * 0.1,
        complaintIds: related.map(c => c.id),
        summary: `AI identified ${related.length} complaints with similar subject patterns related to "${sub}".`
      };
    }).filter(c => c.complaintCount > 1);
  }, [complaints]);

  const escalationCount = useMemo(() => {
    return complaints.filter(c => c.isEscalated && c.status !== 'resolved').length;
  }, [complaints]);

  const fetchComplaints = async () => {
    try {
      const response = await fetch('/api/complaints');
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      }
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

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

  const handleUpdateStatus = async (id: string, status: Complaint['status']) => {
    try {
      const response = await fetch(`/api/complaints/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        setComplaints(prev => prev.map(c => 
          c.id === id ? { ...c, status } : c
        ));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleAddMessage = async (id: string, message: Message) => {
    try {
      const response = await fetch(`/api/complaints/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (response.ok) {
        setComplaints(prev => prev.map(c => 
          c.id === id ? { ...c, messages: [...c.messages, message] } : c
        ));
      }
    } catch (error) {
      console.error('Failed to add message:', error);
    }
  };

  const handleEscalate = (id: string, reason: string) => {
    setComplaints(prev => prev.map(c => 
      c.id === id ? { ...c, isEscalated: true, escalationReason: reason } : c
    ));
    setCurrentView('escalation');
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
        escalationCount={escalationCount}
        onViewChange={handleViewChange}
        onManualEntry={() => setIsManualEntryOpen(true)}
        currentView={currentView}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {currentView === 'overview' && <Dashboard complaints={complaints} />}
        
        {currentView === 'inbox' && (
          <ComplaintList 
            complaints={complaints} 
            onSelectComplaint={handleSelectComplaint} 
            onRefresh={fetchComplaints}
          />
        )}

        {currentView === 'trend' && (
          <TrendAnalysis complaints={complaints} />
        )}

        {currentView === 'dedup' && (
          <DedupCluster complaints={complaints} clusters={clusters} />
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
          <RegulatoryReports complaints={complaints} />
        )}

        {currentView === 'escalation' && (
          <EscalationQueue 
            complaints={complaints} 
            onSelectComplaint={handleSelectComplaint}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
        
        {currentView === 'details' && selectedComplaint && (
          <ComplaintDetails 
            complaint={selectedComplaint}
            onBack={() => handleViewChange('inbox')}
            onUpdateStatus={handleUpdateStatus}
            onAddMessage={handleAddMessage}
            onEscalate={handleEscalate}
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



