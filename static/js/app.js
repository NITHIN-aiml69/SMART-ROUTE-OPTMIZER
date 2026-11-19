/**
 * Smart Urban Multi-Modal Route & Infrastructure Optimizer
 * Main Application Controller (Prototype Dashboard & Real-World GIS Engine)
 */

// Global state
let currentGraph = null;
let mathEngine = null;
let cityCanvas = null;
let gisMap = null;
let googleMap = null;
let activeViewMode = 'gis'; // 'google', 'gis' (Leaflet), or 'canvas'
let activeTab = 'dashboard';
let isBackendAvailable = false;
let googleMapsApiKey = '';

// Preset definitions for offline/client fallback
const PRESETS = {
    bangalore: {
        name: "Bengaluru Real-World Smart Grid (GIS Map)",
        city: "Bengaluru, India",
        center: { lat: 12.9716, lng: 77.5946, zoom: 12 },
        nodes: [
            {
                        "id": "MTR_P_CHALLA",
                        "label": "Challaghatta (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.906,
                        "lng": 77.461,
                        "x": 100,
                        "y": 740,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_KENGERI",
                        "label": "Kengeri (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.91,
                        "lng": 77.478,
                        "x": 130,
                        "y": 720,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_KTMC",
                        "label": "Kengeri Bus Terminal (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.917,
                        "lng": 77.484,
                        "x": 160,
                        "y": 690,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_PATTANA",
                        "label": "Pattanagere (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.924,
                        "lng": 77.499,
                        "x": 190,
                        "y": 665,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_JNANABH",
                        "label": "Jnanabharathi (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.936,
                        "lng": 77.509,
                        "x": 220,
                        "y": 640,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_RR_NAGAR",
                        "label": "Rajarajeshwari Nagar (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.943,
                        "lng": 77.518,
                        "x": 250,
                        "y": 615,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_PANTHAR",
                        "label": "Pantharapalya - Nayandahalli (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.949,
                        "lng": 77.527,
                        "x": 280,
                        "y": 590,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_MYS_RD",
                        "label": "Mysuru Road (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.954,
                        "lng": 77.534,
                        "x": 310,
                        "y": 565,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_DEEPANJ",
                        "label": "Deepanjali Nagar (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.956,
                        "lng": 77.541,
                        "x": 335,
                        "y": 520,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_ATTIGUP",
                        "label": "Attiguppe (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.961,
                        "lng": 77.534,
                        "x": 335,
                        "y": 475,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_VIJAYAN",
                        "label": "Vijayanagar (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.969,
                        "lng": 77.536,
                        "x": 370,
                        "y": 430,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_BGS_HOSA",
                        "label": "BGS Hosahalli (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.973,
                        "lng": 77.545,
                        "x": 420,
                        "y": 430,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_MAGADI",
                        "label": "Magadi Road (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.975,
                        "lng": 77.556,
                        "x": 475,
                        "y": 430,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_KSR_RLY",
                        "label": "KSR Railway Station (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.977,
                        "lng": 77.567,
                        "x": 530,
                        "y": 430,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "BLR_MAJ",
                        "label": "Majestic - Kempegowda Station",
                        "type": "metro_hub",
                        "line": "interchange",
                        "lat": 12.9767,
                        "lng": 77.5713,
                        "x": 590,
                        "y": 430,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_CENTRAL_COLL",
                        "label": "Sir M Visveshwaraya (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.974,
                        "lng": 77.584,
                        "x": 650,
                        "y": 430,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_AMBEDKAR",
                        "label": "Dr. BR Ambedkar Station (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.979,
                        "lng": 77.591,
                        "x": 705,
                        "y": 430,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_CUBBON",
                        "label": "Cubbon Park (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.981,
                        "lng": 77.599,
                        "x": 755,
                        "y": 430,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "BLR_CBD",
                        "label": "Mahatma Gandhi Road",
                        "type": "metro_hub",
                        "line": "interchange",
                        "lat": 12.9756,
                        "lng": 77.6097,
                        "x": 810,
                        "y": 430,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_TRINITY",
                        "label": "Trinity (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.973,
                        "lng": 77.617,
                        "x": 860,
                        "y": 420,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_HALASURU",
                        "label": "Halasuru (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.976,
                        "lng": 77.627,
                        "x": 890,
                        "y": 385,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "BLR_IND",
                        "label": "Indiranagar (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.9784,
                        "lng": 77.6408,
                        "x": 935,
                        "y": 385,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_SV_ROAD",
                        "label": "Swami Vivekananda Road (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.981,
                        "lng": 77.649,
                        "x": 990,
                        "y": 385,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_BYP",
                        "label": "Baiyappanahalli (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.984,
                        "lng": 77.653,
                        "x": 1045,
                        "y": 360,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_BENNIGAN",
                        "label": "Benniganahalli (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.99,
                        "lng": 77.665,
                        "x": 1095,
                        "y": 330,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_KR_PURAM",
                        "label": "K R Puram (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.996,
                        "lng": 77.679,
                        "x": 1145,
                        "y": 300,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_SINGAYYA",
                        "label": "Singayyanapalya (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.994,
                        "lng": 77.697,
                        "x": 1195,
                        "y": 300,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_GARUDACH",
                        "label": "Garudacharpalya (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.991,
                        "lng": 77.705,
                        "x": 1245,
                        "y": 300,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "BLR_HOODI",
                        "label": "Hoodi (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.9915,
                        "lng": 77.7145,
                        "x": 1295,
                        "y": 320,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_SEETHARAM",
                        "label": "Seetharamapalya (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.982,
                        "lng": 77.716,
                        "x": 1295,
                        "y": 370,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_KUNDALA",
                        "label": "Kundalahalli (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.972,
                        "lng": 77.718,
                        "x": 1295,
                        "y": 420,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_NALLUR",
                        "label": "Nallurhalli (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.972,
                        "lng": 77.728,
                        "x": 1345,
                        "y": 420,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_SATHYA_SAI",
                        "label": "Sri Sathya Sai Hospital (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.977,
                        "lng": 77.734,
                        "x": 1410,
                        "y": 370,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_PATTANDUR",
                        "label": "Pattanduru Agrahara (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.983,
                        "lng": 77.74,
                        "x": 1410,
                        "y": 320,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "BLR_ITPL",
                        "label": "Kadugodi Tree Park (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.988,
                        "lng": 77.744,
                        "x": 1450,
                        "y": 300,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_HOPEFARM",
                        "label": "Hopefarm Channasandra (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.993,
                        "lng": 77.751,
                        "x": 1515,
                        "y": 280,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_P_WHITEFIELD",
                        "label": "Whitefield (Kadugodi) (Purple Line)",
                        "type": "metro_hub",
                        "line": "purple",
                        "lat": 12.997,
                        "lng": 77.76,
                        "x": 1515,
                        "y": 240,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_G_MADAVARA",
                        "label": "Madavara (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 13.067,
                        "lng": 77.476,
                        "x": 220,
                        "y": 80,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_G_CHIKKABID",
                        "label": "Chikkabidarakallu (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 13.058,
                        "lng": 77.487,
                        "x": 235,
                        "y": 95,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_G_MANJUNATH",
                        "label": "Manjunatha Nagar (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 13.052,
                        "lng": 77.494,
                        "x": 250,
                        "y": 115,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "BLR_NAG",
                        "label": "Nagasandra (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 13.0475,
                        "lng": 77.4995,
                        "x": 265,
                        "y": 135,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_G_DASARAHALLI",
                        "label": "Dasarahalli (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 13.043,
                        "lng": 77.513,
                        "x": 285,
                        "y": 155,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_G_JALAHALLI",
                        "label": "Jalahalli (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 13.039,
                        "lng": 77.521,
                        "x": 325,
                        "y": 170,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_G_PEENYA_IND",
                        "label": "Peenya Industry (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 13.036,
                        "lng": 77.527,
                        "x": 345,
                        "y": 185,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "BLR_PEENYA_STN",
                        "label": "Peenya (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 13.033,
                        "lng": 77.534,
                        "x": 375,
                        "y": 205,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_G_GORAGUNTE",
                        "label": "Goraguntepalya (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 13.029,
                        "lng": 77.54,
                        "x": 410,
                        "y": 225,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "BLR_YPR",
                        "label": "Yeshwantpur (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 13.0238,
                        "lng": 77.5503,
                        "x": 440,
                        "y": 250,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_G_SANDAL",
                        "label": "Sandal Soap Factory (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 13.015,
                        "lng": 77.554,
                        "x": 440,
                        "y": 280,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_G_MAHALAKSHMI",
                        "label": "Mahalakshmi (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 13.008,
                        "lng": 77.55,
                        "x": 440,
                        "y": 310,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_G_RAJAJINAGAR",
                        "label": "Rajajinagar (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 12.998,
                        "lng": 77.555,
                        "x": 440,
                        "y": 340,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_G_KUVEMPU",
                        "label": "Kuvempu Road (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 12.992,
                        "lng": 77.559,
                        "x": 490,
                        "y": 340,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_G_SRIRAMPURA",
                        "label": "Srirampura (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 12.987,
                        "lng": 77.564,
                        "x": 535,
                        "y": 340,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_G_SAMPIGE",
                        "label": "Mantri Square Sampige Road (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 12.982,
                        "lng": 77.571,
                        "x": 590,
                        "y": 380,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_G_CHICKPETE",
                        "label": "Chickpete (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 12.97,
                        "lng": 77.574,
                        "x": 590,
                        "y": 470,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "BLR_KR_MKT",
                        "label": "Krishna Rajendra Market (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 12.964,
                        "lng": 77.575,
                        "x": 590,
                        "y": 510,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_G_NAT_COLL",
                        "label": "National College (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 12.95,
                        "lng": 77.573,
                        "x": 590,
                        "y": 545,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_G_LALBAGH",
                        "label": "Lalbagh (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 12.946,
                        "lng": 77.58,
                        "x": 620,
                        "y": 555,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_G_SOUTH_END",
                        "label": "South End Circle (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 12.937,
                        "lng": 77.58,
                        "x": 620,
                        "y": 575,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "BLR_JAY",
                        "label": "Jayanagar (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 12.9304,
                        "lng": 77.5801,
                        "x": 620,
                        "y": 605,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "BLR_RV_RD",
                        "label": "Rashtreeya Vidyalaya Road (Green Line)",
                        "type": "metro_hub",
                        "line": "interchange",
                        "lat": 12.9216,
                        "lng": 77.5801,
                        "x": 620,
                        "y": 640,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "BLR_BSK",
                        "label": "Banashankari (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 12.9156,
                        "lng": 77.5736,
                        "x": 600,
                        "y": 680,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_G_JP_NAGAR",
                        "label": "Jayaprakash Nagar (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 12.907,
                        "lng": 77.573,
                        "x": 600,
                        "y": 715,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_G_YELACHEN",
                        "label": "Yelachenahalli (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 12.896,
                        "lng": 77.57,
                        "x": 580,
                        "y": 755,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_G_KONANAKUNTE",
                        "label": "Konanakunte Cross (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 12.888,
                        "lng": 77.568,
                        "x": 560,
                        "y": 780,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_G_DODDAKALLA",
                        "label": "Doddakallasandra (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 12.879,
                        "lng": 77.562,
                        "x": 540,
                        "y": 795,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_G_VAJARAHALLI",
                        "label": "Vajarahalli (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 12.869,
                        "lng": 77.551,
                        "x": 520,
                        "y": 815,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_G_THALAGHATTA",
                        "label": "Thalaghattapura (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 12.859,
                        "lng": 77.541,
                        "x": 500,
                        "y": 835,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_G_SILK_INST",
                        "label": "Silk Institute (Green Line)",
                        "type": "metro_hub",
                        "line": "green",
                        "lat": 12.848,
                        "lng": 77.531,
                        "x": 470,
                        "y": 855,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_Y_RAGIGUDDA",
                        "label": "Ragigudda (Yellow Line)",
                        "type": "metro_hub",
                        "line": "yellow",
                        "lat": 12.919,
                        "lng": 77.592,
                        "x": 665,
                        "y": 660,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_INTER_JAYADEVA",
                        "label": "Jayadeva (Yellow Line)",
                        "type": "metro_hub",
                        "line": "interchange",
                        "lat": 12.918,
                        "lng": 77.601,
                        "x": 710,
                        "y": 660,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "BLR_BTM",
                        "label": "BTM Layout (Yellow Line)",
                        "type": "metro_hub",
                        "line": "yellow",
                        "lat": 12.9166,
                        "lng": 77.6101,
                        "x": 755,
                        "y": 635,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "BLR_SILK",
                        "label": "Central Silk Board (Yellow Line)",
                        "type": "metro_hub",
                        "line": "yellow",
                        "lat": 12.9177,
                        "lng": 77.6238,
                        "x": 820,
                        "y": 660,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_Y_BOMMANAHALLI",
                        "label": "Bommanahalli (Yellow Line)",
                        "type": "metro_hub",
                        "line": "yellow",
                        "lat": 12.908,
                        "lng": 77.625,
                        "x": 855,
                        "y": 685,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_Y_HONGASANDRA",
                        "label": "Hongasandra (Yellow Line)",
                        "type": "metro_hub",
                        "line": "yellow",
                        "lat": 12.898,
                        "lng": 77.632,
                        "x": 890,
                        "y": 710,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_Y_KUDLU_GATE",
                        "label": "Kudlu Gate (Yellow Line)",
                        "type": "metro_hub",
                        "line": "yellow",
                        "lat": 12.889,
                        "lng": 77.64,
                        "x": 925,
                        "y": 735,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_Y_SINGASANDRA",
                        "label": "Singasandra (Yellow Line)",
                        "type": "metro_hub",
                        "line": "yellow",
                        "lat": 12.879,
                        "lng": 77.647,
                        "x": 955,
                        "y": 760,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_Y_HOSA_ROAD",
                        "label": "Hosa Road (Yellow Line)",
                        "type": "metro_hub",
                        "line": "yellow",
                        "lat": 12.868,
                        "lng": 77.653,
                        "x": 985,
                        "y": 785,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_Y_BERATENA",
                        "label": "Beratena Agrahara (Yellow Line)",
                        "type": "metro_hub",
                        "line": "yellow",
                        "lat": 12.858,
                        "lng": 77.657,
                        "x": 1015,
                        "y": 810,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "BLR_EC",
                        "label": "Electronic City (Yellow Line)",
                        "type": "metro_hub",
                        "line": "yellow",
                        "lat": 12.8452,
                        "lng": 77.6602,
                        "x": 1045,
                        "y": 835,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_Y_INFOSYS",
                        "label": "Infosys Foundation Konappana Agrahara (Yellow Line)",
                        "type": "metro_hub",
                        "line": "yellow",
                        "lat": 12.837,
                        "lng": 77.668,
                        "x": 1075,
                        "y": 860,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_Y_HUSKUR",
                        "label": "Huskur Road (Yellow Line)",
                        "type": "metro_hub",
                        "line": "yellow",
                        "lat": 12.83,
                        "lng": 77.677,
                        "x": 1105,
                        "y": 885,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_Y_BIOCON",
                        "label": "Biocon Hebbagodi (Yellow Line)",
                        "type": "metro_hub",
                        "line": "yellow",
                        "lat": 12.823,
                        "lng": 77.685,
                        "x": 1145,
                        "y": 910,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "BLR_BOMMA",
                        "label": "Delta Electronics Bommasandra (Yellow Line)",
                        "type": "metro_hub",
                        "line": "yellow",
                        "lat": 12.816,
                        "lng": 77.692,
                        "x": 1180,
                        "y": 940,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "BLR_KALENA",
                        "label": "Kalena Agrahara (Pink Line)",
                        "type": "metro_hub",
                        "line": "pink",
                        "lat": 12.871,
                        "lng": 77.596,
                        "x": 710,
                        "y": 780,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_PK_HULIMAVU",
                        "label": "Hulimavu (Pink Line)",
                        "type": "metro_hub",
                        "line": "pink",
                        "lat": 12.882,
                        "lng": 77.597,
                        "x": 710,
                        "y": 750,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "BLR_IIMB",
                        "label": "IIMB (Pink Line)",
                        "type": "metro_hub",
                        "line": "pink",
                        "lat": 12.894,
                        "lng": 77.598,
                        "x": 710,
                        "y": 720,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_PK_JP_4TH",
                        "label": "JP Nagar 4th Phase (Pink Line)",
                        "type": "metro_hub",
                        "line": "pink",
                        "lat": 12.906,
                        "lng": 77.599,
                        "x": 710,
                        "y": 690,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_PK_SG_PALYA",
                        "label": "SG Palya (Tavarekere) (Pink Line)",
                        "type": "metro_hub",
                        "line": "pink",
                        "lat": 12.928,
                        "lng": 77.6,
                        "x": 710,
                        "y": 615,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "BLR_DAIRY",
                        "label": "Dairy Circle (Pink Line)",
                        "type": "metro_hub",
                        "line": "pink",
                        "lat": 12.938,
                        "lng": 77.597,
                        "x": 710,
                        "y": 575,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_PK_LAKKASANDRA",
                        "label": "Lakkasandra (Pink Line)",
                        "type": "metro_hub",
                        "line": "pink",
                        "lat": 12.947,
                        "lng": 77.597,
                        "x": 745,
                        "y": 540,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_PK_LANGFORD",
                        "label": "Langford Town (Pink Line)",
                        "type": "metro_hub",
                        "line": "pink",
                        "lat": 12.958,
                        "lng": 77.601,
                        "x": 745,
                        "y": 495,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_PK_RMS",
                        "label": "Rashtriya Military School (Pink Line)",
                        "type": "metro_hub",
                        "line": "pink",
                        "lat": 12.966,
                        "lng": 77.607,
                        "x": 745,
                        "y": 460,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_PK_SHIVAJINAGAR",
                        "label": "Shivajinagar (Pink Line)",
                        "type": "metro_hub",
                        "line": "pink",
                        "lat": 12.985,
                        "lng": 77.604,
                        "x": 755,
                        "y": 360,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "BLR_CANT",
                        "label": "Cantonment (Pink Line)",
                        "type": "metro_hub",
                        "line": "pink",
                        "lat": 12.993,
                        "lng": 77.598,
                        "x": 755,
                        "y": 330,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_PK_POTTERY",
                        "label": "Pottery Town (Pink Line)",
                        "type": "metro_hub",
                        "line": "pink",
                        "lat": 13.002,
                        "lng": 77.603,
                        "x": 800,
                        "y": 290,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_PK_TANNERY",
                        "label": "Tannery Road (Pink Line)",
                        "type": "metro_hub",
                        "line": "pink",
                        "lat": 13.011,
                        "lng": 77.608,
                        "x": 800,
                        "y": 250,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_PK_VENKATESHPURA",
                        "label": "Venkateshpura (Pink Line)",
                        "type": "metro_hub",
                        "line": "pink",
                        "lat": 13.022,
                        "lng": 77.613,
                        "x": 800,
                        "y": 215,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "MTR_PK_KADUGONDANA",
                        "label": "Kadugondanahalli (Pink Line)",
                        "type": "metro_hub",
                        "line": "pink",
                        "lat": 13.033,
                        "lng": 77.617,
                        "x": 800,
                        "y": 180,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "BLR_NAGAW",
                        "label": "Nagawara (Pink Line)",
                        "type": "metro_hub",
                        "line": "pink",
                        "lat": 13.044,
                        "lng": 77.62,
                        "x": 800,
                        "y": 140,
                        "icon": "\ud83d\ude87"
            },
            {
                        "id": "BLR_VIC",
                        "label": "Victoria Hospital (KR Market)",
                        "type": "hospital",
                        "lat": 12.9628,
                        "lng": 77.5752,
                        "x": 570,
                        "y": 510,
                        "icon": "\ud83c\udfe5"
            },
            {
                        "id": "BLR_MAN",
                        "label": "Manipal Hospital (Old Airport Rd)",
                        "type": "hospital",
                        "lat": 12.9582,
                        "lng": 77.6483,
                        "x": 970,
                        "y": 440,
                        "icon": "\ud83c\udfe5"
            },
            {
                        "id": "BLR_BWSSB",
                        "label": "BWSSB Central Water Reservoir",
                        "type": "reservoir",
                        "lat": 12.9892,
                        "lng": 77.5847,
                        "x": 650,
                        "y": 380,
                        "icon": "\ud83d\udca7"
            },
            {
                        "id": "BLR_PEENYA",
                        "label": "KPTCL 220kV Peenya Substation",
                        "type": "substation",
                        "lat": 13.0285,
                        "lng": 77.5186,
                        "x": 350,
                        "y": 205,
                        "icon": "\u26a1"
            },
            {
                        "id": "BLR_DEPOT",
                        "label": "BBMP Municipal Fleet Depot",
                        "type": "depot",
                        "lat": 12.9038,
                        "lng": 77.6254,
                        "x": 860,
                        "y": 710,
                        "icon": "\ud83d\ude9b"
            },
            {
                        "id": "BLR_KOR",
                        "label": "Koramangala Startup Sector",
                        "type": "residential",
                        "lat": 12.9352,
                        "lng": 77.6245,
                        "x": 820,
                        "y": 620,
                        "icon": "\ud83c\udfd8\ufe0f"
            },
            {
                        "id": "BLR_MRH",
                        "label": "Marathahalli ORR Crossing",
                        "type": "junction",
                        "lat": 12.9591,
                        "lng": 77.6974,
                        "x": 1240,
                        "y": 460,
                        "icon": "\ud83d\uded1"
            },
            {
                        "id": "BLR_HBL",
                        "label": "Hebbal North Gateway Flyover",
                        "type": "junction",
                        "lat": 13.0358,
                        "lng": 77.597,
                        "x": 750,
                        "y": 140,
                        "icon": "\ud83d\uded1"
            }
],
        edges: [
            {
                        "id": "mtr_purple_1",
                        "u": "MTR_P_CHALLA",
                        "v": "MTR_P_KENGERI",
                        "name": "Namma Metro Purple Line",
                        "length": 1.9,
                        "traffic": 1.0,
                        "cost": 285000,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_2",
                        "u": "MTR_P_KENGERI",
                        "v": "MTR_P_KTMC",
                        "name": "Namma Metro Purple Line",
                        "length": 1.01,
                        "traffic": 1.0,
                        "cost": 151500,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_3",
                        "u": "MTR_P_KTMC",
                        "v": "MTR_P_PATTANA",
                        "name": "Namma Metro Purple Line",
                        "length": 1.8,
                        "traffic": 1.0,
                        "cost": 270000,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_4",
                        "u": "MTR_P_PATTANA",
                        "v": "MTR_P_JNANABH",
                        "name": "Namma Metro Purple Line",
                        "length": 1.72,
                        "traffic": 1.0,
                        "cost": 258000,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_5",
                        "u": "MTR_P_JNANABH",
                        "v": "MTR_P_RR_NAGAR",
                        "name": "Namma Metro Purple Line",
                        "length": 1.25,
                        "traffic": 1.0,
                        "cost": 187500,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_6",
                        "u": "MTR_P_RR_NAGAR",
                        "v": "MTR_P_PANTHAR",
                        "name": "Namma Metro Purple Line",
                        "length": 1.18,
                        "traffic": 1.0,
                        "cost": 177000,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_7",
                        "u": "MTR_P_PANTHAR",
                        "v": "MTR_P_MYS_RD",
                        "name": "Namma Metro Purple Line",
                        "length": 0.94,
                        "traffic": 1.0,
                        "cost": 141000,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_8",
                        "u": "MTR_P_MYS_RD",
                        "v": "MTR_P_DEEPANJ",
                        "name": "Namma Metro Purple Line",
                        "length": 0.79,
                        "traffic": 1.0,
                        "cost": 118500,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_9",
                        "u": "MTR_P_DEEPANJ",
                        "v": "MTR_P_ATTIGUP",
                        "name": "Namma Metro Purple Line",
                        "length": 0.94,
                        "traffic": 1.0,
                        "cost": 141000,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_10",
                        "u": "MTR_P_ATTIGUP",
                        "v": "MTR_P_VIJAYAN",
                        "name": "Namma Metro Purple Line",
                        "length": 0.92,
                        "traffic": 1.0,
                        "cost": 138000,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_11",
                        "u": "MTR_P_VIJAYAN",
                        "v": "MTR_P_BGS_HOSA",
                        "name": "Namma Metro Purple Line",
                        "length": 1.07,
                        "traffic": 1.0,
                        "cost": 160500,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_12",
                        "u": "MTR_P_BGS_HOSA",
                        "v": "MTR_P_MAGADI",
                        "name": "Namma Metro Purple Line",
                        "length": 1.21,
                        "traffic": 1.0,
                        "cost": 181500,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_13",
                        "u": "MTR_P_MAGADI",
                        "v": "MTR_P_KSR_RLY",
                        "name": "Namma Metro Purple Line",
                        "length": 1.21,
                        "traffic": 1.0,
                        "cost": 181500,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_14",
                        "u": "MTR_P_KSR_RLY",
                        "v": "BLR_MAJ",
                        "name": "Namma Metro Purple Line",
                        "length": 0.7,
                        "traffic": 1.0,
                        "cost": 105000,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_15",
                        "u": "BLR_MAJ",
                        "v": "MTR_P_CENTRAL_COLL",
                        "name": "Namma Metro Purple Line",
                        "length": 1.41,
                        "traffic": 1.0,
                        "cost": 211500,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_16",
                        "u": "MTR_P_CENTRAL_COLL",
                        "v": "MTR_P_AMBEDKAR",
                        "name": "Namma Metro Purple Line",
                        "length": 0.94,
                        "traffic": 1.0,
                        "cost": 141000,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_17",
                        "u": "MTR_P_AMBEDKAR",
                        "v": "MTR_P_CUBBON",
                        "name": "Namma Metro Purple Line",
                        "length": 0.89,
                        "traffic": 1.0,
                        "cost": 133500,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_18",
                        "u": "MTR_P_CUBBON",
                        "v": "BLR_CBD",
                        "name": "Namma Metro Purple Line",
                        "length": 1.31,
                        "traffic": 1.0,
                        "cost": 196500,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_19",
                        "u": "BLR_CBD",
                        "v": "MTR_P_TRINITY",
                        "name": "Namma Metro Purple Line",
                        "length": 0.84,
                        "traffic": 1.0,
                        "cost": 126000,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_20",
                        "u": "MTR_P_TRINITY",
                        "v": "MTR_P_HALASURU",
                        "name": "Namma Metro Purple Line",
                        "length": 1.13,
                        "traffic": 1.0,
                        "cost": 169499,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_21",
                        "u": "MTR_P_HALASURU",
                        "v": "BLR_IND",
                        "name": "Namma Metro Purple Line",
                        "length": 1.52,
                        "traffic": 1.0,
                        "cost": 228000,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_22",
                        "u": "BLR_IND",
                        "v": "MTR_P_SV_ROAD",
                        "name": "Namma Metro Purple Line",
                        "length": 0.93,
                        "traffic": 1.0,
                        "cost": 139500,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_23",
                        "u": "MTR_P_SV_ROAD",
                        "v": "MTR_P_BYP",
                        "name": "Namma Metro Purple Line",
                        "length": 0.7,
                        "traffic": 1.0,
                        "cost": 105000,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_24",
                        "u": "MTR_P_BYP",
                        "v": "MTR_P_BENNIGAN",
                        "name": "Namma Metro Purple Line",
                        "length": 1.46,
                        "traffic": 1.0,
                        "cost": 219000,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_25",
                        "u": "MTR_P_BENNIGAN",
                        "v": "MTR_P_KR_PURAM",
                        "name": "Namma Metro Purple Line",
                        "length": 1.66,
                        "traffic": 1.0,
                        "cost": 249000,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_26",
                        "u": "MTR_P_KR_PURAM",
                        "v": "MTR_P_SINGAYYA",
                        "name": "Namma Metro Purple Line",
                        "length": 1.96,
                        "traffic": 1.0,
                        "cost": 294000,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_27",
                        "u": "MTR_P_SINGAYYA",
                        "v": "MTR_P_GARUDACH",
                        "name": "Namma Metro Purple Line",
                        "length": 0.93,
                        "traffic": 1.0,
                        "cost": 139500,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_28",
                        "u": "MTR_P_GARUDACH",
                        "v": "BLR_HOODI",
                        "name": "Namma Metro Purple Line",
                        "length": 1.03,
                        "traffic": 1.0,
                        "cost": 154500,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_29",
                        "u": "BLR_HOODI",
                        "v": "MTR_P_SEETHARAM",
                        "name": "Namma Metro Purple Line",
                        "length": 1.07,
                        "traffic": 1.0,
                        "cost": 160500,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_30",
                        "u": "MTR_P_SEETHARAM",
                        "v": "MTR_P_KUNDALA",
                        "name": "Namma Metro Purple Line",
                        "length": 1.13,
                        "traffic": 1.0,
                        "cost": 169499,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_31",
                        "u": "MTR_P_KUNDALA",
                        "v": "MTR_P_NALLUR",
                        "name": "Namma Metro Purple Line",
                        "length": 1.08,
                        "traffic": 1.0,
                        "cost": 162000,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_32",
                        "u": "MTR_P_NALLUR",
                        "v": "MTR_P_SATHYA_SAI",
                        "name": "Namma Metro Purple Line",
                        "length": 0.86,
                        "traffic": 1.0,
                        "cost": 129000,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_33",
                        "u": "MTR_P_SATHYA_SAI",
                        "v": "MTR_P_PATTANDUR",
                        "name": "Namma Metro Purple Line",
                        "length": 0.93,
                        "traffic": 1.0,
                        "cost": 139500,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_34",
                        "u": "MTR_P_PATTANDUR",
                        "v": "BLR_ITPL",
                        "name": "Namma Metro Purple Line",
                        "length": 0.7,
                        "traffic": 1.0,
                        "cost": 105000,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_35",
                        "u": "BLR_ITPL",
                        "v": "MTR_P_HOPEFARM",
                        "name": "Namma Metro Purple Line",
                        "length": 0.94,
                        "traffic": 1.0,
                        "cost": 141000,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_purple_36",
                        "u": "MTR_P_HOPEFARM",
                        "v": "MTR_P_WHITEFIELD",
                        "name": "Namma Metro Purple Line",
                        "length": 1.07,
                        "traffic": 1.0,
                        "cost": 160500,
                        "mode": "metro",
                        "line": "purple",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_1",
                        "u": "MTR_G_MADAVARA",
                        "v": "MTR_G_CHIKKABID",
                        "name": "Namma Metro Green Line",
                        "length": 1.56,
                        "traffic": 1.0,
                        "cost": 234000,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_2",
                        "u": "MTR_G_CHIKKABID",
                        "v": "MTR_G_MANJUNATH",
                        "name": "Namma Metro Green Line",
                        "length": 1.01,
                        "traffic": 1.0,
                        "cost": 151500,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_3",
                        "u": "MTR_G_MANJUNATH",
                        "v": "BLR_NAG",
                        "name": "Namma Metro Green Line",
                        "length": 0.78,
                        "traffic": 1.0,
                        "cost": 117000,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_4",
                        "u": "BLR_NAG",
                        "v": "MTR_G_DASARAHALLI",
                        "name": "Namma Metro Green Line",
                        "length": 1.55,
                        "traffic": 1.0,
                        "cost": 232500,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_5",
                        "u": "MTR_G_DASARAHALLI",
                        "v": "MTR_G_JALAHALLI",
                        "name": "Namma Metro Green Line",
                        "length": 0.97,
                        "traffic": 1.0,
                        "cost": 145500,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_6",
                        "u": "MTR_G_JALAHALLI",
                        "v": "MTR_G_PEENYA_IND",
                        "name": "Namma Metro Green Line",
                        "length": 0.73,
                        "traffic": 1.0,
                        "cost": 109500,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_7",
                        "u": "MTR_G_PEENYA_IND",
                        "v": "BLR_PEENYA_STN",
                        "name": "Namma Metro Green Line",
                        "length": 0.83,
                        "traffic": 1.0,
                        "cost": 124500,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_8",
                        "u": "BLR_PEENYA_STN",
                        "v": "MTR_G_GORAGUNTE",
                        "name": "Namma Metro Green Line",
                        "length": 0.79,
                        "traffic": 1.0,
                        "cost": 118500,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_9",
                        "u": "MTR_G_GORAGUNTE",
                        "v": "BLR_YPR",
                        "name": "Namma Metro Green Line",
                        "length": 1.26,
                        "traffic": 1.0,
                        "cost": 189000,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_10",
                        "u": "BLR_YPR",
                        "v": "MTR_G_SANDAL",
                        "name": "Namma Metro Green Line",
                        "length": 1.06,
                        "traffic": 1.0,
                        "cost": 159000,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_11",
                        "u": "MTR_G_SANDAL",
                        "v": "MTR_G_MAHALAKSHMI",
                        "name": "Namma Metro Green Line",
                        "length": 0.89,
                        "traffic": 1.0,
                        "cost": 133500,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_12",
                        "u": "MTR_G_MAHALAKSHMI",
                        "v": "MTR_G_RAJAJINAGAR",
                        "name": "Namma Metro Green Line",
                        "length": 1.24,
                        "traffic": 1.0,
                        "cost": 186000,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_13",
                        "u": "MTR_G_RAJAJINAGAR",
                        "v": "MTR_G_KUVEMPU",
                        "name": "Namma Metro Green Line",
                        "length": 0.8,
                        "traffic": 1.0,
                        "cost": 120000,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_14",
                        "u": "MTR_G_KUVEMPU",
                        "v": "MTR_G_SRIRAMPURA",
                        "name": "Namma Metro Green Line",
                        "length": 0.78,
                        "traffic": 1.0,
                        "cost": 117000,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_15",
                        "u": "MTR_G_SRIRAMPURA",
                        "v": "MTR_G_SAMPIGE",
                        "name": "Namma Metro Green Line",
                        "length": 0.94,
                        "traffic": 1.0,
                        "cost": 141000,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_16",
                        "u": "MTR_G_SAMPIGE",
                        "v": "BLR_MAJ",
                        "name": "Namma Metro Green Line",
                        "length": 0.7,
                        "traffic": 1.0,
                        "cost": 105000,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_17",
                        "u": "BLR_MAJ",
                        "v": "MTR_G_CHICKPETE",
                        "name": "Namma Metro Green Line",
                        "length": 0.8,
                        "traffic": 1.0,
                        "cost": 120000,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_18",
                        "u": "MTR_G_CHICKPETE",
                        "v": "BLR_KR_MKT",
                        "name": "Namma Metro Green Line",
                        "length": 0.7,
                        "traffic": 1.0,
                        "cost": 105000,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_19",
                        "u": "BLR_KR_MKT",
                        "v": "MTR_G_NAT_COLL",
                        "name": "Namma Metro Green Line",
                        "length": 1.57,
                        "traffic": 1.0,
                        "cost": 235500,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_20",
                        "u": "MTR_G_NAT_COLL",
                        "v": "MTR_G_LALBAGH",
                        "name": "Namma Metro Green Line",
                        "length": 0.88,
                        "traffic": 1.0,
                        "cost": 132000,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_21",
                        "u": "MTR_G_LALBAGH",
                        "v": "MTR_G_SOUTH_END",
                        "name": "Namma Metro Green Line",
                        "length": 1.0,
                        "traffic": 1.0,
                        "cost": 150000,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_22",
                        "u": "MTR_G_SOUTH_END",
                        "v": "BLR_JAY",
                        "name": "Namma Metro Green Line",
                        "length": 0.73,
                        "traffic": 1.0,
                        "cost": 109500,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_23",
                        "u": "BLR_JAY",
                        "v": "BLR_RV_RD",
                        "name": "Namma Metro Green Line",
                        "length": 0.98,
                        "traffic": 1.0,
                        "cost": 147000,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_24",
                        "u": "BLR_RV_RD",
                        "v": "BLR_BSK",
                        "name": "Namma Metro Green Line",
                        "length": 0.97,
                        "traffic": 1.0,
                        "cost": 145500,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_25",
                        "u": "BLR_BSK",
                        "v": "MTR_G_JP_NAGAR",
                        "name": "Namma Metro Green Line",
                        "length": 0.96,
                        "traffic": 1.0,
                        "cost": 144000,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_26",
                        "u": "MTR_G_JP_NAGAR",
                        "v": "MTR_G_YELACHEN",
                        "name": "Namma Metro Green Line",
                        "length": 1.27,
                        "traffic": 1.0,
                        "cost": 190500,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_27",
                        "u": "MTR_G_YELACHEN",
                        "v": "MTR_G_KONANAKUNTE",
                        "name": "Namma Metro Green Line",
                        "length": 0.92,
                        "traffic": 1.0,
                        "cost": 138000,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_28",
                        "u": "MTR_G_KONANAKUNTE",
                        "v": "MTR_G_DODDAKALLA",
                        "name": "Namma Metro Green Line",
                        "length": 1.19,
                        "traffic": 1.0,
                        "cost": 178500,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_29",
                        "u": "MTR_G_DODDAKALLA",
                        "v": "MTR_G_VAJARAHALLI",
                        "name": "Namma Metro Green Line",
                        "length": 1.63,
                        "traffic": 1.0,
                        "cost": 244499,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_30",
                        "u": "MTR_G_VAJARAHALLI",
                        "v": "MTR_G_THALAGHATTA",
                        "name": "Namma Metro Green Line",
                        "length": 1.55,
                        "traffic": 1.0,
                        "cost": 232500,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_green_31",
                        "u": "MTR_G_THALAGHATTA",
                        "v": "MTR_G_SILK_INST",
                        "name": "Namma Metro Green Line",
                        "length": 1.63,
                        "traffic": 1.0,
                        "cost": 244499,
                        "mode": "metro",
                        "line": "green",
                        "aqi": 24
            },
            {
                        "id": "mtr_yellow_1",
                        "u": "BLR_RV_RD",
                        "v": "MTR_Y_RAGIGUDDA",
                        "name": "Namma Metro Yellow Line",
                        "length": 1.32,
                        "traffic": 1.0,
                        "cost": 198000,
                        "mode": "metro",
                        "line": "yellow",
                        "aqi": 24
            },
            {
                        "id": "mtr_yellow_2",
                        "u": "MTR_Y_RAGIGUDDA",
                        "v": "MTR_INTER_JAYADEVA",
                        "name": "Namma Metro Yellow Line",
                        "length": 0.98,
                        "traffic": 1.0,
                        "cost": 147000,
                        "mode": "metro",
                        "line": "yellow",
                        "aqi": 24
            },
            {
                        "id": "mtr_yellow_3",
                        "u": "MTR_INTER_JAYADEVA",
                        "v": "BLR_BTM",
                        "name": "Namma Metro Yellow Line",
                        "length": 1.0,
                        "traffic": 1.0,
                        "cost": 150000,
                        "mode": "metro",
                        "line": "yellow",
                        "aqi": 24
            },
            {
                        "id": "mtr_yellow_4",
                        "u": "BLR_BTM",
                        "v": "BLR_SILK",
                        "name": "Namma Metro Yellow Line",
                        "length": 1.49,
                        "traffic": 1.0,
                        "cost": 223500,
                        "mode": "metro",
                        "line": "yellow",
                        "aqi": 24
            },
            {
                        "id": "mtr_yellow_5",
                        "u": "BLR_SILK",
                        "v": "MTR_Y_BOMMANAHALLI",
                        "name": "Namma Metro Yellow Line",
                        "length": 1.09,
                        "traffic": 1.0,
                        "cost": 163500,
                        "mode": "metro",
                        "line": "yellow",
                        "aqi": 24
            },
            {
                        "id": "mtr_yellow_6",
                        "u": "MTR_Y_BOMMANAHALLI",
                        "v": "MTR_Y_HONGASANDRA",
                        "name": "Namma Metro Yellow Line",
                        "length": 1.35,
                        "traffic": 1.0,
                        "cost": 202500,
                        "mode": "metro",
                        "line": "yellow",
                        "aqi": 24
            },
            {
                        "id": "mtr_yellow_7",
                        "u": "MTR_Y_HONGASANDRA",
                        "v": "MTR_Y_KUDLU_GATE",
                        "name": "Namma Metro Yellow Line",
                        "length": 1.32,
                        "traffic": 1.0,
                        "cost": 198000,
                        "mode": "metro",
                        "line": "yellow",
                        "aqi": 24
            },
            {
                        "id": "mtr_yellow_8",
                        "u": "MTR_Y_KUDLU_GATE",
                        "v": "MTR_Y_SINGASANDRA",
                        "name": "Namma Metro Yellow Line",
                        "length": 1.35,
                        "traffic": 1.0,
                        "cost": 202500,
                        "mode": "metro",
                        "line": "yellow",
                        "aqi": 24
            },
            {
                        "id": "mtr_yellow_9",
                        "u": "MTR_Y_SINGASANDRA",
                        "v": "MTR_Y_HOSA_ROAD",
                        "name": "Namma Metro Yellow Line",
                        "length": 1.39,
                        "traffic": 1.0,
                        "cost": 208499,
                        "mode": "metro",
                        "line": "yellow",
                        "aqi": 24
            },
            {
                        "id": "mtr_yellow_10",
                        "u": "MTR_Y_HOSA_ROAD",
                        "v": "MTR_Y_BERATENA",
                        "name": "Namma Metro Yellow Line",
                        "length": 1.19,
                        "traffic": 1.0,
                        "cost": 178500,
                        "mode": "metro",
                        "line": "yellow",
                        "aqi": 24
            },
            {
                        "id": "mtr_yellow_11",
                        "u": "MTR_Y_BERATENA",
                        "v": "BLR_EC",
                        "name": "Namma Metro Yellow Line",
                        "length": 1.46,
                        "traffic": 1.0,
                        "cost": 219000,
                        "mode": "metro",
                        "line": "yellow",
                        "aqi": 24
            },
            {
                        "id": "mtr_yellow_12",
                        "u": "BLR_EC",
                        "v": "MTR_Y_INFOSYS",
                        "name": "Namma Metro Yellow Line",
                        "length": 1.24,
                        "traffic": 1.0,
                        "cost": 186000,
                        "mode": "metro",
                        "line": "yellow",
                        "aqi": 24
            },
            {
                        "id": "mtr_yellow_13",
                        "u": "MTR_Y_INFOSYS",
                        "v": "MTR_Y_HUSKUR",
                        "name": "Namma Metro Yellow Line",
                        "length": 1.25,
                        "traffic": 1.0,
                        "cost": 187500,
                        "mode": "metro",
                        "line": "yellow",
                        "aqi": 24
            },
            {
                        "id": "mtr_yellow_14",
                        "u": "MTR_Y_HUSKUR",
                        "v": "MTR_Y_BIOCON",
                        "name": "Namma Metro Yellow Line",
                        "length": 1.17,
                        "traffic": 1.0,
                        "cost": 175500,
                        "mode": "metro",
                        "line": "yellow",
                        "aqi": 24
            },
            {
                        "id": "mtr_yellow_15",
                        "u": "MTR_Y_BIOCON",
                        "v": "BLR_BOMMA",
                        "name": "Namma Metro Yellow Line",
                        "length": 1.09,
                        "traffic": 1.0,
                        "cost": 163500,
                        "mode": "metro",
                        "line": "yellow",
                        "aqi": 24
            },
            {
                        "id": "mtr_pink_1",
                        "u": "BLR_KALENA",
                        "v": "MTR_PK_HULIMAVU",
                        "name": "Namma Metro Pink Line",
                        "length": 1.23,
                        "traffic": 1.0,
                        "cost": 184500,
                        "mode": "metro",
                        "line": "pink",
                        "aqi": 24
            },
            {
                        "id": "mtr_pink_2",
                        "u": "MTR_PK_HULIMAVU",
                        "v": "BLR_IIMB",
                        "name": "Namma Metro Pink Line",
                        "length": 1.34,
                        "traffic": 1.0,
                        "cost": 201000,
                        "mode": "metro",
                        "line": "pink",
                        "aqi": 24
            },
            {
                        "id": "mtr_pink_3",
                        "u": "BLR_IIMB",
                        "v": "MTR_PK_JP_4TH",
                        "name": "Namma Metro Pink Line",
                        "length": 1.34,
                        "traffic": 1.0,
                        "cost": 201000,
                        "mode": "metro",
                        "line": "pink",
                        "aqi": 24
            },
            {
                        "id": "mtr_pink_4",
                        "u": "MTR_PK_JP_4TH",
                        "v": "MTR_INTER_JAYADEVA",
                        "name": "Namma Metro Pink Line",
                        "length": 1.35,
                        "traffic": 1.0,
                        "cost": 202500,
                        "mode": "metro",
                        "line": "pink",
                        "aqi": 24
            },
            {
                        "id": "mtr_pink_5",
                        "u": "MTR_INTER_JAYADEVA",
                        "v": "MTR_PK_SG_PALYA",
                        "name": "Namma Metro Pink Line",
                        "length": 1.12,
                        "traffic": 1.0,
                        "cost": 168000,
                        "mode": "metro",
                        "line": "pink",
                        "aqi": 24
            },
            {
                        "id": "mtr_pink_6",
                        "u": "MTR_PK_SG_PALYA",
                        "v": "BLR_DAIRY",
                        "name": "Namma Metro Pink Line",
                        "length": 1.16,
                        "traffic": 1.0,
                        "cost": 174000,
                        "mode": "metro",
                        "line": "pink",
                        "aqi": 24
            },
            {
                        "id": "mtr_pink_7",
                        "u": "BLR_DAIRY",
                        "v": "MTR_PK_LAKKASANDRA",
                        "name": "Namma Metro Pink Line",
                        "length": 1.0,
                        "traffic": 1.0,
                        "cost": 150000,
                        "mode": "metro",
                        "line": "pink",
                        "aqi": 24
            },
            {
                        "id": "mtr_pink_8",
                        "u": "MTR_PK_LAKKASANDRA",
                        "v": "MTR_PK_LANGFORD",
                        "name": "Namma Metro Pink Line",
                        "length": 1.3,
                        "traffic": 1.0,
                        "cost": 195000,
                        "mode": "metro",
                        "line": "pink",
                        "aqi": 24
            },
            {
                        "id": "mtr_pink_9",
                        "u": "MTR_PK_LANGFORD",
                        "v": "MTR_PK_RMS",
                        "name": "Namma Metro Pink Line",
                        "length": 1.1,
                        "traffic": 1.0,
                        "cost": 165000,
                        "mode": "metro",
                        "line": "pink",
                        "aqi": 24
            },
            {
                        "id": "mtr_pink_10",
                        "u": "MTR_PK_RMS",
                        "v": "BLR_CBD",
                        "name": "Namma Metro Pink Line",
                        "length": 1.11,
                        "traffic": 1.0,
                        "cost": 166500,
                        "mode": "metro",
                        "line": "pink",
                        "aqi": 24
            },
            {
                        "id": "mtr_pink_11",
                        "u": "BLR_CBD",
                        "v": "MTR_PK_SHIVAJINAGAR",
                        "name": "Namma Metro Pink Line",
                        "length": 1.21,
                        "traffic": 1.0,
                        "cost": 181500,
                        "mode": "metro",
                        "line": "pink",
                        "aqi": 24
            },
            {
                        "id": "mtr_pink_12",
                        "u": "MTR_PK_SHIVAJINAGAR",
                        "v": "BLR_CANT",
                        "name": "Namma Metro Pink Line",
                        "length": 1.1,
                        "traffic": 1.0,
                        "cost": 165000,
                        "mode": "metro",
                        "line": "pink",
                        "aqi": 24
            },
            {
                        "id": "mtr_pink_13",
                        "u": "BLR_CANT",
                        "v": "MTR_PK_POTTERY",
                        "name": "Namma Metro Pink Line",
                        "length": 1.14,
                        "traffic": 1.0,
                        "cost": 170999,
                        "mode": "metro",
                        "line": "pink",
                        "aqi": 24
            },
            {
                        "id": "mtr_pink_14",
                        "u": "MTR_PK_POTTERY",
                        "v": "MTR_PK_TANNERY",
                        "name": "Namma Metro Pink Line",
                        "length": 1.14,
                        "traffic": 1.0,
                        "cost": 170999,
                        "mode": "metro",
                        "line": "pink",
                        "aqi": 24
            },
            {
                        "id": "mtr_pink_15",
                        "u": "MTR_PK_TANNERY",
                        "v": "MTR_PK_VENKATESHPURA",
                        "name": "Namma Metro Pink Line",
                        "length": 1.34,
                        "traffic": 1.0,
                        "cost": 201000,
                        "mode": "metro",
                        "line": "pink",
                        "aqi": 24
            },
            {
                        "id": "mtr_pink_16",
                        "u": "MTR_PK_VENKATESHPURA",
                        "v": "MTR_PK_KADUGONDANA",
                        "name": "Namma Metro Pink Line",
                        "length": 1.3,
                        "traffic": 1.0,
                        "cost": 195000,
                        "mode": "metro",
                        "line": "pink",
                        "aqi": 24
            },
            {
                        "id": "mtr_pink_17",
                        "u": "MTR_PK_KADUGONDANA",
                        "v": "BLR_NAGAW",
                        "name": "Namma Metro Pink Line",
                        "length": 1.27,
                        "traffic": 1.0,
                        "cost": 190500,
                        "mode": "metro",
                        "line": "pink",
                        "aqi": 24
            },
            {
                        "id": "blr_f1",
                        "u": "BLR_VIC",
                        "v": "BLR_KR_MKT",
                        "name": "KR Market Medical Linkway",
                        "length": 0.5,
                        "traffic": 1.8,
                        "cost": 50000,
                        "mode": "road",
                        "aqi": 140
            },
            {
                        "id": "blr_f2",
                        "u": "BLR_MAN",
                        "v": "BLR_IND",
                        "name": "100 Feet Road Medical Access",
                        "length": 2.8,
                        "traffic": 1.5,
                        "cost": 280000,
                        "mode": "road",
                        "aqi": 65
            },
            {
                        "id": "blr_f3",
                        "u": "BLR_BWSSB",
                        "v": "BLR_MAJ",
                        "name": "High Grounds Central Pipeway",
                        "length": 2.6,
                        "traffic": 1.4,
                        "cost": 260000,
                        "mode": "road",
                        "aqi": 70
            },
            {
                        "id": "blr_f4",
                        "u": "BLR_PEENYA",
                        "v": "BLR_PEENYA_STN",
                        "name": "Peenya Industrial Power Link",
                        "length": 0.8,
                        "traffic": 1.2,
                        "cost": 80000,
                        "mode": "road",
                        "aqi": 160
            },
            {
                        "id": "blr_f5",
                        "u": "BLR_DEPOT",
                        "v": "MTR_Y_BOMMANAHALLI",
                        "name": "Bommanahalli Fleet Corridor",
                        "length": 0.6,
                        "traffic": 1.3,
                        "cost": 60000,
                        "mode": "road",
                        "aqi": 150
            },
            {
                        "id": "blr_f6",
                        "u": "BLR_KOR",
                        "v": "MTR_PK_SG_PALYA",
                        "name": "Tavarekere - Koramangala Access",
                        "length": 1.8,
                        "traffic": 2.2,
                        "cost": 180000,
                        "mode": "road",
                        "aqi": 130
            },
            {
                        "id": "blr_f7",
                        "u": "BLR_KOR",
                        "v": "BLR_SILK",
                        "name": "Madiwala Central Corridor",
                        "length": 2.4,
                        "traffic": 3.4,
                        "cost": 240000,
                        "mode": "road",
                        "aqi": 180
            },
            {
                        "id": "blr_f8",
                        "u": "BLR_MRH",
                        "v": "MTR_P_KUNDALA",
                        "name": "Kundalahalli - Marathahalli Link",
                        "length": 2.6,
                        "traffic": 2.5,
                        "cost": 260000,
                        "mode": "road",
                        "aqi": 140
            },
            {
                        "id": "blr_f9",
                        "u": "BLR_HBL",
                        "v": "BLR_NAGAW",
                        "name": "Outer Ring Road Hebbal - Nagawara Link",
                        "length": 3.6,
                        "traffic": 2.0,
                        "cost": 360000,
                        "mode": "road",
                        "aqi": 120
            },
            {
                        "id": "blr_f10",
                        "u": "BLR_BWSSB",
                        "v": "BLR_CANT",
                        "name": "Cantonment Water Feeder",
                        "length": 1.8,
                        "traffic": 1.4,
                        "cost": 180000,
                        "mode": "road",
                        "aqi": 70
            }
]
    },
    default: {
        name: "Neo-Metropolis Smart Grid",
        nodes: [
            { id: "W1", label: "Water Treatment Plant", type: "reservoir", lat: 13.0150, lng: 77.5550, x: 120, y: 140, icon: "💧" },
            { id: "P1", label: "Main Power Substation", type: "substation", lat: 12.9450, lng: 77.5450, x: 140, y: 380, icon: "⚡" },
            { id: "H1", label: "Central Hospital", type: "hospital", lat: 13.0150, lng: 77.6250, x: 480, y: 150, icon: "🏥" },
            { id: "CBD", label: "Central Business Dist.", type: "commercial", lat: 12.9750, lng: 77.6050, x: 440, y: 320, icon: "🏢" },
            { id: "M1", label: "Central Metro Station", type: "metro_hub", lat: 12.9800, lng: 77.5750, x: 300, y: 240, icon: "🚇" },
            { id: "M2", label: "East Metro Junction", type: "metro_hub", lat: 12.9750, lng: 77.6500, x: 660, y: 260, icon: "🚇" },
            { id: "R1", label: "North Residential Sector", type: "residential", lat: 13.0300, lng: 77.5900, x: 310, y: 70, icon: "🏘️" },
            { id: "R2", label: "South Residential Sector", type: "residential", lat: 12.9350, lng: 77.5900, x: 320, y: 480, icon: "🏘️" },
            { id: "R3", label: "East Residential Hub", type: "residential", lat: 12.9850, lng: 77.6900, x: 780, y: 160, icon: "🏘️" },
            { id: "R4", label: "West Suburbs", type: "residential", lat: 12.9850, lng: 77.5300, x: 80, y: 260, icon: "🏘️" },
            { id: "D1", label: "Municipal Depot / Fleet", type: "depot", lat: 12.9250, lng: 77.6200, x: 580, y: 460, icon: "🚛" },
            { id: "U1", label: "Smart University Campus", type: "education", lat: 12.9450, lng: 77.6350, x: 680, y: 390, icon: "🎓" }
        ],
        edges: [
            { id: "e1", u: "W1", v: "R1", name: "North Aqueduct Blvd", length: 3.2, traffic: 1.2, cost: 320000, mode: "road" },
            { id: "e2", u: "W1", v: "M1", name: "Reservoir Ave", length: 2.5, traffic: 1.0, cost: 250000, mode: "road" },
            { id: "e3", u: "W1", v: "R4", name: "West Water Channel", length: 1.8, traffic: 1.1, cost: 180000, mode: "road" },
            { id: "e4", u: "R4", v: "P1", name: "Substation Linkway", length: 2.0, traffic: 1.0, cost: 200000, mode: "road" },
            { id: "e5", u: "P1", v: "R2", name: "Grid Corridor South", length: 3.1, traffic: 1.4, cost: 310000, mode: "road" },
            { id: "e6", u: "P1", v: "M1", name: "Powerway Central", length: 2.8, traffic: 1.5, cost: 280000, mode: "road" },
            { id: "e7", u: "R1", v: "H1", name: "Emergency North Expressway", length: 2.9, traffic: 2.4, cost: 290000, mode: "road" },
            { id: "e8", u: "R1", v: "M1", name: "Civic Link", length: 2.1, traffic: 1.3, cost: 210000, mode: "road" },
            { id: "e9", u: "M1", v: "CBD", name: "Financial Mall Road", length: 2.0, traffic: 2.8, cost: 200000, mode: "road" },
            { id: "e10", u: "M1", v: "M2", name: "Blue Metro Rapid Line", length: 3.8, traffic: 1.0, cost: 750000, mode: "metro" },
            { id: "e11", u: "H1", v: "CBD", name: "Hospital Parkway", length: 2.2, traffic: 1.8, cost: 220000, mode: "road" },
            { id: "e12", u: "H1", v: "R3", name: "East Medical Access", length: 3.4, traffic: 1.1, cost: 340000, mode: "road" },
            { id: "e13", u: "CBD", v: "D1", name: "Commercial South Way", length: 2.4, traffic: 1.6, cost: 240000, mode: "road" },
            { id: "e14", u: "R2", v: "D1", name: "Sanitation Ring Road", length: 3.0, traffic: 1.2, cost: 300000, mode: "road" },
            { id: "e15", u: "CBD", v: "M2", name: "Tech Corridor", length: 2.3, traffic: 2.0, cost: 230000, mode: "road" },
            { id: "e16", u: "M2", v: "R3", name: "East Metro Extension", length: 1.9, traffic: 1.2, cost: 190000, mode: "road" },
            { id: "e17", u: "M2", v: "U1", name: "Campus Boulevard", length: 1.7, traffic: 1.1, cost: 170000, mode: "road" },
            { id: "e18", u: "D1", v: "U1", name: "Municipal Utility Road", length: 1.5, traffic: 1.0, cost: 150000, mode: "road" }
        ]
    },
    eulerian: {
        name: "High-Density Municipal Sweeper Grid (Zero Deadhead)",
        nodes: [
            { id: "D0", label: "Depot Central", type: "depot", lat: 12.9450, lng: 77.6250, x: 300, y: 80, icon: "🚛" },
            { id: "N1", label: "North-West Ward", type: "residential", lat: 12.9350, lng: 77.6100, x: 150, y: 200, icon: "🏘️" },
            { id: "N2", label: "North-East Ward", type: "residential", lat: 12.9350, lng: 77.6400, x: 450, y: 200, icon: "🏘️" },
            { id: "S1", label: "South-West Ward", type: "residential", lat: 12.9150, lng: 77.6100, x: 150, y: 380, icon: "🏘️" },
            { id: "S2", label: "South-East Ward", type: "residential", lat: 12.9150, lng: 77.6400, x: 450, y: 380, icon: "🏘️" },
            { id: "C0", label: "South Sub-Depot", type: "depot", lat: 12.9050, lng: 77.6250, x: 300, y: 500, icon: "🚛" }
        ],
        edges: [
            { id: "e1", u: "D0", v: "N1", name: "Street 1", length: 2.0, traffic: 1.0, cost: 100000, mode: "road" },
            { id: "e2", u: "D0", v: "N2", name: "Street 2", length: 2.0, traffic: 1.0, cost: 100000, mode: "road" },
            { id: "e3", u: "D0", v: "S1", name: "Street 3", length: 3.5, traffic: 1.0, cost: 150000, mode: "road" },
            { id: "e4", u: "D0", v: "S2", name: "Street 4", length: 3.5, traffic: 1.0, cost: 150000, mode: "road" },
            { id: "e5", u: "C0", v: "N1", name: "Street 5", length: 3.5, traffic: 1.0, cost: 150000, mode: "road" },
            { id: "e6", u: "C0", v: "N2", name: "Street 6", length: 3.5, traffic: 1.0, cost: 150000, mode: "road" },
            { id: "e7", u: "C0", v: "S1", name: "Street 7", length: 2.0, traffic: 1.0, cost: 100000, mode: "road" },
            { id: "e8", u: "C0", v: "S2", name: "Street 8", length: 2.0, traffic: 1.0, cost: 100000, mode: "road" },
            { id: "e9", u: "N1", v: "N2", name: "Street 9", length: 3.0, traffic: 1.0, cost: 120000, mode: "road" },
            { id: "e10", u: "N1", v: "S1", name: "Street 10", length: 2.5, traffic: 1.0, cost: 110000, mode: "road" },
            { id: "e11", u: "N2", v: "S2", name: "Street 11", length: 2.5, traffic: 1.0, cost: 110000, mode: "road" },
            { id: "e12", u: "S1", v: "S2", name: "Street 12", length: 3.0, traffic: 1.0, cost: 120000, mode: "road" }
        ]
    },
    planarity: {
        name: "Underground Utility Conflict Grid (Planarity Clash)",
        nodes: [
            { id: "Gas", label: "Gas Plant (U1)", type: "reservoir", lat: 12.9920, lng: 77.5800, x: 150, y: 120, icon: "⛽" },
            { id: "Water", label: "Water Plant (U2)", type: "reservoir", lat: 12.9920, lng: 77.5950, x: 350, y: 120, icon: "💧" },
            { id: "Power", label: "Power Station (U3)", type: "substation", lat: 12.9920, lng: 77.6100, x: 550, y: 120, icon: "⚡" },
            { id: "HouseA", label: "Residential A", type: "residential", lat: 12.9780, lng: 77.5800, x: 150, y: 380, icon: "🏠" },
            { id: "HouseB", label: "Residential B", type: "residential", lat: 12.9780, lng: 77.5950, x: 350, y: 380, icon: "🏠" },
            { id: "HouseC", label: "Residential C", type: "residential", lat: 12.9780, lng: 77.6100, x: 550, y: 380, icon: "🏠" }
        ],
        edges: [
            { id: "k1", u: "Gas", v: "HouseA", name: "Gas Pipe A", length: 3.0, traffic: 1.0, cost: 300000, mode: "utility" },
            { id: "k2", u: "Gas", v: "HouseB", name: "Gas Pipe B", length: 3.5, traffic: 1.0, cost: 350000, mode: "utility" },
            { id: "k3", u: "Gas", v: "HouseC", name: "Gas Pipe C", length: 4.5, traffic: 1.0, cost: 450000, mode: "utility" },
            { id: "k4", u: "Water", v: "HouseA", name: "Water Pipe A", length: 3.5, traffic: 1.0, cost: 350000, mode: "utility" },
            { id: "k5", u: "Water", v: "HouseB", name: "Water Pipe B", length: 3.0, traffic: 1.0, cost: 300000, mode: "utility" },
            { id: "k6", u: "Water", v: "HouseC", name: "Water Pipe C", length: 3.5, traffic: 1.0, cost: 350000, mode: "utility" },
            { id: "k7", u: "Power", v: "HouseA", name: "Power Cable A", length: 4.5, traffic: 1.0, cost: 450000, mode: "utility" },
            { id: "k8", u: "Power", v: "HouseB", name: "Power Cable B", length: 3.5, traffic: 1.0, cost: 350000, mode: "utility" },
            { id: "k9", u: "Power", v: "HouseC", name: "Power Cable C", length: 3.0, traffic: 1.0, cost: 300000, mode: "utility" }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    cityCanvas = new SmartCityCanvas('cityCanvas');

    // Initialize Leaflet GIS Map for Bengaluru
    gisMap = new BangaloreGisMap('gisMap');

    // Initialize Google Maps Engine
    googleMap = new GoogleMapsEngine('googleMap');

    // Register canvas & map click hooks
    window.onNodeClicked = handleNodeClicked;
    window.onNodePositionChanged = handleNodePositionChanged;
    window.handleMapClick = handleMapClick;

    // Check backend status & load Google Maps API Key if configured
    await checkBackendAndMapsConfig();

    // Load initial preset (Defaults to real Bengaluru map)
    await loadPreset('bangalore');

    // Setup UI event listeners
    setupEventListeners();
}

async function checkBackendAndMapsConfig() {
    try {
        const resp = await fetch('/api/presets');
        if (resp.ok) isBackendAvailable = true;

        const configResp = await fetch('/api/config/maps');
        if (configResp.ok) {
            const configData = await configResp.json();
            if (configData.api_key) {
                googleMapsApiKey = configData.api_key;
                localStorage.setItem('google_maps_api_key', googleMapsApiKey);
            }
        }
    } catch (e) {
        isBackendAvailable = false;
        console.log("Running in client-side / standalone offline mode.");
    }

    // Also check localStorage
    if (!googleMapsApiKey) {
        googleMapsApiKey = localStorage.getItem('google_maps_api_key') || '';
    }

    const backendStatusEl = document.getElementById('backendStatus');
    if (backendStatusEl) {
        backendStatusEl.innerHTML = isBackendAvailable
            ? `<span class="badge-online">● Backend API Live</span>`
            : `<span class="badge-offline">● Standalone Engine</span>`;
    }

    // If an API key is available, initialize Google Maps
    if (googleMapsApiKey) {
        updateGoogleMapsKeyStatus(true);
        try {
            await googleMap.loadScript(googleMapsApiKey);
            googleMap.initMap('night');
        } catch (err) {
            console.warn("Failed to auto-load Google Maps with stored key:", err);
            updateGoogleMapsKeyStatus(false);
        }
    } else {
        updateGoogleMapsKeyStatus(false);
    }
}

function updateGoogleMapsKeyStatus(hasKey) {
    const dot = document.getElementById('gmapsStatusDot');
    const statusMsg = document.getElementById('gmapsKeyStatusMsg');
    const keyInput = document.getElementById('gmapsKeyInput');

    if (dot) {
        if (hasKey) dot.classList.add('active');
        else dot.classList.remove('active');
    }
    if (keyInput && googleMapsApiKey) {
        keyInput.value = googleMapsApiKey;
    }
    if (statusMsg) {
        statusMsg.innerHTML = hasKey
            ? `<span style="color: #34d399;">● Google Maps API Active and Loaded</span>`
            : `<span style="color: #94a3b8;">○ No Google Maps API Key set (using Leaflet OpenStreetMap)</span>`;
    }
}

async function loadPreset(presetKey) {
    if (isBackendAvailable) {
        try {
            const resp = await fetch(`/api/preset/${presetKey}`);
            currentGraph = await resp.json();
        } catch (e) {
            currentGraph = JSON.parse(JSON.stringify(PRESETS[presetKey] || PRESETS.bangalore));
        }
    } else {
        currentGraph = JSON.parse(JSON.stringify(PRESETS[presetKey] || PRESETS.bangalore));
    }

    mathEngine = new DiscreteMathEngine(currentGraph);

    // Check if dataset has GPS coordinates (like Bengaluru)
    const hasGis = currentGraph.nodes && currentGraph.nodes.some(n => n.lat !== undefined);
    const viewGisBtn = document.getElementById('viewGisBtn');
    const viewOsmBtn = document.getElementById('viewOsmBtn');

    if (hasGis) {
        if (viewGisBtn) viewGisBtn.style.display = 'inline-block';
        if (viewOsmBtn) viewOsmBtn.style.display = 'inline-block';

        if (activeViewMode === 'google' && googleMap && googleMap.isLoaded) {
            setViewMode('google');
            googleMap.renderGraph(currentGraph);
        } else if (activeViewMode === 'canvas') {
            setViewMode('canvas');
        } else {
            setViewMode('gis');
            gisMap.renderGraph(currentGraph);
        }
    } else {
        if (viewGisBtn) viewGisBtn.style.display = 'none';
        if (viewOsmBtn) viewOsmBtn.style.display = 'none';
        setViewMode('canvas');
    }

    cityCanvas.setGraph(currentGraph);
    updateNodeDropdowns();
    updateLiveMetricsBadge();
    renderOverviewDashboard();
    runActiveTabAudit();
}

function setViewMode(mode) {
    activeViewMode = mode;
    const googleMapEl = document.getElementById('googleMap');
    const gisMapEl = document.getElementById('gisMap');
    const canvasEl = document.getElementById('cityCanvas');

    const viewGisBtn = document.getElementById('viewGisBtn');
    const viewOsmBtn = document.getElementById('viewOsmBtn');
    const viewCanvasBtn = document.getElementById('viewCanvasBtn');

    [viewGisBtn, viewOsmBtn, viewCanvasBtn].forEach(b => b?.classList.remove('active'));
    [googleMapEl, gisMapEl, canvasEl].forEach(el => {
        if (el) {
            el.classList.remove('active-view');
            el.style.display = 'none';
            el.style.zIndex = '1';
        }
    });

    if (mode === 'google') {
        if (!googleMap || !googleMap.isLoaded) {
            openGmapsModal();
            // Fallback to OSM in the meantime
            if (gisMapEl) {
                gisMapEl.classList.add('active-view');
                gisMapEl.style.display = 'block';
                gisMapEl.style.zIndex = '6';
            }
            if (viewOsmBtn) viewOsmBtn.classList.add('active');
            if (gisMap && currentGraph) {
                gisMap.renderGraph(currentGraph);
                setTimeout(() => {
                    if (gisMap && gisMap.map) gisMap.map.invalidateSize();
                }, 200);
            }
            return;
        }
        if (googleMapEl) {
            googleMapEl.classList.add('active-view');
            googleMapEl.style.display = 'block';
            googleMapEl.style.zIndex = '8';
        }
        if (viewGisBtn) viewGisBtn.classList.add('active');
        if (googleMap && currentGraph) {
            googleMap.renderGraph(currentGraph);
            googleMap.fitBounds();
        }
    } else if (mode === 'gis') {
        if (gisMapEl) {
            gisMapEl.classList.add('active-view');
            gisMapEl.style.display = 'block';
            gisMapEl.style.zIndex = '7';
        }
        if (viewOsmBtn) viewOsmBtn.classList.add('active');
        if (gisMap && currentGraph) {
            gisMap.renderGraph(currentGraph);
            setTimeout(() => {
                if (gisMap && gisMap.map) gisMap.map.invalidateSize();
            }, 200);
        }
    } else { // canvas
        if (canvasEl) {
            canvasEl.classList.add('active-view');
            canvasEl.style.display = 'block';
            canvasEl.style.zIndex = '10';
        }
        if (viewCanvasBtn) viewCanvasBtn.classList.add('active');
        if (cityCanvas) {
            cityCanvas.resize();
            cityCanvas.render();
        }
    }
}
window.setViewMode = setViewMode;

function openGmapsModal() {
    const modal = document.getElementById('gmapsModal');
    if (modal) modal.classList.add('active');
    updateGoogleMapsKeyStatus(Boolean(googleMapsApiKey));
}

function closeGmapsModal() {
    const modal = document.getElementById('gmapsModal');
    if (modal) modal.classList.remove('active');
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

    const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (btn) btn.classList.add('active');

    activeTab = tabId;
    const targetPane = document.getElementById(tabId);
    if (targetPane) targetPane.classList.add('active');

    clearAllOverlays();
    runActiveTabAudit();
}
window.switchTab = switchTab;

function clearAllOverlays() {
    if (cityCanvas) cityCanvas.clearHighlights();
    if (gisMap) gisMap.clearOverlay();
    if (googleMap) googleMap.clearOverlay();
}

function setupEventListeners() {
    // Preset dropdown
    const presetSelect = document.getElementById('presetSelect');
    if (presetSelect) {
        presetSelect.addEventListener('change', (e) => {
            loadPreset(e.target.value);
        });
    }

    // View mode toggle
    document.getElementById('viewGisBtn')?.addEventListener('click', () => setViewMode('google'));
    document.getElementById('viewOsmBtn')?.addEventListener('click', () => setViewMode('gis'));
    document.getElementById('viewCanvasBtn')?.addEventListener('click', () => setViewMode('canvas'));

    // Google Maps Key Button & Modal
    document.getElementById('googleMapsKeyBtn')?.addEventListener('click', openGmapsModal);
    document.getElementById('closeGmapsModalBtn')?.addEventListener('click', closeGmapsModal);
    document.getElementById('useFreeOsmBtn')?.addEventListener('click', () => {
        closeGmapsModal();
        setViewMode('gis');
    });
    document.getElementById('gmapsModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'gmapsModal') closeGmapsModal();
    });

    // Save Google Maps Key
    document.getElementById('saveGmapsKeyBtn')?.addEventListener('click', async () => {
        const inputKey = document.getElementById('gmapsKeyInput')?.value?.trim();
        const statusMsg = document.getElementById('gmapsKeyStatusMsg');

        if (!inputKey) {
            if (statusMsg) statusMsg.innerHTML = `<span style="color: #ef4444;">Please paste a valid Google Maps API Key.</span>`;
            return;
        }

        if (statusMsg) statusMsg.innerHTML = `<span style="color: #38bdf8;">Testing and connecting to Google Maps...</span>`;

        try {
            await googleMap.loadScript(inputKey);
            googleMapsApiKey = inputKey;
            localStorage.setItem('google_maps_api_key', inputKey);

            // Persist to backend if active
            if (isBackendAvailable) {
                fetch('/api/config/maps', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ api_key: inputKey })
                }).catch(() => {});
            }

            const styleType = document.getElementById('gmapsStyleSelect')?.value || 'night';
            googleMap.initMap(styleType);
            googleMap.renderGraph(currentGraph);

            updateGoogleMapsKeyStatus(true);
            setViewMode('google');
            closeGmapsModal();
        } catch (err) {
            console.error("Google Maps load error:", err);
            if (statusMsg) statusMsg.innerHTML = `<span style="color: #ef4444;">${err.message || 'Error connecting to Google Maps'}</span>`;
        }
    });

    // Clear Google Maps Key
    document.getElementById('clearGmapsKeyBtn')?.addEventListener('click', () => {
        googleMapsApiKey = '';
        localStorage.removeItem('google_maps_api_key');
        if (isBackendAvailable) {
            fetch('/api/config/maps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ api_key: '' })
            }).catch(() => {});
        }
        updateGoogleMapsKeyStatus(false);
        const inputKey = document.getElementById('gmapsKeyInput');
        if (inputKey) inputKey.value = '';
        setViewMode('gis');
        closeGmapsModal();
    });

    // Google Maps Style Change
    document.getElementById('gmapsStyleSelect')?.addEventListener('change', (e) => {
        if (googleMap) googleMap.setMapStyle(e.target.value);
    });

    // Google Maps Traffic Toggle
    document.getElementById('gmapsTrafficToggle')?.addEventListener('change', (e) => {
        if (googleMap) googleMap.toggleTraffic(e.target.checked);
    });

    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchTab(btn.dataset.tab);
        });
    });

    // Dijkstra form
    const runDijkstraBtn = document.getElementById('runDijkstraBtn');
    if (runDijkstraBtn) {
        runDijkstraBtn.addEventListener('click', runDijkstraRouting);
    }

    // Routing Engine Mode Switcher (Real Roads vs Metro Rail Tracks)
    document.getElementById('engineRoadBtn')?.addEventListener('click', () => setRoutingEngineMode('road'));
    document.getElementById('engineMetroBtn')?.addEventListener('click', () => setRoutingEngineMode('metro'));
    document.getElementById('clearRoutePinsBtn')?.addEventListener('click', clearCustomRoutePins);

    // Current Location Buttons
    document.getElementById('useCurrentLocationBtn')?.addEventListener('click', () => {
        useCurrentLocationForRouting('source');
    });
    document.getElementById('useCurrentLocationDestBtn')?.addEventListener('click', () => {
        useCurrentLocationForRouting('dest');
    });

    document.getElementById('nearestHospitalBtn')?.addEventListener('click', () => {
        window.findAndRouteToNearestHospital();
    });
    document.getElementById('quickNearestHospitalBtn')?.addEventListener('click', () => {
        window.findAndRouteToNearestHospital();
    });

    // Dropdown change handlers for Current Location
    document.getElementById('routeSource')?.addEventListener('change', (e) => {
        if (e.target.value === 'USER_CURRENT_LOCATION') {
            useCurrentLocationForRouting('source');
        } else {
            runDijkstraRouting();
        }
    });
    document.getElementById('routeDest')?.addEventListener('change', (e) => {
        if (e.target.value === 'USER_CURRENT_LOCATION') {
            useCurrentLocationForRouting('dest');
        } else {
            runDijkstraRouting();
        }
    });

    // MST buttons
    const runKruskalBtn = document.getElementById('runKruskalBtn');
    if (runKruskalBtn) {
        runKruskalBtn.addEventListener('click', () => runMST('kruskal'));
    }
    const runPrimBtn = document.getElementById('runPrimBtn');
    if (runPrimBtn) {
        runPrimBtn.addEventListener('click', () => runMST('prim'));
    }
    document.getElementById('primRoot')?.addEventListener('change', () => {
        runMST('prim');
    });

    // Municipal buttons
    const runEulerBtn = document.getElementById('runEulerBtn');
    if (runEulerBtn) {
        runEulerBtn.addEventListener('click', runEulerSweeper);
    }
    const runHamiltonBtn = document.getElementById('runHamiltonBtn');
    if (runHamiltonBtn) {
        runHamiltonBtn.addEventListener('click', runHamiltonPatrol);
    }

    // Canvas / Map tools
    document.getElementById('resetViewBtn')?.addEventListener('click', () => {
        if (activeViewMode === 'google' && googleMap && googleMap.isLoaded) googleMap.fitBounds();
        else if (activeViewMode === 'gis' && gisMap) gisMap.fitBounds();
        else if (cityCanvas) cityCanvas.resetView();
    });

    document.getElementById('clearOverlayBtn')?.addEventListener('click', clearAllOverlays);

    // Traffic congestion toggle
    const trafficToggle = document.getElementById('trafficToggle');
    if (trafficToggle) {
        trafficToggle.addEventListener('change', () => {
            if (activeTab === 'phase2a') runDijkstraRouting();
            if (cityCanvas) cityCanvas.render();
            if (gisMap && currentGraph) gisMap.renderGraph(currentGraph);
            if (googleMap && googleMap.isLoaded && currentGraph) googleMap.renderGraph(currentGraph);
        });
    }

    // Weather rain & AQI health toggles
    document.getElementById('weatherRainToggle')?.addEventListener('change', () => {
        if (activeTab === 'phase2a') runDijkstraRouting();
    });
    document.getElementById('aqiAwareToggle')?.addEventListener('change', () => {
        if (activeTab === 'phase2a') runDijkstraRouting();
    });

    // Geolocation & Search tools
    document.getElementById('locateGpsBtn')?.addEventListener('click', locateUserGps);
    document.getElementById('liveTrackingBtn')?.addEventListener('click', () => {
        window.toggleLiveGpsTracking();
    });
    document.getElementById('setExactLocBtn')?.addEventListener('click', () => {
        window.openExactLocationModal();
    });
    document.getElementById('closeExactLocationModalBtn')?.addEventListener('click', () => {
        window.closeExactLocationModal();
    });
    document.getElementById('acquireHighAccuracyGpsBtn')?.addEventListener('click', () => {
        window.closeExactLocationModal();
        locateUserGps();
    });
    document.getElementById('searchExactAddressBtn')?.addEventListener('click', () => {
        window.searchAndSetExactAddress();
    });
    document.getElementById('exactAddressInput')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') window.searchAndSetExactAddress();
    });
    document.getElementById('startMapPickModeBtn')?.addEventListener('click', () => {
        window.startMapPickLocationMode();
    });
    document.getElementById('mapSearchBtn')?.addEventListener('click', searchMapLocation);
    document.getElementById('mapSearchInput')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') searchMapLocation();
    });

    // Add node modal trigger
    document.getElementById('addNodeBtn')?.addEventListener('click', showAddNodeModal);
    document.getElementById('addRoadBtn')?.addEventListener('click', showAddRoadModal);

    // Setup Global Spatial Search Engine
    setupGlobalSearchEngine();
}

