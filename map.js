/**
 * Power_Alert - OpenStreetMap (OSM) + Leaflet.js Interactive Map
 * 100% Free & Open Source, No API Key Required
 */

// ঢাকা ও আশপাশের সব এলাকার সঠিক Coordinates (Latitude & Longitude)
const LOCATION_COORDINATES = {
    // ঢাকা মেট্রোপলিটন
    "tejgaon": { name: "তেজগাঁও, ঢাকা", lat: 23.7598, lng: 90.3913 },
    "mirpur": { name: "মিরপুর, ঢাকা", lat: 23.8041, lng: 90.3667 },
    "dhanmondi": { name: "ধানমন্ডি, ঢাকা", lat: 23.7461, lng: 90.3742 },
    "uttara": { name: "উত্তরা, ঢাকা", lat: 23.8759, lng: 90.3795 },
    "gulshan": { name: "গুলশান, ঢাকা", lat: 23.7925, lng: 90.4078 },
    "banani": { name: "বনানী, ঢাকা", lat: 23.7937, lng: 90.4043 },
    "mohammadpur": { name: "মোহাম্মদপুর, ঢাকা", lat: 23.7658, lng: 90.3584 },
    "badda": { name: "বাড্ডা, ঢাকা", lat: 23.7806, lng: 90.4267 },
    "motijheel": { name: "মতিঝিল, ঢাকা", lat: 23.7330, lng: 90.4172 },
    "paltan": { name: "পল্টন, ঢাকা", lat: 23.7320, lng: 90.4128 },
    "shahbagh": { name: "শাহবাগ, ঢাকা", lat: 23.7380, lng: 90.3957 },
    "ramna": { name: "রমনা, ঢাকা", lat: 23.7410, lng: 90.4030 },
    "khilgaon": { name: "খিলগাঁও, ঢাকা", lat: 23.7516, lng: 90.4225 },
    "rampura": { name: "রামপুরা, ঢাকা", lat: 23.7628, lng: 90.4215 },
    "jatrabari": { name: "যাত্রাবাড়ী, ঢাকা", lat: 23.7104, lng: 90.4349 },
    "demra": { name: "ডেমরা, ঢাকা", lat: 23.7147, lng: 90.4988 },
    "kadamtali": { name: "কদমতলী, ঢাকা", lat: 23.6963, lng: 90.4478 },
    "sutrapur": { name: "সূত্রাপুর, ঢাকা", lat: 23.7086, lng: 90.4172 },
    "kotwali": { name: "কোতোয়ালী, ঢাকা", lat: 23.7132, lng: 90.4030 },
    "lalbagh": { name: "লালবাগ, ঢাকা", lat: 23.7188, lng: 90.3881 },
    "hazaribagh": { name: "হাজারীবাগ, ঢাকা", lat: 23.7358, lng: 90.3653 },
    "kamrangirchar": { name: "কামরাঙ্গীরচর, ঢাকা", lat: 23.7153, lng: 90.3697 },
    "kafrul": { name: "কাফরুল, ঢাকা", lat: 23.7934, lng: 90.3802 },
    "cantonment": { name: "ঢাকা ক্যান্টনমেন্ট, ঢাকা", lat: 23.8214, lng: 90.3939 },
    "khilkhet": { name: "খিলক্ষেত, ঢাকা", lat: 23.8315, lng: 90.4175 },
    "uttarkhan": { name: "উত্তরখান, ঢাকা", lat: 23.8789, lng: 90.4285 },
    "dakshinkhan": { name: "দক্ষিণখান, ঢাকা", lat: 23.8569, lng: 90.4243 },
    "turag": { name: "তুরাগ, ঢাকা", lat: 23.8967, lng: 90.3688 },

    // ঢাকা জেলা (উপজেলা)
    "savar": { name: "সাভার, ঢাকা", lat: 23.8442, lng: 90.2588 },
    "dhamrai": { name: "ধামরাই, ঢাকা", lat: 23.9217, lng: 90.2131 },
    "keraniganj": { name: "কেরানীগঞ্জ, ঢাকা", lat: 23.6823, lng: 90.3152 },
    "dohar": { name: "দোহার, ঢাকা", lat: 23.5936, lng: 90.1345 },
    "nawabganj": { name: "নবাবগঞ্জ, ঢাকা", lat: 23.6672, lng: 90.1664 },

    // ঢাকা বিভাগের অন্যান্য জেলা
    "gazipur": { name: "গাজীপুর", lat: 23.9999, lng: 90.4203 },
    "narayanganj": { name: "নারায়ণগঞ্জ", lat: 23.6238, lng: 90.5000 },
    "munshiganj": { name: "মুন্সীগঞ্জ", lat: 23.5422, lng: 90.5305 },
    "manikganj": { name: "মানিকগঞ্জ", lat: 23.8617, lng: 90.0003 },
    "narsingdi": { name: "নরসিংদী", lat: 23.9193, lng: 90.7176 },
    "faridpur": { name: "ফরিদপুর", lat: 23.6071, lng: 89.8429 },
    "gopalganj": { name: "গোপালগঞ্জ", lat: 23.0051, lng: 89.8266 },
    "madaripur": { name: "মাদারীপুর", lat: 23.1641, lng: 90.1897 },
    "rajbari": { name: "রাজবাড়ী", lat: 23.7574, lng: 89.6445 },
    "shariatpur": { name: "শরীয়তপুর", lat: 23.2423, lng: 90.4348 },
    "tangail": { name: "টাঙ্গাইল", lat: 24.2513, lng: 89.9167 },
    "kishoreganj": { name: "কিশোরগঞ্জ", lat: 24.4449, lng: 90.7766 }
};

