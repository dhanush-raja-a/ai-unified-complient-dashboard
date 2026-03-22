/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Complaint, ComplaintGroup, DashboardStats, SourceStats, TrendData, DedupCluster, RegulatoryReport, EscalationItem } from './types';

export const mockComplaints: Complaint[] = [
  {
    id: 'CMP-001',
    customerName: 'John Doe',
    subject: 'App crashes on login',
    description: 'The app crashes every time I try to log in with my Google account.',
    status: 'unresolved',
    severity: 'critical',
    priority: 'P0',
    source: 'Gmail',
    category: 'App Crash',
    sentiment: 'frustrated',
    createdAt: '2026-03-21T10:00:00Z',
    slaDeadline: '2026-03-21T14:00:00Z',
    tags: ['login', 'google-auth', 'crash'],
    groupId: 'GRP-001',
    messages: [
      { id: 'm1', sender: 'customer', text: 'The app crashes every time I try to log in with my Google account.', timestamp: '2026-03-21T10:00:00Z' }
    ]
  },
  {
    id: 'CMP-002',
    customerName: 'Jane Smith',
    subject: 'Billing discrepancy',
    description: 'I was charged twice for my subscription this month.',
    status: 'in-progress',
    severity: 'high',
    priority: 'P1',
    source: 'WhatsApp',
    category: 'Billing',
    sentiment: 'negative',
    createdAt: '2026-03-21T11:30:00Z',
    slaDeadline: '2026-03-22T11:30:00Z',
    tags: ['billing', 'double-charge'],
    messages: [
      { id: 'm2', sender: 'customer', text: 'I was charged twice for my subscription this month.', timestamp: '2026-03-21T11:30:00Z' },
      { id: 'm3', sender: 'agent', text: 'Hello Jane, I am looking into this for you. Could you provide the transaction ID?', timestamp: '2026-03-21T12:00:00Z' }
    ]
  },
  {
    id: 'CMP-003',
    customerName: 'Alice Brown',
    subject: 'Slow internet connection',
    description: 'My internet has been very slow for the past two days.',
    status: 'resolved',
    severity: 'medium',
    priority: 'P2',
    source: 'Twitter',
    category: 'Internet',
    sentiment: 'neutral',
    createdAt: '2026-03-20T09:00:00Z',
    slaDeadline: '2026-03-21T09:00:00Z',
    tags: ['internet', 'speed'],
    messages: [
      { id: 'm4', sender: 'customer', text: 'My internet has been very slow for the past two days.', timestamp: '2026-03-20T09:00:00Z' },
      { id: 'm5', sender: 'agent', text: 'We have reset your connection. Please check now.', timestamp: '2026-03-20T10:00:00Z' },
      { id: 'm6', sender: 'customer', text: 'It works now, thanks!', timestamp: '2026-03-20T10:30:00Z' }
    ]
  },
  {
    id: 'CMP-004',
    customerName: 'Bob Wilson',
    subject: 'Cannot access technical documentation',
    description: 'The link to the technical documentation is broken.',
    status: 'unresolved',
    severity: 'low',
    priority: 'P3',
    source: 'Facebook',
    category: 'Technical',
    sentiment: 'neutral',
    createdAt: '2026-03-22T08:00:00Z',
    slaDeadline: '2026-03-23T08:00:00Z',
    tags: ['documentation', 'link-broken'],
    messages: [
      { id: 'm7', sender: 'customer', text: 'The link to the technical documentation is broken.', timestamp: '2026-03-22T08:00:00Z' }
    ]
  },
  {
    id: 'CMP-005',
    customerName: 'Charlie Davis',
    subject: 'App crash on startup',
    description: 'App crashes immediately after opening.',
    status: 'unresolved',
    severity: 'critical',
    priority: 'P0',
    source: 'Gmail',
    category: 'App Crash',
    sentiment: 'frustrated',
    createdAt: '2026-03-22T09:00:00Z',
    slaDeadline: '2026-03-22T13:00:00Z',
    tags: ['crash', 'startup'],
    groupId: 'GRP-001',
    messages: [
      { id: 'm8', sender: 'customer', text: 'App crashes immediately after opening.', timestamp: '2026-03-22T09:00:00Z' }
    ]
  },
  {
    id: 'CMP-006',
    customerName: 'David Miller',
    subject: 'Login failed multiple times',
    description: 'I am unable to login, it says invalid credentials even though they are correct.',
    status: 'unresolved',
    severity: 'high',
    priority: 'P1',
    source: 'WhatsApp',
    category: 'App Crash',
    sentiment: 'frustrated',
    createdAt: '2026-03-22T10:15:00Z',
    slaDeadline: '2026-03-22T14:15:00Z',
    tags: ['login', 'credentials'],
    groupId: 'GRP-001',
    messages: [
      { id: 'm9', sender: 'customer', text: 'I am unable to login, it says invalid credentials even though they are correct.', timestamp: '2026-03-22T10:15:00Z' }
    ]
  },
  {
    id: 'CMP-007',
    customerName: 'Eve Thompson',
    subject: 'Double charge on my card',
    description: 'I see two charges for the same transaction on my credit card statement.',
    status: 'unresolved',
    severity: 'high',
    priority: 'P1',
    source: 'Gmail',
    category: 'Billing',
    sentiment: 'negative',
    createdAt: '2026-03-22T11:00:00Z',
    slaDeadline: '2026-03-23T11:00:00Z',
    tags: ['billing', 'double-charge'],
    messages: [
      { id: 'm10', sender: 'customer', text: 'I see two charges for the same transaction on my credit card statement.', timestamp: '2026-03-22T11:00:00Z' }
    ]
  },
  {
    id: 'CMP-008',
    customerName: 'Frank Harris',
    subject: 'Internet speed is very low',
    description: 'Getting only 2Mbps on a 100Mbps plan.',
    status: 'in-progress',
    severity: 'medium',
    priority: 'P2',
    source: 'Phone',
    category: 'Internet',
    sentiment: 'frustrated',
    createdAt: '2026-03-22T11:30:00Z',
    slaDeadline: '2026-03-23T11:30:00Z',
    tags: ['internet', 'speed'],
    messages: [
      { id: 'm11', sender: 'customer', text: 'Getting only 2Mbps on a 100Mbps plan.', timestamp: '2026-03-22T11:30:00Z' }
    ]
  },
  {
    id: 'CMP-009',
    customerName: 'Grace Lee',
    subject: 'Refund not received',
    description: 'It has been 10 days since the refund was initiated, but I haven\'t received it.',
    status: 'unresolved',
    severity: 'medium',
    priority: 'P2',
    source: 'Chat',
    category: 'Billing',
    sentiment: 'negative',
    createdAt: '2026-03-22T12:00:00Z',
    slaDeadline: '2026-03-23T12:00:00Z',
    tags: ['billing', 'refund'],
    messages: [
      { id: 'm12', sender: 'customer', text: 'It has been 10 days since the refund was initiated, but I haven\'t received it.', timestamp: '2026-03-22T12:00:00Z' }
    ]
  },
  {
    id: 'CMP-010',
    customerName: 'Henry Clark',
    subject: 'App keeps closing',
    description: 'The app closes automatically after 5 seconds of use.',
    status: 'unresolved',
    severity: 'critical',
    priority: 'P0',
    source: 'Twitter',
    category: 'App Crash',
    sentiment: 'frustrated',
    createdAt: '2026-03-22T12:30:00Z',
    slaDeadline: '2026-03-22T16:30:00Z',
    tags: ['crash', 'stability'],
    groupId: 'GRP-001',
    messages: [
      { id: 'm13', sender: 'customer', text: 'The app closes automatically after 5 seconds of use.', timestamp: '2026-03-22T12:30:00Z' }
    ]
  }
];

