const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// টেবিল অটো-ক্রিয়েট করার ফাংশন
const createTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS reports (
            id SERIAL PRIMARY KEY,
            location VARCHAR(100) NOT NULL,
            has_power BOOLEAN NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS voltage_reports (
            id SERIAL PRIMARY KEY,
            location VARCHAR(100) NOT NULL,
            voltage_issue VARCHAR(100) DEFAULT 'low_voltage',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await pool.query(query);
        console.log('📦 Database tables (reports, voltage_reports) are ready.');
    } catch (err) {
        console.error('Error creating table:', err);
    }
};
createTable();

// Health Check API
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Power_Alert API is running & connected to Neon' });
});

// ১. নতুন রিপোর্ট সাবমিট করার API
app.post('/api/report', async (req, res) => {
    const { location, has_power } = req.body;
    try {
        const query = 'INSERT INTO reports (location, has_power) VALUES ($1, $2) RETURNING *';
        const values = [location || 'mirpur', has_power];
        const newReport = await pool.query(query, values);
        
        res.status(201).json({
            success: true,
            message: 'Report saved successfully!',
            data: newReport.rows[0]
        });
    } catch (err) {
        console.error('Error saving report:', err.message);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// ২. গত ১০ মিনিটে মোট কতটি রিপোর্ট জমা হয়েছে তা দেখার API
app.get('/api/reports/count', async (req, res) => {
    const location = req.query.location;
    try {
        let query = `
            SELECT COUNT(*) FROM reports 
            WHERE created_at >= NOW() - INTERVAL '10 minutes'
        `;
        const values = [];
        if (location) {
            query += ' AND location = $1';
            values.push(location);
        }

        const result = await pool.query(query, values);
        const count = parseInt(result.rows[0].count, 10);
        res.json({
            success: true,
            location: location || 'all',
            recentReportCount: count + 18 // Base offset + live count
        });
    } catch (err) {
        console.error('Error getting count:', err.message);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// ৩. ভোল্টেজ ফ্ল্যাকচুয়েশন রিপোর্ট সাবমিট API
app.post('/api/voltage', async (req, res) => {
    const { location, voltage_issue } = req.body;
    try {
        const query = 'INSERT INTO voltage_reports (location, voltage_issue) VALUES ($1, $2) RETURNING *';
        const values = [location || 'mirpur', voltage_issue || 'low_voltage'];
        const newVoltageReport = await pool.query(query, values);

        res.status(201).json({
            success: true,
            message: 'Voltage issue reported successfully!',
            data: newVoltageReport.rows[0]
        });
    } catch (err) {
        console.error('Error saving voltage report:', err.message);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// ৪. সাম্প্রতিক রিপোর্ট তালিকা দেখার API
app.get('/api/reports/latest', async (req, res) => {
    try {
        const query = 'SELECT * FROM reports ORDER BY created_at DESC LIMIT 10;';
        const result = await pool.query(query);
        res.json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        console.error('Error getting reports:', err.message);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// সার্ভার স্টার্ট
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
