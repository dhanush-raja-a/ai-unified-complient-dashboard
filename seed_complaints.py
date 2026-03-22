import json
from datetime import datetime, timedelta
import random
import sqlite3

names = ["John Doe", "Jane Smith", "Alice Brown", "Bob Wilson", "Charlie Davis", "David Miller", "Eve Thompson", "Frank Harris", "Grace Lee", "Henry Clark",
         "Isabella Martinez", "James Anderson", "Sophia Taylor", "Liam Thomas", "Olivia Jackson", "Noah White", "Emma Harris", "William Martin", "Ava Thompson", "Benjamin Garcia",
         "Mia Rodriguez", "Lucas Martinez", "Charlotte Lee", "Ethan Walker", "Amelia Hall", "Alexander Allen", "Harper Young", "Daniel King", "Evelyn Wright", "Matthew Lopez",
         "Abigail Hill", "Joseph Scott", "Emily Green", "Michael Adams", "Elizabeth Baker", "David Nelson", "Sofia Carter", "James Mitchell", "Aria Perez", "Jackson Roberts",
         "Scarlett Turner", "Sebastian Phillips", "Victoria Campbell", "Jack Parker", "Luna Evans", "Owen Edwards", "Chloe Collins", "Ryan Stewart", "Zoe Morris", "Caleb Rogers"]

subjects = [
    "App crashes on login", "Billing discrepancy", "Slow internet connection", "Cannot access technical documentation", "App crash on startup",
    "Login failed multiple times", "Double charge on my card", "Internet speed is very low", "Refund not received", "App keeps closing",
    "Payment gateway timeout", "Network disconnection", "Feature not working", "Account suspended", "Incorrect invoice",
    "App freezes", "Slow loading times", "Data sync issue", "Subscription not activated", "Connection drops",
    "Error message on login", "Missing features", "Overcharged", "Bandwidth throttling", "Cannot reset password",
    "App not responding", "UI glitches", "Unauthorized charge", "Latency issues", "Data loss",
    "Notification not working", "Refund delay", "Router issues", "App crashes on Android", "Search not working",
    "Wrong plan charged", "Packet loss", "Cannot upload files", "Memory leak", "Dark mode broken",
    "Duplicate transactions", "DNS resolution failure", "API timeout", "App crashes on iOS", "Settings not saving",
    "Promo code not working", "Upload speed too slow", "Database connection error", "Blank screen on launch", "Email notifications spam"
]

descriptions = [
    "The app crashes every time I try to log in with my Google account.",
    "I was charged twice for my subscription this month.",
    "My internet has been very slow for the past two days.",
    "The link to the technical documentation is broken.",
    "App crashes immediately after opening.",
    "I am unable to login, it says invalid credentials even though they are correct.",
    "I see two charges for the same transaction on my credit card statement.",
    "Getting only 2Mbps on a 100Mbps plan.",
    "It has been 10 days since the refund was initiated, but I haven't received it.",
    "The app closes automatically after 5 seconds of use.",
    "Payment keeps timing out during checkout process.",
    "Internet disconnects every 30 minutes.",
    "The export feature is not responding.",
    "My account was suspended without any notification.",
    "Invoice shows wrong amount for last month.",
    "App freezes when uploading files.",
    "Pages take forever to load.",
    "My data is not syncing across devices.",
    "Paid for premium but still showing free account.",
    "WiFi connection drops randomly throughout the day.",
    "Getting \"Server Error 500\" when trying to log in.",
    "Features mentioned in the plan are not available.",
    "Was charged $99 instead of $49.",
    "Internet speed is being throttled during peak hours.",
    "Password reset link is not working.",
    "App becomes unresponsive after 10 minutes of use.",
    "Interface elements are overlapping and unreadable.",
    "There is a charge I did not authorize on my account.",
    "Experiencing high latency during video calls.",
    "Lost all my saved data after the last update.",
    "Not receiving any push notifications.",
    "Refund was promised in 5 days but it has been 2 weeks.",
    "Router keeps restarting on its own.",
    "App crashes specifically on Android 14 devices.",
    "Search function returns no results.",
    "Being charged for enterprise plan but signed up for basic.",
    "Experiencing 30% packet loss during gaming.",
    "File upload fails with error code 403.",
    "App consumes all device memory and slows down phone.",
    "Dark mode makes text unreadable.",
    "Same transaction appears twice in my statement.",
    "Cannot access certain websites due to DNS issues.",
    "API calls are timing out after 30 seconds.",
    "App crashes on iPhone 15 Pro Max.",
    "App settings reset every time I close the app.",
    "Discount code shows as invalid.",
    "Upload speed is only 1Mbps on 50Mbps plan.",
    "Getting \"Cannot connect to database\" error.",
    "App shows blank white screen after splash screen.",
    "Receiving hundreds of duplicate email notifications."
]

statuses = ["unresolved", "in-progress", "resolved"]
severities = ["low", "medium", "high", "critical"]
priorities = {"critical": "P0", "high": "P1", "medium": "P2", "low": "P3"}
sources = ["Gmail", "WhatsApp", "Twitter", "Facebook", "Phone", "Chat"]
categories = ["App Crash", "Billing", "Internet", "Technical"]
sentiments = ["positive", "neutral", "negative", "frustrated"]

complaints = []
base_date = datetime.now()

for i in range(50):
    severity = random.choice(severities)
    category = random.choice(categories)
    status = random.choice(statuses)
    
    # Create timestamp within last 7 days
    hours_ago = random.randint(0, 168)
    created_at = (base_date - timedelta(hours=hours_ago)).isoformat() + 'Z'
    
    # Calculate SLA deadline based on severity
    sla_hours = {"critical": 4, "high": 24, "medium": 48, "low": 72}[severity]
    sla_deadline = (datetime.fromisoformat(created_at.replace('Z', '')) + timedelta(hours=sla_hours)).isoformat() + 'Z'
    
    complaint = {
        "id": f"CMP-{str(i+1).zfill(3)}",
        "customerName": names[i],
        "subject": subjects[i],
        "description": descriptions[i],
        "status": status,
        "severity": severity,
        "priority": priorities[severity],
        "source": random.choice(sources),
        "category": category,
        "sentiment": random.choice(sentiments),
        "createdAt": created_at,
        "timestamp": created_at,
        "slaDeadline": sla_deadline,
        "messages": [
            {
                "id": f"m-{i+1}",
                "sender": "customer",
                "text": descriptions[i],
                "timestamp": created_at
            }
        ],
        "tags": [category.lower().replace(" ", "-"), severity],
        "isEscalated": False,
        "escalationReason": ""
    }
    complaints.append(complaint)

# Save to database directly
import sqlite3

conn = sqlite3.connect('complaints.db')
c = conn.cursor()

# Create table if not exists
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

# Insert complaints
for comp in complaints:
    c.execute('''
        INSERT OR REPLACE INTO complaints 
        (id, customerName, subject, description, status, severity, priority, source, category, sentiment, createdAt, slaDeadline, messages, tags, timestamp, isEscalated, escalationReason)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        comp['id'],
        comp['customerName'],
        comp['subject'],
        comp['description'],
        comp['status'],
        comp['severity'],
        comp['priority'],
        comp['source'],
        comp['category'],
        comp['sentiment'],
        comp['createdAt'],
        comp['slaDeadline'],
        json.dumps(comp['messages']),
        json.dumps(comp['tags']),
        comp['timestamp'],
        1 if comp['isEscalated'] else 0,
        comp['escalationReason']
    ))

conn.commit()
conn.close()
print(f"Successfully seeded {len(complaints)} complaints into the database!")
