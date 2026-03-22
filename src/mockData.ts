/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Complaint, ComplaintGroup, DashboardStats, SourceStats, TrendData, DedupCluster, RegulatoryReport, EscalationItem } from './types';

const generateComplaint = (id: number, data: Partial<Complaint>): Complaint => {
  const baseDate = new Date('2026-03-22T00:00:00Z');
  const hoursAgo = Math.floor(Math.random() * 168); // Random time within last 7 days
  const createdAt = new Date(baseDate.getTime() - hoursAgo * 60 * 60 * 1000).toISOString();
  const slaHours = data.severity === 'critical' ? 4 : data.severity === 'high' ? 24 : data.severity === 'medium' ? 48 : 72;
  const slaDeadline = new Date(new Date(createdAt).getTime() + slaHours * 60 * 60 * 1000).toISOString();
  
  return {
    id: `CMP-${String(id).padStart(3, '0')}`,
    customerName: data.customerName || 'Customer',
    subject: data.subject || 'Issue',
    description: data.description || 'Description',
    status: data.status || 'unresolved',
    severity: data.severity || 'medium',
    priority: data.priority || 'P2',
    source: data.source || 'Gmail',
    category: data.category || 'General',
    sentiment: data.sentiment || 'neutral',
    createdAt,
    slaDeadline,
    tags: data.tags || [],
    groupId: data.groupId,
    messages: data.messages || [
      { id: `m-${id}`, sender: 'customer', text: data.description || 'Issue description', timestamp: createdAt }
    ]
  };
};