function updateNodeDropdowns() {
    const nodes = currentGraph.nodes || [];
    const sourceSel = document.getElementById('routeSource');
    const destSel = document.getElementById('routeDest');
    const primRootSel = document.getElementById('primRoot');

    const populate = (sel, preferredVal, allowCurrentLoc = false) => {
        if (!sel || nodes.length === 0) return;
        sel.innerHTML = '';

        // Permanent option for Live GPS Current Location
        if (allowCurrentLoc) {
            const locGroup = document.createElement('optgroup');
            locGroup.label = "📍 Live Geolocation";
            const optLoc = document.createElement('option');
            optLoc.value = "USER_CURRENT_LOCATION";
            if (window.userGpsCoords && window.userGpsCoords.lat) {
                optLoc.textContent = `📍 My Current Location (${window.userGpsCoords.lat.toFixed(4)}, ${window.userGpsCoords.lng.toFixed(4)})`;
            } else {
                optLoc.textContent = "📍 My Current Location (Live GPS)";
            }
            if (preferredVal === "USER_CURRENT_LOCATION") {
                optLoc.selected = true;
            }
            locGroup.appendChild(optLoc);
            sel.appendChild(locGroup);
        }

        let matched = (preferredVal === "USER_CURRENT_LOCATION");

        // Separate hospitals into dedicated Emergency Medical Facilities group
        const hospNodes = nodes.filter(n => n.type === 'hospital');
        const otherNodes = nodes.filter(n => n.type !== 'hospital');

        if (hospNodes.length > 0) {
            const hospGroup = document.createElement('optgroup');
            hospGroup.label = "🏥 Emergency Hospitals (Bengaluru 24x7)";
            hospNodes.forEach((n) => {
                const opt = document.createElement('option');
                opt.value = n.id;
                const specTag = n.speciality ? ` [${n.speciality.split(',')[0].split('&')[0].trim()}]` : '';
                opt.textContent = `🏥 ${n.label || n.id}${specTag}`;
                if (preferredVal && n.id === preferredVal) {
                    opt.selected = true;
                    matched = true;
                }
                hospGroup.appendChild(opt);
            });
            sel.appendChild(hospGroup);
        }

        const nodesGroup = document.createElement('optgroup');
        nodesGroup.label = (currentGraph.name && currentGraph.name.includes("Bengaluru"))
            ? "🚇 Metro Stations & Urban Grid Hubs"
            : "Network Nodes";

        otherNodes.forEach((n) => {
            const opt = document.createElement('option');
            opt.value = n.id;
            opt.textContent = `${n.id}: ${n.label || n.id}`;
            if (preferredVal && n.id === preferredVal) {
                opt.selected = true;
                matched = true;
            }
            nodesGroup.appendChild(opt);
        });
        sel.appendChild(nodesGroup);

        if (!matched && sel.options.length > 0) {
            sel.selectedIndex = 0;
        }
    };

    if (currentGraph.name && currentGraph.name.includes("Bengaluru")) {
        populate(sourceSel, "BLR_EC", true);     // Electronic City (allow GPS)
        populate(destSel, "BLR_VIC", true);      // Victoria Hospital (allow GPS)
        populate(primRootSel, "BLR_BWSSB", false); // Kaveri Water Reservoir
    } else if (currentGraph.name && (currentGraph.name.includes("Sweeper") || currentGraph.name.includes("Eulerian"))) {
        populate(sourceSel, "D0", true);
        populate(destSel, "C0", true);
        populate(primRootSel, "D0", false);
    } else if (currentGraph.name && (currentGraph.name.includes("Planarity") || currentGraph.name.includes("Utilities"))) {
        populate(sourceSel, "Gas", true);
        populate(destSel, "HouseC", true);
        populate(primRootSel, "Gas", false);
    } else {
        populate(sourceSel, nodes.length > 9 ? "R4" : nodes[0]?.id, true);
        populate(destSel, nodes.length > 2 ? "H1" : nodes[nodes.length - 1]?.id, true);
        populate(primRootSel, nodes[0]?.id, false);
    }

    syncCanvasNodeSelection();
}

