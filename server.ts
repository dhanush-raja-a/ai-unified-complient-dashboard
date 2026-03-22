import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import multer from 'multer';
import * as ExcelJS from 'exceljs';
import { execSync } from 'child_process';
import fs from 'fs';
import cors from 'cors';

const upload = multer({ dest: 'uploads/' });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  const seedDatabase = (count = 62, offset = 0) => {
    const names = ["Alice Johnson", "Bob Smith", "Charlie Davis", "Diana Prince", "Edward Norton", "Fiona Gallagher", "George Miller", "Hannah Abbott", "Ian Wright", "Jenny Slate", "Kevin Hart", "Laura Palmer", "Mike Wazowski", "Nina Simone", "Oscar Isaac", "Paul Rudd", "Quentin Tarantino", "Rachel Green", "Steve Rogers", "Tony Stark"];
    const subjects = ["Billing discrepancy", "App keeps crashing", "Slow internet connection", "Cannot login", "Refund request", "Feature request: Dark mode", "Payment failed", "Account locked", "Poor customer service", "Wrong item delivered", "Subscription renewal issue", "Website not loading", "Mobile app lag", "Email notification not received", "Data usage error"];
    const descriptions = [
      "I was charged twice for my subscription.",
      "The app crashes whenever I try to upload a photo.",
      "My internet speed is much lower than promised.",
      "Getting invalid credentials error even after password reset.",
      "I want a refund for the last month as service was down.",
      "Please add dark mode to the mobile app.",
      "My credit card was declined multiple times.",
      "I can't access my account after 3 failed attempts.",
      "The agent I spoke to was very rude.",
      "I received a package but it's not what I ordered.",
      "My subscription was supposed to cancel but I was charged.",
      "The dashboard is showing a 404 error.",
      "Scrolling through the list is very laggy on my iPhone.",
      "I didn't get the OTP for my login.",
      "The app says I used 10GB but I was offline all day."
    ];
    const statuses = ["unresolved", "in-progress", "resolved"];
    const severities = ["low", "medium", "high", "critical"];
    const sources = ["Gmail", "Phone", "Chat", "WhatsApp", "Twitter", "Facebook", "App Crash"];
    const categories = ["Billing", "Technical", "Internet", "General"];

    const initialData = [];
    for (let i = 0; i < count; i++) {
      const sev = severities[Math.floor(Math.random() * severities.length)];
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const daysAgo = Math.floor(Math.random() * 7);
      const hoursAgo = Math.floor(Math.random() * 24);
      const timestamp = new Date(Date.now() - (daysAgo * 24 + hoursAgo) * 60 * 60 * 1000).toISOString();
      const desc = descriptions[Math.floor(Math.random() * descriptions.length)];
      
      initialData.push({
        id: `CMP-${(100 + offset + i).toString()}`,
        customerName: names[Math.floor(Math.random() * names.length)],
        subject: subjects[Math.floor(Math.random() * subjects.length)],
        description: desc,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        severity: sev,
        priority: sev === 'critical' ? 'P0' : sev === 'high' ? 'P1' : sev === 'medium' ? 'P2' : 'P3',
        source: sources[Math.floor(Math.random() * sources.length)],
        category: cat,
        timestamp: timestamp,
        createdAt: timestamp,
        slaDeadline: new Date(new Date(timestamp).getTime() + (24 + Math.random() * 48) * 60 * 60 * 1000).toISOString(),
        sentiment: ['positive', 'neutral', 'negative', 'frustrated'][Math.floor(Math.random() * 4)],
        messages: [
          {
            id: `m-${Date.now()}-${offset + i}`,
            sender: 'customer',
            text: desc,
            timestamp: timestamp
          }
        ],
        tags: [cat.toLowerCase(), sev]
      });
    }
    const escapedData = JSON.stringify(initialData).replace(/"/g, '\\"');
    execSync(`python3 process_complaints.py save "${escapedData}"`);
  };

  // Initialize Python DB
  try {
    execSync('python3 process_complaints.py init');
    
    // Check if empty and seed with mock data
    const currentComplaints = JSON.parse(execSync('python3 process_complaints.py get').toString());
    if (currentComplaints.length < 100) {
      console.log(`Seeding database with more complaints (current: ${currentComplaints.length})...`);
      seedDatabase(112 - currentComplaints.length, currentComplaints.length);
    }
  } catch (e) {
    console.error('Failed to initialize or seed Python DB:', e);
  }

  // API Routes
  app.post('/api/upload-excel', upload.single('file'), async (req: any, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(req.file.path);
      const worksheet = workbook.getWorksheet(1);
      
      const complaints: any[] = [];
      worksheet?.eachRow((row, rowNumber) => {
        if (rowNumber > 1) { // Skip header
          const complaint = {
            id: row.getCell(1).value?.toString() || `C-${Date.now()}-${rowNumber}`,
            customerName: row.getCell(2).value?.toString() || 'Unknown',
            subject: row.getCell(3).value?.toString() || 'No Subject',
            description: row.getCell(4).value?.toString() || '',
            status: row.getCell(5).value?.toString() || 'unresolved',
            severity: row.getCell(6).value?.toString() || 'medium',
            priority: row.getCell(7).value?.toString() || 'P2',
            source: row.getCell(8).value?.toString() || 'Manual',
            category: row.getCell(9).value?.toString() || 'General',
            timestamp: new Date().toISOString()
          };
          complaints.push(complaint);
        }
      });

      // Save to Python SQLite
      const dataJson = JSON.stringify(complaints);
      // Escape for shell
      const escapedData = dataJson.replace(/"/g, '\\"');
      execSync(`python3 process_complaints.py save "${escapedData}"`);

      // Clean up upload
      fs.unlinkSync(req.file.path);

      res.json({ message: 'Excel processed and saved to SQLite via Python', count: complaints.length });
    } catch (error) {
      console.error('Excel processing error:', error);
      res.status(500).json({ error: 'Failed to process Excel' });
    }
  });

  app.get('/api/complaints', (req, res) => {
    try {
      const result = execSync('python3 process_complaints.py get').toString();
      let complaints = JSON.parse(result);
      
      // Check if we need to re-seed (if messages are empty for all)
      const needsReseed = complaints.length === 0 || complaints.every((c: any) => !c.messages || c.messages === '[]');
      
      if (needsReseed) {
        console.log('Detected old data format or empty DB, re-seeding...');
        seedDatabase();
        // Fetch again after seeding
        const freshResult = execSync('python3 process_complaints.py get').toString();
        complaints = JSON.parse(freshResult);
      }

      complaints = complaints.map((c: any) => ({
        ...c,
        messages: JSON.parse(c.messages || '[]'),
        tags: JSON.parse(c.tags || '[]'),
        isEscalated: !!c.isEscalated
      }));
      res.json(complaints);
    } catch (error) {
      console.error('Failed to get complaints from Python:', error);
      res.status(500).json({ error: 'Failed to fetch complaints' });
    }
  });

  app.post('/api/complaints/:id/escalate', (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    try {
      const updates = JSON.stringify({ isEscalated: true, escalationReason: reason }).replace(/"/g, '\\"');
      execSync(`python3 process_complaints.py update "${id}" "${updates}"`);
      res.json({ message: 'Complaint escalated' });
    } catch (error) {
      console.error('Failed to escalate complaint:', error);
      res.status(500).json({ error: 'Failed to escalate complaint' });
    }
  });

  app.patch('/api/complaints/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const updates = JSON.stringify({ status }).replace(/"/g, '\\"');
      execSync(`python3 process_complaints.py update "${id}" "${updates}"`);
      res.json({ message: 'Status updated' });
    } catch (error) {
      console.error('Failed to update status:', error);
      res.status(500).json({ error: 'Failed to update status' });
    }
  });

  app.post('/api/complaints/:id/messages', (req, res) => {
    const { id } = req.params;
    const { message } = req.body;
    try {
      const result = execSync('python3 process_complaints.py get').toString();
      const complaints = JSON.parse(result);
      const complaint = complaints.find((c: any) => c.id === id);
      
      if (complaint) {
        const messages = JSON.parse(complaint.messages || '[]');
        messages.push(message);
        const updates = JSON.stringify({ messages }).replace(/"/g, '\\"');
        execSync(`python3 process_complaints.py update "${id}" "${updates}"`);
        res.json({ message: 'Message added' });
      } else {
        res.status(404).json({ error: 'Complaint not found' });
      }
    } catch (error) {
      console.error('Failed to add message:', error);
      res.status(500).json({ error: 'Failed to add message' });
    }
  });

  app.post('/api/seed-more', (req, res) => {
    try {
      const result = execSync('python3 process_complaints.py get').toString();
      const currentComplaints = JSON.parse(result);
      seedDatabase(50, currentComplaints.length);
      res.json({ message: 'Added 50 more random complaints' });
    } catch (error) {
      console.error('Failed to seed more:', error);
      res.status(500).json({ error: 'Failed to seed more' });
    }
  });

  app.get('/api/export', (req, res) => {
    try {
      const result = execSync('python3 process_complaints.py get').toString();
      const complaints = JSON.parse(result);
      
      // Simple CSV generation
      const headers = ['ID', 'Customer', 'Subject', 'Status', 'Severity', 'Category', 'Created At'];
      const rows = complaints.map((c: any) => [
        c.id,
        c.customerName,
        c.subject,
        c.status,
        c.severity,
        c.category,
        c.createdAt
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map((row: any) => row.map((cell: any) => `"${cell}"`).join(','))
      ].join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=complaints_export.csv');
      res.send(csvContent);
    } catch (error) {
      console.error('Export error:', error);
      res.status(500).json({ error: 'Failed to export data' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