export const mockGroups: ComplaintGroup[] = [
  {
    id: 'GRP-001',
    name: 'App Crash Issues',
    description: 'Multiple reports of the app crashing on startup or login.',
    category: 'App Crash',
    complaintIds: ['CMP-001', 'CMP-005', 'CMP-006', 'CMP-010'],
    suggestedResponse: 'We are aware of the app crash issue and are working on a fix. Please try again in an hour.'
  },
  {
    id: 'GRP-002',
    name: 'Billing & Refund Issues',
    description: 'Customers reporting double charges and delayed refunds.',
    category: 'Billing',
    complaintIds: ['CMP-002', 'CMP-007', 'CMP-009'],
    suggestedResponse: 'We are investigating the billing discrepancies. Please allow 3-5 business days for refunds to reflect.'
  }
];

export const dashboardStats: DashboardStats = {
  total: 1248,
  open: 142,
  resolved: 985,
  pending: 121,
  avgResolutionTime: '3.8h',
  slaComplianceRate: 96.2,
  escalated: 24,
  highSeverity: 56,
  csat: 4.4,
  changes: {
    total: 15.4,
    open: -8.2,
    resolved: 22.1,
    pending: 4.5,
    avgResolutionTime: -12.4,
    slaComplianceRate: 1.8,
    escalated: 12.5,
    highSeverity: -5.2,
    csat: 0.2
  }
};