function syncCanvasNodeSelection() {
    const s = document.getElementById('routeSource')?.value;
    const d = document.getElementById('routeDest')?.value;
    cityCanvas.sourceNodeId = s;
    cityCanvas.destNodeId = d;
    cityCanvas.render();
}

function handleNodeClicked(node) {
    if (activeTab === 'phase2a') {
        const sSel = document.getElementById('routeSource');
        const dSel = document.getElementById('routeDest');
        if (sSel && (!cityCanvas.sourceNodeId || cityCanvas.destNodeId)) {
            sSel.value = node.id;
            cityCanvas.sourceNodeId = node.id;
            cityCanvas.destNodeId = null;
            window.customMapOrigin = null;
            if (gisMap) gisMap.setTempPin('origin', null, null);
            if (googleMap && googleMap.isLoaded) googleMap.setTempPin('origin', null, null);
        } else if (dSel && cityCanvas.sourceNodeId && !cityCanvas.destNodeId) {
            dSel.value = node.id;
            cityCanvas.destNodeId = node.id;
            window.customMapDest = null;
            if (gisMap) gisMap.setTempPin('dest', null, null);
            if (googleMap && googleMap.isLoaded) googleMap.setTempPin('dest', null, null);
            runDijkstraRouting();
        }
    } else if (activeTab === 'phase2b') {
        const rootSel = document.getElementById('primRoot');
        if (rootSel) {
            rootSel.value = node.id;
            runMST('prim');
        }
    } else if (activeTab === 'dashboard') {
        cityCanvas.selectedNodeId = node.id;
    }
    cityCanvas.selectedNodeId = node.id;
    cityCanvas.render();
}

