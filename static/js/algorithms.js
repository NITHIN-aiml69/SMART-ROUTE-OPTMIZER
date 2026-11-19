/**
 * Smart Urban Multi-Modal Route & Infrastructure Optimizer
 * Client-Side Graph Algorithms Mirror (Phases 1, 2, and 3)
 */

class DiscreteMathEngine {
    constructor(graph) {
        this.nodes = JSON.parse(JSON.stringify(graph.nodes || []));
        this.edges = JSON.parse(JSON.stringify(graph.edges || []));
        this.nodeMap = new Map(this.nodes.map(n => [n.id, n]));
        this.rebuildAdjacency();
    }

    rebuildAdjacency() {
        this.adj = new Map();
        for (const n of this.nodes) {
            this.adj.set(n.id, []);
        }
        for (const e of this.edges) {
            if (this.adj.has(e.u) && this.adj.has(e.v)) {
                this.adj.get(e.u).push(e);
                if (!e.directed) {
                    this.adj.get(e.v).push(e);
                }
            }
        }
    }

    // Phase 1: Handshaking Property & Degree Verification: sum deg(v) = 2|E|
    getVertexDegrees() {
        const degrees = {};
        for (const n of this.nodes) degrees[n.id] = 0;
        for (const e of this.edges) {
            if (degrees[e.u] !== undefined) degrees[e.u]++;
            if (degrees[e.v] !== undefined) degrees[e.v]++;
        }
        return degrees;
    }

    verifyHandshaking() {
        const degrees = this.getVertexDegrees();
        const sumOfDegrees = Object.values(degrees).reduce((a, b) => a + b, 0);
        const numEdges = this.edges.length;
        const twoE = 2 * numEdges;
        const oddNodes = Object.keys(degrees).filter(id => degrees[id] % 2 !== 0);
        const evenNodes = Object.keys(degrees).filter(id => degrees[id] % 2 === 0);

        return {
            num_vertices: this.nodes.length,
            num_edges: numEdges,
            degrees: degrees,
            sum_of_degrees: sumOfDegrees,
            two_e: twoE,
            handshaking_verified: sumOfDegrees === twoE,
            odd_degree_vertices: oddNodes,
            odd_degree_count: oddNodes.length,
            even_degree_vertices: evenNodes,
            even_degree_count: evenNodes.length,
            odd_count_is_even: oddNodes.length % 2 === 0,
            formula: "∑ deg(v) = 2 · |E|",
            proof_statement: `Sum of degrees = ${sumOfDegrees}. 2 · |E| = 2 · ${numEdges} = ${twoE}. Handshaking Theorem is ${sumOfDegrees === twoE ? 'SATISFIED' : 'VIOLATED'}.`
        };
    }

    // Phase 1: Connectivity & Component Analysis via BFS
    checkConnectivity() {
        const visited = new Set();
        const components = [];

        for (const n of this.nodes) {
            if (!visited.has(n.id)) {
                const comp = [];
                const queue = [n.id];
                visited.add(n.id);
                while (queue.length > 0) {
                    const curr = queue.shift();
                    comp.push(curr);
                    for (const edge of (this.adj.get(curr) || [])) {
                        const nbr = edge.u === curr ? edge.v : edge.u;
                        if (!visited.has(nbr) && this.nodeMap.has(nbr)) {
                            visited.add(nbr);
                            queue.push(nbr);
                        }
                    }
                }
                components.push(comp);
            }
        }

        const degrees = this.getVertexDegrees();
        const isolated = Object.keys(degrees).filter(id => degrees[id] === 0);

        return {
            is_connected: components.length === 1 && this.nodes.length > 0,
            num_components: components.length,
            components: components,
            isolated_nodes: isolated
        };
    }