export const mockComplaints: Complaint[] = [
  generateComplaint(1, {
    customerName: 'John Doe',
    subject: 'App crashes on login',
    description: 'The app crashes every time I try to log in with my Google account.',
    status: 'unresolved',
    severity: 'critical',
    priority: 'P0',
    source: 'Gmail',
    category: 'App Crash',
    sentiment: 'frustrated',
    tags: ['login', 'google-auth', 'crash'],
    groupId: 'GRP-001'
  }),
  generateComplaint(2, {
    customerName: 'Jane Smith',
    subject: 'Billing discrepancy',
    description: 'I was charged twice for my subscription this month.',
    status: 'in-progress',
    severity: 'high',
    priority: 'P1',
    source: 'WhatsApp',
    category: 'Billing',
    sentiment: 'negative',
    tags: ['billing', 'double-charge']
  }),
  generateComplaint(3, {
    customerName: 'Alice Brown',
    subject: 'Slow internet connection',
    description: 'My internet has been very slow for the past two days.',
    status: 'resolved',
    severity: 'medium',
    priority: 'P2',
    source: 'Twitter',
    category: 'Internet',
    sentiment: 'neutral',
    tags: ['internet', 'speed']
  }),
  generateComplaint(4, {
    customerName: 'Bob Wilson',
    subject: 'Cannot access technical documentation',
    description: 'The link to the technical documentation is broken.',
    status: 'unresolved',
    severity: 'low',
    priority: 'P3',
    source: 'Facebook',
    category: 'Technical',
    sentiment: 'neutral',
    tags: ['documentation', 'link-broken']
  }),
  generateComplaint(5, {
    customerName: 'Charlie Davis',
    subject: 'App crash on startup',
    description: 'App crashes immediately after opening.',
    status: 'unresolved',
    severity: 'critical',
    priority: 'P0',
    source: 'Gmail',
    category: 'App Crash',
    sentiment: 'frustrated',
    tags: ['crash', 'startup'],
    groupId: 'GRP-001'
  }),
  generateComplaint(6, {
    customerName: 'David Miller',
    subject: 'Login failed multiple times',
    description: 'I am unable to login, it says invalid credentials even though they are correct.',
    status: 'unresolved',
    severity: 'high',
    priority: 'P1',
    source: 'WhatsApp',
    category: 'App Crash',
    sentiment: 'frustrated',
    tags: ['login', 'credentials'],
    groupId: 'GRP-001'
  }),
  generateComplaint(7, {
    customerName: 'Eve Thompson',
    subject: 'Double charge on my card',
    description: 'I see two charges for the same transaction on my credit card statement.',
    status: 'unresolved',
    severity: 'high',
    priority: 'P1',
    source: 'Gmail',
    category: 'Billing',
    sentiment: 'negative',
    tags: ['billing', 'double-charge']
  }),
  generateComplaint(8, {
    customerName: 'Frank Harris',
    subject: 'Internet speed is very low',
    description: 'Getting only 2Mbps on a 100Mbps plan.',
    status: 'in-progress',
    severity: 'medium',
    priority: 'P2',
    source: 'Phone',
    category: 'Internet',
    sentiment: 'frustrated',
    tags: ['internet', 'speed']
  }),
  generateComplaint(9, {
    customerName: 'Grace Lee',
    subject: 'Refund not received',
    description: 'It has been 10 days since the refund was initiated, but I haven\'t received it.',
    status: 'unresolved',
    severity: 'medium',
    priority: 'P2',
    source: 'Chat',
    category: 'Billing',
    sentiment: 'negative',
    tags: ['billing', 'refund']
  }),
  generateComplaint(10, {
    customerName: 'Henry Clark',
    subject: 'App keeps closing',
    description: 'The app closes automatically after 5 seconds of use.',
    status: 'unresolved',
    severity: 'critical',
    priority: 'P0',
    source: 'Twitter',
    category: 'App Crash',
    sentiment: 'frustrated',
    tags: ['crash', 'stability'],
    groupId: 'GRP-001'
  }),
  // Additional 40 complaints
  generateComplaint(11, {
    customerName: 'Isabella Martinez',
    subject: 'Payment gateway timeout',
    description: 'Payment keeps timing out during checkout process.',
    status: 'unresolved',
    severity: 'high',
    priority: 'P1',
    source: 'WhatsApp',
    category: 'Billing',
    sentiment: 'frustrated',
    tags: ['payment', 'timeout']
  }),
  generateComplaint(12, {
    customerName: 'James Anderson',
    subject: 'Network disconnection',
    description: 'Internet disconnects every 30 minutes.',
    status: 'in-progress',
    severity: 'high',
    priority: 'P1',
    source: 'Phone',
    category: 'Internet',
    sentiment: 'negative',
    tags: ['network', 'disconnection']
  }),
  generateComplaint(13, {
    customerName: 'Sophia Taylor',
    subject: 'Feature not working',
    description: 'The export feature is not responding.',
    status: 'resolved',
    severity: 'medium',
    priority: 'P2',
    source: 'Gmail',
    category: 'Technical',
    sentiment: 'neutral',
    tags: ['feature', 'export']
  }),
  generateComplaint(14, {
    customerName: 'Liam Thomas',
    subject: 'Account suspended',
    description: 'My account was suspended without any notification.',
    status: 'unresolved',
    severity: 'critical',
    priority: 'P0',
    source: 'Twitter',
    category: 'Technical',
    sentiment: 'frustrated',
    tags: ['account', 'suspension']
  }),
  generateComplaint(15, {
    customerName: 'Olivia Jackson',
    subject: 'Incorrect invoice',
    description: 'Invoice shows wrong amount for last month.',
    status: 'in-progress',
    severity: 'medium',
    priority: 'P2',
    source: 'Facebook',
    category: 'Billing',
    sentiment: 'negative',
    tags: ['invoice', 'billing']
  }),
  generateComplaint(16, {
    customerName: 'Noah White',
    subject: 'App freezes',
    description: 'App freezes when uploading files.',
    status: 'unresolved',
    severity: 'high',
    priority: 'P1',
    source: 'Gmail',
    category: 'App Crash',
    sentiment: 'frustrated',
    tags: ['freeze', 'upload'],
    groupId: 'GRP-001'
  }),
  generateComplaint(17, {
    customerName: 'Emma Harris',
    subject: 'Slow loading times',
    description: 'Pages take forever to load.',
    status: 'resolved',
    severity: 'low',
    priority: 'P3',
    source: 'Chat',
    category: 'Technical',
    sentiment: 'neutral',
    tags: ['performance', 'loading']
  }),
  generateComplaint(18, {
    customerName: 'William Martin',
    subject: 'Data sync issue',
    description: 'My data is not syncing across devices.',
    status: 'unresolved',
    severity: 'medium',
    priority: 'P2',
    source: 'WhatsApp',
    category: 'Technical',
    sentiment: 'negative',
    tags: ['sync', 'data']
  }),
  generateComplaint(19, {
    customerName: 'Ava Thompson',
    subject: 'Subscription not activated',
    description: 'Paid for premium but still showing free account.',
    status: 'in-progress',
    severity: 'high',
    priority: 'P1',
    source: 'Gmail',
    category: 'Billing',
    sentiment: 'frustrated',
    tags: ['subscription', 'activation']
  }),
  generateComplaint(20, {
    customerName: 'Benjamin Garcia',
    subject: 'Connection drops',
    description: 'WiFi connection drops randomly throughout the day.',
    status: 'unresolved',
    severity: 'medium',
    priority: 'P2',
    source: 'Phone',
    category: 'Internet',
    sentiment: 'negative',
    tags: ['wifi', 'connection']
  }),
  generateComplaint(21, {
    customerName: 'Mia Rodriguez',
    subject: 'Error message on login',
    description: 'Getting "Server Error 500" when trying to log in.',
    status: 'unresolved',
    severity: 'critical',
    priority: 'P0',
    source: 'Twitter',
    category: 'App Crash',
    sentiment: 'frustrated',
    tags: ['error', 'login'],
    groupId: 'GRP-001'
  }),
  generateComplaint(22, {
    customerName: 'Lucas Martinez',
    subject: 'Missing features',
    description: 'Features mentioned in the plan are not available.',
    status: 'resolved',
    severity: 'low',
    priority: 'P3',
    source: 'Facebook',
    category: 'Technical',
    sentiment: 'neutral',
    tags: ['features', 'missing']
  }),
  generateComplaint(23, {
    customerName: 'Charlotte Lee',
    subject: 'Overcharged',
    description: 'Was charged $99 instead of $49.',
    status: 'unresolved',
    severity: 'high',
    priority: 'P1',
    source: 'Gmail',
    category: 'Billing',
    sentiment: 'negative',
    tags: ['overcharge', 'billing']
  }),
  generateComplaint(24, {
    customerName: 'Ethan Walker',
    subject: 'Bandwidth throttling',
    description: 'Internet speed is being throttled during peak hours.',
    status: 'in-progress',
    severity: 'medium',
    priority: 'P2',
    source: 'WhatsApp',
    category: 'Internet',
    sentiment: 'frustrated',
    tags: ['throttling', 'bandwidth']
  }),
  generateComplaint(25, {
    customerName: 'Amelia Hall',
    subject: 'Cannot reset password',
    description: 'Password reset link is not working.',
    status: 'unresolved',
    severity: 'high',
    priority: 'P1',
    source: 'Chat',
    category: 'Technical',
    sentiment: 'frustrated',
    tags: ['password', 'reset']
  }),
  generateComplaint(26, {
    customerName: 'Alexander Allen',
    subject: 'App not responding',
    description: 'App becomes unresponsive after 10 minutes of use.',
    status: 'unresolved',
    severity: 'critical',
    priority: 'P0',
    source: 'Gmail',
    category: 'App Crash',
    sentiment: 'frustrated',
    tags: ['unresponsive', 'crash'],
    groupId: 'GRP-001'
  }),
  generateComplaint(27, {
    customerName: 'Harper Young',
    subject: 'UI glitches',
    description: 'Interface elements are overlapping and unreadable.',
    status: 'resolved',
    severity: 'low',
    priority: 'P3',
    source: 'Twitter',
    category: 'Technical',
    sentiment: 'neutral',
    tags: ['ui', 'glitch']
  }),
  generateComplaint(28, {
    customerName: 'Daniel King',
    subject: 'Unauthorized charge',
    description: 'There is a charge I did not authorize on my account.',
    status: 'unresolved',
    severity: 'critical',
    priority: 'P0',
    source: 'Phone',
    category: 'Billing',
    sentiment: 'frustrated',
    tags: ['unauthorized', 'charge']
  }),
  generateComplaint(29, {
    customerName: 'Evelyn Wright',
    subject: 'Latency issues',
    description: 'Experiencing high latency during video calls.',
    status: 'in-progress',
    severity: 'medium',
    priority: 'P2',
    source: 'WhatsApp',
    category: 'Internet',
    sentiment: 'negative',
    tags: ['latency', 'video']
  }),
  generateComplaint(30, {
    customerName: 'Matthew Lopez',
    subject: 'Data loss',
    description: 'Lost all my saved data after the last update.',
    status: 'unresolved',
    severity: 'critical',
    priority: 'P0',
    source: 'Gmail',
    category: 'Technical',
    sentiment: 'frustrated',
    tags: ['data-loss', 'update']
  }),
  generateComplaint(31, {
    customerName: 'Abigail Hill',
    subject: 'Notification not working',
    description: 'Not receiving any push notifications.',
    status: 'resolved',
    severity: 'low',
    priority: 'P3',
    source: 'Facebook',
    category: 'Technical',
    sentiment: 'neutral',
    tags: ['notification', 'push']
  }),
  generateComplaint(32, {
    customerName: 'Joseph Scott',
    subject: 'Refund delay',
    description: 'Refund was promised in 5 days but it has been 2 weeks.',
    status: 'unresolved',
    severity: 'high',
    priority: 'P1',
    source: 'Twitter',
    category: 'Billing',
    sentiment: 'negative',
    tags: ['refund', 'delay']
  }),
  generateComplaint(33, {
    customerName: 'Emily Green',
    subject: 'Router issues',
    description: 'Router keeps restarting on its own.',
    status: 'in-progress',
    severity: 'high',
    priority: 'P1',
    source: 'Phone',
    category: 'Internet',
    sentiment: 'frustrated',
    tags: ['router', 'restart']
  }),
  generateComplaint(34, {
    customerName: 'Michael Adams',
    subject: 'App crashes on Android',
    description: 'App crashes specifically on Android 14 devices.',
    status: 'unresolved',
    severity: 'critical',
    priority: 'P0',
    source: 'Gmail',
    category: 'App Crash',
    sentiment: 'frustrated',
    tags: ['android', 'crash'],
    groupId: 'GRP-001'
  }),
  generateComplaint(35, {
    customerName: 'Elizabeth Baker',
    subject: 'Search not working',
    description: 'Search function returns no results.',
    status: 'resolved',
    severity: 'medium',
    priority: 'P2',
    source: 'Chat',
    category: 'Technical',
    sentiment: 'neutral',
    tags: ['search', 'function']
  }),
  generateComplaint(36, {
    customerName: 'David Nelson',
    subject: 'Wrong plan charged',
    description: 'Being charged for enterprise plan but signed up for basic.',
    status: 'unresolved',
    severity: 'high',
    priority: 'P1',
    source: 'WhatsApp',
    category: 'Billing',
    sentiment: 'negative',
    tags: ['plan', 'wrong-charge']
  }),
  generateComplaint(37, {
    customerName: 'Sofia Carter',
    subject: 'Packet loss',
    description: 'Experiencing 30% packet loss during gaming.',
    status: 'in-progress',
    severity: 'medium',
    priority: 'P2',
    source: 'Twitter',
    category: 'Internet',
    sentiment: 'frustrated',
    tags: ['packet-loss', 'gaming']
  }),
  generateComplaint(38, {
    customerName: 'James Mitchell',
    subject: 'Cannot upload files',
    description: 'File upload fails with error code 403.',
    status: 'unresolved',
    severity: 'high',
    priority: 'P1',
    source: 'Gmail',
    category: 'Technical',
    sentiment: 'frustrated',
    tags: ['upload', 'error']
  }),
  generateComplaint(39, {
    customerName: 'Aria Perez',
    subject: 'Memory leak',
    description: 'App consumes all device memory and slows down phone.',
    status: 'unresolved',
    severity: 'critical',
    priority: 'P0',
    source: 'Facebook',
    category: 'App Crash',
    sentiment: 'frustrated',
    tags: ['memory', 'leak'],
    groupId: 'GRP-001'
  }),
  generateComplaint(40, {
    customerName: 'Jackson Roberts',
    subject: 'Dark mode broken',
    description: 'Dark mode makes text unreadable.',
    status: 'resolved',
    severity: 'low',
    priority: 'P3',
    source: 'Chat',
    category: 'Technical',
    sentiment: 'neutral',
    tags: ['dark-mode', 'ui']
  }),
  generateComplaint(41, {
    customerName: 'Scarlett Turner',
    subject: 'Duplicate transactions',
    description: 'Same transaction appears twice in my statement.',
    status: 'unresolved',
    severity: 'high',
    priority: 'P1',
    source: 'Phone',
    category: 'Billing',
    sentiment: 'negative',
    tags: ['duplicate', 'transaction']
  }),
  generateComplaint(42, {
    customerName: 'Sebastian Phillips',
    subject: 'DNS resolution failure',
    description: 'Cannot access certain websites due to DNS issues.',
    status: 'in-progress',
    severity: 'medium',
    priority: 'P2',
    source: 'WhatsApp',
    category: 'Internet',
    sentiment: 'negative',
    tags: ['dns', 'resolution']
  }),
  generateComplaint(43, {
    customerName: 'Victoria Campbell',
    subject: 'API timeout',
    description: 'API calls are timing out after 30 seconds.',
    status: 'unresolved',
    severity: 'high',
    priority: 'P1',
    source: 'Gmail',
    category: 'Technical',
    sentiment: 'frustrated',
    tags: ['api', 'timeout']
  }),
  generateComplaint(44, {
    customerName: 'Jack Parker',
    subject: 'App crashes on iOS',
    description: 'App crashes on iPhone 15 Pro Max.',
    status: 'unresolved',
    severity: 'critical',
    priority: 'P0',
    source: 'Twitter',
    category: 'App Crash',
    sentiment: 'frustrated',
    tags: ['ios', 'crash'],
    groupId: 'GRP-001'
  }),
  generateComplaint(45, {
    customerName: 'Luna Evans',
    subject: 'Settings not saving',
    description: 'App settings reset every time I close the app.',
    status: 'resolved',
    severity: 'low',
    priority: 'P3',
    source: 'Facebook',
    category: 'Technical',
    sentiment: 'neutral',
    tags: ['settings', 'save']
  }),
  generateComplaint(46, {
    customerName: 'Owen Edwards',
    subject: 'Promo code not working',
    description: 'Discount code shows as invalid.',
    status: 'unresolved',
    severity: 'medium',
    priority: 'P2',
    source: 'Chat',
    category: 'Billing',
    sentiment: 'negative',
    tags: ['promo', 'discount']
  }),
  generateComplaint(47, {
    customerName: 'Chloe Collins',
    subject: 'Upload speed too slow',
    description: 'Upload speed is only 1Mbps on 50Mbps plan.',
    status: 'in-progress',
    severity: 'medium',
    priority: 'P2',
    source: 'Phone',
    category: 'Internet',
    sentiment: 'frustrated',
    tags: ['upload', 'speed']
  }),
  generateComplaint(48, {
    customerName: 'Ryan Stewart',
    subject: 'Database connection error',
    description: 'Getting "Cannot connect to database" error.',
    status: 'unresolved',
    severity: 'critical',
    priority: 'P0',
    source: 'Gmail',
    category: 'Technical',
    sentiment: 'frustrated',
    tags: ['database', 'connection']
  }),
  generateComplaint(49, {
    customerName: 'Zoe Morris',
    subject: 'Blank screen on launch',
    description: 'App shows blank white screen after splash screen.',
    status: 'unresolved',
    severity: 'critical',
    priority: 'P0',
    source: 'WhatsApp',
    category: 'App Crash',
    sentiment: 'frustrated',
    tags: ['blank', 'screen'],
    groupId: 'GRP-001'
  }),
  generateComplaint(50, {
    customerName: 'Caleb Rogers',
    subject: 'Email notifications spam',
    description: 'Receiving hundreds of duplicate email notifications.',
    status: 'resolved',
    severity: 'low',
    priority: 'P3',
    source: 'Twitter',
    category: 'Technical',
    sentiment: 'neutral',
    tags: ['email', 'spam']
  })
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
  total: 1298,
  open: 162,
  resolved: 995,
  pending: 141,
  avgResolutionTime: '3.5h',
  slaComplianceRate: 94.8,
  escalated: 28,
  highSeverity: 68,
  csat: 4.3,
  changes: {
    total: 18.2,
    open: -6.5,
    resolved: 24.3,
    pending: 6.2,
    avgResolutionTime: -15.2,
    slaComplianceRate: 2.1,
    escalated: 14.8,
    highSeverity: -3.8,
    csat: 0.3
  }
};

export const sourceStats: SourceStats[] = [
  { source: 'WhatsApp', count: 485 },
  { source: 'Gmail', count: 368 },
  { source: 'Facebook', count: 225 },
  { source: 'Twitter', count: 182 },
  { source: 'Phone', count: 145 },
  { source: 'Chat', count: 98 },
  { source: 'Excel', count: 58 },
  { source: 'PDF', count: 35 },
  { source: 'Audio', count: 24 }
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
  { severity: 'Low', count: 485 },
  { severity: 'Medium', count: 392 },
  { severity: 'High', count: 285 },
  { severity: 'Critical', count: 136 }
];

export const statusDistributionData = [
  { category: 'Technical', open: 52, pending: 68, resolved: 268 },
  { category: 'App Crash', open: 48, pending: 58, resolved: 215 },
  { category: 'Internet', open: 38, pending: 42, resolved: 185 },
  { category: 'Billing', open: 35, pending: 48, reached: 158 },
  { category: 'Service', open: 22, pending: 28, resolved: 102 }
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