function handleNodePositionChanged() {
    mathEngine = new DiscreteMathEngine(currentGraph);
    renderOverviewDashboard();
    if (activeTab === 'phase1') {
        auditTopologyAndPlanarity();
    }
}

function updateLiveMetricsBadge() {
    const V = currentGraph.nodes.length;
    const E = currentGraph.edges.length;
    const badge = document.getElementById('topMetricsBadge');
    if (badge) {
        badge.innerHTML = `<span><b>|V| = ${V}</b> Intersections</span> · <span><b>|E| = ${E}</b> Corridors</span>`;
    }
}

// -------------------------------------------------------------
// OVERVIEW PROTOTYPE DASHBOARD CONTROLLER
// -------------------------------------------------------------
function renderOverviewDashboard() {
    if (!mathEngine) return;

    const handshaking = mathEngine.verifyHandshaking();
    const planarity = mathEngine.auditPlanarity();
    const kruskal = mathEngine.runKruskal();
    const euler = mathEngine.runHierholzer();
    const hamilton = mathEngine.findHamiltonianCycle();

    // KPI row
    const kpiNodes = document.getElementById('kpiNodes');
    if (kpiNodes) kpiNodes.textContent = handshaking.num_vertices;

    const kpiEdges = document.getElementById('kpiEdges');
    if (kpiEdges) kpiEdges.textContent = handshaking.num_edges;

    const kpiSavings = document.getElementById('kpiSavings');
    if (kpiSavings) kpiSavings.textContent = `${kruskal.cost_reduction_percent}%`;

    const kpiPlanar = document.getElementById('kpiPlanar');
    if (kpiPlanar) {
        kpiPlanar.textContent = planarity.is_theoretically_planar ? "100% Planar" : `${planarity.physical_crossovers_count} Clashes`;
        kpiPlanar.className = planarity.is_theoretically_planar ? "kpi-number highlight-green" : "kpi-number highlight-cyan";
    }

    // Phase Roadmap Cards
    const dashDegSum = document.getElementById('dashDegSum');
    if (dashDegSum) dashDegSum.textContent = handshaking.sum_of_degrees;

    const dashFaces = document.getElementById('dashFaces');
    if (dashFaces) dashFaces.textContent = planarity.F;

    const dashCrossovers = document.getElementById('dashCrossovers');
    if (dashCrossovers) dashCrossovers.textContent = planarity.physical_crossovers_count;

    const dashLoops = document.getElementById('dashLoops');
    if (dashLoops) dashLoops.textContent = `${kruskal.redundant_loops_eliminated} loops`;

    const dashSavingsPill = document.getElementById('dashSavingsPill');
    if (dashSavingsPill) dashSavingsPill.textContent = `${kruskal.cost_reduction_percent}% Saved`;

    const dashEulerType = document.getElementById('dashEulerType');
    if (dashEulerType) dashEulerType.textContent = euler.success ? euler.status.replace('_', ' ') : "Edge Re-traversal Needed";

    const dashHamiltonStatus = document.getElementById('dashHamiltonStatus');
    if (dashHamiltonStatus) dashHamiltonStatus.textContent = hamilton.success ? "Closed Cycle Feasible" : "No Single Cycle";
}

function runActiveTabAudit() {
    renderOverviewDashboard();
    if (activeTab === 'dashboard') {
        renderOverviewDashboard();
    } else if (activeTab === 'phase1') {
        auditTopologyAndPlanarity();
    } else if (activeTab === 'phase2a') {
        runDijkstraRouting();
    } else if (activeTab === 'phase2b') {
        runMST('kruskal');
    } else if (activeTab === 'phase2c') {
        auditMunicipalLogistics();
    }
}

// -------------------------------------------------------------
// PHASE 1: STRUCTURAL & TOPOLOGICAL VALIDATION
// -------------------------------------------------------------
function auditTopologyAndPlanarity() {
    const handshaking = mathEngine.verifyHandshaking();
    const conn = mathEngine.checkConnectivity();
    const planarity = mathEngine.auditPlanarity();

    // 1. Handshaking Proof Card
    const hsCard = document.getElementById('handshakingCard');
    if (hsCard) {
        hsCard.innerHTML = `
            <div class="card-header">
                <h3>Handshaking Property & Degree Verification</h3>
                <span class="status-pill ${handshaking.handshaking_verified ? 'pill-success' : 'pill-danger'}">
                    ${handshaking.handshaking_verified ? 'Verified' : 'Violated'}
                </span>
            </div>
            <div class="math-formula">
                $$\\sum_{v \\in V} \\deg(v) = 2|E|$$
            </div>
            <div class="stats-grid">
                <div class="stat-box">
                    <span class="stat-label">Sum of Degrees ∑ deg(v)</span>
                    <span class="stat-val highlight-cyan">${handshaking.sum_of_degrees}</span>
                </div>
                <div class="stat-box">
                    <span class="stat-label">2 · |E| (Edges: ${handshaking.num_edges})</span>
                    <span class="stat-val highlight-cyan">${handshaking.two_e}</span>
                </div>
                <div class="stat-box">
                    <span class="stat-label">Odd-Degree Nodes Count</span>
                    <span class="stat-val">${handshaking.odd_degree_count} (Must be even)</span>
                </div>
            </div>
            <p class="proof-text">
                <b>Structural Verification:</b> ${handshaking.proof_statement}
                Every corridor contributes exactly +1 degree to both endpoint vertices,
                guaranteeing the degree sum is always twice the edge count.
            </p>
            <div class="degree-sequence">
                <b>Degree Sequence:</b> [ ${Object.values(handshaking.degrees).sort((a,b)=>b-a).join(', ')} ]
            </div>
        `;
    }

    // 2. Connectivity & Bottlenecks Card
    const connCard = document.getElementById('connectivityCard');
    if (connCard) {
        connCard.innerHTML = `
            <div class="card-header">
                <h3>Grid Connectivity & Disaster Resilience</h3>
                <span class="status-pill ${conn.is_connected ? 'pill-success' : 'pill-danger'}">
                    ${conn.is_connected ? 'Fully Connected Grid' : 'Disconnected Sectors'}
                </span>
            </div>
            <div class="stats-grid">
                <div class="stat-box">
                    <span class="stat-label">Connected Components</span>
                    <span class="stat-val">${conn.num_components}</span>
                </div>
                <div class="stat-box">
                    <span class="stat-label">Isolated Dead Zones</span>
                    <span class="stat-val">${conn.isolated_nodes.length}</span>
                </div>
            </div>
            <p class="desc-text">
                ${conn.is_connected
                    ? 'All residential and emergency hubs are reachable through the multi-modal road/metro grid.'
                    : `Disaster Alert: ${conn.num_components} disconnected zones detected without mutual road access.`}
            </p>
        `;
    }

    // 3. Planarity & Euler's Formula Card
    const planCard = document.getElementById('planarityCard');
    if (planCard) {
        const isPlanar = planarity.is_theoretically_planar;
        planCard.innerHTML = `
            <div class="card-header">
                <h3>Planarity Analysis & Euler's Formula</h3>
                <span class="status-pill ${isPlanar ? 'pill-success' : 'pill-warning'}">
                    ${isPlanar ? 'Planar Network (2D Feasible)' : 'Non-Planar / Multi-Level Needed'}
                </span>
            </div>
            <div class="math-formula">
                $$V - E + F = 2 \\quad \\implies \\quad F = E - V + 2$$
            </div>
            <div class="stats-grid">
                <div class="stat-box">
                    <span class="stat-label">Vertices (V)</span>
                    <span class="stat-val">${planarity.V}</span>
                </div>
                <div class="stat-box">
                    <span class="stat-label">Edges (E)</span>
                    <span class="stat-val">${planarity.E}</span>
                </div>
                <div class="stat-box">
                    <span class="stat-label">Faces (F)</span>
                    <span class="stat-val highlight-green">${planarity.F}</span>
                </div>
                <div class="stat-box">
                    <span class="stat-label">Max Planar Limit (3V-6)</span>
                    <span class="stat-val">${planarity.max_planar_edges_bound}</span>
                </div>
            </div>
            <div class="euler-check-box">
                <b>Euler Formula Check:</b> <code>${planarity.formula_string}</code>
            </div>
            <div class="crossover-status ${planarity.physical_crossovers_count > 0 ? 'alert-danger' : 'alert-success'}">
                ${planarity.physical_crossovers_count > 0
                    ? `⚠️ Detected <b>${planarity.physical_crossovers_count}</b> 2D edge crossover clashes! Requires multi-level flyovers or tiered underground pipe corridors.`
                    : `✅ Zero 2D crossovers detected in current layout. Can be constructed directly on a flat plane without flyovers.`}
            </div>
            <button class="btn-sm btn-outline mt-2" onclick="toggleCrossoverHighlight()">
                ${cityCanvas.activeOverlay === 'crossover' ? 'Hide Crossover Overlays' : 'Highlight Crossovers on Canvas'}
            </button>
        `;
    }
}