let powerAlertMap = null;
let mapMarkersLayer = null;
let activeHighlightLayer = null;

/**
 * OpenStreetMap (OSM) + Leaflet.js ইনিশিয়ালাইজেশন ফাংশন
 * এটি কোনো API Key বা টোকেন ছাড়া ১০০% ফ্রি ওপেন-সোর্স OSM টাইলস ব্যবহার করে
 */
function initPowerAlertMap() {
    const mapElement = document.getElementById('powerAlertMap');
    if (!mapElement) return;

    if (powerAlertMap) {
        powerAlertMap.invalidateSize();
        return;
    }

    try {
        if (typeof L === 'undefined') {
            console.error('Leaflet library (L) is not loaded yet');
            return;
        }

        // ১. ম্যাপ তৈরি ও প্রাথমিক ভিউ সেট (Default: Dhaka Center)
        powerAlertMap = L.map('powerAlertMap', {
            center: [23.7598, 90.3913],
            zoom: 12,
            zoomControl: true,
            scrollWheelZoom: true
        });

        // ২. OpenStreetMap (OSM) স্ট্যান্ডার্ড টাইল লেয়ার (১০০% ফ্রি ও ওপেন সোর্স)
        // কোনো API Key বা ক্রেডিট কার্ডের প্রয়োজন নেই
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
        }).addTo(powerAlertMap);

        // মার্কার লেয়ার গ্রুপ
        mapMarkersLayer = L.layerGroup().addTo(powerAlertMap);
        activeHighlightLayer = L.layerGroup().addTo(powerAlertMap);

        // ৩. ব্যাকএন্ড থেকে এরিয়া মার্কার লোড করা
        loadMapMarkersData();

        // ৪. রেন্ডারিং নিশ্চিত করতে invalidateSize কল
        setTimeout(() => {
            if (powerAlertMap) powerAlertMap.invalidateSize();
        }, 150);

        setTimeout(() => {
            if (powerAlertMap) {
                powerAlertMap.invalidateSize();
                const currentSelected = document.getElementById('locationSelect')?.value || 'tejgaon';
                focusLocationOnMap(currentSelected);
            }
        }, 400);

    } catch (err) {
        console.error('Error initializing OpenStreetMap:', err);
    }
}

/**
 * ব্যাকএন্ড বা ডিফল্ট থেকে সব এলাকার লাইভ স্ট্যাটাস মার্কার লোড করে
 */
async function loadMapMarkersData() {
    if (!powerAlertMap || !mapMarkersLayer) return;

    try {
        const response = await fetch('http://127.0.0.1:8000/api/map-data');
        const data = await response.json();
        const locations = (data && data.success && data.locations) ? data.locations : [];

        mapMarkersLayer.clearLayers();

        // ব্যাকএন্ড ডাটা থাকলে তা দিয়ে মার্কার তৈরি
        if (locations.length > 0) {
            locations.forEach(loc => {
                createMarkerForArea(loc.id, loc.name, loc.lat, loc.lng, loc.status, loc.msg);
            });
        } else {
            // ফলব্যাক হিসেবে প্রধান এলাকাগুলোর মার্কার প্রদর্শন
            Object.keys(LOCATION_COORDINATES).slice(0, 15).forEach(key => {
                const item = LOCATION_COORDINATES[key];
                createMarkerForArea(key, item.name, item.lat, item.lng, 'normal', 'স্বাভাবিক (বিদ্যুৎ আছে)');
            });
        }
    } catch (error) {
        console.warn('Map data load error (fallback active):', error);
        mapMarkersLayer.clearLayers();
        Object.keys(LOCATION_COORDINATES).slice(0, 12).forEach(key => {
            const item = LOCATION_COORDINATES[key];
            createMarkerForArea(key, item.name, item.lat, item.lng, 'normal', 'স্বাভাবিক');
        });
    }
}