export const sourceStats: SourceStats[] = [
  { source: 'WhatsApp', count: 452 },
  { source: 'Facebook', count: 210 },
  { source: 'Twitter', count: 158 },
  { source: 'Gmail', count: 320 },
  { source: 'Excel', count: 54 },
  { source: 'PDF', count: 32 },
  { source: 'Audio', count: 22 }
];

export const trendData: TrendData[] = [
  { date: '2026-03-01', count: 45 },
  { date: '2026-03-02', count: 52 },
  { date: '2026-03-03', count: 48 },
  { date: '2026-03-04', count: 61 },
  { date: '2026-03-05', count: 55 },
  { date: '2026-03-06', count: 68 },
  { date: '2026-03-07', count: 72 },
  { date: '2026-03-08', count: 65 },
  { date: '2026-03-09', count: 58 },
  { date: '2026-03-10', count: 62 },
  { date: '2026-03-11', count: 75 },
  { date: '2026-03-12', count: 82 },
  { date: '2026-03-13', count: 78 },
  { date: '2026-03-14', count: 64 },
  { date: '2026-03-15', count: 59 },
  { date: '2026-03-16', count: 63 },
  { date: '2026-03-17', count: 71 },
  { date: '2026-03-18', count: 85 },
  { date: '2026-03-19', count: 92 },
  { date: '2026-03-20', count: 88 },
  { date: '2026-03-21', count: 76 },
  { date: '2026-03-22', count: 65 }
];

export const escalationTrendData = [
  { date: '2026-03-16', count: 2 },
  { date: '2026-03-17', count: 4 },
  { date: '2026-03-18', count: 1 },
  { date: '2026-03-19', count: 5 },
  { date: '2026-03-20', count: 3 },
  { date: '2026-03-21', count: 6 },
  { date: '2026-03-22', count: 2 }
];

export const categoryTrendData = [
  { date: '2026-03-16', billing: 12, technical: 25, service: 15, product: 8 },
  { date: '2026-03-17', billing: 15, technical: 28, service: 12, product: 10 },
  { date: '2026-03-18', billing: 10, technical: 32, service: 18, product: 12 },
  { date: '2026-03-19', billing: 18, technical: 35, service: 22, product: 15 },
  { date: '2026-03-20', billing: 22, technical: 30, service: 20, product: 18 },
  { date: '2026-03-21', billing: 20, technical: 25, service: 18, product: 12 },
  { date: '2026-03-22', billing: 15, technical: 22, service: 15, product: 10 },
];