function toggleCrossoverHighlight() {
    if (cityCanvas.activeOverlay === 'crossover') {
        cityCanvas.clearHighlights();
    } else {
        const planarity = mathEngine.auditPlanarity();
        cityCanvas.setCrossoverOverlay(planarity.physical_crossovers);
    }
}

// -------------------------------------------------------------
// PHASE 2A: MULTI-MODAL & REAL ROAD ROUTING ENGINE
// -------------------------------------------------------------
let lastDijkstraResult = null;
let routingEngineMode = 'road'; // 'road' (OSRM / Maps) or 'metro' (Metro Tracks Graph)
window.customMapOrigin = null;
window.customMapDest = null;

function setRoutingEngineMode(mode) {
    routingEngineMode = mode;
    const roadBtn = document.getElementById('engineRoadBtn');
    const metroBtn = document.getElementById('engineMetroBtn');
    if (roadBtn && metroBtn) {
        if (mode === 'road') {
            roadBtn.classList.add('active');
            roadBtn.style.background = '#0284c7';
            roadBtn.style.color = 'white';
            metroBtn.classList.remove('active');
            metroBtn.style.background = 'transparent';
            metroBtn.style.color = '#94a3b8';
            showToast('🛣️ Real Road Network Routing Engine Active (OSRM / Maps)', 'info');
        } else {
            metroBtn.classList.add('active');
            metroBtn.style.background = '#a855f7';
            metroBtn.style.color = 'white';
            roadBtn.classList.remove('active');
            roadBtn.style.background = 'transparent';
            roadBtn.style.color = '#94a3b8';
            showToast('🚇 Metro Rail Tracks Graph Engine Active', 'info');
        }
    }
    if (activeTab === 'phase2a') {
        runDijkstraRouting();
    }
}

function clearCustomRoutePins() {
    window.customMapOrigin = null;
    window.customMapDest = null;
    if (gisMap) gisMap.clearOverlay(true);
    if (googleMap && googleMap.isLoaded) googleMap.clearOverlay(true);
    removeCustomSelectOption('routeSource', 'CUSTOM_MAP_ORIGIN');
    removeCustomSelectOption('routeDest', 'CUSTOM_MAP_DEST');
    showToast('Map pins cleared.', 'info');
}

function ensureCustomSelectOption(selectEl, value, label) {
    if (!selectEl) return;
    let opt = selectEl.querySelector(`option[value="${value}"]`);
    if (!opt) {
        opt = document.createElement('option');
        opt.value = value;
        selectEl.insertBefore(opt, selectEl.firstChild);
    }
    opt.textContent = label;
    opt.selected = true;
}

function removeCustomSelectOption(selectId, value) {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    const opt = sel.querySelector(`option[value="${value}"]`);
    if (opt) opt.remove();
}

function getNodeOrCustomLocation(id, role = 'origin') {
    if (id === 'CUSTOM_MAP_ORIGIN' && window.customMapOrigin) {
        return window.customMapOrigin;
    }
    if (id === 'CUSTOM_MAP_DEST' && window.customMapDest) {
        return window.customMapDest;
    }
    if (id === 'USER_CURRENT_LOCATION' || id === 'USER_GPS') {
        if (window.userGpsCoords) {
            return {
                id: 'USER_CURRENT_LOCATION',
                lat: window.userGpsCoords.lat,
                lng: window.userGpsCoords.lng,
                label: window.userGpsCoords.label || 'My Current Location (GPS)'
            };
        }
        return {
            id: 'USER_CURRENT_LOCATION',
            lat: 12.9352,
            lng: 77.6245,
            label: 'My Current Location (Bengaluru Core)'
        };
    }
    if (currentGraph && currentGraph.nodes) {
        const node = currentGraph.nodes.find(n => n.id === id);
        if (node && node.lat !== undefined && node.lng !== undefined) {
            return {
                id: node.id,
                lat: node.lat,
                lng: node.lng,
                label: node.label || node.id,
                line: node.line,
                type: node.type
            };
        }
    }
    return null;
}

window.handleMapClick = function(latlng) {
    if (!latlng || latlng.lat === undefined) return;

    if (activeTab !== 'phase2a') {
        switchTab('phase2a');
    }

    const sSel = document.getElementById('routeSource');
    const dSel = document.getElementById('routeDest');

    if (!window.customMapOrigin || window.customMapDest) {
        // Step 1: Set Origin Pin [A]
        window.customMapOrigin = {
            id: 'CUSTOM_MAP_ORIGIN',
            lat: latlng.lat,
            lng: latlng.lng,
            label: `Road Waypoint A (${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)})`
        };
        window.customMapDest = null;

        ensureCustomSelectOption(sSel, 'CUSTOM_MAP_ORIGIN', `📍 Pin A: ${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`);
        if (sSel) sSel.value = 'CUSTOM_MAP_ORIGIN';

        if (gisMap) gisMap.setTempPin('origin', latlng.lat, latlng.lng, window.customMapOrigin.label);
        if (googleMap && googleMap.isLoaded) googleMap.setTempPin('origin', latlng.lat, latlng.lng, window.customMapOrigin.label);

        showToast('📍 Origin Pin [A] placed on road. Click another road point to set Destination [B].', 'info');
    } else {
        // Step 2: Set Destination Pin [B]
        window.customMapDest = {
            id: 'CUSTOM_MAP_DEST',
            lat: latlng.lat,
            lng: latlng.lng,
            label: `Road Waypoint B (${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)})`
        };

        ensureCustomSelectOption(dSel, 'CUSTOM_MAP_DEST', `🏁 Pin B: ${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`);
        if (dSel) dSel.value = 'CUSTOM_MAP_DEST';

        if (gisMap) gisMap.setTempPin('dest', latlng.lat, latlng.lng, window.customMapDest.label);
        if (googleMap && googleMap.isLoaded) googleMap.setTempPin('dest', latlng.lat, latlng.lng, window.customMapDest.label);

        showToast('🏁 Destination Pin [B] placed. Calculating route along map roads...', 'success');
        runDijkstraRouting();
    }
};

async function fetchRealRoadRoute(originLoc, destLoc, mode = 'car', traffic = true, rain = false, aqi = false) {
    const profile = (mode === 'eco_walk') ? 'walking' : 'driving';
    const osrmUrl = `https://router.project-osrm.org/route/v1/${profile}/${originLoc.lng},${originLoc.lat};${destLoc.lng},${destLoc.lat}?overview=full&geometries=geojson&steps=true`;

    const resp = await fetch(osrmUrl, { cache: 'no-cache' });
    if (!resp.ok) {
        throw new Error(`OSRM network service status ${resp.status}`);
    }
    const data = await resp.json();
    if (data.code !== 'Ok' || !data.routes || !data.routes.length) {
        throw new Error(data.message || 'No direct road corridor found on map');
    }

    const route = data.routes[0];
    const roadCoords = route.geometry.coordinates.map(c => [c[1], c[0]]);
    const distanceKm = +(route.distance / 1000).toFixed(2);
    let baseMins = route.duration / 60.0;

    let trafficMultiplierText = '1.0x (Free Flow)';
    let durationMins = baseMins;

    if (mode === 'emergency') {
        durationMins = baseMins * 0.70;
        trafficMultiplierText = '0.70x (Siren Priority)';
    } else if (traffic) {
        durationMins = baseMins * 1.35;
        trafficMultiplierText = '1.35x (Peak Traffic)';
    }

    if (rain) {
        durationMins *= 1.45;
    }
    durationMins = +Math.max(1, durationMins).toFixed(1);

    const rawSteps = (route.legs && route.legs[0] && route.legs[0].steps) ? route.legs[0].steps : [];
    const turnByTurn = [];

    rawSteps.forEach((st, idx) => {
        const m = st.maneuver || {};
        const mType = m.type || '';
        const mMod = m.modifier || '';
        const street = (st.name && st.name.trim().length > 0) ? st.name.trim() : null;
        const distM = Math.round(st.distance || 0);
        const distStr = distM >= 1000 ? `${(distM / 1000).toFixed(1)} km` : `${distM} m`;
        const stepMins = Math.max(1, Math.round((st.duration || 60) / 60));

        let icon = '⬆️';
        let action = 'Continue';

        if (mType === 'depart') {
            icon = '🟢';
            action = 'Depart from origin';
        } else if (mType === 'arrive') {
            icon = '🏁';
            action = 'Arrive at destination';
        } else if (mType === 'turn') {
            if (mMod.includes('right')) { icon = '➡️'; action = `Turn ${mMod}`; }
            else if (mMod.includes('left')) { icon = '⬅️'; action = `Turn ${mMod}`; }
            else { icon = '↩️'; action = 'Turn'; }
        } else if (mType === 'fork') {
            icon = mMod.includes('left') ? '↖️' : '↗️';
            action = `Take ${mMod} fork`;
        } else if (mType === 'roundabout' || mType === 'rotary') {
            icon = '🔄';
            action = 'Enter roundabout and take exit';
        } else if (mType === 'on ramp' || mType === 'merge') {
            icon = '🛣️';
            action = 'Merge onto highway/ramp';
        } else if (mType === 'off ramp') {
            icon = '↘️';
            action = 'Take exit ramp';
        } else if (mMod.includes('slight right')) {
            icon = '↗️';
            action = 'Slight right';
        } else if (mMod.includes('slight left')) {
            icon = '↖️';
            action = 'Slight left';
        }

        const instruction = street ? `${action} onto <b>${street}</b>` : action;

        turnByTurn.push({
            step: idx + 1,
            icon,
            instruction,
            street: street || 'Connecting Arterial Road',
            distance: distStr,
            duration: `${stepMins} min`,
            mode
        });
    });

    let corridorAqi = 65;
    let aqiLabel = 'Moderate';
    if (originLoc.aqi || destLoc.aqi) {
        corridorAqi = Math.round(((originLoc.aqi || 60) + (destLoc.aqi || 60)) / 2);
    }
    if (corridorAqi <= 50) aqiLabel = 'Good';
    else if (corridorAqi <= 100) aqiLabel = 'Moderate';
    else aqiLabel = 'Unhealthy';

    return {
        success: true,
        isRoadRoute: true,
        source: originLoc.id || originLoc.label,
        dest: destLoc.id || destLoc.label,
        source_label: originLoc.label,
        dest_label: destLoc.label,
        travel_mode: mode,
        total_cost_minutes: durationMins,
        total_physical_km: distanceKm,
        avg_aqi: corridorAqi,
        aqi_label: aqiLabel,
        weather_rain: rain,
        traffic_multiplier: trafficMultiplierText,
        road_coords: roadCoords,
        num_waypoints: roadCoords.length,
        turn_by_turn: turnByTurn,
        path_nodes: [originLoc.id || 'A', destLoc.id || 'B'],
        path_edges: []
    };
}

async function runDijkstraRouting() {
    const source = document.getElementById('routeSource')?.value;
    const dest = document.getElementById('routeDest')?.value;
    const mode = document.getElementById('routeMode')?.value || 'car';
    const traffic = document.getElementById('trafficToggle')?.checked ?? true;
    const rain = document.getElementById('weatherRainToggle')?.checked ?? false;
    const aqi = document.getElementById('aqiAwareToggle')?.checked ?? false;

    syncCanvasNodeSelection();

    const container = document.getElementById('dijkstraResults');
    if (!container) return;

    if (!source || !dest) {
        container.innerHTML = `<div class="alert alert-warning">Please select both an Origin and a Destination.</div>`;
        return;
    }

    const originLoc = getNodeOrCustomLocation(source, 'origin');
    const destLoc = getNodeOrCustomLocation(dest, 'dest');

    const shouldUseRoads = (routingEngineMode === 'road') || (mode !== 'metro');

    let res = null;

    if (shouldUseRoads && originLoc && destLoc) {
        container.innerHTML = `
            <div style="padding: 24px 12px; text-align: center; color: #38bdf8;">
                <div style="font-size: 24px; margin-bottom: 8px; animation: vehiclePulse 1s infinite alternate;">🛣️ 🚗</div>
                <div style="font-weight: 700; font-size: 13px;">Computing route along actual Bengaluru road network...</div>
                <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Querying street coordinates & live traffic corridors</div>
            </div>
        `;

        try {
            res = await fetchRealRoadRoute(originLoc, destLoc, mode, traffic, rain, aqi);
        } catch (err) {
            console.warn('Real road routing via OSRM failed, falling back to graph Dijkstra:', err);
            showToast(`Road network API note: ${err.message}. Using network graph fallback.`, 'info');
            res = null;
        }
    }

    if (!res) {
        // Fallback to Graph Dijkstra
        if (isBackendAvailable) {
            try {
                const resp = await fetch('/api/route/dijkstra', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        source,
                        destination: dest,
                        mode,
                        traffic_enabled: traffic,
                        weather_rain: rain,
                        aqi_aware: aqi,
                        graph: currentGraph
                    })
                });
                res = await resp.json();
            } catch (err) {
                console.warn('Backend routing API failed, falling back to client-side engine:', err);
                res = mathEngine.runDijkstra(source, dest, mode, traffic, rain, aqi);
            }
        } else {
            res = mathEngine.runDijkstra(source, dest, mode, traffic, rain, aqi);
        }
    }

    if (!res || !res.success) {
        lastDijkstraResult = null;
        container.innerHTML = `<div class="alert alert-danger">${res ? res.error : 'Route calculation failed between selected locations.'}</div>`;
        clearAllOverlays();
        return;
    }

    lastDijkstraResult = res;

    // Highlight on Canvas, Leaflet, and Google Maps
    cityCanvas.setDijkstraOverlay(res.path_nodes, res.path_edges);
    if (gisMap) {
        gisMap.setDijkstraOverlay(res.path_nodes, res.path_edges, res.road_coords, originLoc, destLoc);
    }
    if (googleMap && googleMap.isLoaded) {
        googleMap.setDijkstraOverlay(res.path_nodes, res.path_edges, res.road_coords, originLoc, destLoc);
    }

    // AQI badge styling
    const avgAqiVal = parseFloat(res.avg_aqi || 75);
    let aqiClass = 'aqi-good';
    if (avgAqiVal > 200) aqiClass = 'aqi-hazardous';
    else if (avgAqiVal > 150) aqiClass = 'aqi-unhealthy';
    else if (avgAqiVal > 100) aqiClass = 'aqi-unhealthy';
    else if (avgAqiVal > 50) aqiClass = 'aqi-moderate';

    let weatherAlertHtml = '';
    if (res.weather_rain) {
        weatherAlertHtml = `
            <div class="weather-alert-strip">
                <span>🌧️</span>
                <span><b>Monsoon Rain Surcharge:</b> +45% delay applied to surface roads due to waterlogging/congestion. Metro rapid lines run on schedule (0% delay).</span>
            </div>
        `;
    }

    let directionsHtml = '';
    if (res.isRoadRoute) {
        directionsHtml = res.turn_by_turn.map(step => `
            <div class="itinerary-road-step">
                <span class="itinerary-maneuver-icon">${step.icon}</span>
                <div class="step-info" style="flex: 1;">
                    <div style="font-size: 12px; color: #f1f5f9; line-height: 1.4;">${step.instruction}</div>
                    <span class="step-meta">
                        ${step.distance} · est. ${step.duration}
                    </span>
                </div>
            </div>
        `).join('');
    } else {
        directionsHtml = res.turn_by_turn.map(step => `
            <div class="itinerary-step">
                <span class="step-num">${step.step}</span>
                <div class="step-info">
                    <b>${step.segment}</b>
                    <span class="step-meta">
                        ${step.distance_km} km · Congestion ${step.traffic_multiplier} · Mode: ${step.mode}
                        ${step.aqi ? ` · <span class="aqi-pill ${step.aqi <= 50 ? 'aqi-good' : step.aqi <= 100 ? 'aqi-moderate' : 'aqi-unhealthy'}">AQI ${step.aqi}</span>` : ''}
                    </span>
                </div>
            </div>
        `).join('');
    }

    const routeSourceTitle = res.source_label || source;
    const routeDestTitle = res.dest_label || dest;
    const isRoad = !!res.isRoadRoute;

    let emergencyBannerHtml = '';
    const destNode = (currentGraph.nodes || []).find(n => n.id === dest);
    if (destNode && (destNode.type === 'hospital' || res.travel_mode === 'emergency')) {
        emergencyBannerHtml = `
            <div style="background: rgba(239, 68, 68, 0.12); border: 1.5px solid #ef4444; border-radius: 8px; padding: 12px 14px; margin-bottom: 14px; box-shadow: 0 0 16px rgba(239, 68, 68, 0.2);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <div style="font-weight: 800; color: #f87171; font-size: 13px; display: flex; align-items: center; gap: 6px;">
                        <span>🚑</span> <span>EMERGENCY HOSPITAL DISPATCH CORRIDOR</span>
                    </div>
                    <span style="background: #ef4444; color: white; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 800;">
                        24x7 TRAUMA UNIT
                    </span>
                </div>
                <div style="color: #fca5a5; font-size: 13px; font-weight: 700;">
                    🏥 ${destNode.label}
                </div>
                ${destNode.speciality ? `<div style="color: #cbd5e1; font-size: 11px; margin-top: 3px;">🩺 <b>Speciality:</b> ${destNode.speciality}</div>` : ''}
                ${destNode.address ? `<div style="color: #94a3b8; font-size: 11px; margin-top: 2px;">📍 <b>Address:</b> ${destNode.address}</div>` : ''}
                <div style="display: flex; gap: 14px; margin-top: 6px; font-size: 11px; flex-wrap: wrap;">
                    ${destNode.emergency ? `<span style="color: #fca5a5; font-weight: 700;">🚨 <b>Emergency Line:</b> ${destNode.emergency}</span>` : ''}
                    ${destNode.phone ? `<span style="color: #38bdf8;">📞 <b>Phone:</b> ${destNode.phone}</span>` : ''}
                </div>
            </div>
        `;
    }

    // Cab & Ride-Hailing Integration (Bengaluru Fares, 1-Click Booking & Live Dispatch Simulation)
    let cabBookingHtml = '';
    if (res.travel_mode === 'car' || isRoad) {
        const distKm = parseFloat(res.total_physical_km || 5.0);
        const durationMin = parseFloat(res.total_cost_minutes || 15.0);
        const isRain = !!res.weather_rain;
        const isTraffic = document.getElementById('trafficToggle')?.checked ?? true;

        let surgeMultiplier = 1.0;
        let surgeLabel = '⚡ Off-Peak Standard Fares';
        let surgeClass = 'cab-surge-normal';
        if (isTraffic && isRain) {
            surgeMultiplier = 1.45;
            surgeLabel = '🔥 1.45x Peak + Monsoon Surge';
            surgeClass = 'cab-surge-high';
        } else if (isTraffic) {
            surgeMultiplier = 1.25;
            surgeLabel = '⚡ 1.25x Peak Congestion Surge';
            surgeClass = 'cab-surge-med';
        } else if (isRain) {
            surgeMultiplier = 1.20;
            surgeLabel = '🌧️ 1.20x Monsoon Weather Delay';
            surgeClass = 'cab-surge-med';
        }

        // Bengaluru Live Fare Matrix (INR)
        // 1. Auto: ₹36 base (first 2km), ₹15/km after, ₹0.5/min
        const autoFare = Math.max(36, Math.round(36 + Math.max(0, distKm - 2) * 15 + Math.max(0, durationMin - distKm * 1.8) * 0.5));
        // 2. Uber Go / Mini: ₹55 base + ₹15.5/km + ₹1.5/min * surge
        const goFare = Math.round((55 + distKm * 15.5 + durationMin * 1.5) * surgeMultiplier);
        // 3. Uber Premier: ₹90 base + ₹19/km + ₹2.0/min * surge
        const premierFare = Math.round((90 + distKm * 19.0 + durationMin * 2.0) * surgeMultiplier);
        // 4. Bike Taxi: ₹25 base + ₹8.5/km + ₹0.8/min
        const bikeFare = Math.round((25 + distKm * 8.5 + durationMin * 0.8) * (isRain ? 1.3 : 1.0));

        // GPS coordinates for booking deep links
        const pLat = originLoc?.lat || (res.road_coords && res.road_coords[0] ? res.road_coords[0][0] : 12.9716);
        const pLng = originLoc?.lng || (res.road_coords && res.road_coords[0] ? res.road_coords[0][1] : 77.5946);
        const dLat = destLoc?.lat || (res.road_coords && res.road_coords.length ? res.road_coords[res.road_coords.length - 1][0] : 12.9352);
        const dLng = destLoc?.lng || (res.road_coords && res.road_coords.length ? res.road_coords[res.road_coords.length - 1][1] : 77.6245);

        const pName = originLoc?.label || res.source_label || source || 'Pickup Location';
        const dName = destLoc?.label || res.dest_label || dest || 'Drop Location';

        const safePName = encodeURIComponent(pName);
        const safeDName = encodeURIComponent(dName);

        const uberDeepLink = `https://m.uber.com/ul/?action=setPickup&client_id=smart_urban_optimizer&pickup[latitude]=${pLat}&pickup[longitude]=${pLng}&pickup[nickname]=${safePName}&dropoff[latitude]=${dLat}&dropoff[longitude]=${dLng}&dropoff[nickname]=${safeDName}`;
        const olaDeepLink = `https://book.olacabs.com/?lat=${pLat}&lng=${pLng}&drop_lat=${dLat}&drop_lng=${dLng}`;
        const gmapsLink = `https://www.google.com/maps/dir/?api=1&origin=${pLat},${pLng}&destination=${dLat},${dLng}&travelmode=driving`;
        const nammaYatriLink = `https://nammayatri.in/`;

        window.currentCabRide = {
            type: 'car',
            fare: goFare,
            provider: 'Uber Go / Ola Mini',
            emoji: '🚗',
            pLat, pLng, dLat, dLng,
            pName, dName
        };

        cabBookingHtml = `
            <div class="cab-booking-card" id="cabBookingPanel">
                <div class="cab-card-header">
                    <div class="cab-header-left">
                        <span class="cab-header-icon">🚕</span>
                        <div>
                            <div class="cab-header-title">Bengaluru Cab & Ride Booking</div>
                            <div class="cab-header-sub">Direct 1-Click Booking & Live City Fare Matrix</div>
                        </div>
                    </div>
                    <div class="cab-surge-pill ${surgeClass}" title="Live traffic and environmental surge factor">
                        ${surgeLabel}
                    </div>
                </div>

                <!-- Fare Options Grid -->
                <div class="cab-options-grid">
                    <div class="cab-option-item selected" onclick="window.selectCabOption(this, 'car', ${goFare}, 'Uber Go / Ola Mini', '🚗')">
                        <div class="cab-option-top">
                            <span class="cab-opt-icon">🚗</span>
                            <span class="cab-opt-name">Uber Go / Mini</span>
                            <span class="cab-opt-eta">⏱️ 3 min</span>
                        </div>
                        <div class="cab-opt-desc">Economy AC Hatchback / Sedan</div>
                        <div class="cab-opt-price">₹${goFare}</div>
                    </div>

                    <div class="cab-option-item" onclick="window.selectCabOption(this, 'auto', ${autoFare}, 'Namma Yatri Auto', '🛺')">
                        <div class="cab-option-top">
                            <span class="cab-opt-icon">🛺</span>
                            <span class="cab-opt-name">Namma Yatri Auto</span>
                            <span class="cab-opt-eta">⏱️ 2 min</span>
                        </div>
                        <div class="cab-opt-desc">0% Commission · Direct to Driver</div>
                        <div class="cab-opt-price">₹${autoFare}</div>
                    </div>

                    <div class="cab-option-item" onclick="window.selectCabOption(this, 'premier', ${premierFare}, 'Uber Premier Sedan', '🚘')">
                        <div class="cab-option-top">
                            <span class="cab-opt-icon">🚘</span>
                            <span class="cab-opt-name">Uber Premier</span>
                            <span class="cab-opt-eta">⏱️ 4 min</span>
                        </div>
                        <div class="cab-opt-desc">Top Drivers & High-Comfort Sedans</div>
                        <div class="cab-opt-price">₹${premierFare}</div>
                    </div>

                    <div class="cab-option-item" onclick="window.selectCabOption(this, 'bike', ${bikeFare}, 'Rapido Bike Taxi', '🛵')">
                        <div class="cab-option-top">
                            <span class="cab-opt-icon">🛵</span>
                            <span class="cab-opt-name">Rapido / Moto</span>
                            <span class="cab-opt-eta">⏱️ 1 min</span>
                        </div>
                        <div class="cab-opt-desc">Fastest Through City Traffic</div>
                        <div class="cab-opt-price">₹${bikeFare}</div>
                    </div>
                </div>

                <!-- Live Dispatch Status Banner -->
                <div id="cabDispatchBanner" style="display: none;" class="cab-dispatch-status"></div>

                <!-- Direct 1-Click Booking Buttons -->
                <div class="cab-actions-row">
                    <button class="btn btn-cab-uber" onclick="window.openBookingProvider('uber', '${uberDeepLink}')" title="Open Uber app or web rider with pickup and drop pre-filled">
                        <span>🚕</span> <span>Book Uber</span>
                    </button>
                    <button class="btn btn-cab-yatri" onclick="window.openBookingProvider('yatri', '${nammaYatriLink}')" title="Book Auto on Namma Yatri Open Mobility Platform">
                        <span>🛺</span> <span>Namma Yatri</span>
                    </button>
                    <button class="btn btn-cab-ola" onclick="window.openBookingProvider('ola', '${olaDeepLink}')" title="Book ride on Ola Cabs with pickup and drop pre-filled">
                        <span>🟡</span> <span>Book Ola</span>
                    </button>
                    <button class="btn btn-cab-gmaps" onclick="window.openBookingProvider('gmaps', '${gmapsLink}')" title="Open Google Maps Driving Directions">
                        <span>🗺️</span> <span>Google Maps</span>
                    </button>
                </div>

                <div class="cab-sim-row">
                    <button id="simulateCabRideBtn" class="btn btn-cab-dispatch-sim" onclick="window.simulateCabBookingAndRide()">
                        <span>🚖</span> <span>Simulate Driver Dispatch & Live Ride (Uber Go · ₹${goFare})</span>
                    </button>
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="results-header" style="align-items: flex-start;">
            <div>
                <h4>${isRoad ? '🛣️ Road Route' : '🚇 Metro Rail Route'}: ${routeSourceTitle} ➔ ${routeDestTitle}</h4>
                <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">
                    ${isRoad ? 'Routed along authentic Bengaluru street corridors' : 'Routed across Namma Metro track lines'}
                </div>
            </div>
            <div style="display: flex; gap: 4px; flex-wrap: wrap; justify-content: flex-end;">
                ${isRoad ? '<span class="badge-road">🛣️ REAL ROADS (OSRM)</span>' : '<span class="badge-road" style="border-color: #a855f7; color: #d8b4fe;">🚇 METRO TRACKS</span>'}
                <span class="badge-cyan">${res.travel_mode.toUpperCase()}</span>
            </div>
        </div>
        ${emergencyBannerHtml}
        ${weatherAlertHtml}
        <div class="stats-grid">
            <div class="stat-box">
                <span class="stat-label">Estimated Transit Time</span>
                <span class="stat-val highlight-cyan">${res.total_cost_minutes} mins</span>
            </div>
            <div class="stat-box">
                <span class="stat-label">Physical Road Distance</span>
                <span class="stat-val">${res.total_physical_km} km</span>
            </div>
            <div class="stat-box">
                <span class="stat-label">Corridor Air Quality</span>
                <span class="stat-val"><span class="aqi-pill ${aqiClass}">AQI ${res.avg_aqi || '--'} · ${res.aqi_label || ''}</span></span>
            </div>
            <div class="stat-box">
                <span class="stat-label">${isRoad ? 'Street Waypoints' : 'Intersections'}</span>
                <span class="stat-val">${isRoad ? `${res.num_waypoints} road points` : `${res.path_nodes.length} nodes`}</span>
            </div>
        </div>
        ${cabBookingHtml}
        <div class="path-badge-flow">
            <b>${isRoad ? 'Navigation Corridor:' : 'Optimal Path:'}</b> ${res.path_nodes.map(n => `<span class="node-pill">${n}</span>`).join(' ➔ ')}
        </div>
        <div style="margin: 6px 0 14px 0; display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-animate-route" onclick="animateCurrentRoute()" style="flex: 1; padding: 9px 14px; font-weight: 700; background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); border: 1px solid #38bdf8; color: white; cursor: pointer; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
                <span>▶</span> <span>Animate Vehicle on Map Roads</span>
            </button>
        </div>
        <div class="itinerary-list">
            <h5>${isRoad ? '🛣️ Turn-by-Turn Road Navigation Itinerary:' : 'Turn-by-Turn Metro Itinerary:'}</h5>
            ${directionsHtml}
        </div>
    `;

    if (window.addTelemetryLog) {
        window.addTelemetryLog('ROUTE', `${isRoad ? 'Real Road' : 'Dijkstra'}: ${routeSourceTitle} ➔ ${routeDestTitle} (${res.travel_mode.toUpperCase()}) in ${res.total_cost_minutes} min, ${res.total_physical_km} km.`);
    }
}