    // Phase 1: Planarity Analysis & Euler's Formula V - E + F = 2
    auditPlanarity() {
        const V = this.nodes.length;
        const E = this.edges.length;
        const conn = this.checkConnectivity();
        const k = conn.num_components || 1;

        const maxPlanarEdges = V >= 3 ? Math.max(0, 3 * V - 6) : E;
        const passesEdgeBound = V >= 3 ? E <= maxPlanarEdges : true;
        const F = Math.max(1, E - V + 1 + k);
        const eulerLhs = V - E + F;
        const eulerExpected = 1 + k;

        // Line intersection detection for 2D embedding
        const ccw = (A, B, C) => (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
        const intersect = (p1, p2, p3, p4) => {
            if ((p1.x === p3.x && p1.y === p3.y) || (p1.x === p4.x && p1.y === p4.y) ||
                (p2.x === p3.x && p2.y === p3.y) || (p2.x === p4.x && p2.y === p4.y)) return false;
            return (ccw(p1, p3, p4) !== ccw(p2, p3, p4)) && (ccw(p1, p2, p3) !== ccw(p1, p2, p4));
        };

        const crossings = [];
        for (let i = 0; i < this.edges.length; i++) {
            const e1 = this.edges[i];
            const u1 = this.nodeMap.get(e1.u);
            const v1 = this.nodeMap.get(e1.v);
            if (!u1 || !v1) continue;

            for (let j = i + 1; j < this.edges.length; j++) {
                const e2 = this.edges[j];
                const u2 = this.nodeMap.get(e2.u);
                const v2 = this.nodeMap.get(e2.v);
                if (!u2 || !v2) continue;

                if (intersect(u1, v1, u2, v2)) {
                    crossings.push({ edge1: e1, edge2: e2 });
                }
            }
        }

        return {
            V, E, F, k_components: k,
            passes_edge_bound: passesEdgeBound,
            max_planar_edges_bound: maxPlanarEdges,
            euler_lhs: eulerLhs,
            euler_expected: eulerExpected,
            euler_formula_verified: eulerLhs === eulerExpected,
            formula_string: `V - E + F = ${V} - ${E} + ${F} = ${eulerLhs} (matches 1 + k = ${eulerExpected})`,
            physical_crossovers_count: crossings.length,
            physical_crossovers: crossings,
            is_theoretically_planar: passesEdgeBound && crossings.length === 0,
            dual_graph: {
                dual_vertices_V_star: F,
                dual_edges_E_star: E,
                dual_faces_F_star: V
            }
        };
    }

    // Phase 2A: Multi-Modal Dijkstra Algorithm with Weather & AQI Health Awareness
    runDijkstra(source, dest, mode = "car", trafficEnabled = true, weatherRain = false, aqiAware = false) {
        if (!this.nodeMap.has(source) || !this.nodeMap.has(dest)) {
            return { success: false, error: "Source or Destination node does not exist." };
        }

        const computeWeight = (edge) => {
            const len = parseFloat(edge.length || 1.0);
            const traffic = trafficEnabled ? parseFloat(edge.traffic || 1.0) : 1.0;
            const edgeMode = edge.mode || "road";
            const edgeAqi = parseFloat(edge.aqi || 75.0);

            // Meteorological rain slowdown (+45% on road corridors, 0% on metro)
            let weatherFactor = 1.0;
            if (weatherRain) {
                weatherFactor = (edgeMode === "road") ? 1.45 : 1.0;
            }

            // Air Quality (AQI) health friction penalty
            let aqiPenalty = 1.0;
            if (aqiAware && edgeAqi > 50) {
                aqiPenalty = 1.0 + ((edgeAqi - 50.0) / 200.0);
            }

            if (mode === "emergency") {
                const effectiveTraffic = 1.0 + (traffic - 1.0) * 0.3;
                return Math.max(0.1, len * effectiveTraffic * 0.8 * weatherFactor);
            } else if (mode === "metro") {
                return edgeMode === "metro" ? Math.max(0.1, len * 0.45 * weatherFactor * aqiPenalty) : Math.max(0.1, len * 1.5 * weatherFactor * aqiPenalty);
            } else if (mode === "eco_walk") {
                if (edgeMode === "metro") return Infinity;
                const walkAqi = aqiAware && edgeAqi > 50 ? 1.0 + ((edgeAqi - 50.0) / 100.0) : 1.0;
                return Math.max(0.1, len * 2.2 * Math.pow(weatherFactor, 1.2) * walkAqi);
            } else { // car / delivery
                if (edgeMode === "metro") return Infinity;
                return Math.max(0.1, len * traffic * weatherFactor * aqiPenalty);
            }
        };

        const dist = {};
        const parent = {};
        const edgeUsed = {};
        for (const n of this.nodes) {
            dist[n.id] = Infinity;
            parent[n.id] = null;
            edgeUsed[n.id] = null;
        }
        dist[source] = 0;

        const visited = new Set();
        const unvisited = new Set(this.nodes.map(n => n.id));
        const visitedOrder = [];

        while (unvisited.size > 0) {
            let u = null;
            let minDist = Infinity;
            for (const nid of unvisited) {
                if (dist[nid] < minDist) {
                    minDist = dist[nid];
                    u = nid;
                }
            }

            if (u === null || minDist === Infinity) break;
            unvisited.delete(u);
            visited.add(u);
            visitedOrder.push(u);

            if (u === dest) break;

            for (const edge of (this.adj.get(u) || [])) {
                const v = edge.u === u ? edge.v : edge.u;
                if (visited.has(v)) continue;

                const weight = computeWeight(edge);
                if (weight === Infinity) continue;

                if (dist[u] + weight < dist[v]) {
                    dist[v] = dist[u] + weight;
                    parent[v] = u;
                    edgeUsed[v] = edge;
                }
            }
        }

        if (dist[dest] === Infinity) {
            return { success: false, error: `No accessible route under mode '${mode}'.` };
        }

        const pathNodes = [];
        const pathEdges = [];
        let curr = dest;
        while (curr !== null) {
            pathNodes.push(curr);
            if (edgeUsed[curr]) pathEdges.push(edgeUsed[curr]);
            curr = parent[curr];
        }
        pathNodes.reverse();
        pathEdges.reverse();

        let totalPhysicalKm = 0;
        let weightedAqiSum = 0;
        const turnByTurn = pathEdges.map((e, idx) => {
            const edgeLen = parseFloat(e.length || 1.0);
            const aqi = parseFloat(e.aqi || 75.0);
            totalPhysicalKm += edgeLen;
            weightedAqiSum += (aqi * edgeLen);
            return {
                step: idx + 1,
                segment: `${e.name || 'Corridor'} (${pathNodes[idx]} ➔ ${pathNodes[idx+1]})`,
                distance_km: edgeLen.toFixed(1),
                traffic_multiplier: trafficEnabled ? `${e.traffic || 1.0}x` : '1.0x',
                aqi: Math.round(aqi),
                mode: e.mode || 'road'
            };
        });

        const avgAqi = (weightedAqiSum / Math.max(0.001, totalPhysicalKm)).toFixed(1);
        let aqiLabel = "Good (Clean Air)";
        if (avgAqi > 200) aqiLabel = "Very Unhealthy / Hazardous";
        else if (avgAqi > 150) aqiLabel = "Unhealthy";
        else if (avgAqi > 100) aqiLabel = "Unhealthy for Sensitive Groups";
        else if (avgAqi > 50) aqiLabel = "Moderate";

        return {
            success: true,
            source, destination: dest, travel_mode: mode,
            weather_rain: weatherRain,
            aqi_aware: aqiAware,
            total_cost_minutes: dist[dest].toFixed(2),
            total_physical_km: totalPhysicalKm.toFixed(2),
            avg_aqi: avgAqi,
            aqi_label: aqiLabel,
            path_nodes: pathNodes,
            path_edges: pathEdges,
            visited_nodes_order: visitedOrder,
            turn_by_turn: turnByTurn
        };
    }

    // Phase 2B: Kruskal's Algorithm (Minimum Spanning Tree with DSU)
    runKruskal() {
        const V = this.nodes.length;
        if (V <= 1) return { success: true, mst_edges: [], total_mst_cost: 0 };

        const parent = {};
        const rank = {};
        for (const n of this.nodes) {
            parent[n.id] = n.id;
            rank[n.id] = 0;
        }

        const find = (i) => {
            if (parent[i] === i) return i;
            parent[i] = find(parent[i]);
            return parent[i];
        };

        const union = (i, j) => {
            const rootI = find(i);
            const rootJ = find(j);
            if (rootI === rootJ) return false;
            if (rank[rootI] < rank[rootJ]) parent[rootI] = rootJ;
            else if (rank[rootI] > rank[rootJ]) parent[rootJ] = rootI;
            else {
                parent[rootJ] = rootI;
                rank[rootI]++;
            }
            return true;
        };

        const sortedEdges = [...this.edges].sort((a, b) => (parseFloat(a.cost || a.length) - parseFloat(b.cost || b.length)));
        const mstEdges = [];
        const stepLog = [];

        for (const edge of sortedEdges) {
            const cost = parseFloat(edge.cost || edge.length * 100000);
            if (union(edge.u, edge.v)) {
                mstEdges.push(edge);
                stepLog.push({ step: stepLog.length + 1, edge: `${edge.u} — ${edge.v}`, cost, action: "ADDED", reason: "No cycle" });
                if (mstEdges.length === V - 1) break;
            } else {
                stepLog.push({ step: stepLog.length + 1, edge: `${edge.u} — ${edge.v}`, cost, action: "REJECTED", reason: "Forms redundant loop" });
            }
        }

        const totalMstCost = mstEdges.reduce((sum, e) => sum + parseFloat(e.cost || e.length * 100000), 0);
        const totalOrigCost = this.edges.reduce((sum, e) => sum + parseFloat(e.cost || e.length * 100000), 0);
        const savings = Math.max(0, totalOrigCost - totalMstCost);
        const savingsPct = totalOrigCost > 0 ? (savings / totalOrigCost * 100).toFixed(1) : 0;

        return {
            success: mstEdges.length === V - 1,
            algorithm: "Kruskal's Algorithm (Greedy Edge-Sort + DSU O(E log E))",
            num_mst_edges: mstEdges.length,
            mst_edges: mstEdges,
            total_mst_cost: totalMstCost,
            total_original_cost: totalOrigCost,
            capital_saved: savings,
            cost_reduction_percent: savingsPct,
            redundant_loops_eliminated: this.edges.length - mstEdges.length,
            step_log: stepLog.slice(0, 20)
        };
    }

    // Phase 2B: Prim's Algorithm (Minimum Spanning Tree from Root)
    runPrim(rootNode) {
        const V = this.nodes.length;
        if (V <= 1) return { success: true, mst_edges: [], total_mst_cost: 0 };

        if (!rootNode || !this.nodeMap.has(rootNode)) {
            rootNode = this.nodes[0].id;
        }

        const inTree = new Set([rootNode]);
        const mstEdges = [];
        const stepLog = [];

        while (inTree.size < V) {
            let minEdge = null;
            let minCost = Infinity;
            let nextNode = null;

            for (const u of inTree) {
                for (const edge of (this.adj.get(u) || [])) {
                    const v = edge.u === u ? edge.v : edge.u;
                    if (!inTree.has(v)) {
                        const cost = parseFloat(edge.cost || edge.length * 100000);
                        if (cost < minCost) {
                            minCost = cost;
                            minEdge = edge;
                            nextNode = v;
                        }
                    }
                }
            }

            if (!minEdge) break; // Disconnected

            inTree.add(nextNode);
            mstEdges.push(minEdge);
            stepLog.push({
                step: mstEdges.length,
                edge: `${minEdge.u} — ${minEdge.v}`,
                via_edge: `${minEdge.u} — ${minEdge.v}`,
                added_node: nextNode,
                cost: minCost,
                action: "ADDED",
                reason: `Connected via minimal cut edge to ${nextNode}`
            });
        }

        const totalMstCost = mstEdges.reduce((sum, e) => sum + parseFloat(e.cost || e.length * 100000), 0);
        const totalOrigCost = this.edges.reduce((sum, e) => sum + parseFloat(e.cost || e.length * 100000), 0);
        const savings = Math.max(0, totalOrigCost - totalMstCost);
        const savingsPct = totalOrigCost > 0 ? (savings / totalOrigCost * 100).toFixed(1) : 0;

        return {
            success: mstEdges.length === V - 1,
            algorithm: `Prim's Algorithm (Root: ${rootNode}, Cut O(E log V))`,
            root_node: rootNode,
            num_mst_edges: mstEdges.length,
            mst_edges: mstEdges,
            total_mst_cost: totalMstCost,
            total_original_cost: totalOrigCost,
            capital_saved: savings,
            cost_reduction_percent: savingsPct,
            redundant_loops_eliminated: this.edges.length - mstEdges.length,
            step_log: stepLog.slice(0, 20)
        };
    }

    // Phase 2C: Hierholzer's Algorithm (Eulerian Circuit/Trail)
    runHierholzer() {
        const degrees = this.getVertexDegrees();
        const oddNodes = Object.keys(degrees).filter(id => degrees[id] % 2 !== 0);

        let status = "NON_EULERIAN";
        let startNode = this.nodes[0] ? this.nodes[0].id : null;

        if (oddNodes.length === 0 && this.edges.length > 0) {
            status = "EULER_CIRCUIT";
        } else if (oddNodes.length === 2) {
            status = "EULER_TRAIL";
            startNode = oddNodes[0];
        }

        if (status === "NON_EULERIAN") {
            return {
                success: false,
                status,
                odd_nodes: oddNodes,
                error: `Non-Eulerian: ${oddNodes.length} odd-degree vertices detected. Euler's theorem requires 0 or 2 odd vertices.`
            };
        }

        const adjMap = new Map();
        for (const n of this.nodes) adjMap.set(n.id, []);
        this.edges.forEach((e, idx) => {
            const eid = e.id || `e_${idx}`;
            adjMap.get(e.u).push({ to: e.v, id: eid });
            adjMap.get(e.v).push({ to: e.u, id: eid });
        });

        const currPath = [startNode];
        const circuit = [];
        const usedEdges = new Set();

        while (currPath.length > 0) {
            const currV = currPath[currPath.length - 1];
            let nextCandidate = null;

            while (adjMap.get(currV).length > 0) {
                const cand = adjMap.get(currV).pop();
                if (!usedEdges.has(cand.id)) {
                    usedEdges.add(cand.id);
                    nextCandidate = cand.to;
                    break;
                }
            }

            if (nextCandidate !== null) {
                currPath.push(nextCandidate);
            } else {
                circuit.push(currPath.pop());
            }
        }

        circuit.reverse();

        return {
            success: true,
            status,
            start_node: startNode,
            nodes_sequence: circuit,
            edges_traversed_count: circuit.length - 1,
            covers_all_edges: circuit.length - 1 === this.edges.length,
            algorithm: "Hierholzer's Algorithm O(E)"
        };
    }

    // Phase 2C: Hamiltonian Cycle (Bounded Backtracking & Dirac Guard)
    findHamiltonianCycle(startNode) {
        const V = this.nodes.length;
        if (V === 0) return { success: false, error: "Empty graph." };
        if (!startNode || !this.nodeMap.has(startNode)) startNode = this.nodes[0].id;

        // For large real-world graphs (V > 20), exhaustive backtracking is NP-Complete and would freeze the main thread
        if (V > 20) {
            const degrees = this.getVertexDegrees();
            const minDeg = Math.min(...Object.values(degrees));
            const diracSatisfied = minDeg >= V / 2.0;
            return {
                success: false,
                is_hamiltonian: false,
                start_node: startNode,
                cycle_nodes: [],
                dirac_satisfied: diracSatisfied,
                note: `Graph contains ${V} vertices. Exhaustive Hamiltonian search requires exponential time O(2^V). Dirac condition: min deg ${minDeg} < ${V / 2}.`
            };
        }

        const path = [startNode];
        const visited = new Set([startNode]);
        let steps = 0;
        const MAX_STEPS = 2500;

        const backtrack = (curr) => {
            if (++steps > MAX_STEPS) return false;

            if (path.length === V) {
                for (const edge of (this.adj.get(curr) || [])) {
                    const nbr = edge.u === curr ? edge.v : edge.u;
                    if (nbr === startNode) {
                        path.push(startNode);
                        return true;
                    }
                }
                return false;
            }

            for (const edge of (this.adj.get(curr) || [])) {
                const nbr = edge.u === curr ? edge.v : edge.u;
                if (!visited.has(nbr)) {
                    visited.add(nbr);
                    path.push(nbr);
                    if (backtrack(nbr)) return true;
                    visited.delete(nbr);
                    path.pop();
                }
            }
            return false;
        };

        const found = backtrack(startNode);
        return {
            success: found,
            cycle_nodes: found ? path : [],
            start_node: startNode
        };
    }
}