/**
 * একটি নির্দিষ্ট এলাকার জন্য সার্কেল মার্কার ও পপআপ তৈরি
 */
function createMarkerForArea(locId, name, lat, lng, status, msg) {
    let color = '#10b981'; // স্বাভাবিক (Green)
    let label = 'স্বাভাবিক';

    if (status === 'risk') {
        color = '#f59e0b'; // ঝুঁকিপূর্ণ (Amber)
        label = 'ঝুঁকিপূর্ণ';
    } else if (status === 'outage') {
        color = '#ef4444'; // বিদ্যুৎ নেই (Red)
        label = 'বিদ্যুৎ নেই';
    }

    const marker = L.circleMarker([lat, lng], {
        radius: 9,
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        opacity: 0.9,
        fillOpacity: 0.8
    });

    // মার্কার ক্লিক পপআপ
    const popupContent = `
        <div style="font-family: inherit; min-width: 150px; padding: 2px;">
            <div style="font-size: 13px; font-weight: bold; color: #0f172a; margin-bottom: 4px;">
                <i class="fa-solid fa-location-dot" style="color: ${color};"></i> ${name}
            </div>
            <div style="font-size: 11px; color: ${color}; font-weight: bold; margin-bottom: 6px;">
                ● স্ট্যাটাস: ${msg || label}
            </div>
            <button onclick="selectLocationFromMap('${locId}')" style="width: 100%; background: #0f172a; color: #fbbf24; border: none; padding: 5px 8px; border-radius: 6px; font-size: 10px; font-weight: bold; cursor: pointer;">
                এই এলাকা সিলেক্ট করুন →
            </button>
        </div>
    `;

    marker.bindPopup(popupContent);
    mapMarkersLayer.addLayer(marker);
}

/**
 * লোকেশন নির্বাচন ড্রপডাউন পরিবর্তনের সাথে সাথে ম্যাপ ওই এলাকায় চলে যাবে (FlyTo / SetView)
 * @param {string} locationId - ড্রপডাউনের নির্বাচিত ভ্যালু (যেমন: 'tejgaon', 'mirpur')
 */
function focusLocationOnMap(locationId) {
    if (!powerAlertMap) return;

    // নিশ্চিত করা যে টাইল সাইজ নির্ভুল আছে
    powerAlertMap.invalidateSize();

    const locData = LOCATION_COORDINATES[locationId];
    if (!locData) return;

    const { lat, lng, name } = locData;

    // ১. OpenStreetMap ভিউ নির্দিষ্ট এলাকায় ফোকাস করা (Smooth FlyTo Animation)
    powerAlertMap.flyTo([lat, lng], 14, {
        duration: 1.2,
        easeLinearity: 0.25
    });

    // ২. নির্বাচিত এলাকার জন্য হাইলাইট রিং ও স্পেশাল মার্কার
    if (activeHighlightLayer) {
        activeHighlightLayer.clearLayers();

        // অ্যানিমেটেড পালস রিং
        const pulseCircle = L.circle([lat, lng], {
            radius: 400,
            color: '#f59e0b',
            fillColor: '#f59e0b',
            fillOpacity: 0.2,
            weight: 2,
            dashArray: '4, 6'
        });

        // সেন্ট্রাল হাইলাইটেড মার্কার
        const centerMarker = L.circleMarker([lat, lng], {
            radius: 12,
            fillColor: '#f59e0b',
            color: '#ffffff',
            weight: 3,
            fillOpacity: 0.95
        });

        centerMarker.bindPopup(`
            <div style="font-family: inherit; min-width: 140px; text-align: center;">
                <b style="color: #0f172a; font-size: 13px;">📍 ${name}</b><br>
                <span style="color: #d97706; font-size: 11px; font-weight: bold;">বর্তমানে নির্বাচিত এলাকা</span>
            </div>
        `).openPopup();

        activeHighlightLayer.addLayer(pulseCircle);
        activeHighlightLayer.addLayer(centerMarker);
    }
}

/**
 * ম্যাপের যেকোনো মার্কারে ক্লিক করলে ড্রপডাউন এবং ড্যাশবোর্ড আপডেট করা
 */
function selectLocationFromMap(locId) {
    const selectEl = document.getElementById('locationSelect');
    if (selectEl) {
        selectEl.value = locId;
        if (typeof updateLocationData === 'function') {
            updateLocationData(true);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