// -------------------------------------------------------------
// PHASE 2B: UTILITY INFRASTRUCTURE OPTIMIZER (MST)
// -------------------------------------------------------------
function runMST(algorithm = 'kruskal') {
    try {
        if (!mathEngine && currentGraph) {
            mathEngine = new DiscreteMathEngine(currentGraph);
        }
        if (!mathEngine) {
            console.warn("DiscreteMathEngine not initialized yet for MST");
            return;
        }

        const rootNode = document.getElementById('primRoot')?.value || (currentGraph.nodes[0] ? currentGraph.nodes[0].id : 'W1');
        const kruskalRes = mathEngine.runKruskal();
        const primRes = mathEngine.runPrim(rootNode);

        const activeRes = algorithm === 'prim' ? primRes : kruskalRes;

        // Highlight on Canvas, Leaflet, and Google Maps
        if (cityCanvas && typeof cityCanvas.setMstOverlay === 'function') {
            cityCanvas.setMstOverlay(activeRes.mst_edges);
        }
        if (gisMap && typeof gisMap.setMstOverlay === 'function') {
            gisMap.setMstOverlay(activeRes.mst_edges);
        }
        if (googleMap && googleMap.isLoaded && typeof googleMap.setMstOverlay === 'function') {
            googleMap.setMstOverlay(activeRes.mst_edges);
        }

        const container = document.getElementById('mstResults');
        if (!container) return;

        const stepLogs = activeRes.step_log || [];
        let stepLogRows = stepLogs.slice(0, 10).map(s => {
            const isRejected = s.action === 'REJECTED';
            const actionText = s.action || 'ADDED';
            return `
                <tr class="${isRejected ? 'row-rejected' : 'row-added'}">
                    <td>${s.step}</td>
                    <td><code>${s.edge || s.via_edge || ''}</code></td>
                    <td>$${Number(s.cost || 0).toLocaleString()}</td>
                    <td><span class="badge-${isRejected ? 'danger' : 'success'}">${actionText}</span></td>
                    <td><small>${s.reason || s.added_node || 'Connected'}</small></td>
                </tr>
            `;
        }).join('');

        container.innerHTML = `
            <div class="mst-comparison-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h4 style="margin: 0;">Utility Spanning Tree Optimization Metrics</h4>
                    <span class="badge-success" style="font-size: 11px; padding: 4px 10px;">${algorithm.toUpperCase()} ACTIVE</span>
                </div>
                <div class="stats-grid">
                    <div class="stat-box">
                        <span class="stat-label">Original Network Cost</span>
                        <span class="stat-val">$${Number(activeRes.total_original_cost || 0).toLocaleString()}</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-label">Optimal MST Cost</span>
                        <span class="stat-val highlight-green">$${Number(activeRes.total_mst_cost || 0).toLocaleString()}</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-label">Capital Savings</span>
                        <span class="stat-val highlight-green">${activeRes.cost_reduction_percent}%</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-label">Redundant Loops Eliminated</span>
                        <span class="stat-val">${activeRes.redundant_loops_eliminated} cycles</span>
                    </div>
                </div>

                <div class="algo-comparison-table mt-3">
                    <table class="styled-table">
                        <thead>
                            <tr>
                                <th>Algorithm</th>
                                <th>Time Complexity</th>
                                <th>Greedy Strategy</th>
                                <th>Total Cost</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="${algorithm === 'kruskal' ? 'selected-row' : ''}">
                                <td><b>Kruskal's Algorithm</b></td>
                                <td><code>O(E log E)</code></td>
                                <td>Global edge sort + Disjoint Set Union (DSU)</td>
                                <td><b>$${Number(kruskalRes.total_mst_cost || 0).toLocaleString()}</b></td>
                                <td><span class="badge-success">${algorithm === 'kruskal' ? 'Active' : 'Minimal'}</span></td>
                            </tr>
                            <tr class="${algorithm === 'prim' ? 'selected-row' : ''}">
                                <td><b>Prim's Algorithm</b></td>
                                <td><code>O(E log V)</code></td>
                                <td>Cut-crossing edges grown from root <code>${rootNode}</code></td>
                                <td><b>$${Number(primRes.total_mst_cost || 0).toLocaleString()}</b></td>
                                <td><span class="badge-success">${algorithm === 'prim' ? 'Active' : 'Minimal'}</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="step-log-section mt-3">
                    <h5>Algorithmic Decision Log (${algorithm.toUpperCase()}):</h5>
                    <table class="styled-table-sm">
                        <thead>
                            <tr>
                                <th>Step</th>
                                <th>Candidate Line</th>
                                <th>Cost</th>
                                <th>Action</th>
                                <th>Engineering Justification</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${stepLogRows || '<tr><td colspan="5" style="text-align:center; color:#94a3b8;">No edge log available</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        if (window.addTelemetryLog) {
            window.addTelemetryLog('MST', `Optimized infrastructure via ${algorithm.toUpperCase()}: saved ${activeRes.cost_reduction_percent}%, removed ${activeRes.redundant_loops_eliminated} loops.`);
        }
    } catch (err) {
        console.error("MST Execution Error:", err);
        const container = document.getElementById('mstResults');
        if (container) {
            container.innerHTML = `<div class="alert alert-danger">MST Optimization Error: ${err.message}</div>`;
        }
    }
}
window.runMST = runMST;

// -------------------------------------------------------------
// PHASE 2C: MUNICIPAL LOGISTICS (EULER & HAMILTON)
// -------------------------------------------------------------
function auditMunicipalLogistics() {
    const euler = mathEngine.runHierholzer();
    const hamilton = mathEngine.findHamiltonianCycle();

    const eulerCard = document.getElementById('eulerCard');
    if (eulerCard) {
        eulerCard.innerHTML = `
            <div class="card-header">
                <h3>Eulerian Sweeping Route (Hierholzer O(E))</h3>
                <span class="status-pill ${euler.success ? 'pill-success' : 'pill-warning'}">
                    ${euler.status}
                </span>
            </div>
            <p class="desc-text">
                ${euler.success
                    ? `🏆 Continuous non-overlapping street sweeping route exists! Covers all <b>${euler.edges_traversed_count}</b> street segments exactly once.`
                    : `⚠️ ${euler.error} Requires duplicating edges (Chinese Postman Problem).`}
            </p>
            ${euler.success ? `
                <div class="path-badge-flow">
                    <b>Sweeper Sequence:</b> ${euler.nodes_sequence.slice(0, 10).map(n => `<span class="node-pill">${n}</span>`).join(' ➔ ')}
                    ${euler.nodes_sequence.length > 10 ? ' ...' : ''}
                </div>
                <button class="btn btn-warning mt-2" onclick="animateSweeperRoute()">
                    🚛 Animate Street Sweeper Vehicle
                </button>
            ` : ''}
        `;
    }

    const hamiltonCard = document.getElementById('hamiltonCard');
    if (hamiltonCard) {
        hamiltonCard.innerHTML = `
            <div class="card-header">
                <h3>Hamiltonian Security Patrol Cycle</h3>
                <span class="status-pill ${hamilton.success ? 'pill-success' : 'pill-danger'}">
                    ${hamilton.success ? 'Hamiltonian Cycle Found' : 'No Closed Cycle'}
                </span>
            </div>
            <p class="desc-text">
                ${hamilton.success
                    ? `✅ Smart Security Patrol covers every single intersection/hub once without redundant visits, returning to start node <code>${hamilton.start_node}</code>.`
                    : `❌ No simple cycle visits every vertex exactly once in this network.`}
            </p>
            ${hamilton.success ? `
                <div class="path-badge-flow">
                    <b>Patrol Order:</b> ${hamilton.cycle_nodes.map(n => `<span class="node-pill">${n}</span>`).join(' ➔ ')}
                </div>
                <button class="btn btn-cyan mt-2" onclick="animatePatrolRoute()">
                    🚓 Animate Security Patrol Beacon
                </button>
            ` : ''}
        `;
    }
}

function animateSweeperRoute() {
    const euler = mathEngine.runHierholzer();
    if (euler.success) {
        clearAllOverlays();
        if (activeViewMode === 'google' && googleMap && googleMap.isLoaded) {
            googleMap.startRouteAnimation(euler.nodes_sequence, 'sweeper');
        } else if (activeViewMode === 'gis' && gisMap) {
            gisMap.startRouteAnimation(euler.nodes_sequence, 'sweeper');
        } else {
            cityCanvas.startRouteAnimation(euler.nodes_sequence, 'sweeper');
        }
    }
}

function animatePatrolRoute() {
    const hamilton = mathEngine.findHamiltonianCycle();
    if (hamilton.success) {
        clearAllOverlays();
        if (activeViewMode === 'google' && googleMap && googleMap.isLoaded) {
            googleMap.startRouteAnimation(hamilton.cycle_nodes, 'patrol');
        } else if (activeViewMode === 'gis' && gisMap) {
            gisMap.startRouteAnimation(hamilton.cycle_nodes, 'patrol');
        } else {
            cityCanvas.startRouteAnimation(hamilton.cycle_nodes, 'patrol');
        }
    }
}

function runEulerSweeper() {
    auditMunicipalLogistics();
    animateSweeperRoute();
}

function runHamiltonPatrol() {
    auditMunicipalLogistics();
    animatePatrolRoute();
}

// -------------------------------------------------------------
// CUSTOM CITY BUILDER: ADD NODE & ADD ROAD
// -------------------------------------------------------------
function showAddNodeModal() {
    const id = prompt("Enter Node ID (e.g., S3, H2, R5):");
    if (!id) return;
    const label = prompt("Enter Node Label (e.g., New Tech Park):", id);
    const type = prompt("Enter Node Type (residential, hospital, commercial, reservoir, substation):", "residential");

    const x = Math.round(250 + Math.random() * 300);
    const y = Math.round(150 + Math.random() * 250);

    const icons = {
        hospital: "🏥",
        reservoir: "💧",
        substation: "⚡",
        commercial: "🏢",
        residential: "🏘️",
        metro_hub: "🚇",
        depot: "🚛"
    };

    currentGraph.nodes.push({
        id,
        label: label || id,
        type: type || "residential",
        x,
        y,
        icon: icons[type] || "📍"
    });

    mathEngine = new DiscreteMathEngine(currentGraph);
    cityCanvas.setGraph(currentGraph);
    if (gisMap && activeViewMode === 'gis') gisMap.renderGraph(currentGraph);
    if (googleMap && googleMap.isLoaded && activeViewMode === 'google') googleMap.renderGraph(currentGraph);
    updateNodeDropdowns();
    updateLiveMetricsBadge();
    renderOverviewDashboard();
    runActiveTabAudit();
}

function showAddRoadModal() {
    const u = prompt("Enter Start Node ID:");
    if (!u || !currentGraph.nodes.find(n => n.id === u)) {
        alert("Invalid start node!");
        return;
    }
    const v = prompt("Enter End Node ID:");
    if (!v || !currentGraph.nodes.find(n => n.id === v) || u === v) {
        alert("Invalid end node!");
        return;
    }
    const length = parseFloat(prompt("Enter Road Distance in km:", "2.5")) || 2.5;

    currentGraph.edges.push({
        id: `custom_${Date.now()}`,
        u,
        v,
        name: `Road ${u}-${v}`,
        length,
        traffic: 1.0,
        cost: length * 100000,
        mode: "road"
    });

    mathEngine = new DiscreteMathEngine(currentGraph);
    cityCanvas.setGraph(currentGraph);
    if (gisMap && activeViewMode === 'gis') gisMap.renderGraph(currentGraph);
    if (googleMap && googleMap.isLoaded && activeViewMode === 'google') googleMap.renderGraph(currentGraph);
    updateLiveMetricsBadge();
    renderOverviewDashboard();
    runActiveTabAudit();
}


// -------------------------------------------------------------
// LIVE GEOLOCATION (W3C GPS API) & NOMINATIM SPATIAL SEARCH
// -------------------------------------------------------------
function showToast(message, type = 'info') {
    let toast = document.getElementById('appToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'appToast';
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999;
            background: #0f172a;
            border: 1px solid #38bdf8;
            color: #f8fafc;
            padding: 10px 16px;
            border-radius: 8px;
            font-size: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            gap: 10px;
            transition: opacity 0.3s, transform 0.3s;
            transform: translateY(20px);
            opacity: 0;
            pointer-events: none;
            max-width: 360px;
        `;
        document.body.appendChild(toast);
    }

    const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
    const borders = { info: '#38bdf8', success: '#10b981', warning: '#f59e0b', error: '#ef4444' };
    toast.style.borderColor = borders[type] || '#38bdf8';
    toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
    }, 4500);
}

// =============================================================
// ROBUST MULTI-STRATEGY GPS TRACKER & PRECISION CALIBRATION
// =============================================================
window.liveGpsWatchId = null;
window.isMapPickModeActive = false;

