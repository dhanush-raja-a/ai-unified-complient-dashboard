/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ComplaintStatus = 'unresolved' | 'in-progress' | 'resolved';
export type ComplaintSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ComplaintPriority = 'P0' | 'P1' | 'P2' | 'P3';
export type ComplaintSource = 'WhatsApp' | 'Facebook' | 'Twitter' | 'Gmail' | 'Excel' | 'PDF' | 'Audio' | 'Manual' | 'Phone' | 'Chat';
export type ComplaintCategory = 'Technical' | 'App Crash' | 'Internet' | 'Billing' | 'General' | string;

export interface Message {
  id: string;
  sender: 'customer' | 'agent' | 'ai';
  text: string;
  timestamp: string;
}

export interface Complaint {
  id: string;
  customerName: string;
  subject: string;
  description: string;
  status: ComplaintStatus;
  severity: ComplaintSeverity;
  priority: ComplaintPriority;
  source: ComplaintSource;
  category: ComplaintCategory;
  sentiment: 'positive' | 'neutral' | 'negative' | 'frustrated';
  createdAt: string;
  slaDeadline: string;
  messages: Message[];
  tags: string[];
  groupId?: string;
  isEscalated?: boolean;
  escalationReason?: string;
}

export interface ComplaintGroup {
  id: string;
  name: string;
  description: string;
  category: ComplaintCategory;
  complaintIds: string[];
  suggestedResponse: string;
}

export interface DashboardStats {
  total: number;
  open: number;
  resolved: number;
  pending: number;
  avgResolutionTime: string;
  slaComplianceRate: number;
  escalated: number;
  highSeverity: number;
  csat: number;
  changes: {
    total: number;
    open: number;
    resolved: number;
    pending: number;
    avgResolutionTime: number;
    slaComplianceRate: number;
    escalated: number;
    highSeverity: number;
    csat: number;
  };
}

export interface FilterState {
  dateRange: 'today' | '7d' | '30d' | 'custom';
  status: ComplaintStatus | 'all';
  category: ComplaintCategory | 'all';
  severity: ComplaintSeverity | 'all';
  channel: ComplaintSource | 'all';
  slaStatus: 'within' | 'breached' | 'all';
  search: string;
}

export interface SourceStats {
  source: ComplaintSource;
  count: number;
}

export interface TrendData {
  date: string;
  count: number;
}

export interface DedupCluster {
  id: string;
  name: string;
  complaintCount: number;
  similarityScore: number;
  complaintIds: string[];
  summary: string;
}

export interface RegulatoryReport {
  id: string;
  title: string;
  type: 'Monthly' | 'Quarterly' | 'Annual' | 'Compliance';
  date: string;
  status: 'Draft' | 'Finalized' | 'Submitted';
  description: string;
}

export interface EscalationItem {
  id: string;
  complaintId: string;
  escalatedTo: string;
  reason: string;
  timestamp: string;
  status: 'Pending' | 'Actioned' | 'Closed';
}
