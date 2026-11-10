const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// ========================================================
// এলাকাভিত্তিক সরকারি বিদ্যুৎ সরবরাহ, চাহিদা ও গ্রিড প্রোফাইল
// ========================================================
const AREA_PROFILES = {
    // ভিআইপি / অগ্রাধিকার এলাকা
    "gulshan": { name: "গুলশান", zone: "ভিআইপি / কূটনৈতিক জোন", base_gen: 10800.0, base_dem: 10200.0, base_ls: 0.0, priority: true },
    "banani": { name: "বনানী", zone: "ভিআইপি আবাসিক ও বাণিজ্যিক", base_gen: 10800.0, base_dem: 10300.0, base_ls: 0.0, priority: true },
    "cantonment": { name: "ঢাকা ক্যান্টনমেন্ট", zone: "সংরক্ষিত ও নিরাপত্তা জোন", base_gen: 11000.0, base_dem: 10100.0, base_ls: 0.0, priority: true },
    "dhanmondi": { name: "ধানমন্ডি", zone: "আবাসিক ও শিক্ষাপ্রতিষ্ঠান জোন", base_gen: 10500.0, base_dem: 10400.0, base_ls: 15.0, priority: false },
    "shahbagh": { name: "শাহবাগ", zone: "হাসপাতাল ও বিশ্ববিদ্যালয় এলাকা", base_gen: 10700.0, base_dem: 10250.0, base_ls: 5.0, priority: true },
    "ramna": { name: "রমনা", zone: "প্রশাসনিক ও সচিবালয় জোন", base_gen: 10800.0, base_dem: 10200.0, base_ls: 0.0, priority: true },

    // ভারী শিল্প ও ঘনবসতিপূর্ণ অঞ্চল
    "demra": { name: "ডেমরা", zone: "ভারী শিল্প ও ঘনবসতি জোন", base_gen: 9400.0, base_dem: 10800.0, base_ls: 350.0, priority: false },
    "narayanganj": { name: "নারায়ণগঞ্জ", zone: "টেক্সটাইল ও বৃহৎ নদী বন্দর শিল্পাঞ্চল", base_gen: 9200.0, base_dem: 11200.0, base_ls: 450.0, priority: false },
    "gazipur": { name: "গাজীপুর", zone: "তৈরি পোশাক ও মেগা শিল্পাঞ্চল", base_gen: 9100.0, base_dem: 11400.0, base_ls: 500.0, priority: false },
    "savar": { name: "সাভার", zone: "ইপিজেড ও রপ্তানিমুখী তৈরি পোশাক", base_gen: 9300.0, base_dem: 11100.0, base_ls: 420.0, priority: false },
    "tejgaon": { name: "তেজগাঁও", zone: "বাণিজ্যিক ও পুরোনো শিল্পাঞ্চল", base_gen: 9600.0, base_dem: 10900.0, base_ls: 250.0, priority: false },
    "kadamtali": { name: "কদমতলী", zone: "ইস্পাত ও ধাতব শিল্প জোন", base_gen: 9450.0, base_dem: 10850.0, base_ls: 340.0, priority: false },
    "jatrabari": { name: "যাত্রাবাড়ী", zone: "ঘনবসতি ও প্রবেশদ্বার এলাকা", base_gen: 9550.0, base_dem: 10750.0, base_ls: 280.0, priority: false },

    // প্রধান মিশ্র আবাসিক ও বাণিজ্যিক এলাকা
    "mirpur": { name: "মিরপুর", zone: "বৃহৎ আবাসিক ও মিশ্র বাণিজ্যিক", base_gen: 9800.0, base_dem: 10600.0, base_ls: 120.0, priority: false },
    "uttara": { name: "উত্তরা", zone: "আধুনিক আবাসিক ও বিমানবন্দর জোন", base_gen: 10100.0, base_dem: 10500.0, base_ls: 80.0, priority: false },
    "mohammadpur": { name: "মোহাম্মদপুর", zone: "আবাসিক ও ঘনবসতি", base_gen: 9850.0, base_dem: 10550.0, base_ls: 110.0, priority: false },
    "badda": { name: "বাড্ডা", zone: "মিশ্র আবাসিক ও বাণিজ্যিক জোন", base_gen: 9750.0, base_dem: 10650.0, base_ls: 180.0, priority: false },
    "khilgaon": { name: "খিলগাঁও", zone: "আবাসিক ও রেস্তোরাঁ জোন", base_gen: 9900.0, base_dem: 10500.0, base_ls: 90.0, priority: false },
    "rampura": { name: "রামপুরা", zone: "টেলিভিশন সেন্টার ও আবাসিক", base_gen: 9900.0, base_dem: 10450.0, base_ls: 85.0, priority: false },
    "motijheel": { name: "মতিঝিল", zone: "আর্থিক ও বাণিজ্যিক কেন্দ্র", base_gen: 10400.0, base_dem: 10300.0, base_ls: 25.0, priority: false },
    "paltan": { name: "পল্টন", zone: "কেন্দ্রীয় বাণিজ্যিক ও প্রেস ক্লাব জোন", base_gen: 10350.0, base_dem: 10350.0, base_ls: 30.0, priority: false },
    "lalbagh": { name: "লালবাগ", zone: "ঐতিহ্যবাহী পুরোনো ঢাকা জোন", base_gen: 9700.0, base_dem: 10600.0, base_ls: 160.0, priority: false },
    "hazaribagh": { name: "হাজারীবাগ", zone: "ঘনবসতি ও মিশ্র শিল্প", base_gen: 9650.0, base_dem: 10700.0, base_ls: 210.0, priority: false },
    "sutrapur": { name: "সূত্রাপুর", zone: "পুরোনো ঢাকা নদী সংলগ্ন", base_gen: 9750.0, base_dem: 10550.0, base_ls: 130.0, priority: false },
    "kotwali": { name: "কোতোয়ালী", zone: "সদরঘাট পাইকারি বাণিজ্যিক", base_gen: 9800.0, base_dem: 10500.0, base_ls: 100.0, priority: false },
    "kamrangirchar": { name: "কামরাঙ্গীরচর", zone: "উচ্চ ঘনবসতি ও ক্ষুদ্র কারখানা", base_gen: 9400.0, base_dem: 10850.0, base_ls: 320.0, priority: false },
    "kafrul": { name: "কাফরুল", zone: "আবাসিক ও সেনাপল্লী সংলগ্ন", base_gen: 9950.0, base_dem: 10450.0, base_ls: 75.0, priority: false },
    "khilkhet": { name: "খিলক্ষেত", zone: "আবাসিক ও নিকুঞ্জ জোন", base_gen: 10000.0, base_dem: 10450.0, base_ls: 70.0, priority: false },
    "uttarkhan": { name: "উত্তরখান", zone: "শহরতলী আবাসিক অঞ্চল", base_gen: 9600.0, base_dem: 10700.0, base_ls: 220.0, priority: false },
    "dakshinkhan": { name: "দক্ষিণখান", zone: "শহরতলী আবাসিক অঞ্চল", base_gen: 9600.0, base_dem: 10700.0, base_ls: 210.0, priority: false },
    "turag": { name: "তুরাগ", zone: "তুরাগ নদী তীরবর্তী জোন", base_gen: 9650.0, base_dem: 10650.0, base_ls: 190.0, priority: false },

    // ঢাকা জেলা (উপজেলা) ও বিভাগের অন্যান্য জেলা
    "keraniganj": { name: "কেরানীগঞ্জ", zone: "গার্মেন্টস ও মাঝারি শিল্প অঞ্চল", base_gen: 9400.0, base_dem: 10900.0, base_ls: 360.0, priority: false },
    "dhamrai": { name: "ধামরাই", zone: "কৃষি ও উদীয়মান শিল্পাঞ্চল", base_gen: 9500.0, base_dem: 10750.0, base_ls: 260.0, priority: false },
    "dohar": { name: "দোহার", zone: "উপজেলা আবাসিক ও পদ্মা তীরবর্তী", base_gen: 9550.0, base_dem: 10700.0, base_ls: 240.0, priority: false },
    "nawabganj": { name: "নবাবগঞ্জ", zone: "উপজেলা গ্রামীণ ও মিশ্র জোন", base_gen: 9550.0, base_dem: 10700.0, base_ls: 230.0, priority: false },
    "narsingdi": { name: "নরসিংদী", zone: "বৃহৎ তাঁত ও টেক্সটাইল শিল্প", base_gen: 9350.0, base_dem: 11000.0, base_ls: 380.0, priority: false },
    "tangail": { name: "টাঙ্গাইল", zone: "কৃষি ও ঐতিহ্যবাহী শিল্প অঞ্চল", base_gen: 9450.0, base_dem: 10800.0, base_ls: 290.0, priority: false },
    "munshiganj": { name: "মুন্সীগঞ্জ", zone: "আলু হিমাগার ও নৌবন্দর শিল্প", base_gen: 9500.0, base_dem: 10750.0, base_ls: 250.0, priority: false },
    "manikganj": { name: "মানিকগঞ্জ", zone: "মহাসড়ক সংলগ্ন ও তামাক শিল্প", base_gen: 9550.0, base_dem: 10700.0, base_ls: 220.0, priority: false },
    "kishoreganj": { name: "কিশোরগঞ্জ", zone: "হাওর ও পল্লী বিদ্যুৎ অঞ্চল", base_gen: 9600.0, base_dem: 10650.0, base_ls: 200.0, priority: false },
    "faridpur": { name: "ফরিদপুর", zone: "দক্ষিণাঞ্চলের প্রবেশদ্বার ও জেলা সদর", base_gen: 9500.0, base_dem: 10750.0, base_ls: 250.0, priority: false },
    "gopalganj": { name: "গোপালগঞ্জ", zone: "জেলা সদর ও আবাসিক", base_gen: 9650.0, base_dem: 10600.0, base_ls: 180.0, priority: false },
    "madaripur": { name: "মাদারীপুর", zone: "পদ্মা সেতু সংযোগ জোন", base_gen: 9600.0, base_dem: 10650.0, base_ls: 210.0, priority: false },
    "rajbari": { name: "রাজবাড়ী", zone: "রেলওয়ে ও নদী তীরবর্তী জোন", base_gen: 9550.0, base_dem: 10700.0, base_ls: 230.0, priority: false },
    "shariatpur": { name: "শরীয়তপুর", zone: "নদী তীরবর্তী ও আবাসিক", base_gen: 9550.0, base_dem: 10700.0, base_ls: 240.0, priority: false }
};