function requestPreciseLocation(onSuccess, onError) {
    if (!navigator.geolocation) {
        showToast('HTML5 Geolocation is not supported by your browser.', 'warning');
        if (onError) onError(new Error('Geolocation not supported'));
        return;
    }

    showToast('🛰️ Requesting high-precision satellite/Wi-Fi GPS position...', 'info');

    // Attempt 1: High Accuracy GPS (Satellites & Wi-Fi Triangulation)
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const acc = pos.coords.accuracy || 20;
            console.log(`[GPS] High-accuracy fix acquired: ${lat}, ${lng} (±${Math.round(acc)}m)`);
            onSuccess(lat, lng, acc, true, 'High-Accuracy Satellite / Wi-Fi GPS');
        },
        (err) => {
            console.warn(`[GPS] High accuracy attempt failed (${err.code}: ${err.message}). Trying secondary network coarse provider...`);

            if (err.code === 1) { // PERMISSION_DENIED
                showGpsPermissionNotice(err.message);
                showToast('🔒 Location permission blocked by browser. Check address bar icon or set location manually.', 'warning');
                fetchIpGeolocationFallback(onSuccess, onError);
                return;
            }

            // Attempt 2: Coarse Network Provider (Cellular / ISP / Wi-Fi without hardware requirement)
            navigator.geolocation.getCurrentPosition(
                (pos2) => {
                    const lat2 = pos2.coords.latitude;
                    const lng2 = pos2.coords.longitude;
                    const acc2 = pos2.coords.accuracy || 100;
                    console.log(`[GPS] Network coarse fix acquired: ${lat2}, ${lng2} (±${Math.round(acc2)}m)`);
                    onSuccess(lat2, lng2, acc2, true, 'Network Wi-Fi / Cell Tower Provider');
                },
                (err2) => {
                    console.warn(`[GPS] Network coarse provider failed (${err2.code}: ${err2.message}). Trying IP Geolocation...`);
                    fetchIpGeolocationFallback(onSuccess, () => {
                        showToast(`GPS position unavailable: ${err2.message}. Please use 'Exact Location' to set your address.`, 'error');
                        openExactLocationModal();
                        if (onError) onError(err2);
                    });
                },
                { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
            );
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

async function fetchIpGeolocationFallback(onSuccess, onError) {
    try {
        const resp = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (!resp.ok) throw new Error('IP Geo API non-200');
        const data = await resp.json();
        const lat = parseFloat(data.latitude);
        const lng = parseFloat(data.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
            const cityName = data.city || data.region || 'Bengaluru';
            showToast(`🌐 Regional IP Location detected: ${cityName} [${lat.toFixed(4)}, ${lng.toFixed(4)}]`, 'info');
            onSuccess(lat, lng, 2000, false, `IP Geolocation (${cityName})`);
            return;
        }
    } catch (e) {
        console.warn('IP Geolocation fallback failed:', e.message);
    }
    if (onError) onError(new Error('IP Geolocation failed'));
}

window.toggleLiveGpsTracking = function() {
    if (window.liveGpsWatchId !== null && window.liveGpsWatchId !== undefined) {
        // Stop tracking
        navigator.geolocation.clearWatch(window.liveGpsWatchId);
        window.liveGpsWatchId = null;
        updateTrackingButtonUi(false);
        showToast('⏹️ Real-time GPS tracking stopped.', 'info');
    } else {
        // Start tracking
        if (!navigator.geolocation) {
            showToast('HTML5 Geolocation is not supported in this browser.', 'warning');
            return;
        }

        showToast('🛰️ Starting continuous Real-Time GPS Tracking...', 'info');
        updateTrackingButtonUi(true, 'Acquiring lock...');

        window.liveGpsWatchId = navigator.geolocation.watchPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                const accuracy = pos.coords.accuracy || 15;
                const speed = pos.coords.speed ? (pos.coords.speed * 3.6).toFixed(1) + ' km/h' : null;

                setUserGpsLocation(lat, lng, true, accuracy, 'Live Continuous GPS Tracker');
                updateTrackingButtonUi(true, `Active (±${Math.round(accuracy)}m)`);

                if (window.addTelemetryLog) {
                    window.addTelemetryLog('GPS TRACKER', `Live position fix: [${lat.toFixed(5)}, ${lng.toFixed(5)}] ±${Math.round(accuracy)}m ${speed ? `at ${speed}` : ''}`);
                }
            },
            (err) => {
                console.warn('[GPS Tracker Watch Error]:', err.message);
                if (err.code === 1) {
                    showGpsPermissionNotice(err.message);
                    window.toggleLiveGpsTracking();
                } else {
                    showToast(`⚠️ GPS tracking update warning: ${err.message}`, 'warning');
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 3000
            }
        );
    }
};

function updateTrackingButtonUi(isActive, statusText = '') {
    const btn = document.getElementById('liveTrackingBtn');
    const badge = document.getElementById('gpsLiveStatusBadge');
    const details = document.getElementById('gpsStatusDetails');

    if (btn) {
        if (isActive) {
            btn.classList.add('active');
            btn.innerHTML = `🛰️ Tracking: ${statusText || 'ON'}`;
            btn.style.background = 'rgba(16, 185, 129, 0.35)';
            btn.style.borderColor = '#10b981';
            btn.style.color = '#ecfdf5';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = `🛰️ Tracker: OFF`;
            btn.style.background = 'rgba(16, 185, 129, 0.15)';
            btn.style.borderColor = 'rgba(16, 185, 129, 0.5)';
            btn.style.color = '#34d399';
        }
    }

    if (badge) {
        badge.textContent = isActive ? (statusText || 'TRACKING') : 'STANDBY';
        badge.style.background = isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';
        badge.style.borderColor = isActive ? '#10b981' : '#ef4444';
        badge.style.color = isActive ? '#34d399' : '#fca5a5';
    }

    if (details && isActive) {
        details.innerHTML = `Continuous satellite/Wi-Fi GPS position streaming active. Accuracy: ${statusText}`;
    }
}

window.openExactLocationModal = function() {
    const modal = document.getElementById('exactLocationModal');
    if (modal) {
        modal.classList.add('active');
        document.getElementById('exactAddressInput')?.focus();
    }
};

window.closeExactLocationModal = function() {
    const modal = document.getElementById('exactLocationModal');
    if (modal) modal.classList.remove('active');
};

function showGpsPermissionNotice(msg) {
    const notice = document.getElementById('gpsPermissionNotice');
    if (notice) {
        notice.style.display = 'block';
        notice.innerHTML = `
            <b>🔒 Location Access Blocked:</b> ${msg || 'Browser location permission denied'}.<br>
            <b>Fix in Chrome / Safari / Edge:</b> Click the 🔒 lock or tune icon in your address bar (next to the URL) and change <b>Location</b> to <b>Allow</b>, then refresh.<br>
            Or choose a preset Bangalore zone or type your exact address below.
        `;
    }
    openExactLocationModal();
}

window.setExactLocationByCoordinates = function(lat, lng, addressLabel = 'Exact Location') {
    setUserGpsLocation(lat, lng, true, 10, addressLabel);
    closeExactLocationModal();
    showToast(`🎯 Location calibrated: ${addressLabel}`, 'success');

    const srcSel = document.getElementById('routeSource');
    if (srcSel) {
        const opt = srcSel.querySelector('option[value="USER_CURRENT_LOCATION"]');
        if (opt) {
            opt.textContent = `📍 My Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        }
        srcSel.value = 'USER_CURRENT_LOCATION';
    }
    if (activeTab === 'phase2a') {
        runDijkstraRouting();
    }
};

window.searchAndSetExactAddress = async function() {
    const input = document.getElementById('exactAddressInput');
    const query = input?.value?.trim();
    if (!query) {
        showToast('Please type an address, area, or landmark.', 'warning');
        return;
    }

    showToast(`🔍 Searching OSM for "${query}"...`, 'info');
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' Bangalore India')}&limit=1`;
        const resp = await fetch(url);
        const data = await resp.json();
        if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lng = parseFloat(data[0].lon);
            const display = data[0].display_name.split(',')[0];
            setExactLocationByCoordinates(lat, lng, `${display} (${query})`);
        } else {
            const url2 = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
            const resp2 = await fetch(url2);
            const data2 = await resp2.json();
            if (data2 && data2.length > 0) {
                const lat2 = parseFloat(data2[0].lat);
                const lng2 = parseFloat(data2[0].lon);
                setExactLocationByCoordinates(lat2, lng2, data2[0].display_name.split(',')[0]);
            } else {
                showToast(`Could not find "${query}". Please check spelling or click on the map.`, 'error');
            }
        }
    } catch (err) {
        showToast(`Geocoding error: ${err.message}`, 'error');
    }
};

window.startMapPickLocationMode = function() {
    closeExactLocationModal();
    window.isMapPickModeActive = true;
    showToast('📍 Click anywhere on the map to pinpoint your exact GPS location!', 'info');

    const container = document.getElementById('gisMap');
    if (container) container.style.cursor = 'crosshair';

    const onMapClicked = (e) => {
        if (!window.isMapPickModeActive) return;
        window.isMapPickModeActive = false;
        if (container) container.style.cursor = '';

        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        setExactLocationByCoordinates(lat, lng, 'Map Pinpoint Location');
        if (gisMap && gisMap.map) {
            gisMap.map.off('click', onMapClicked);
        }
    };

    if (gisMap && gisMap.map) {
        gisMap.map.once('click', onMapClicked);
    }
};

async function useCurrentLocationForRouting(targetRole = 'source') {
    const onLocationAcquired = (lat, lng, acc, isLive, prov) => {
        setUserGpsLocation(lat, lng, isLive, acc, prov);

        const sel = (targetRole === 'source') ? document.getElementById('routeSource') : document.getElementById('routeDest');
        if (sel) {
            const opt = sel.querySelector('option[value="USER_CURRENT_LOCATION"]');
            if (opt) {
                opt.textContent = `📍 My Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
            } else {
                ensureCustomSelectOption(sel, 'USER_CURRENT_LOCATION', `📍 My Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
            }
            sel.value = 'USER_CURRENT_LOCATION';
        }

        if (activeTab !== 'phase2a') {
            switchTab('phase2a');
        }

        showToast(isLive ? `📍 Current GPS location set as Route ${targetRole === 'source' ? 'Origin' : 'Destination'}!` : '📍 Using calibrated location.', 'success');
        runDijkstraRouting();
    };

    requestPreciseLocation(
        (lat, lng, acc, isLive, prov) => {
            onLocationAcquired(lat, lng, acc, isLive, prov);
        },
        (err) => {
            openExactLocationModal();
        }
    );
}
window.useCurrentLocationForRouting = useCurrentLocationForRouting;

function locateUserGps() {
    requestPreciseLocation(
        (lat, lng, acc, isLive, prov) => {
            setUserGpsLocation(lat, lng, isLive, acc, prov);
            showToast(`📍 GPS position locked: [${lat.toFixed(5)}, ${lng.toFixed(5)}] ±${Math.round(acc)}m (${prov})`, 'success');
        },
        (err) => {
            openExactLocationModal();
        }
    );
}

function setUserGpsLocation(lat, lng, isLive, accuracy = null, providerName = 'GPS') {
    const accMeters = accuracy ? Math.round(accuracy) : null;
    window.userGpsCoords = {
        id: 'USER_CURRENT_LOCATION',
        lat: lat,
        lng: lng,
        isLive: isLive,
        accuracy: accMeters,
        provider: providerName,
        label: isLive
            ? `My Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})${accMeters ? ` ±${accMeters}m` : ''}`
            : `Custom Pin (${lat.toFixed(4)}, ${lng.toFixed(4)})`
    };

    const updateSelectLocLabel = (selId) => {
        const sel = document.getElementById(selId);
        if (!sel) return;
        const opt = sel.querySelector('option[value="USER_CURRENT_LOCATION"]');
        if (opt) {
            opt.textContent = `📍 My Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})${accMeters ? ` ±${accMeters}m` : ''}`;
        }
    };
    updateSelectLocLabel('routeSource');
    updateSelectLocLabel('routeDest');

    if (activeViewMode === 'canvas') {
        setViewMode('gis');
    }

    if (activeViewMode === 'google' && googleMap && googleMap.isLoaded) {
        googleMap.map.panTo({ lat, lng });
        if (googleMap.map.getZoom() < 15) {
            googleMap.map.setZoom(16);
        }
        if (googleMap.userMarker) googleMap.userMarker.setMap(null);
        if (googleMap.accuracyCircle) googleMap.accuracyCircle.setMap(null);

        googleMap.userMarker = new google.maps.Marker({
            position: { lat, lng },
            map: googleMap.map,
            draggable: true,
            title: "Your GPS Position (Drag to fine-tune exact doorstep)",
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#10b981",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 3
            }
        });

        if (accMeters && accMeters > 5 && accMeters < 5000) {
            googleMap.accuracyCircle = new google.maps.Circle({
                map: googleMap.map,
                center: { lat, lng },
                radius: accMeters,
                strokeColor: "#10b981",
                strokeOpacity: 0.6,
                strokeWeight: 1.5,
                fillColor: "#10b981",
                fillOpacity: 0.12
            });
        }

        googleMap.userMarker.addListener('dragend', (evt) => {
            const newLat = evt.latLng.lat();
            const newLng = evt.latLng.lng();
            setUserGpsLocation(newLat, newLng, true, null, 'Fine-Tuned Drag');
            showToast(`🎯 Location fine-tuned to [${newLat.toFixed(5)}, ${newLng.toFixed(5)}]`, 'success');
            if (activeTab === 'phase2a') runDijkstraRouting();
        });
    } else if (gisMap && gisMap.map) {
        gisMap.map.setView([lat, lng], 16, { animate: true });

        if (gisMap.userMarker) gisMap.map.removeLayer(gisMap.userMarker);
        if (gisMap.accuracyCircle) gisMap.map.removeLayer(gisMap.accuracyCircle);

        // Draw accuracy circle
        if (accMeters && accMeters > 5 && accMeters < 5000) {
            gisMap.accuracyCircle = L.circle([lat, lng], {
                radius: accMeters,
                color: '#10b981',
                weight: 1.5,
                fillColor: '#10b981',
                fillOpacity: 0.12,
                dashArray: '4, 4'
            }).addTo(gisMap.map);
        }

        // Custom pulsing draggable divIcon
        const gpsPulseIcon = L.divIcon({
            className: 'user-gps-div-icon',
            html: `
                <div class="user-gps-pulse-marker" title="Your GPS Location (Drag to adjust)">
                    <div class="user-gps-pulse-wave"></div>
                    <div class="user-gps-pulse-core"></div>
                </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        gisMap.userMarker = L.marker([lat, lng], {
            icon: gpsPulseIcon,
            draggable: true
        }).addTo(gisMap.map);

        gisMap.userMarker.bindPopup(`
            <div style="min-width: 220px; padding: 4px;">
                <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; padding-bottom: 4px; margin-bottom: 6px;">
                    <b style="color: #34d399; font-size: 13px;">📍 Exact GPS Position</b>
                    <span style="font-size: 10px; background: rgba(16, 185, 129, 0.2); color: #6ee7b7; padding: 1px 6px; border-radius: 8px;">
                        ${isLive ? 'LIVE' : 'CALIBRATED'}
                    </span>
                </div>
                <div style="font-size: 11px; color: #cbd5e1; line-height: 1.4;">
                    <div><b>Latitude:</b> ${lat.toFixed(5)}°N</div>
                    <div><b>Longitude:</b> ${lng.toFixed(5)}°E</div>
                    ${accMeters ? `<div style="color: #38bdf8;"><b>Estimated Accuracy:</b> ±${accMeters}m</div>` : ''}
                    <div style="color: #94a3b8; font-size: 10px; margin-top: 2px;">Provider: ${providerName}</div>
                </div>
                <div style="font-size: 10px; color: #f59e0b; margin: 6px 0; background: rgba(245, 158, 11, 0.1); padding: 4px 6px; border-radius: 4px;">
                    💡 <b>Tip:</b> Drag this green pin to adjust your exact house or doorstep!
                </div>
                <div style="margin-top: 8px; display: flex; gap: 4px;">
                    <button onclick="useCurrentLocationForRouting('source')" style="flex: 1; background: #10b981; border: none; color: white; padding: 5px 6px; border-radius: 4px; font-size: 11px; font-weight: 700; cursor: pointer;">
                        🟢 Set Origin
                    </button>
                    <button onclick="useCurrentLocationForRouting('dest')" style="flex: 1; background: #0284c7; border: none; color: white; padding: 5px 6px; border-radius: 4px; font-size: 11px; font-weight: 700; cursor: pointer;">
                        🏁 Set Dest
                    </button>
                </div>
                <div style="margin-top: 4px;">
                    <button onclick="openExactLocationModal()" style="width: 100%; background: #334155; border: 1px solid #475569; color: #f8fafc; padding: 4px 6px; border-radius: 4px; font-size: 10px; cursor: pointer;">
                        🎯 Type Exact Address / Street
                    </button>
                </div>
            </div>
        `).openPopup();

        // Drag listener for real-time pinpoint precision
        gisMap.userMarker.on('dragend', (e) => {
            const pos = e.target.getLatLng();
            setUserGpsLocation(pos.lat, pos.lng, true, null, 'Fine-Tuned Drag');
            showToast(`🎯 Position fine-tuned to [${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}]`, 'success');
            if (activeTab === 'phase2a') runDijkstraRouting();
        });
    }

    if (window.addTelemetryLog) {
        window.addTelemetryLog('GPS', `Position calibrated: [${lat.toFixed(5)}, ${lng.toFixed(5)}]${accMeters ? ` (±${accMeters}m)` : ''} via ${providerName}`);
    }
}

async function searchMapLocation() {
    const input = document.getElementById('mapSearchInput');
    const query = input?.value?.trim();
    if (!query) return;

    // First check local graph nodes
    const lowerQ = query.toLowerCase();
    const matchedNode = currentGraph.nodes.find(n => 
        (n.label && n.label.toLowerCase().includes(lowerQ)) ||
        (n.id && n.id.toLowerCase().includes(lowerQ))
    );

    if (matchedNode) {
        showToast(`Found hub: ${matchedNode.label}`, 'success');
        if (activeViewMode === 'google' && googleMap && googleMap.isLoaded) {
            googleMap.map.setCenter({ lat: matchedNode.lat, lng: matchedNode.lng });
            googleMap.map.setZoom(15);
        } else if (gisMap && gisMap.map && matchedNode.lat && matchedNode.lng) {
            gisMap.map.setView([matchedNode.lat, matchedNode.lng], 15);
        } else if (cityCanvas) {
            cityCanvas.selectNode(matchedNode.id);
        }
        return;
    }

    // Fallback: Query OpenStreetMap Nominatim for Bengaluru coordinates
    try {
        showToast(`Searching OSM Nominatim for "${query}"...`, 'info');
        const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' Bangalore')}&limit=1`);
        const data = await resp.json();
        if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lng = parseFloat(data[0].lon);
            showToast(`OSM Geocoder: ${data[0].display_name.split(',')[0]}`, 'success');
            setUserGpsLocation(lat, lng, false);
        } else {
            showToast(`Location "${query}" not found in city network.`, 'warning');
        }
    } catch (e) {
        showToast(`Search failed: ${e.message}`, 'error');
    }
}

