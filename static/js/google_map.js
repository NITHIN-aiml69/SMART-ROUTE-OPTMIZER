/**
 * Smart Urban Multi-Modal Route & Infrastructure Optimizer
 * Google Maps JavaScript API Engine (Bengaluru Real-World Grid)
 */

class GoogleMapsEngine {
    constructor(containerId) {
        this.containerId = containerId;
        this.map = null;
        this.apiKey = null;
        this.isLoaded = false;
        this.trafficLayer = null;
        this.trafficEnabled = true;

        this.markers = new Map();
        this.edgePolylines = new Map();
        this.overlayPolylines = [];
        this.infoWindow = null;

        // Vehicle animation
        this.animVehicleMarker = null;
        this.animTimer = null;
        this.animating = false;

        // Custom Night Mode Styling for futuristic Smart City UI
        this.nightStyle = [
            { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
            { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#4b6878" }] },
            { featureType: "administrative.province", elementType: "geometry.stroke", stylers: [{ color: "#4b6878" }] },
            { featureType: "landscape.man_made", elementType: "geometry.stroke", stylers: [{ color: "#334e87" }] },
            { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#021019" }] },
            { featureType: "poi", elementType: "geometry", stylers: [{ color: "#283d6a" }] },
            { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#6f9ba5" }] },
            { featureType: "poi", elementType: "labels.text.stroke", stylers: [{ color: "#1d2c4d" }] },
            { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ color: "#023e58" }] },
            { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#3C7680" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#304a7d" }] },
            { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#98a5be" }] },
            { featureType: "road", elementType: "labels.text.stroke", stylers: [{ color: "#1d2c4d" }] },
            { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#2c6693" }] },
            { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#255e88" }] },
            { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#b0d5ce" }] },
            { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
            { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e1626" }] },
            { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
            { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
        ];
    }

    /**
     * Dynamically loads the Google Maps JavaScript API script
     */
    loadScript(apiKey) {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.maps) {
                this.isLoaded = true;
                this.apiKey = apiKey;
                resolve();
                return;
            }

            if (!apiKey || apiKey.trim() === '') {
                reject(new Error("No Google Maps API Key provided."));
                return;
            }

            this.apiKey = apiKey.trim();
            const scriptId = 'google-maps-api-script';
            const existingScript = document.getElementById(scriptId);
            if (existingScript) existingScript.remove();

            window.initGoogleMapsCallback = () => {
                this.isLoaded = true;
                resolve();
            };

            const script = document.createElement('script');
            script.id = scriptId;
            script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=geometry&callback=initGoogleMapsCallback`;
            script.async = true;
            script.defer = true;
            script.onerror = (err) => {
                reject(new Error("Failed to load Google Maps script. Please verify your API Key and internet connection."));
            };
            document.head.appendChild(script);
        });
    }

    /**
     * Initializes the Google Maps instance
     */
    initMap(styleType = 'night') {
        const container = document.getElementById(this.containerId);
        if (!container || !window.google || !window.google.maps) return;

        const mapOptions = {
            center: { lat: 12.9650, lng: 77.6200 }, // Bengaluru
            zoom: 12,
            mapTypeId: styleType === 'satellite' ? google.maps.MapTypeId.SATELLITE :
                       styleType === 'hybrid' ? google.maps.MapTypeId.HYBRID :
                       google.maps.MapTypeId.ROADMAP,
            styles: styleType === 'night' ? this.nightStyle : null,
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: true,
            fullscreenControl: false
        };

        this.map = new google.maps.Map(container, mapOptions);
        this.infoWindow = new google.maps.InfoWindow();

        // Enable real-time live traffic layer
        this.trafficLayer = new google.maps.TrafficLayer();
        if (this.trafficEnabled) {
            this.trafficLayer.setMap(this.map);
        }

        this.tempPins = {};
        this.currentRoadCoords = null;

        // Interactive map click listener for road routing
        this.map.addListener('click', (e) => {
            if (window.handleMapClick) {
                window.handleMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
            }
        });
    }

    setMapStyle(styleType) {
        if (!this.map) return;
        if (styleType === 'night') {
            this.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
            this.map.setOptions({ styles: this.nightStyle });
        } else if (styleType === 'roadmap') {
            this.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
            this.map.setOptions({ styles: null });
        } else if (styleType === 'satellite') {
            this.map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
            this.map.setOptions({ styles: null });
        } else if (styleType === 'hybrid') {
            this.map.setMapTypeId(google.maps.MapTypeId.HYBRID);
            this.map.setOptions({ styles: null });
        }
    }

    toggleTraffic(enabled) {
        this.trafficEnabled = enabled;
        if (!this.map || !this.trafficLayer) return;
        this.trafficLayer.setMap(enabled ? this.map : null);
    }

    renderGraph(graph) {
        if (!this.map) return;
        this.graph = graph;
        this.nodeMap = new Map((graph.nodes || []).map(n => [n.id, n]));

        this.clearAll();
        this.drawEdges();
        this.drawNodes();
        this.fitBounds();
    }

    clearAll() {
        this.stopAnimation();
        this.clearOverlay();

        for (const marker of this.markers.values()) {
            marker.setMap(null);
        }
        this.markers.clear();

        for (const item of this.edgePolylines.values()) {
            item.polyline.setMap(null);
        }
        this.edgePolylines.clear();
    }

    fitBounds() {
        if (!this.map || !this.graph || !this.graph.nodes) return;
        const bounds = new google.maps.LatLngBounds();
        let hasCoords = false;

        for (const node of this.graph.nodes) {
            if (node.lat !== undefined && node.lng !== undefined) {
                bounds.extend({ lat: node.lat, lng: node.lng });
                hasCoords = true;
            }
        }
        if (hasCoords) {
            this.map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
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
        for (const node of (this.graph.nodes || [])) {
            if (node.lat === undefined || node.lng === undefined) continue;

            const props = this.getNodeVisualProps(node);

            // SVG custom pin icon with vibrant line fill and glowing perimeter
            const markerSvg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46">
                    <defs>
                        <filter id="glow_${node.id}" x="-30%" y="-30%" width="160%" height="160%">
                            <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="${props.color}" flood-opacity="0.9"/>
                        </filter>
                    </defs>
                    <path d="M18 0 C8 0 0 8 0 18 C0 31.5 18 46 18 46 C18 46 36 31.5 36 18 C36 8 28 0 18 0 Z" fill="${props.color}" stroke="#ffffff" stroke-width="2.5" filter="url(#glow_${node.id})"/>
                    <circle cx="18" cy="18" r="11" fill="rgba(15, 23, 42, 0.45)"/>
                    <text x="18" y="23" font-size="13" text-anchor="middle" fill="#ffffff" font-family="'Segoe UI Emoji', Arial">${props.icon}</text>
                </svg>
            `;

            const marker = new google.maps.Marker({
                position: { lat: node.lat, lng: node.lng },
                map: this.map,
                title: node.label || node.id,
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(markerSvg),
                    scaledSize: new google.maps.Size(36, 46),
                    anchor: new google.maps.Point(18, 46)
                }
            });

            marker.addListener('click', () => {
                const isHosp = (node.type === 'hospital');
                const hospSpeciality = node.speciality ? `<div style="font-size: 11px; color: #f87171; margin-top: 4px; font-weight: 600;">🩺 ${node.speciality}</div>` : '';
                const hospAddress = node.address ? `<div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">📍 ${node.address}</div>` : '';
                const hospEmergency = node.emergency ? `<div style="font-size: 10px; color: #ef4444; margin-top: 2px; font-weight: 700;">🚨 24x7 ER: ${node.emergency} ${node.phone ? `| 📞 ${node.phone.split('/')[0].trim()}` : ''}</div>` : '';
                const hospDispatchBtn = isHosp ? `<button class="btn-gis-action" style="background: #ef4444; color: white; border-color: #ef4444; font-weight: 700;" onclick="dispatchEmergencyToHospital('${node.id}')">🚑 Emergency Dispatch</button>` : '';

                const content = `
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
                `;
                this.infoWindow.setContent(content);
                this.infoWindow.open(this.map, marker);

                if (window.onNodeClicked) window.onNodeClicked(node);
            });

            this.markers.set(node.id, marker);
        }
    }

    drawEdges() {
        for (const edge of (this.graph.edges || [])) {
            const u = this.nodeMap.get(edge.u || edge.source);
            const v = this.nodeMap.get(edge.v || edge.target);
            if (!u || !v || u.lat === undefined || v.lat === undefined) continue;

            const isMetro = edge.mode === "metro";
            const traffic = parseFloat(edge.traffic || 1.0);

            let strokeColor = "#3b82f6";
            let strokeOpacity = 0.85;
            let strokeWeight = 4;

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
                strokeWeight = 4.5;
            } else {
                if (traffic >= 3.0) strokeColor = "#ef4444"; // Severe Silk Board traffic
                else if (traffic >= 2.0) strokeColor = "#f59e0b"; // Heavy
                else strokeColor = "#38bdf8"; // Normal
            }

            const polyline = new google.maps.Polyline({
                path: [{ lat: u.lat, lng: u.lng }, { lat: v.lat, lng: v.lng }],
                geodesic: true,
                strokeColor: strokeColor,
                strokeOpacity: strokeOpacity,
                strokeWeight: strokeWeight,
                map: this.map
            });

            polyline.addListener('click', (e) => {
                const content = `
                    <div class="gis-popup-card">
                        <h4>${edge.name || 'Corridor'}</h4>
                        <span class="gis-popup-badge">${isMetro ? 'METRO RAPID' : 'ROAD CORRIDOR'}</span>
                        <p class="gis-coords">Length: <b>${edge.length} km</b> · Congestion: <b>${edge.traffic}x</b></p>
                        <p class="gis-coords">Cost Estimate: <b>$${Number(edge.cost || edge.length * 100000).toLocaleString()}</b></p>
                    </div>
                `;
                this.infoWindow.setContent(content);
                this.infoWindow.setPosition(e.latLng);
                this.infoWindow.open(this.map);
            });

            const key = u.id < v.id ? `${u.id}_${v.id}` : `${v.id}_${u.id}`;
            this.edgePolylines.set(key, { polyline, edge });
        }
    }

    setTempPin(type, lat, lng, title) {
        if (!this.tempPins) this.tempPins = {};
        if (this.tempPins[type]) {
            this.tempPins[type].setMap(null);
            delete this.tempPins[type];
        }
        if (lat === null || lng === null || lat === undefined || lng === undefined || !this.map) return;
        const isOrigin = type === 'origin';
        const color = isOrigin ? '#10b981' : '#f43f5e';
        const label = isOrigin ? 'A' : 'B';

        const pinSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="36" viewBox="0 0 30 36">
                <path d="M15 0 C6.7 0 0 6.7 0 15 C0 26.2 15 36 15 36 C15 36 30 26.2 30 15 C30 6.7 23.3 0 15 0 Z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
                <circle cx="15" cy="14" r="9" fill="#0f172a"/>
                <text x="15" y="18" font-size="12" font-weight="bold" text-anchor="middle" fill="#ffffff">${label}</text>
            </svg>
        `;

        const marker = new google.maps.Marker({
            position: { lat, lng },
            map: this.map,
            zIndex: 150,
            title: `${isOrigin ? '🟢 Origin (Pin A)' : '🏁 Destination (Pin B)'}: ${title || ''}`,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(pinSvg),
                scaledSize: new google.maps.Size(30, 36),
                anchor: new google.maps.Point(15, 36)
            }
        });

        this.tempPins[type] = marker;
    }

    setDijkstraOverlay(pathNodes, pathEdges, roadCoords = null, originInfo = null, destInfo = null) {
        this.clearOverlay(false);
        const bounds = new google.maps.LatLngBounds();

        // 1. If real road geometry coordinates are provided
        if (roadCoords && roadCoords.length > 1) {
            const pts = roadCoords.map(c => ({ lat: c[0], lng: c[1] }));
            this.currentRoadCoords = pts;

            // Casing polyline
            const casingLine = new google.maps.Polyline({
                path: pts,
                geodesic: true,
                strokeColor: "#0284c7",
                strokeOpacity: 0.85,
                strokeWeight: 9,
                zIndex: 95,
                map: this.map
            });
            this.overlayPolylines.push(casingLine);

            // Core polyline
            const coreLine = new google.maps.Polyline({
                path: pts,
                geodesic: true,
                strokeColor: "#38bdf8",
                strokeOpacity: 1.0,
                strokeWeight: 5,
                zIndex: 100,
                map: this.map
            });
            this.overlayPolylines.push(coreLine);

            pts.forEach(pt => bounds.extend(pt));

            // Origin & Destination pins
            const startPt = pts[0];
            const endPt = pts[pts.length - 1];
            this.setTempPin('origin', startPt.lat, startPt.lng, originInfo?.label || 'Route Origin');
            this.setTempPin('dest', endPt.lat, endPt.lng, destInfo?.label || 'Route Destination');

            this.map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });
            return;
        }

        // 2. Fallback to connecting nodes
        this.currentRoadCoords = null;
        const coords = [];
        for (const nodeId of (pathNodes || [])) {
            const node = this.nodeMap.get(nodeId);
            if (node && node.lat !== undefined) {
                const pt = { lat: node.lat, lng: node.lng };
                coords.push(pt);
                bounds.extend(pt);
            }
        }

        if (coords.length > 1) {
            const glowLine = new google.maps.Polyline({
                path: coords,
                geodesic: true,
                strokeColor: "#06b6d4",
                strokeOpacity: 0.95,
                strokeWeight: 7,
                zIndex: 100,
                map: this.map
            });

            this.overlayPolylines.push(glowLine);
            this.map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
        }
    }

    setMstOverlay(mstEdges) {
        this.clearOverlay();

        for (const edge of mstEdges) {
            const u = this.nodeMap.get(edge.u);
            const v = this.nodeMap.get(edge.v);
            if (!u || !v || u.lat === undefined) continue;

            const mstLine = new google.maps.Polyline({
                path: [{ lat: u.lat, lng: u.lng }, { lat: v.lat, lng: v.lng }],
                geodesic: true,
                strokeColor: "#10b981", // Glowing green for optimized utility pipeline
                strokeOpacity: 0.95,
                strokeWeight: 6,
                zIndex: 90,
                map: this.map
            });
            this.overlayPolylines.push(mstLine);
        }
    }

    clearOverlay(clearPins = true) {
        this.stopAnimation();
        for (const line of this.overlayPolylines) {
            line.setMap(null);
        }
        this.overlayPolylines = [];
        if (clearPins && this.tempPins) {
            for (const key of Object.keys(this.tempPins)) {
                if (this.tempPins[key]) this.tempPins[key].setMap(null);
            }
            this.tempPins = {};
        }
        this.currentRoadCoords = null;
    }

    startRouteAnimation(nodeSequence, type = 'car', roadCoords = null) {
        this.stopAnimation();
        let pathCoords = [];

        if (roadCoords && roadCoords.length > 1) {
            pathCoords = roadCoords.map(c => ({ lat: c[0], lng: c[1] }));
        } else if (this.currentRoadCoords && this.currentRoadCoords.length > 1) {
            pathCoords = this.currentRoadCoords;
        } else if (nodeSequence && nodeSequence.length > 1) {
            for (const nid of nodeSequence) {
                const n = this.nodeMap.get(nid);
                if (n && n.lat !== undefined) {
                    pathCoords.push({ lat: n.lat, lng: n.lng });
                }
            }
        }

        if (pathCoords.length < 2) return;

        this.animating = true;
        let step = 0;
        let progress = 0.0;

        let emoji = '🚗';
        if (type === 'emergency') emoji = '🚑';
        else if (type === 'sweeper') emoji = '🚛';
        else if (type === 'patrol') emoji = '🚓';
        else if (type === 'eco_walk') emoji = '🚶';
        else if (type === 'metro') emoji = '🚇';
        else if (type === 'cab' || type === 'taxi') emoji = '🚕';
        else if (type === 'auto') emoji = '🛺';
        else if (type === 'bike') emoji = '🛵';

        const vehicleSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38">
                <circle cx="19" cy="19" r="17" fill="#0284c7" opacity="0.3"/>
                <circle cx="19" cy="19" r="14" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
                <text x="19" y="24" font-size="16" text-anchor="middle" fill="#ffffff">${emoji}</text>
            </svg>
        `;

        this.animVehicleMarker = new google.maps.Marker({
            position: pathCoords[0],
            map: this.map,
            zIndex: 200,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(vehicleSvg),
                scaledSize: new google.maps.Size(38, 38),
                anchor: new google.maps.Point(19, 19)
            }
        });

        const stepIncrement = pathCoords.length > 50 ? 0.09 : 0.04;

        const animLoop = () => {
            if (!this.animating) return;
            progress += stepIncrement;
            if (progress >= 1.0) {
                progress = 0.0;
                step++;
                if (step >= pathCoords.length - 1) {
                    step = 0;
                }
            }

            const p1 = pathCoords[step];
            const p2 = pathCoords[step + 1];
            if (p1 && p2) {
                const curLat = p1.lat + (p2.lat - p1.lat) * progress;
                const curLng = p1.lng + (p2.lng - p1.lng) * progress;

                if (this.animVehicleMarker) {
                    this.animVehicleMarker.setPosition({ lat: curLat, lng: curLng });
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
        if (this.animVehicleMarker) {
            this.animVehicleMarker.setMap(null);
            this.animVehicleMarker = null;
        }
    }
}
