-- Power_Alert Database Schema for Neon PostgreSQL
-- Database Name: power_alert_db

-- 1. Reports Table (বিদ্যুৎ বিভ্রাট ও বিদ্যুৎ আসার রিপোর্ট)
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    location VARCHAR(100) NOT NULL,
    has_power BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries on recent reports by location and time
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_location ON reports(location);

-- 2. Voltage Reports Table (ভোল্টেজ ফ্ল্যাকচুয়েশন ও সমস্যা রিপোর্ট)
CREATE TABLE IF NOT EXISTS voltage_reports (
    id SERIAL PRIMARY KEY,
    location VARCHAR(100) NOT NULL,
    voltage_issue VARCHAR(100) DEFAULT 'low_voltage',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_voltage_created_at ON voltage_reports(created_at);