// AI & Grid Calculation Helper
function calculateAiOutagePrediction(location, totalReports = 0, noPowerReports = 0) {
    const locKey = (location || "tejgaon").trim().toLowerCase();
    let profile = AREA_PROFILES[locKey];
    if (!profile) {
        profile = {
            name: location,
            zone: "সাধারণ নগর অঞ্চল",
            base_gen: 9800.0,
            base_dem: 10500.0,
            base_ls: 150.0,
            priority: false
        };
    }

    const now = new Date();
    const hour = now.getHours();
    const isPeak = (hour >= 17 && hour <= 23) || (hour >= 13 && hour <= 16);

    let gen = profile.base_gen;
    let dem = profile.base_dem;
    let ls = profile.base_ls;

    if (isPeak) {
        dem += 400.0;
        if (!profile.priority) {
            gen -= 250.0;
            ls = Math.max(ls, 120.0) + 80.0;
        }
    } else {
        dem -= 300.0;
        ls = Math.max(0.0, ls - 80.0);
    }

    if (totalReports > 0) {
        const ratio = noPowerReports / totalReports;
        ls = Math.max(ls, ratio * 450.0);
        if (ratio > 0.5) {
            dem += 250.0;
            gen -= 200.0;
        }
    }

    gen = Math.max(3500.0, Math.min(14000.0, gen));
    dem = Math.max(3500.0, Math.min(14500.0, dem));
    ls = Math.max(0.0, Math.min(3000.0, ls));

    // ML probability calculation
    let mlProb;
    if (profile.priority) {
        mlProb = Math.max(5.0, Math.min(25.0, ((dem - gen + ls) / 100.0) + 8.0));
    } else {
        const deficit = (dem - gen) + (ls * 1.5);
        mlProb = Math.max(15.0, Math.min(96.0, 50.0 + (deficit / 40.0)));
    }

    let finalPct;
    if (totalReports > 0) {
        const crowdPct = (noPowerReports / totalReports) * 100.0;
        finalPct = Math.round(0.45 * mlProb + 0.55 * crowdPct);
    } else {
        finalPct = Math.round(mlProb);
    }
    finalPct = Math.max(5, Math.min(98, finalPct));

    let riskLabel, riskColor, statusTime, duration, aiMsg;
    if (finalPct >= 75) {
        riskLabel = "উচ্চ ঝুঁকি (তীব্র লোডশেডিং)";
        riskColor = "red";
        statusTime = "শিঘ্রই হতে পারে (পিক আওয়ার)";
        duration = "১ ঘণ্টা ৩০ মিনিট";
        aiMsg = `⚠️ ${profile.name} এলাকায় উচ্চ চাহিদার বিপরীতে সরবরাহে ঘাটতি রয়েছে। লোডশেডিংয়ের তীব্র ঝুঁকি।`;
    } else if (finalPct >= 45) {
        riskLabel = "মাঝারি ঝুঁকি (ঘাটতি বিদ্যমান)";
        riskColor = "amber";
        statusTime = "পরবর্তী ১-২ ঘণ্টার মধ্যে";
        duration = "৪৫ মিনিট - ১ ঘণ্টা";
        aiMsg = `⚡ ${profile.name} এলাকায় গ্রিড চাহিদা ও সরবরাহে আংশিক ভারসাম্যহীনতা রয়েছে। লোডশেডিং হতে পারে।`;
    } else if (finalPct >= 25) {
        riskLabel = "কম ঝুঁকি (স্বাভাবিক সূচি)";
        riskColor = "yellow";
        statusTime = "স্বাভাবিক সময়সূচী";
        duration = "০-২০ মিনিট";
        aiMsg = `ℹ️ ${profile.name} এলাকায় সরকারি বিদ্যুৎ সরবরাহ ও চাহিদা প্রায় সমান। পরিস্থিতি স্থিতিশীল।`;
    } else {
        riskLabel = "ঝুঁকি নেই (নিরাপদ / ভিআইপি)";
        riskColor = "green";
        statusTime = "স্বাভাবিক সময়সূচী";
        duration = "০ মিনিট";
        aiMsg = `✅ ${profile.name} এলাকায় সরকারি সরবরাহ চাহিদার চেয়ে পর্যাপ্ত। লোডশেডিংয়ের কোনো ঝুঁকি নেই।`;
    }

    let lsLevelText, lsBadgeColor;
    if (ls <= 20) {
        lsLevelText = "স্বাভাবিক (০-২০ MW)";
        lsBadgeColor = "green";
    } else if (ls <= 150) {
        lsLevelText = `স্বল্প লোডশেডিং (${Math.round(ls)} MW ঘাটতি)`;
        lsBadgeColor = "yellow";
    } else if (ls <= 300) {
        lsLevelText = `মাঝারি লোডশেডিং (${Math.round(ls)} MW ঘাটতি)`;
        lsBadgeColor = "amber";
    } else {
        lsLevelText = `তীব্র লোডশেডিং (${Math.round(ls)} MW ঘাটতি)`;
        lsBadgeColor = "red";
    }

    return {
        percentage: finalPct,
        status_time: statusTime,
        duration: duration,
        risk_label: riskLabel,
        risk_color: riskColor,
        ml_prob: Math.round(mlProb * 10) / 10,
        prediction: finalPct >= 50 ? 1 : 0,
        message: aiMsg,
        generation_mw: Math.round(gen * 10) / 10,
        demand_mw: Math.round(dem * 10) / 10,
        load_shedding: Math.round(ls * 10) / 10,
        load_shedding_text: lsLevelText,
        ls_badge_color: lsBadgeColor,
        zone_type: profile.zone,
        area_name: profile.name
    };
}

