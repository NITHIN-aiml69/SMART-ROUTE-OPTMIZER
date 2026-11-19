/**
 * Smart Urban Multi-Modal Route & Infrastructure Optimizer
 * Interactive Canvas Graph Renderer with Animations & Multi-Layer Overlays
 */

class SmartCityCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Coordinate space and pan/zoom
        this.scale = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.isPanning = false;
        this.startPan = { x: 0, y: 0 };

        // Interaction state
        this.draggedNode = null;
        this.selectedNodeId = null;
        this.sourceNodeId = null;
        this.destNodeId = null;

        // Visual overlays
        this.activeOverlay = 'none'; // 'dijkstra', 'mst', 'euler', 'hamilton', 'crossover'
        this.highlightedEdges = new Set();
        this.highlightedNodes = new Set();
        this.crossoverPoints = [];

        // Animation state
        this.animating = false;
        this.animPath = [];
        this.animStep = 0;
        this.animProgress = 0.0;
        this.animType = null; // 'sweeper', 'patrol', 'pulse'
        this.animTimer = null;

        this.initCanvasSize();
        this.bindEvents();
    }

    initCanvasSize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = (rect.height || 620) * dpr;
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height || 620}px`;
        this.ctx.scale(dpr, dpr);
        this.dpr = dpr;
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.initCanvasSize();
            this.render();
        });

        // Mouse down: node drag or pan
        this.canvas.addEventListener('mousedown', (e) => {
            const pos = this.getMousePos(e);
            const clickedNode = this.findNodeAt(pos.x, pos.y);

            if (clickedNode) {
                this.draggedNode = clickedNode;
            } else {
                this.isPanning = true;
                this.startPan = { x: e.clientX - this.panX, y: e.clientY - this.panY };
            }
        });

        // Mouse move
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.draggedNode) {
                const pos = this.getMousePos(e);
                this.draggedNode.x = Math.round(pos.x);
                this.draggedNode.y = Math.round(pos.y);
                this.render();
                if (window.onNodePositionChanged) window.onNodePositionChanged();
            } else if (this.isPanning) {
                this.panX = e.clientX - this.startPan.x;
                this.panY = e.clientY - this.startPan.y;
                this.render();
            }
        });

        // Mouse up
        window.addEventListener('mouseup', () => {
            this.draggedNode = null;
            this.isPanning = false;
        });

        // Click to select node
        this.canvas.addEventListener('click', (e) => {
            const pos = this.getMousePos(e);
            const clickedNode = this.findNodeAt(pos.x, pos.y);
            if (clickedNode && !this.isPanning) {
                if (window.onNodeClicked) {
                    window.onNodeClicked(clickedNode);
                }
            }
        });

        // Wheel to zoom
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
            const mouse = this.getMousePos(e);

            const newScale = Math.min(Math.max(0.4, this.scale * zoomFactor), 2.5);
            this.panX = mouse.screenX - (mouse.screenX - this.panX) * (newScale / this.scale);
            this.panY = mouse.screenY - (mouse.screenY - this.panY) * (newScale / this.scale);
            this.scale = newScale;
            this.render();
        }, { passive: false });
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        return {
            screenX,
            screenY,
            x: (screenX - this.panX) / this.scale,
            y: (screenY - this.panY) / this.scale
        };
    }

    findNodeAt(x, y) {
        if (!this.graph || !this.graph.nodes) return null;
        const radius = 24;
        for (let i = this.graph.nodes.length - 1; i >= 0; i--) {
            const node = this.graph.nodes[i];
            const dist = Math.hypot(node.x - x, node.y - y);
            if (dist <= radius) return node;
        }
        return null;
    }

    setGraph(graph) {
        this.graph = graph;
        this.nodeMap = new Map((graph.nodes || []).map(n => [n.id, n]));
        this.autoFit();
        this.render();
    }

    autoFit() {
        if (!this.graph || !this.graph.nodes || this.graph.nodes.length === 0) return;
        const rect = this.canvas.getBoundingClientRect();
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        for (const n of this.graph.nodes) {
            minX = Math.min(minX, n.x);
            maxX = Math.max(maxX, n.x);
            minY = Math.min(minY, n.y);
            maxY = Math.max(maxY, n.y);
        }

        const width = maxX - minX || 500;
        const height = maxY - minY || 400;
        const pad = 90;

        const scaleX = (rect.width - pad * 2) / width;
        const scaleY = (rect.height - pad * 2) / height;
        this.scale = Math.min(Math.max(0.65, Math.min(scaleX, scaleY)), 1.25);

        this.panX = (rect.width - (maxX + minX) * this.scale) / 2;
        this.panY = (rect.height - (maxY + minY) * this.scale) / 2;
    }

    resetView() {
        this.autoFit();
        this.render();
    }

    clearHighlights() {
        this.activeOverlay = 'none';
        this.highlightedEdges.clear();
        this.highlightedNodes.clear();
        this.crossoverPoints = [];
        this.stopAnimation();
        this.render();
    }

    setDijkstraOverlay(pathNodes, pathEdges) {
        this.clearHighlights();
        this.activeOverlay = 'dijkstra';
        this.highlightedNodes = new Set(pathNodes);
        for (const e of pathEdges) {
            this.highlightedEdges.add(this.edgeKey(e.u, e.v));
        }
        this.render();
    }

    setMstOverlay(mstEdges) {
        this.clearHighlights();
        this.activeOverlay = 'mst';
        for (const e of mstEdges) {
            this.highlightedEdges.add(this.edgeKey(e.u, e.v));
        }
        this.render();
    }

    setCrossoverOverlay(crossovers) {
        this.clearHighlights();
        this.activeOverlay = 'crossover';
        this.crossoverPoints = crossovers || [];
        this.render();
    }

    edgeKey(u, v) {
        return u < v ? `${u}_${v}` : `${v}_${u}`;
    }

    // Interactive Sweeper / Patrol Animation along path
    startRouteAnimation(nodeSequence, type = 'sweeper') {
        this.stopAnimation();
        if (!nodeSequence || nodeSequence.length < 2) return;

        this.animating = true;
        this.animPath = nodeSequence;
        this.animStep = 0;
        this.animProgress = 0.0;
        this.animType = type;

        const animateLoop = () => {
            if (!this.animating) return;
            this.animProgress += 0.035;
            if (this.animProgress >= 1.0) {
                this.animProgress = 0.0;
                this.animStep++;
                if (this.animStep >= this.animPath.length - 1) {
                    this.animStep = 0; // Loop or end
                }
            }
            this.render();
            this.animTimer = requestAnimationFrame(animateLoop);
        };
        this.animTimer = requestAnimationFrame(animateLoop);
    }

    stopAnimation() {
        this.animating = false;
        if (this.animTimer) {
            cancelAnimationFrame(this.animTimer);
            this.animTimer = null;
        }
    }

    render() {
        if (!this.ctx) return;
        const width = this.canvas.width / this.dpr;
        const height = this.canvas.height / this.dpr;

        this.ctx.clearRect(0, 0, width, height);

        // Grid background effect
        this.drawGridBackground(width, height);

        this.ctx.save();
        this.ctx.translate(this.panX, this.panY);
        this.ctx.scale(this.scale, this.scale);

        if (this.graph) {
            this.drawEdges();
            this.drawCrossovers();
            this.drawNodes();
            this.drawAnimatedVehicle();
        }

        this.ctx.restore();
    }

    drawGridBackground(width, height) {
        this.ctx.save();
        this.ctx.fillStyle = "#0c101d";
        this.ctx.fillRect(0, 0, width, height);

        // Futuristic grid dots
        this.ctx.fillStyle = "rgba(45, 60, 95, 0.25)";
        const gridSize = 40 * this.scale;
        const startX = (this.panX % gridSize);
        const startY = (this.panY % gridSize);

        for (let x = startX; x < width; x += gridSize) {
            for (let y = startY; y < height; y += gridSize) {
                this.ctx.fillRect(x, y, 1.5, 1.5);
            }
        }
        this.ctx.restore();
    }

    drawEdges() {
        if (!this.graph.edges) return;

        for (const edge of this.graph.edges) {
            const u = this.nodeMap.get(edge.u);
            const v = this.nodeMap.get(edge.v);
            if (!u || !v) continue;

            const key = this.edgeKey(edge.u, edge.v);
            const isHighlighted = this.highlightedEdges.has(key);

            let strokeColor = "#334155";
            let lineWidth = 2.5;
            let lineDash = [];

            if (this.activeOverlay === 'mst') {
                if (isHighlighted) {
                    strokeColor = "#10b981"; // Glowing green MST edge
                    lineWidth = 4.5;
                } else {
                    strokeColor = "rgba(100, 116, 139, 0.25)"; // Dimmed loop edge
                    lineWidth = 1.5;
                    lineDash = [4, 4];
                }
            } else if (this.activeOverlay === 'dijkstra') {
                if (isHighlighted) {
                    strokeColor = "#06b6d4"; // Cyan glowing path
                    lineWidth = 5;
                } else {
                    strokeColor = "rgba(71, 85, 105, 0.4)";
                    lineWidth = 2;
                }
            } else {
                // Default mode coloring
                if (edge.mode === "metro") {
                    if (edge.line === "green" || (edge.name && edge.name.includes("Green"))) {
                        strokeColor = "#10b981"; // Emerald Green Line
                    } else if (edge.line === "yellow" || (edge.name && edge.name.includes("Yellow"))) {
                        strokeColor = "#eab308"; // Amber Yellow Line
                    } else if (edge.line === "pink" || (edge.name && edge.name.includes("Pink"))) {
                        strokeColor = "#f43f5e"; // Rose Pink Line
                    } else {
                        strokeColor = "#a855f7"; // Royal Purple Line
                    }
                    lineWidth = 4;
                } else {
                    const traffic = parseFloat(edge.traffic || 1.0);
                    if (traffic >= 2.2) strokeColor = "#ef4444"; // Red (heavy traffic)
                    else if (traffic >= 1.5) strokeColor = "#f59e0b"; // Amber (moderate)
                    else strokeColor = "#475569"; // Normal road
                    lineWidth = 3;
                }
            }

            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.setLineDash(lineDash);
            this.ctx.strokeStyle = strokeColor;
            this.ctx.lineWidth = lineWidth;
            this.ctx.lineCap = "round";

            if (isHighlighted) {
                this.ctx.shadowColor = strokeColor;
                this.ctx.shadowBlur = 10;
            }

            this.ctx.moveTo(u.x, u.y);
            this.ctx.lineTo(v.x, v.y);
            this.ctx.stroke();
            this.ctx.restore();

            // Edge weight badge
            this.drawEdgeBadge(u, v, edge, isHighlighted);
        }
    }

    drawEdgeBadge(u, v, edge, isHighlighted) {
        const midX = (u.x + v.x) / 2;
        const midY = (u.y + v.y) / 2;
        const len = edge.length ? `${edge.length}km` : '';
        const traffic = edge.traffic ? `${edge.traffic}x` : '';
        const label = `${len}${traffic ? ' · ' + traffic : ''}`;

        this.ctx.save();
        this.ctx.font = "10px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        const textWidth = this.ctx.measureText(label).width;

        this.ctx.fillStyle = isHighlighted ? "rgba(15, 23, 42, 0.9)" : "rgba(15, 23, 42, 0.75)";
        this.ctx.strokeStyle = isHighlighted ? (this.activeOverlay === 'mst' ? "#10b981" : "#06b6d4") : "#334155";
        this.ctx.lineWidth = 1;

        const badgeW = textWidth + 10;
        const badgeH = 16;
        this.ctx.beginPath();
        this.ctx.roundRect(midX - badgeW / 2, midY - badgeH / 2, badgeW, badgeH, 4);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = isHighlighted ? "#f8fafc" : "#94a3b8";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(label, midX, midY);
        this.ctx.restore();
    }

    drawCrossovers() {
        if (this.activeOverlay !== 'crossover' || !this.crossoverPoints.length) return;

        this.ctx.save();
        for (const cross of this.crossoverPoints) {
            const u1 = this.nodeMap.get(cross.edge1.u);
            const v1 = this.nodeMap.get(cross.edge1.v);
            const u2 = this.nodeMap.get(cross.edge2.u);
            const v2 = this.nodeMap.get(cross.edge2.v);
            if (!u1 || !v1 || !u2 || !v2) continue;

            // Compute geometric intersection point
            const pt = this.computeIntersectionPt(u1, v1, u2, v2);
            if (pt) {
                this.ctx.beginPath();
                this.ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
                this.ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
                this.ctx.fill();
                this.ctx.strokeStyle = "#ef4444";
                this.ctx.lineWidth = 2.5;
                this.ctx.shadowColor = "#ef4444";
                this.ctx.shadowBlur = 8;
                this.ctx.stroke();

                // Draw X marker
                this.ctx.beginPath();
                this.ctx.moveTo(pt.x - 4, pt.y - 4);
                this.ctx.lineTo(pt.x + 4, pt.y + 4);
                this.ctx.moveTo(pt.x + 4, pt.y - 4);
                this.ctx.lineTo(pt.x - 4, pt.y + 4);
                this.ctx.stroke();
            }
        }
        this.ctx.restore();
    }

    computeIntersectionPt(A, B, C, D) {
        const a1 = B.y - A.y, b1 = A.x - B.x, c1 = a1 * A.x + b1 * A.y;
        const a2 = D.y - C.y, b2 = C.x - D.x, c2 = a2 * C.x + b2 * C.y;
        const det = a1 * b2 - a2 * b1;
        if (Math.abs(det) < 1e-5) return null;
        return {
            x: (b2 * c1 - b1 * c2) / det,
            y: (a1 * c2 - a2 * c1) / det
        };
    }

    getNodeVisualProps(node) {
        const line = (node.line || '').toLowerCase();
        const label = (node.label || '').toLowerCase();
        const type = (node.type || '').toLowerCase();
        const id = (node.id || '').toUpperCase();

        // 1. 🔀 Multi-Line Metro Interchanges (Highest Priority)
        if (line.includes('interchange') || label.includes('interchange') || id === 'BLR_MAJ' || id === 'BLR_RV_RD' || id === 'BLR_CBD' || id === 'MTR_INTER_JAYADEVA') {
            return { color: '#ec4899', lineName: 'Interchange', icon: '🚇' };
        }

        // 2. 🟢 Green Line Metro Stations
        if (line === 'green' || label.includes('green line') || id.startsWith('MTR_G_') || id === 'BLR_NAG' || id === 'BLR_YPR' || id === 'BLR_JAY' || id === 'BLR_BSK' || id === 'BLR_KR_MKT' || id === 'BLR_PEENYA_STN') {
            return { color: '#10b981', lineName: 'Green Line', icon: '🚇' };
        }

        // 3. 🟡 Yellow Line Metro Stations
        if (line === 'yellow' || label.includes('yellow line') || id.startsWith('MTR_Y_') || id === 'BLR_BTM' || id === 'BLR_SILK' || id === 'BLR_EC' || id === 'BLR_BOMMA') {
            return { color: '#eab308', lineName: 'Yellow Line', icon: '🚇' };
        }

        // 4. 🌸 Pink Line Metro Stations
        if (line === 'pink' || label.includes('pink line') || id.startsWith('MTR_PK_') || id === 'BLR_KALENA' || id === 'BLR_IIMB' || id === 'BLR_DAIRY' || id === 'BLR_CANT' || id === 'BLR_NAGAW') {
            return { color: '#f43f5e', lineName: 'Pink Line', icon: '🚇' };
        }

        // 5. 🟣 Purple Line Metro Stations
        if (line === 'purple' || label.includes('purple line') || id.startsWith('MTR_P_') || id === 'BLR_IND' || id === 'BLR_ITPL' || id === 'BLR_HOODI' || type === 'metro_hub') {
            return { color: '#a855f7', lineName: 'Purple Line', icon: '🚇' };
        }

        // 6. Other Urban Infrastructure Facilities
        if (type === 'hospital') return { color: '#ef4444', icon: '🏥' };
        if (type === 'reservoir') return { color: '#06b6d4', icon: '💧' };
        if (type === 'substation') return { color: '#f59e0b', icon: '⚡' };
        if (type === 'depot') return { color: '#059669', icon: '🚛' };
        if (type === 'junction') return { color: '#f97316', icon: '🛑' };
        if (type === 'commercial') return { color: '#3b82f6', icon: '🏢' };
        if (type === 'residential') return { color: '#60a5fa', icon: '🏘️' };

        return { color: '#3b82f6', icon: node.icon || '📍' };
    }

    drawNodes() {
        if (!this.graph.nodes) return;

        for (const node of this.graph.nodes) {
            const isSelected = this.selectedNodeId === node.id;
            const isSource = this.sourceNodeId === node.id;
            const isDest = this.destNodeId === node.id;
            const isHighlighted = this.highlightedNodes.has(node.id);

            const props = this.getNodeVisualProps(node);
            const radius = isSelected || isSource || isDest ? 22 : 18;

            this.ctx.save();
            // Outer glow ring
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            this.ctx.fillStyle = props.color;
            this.ctx.shadowColor = isSource ? "#10b981" : (isDest ? "#ef4444" : props.color);
            this.ctx.shadowBlur = isSelected || isSource || isDest || isHighlighted ? 18 : 8;
            this.ctx.fill();

            // Crisp white perimeter border
            this.ctx.strokeStyle = isSource ? "#10b981" : (isDest ? "#ef4444" : "#ffffff");
            this.ctx.lineWidth = isSelected || isSource || isDest ? 3.5 : 2;
            this.ctx.stroke();
            this.ctx.restore();

            // Draw emoji / icon inside
            this.ctx.save();
            this.ctx.font = "14px 'Segoe UI Emoji', AppleColorEmoji, sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(props.icon || "📍", node.x, node.y);
            this.ctx.restore();

            // Label pill underneath
            this.drawNodeLabel(node, isSource, isDest, isSelected, props);
        }
    }

    drawNodeLabel(node, isSource, isDest, isSelected, props) {
        this.ctx.save();
        this.ctx.font = "bold 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        const label = `${node.id}: ${node.label || node.id}`;
        const width = this.ctx.measureText(label).width;

        const pillW = width + 12;
        const pillH = 18;
        const pillY = node.y + 25;

        const borderColor = props ? props.color : "#475569";
        this.ctx.fillStyle = isSource ? "#065f46" : (isDest ? "#7f1d1d" : (isSelected ? "#1e3a8a" : "rgba(15, 23, 42, 0.92)"));
        this.ctx.strokeStyle = isSource ? "#10b981" : (isDest ? "#ef4444" : borderColor);
        this.ctx.lineWidth = 1.2;

        this.ctx.beginPath();
        this.ctx.roundRect(node.x - pillW / 2, pillY - pillH / 2, pillW, pillH, 4);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = "#f8fafc";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(label, node.x, pillY);
        this.ctx.restore();
    }

    drawAnimatedVehicle() {
        if (!this.animating || !this.animPath.length || this.animStep >= this.animPath.length - 1) return;

        const uId = this.animPath[this.animStep];
        const vId = this.animPath[this.animStep + 1];
        const u = this.nodeMap.get(uId);
        const v = this.nodeMap.get(vId);
        if (!u || !v) return;

        const curX = u.x + (v.x - u.x) * this.animProgress;
        const curY = u.y + (v.y - u.y) * this.animProgress;

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(curX, curY, 14, 0, Math.PI * 2);
        let animEmoji = "🚗";
        let animFill = "#38bdf8";
        if (this.animType === 'sweeper') { animEmoji = "🚛"; animFill = "#f59e0b"; }
        else if (this.animType === 'patrol') { animEmoji = "🚓"; animFill = "#38bdf8"; }
        else if (this.animType === 'emergency') { animEmoji = "🚑"; animFill = "#ef4444"; }
        else if (this.animType === 'cab' || this.animType === 'taxi') { animEmoji = "🚕"; animFill = "#eab308"; }
        else if (this.animType === 'auto') { animEmoji = "🛺"; animFill = "#22c55e"; }
        else if (this.animType === 'bike') { animEmoji = "🛵"; animFill = "#06b6d4"; }
        else if (this.animType === 'metro') { animEmoji = "🚇"; animFill = "#a855f7"; }
        else if (this.animType === 'eco_walk') { animEmoji = "🚶"; animFill = "#10b981"; }

        this.ctx.fillStyle = animFill;
        this.ctx.shadowColor = animFill;
        this.ctx.shadowBlur = 18;
        this.ctx.fill();

        this.ctx.font = "14px 'Segoe UI Emoji', sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(animEmoji, curX, curY);
        this.ctx.restore();
    }
}