export const slaComplianceTrendData = [
  { date: '2026-03-16', within: 92, breached: 8 },
  { date: '2026-03-17', within: 90, breached: 10 },
  { date: '2026-03-18', within: 88, breached: 12 },
  { date: '2026-03-19', within: 85, breached: 15 },
  { date: '2026-03-20', within: 87, breached: 13 },
  { date: '2026-03-21', within: 91, breached: 9 },
  { date: '2026-03-22', within: 94, breached: 6 },
];

export const resolutionTimeTrendData = [
  { date: '2026-03-16', time: 48 },
  { date: '2026-03-17', time: 45 },
  { date: '2026-03-18', time: 42 },
  { date: '2026-03-19', time: 40 },
  { date: '2026-03-20', time: 38 },
  { date: '2026-03-21', time: 35 },
  { date: '2026-03-22', time: 30 },
];

export const agentPerformanceData = [
  { name: 'Alice Johnson', resolved: 145, efficiency: 94 }, // efficiency represents Human Review Score
  { name: 'Bob Smith', resolved: 138, efficiency: 88 },
  { name: 'Charlie Brown', resolved: 132, efficiency: 91 },
  { name: 'David Wilson', resolved: 128, efficiency: 85 },
  { name: 'Eve Davis', resolved: 125, efficiency: 89 }
];

export const severityBreakdownData = [
  { severity: 'Low', count: 452 },
  { severity: 'Medium', count: 358 },
  { severity: 'High', count: 254 },
  { severity: 'Critical', count: 184 }
];

export const statusDistributionData = [
  { category: 'Technical', open: 45, pending: 62, resolved: 245 },
  { category: 'App Crash', open: 32, pending: 45, resolved: 180 },
  { category: 'Internet', open: 52, pending: 38, resolved: 210 },
  { category: 'Billing', open: 25, pending: 32, resolved: 125 },
  { category: 'Service', open: 18, pending: 25, resolved: 95 }
];

export const rootCauseData = [
  { name: 'Software Bug', value: 42 },
  { name: 'User Error', value: 22 },
  { name: 'Network Latency', value: 18 },
  { name: 'Hardware Fault', value: 12 },
  { name: 'Third-party API', value: 6 }
];

export const mockClusters: DedupCluster[] = [
  {
    id: 'CLUST-001',
    name: 'Login & Crash Failures',
    complaintCount: 24,
    similarityScore: 0.95,
    complaintIds: ['CMP-001', 'CMP-005', 'CMP-006', 'CMP-010'],
    summary: 'Users are experiencing crashes during the login process, specifically with Google OAuth and general app stability.'
  },
  {
    id: 'CLUST-002',
    name: 'Billing Discrepancies',
    complaintCount: 12,
    similarityScore: 0.88,
    complaintIds: ['CMP-002', 'CMP-007', 'CMP-009'],
    summary: 'Multiple reports of double charges and incorrect subscription fees across different payment methods.'
  },
  {
    id: 'CLUST-003',
    name: 'Connectivity Issues',
    complaintCount: 8,
    similarityScore: 0.82,
    complaintIds: ['CMP-003', 'CMP-008'],
    summary: 'Reports of slow internet speeds and intermittent connection drops in specific regions.'
  }
];

export const mockReports: RegulatoryReport[] = [
  {
    id: 'REP-001',
    title: 'Monthly Compliance Report - Feb 2026',
    type: 'Monthly',
    date: '2026-02-28',
    status: 'Submitted',
    description: 'Summary of all complaints and resolutions for the month of February.'
  },
  {
    id: 'REP-002',
    title: 'Quarterly Risk Assessment Q1',
    type: 'Quarterly',
    date: '2026-03-15',
    status: 'Draft',
    description: 'Analysis of high-severity complaints and potential regulatory risks.'
  }
];

export const mockEscalations: EscalationItem[] = [
  {
    id: 'ESC-001',
    complaintId: 'CMP-001',
    escalatedTo: 'Technical Lead',
    reason: 'Critical app crash affecting multiple users.',
    timestamp: '2026-03-21T11:00:00Z',
    status: 'Pending'
  }
];