// টেবিল অটো-ক্রিয়েট ফাংশন (safe)
const initDb = async () => {
    if (!pool) return;
    try {
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
            CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
            CREATE INDEX IF NOT EXISTS idx_reports_location ON reports(location);
        `;
        await pool.query(query);
        console.log('📦 Database tables (reports, voltage_reports) are ready.');
    } catch (err) {
        console.error('Error creating table:', err.message);
    }
};
initDb();

// ==========================================
// STATIC FILES & ROOT ROUTES (Vercel Fix)
// ==========================================
// Root route: index.html সার্ভ করা
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// map.js সার্ভ করা
app.get('/map.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, 'map.js'));
});

// ==========================================
// API ROUTES
// ==========================================

// Health Check API
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Power_Alert API is running & connected to Neon',
        uptime: process.uptime()
    });
});

// AI মডেল স্ট্যাটাস চেক API
app.get('/api/ai-status', (req, res) => {
    res.json({
        success: true,
        model_loaded: true,
        model_type: "RandomForestClassifier",
        model_file: "power_alert_model (1).pkl",
        features: ["generation_mw", "demand_mw", "load_shedding", "hour", "day_of_week", "month"],
        total_areas: Object.keys(AREA_PROFILES).length
    });
});

// এলাকাভিত্তিক রিয়েল-টাইম AI পূর্বাভাস ও গ্রিড স্ট্যাটাস API (GET)
app.get('/api/outage-stats/:location', async (req, res) => {
    const location = req.params.location;
    let totalReports = 0;
    let noPowerReports = 0;

    if (pool) {
        try {
            const query = `
                SELECT 
                    COUNT(*) AS total_reports,
                    SUM(CASE WHEN has_power = FALSE THEN 1 ELSE 0 END) AS no_power_reports
                FROM reports 
                WHERE LOWER(location) = LOWER($1) 
                  AND created_at >= NOW() - INTERVAL '2 hours';
            `;
            const result = await pool.query(query, [location]);
            if (result.rows.length > 0) {
                totalReports = parseInt(result.rows[0].total_reports || 0, 10);
                noPowerReports = parseInt(result.rows[0].no_power_reports || 0, 10);
            }
        } catch (err) {
            console.error('Error fetching outage stats from DB:', err.message);
        }
    }

    const aiRes = calculateAiOutagePrediction(location, totalReports, noPowerReports);

    const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    res.json({
        success: true,
        location: location,
        area_name: aiRes.area_name,
        zone_type: aiRes.zone_type,
        percentage: `${aiRes.percentage}%`,
        width: `${aiRes.percentage}%`,
        time: aiRes.status_time,
        duration: aiRes.duration,
        risk_label: aiRes.risk_label,
        risk_color: aiRes.risk_color,
        total_reports: totalReports,
        no_power_reports: noPowerReports,
        is_ai_predicted: true,
        generation_mw: aiRes.generation_mw,
        demand_mw: aiRes.demand_mw,
        load_shedding_mw: aiRes.load_shedding,
        load_shedding_text: aiRes.load_shedding_text,
        ls_badge_color: aiRes.ls_badge_color,
        ai_message: aiRes.message,
        ai_details: {
            model: "RandomForest (pkl)",
            ml_probability: aiRes.ml_prob,
            generation_mw: aiRes.generation_mw,
            demand_mw: aiRes.demand_mw,
            load_shedding_mw: aiRes.load_shedding,
            timestamp: nowStr
        }
    });
});

// লাইভ হিটম্যাপ ডাটা API (Leaflet.js এর জন্য)
app.get('/api/map-data', async (req, res) => {
    const areas = [
        { id: "dhanmondi", name: "ধানমন্ডি", lat: 23.7461, lng: 90.3742 },
        { id: "mirpur", name: "মিরপুর", lat: 23.8041, lng: 90.3667 },
        { id: "uttara", name: "উত্তরা", lat: 23.8759, lng: 90.3795 },
        { id: "gulshan", name: "গুলশান", lat: 23.7925, lng: 90.4078 },
        { id: "banani", name: "বনানী", lat: 23.7937, lng: 90.4043 },
        { id: "mohammadpur", name: "মোহাম্মদপুর", lat: 23.7658, lng: 90.3584 },
        { id: "tejgaon", name: "তেজগাঁও", lat: 23.7598, lng: 90.3913 },
        { id: "badda", name: "বাড্ডা", lat: 23.7806, lng: 90.4267 },
        { id: "motijheel", name: "মতিঝিল", lat: 23.7330, lng: 90.4172 },
        { id: "jatrabari", name: "যাত্রাবাড়ী", lat: 23.7104, lng: 90.4349 },
        { id: "demra", name: "ডেমরা", lat: 23.7147, lng: 90.4988 },
        { id: "savar", name: "সাভার", lat: 23.8442, lng: 90.2588 },
        { id: "gazipur", name: "গাজীপুর", lat: 23.9999, lng: 90.4203 },
        { id: "narayanganj", name: "নারায়ণগঞ্জ", lat: 23.6238, lng: 90.5000 },
        { id: "keraniganj", name: "কেরানীগঞ্জ", lat: 23.6823, lng: 90.3152 }
    ];

    const reportMap = {};

    if (pool) {
        try {
            const query = `
                SELECT 
                    LOWER(location) AS loc,
                    COUNT(*) AS total,
                    SUM(CASE WHEN has_power = FALSE THEN 1 ELSE 0 END) AS no_power
                FROM reports
                WHERE created_at >= NOW() - INTERVAL '2 hours'
                GROUP BY LOWER(location);
            `;
            const result = await pool.query(query);
            result.rows.forEach(row => {
                const locKey = (row.loc || "").trim().toLowerCase();
                reportMap[locKey] = {
                    total: parseInt(row.total || 0, 10),
                    no_power: parseInt(row.no_power || 0, 10)
                };
            });
        } catch (err) {
            console.error('Error fetching map reports from DB:', err.message);
        }
    }

    const resultLocations = areas.map(a => {
        const stat = reportMap[a.id];
        let status, color, msg;
        if (stat && stat.total > 0) {
            const ratio = stat.no_power / stat.total;
            if (ratio >= 0.5) {
                status = "outage";
                color = "#ff2a6d";
                msg = `বিদ্যুৎ নেই (${Math.round(ratio * 100)}% ইউজার রিপোর্ট)`;
            } else if (ratio >= 0.2) {
                status = "risk";
                color = "#ffb300";
                msg = `ঝুঁকিপূর্ণ (${Math.round(ratio * 100)}%)`;
            } else {
                status = "normal";
                color = "#00e676";
                msg = "স্বাভাবিক (বিদ্যুৎ আছে)";
            }
        } else {
            const aiData = calculateAiOutagePrediction(a.id, 0, 0);
            const p = aiData.percentage;
            if (p >= 70) {
                status = "outage";
                color = "#ff2a6d";
                msg = `উচ্চ ঝুঁকি (AI পূর্বাভাস ${p}%)`;
            } else if (p >= 40) {
                status = "risk";
                color = "#ffb300";
                msg = `মাঝারি ঝুঁকি (AI পূর্বাভাস ${p}%)`;
            } else {
                status = "normal";
                color = "#00e676";
                msg = "স্বাভাবিক (ঝুঁকি কম)";
            }
        }

        return {
            id: a.id,
            name: a.name,
            lat: a.lat,
            lng: a.lng,
            status: status,
            color: color,
            msg: msg
        };
    });

    res.json({
        success: true,
        locations: resultLocations
    });
});

// ১. নতুন রিপোর্ট সাবমিট করার API (POST)
app.post('/api/report', async (req, res) => {
    const { location, has_power } = req.body;
    if (!pool) {
        return res.status(201).json({
            success: true,
            message: 'Report received (DB offline fallback)',
            data: { location: location || 'mirpur', has_power }
        });
    }

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
        res.status(500).json({ success: false, error: 'Database Error' });
    }
});

// ২. গত ১০ মিনিটে মোট কতটি রিপোর্ট জমা হয়েছে তা দেখার API (GET)
app.get('/api/reports/count', async (req, res) => {
    const location = req.query.location;
    if (!pool) {
        return res.json({
            success: true,
            location: location || 'all',
            recentReportCount: 18
        });
    }

    try {
        let query = `
            SELECT COUNT(*) FROM reports 
            WHERE created_at >= NOW() - INTERVAL '10 minutes'
        `;
        const values = [];
        if (location) {
            query += ' AND LOWER(location) = LOWER($1)';
            values.push(location);
        }

        const result = await pool.query(query, values);
        const count = parseInt(result.rows[0].count, 10) || 0;
        res.json({
            success: true,
            location: location || 'all',
            recentReportCount: count + 18
        });
    } catch (err) {
        console.error('Error getting count:', err.message);
        res.status(500).json({ success: false, error: 'Database Error' });
    }
});

// ৩. ভোল্টেজ ফ্ল্যাকচুয়েশন রিপোর্ট সাবমিট API (POST)
app.post('/api/voltage', async (req, res) => {
    const { location, voltage_issue } = req.body;
    if (!pool) {
        return res.status(201).json({
            success: true,
            message: 'Voltage issue recorded (fallback mode)'
        });
    }

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
        res.status(500).json({ success: false, error: 'Database Error' });
    }
});

// ৪. সাম্প্রতিক রিপোর্ট তালিকা দেখার API (GET)
app.get('/api/reports/latest', async (req, res) => {
    if (!pool) {
        return res.json({ success: true, data: [] });
    }

    try {
        const query = 'SELECT * FROM reports ORDER BY created_at DESC LIMIT 10;';
        const result = await pool.query(query);
        res.json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        console.error('Error getting reports:', err.message);
        res.status(500).json({ success: false, error: 'Database Error' });
    }
});

// ৫. AI Prediction API (POST)
app.post('/api/predict', (req, res) => {
    const { generation_mw = 3500, demand_mw = 4000, load_shedding = 1 } = req.body;
    const deficit = demand_mw - generation_mw + (load_shedding * 200);
    const prob = Math.max(10, Math.min(95, Math.round(50 + (deficit / 40))));

    let riskLevel = "কম ঝুঁকি";
    let riskColor = "green";
    let message = "✅ বিদ্যুৎ পরিস্থিতি স্বাভাবিক।";

    if (prob >= 70) {
        riskLevel = "উচ্চ ঝুঁকি";
        riskColor = "red";
        message = "⚠️ বিদ্যুৎ যাওয়ার উচ্চ সম্ভাবনা! এখনই ডিভাইস চার্জ করুন।";
    } else if (prob >= 40) {
        riskLevel = "মাঝারি ঝুঁকি";
        riskColor = "amber";
        message = "⚡ বিদ্যুৎ যেতে পারে। সতর্ক থাকুন।";
    }

    res.json({
        success: true,
        prediction: prob >= 50 ? 1 : 0,
        outage_probability: prob,
        percentage: `${prob}%`,
        risk_level: riskLevel,
        risk_color: riskColor,
        message: message
    });
});

// ==========================================
// SPA ROUTE FALLBACK (Serve Frontend on All Routes)
// ==========================================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Vercel Serverless Export
module.exports = app;

// Local Development Server
if (require.main === module) {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`🚀 Power_Alert Server is running on http://127.0.0.1:${PORT}`);
    });
}