// =============================================================
// GLOBAL SPATIAL SEARCH ENGINE & REAL-TIME AUTOCOMPLETE
// =============================================================
function setupGlobalSearchEngine() {
    const input = document.getElementById('globalSearchInput');
    const clearBtn = document.getElementById('globalSearchClearBtn');
    const dropdown = document.getElementById('searchSuggestionsBox');

    if (!input || !dropdown) return;

    let selectedIndex = -1;

    function renderSuggestions(query) {
        const q = (query || '').toLowerCase().trim();
        if (!q) {
            dropdown.innerHTML = '';
            dropdown.style.display = 'none';
            if (clearBtn) clearBtn.style.display = 'none';
            return;
        }

        if (clearBtn) clearBtn.style.display = 'block';

        const results = [];

        // 1. Match Hubs / Nodes in current city network
        if (currentGraph && currentGraph.nodes) {
            currentGraph.nodes.forEach(node => {
                const label = (node.label || '').toLowerCase();
                const id = (node.id || '').toLowerCase();
                const type = (node.type || '').toLowerCase();
                const spec = (node.speciality || '').toLowerCase();
                const addr = (node.address || '').toLowerCase();

                if (label.includes(q) || id.includes(q) || type.includes(q) || spec.includes(q) || addr.includes(q)) {
                    let icon = '📍';
                    let typeBadge = (node.type || 'HUB').toUpperCase();
                    if (type.includes('hospital') || id.includes('VIC') || id.startsWith('HSP_')) {
                        icon = '🏥';
                        typeBadge = 'EMERGENCY HOSPITAL';
                    }
                    else if (type.includes('transit') || id.includes('MAJ') || id.includes('SBC')) { icon = '🚇'; typeBadge = 'TRANSIT HUB'; }
                    else if (type.includes('tech') || id.includes('ITPL') || id.includes('EC')) { icon = '🏢'; typeBadge = 'TECH PARK'; }
                    else if (type.includes('water') || id.includes('BWSSB')) { icon = '💧'; typeBadge = 'WATER RESERVOIR'; }
                    else if (type.includes('depot') || id.includes('DEPOT')) { icon = '🚛'; typeBadge = 'MUNICIPAL DEPOT'; }
                    else if (id.includes('SILK')) { icon = '🚦'; typeBadge = 'CRITICAL BOTTLENECK'; }

                    const subInfo = (node.type === 'hospital')
                        ? `${node.speciality ? `🩺 ${node.speciality.split(',')[0].trim()} · ` : ''}🚨 ER: ${node.emergency || '24x7'}`
                        : `ID: ${node.id} · Lat: ${node.lat ? node.lat.toFixed(4) : '--'}, Lng: ${node.lng ? node.lng.toFixed(4) : '--'}`;

                    results.push({
                        kind: 'node',
                        item: node,
                        icon: icon,
                        title: `${node.label || node.id}`,
                        sub: subInfo,
                        badge: typeBadge
                    });
                }
            });
        }

        // 2. Match Corridors / Arterial Roads
        if (currentGraph && currentGraph.edges) {
            currentGraph.edges.forEach(edge => {
                const name = (edge.corridor_name || '').toLowerCase();
                const u = (edge.source || '').toLowerCase();
                const v = (edge.target || '').toLowerCase();
                const mode = (edge.mode || '').toLowerCase();

                if (name.includes(q) || u.includes(q) || v.includes(q) || mode.includes(q)) {
                    let icon = '🛣️';
                    if (edge.mode === 'metro') icon = '🚇';
                    else if (edge.mode === 'water') icon = '💧';

                    results.push({
                        kind: 'edge',
                        item: edge,
                        icon: icon,
                        title: edge.corridor_name || `${edge.source} ↔ ${edge.target}`,
                        sub: `${edge.source} ➔ ${edge.target} · ${edge.weight} km · Congestion factor: ${edge.traffic_factor || 1.0}x`,
                        badge: `CORRIDOR (${(edge.mode || 'ROAD').toUpperCase()})`
                    });
                }
            });
        }

        // 3. Fallback: OpenStreetMap Nominatim Geocoding
        results.push({
            kind: 'osm',
            query: query,
            icon: '🌐',
            title: `Search OpenStreetMap for "${query} Bangalore"`,
            sub: 'Live spatial geocoding query across Bengaluru OSM database',
            badge: 'OSM GEOCODE'
        });

        // Limit results to top 8 items
        const visibleResults = results.slice(0, 8);

        dropdown.innerHTML = visibleResults.map((res, idx) => `
            <div class="search-suggestion-item" data-index="${idx}">
                <span class="suggestion-icon">${res.icon}</span>
                <div class="suggestion-text">
                    <div class="suggestion-title">${res.title}</div>
                    <div class="suggestion-sub">${res.sub}</div>
                </div>
                <span class="suggestion-badge">${res.badge}</span>
            </div>
        `).join('');

        dropdown.style.display = 'block';
        selectedIndex = -1;

        dropdown.querySelectorAll('.search-suggestion-item').forEach(itemEl => {
            itemEl.addEventListener('click', () => {
                const idx = parseInt(itemEl.dataset.index, 10);
                selectSuggestion(visibleResults[idx]);
            });
        });
    }

    async function selectSuggestion(res) {
        if (!res) return;

        dropdown.style.display = 'none';
        dropdown.innerHTML = '';

        if (res.kind === 'node') {
            const node = res.item;
            input.value = `${node.label} (${node.id})`;
            if (clearBtn) clearBtn.style.display = 'block';

            focusOnNode(node);

            // If user is on Phase 2A, smart-fill route dropdown
            const sourceSel = document.getElementById('routeSource');
            const destSel = document.getElementById('routeDest');
            if (activeTab === 'phase2a' && sourceSel) {
                if (!sourceSel.value || sourceSel.value === node.id) {
                    sourceSel.value = node.id;
                } else if (destSel) {
                    destSel.value = node.id;
                }
            }

            showToast(`📍 Located intersection: ${node.label} (${node.id})`, 'success');
            if (window.addTelemetryLog) {
                window.addTelemetryLog('SEARCH', `Focused on node ${node.id} (${node.label}).`);
            }
        } else if (res.kind === 'edge') {
            const edge = res.item;
            input.value = edge.corridor_name || `${edge.source} ↔ ${edge.target}`;
            if (clearBtn) clearBtn.style.display = 'block';

            highlightCorridor(edge);
            showToast(`🛣️ Located corridor: ${edge.corridor_name || edge.source + '-' + edge.target}`, 'info');
            if (window.addTelemetryLog) {
                window.addTelemetryLog('SEARCH', `Corridor selected: ${edge.corridor_name || edge.source + '-' + edge.target}.`);
            }
        } else if (res.kind === 'osm') {
            try {
                showToast(`Searching OSM for "${res.query} Bangalore"...`, 'info');
                const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(res.query + ' Bangalore')}&limit=1`);
                const data = await resp.json();
                if (data && data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lng = parseFloat(data[0].lon);
                    showToast(`OSM Geocoder: ${data[0].display_name.split(',')[0]}`, 'success');
                    setUserGpsLocation(lat, lng, false);
                    if (window.addTelemetryLog) {
                        window.addTelemetryLog('OSM', `Geocoded "${res.query}" to [${lat.toFixed(4)}, ${lng.toFixed(4)}].`);
                    }
                } else {
                    showToast(`No OSM coordinates found for "${res.query}".`, 'warning');
                }
            } catch (err) {
                showToast(`Geocoding error: ${err.message}`, 'error');
            }
        }
    }

    function focusOnNode(node) {
        if (!node) return;
        if (activeViewMode === 'google' && googleMap && googleMap.isLoaded) {
            googleMap.map.panTo({ lat: node.lat, lng: node.lng });
            googleMap.map.setZoom(15);
        } else if (gisMap && gisMap.map && node.lat && node.lng) {
            gisMap.map.setView([node.lat, node.lng], 15);
            if (gisMap.markers) {
                const m = gisMap.markers.get ? gisMap.markers.get(node.id) : gisMap.markers[node.id];
                if (m && m.openPopup) m.openPopup();
            }
        } else if (cityCanvas) {
            cityCanvas.selectNode(node.id);
        }
    }
    window.focusOnNode = focusOnNode;

    function highlightCorridor(edge) {
        if (!edge || !currentGraph || !currentGraph.nodes) return;
        const u = currentGraph.nodes.find(n => n.id === edge.source);
        const v = currentGraph.nodes.find(n => n.id === edge.target);

        if (activeViewMode === 'google' && googleMap && googleMap.isLoaded && u && v && u.lat && v.lat) {
            const bounds = new google.maps.LatLngBounds();
            bounds.extend({ lat: u.lat, lng: u.lng });
            bounds.extend({ lat: v.lat, lng: v.lng });
            googleMap.map.fitBounds(bounds);
        } else if (gisMap && gisMap.map && u && v && u.lat && v.lat) {
            const bounds = L.latLngBounds([[u.lat, u.lng], [v.lat, v.lng]]);
            gisMap.map.fitBounds(bounds, { padding: [50, 50] });
        }
    }

    input.addEventListener('input', () => {
        renderSuggestions(input.value);
    });

    input.addEventListener('focus', () => {
        if (input.value.trim()) renderSuggestions(input.value);
    });

    clearBtn?.addEventListener('click', () => {
        input.value = '';
        clearBtn.style.display = 'none';
        dropdown.innerHTML = '';
        dropdown.style.display = 'none';
        input.focus();
    });

    input.addEventListener('keydown', (e) => {
        const items = dropdown.querySelectorAll('.search-suggestion-item');
        if (!items || items.length === 0) {
            if (e.key === 'Enter') renderSuggestions(input.value);
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % items.length;
            updateActiveItem(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            updateActiveItem(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && selectedIndex < items.length) {
                items[selectedIndex].click();
            } else if (items.length > 0) {
                items[0].click();
            }
        } else if (e.key === 'Escape') {
            dropdown.style.display = 'none';
        }
    });

    function updateActiveItem(items) {
        items.forEach((item, idx) => {
            if (idx === selectedIndex) {
                item.style.backgroundColor = '#1e293b';
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.style.backgroundColor = '';
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.global-search-container')) {
            dropdown.style.display = 'none';
        }
    });
}

// =============================================================
// VEHICLE ROUTE ANIMATION TRIGGER
// =============================================================
window.animateCurrentRoute = function() {
    if (!lastDijkstraResult) {
        showToast('Please calculate a valid route first.', 'warning');
        return;
    }
    const type = lastDijkstraResult.travel_mode || 'car';
    const roadCoords = lastDijkstraResult.road_coords || null;

    if (activeViewMode === 'google' && googleMap && googleMap.isLoaded) {
        googleMap.startRouteAnimation(lastDijkstraResult.path_nodes, type, roadCoords);
    } else if (gisMap) {
        gisMap.startRouteAnimation(lastDijkstraResult.path_nodes, type, roadCoords);
    } else if (cityCanvas) {
        cityCanvas.startRouteAnimation(lastDijkstraResult.path_nodes, type);
    }

    if (roadCoords && roadCoords.length > 1) {
        showToast(`▶ Driving ${type.toUpperCase()} along ${roadCoords.length} road coordinates...`, 'info');
    } else {
        showToast(`▶ Animating route traversal (${lastDijkstraResult.path_nodes.length} hubs)...`, 'info');
    }

    if (window.addTelemetryLog) {
        window.addTelemetryLog('ANIMATION', `Dispatched ${type.toUpperCase()} along ${roadCoords ? `${roadCoords.length} road coordinates` : lastDijkstraResult.path_nodes.join(' ➔ ')}`);
    }
};

// =============================================================
// BENGALURU CAB & RIDE-HAILING DISPATCH SIMULATION & BOOKING
// =============================================================
window.currentCabRide = null;
window.cabSimulationActive = false;
window.cabSimulationTimer = null;

window.selectCabOption = function(el, type, fare, name, emoji) {
    document.querySelectorAll('.cab-option-item').forEach(item => item.classList.remove('selected'));
    if (el) el.classList.add('selected');

    if (!window.currentCabRide) {
        window.currentCabRide = {};
    }
    window.currentCabRide.type = type;
    window.currentCabRide.fare = fare;
    window.currentCabRide.provider = name;
    window.currentCabRide.emoji = emoji;

    const btn = document.getElementById('simulateCabRideBtn');
    if (btn && !window.cabSimulationActive) {
        btn.innerHTML = `<span>🚖</span> <span>Simulate Driver Dispatch & Live Ride (${name} · ₹${fare})</span>`;
    }

    showToast(`Selected ${emoji} ${name} (Est. ₹${fare})`, 'info');
};

window.openBookingProvider = function(provider, url) {
    if (window.addTelemetryLog) {
        window.addTelemetryLog('CAB_BOOKING', `Redirecting to ${provider.toUpperCase()} with pre-filled origin & destination.`);
    }
    showToast(`🚀 Opening ${provider.toUpperCase()} booking interface...`, 'success');
    window.open(url, '_blank', 'noopener,noreferrer');
};

const BENGALURU_CAB_DRIVERS = [
    { name: 'Ramesh Gowda', rating: '4.93', trips: '3,420', car: 'Silver Maruti Dzire', plate: 'KA-04-ME-4821' },
    { name: 'Venkatesh Murthy', rating: '4.89', trips: '2,890', car: 'White Hyundai Xcent', plate: 'KA-01-AJ-8204' },
    { name: 'Manjunath Swamy', rating: '4.95', trips: '4,150', car: 'Silver Toyota Etios', plate: 'KA-05-NB-7291' },
    { name: 'Syed Irfan', rating: '4.91', trips: '1,960', car: 'Grey WagonR CNG', plate: 'KA-03-MM-1940' },
    { name: 'Anand Kumar', rating: '4.97', trips: '5,210', car: 'Bajaj RE Green-Yellow Auto', plate: 'KA-51-AB-3042' }
];

window.simulateCabBookingAndRide = function() {
    if (!lastDijkstraResult) {
        showToast('Please calculate a road route first.', 'warning');
        return;
    }

    const banner = document.getElementById('cabDispatchBanner');
    if (!banner) return;

    if (window.cabSimulationActive) {
        window.stopCabRideSimulation();
        return;
    }

    window.cabSimulationActive = true;
    banner.style.display = 'block';

    const rideInfo = window.currentCabRide || {
        type: 'car',
        fare: 180,
        provider: 'Uber Go / Ola Mini',
        emoji: '🚗'
    };

    const destLabel = lastDijkstraResult.dest_label || 'Destination';
    const originLabel = lastDijkstraResult.source_label || 'Origin';
    const driver = BENGALURU_CAB_DRIVERS[Math.floor(Math.random() * BENGALURU_CAB_DRIVERS.length)];
    const otp = Math.floor(1000 + Math.random() * 9000);

    // Step 1: Broadcasting to nearby drivers
    banner.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 14px; height: 14px; border: 2px solid #f59e0b; border-right-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
            <span><b>📡 Searching nearby ${rideInfo.provider} drivers in Bengaluru...</b></span>
        </div>
    `;

    if (window.addTelemetryLog) {
        window.addTelemetryLog('CAB_SEARCH', `Broadcasting ride request for ${rideInfo.provider} from ${originLabel} to ${destLabel}`);
    }

    // Step 2: Driver Assigned after 750ms
    window.cabSimulationTimer = setTimeout(() => {
        if (!window.cabSimulationActive) return;

        banner.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 6px;">
                <div>
                    <div style="font-weight: 800; color: #34d399; font-size: 12px; display: flex; align-items: center; gap: 5px;">
                        <span>✅</span> <span>DRIVER ASSIGNED & EN-ROUTE</span>
                    </div>
                    <div style="color: #f1f5f9; font-weight: 700; font-size: 12px; margin-top: 2px;">
                        👨‍✈️ ${driver.name} · ⭐ ${driver.rating} (${driver.trips} trips)
                    </div>
                    <div style="color: #94a3b8; font-size: 11px;">
                        ${rideInfo.emoji} ${driver.car} · <b style="color: #cbd5e1;">${driver.plate}</b>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 10px; color: #94a3b8;">SECURE OTP</div>
                    <span class="cab-otp-pill">${otp}</span>
                </div>
            </div>
            <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid rgba(245, 158, 11, 0.2); display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #38bdf8; font-weight: 700; font-size: 11px;">
                    ⏱️ Cab arriving at pickup in 2 mins...
                </span>
                <button class="btn btn-sm btn-outline-danger" onclick="window.stopCabRideSimulation()" style="padding: 2px 8px; font-size: 10px; border-radius: 4px; background: transparent; border: 1px solid #ef4444; color: #f87171; cursor: pointer;">
                    Cancel
                </button>
            </div>
        `;

        if (window.addTelemetryLog) {
            window.addTelemetryLog('CAB_ASSIGNED', `Driver ${driver.name} (${driver.plate}) accepted ride. OTP: ${otp}. Fare: ₹${rideInfo.fare}`);
        }
        showToast(`✅ Driver assigned: ${driver.name} (${driver.plate}) · OTP: ${otp}`, 'success');

        // Step 3: Trip Starts after 1600ms
        window.cabSimulationTimer = setTimeout(() => {
            if (!window.cabSimulationActive) return;

            banner.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;">
                    <div>
                        <div style="font-weight: 800; color: #fbbf24; font-size: 12px; display: flex; align-items: center; gap: 5px;">
                            <span>${rideInfo.emoji}</span> <span>TRIP IN PROGRESS</span>
                        </div>
                        <div style="color: #f1f5f9; font-size: 11.5px; margin-top: 2px;">
                            Cruising along Bengaluru road corridor to <b>${destLabel}</b>
                        </div>
                        <div style="color: #94a3b8; font-size: 10.5px;">
                            Driver: ${driver.name} (${driver.plate}) · Fare: ₹${rideInfo.fare}
                        </div>
                    </div>
                    <div>
                        <button class="btn btn-sm" onclick="window.stopCabRideSimulation()" style="padding: 4px 10px; font-size: 11px; font-weight: 700; border-radius: 4px; background: #ef4444; border: none; color: white; cursor: pointer;">
                            🛑 End Trip
                        </button>
                    </div>
                </div>
            `;

            // Start road animation on active map view!
            const roadCoords = lastDijkstraResult.road_coords || null;
            const animType = (rideInfo.type === 'auto') ? 'auto' : (rideInfo.type === 'bike') ? 'bike' : 'cab';

            if (activeViewMode === 'google' && googleMap && googleMap.isLoaded) {
                googleMap.startRouteAnimation(lastDijkstraResult.path_nodes, animType, roadCoords);
            } else if (gisMap) {
                gisMap.startRouteAnimation(lastDijkstraResult.path_nodes, animType, roadCoords);
            } else if (cityCanvas) {
                cityCanvas.startRouteAnimation(lastDijkstraResult.path_nodes, animType);
            }

            if (window.addTelemetryLog) {
                window.addTelemetryLog('CAB_TRIP', `Cab en-route to ${destLabel}. Navigating ${roadCoords ? `${roadCoords.length} road coordinates` : 'corridor'}...`);
            }
            showToast(`🚀 Trip started with ${driver.name}! Navigating along road corridor...`, 'info');

            const btn = document.getElementById('simulateCabRideBtn');
            if (btn) {
                btn.innerHTML = `<span>🛑</span> <span>Stop Active Cab Ride Simulation</span>`;
            }
        }, 1600);
    }, 750);
};

window.stopCabRideSimulation = function() {
    window.cabSimulationActive = false;
    if (window.cabSimulationTimer) {
        clearTimeout(window.cabSimulationTimer);
        window.cabSimulationTimer = null;
    }

    if (activeViewMode === 'google' && googleMap && googleMap.isLoaded) {
        googleMap.stopAnimation();
    } else if (gisMap) {
        gisMap.stopAnimation();
    } else if (cityCanvas) {
        cityCanvas.stopAnimation();
    }

    const banner = document.getElementById('cabDispatchBanner');
    if (banner) {
        const fare = window.currentCabRide ? window.currentCabRide.fare : 180;
        banner.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <span style="color: #34d399; font-weight: 800; font-size: 12px;">🏁 Ride Completed Safely</span>
                    <div style="font-size: 11px; color: #cbd5e1; margin-top: 1px;">Trip ended at destination. Total fare settled: <b>₹${fare}</b></div>
                </div>
                <button class="btn btn-sm btn-outline-secondary" onclick="this.closest('#cabDispatchBanner').style.display='none'" style="padding: 2px 7px; font-size: 10px; border-radius: 4px; background: transparent; border: 1px solid #475569; color: #94a3b8; cursor: pointer;">
                    ✕ Close
                </button>
            </div>
        `;
    }

    const btn = document.getElementById('simulateCabRideBtn');
    if (btn) {
        const rName = window.currentCabRide ? window.currentCabRide.provider : 'Uber Go';
        const rFare = window.currentCabRide ? window.currentCabRide.fare : 180;
        btn.innerHTML = `<span>🚖</span> <span>Simulate Driver Dispatch & Live Ride (${rName} · ₹${rFare})</span>`;
    }

    if (window.addTelemetryLog) {
        window.addTelemetryLog('CAB_COMPLETE', `Cab ride completed. Destination reached.`);
    }
    showToast('🏁 Cab trip finished successfully!', 'success');
};

// =============================================================
// EMERGENCY MEDICAL FACILITY DISPATCH & NEAREST HOSPITAL ROUTING
// =============================================================
window.findAndRouteToNearestHospital = function() {
    if (!currentGraph || !currentGraph.nodes) {
        showToast("City network not loaded yet.", "warning");
        return;
    }

    const hospitals = currentGraph.nodes.filter(n => n.type === 'hospital');
    if (!hospitals.length) {
        showToast("No emergency hospital facilities found in active network.", "warning");
        return;
    }

    // Determine reference starting location (prefer live GPS)
    let startLat = null;
    let startLng = null;
    let startLabel = "Origin";

    if (window.userGpsCoords && window.userGpsCoords.lat) {
        startLat = window.userGpsCoords.lat;
        startLng = window.userGpsCoords.lng;
        startLabel = "My Current Location";
    } else if (window.customMapOrigin && window.customMapOrigin.lat) {
        startLat = window.customMapOrigin.lat;
        startLng = window.customMapOrigin.lng;
        startLabel = window.customMapOrigin.label || "Custom Pin A";
    } else {
        const srcVal = document.getElementById('routeSource')?.value;
        const srcNode = currentGraph.nodes.find(n => n.id === srcVal);
        if (srcNode && srcNode.lat) {
            startLat = srcNode.lat;
            startLng = srcNode.lng;
            startLabel = srcNode.label || srcNode.id;
        } else {
            // Default to Majestic Kempegowda Central
            startLat = 12.9757;
            startLng = 77.5728;
            startLabel = "Majestic Central";
        }
    }

    // Calculate Haversine distance to each hospital
    const R = 6371.0;
    const toRad = deg => deg * Math.PI / 180;
    let nearestHosp = null;
    let minDistance = Infinity;

    hospitals.forEach(h => {
        if (h.lat && h.lng) {
            const dLat = toRad(h.lat - startLat);
            const dLng = toRad(h.lng - startLng);
            const a = Math.sin(dLat / 2) ** 2 +
                      Math.cos(toRad(startLat)) * Math.cos(toRad(h.lat)) *
                      Math.sin(dLng / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const dist = R * c;
            if (dist < minDistance) {
                minDistance = dist;
                nearestHosp = h;
            }
        }
    });

    if (!nearestHosp) {
        showToast("Could not determine nearest hospital.", "error");
        return;
    }

    // Switch to Phase 2A
    if (activeTab !== 'phase2a') {
        switchTab('phase2a');
    }

    // Set Origin
    const srcSel = document.getElementById('routeSource');
    if (srcSel) {
        if (window.userGpsCoords && window.userGpsCoords.lat) {
            srcSel.value = 'USER_CURRENT_LOCATION';
        } else if (!srcSel.value) {
            srcSel.value = 'BLR_MAJ';
        }
    }

    // Set Destination
    const dstSel = document.getElementById('routeDest');
    if (dstSel) {
        dstSel.value = nearestHosp.id;
    }

    // Set Mode to Emergency Ambulance
    const modeSel = document.getElementById('routeMode');
    if (modeSel) {
        modeSel.value = 'emergency';
    }

    // Alert User & Run Routing
    showToast(`🚑 Nearest Hospital: ${nearestHosp.label} (${minDistance.toFixed(1)} km). Siren priority route active!`, 'success');
    
    // Focus map on the hospital
    if (window.focusOnNode) {
        window.focusOnNode(nearestHosp);
    }

    // Run Dijkstra / Real Road Routing
    runDijkstraRouting();
};

window.dispatchEmergencyToHospital = function(hospitalId) {
    const hosp = (currentGraph.nodes || []).find(n => n.id === hospitalId);
    if (!hosp) return;

    if (activeTab !== 'phase2a') {
        switchTab('phase2a');
    }

    const srcSel = document.getElementById('routeSource');
    if (srcSel && (!srcSel.value || srcSel.value === hospitalId)) {
        if (window.userGpsCoords && window.userGpsCoords.lat) {
            srcSel.value = 'USER_CURRENT_LOCATION';
        } else {
            srcSel.value = 'BLR_MAJ';
        }
    }

    const dstSel = document.getElementById('routeDest');
    if (dstSel) {
        dstSel.value = hospitalId;
    }

    const modeSel = document.getElementById('routeMode');
    if (modeSel) {
        modeSel.value = 'emergency';
    }

    showToast(`🚑 Emergency route to ${hosp.label} activated!`, 'success');
    if (window.focusOnNode) {
        window.focusOnNode(hosp);
    }
    runDijkstraRouting();
};

// =============================================================
// ROUTE PRESETS HELPER
// =============================================================
window.applyRoutePreset = function(src, dst, mode = 'car') {
    switchTab('phase2a');
    const srcSel = document.getElementById('routeSource');
    const dstSel = document.getElementById('routeDest');
    const modeSel = document.getElementById('routeMode');

    if (modeSel && mode) modeSel.value = mode;

    if (src === 'USER_CURRENT_LOCATION') {
        if (!window.userGpsCoords) {
            useCurrentLocationForRouting('source').then(() => {
                if (dstSel) dstSel.value = dst;
                runDijkstraRouting();
            });
            return;
        }
    }

    if (srcSel) srcSel.value = src;
    if (dstSel) dstSel.value = dst;

    runDijkstraRouting();
    showToast(`⚡ Route preset loaded: ${src === 'USER_CURRENT_LOCATION' ? 'My Location' : src} ➔ ${dst} (${mode.toUpperCase()})`, 'success');
};

// =============================================================
// DASHBOARD QUICK COMMAND ACTIONS
// =============================================================
window.quickActionRoute = function() {
    switchTab('phase2a');
    runDijkstraRouting();
    showToast('🚀 Switched to Dynamic Routing Engine', 'info');
};

window.quickActionMST = function() {
    switchTab('phase2b');
    runMST('kruskal');
    showToast('🌲 Switched to Infrastructure MST Optimizer', 'info');
};

window.quickActionSweeper = function() {
    switchTab('phase2c');
    runEulerSweeper();
    showToast('🚛 Switched to Municipal Sweeping Logistics', 'info');
};

window.quickActionPlanarity = function() {
    switchTab('phase1');
    auditTopologyAndPlanarity();
    showToast('📐 Switched to Structural & Planarity Validation', 'info');
};

window.quickActionReport = function() {
    switchTab('phase3');
    showToast('📋 Switched to Engineering Audit Report', 'info');
};

window.printReport = function() {
    window.print();
};

// =============================================================
// LIVE MUNICIPAL TELEMETRY STREAM LOGGING
// =============================================================
window.addTelemetryLog = function(category, message) {
    const feed = document.getElementById('telemetryFeedBody');
    if (!feed) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    let tagClass = 'telemetry-tag-cyan';
    if (category.includes('MATH') || category.includes('SUCCESS') || category.includes('UTILITY')) {
        tagClass = 'telemetry-tag-green';
    } else if (category.includes('TRAFFIC') || category.includes('WARN')) {
        tagClass = 'telemetry-tag-amber';
    } else if (category.includes('ROUTE') || category.includes('SEARCH') || category.includes('ANIMATION')) {
        tagClass = 'telemetry-tag-cyan';
    }

    const row = document.createElement('div');
    row.className = 'telemetry-line';
    row.innerHTML = `
        <span class="telemetry-time">${timeStr}</span>
        <span class="telemetry-msg"><span class="${tagClass}">[${category}]</span> ${message}</span>
    `;
    feed.insertBefore(row, feed.firstChild);

    while (feed.children.length > 25) {
        feed.removeChild(feed.lastChild);
    }
};
