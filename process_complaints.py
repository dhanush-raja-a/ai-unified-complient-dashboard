import sqlite3
import json
import sys
import os

def init_db():
    conn = sqlite3.connect('complaints.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS complaints (
            id TEXT PRIMARY KEY,
            customerName TEXT,
            subject TEXT,
            description TEXT,
            status TEXT,
            severity TEXT,
            priority TEXT,
            source TEXT,
            category TEXT,
            sentiment TEXT,
            createdAt TEXT,
            slaDeadline TEXT,
            messages TEXT,
            tags TEXT,
            timestamp TEXT,
            isEscalated INTEGER DEFAULT 0,
            escalationReason TEXT
        )
    ''')
    conn.commit()
    conn.close()

def save_complaints(complaints):
    conn = sqlite3.connect('complaints.db')
    c = conn.cursor()
    for comp in complaints:
        c.execute('''
            INSERT OR REPLACE INTO complaints 
            (id, customerName, subject, description, status, severity, priority, source, category, sentiment, createdAt, slaDeadline, messages, tags, timestamp, isEscalated, escalationReason)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            comp.get('id'),
            comp.get('customerName'),
            comp.get('subject'),
            comp.get('description'),
            comp.get('status'),
            comp.get('severity'),
            comp.get('priority'),
            comp.get('source'),
            comp.get('category'),
            comp.get('sentiment', 'neutral'),
            comp.get('createdAt', comp.get('timestamp')),
            comp.get('slaDeadline', ''),
            json.dumps(comp.get('messages', [])),
            json.dumps(comp.get('tags', [])),
            comp.get('timestamp'),
            1 if comp.get('isEscalated') else 0,
            comp.get('escalationReason', '')
        ))
    conn.commit()
    conn.close()

def get_complaints():
    conn = sqlite3.connect('complaints.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('SELECT * FROM complaints ORDER BY timestamp DESC')
    rows = c.fetchall()
    complaints = [dict(row) for row in rows]
    conn.close()
    return complaints

def update_complaint(complaint_id, updates):
    conn = sqlite3.connect('complaints.db')
    c = conn.cursor()
    
    # Filter only valid columns
    valid_columns = [
        'customerName', 'subject', 'description', 'status', 'severity', 
        'priority', 'source', 'category', 'sentiment', 'createdAt', 
        'slaDeadline', 'messages', 'tags', 'timestamp', 'isEscalated', 
        'escalationReason'
    ]
    
    update_parts = []
    values = []
    for key, value in updates.items():
        if key in valid_columns:
            update_parts.append(f"{key} = ?")
            if key in ['messages', 'tags']:
                values.append(json.dumps(value))
            elif key == 'isEscalated':
                values.append(1 if value else 0)
            else:
                values.append(value)
    
    if not update_parts:
        conn.close()
        return
        
    values.append(complaint_id)
    query = f"UPDATE complaints SET {', '.join(update_parts)} WHERE id = ?"
    c.execute(query, values)
    conn.commit()
    conn.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python process_complaints.py [init|save|get|update] [data_json]")
        sys.exit(1)

    command = sys.argv[1]

    if command == "init":
        init_db()
        print("Database initialized")
    elif command == "save":
        if len(sys.argv) < 3:
            print("Error: data_json required for save command")
            sys.exit(1)
        data = json.loads(sys.argv[2])
        save_complaints(data)
        print("Complaints saved")
    elif command == "get":
        complaints = get_complaints()
        print(json.dumps(complaints))
    elif command == "update":
        if len(sys.argv) < 4:
            print("Usage: python process_complaints.py update [id] [json_updates]")
            sys.exit(1)
        complaint_id = sys.argv[2]
        updates = json.loads(sys.argv[3])
        update_complaint(complaint_id, updates)
        print("Complaint updated")
