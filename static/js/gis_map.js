/**
 * Smart Urban Multi-Modal Route & Infrastructure Optimizer
 * Real-World Leaflet GIS Mapping Engine (Bengaluru Smart Grid)
 * Features: Multi-CDN dynamic loading, authentic OpenStreetMap tiles, CartoDB Dark & Esri Satellite layers.
 */

class BangaloreGisMap {
    constructor(containerId) {
        this.containerId = containerId;
        this.map = null;
        this.markers = new Map();
        this.edgePolylines = new Map();
        this.activeOverlay = 'none';

        // Animated vehicle marker
        this.animVehicleMarker = null;
        this.animTimer = null;
        this.animating = false;

        // Tile layers & groups
        this.baseLayers = {};
        this.edgeGroup = null;
        this.markerGroup = null;
        this.overlayGroup = null;

        this.initMap();
    }

    async ensureLeafletLoaded() {
        if (typeof L !== 'undefined') return true;

        console.log("Leaflet not yet in memory. Dynamically loading Leaflet GIS assets...");

        // Ensure Leaflet CSS is present
        if (!document.querySelector('link[href*="leaflet"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
            link.crossOrigin = '';
            document.head.appendChild(link);
        }

        const cdns = [
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js',
            'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
            'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js'
        ];

        for (const url of cdns) {
            try {
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = url;
                    script.crossOrigin = '';
                    script.onload = () => resolve();
                    script.onerror = () => reject(new Error('Failed CDN ' + url));
                    document.head.appendChild(script);
                });
                if (typeof L !== 'undefined') {
                    console.log("Leaflet successfully loaded via", url);
                    return true;
                }
            } catch (err) {
                console.warn(err.message);
            }
        }
        return typeof L !== 'undefined';
    }

    async initMap() {
        if (this.map) return true;

        const isLoaded = await this.ensureLeafletLoaded();
        if (!isLoaded || typeof L === 'undefined') {
            console.error("Leaflet library failed to load across all CDNs.");
            return false;
        }

        const container = document.getElementById(this.containerId);
        if (!container) {
            console.warn("Leaflet container element not found:", this.containerId);
            return false;
        }

        // Avoid 'Map container is already initialized' error
        if (container._leaflet_id) {
            container._leaflet_id = null;
        }

        try {
            // Initialize centered on Bengaluru (KR Market / MG Road)
            this.map = L.map(this.containerId, {
                center: [12.9716, 77.5946],
                zoom: 12,
                zoomControl: false,
                attributionControl: true
            });

            // Zoom control top right
            L.control.zoom({ position: 'topright' }).addTo(this.map);

            // Layer 1: Authentic OpenStreetMap Standard (Primary & Global)
            const osmStandard = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
            });

            // Layer 2: CartoDB Dark Matter (Cyber Sci-Fi)
            const cartoDark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 19,
                subdomains: 'abcd',
                attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
            });

            // Layer 3: Esri World Imagery (High-Res Satellite)
            const esriSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                maxZoom: 19,
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics'
            });

            // Add OpenStreetMap Standard as the default visible layer
            osmStandard.addTo(this.map);

            // Layer Switcher in top right
            this.baseLayers = {
                "🌍 OpenStreetMap Standard": osmStandard,
                "🌑 Cyber Dark (CartoDB)": cartoDark,
                "🛰️ Satellite (Esri)": esriSatellite
            };
            L.control.layers(this.baseLayers, null, { position: 'topright', collapsed: false }).addTo(this.map);

            // Feature groups
            this.edgeGroup = L.featureGroup().addTo(this.map);
            this.markerGroup = L.featureGroup().addTo(this.map);
            this.overlayGroup = L.featureGroup().addTo(this.map);
            this.tempPins = {};
            this.currentRoadCoords = null;

            // Interactive map click listener for road routing
            this.map.on('click', (e) => {
                if (window.handleMapClick) {
                    window.handleMapClick(e.latlng);
                }
            });

            // Invalidate size once rendered
            setTimeout(() => {
                if (this.map) this.map.invalidateSize();
            }, 250);

            return true;
        } catch (err) {
            console.error("Leaflet map initialization error:", err);
            return false;
        }
    }

    async renderGraph(graph) {
        if (!this.map) {
            const ok = await this.initMap();
            if (!ok || !this.map) return;
        }

        this.graph = graph;
        this.nodeMap = new Map((graph.nodes || []).map(n => [n.id, n]));

        this.clearAll();
        this.drawEdges();
        this.drawNodes();
        this.fitBounds();

        // Refresh container dimensions
        setTimeout(() => {
            if (this.map) this.map.invalidateSize();
        }, 150);
    }

    clearAll() {
        this.stopAnimation();
        if (this.edgeGroup) this.edgeGroup.clearLayers();
        if (this.markerGroup) this.markerGroup.clearLayers();
        if (this.overlayGroup) this.overlayGroup.clearLayers();
        this.markers.clear();
        this.edgePolylines.clear();
        this.activeOverlay = 'none';
    }

    fitBounds() {
        if (!this.map || !this.graph || !this.graph.nodes) return;
        const validCoords = this.graph.nodes
            .filter(n => n.lat !== undefined && n.lng !== undefined)
            .map(n => [n.lat, n.lng]);

        if (validCoords.length > 0) {
            this.map.fitBounds(L.latLngBounds(validCoords), { padding: [40, 40] });
        }
    }

    getNodeVisualProps(node) {
        const line = (node.line || '').toLowerCase();
        const label = (node.label || '').toLowerCase();
        const type = (node.type || '').toLowerCase();
        const id = (node.id || '').toUpperCase();

        // 1. 🔀 Multi-Line Metro Interchanges (Highest Priority)
        if (line.includes('interchange') || label.includes('interchange') || id === 'BLR_MAJ' || id === 'BLR_RV_RD' || id === 'BLR_CBD' || id === 'MTR_INTER_JAYADEVA') {
            return {
                color: '#ec4899',
                lineName: 'Metro Interchange',
                badgeText: '🔄 METRO INTERCHANGE',
                icon: '🚇',
                badgeBg: 'rgba(236, 72, 153, 0.2)'
            };
        }

        // 2. 🟢 Green Line Metro Stations
        if (line === 'green' || label.includes('green line') || id.startsWith('MTR_G_') || id === 'BLR_NAG' || id === 'BLR_YPR' || id === 'BLR_JAY' || id === 'BLR_BSK' || id === 'BLR_KR_MKT' || id === 'BLR_PEENYA_STN') {
            return {
                color: '#10b981',
                lineName: 'Green Line',
                badgeText: '🟢 METRO GREEN LINE',
                icon: '🚇',
                badgeBg: 'rgba(16, 185, 129, 0.2)'
            };
        }

        // 3. 🟡 Yellow Line Metro Stations
        if (line === 'yellow' || label.includes('yellow line') || id.startsWith('MTR_Y_') || id === 'BLR_BTM' || id === 'BLR_SILK' || id === 'BLR_EC' || id === 'BLR_BOMMA') {
            return {
                color: '#eab308',
                lineName: 'Yellow Line',
                badgeText: '🟡 METRO YELLOW LINE',
                icon: '🚇',
                badgeBg: 'rgba(234, 179, 8, 0.2)'
            };
        }

        // 4. 🌸 Pink Line Metro Stations
        if (line === 'pink' || label.includes('pink line') || id.startsWith('MTR_PK_') || id === 'BLR_KALENA' || id === 'BLR_IIMB' || id === 'BLR_DAIRY' || id === 'BLR_CANT' || id === 'BLR_NAGAW') {
            return {
                color: '#f43f5e',
                lineName: 'Pink Line',
                badgeText: '🌸 METRO PINK LINE',
                icon: '🚇',
                badgeBg: 'rgba(244, 63, 94, 0.2)'
            };
        }

        // 5. 🟣 Purple Line Metro Stations
        if (line === 'purple' || label.includes('purple line') || id.startsWith('MTR_P_') || id === 'BLR_IND' || id === 'BLR_ITPL' || id === 'BLR_HOODI' || type === 'metro_hub') {
            return {
                color: '#a855f7',
                lineName: 'Purple Line',
                badgeText: '🟣 METRO PURPLE LINE',
                icon: '🚇',
                badgeBg: 'rgba(168, 85, 247, 0.2)'
            };
        }

        // 6. Other Urban Infrastructure Facilities
        if (type === 'hospital') {
            return { color: '#ef4444', lineName: 'Hospital', badgeText: '🏥 MEDICAL CENTER', icon: '🏥', badgeBg: 'rgba(239, 68, 68, 0.2)' };
        }
        if (type === 'reservoir') {
            return { color: '#06b6d4', lineName: 'Water Utility', badgeText: '💧 WATER RESERVOIR', icon: '💧', badgeBg: 'rgba(6, 182, 212, 0.2)' };
        }
        if (type === 'substation') {
            return { color: '#f59e0b', lineName: 'Power Grid', badgeText: '⚡ POWER SUBSTATION', icon: '⚡', badgeBg: 'rgba(245, 158, 11, 0.2)' };
        }
        if (type === 'depot') {
            return { color: '#059669', lineName: 'Fleet Depot', badgeText: '🚛 MUNICIPAL DEPOT', icon: '🚛', badgeBg: 'rgba(5, 150, 105, 0.2)' };
        }
        if (type === 'junction') {
            return { color: '#f97316', lineName: 'Junction', badgeText: '🛑 TRAFFIC CORRIDOR', icon: '🛑', badgeBg: 'rgba(249, 115, 22, 0.2)' };
        }
        if (type === 'commercial') {
            return { color: '#3b82f6', lineName: 'Commercial', badgeText: '🏢 TECH & BUSINESS', icon: '🏢', badgeBg: 'rgba(59, 130, 246, 0.2)' };
        }
        if (type === 'residential') {
            return { color: '#60a5fa', lineName: 'Residential', badgeText: '🏘️ RESIDENTIAL HUB', icon: '🏘️', badgeBg: 'rgba(96, 165, 250, 0.2)' };
        }

        return { color: '#3b82f6', lineName: 'Hub', badgeText: (node.type || 'HUB').toUpperCase(), icon: node.icon || '📍', badgeBg: 'rgba(59, 130, 246, 0.2)' };
    }

    drawNodes() {
        if (!this.markerGroup) return;

        for (const node of (this.graph.nodes || [])) {
            if (node.lat === undefined || node.lng === undefined) continue;

            const props = this.getNodeVisualProps(node);

            // Custom DivIcon with vibrant fill, white ring, and glowing line color
            const customIcon = L.divIcon({
                className: 'gis-custom-node',
                html: `
                    <div class="gis-node-marker" style="--node-glow: ${props.color}; background: ${props.color}; border: 2.5px solid #ffffff; box-shadow: 0 0 16px ${props.color}, 0 2px 6px rgba(0,0,0,0.5);">
                        <span class="gis-node-icon" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.8)); font-size: 15px;">${props.icon}</span>
                        <div class="gis-node-tag" style="border-color: ${props.color}; background: #0f172a; color: #f8fafc; font-weight: 700;">${node.id}</div>
                    </div>
                `,
                iconSize: [36, 36],
                iconAnchor: [18, 18]
            });

            const marker = L.marker([node.lat, node.lng], { icon: customIcon });

            // Popup with real-world infrastructure details and metro line tag
            const isHosp = (node.type === 'hospital');
            const hospSpeciality = node.speciality ? `<div style="font-size: 11px; color: #f87171; margin-top: 4px; font-weight: 600;">🩺 ${node.speciality}</div>` : '';
            const hospAddress = node.address ? `<div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">📍 ${node.address}</div>` : '';
            const hospEmergency = node.emergency ? `<div style="font-size: 10px; color: #ef4444; margin-top: 2px; font-weight: 700;">🚨 24x7 ER: ${node.emergency} ${node.phone ? `| 📞 ${node.phone.split('/')[0].trim()}` : ''}</div>` : '';
            const hospDispatchBtn = isHosp ? `<button class="btn-gis-action" style="background: #ef4444; color: white; border-color: #ef4444; font-weight: 700;" onclick="dispatchEmergencyToHospital('${node.id}')">🚑 Emergency Dispatch</button>` : '';

            marker.bindPopup(`
                <div class="gis-popup-card">
                    <h4>${props.icon} ${node.label || node.id}</h4>
                    <span class="gis-popup-badge" style="background: ${props.badgeBg}; border: 1px solid ${props.color}; color: ${props.color}; font-weight: 700;">
                        ${props.badgeText}
                    </span>
                    ${hospSpeciality}
                    ${hospAddress}
                    ${hospEmergency}
                    <p class="gis-coords">📍 GPS: ${node.lat.toFixed(4)}°N, ${node.lng.toFixed(4)}°E</p>
                    <div class="gis-popup-actions">
                        ${hospDispatchBtn}
                        <button class="btn-gis-action" onclick="setGisRouteNode('${node.id}', 'source')">Set as Origin</button>
                        <button class="btn-gis-action" onclick="setGisRouteNode('${node.id}', 'dest')">Set as Destination</button>
                    </div>
                </div>
            `);

            marker.on('click', () => {
                if (window.onNodeClicked) window.onNodeClicked(node);
            });

            this.markerGroup.addLayer(marker);
            this.markers.set(node.id, marker);
        }
    }

    drawEdges() {
        if (!this.edgeGroup) return;

        for (const edge of (this.graph.edges || [])) {
            const u = this.nodeMap.get(edge.u || edge.source);
            const v = this.nodeMap.get(edge.v || edge.target);
            if (!u || !v || u.lat === undefined || v.lat === undefined) continue;

            const isMetro = edge.mode === "metro";
            const traffic = parseFloat(edge.traffic || 1.0);

            let strokeColor = "#475569";
            let dashArray = null;
            let weight = 3.5;

            if (isMetro) {
                if (edge.line === "green" || (edge.name && edge.name.includes("Green"))) {
                    strokeColor = "#10b981"; // Emerald Green Line
                } else if (edge.line === "yellow" || (edge.name && edge.name.includes("Yellow"))) {
                    strokeColor = "#eab308"; // Amber Yellow Line
                } else if (edge.line === "pink" || (edge.name && edge.name.includes("Pink"))) {
                    strokeColor = "#f43f5e"; // Rose Pink Line
                } else {
                    strokeColor = "#a855f7"; // Royal Purple Line
                }
                dashArray = "6, 6";
                weight = 4.5;
            } else {
                if (traffic >= 3.0) strokeColor = "#ef4444"; // Heavy Silk Board traffic
                else if (traffic >= 2.0) strokeColor = "#f59e0b"; // Moderate congestion
                else strokeColor = "#3b82f6"; // Free flowing arterial
            }

            const polyline = L.polyline([[u.lat, u.lng], [v.lat, v.lng]], {
                color: strokeColor,
                weight: weight,
                opacity: 0.85,
                dashArray: dashArray,
                lineCap: 'round'
            });

            polyline.bindTooltip(`
                <b>${edge.name || 'Corridor'}</b><br>
                Length: ${edge.length} km | Congestion: ${edge.traffic}x<br>
                ${edge.aqi ? `Air Quality: AQI ${edge.aqi}<br>` : ''}
                Estimated Cost: $${Number(edge.cost || edge.length * 100000).toLocaleString()}
            `, { sticky: true, className: 'gis-tooltip' });

            this.edgeGroup.addLayer(polyline);
            const key = this.edgeKey(edge.u || edge.source, edge.v || edge.target);
            this.edgePolylines.set(key, { polyline, edge });
        }
    }

    edgeKey(u, v) {
        return u < v ? `${u}_${v}` : `${v}_${u}`;
    }

    setTempPin(type, lat, lng, title) {
        if (!this.tempPins) this.tempPins = {};
        if (this.tempPins[type] && this.overlayGroup) {
            this.overlayGroup.removeLayer(this.tempPins[type]);
            delete this.tempPins[type];
        }
        if (lat === null || lng === null || lat === undefined || lng === undefined) return;
        const isOrigin = type === 'origin';
        const pinIcon = L.divIcon({
            className: 'gis-pin-marker',
            html: `<div class="route-map-pin ${isOrigin ? 'pin-origin' : 'pin-dest'}" title="${title || ''}">${isOrigin ? 'A' : 'B'}</div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 28]
        });
        const marker = L.marker([lat, lng], { icon: pinIcon }).bindPopup(`<b>${isOrigin ? '🟢 Origin (Pin A)' : '🏁 Destination (Pin B)'}</b><br>${title || ''}`);
        if (this.overlayGroup) {
            this.overlayGroup.addLayer(marker);
            this.tempPins[type] = marker;
        }
    }

    setDijkstraOverlay(pathNodes, pathEdges, roadCoords = null, originInfo = null, destInfo = null) {
        this.clearOverlay(false); // clear route lines without wiping user-placed pins prematurely
        this.activeOverlay = 'dijkstra';

        // 1. If real road geometry coordinates are provided from OSRM / Maps
        if (roadCoords && roadCoords.length > 1 && this.overlayGroup) {
            this.currentRoadCoords = roadCoords;

            // Outer road casing (navy/dark blue border for contrast)
            const roadCasing = L.polyline(roadCoords, {
                color: "#0284c7",
                weight: 9,
                opacity: 0.85,
                lineCap: 'round',
                lineJoin: 'round',
                className: 'gis-road-casing'
            });

            // Inner luminous road core (cyan high-visibility)
            const roadCore = L.polyline(roadCoords, {
                color: "#38bdf8",
                weight: 5,
                opacity: 1.0,
                lineCap: 'round',
                lineJoin: 'round',
                className: 'gis-road-core'
            });

            this.overlayGroup.addLayer(roadCasing);
            this.overlayGroup.addLayer(roadCore);

            // Add Origin & Destination Pins on the road endpoints
            const startPt = roadCoords[0];
            const endPt = roadCoords[roadCoords.length - 1];
            this.setTempPin('origin', startPt[0], startPt[1], originInfo?.label || 'Route Origin');
            this.setTempPin('dest', endPt[0], endPt[1], destInfo?.label || 'Route Destination');

            if (this.map) {
                this.map.fitBounds(roadCasing.getBounds(), { padding: [55, 55], maxZoom: 16 });
            }
            return;
        }

        // 2. Fallback to connecting nodes
        this.currentRoadCoords = null;
        const latLngs = [];
        for (const nodeId of (pathNodes || [])) {
            const node = this.nodeMap.get(nodeId);
            if (node && node.lat !== undefined) {
                latLngs.push([node.lat, node.lng]);
            }
        }

        if (latLngs.length > 1 && this.overlayGroup) {
            const glowPath = L.polyline(latLngs, {
                color: "#06b6d4",
                weight: 7,
                opacity: 0.95,
                className: 'gis-dijkstra-glow'
            });

            this.overlayGroup.addLayer(glowPath);
            if (this.map) this.map.fitBounds(glowPath.getBounds(), { padding: [50, 50] });
        }
    }

    setMstOverlay(mstEdges) {
        this.clearOverlay();
        this.activeOverlay = 'mst';

        if (!this.overlayGroup) return;

        for (const edge of mstEdges) {
            const u = this.nodeMap.get(edge.u);
            const v = this.nodeMap.get(edge.v);
            if (!u || !v || u.lat === undefined) continue;

            const mstLine = L.polyline([[u.lat, u.lng], [v.lat, v.lng]], {
                color: "#10b981", // Glowing green for optimized utility pipeline
                weight: 6,
                opacity: 0.95,
                className: 'gis-mst-glow'
            });
            this.overlayGroup.addLayer(mstLine);
        }
    }

    clearOverlay(clearPins = true) {
        this.stopAnimation();
        if (this.overlayGroup) this.overlayGroup.clearLayers();
        if (clearPins) {
            this.tempPins = {};
        }
        this.currentRoadCoords = null;
        this.activeOverlay = 'none';
    }

    // Vehicle animation along real GPS road corridors
    startRouteAnimation(nodeSequence, type = 'car', roadCoords = null) {
        this.stopAnimation();
        if (!this.overlayGroup) return;

        // Determine coordinates to drive along: prefer high-res road network coordinates!
        let coordsToFollow = [];
        if (roadCoords && roadCoords.length > 1) {
            coordsToFollow = roadCoords.map(c => ({ lat: c[0], lng: c[1] }));
        } else if (this.currentRoadCoords && this.currentRoadCoords.length > 1) {
            coordsToFollow = this.currentRoadCoords.map(c => ({ lat: c[0], lng: c[1] }));
        } else if (nodeSequence && nodeSequence.length > 1) {
            for (const nid of nodeSequence) {
                const n = this.nodeMap.get(nid);
                if (n && n.lat !== undefined) {
                    coordsToFollow.push({ lat: n.lat, lng: n.lng });
                }
            }
        }

        if (coordsToFollow.length < 2) return;

        this.animating = true;
        let step = 0;
        let progress = 0.0;

        // Select vehicle icon based on transit mode
        let emoji = '🚗';
        if (type === 'emergency') emoji = '🚑';
        else if (type === 'sweeper') emoji = '🚛';
        else if (type === 'patrol') emoji = '🚓';
        else if (type === 'eco_walk') emoji = '🚶';
        else if (type === 'metro') emoji = '🚇';
        else if (type === 'cab' || type === 'taxi') emoji = '🚕';
        else if (type === 'auto') emoji = '🛺';
        else if (type === 'bike') emoji = '🛵';

        const vehicleIcon = L.divIcon({
            className: 'gis-vehicle-icon',
            html: `<div class="gis-vehicle-marker" title="${type}">${emoji}</div>`,
            iconSize: [34, 34],
            iconAnchor: [17, 17]
        });

        this.animVehicleMarker = L.marker([coordsToFollow[0].lat, coordsToFollow[0].lng], { icon: vehicleIcon }).addTo(this.overlayGroup);

        // Adjust speed depending on waypoint density (road coordinates have higher density)
        const stepIncrement = coordsToFollow.length > 50 ? 0.09 : 0.04;

        const animLoop = () => {
            if (!this.animating) return;
            progress += stepIncrement;
            if (progress >= 1.0) {
                progress = 0.0;
                step++;
                if (step >= coordsToFollow.length - 1) {
                    step = 0; // Loop continuous transit
                }
            }

            const p1 = coordsToFollow[step];
            const p2 = coordsToFollow[step + 1];
            if (p1 && p2) {
                const curLat = p1.lat + (p2.lat - p1.lat) * progress;
                const curLng = p1.lng + (p2.lng - p1.lng) * progress;

                if (this.animVehicleMarker) {
                    this.animVehicleMarker.setLatLng([curLat, curLng]);
                }
            }

            this.animTimer = requestAnimationFrame(animLoop);
        };
        this.animTimer = requestAnimationFrame(animLoop);
    }

    stopAnimation() {
        this.animating = false;
        if (this.animTimer) {
            cancelAnimationFrame(this.animTimer);
            this.animTimer = null;
        }
        if (this.animVehicleMarker && this.overlayGroup) {
            this.overlayGroup.removeLayer(this.animVehicleMarker);
            this.animVehicleMarker = null;
        }
    }
}

// Global hook for popup action buttons
window.setGisRouteNode = function(nodeId, role) {
    if (role === 'source') {
        const sSel = document.getElementById('routeSource');
        if (sSel) sSel.value = nodeId;
    } else {
        const dSel = document.getElementById('routeDest');
        if (dSel) dSel.value = nodeId;
    }
    if (window.switchTab) window.switchTab('phase2a');
    if (window.runDijkstraRouting) window.runDijkstraRouting();
};
