# Smart Urban Multi-Modal Route & Infrastructure Optimizer
> **Autonomous Municipal Operations Center & Smart City Grid Simulation Prototype**

---

## 🌟 Executive Overview

Modern smart cities face two intertwined spatial-network challenges:
1. **Dynamic Surface Mobility (Routing):** Routing emergency vehicles, delivery fleets, and public transit through congested urban corridors with multi-modal transit options.
2. **Subsurface Utility Grid Layout (Infrastructure):** Laying underground fiber-optic telecommunication cables, electrical grids, and water pipelines with minimal total expenditure while guaranteeing that every sector is connected without redundant, costly closed loops.

This project delivers a **full-scale operational prototype** that models, simulates, and optimizes urban grids through a continuous three-phase engineering pipeline.

---

## 🏗️ The 3-Phase Optimization Architecture

```
                      [ Raw City Grid Data: Intersections (V) & Corridors (E) ]
                                                   │
                                                   ▼
                     ┌───────────────────────────────────────────────────────────┐
                     │          PHASE 1: STRUCTURAL & TOPOLOGICAL VALIDATION     │
                     │  • Handshaking Property: ∑ deg(v) = 2|E|                  │
                     │  • Network Connectivity & Bottleneck Analysis             │
                     │  • Planarity Check via Euler's Formula: V - E + F = 2     │
                     └─────────────────────────────┬─────────────────────────────┘
                                                   │
                                                   ▼
                     ┌───────────────────────────────────────────────────────────┐
                     │          PHASE 2: DUAL-MODULE OPTIMIZATION ENGINE         │
                     ├─────────────────────────────┬─────────────────────────────┤
                     │   Subsystem A: Traffic &    │   Subsystem B: Utility Grid │
                     │      Mobility Routing       │         Optimization        │
                     ├─────────────────────────────┼─────────────────────────────┤
                     │ • Multi-Modal Dijkstra      │ • Kruskal's MST (DSU)       │
                     │ • Hierholzer's Euler Route  │ • Prim's MST (From Root)    │
                     │ • Hamiltonian Patrol Cycle  │ • Redundant Loop Removal    │
                     └─────────────────────────────┴─────────────────────────────┘
                                                   │
                                                   ▼
                     ┌───────────────────────────────────────────────────────────┐
                     │          PHASE 3: OPERATIONAL AUDIT & SYSTEM REPORT       │
                     │  • Interactive Visual Graph & Turn-by-Turn Execution      │
                     │  • Cost Savings Matrix (Baseline vs. Optimized MST)       │
                     │  • Civil Engineering & 2D Planar Feasibility Sign-Off     │
                     └───────────────────────────────────────────────────────────┘
```

---

## 📊 Detailed Phase Breakdown

### Phase 1: Structural & Topological Validation
* **Handshaking Property & Degree Parity:**
  $$\sum_{v \in V} \deg(v) = 2|E|$$
  Verifies that the degree sum across all intersections equals twice the corridor count, and ensures the number of odd-degree vertices is even.
* **Connectivity & Disaster Resilience:**
  Uses Breadth-First Search (BFS) to audit connected components and identify articulation points (critical junctions) and bridges.
* **Planarity Analysis & Euler's Polyhedral Formula:**
  $$V - E + F = 2 \quad \implies \quad F = E - V + 2$$
  * Checks maximum planar density limit $E \le 3V - 6$.
  * Detects 2D physical corridor crossing clashes to verify whether pipelines and roads can be laid flat or require 3D bridge flyovers / tiered utility tunnels.
  * Formulates the Dual Graph $G^*$ ($V^* = F, E^* = E, F^* = V$).

---

### Phase 2: Dual-Module Optimization Engine

#### Subsystem A: Dynamic Multi-Modal Traffic & Routing Engine
* **Dijkstra's Shortest Path Algorithm:** Min-priority queue implementation ($\mathcal{O}((V + E) \log V)$).
* **Multi-Modal Dynamic Congestion Weighting:**
  * 🚑 **Emergency Vehicle:** Traffic siren bypasses congestion bottlenecks.
  * 🚗 **Car / Delivery:** Real-time road congestion penalties.
  * 🚇 **Metro Rail:** High-speed fixed transit immune to surface jams.
  * 🚶 **Eco-Walk:** Walking and non-motorized corridors.
* **Municipal Waste & Street Sweeping (Hierholzer's Algorithm $\mathcal{O}(E)$):**
  Constructs continuous non-overlapping Euler circuits covering every corridor strictly once with zero deadhead travel.
* **Smart Security Patrol (Hamiltonian Cycle):**
  Calculates patrol beat tours visiting every designated sector checkpoint once before returning to base.

#### Subsystem B: Utility Infrastructure Grid Optimization
* **Minimum Spanning Tree (MST):**
  Connects all residential and commercial sectors to the central power, water, and telecom grids at minimal total cost.
* **Kruskal's Algorithm:** Global edge-sorting with Disjoint Set Union (DSU) cycle prevention ($\mathcal{O}(E \log E)$).
* **Prim's Algorithm:** Cut-crossing tree growth starting from a central treatment facility ($\mathcal{O}(E \log V)$).
* **Quantified Capital Savings:** Eliminates expensive redundant closed loops, saving **over 50% in infrastructure capital expenditure**.

---

### Phase 3: Operational Audit & Engineering Report
* **Cross-Phase Benchmark Matrix:** Compares pre-optimization baseline against optimized outcomes.
* **Civil Engineering Feasibility Certification:** 2D trenching compliance and safety redundancy checks.

---

## 🚀 How to Run the Website

### Option 1: Full-Stack Web App (Recommended)
```bash
./run.sh
```
Or run directly:
```bash
PORT=5050 python3 app.py
```
Open your browser at:
👉 **`http://127.0.0.1:5050`**

### Option 2: Standalone Static Browser Mode
Double-click `index.html` directly in Finder or open it in Chrome/Safari without running a server.

---

## 🚀 Deploying to Vercel (1-Click Deployment)

This repository is pre-configured for instant zero-configuration deployment to **Vercel** with full Python Serverless backend and edge CDN static hosting:

1. **Push Repository to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Deploy Smart Urban Route Optimizer"
   git branch -M main
   git remote add origin https://github.com/NITHIN-aiml69/SMART-ROUTE-OPTMIZER.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   * Go to [Vercel Dashboard](https://vercel.com/new).
   * Click **"Add New Project"** ➔ **"Import Git Repository"**.
   * Select **`NITHIN-aiml69/SMART-ROUTE-OPTMIZER`**.
   * Framework Preset: Leave as **Other** (Vercel automatically detects `vercel.json`, `api/index.py`, and `requirements.txt`).
   * (Optional) Under **Environment Variables**, add:
     * `GOOGLE_MAPS_API_KEY`: *(Your Google Maps API Key)*
   * Click **Deploy**!

3. **Live Architecture on Vercel:**
   * `/` & `/static/*` ➔ Served instantly via Vercel Global Edge CDN.
   * `/api/*` ➔ Routed dynamically to Python serverless runtime (`api/index.py` & `app.py`).
   * **Dual Engine Fallback:** Even during cold starts or offline mode, the client-side JavaScript engine (`algorithms.js`) runs complete Dijkstra routing, Prim/Kruskal MST, and Euler traversals right in the browser!

---

## 🗺️ Real-World GIS Integration: Bengaluru (Bangalore) Smart Grid

The system features real-world geographic mapping powered by **Google Maps JavaScript API** and **Leaflet.js / CartoDB Dark Matter**:
* **Google Maps API Support:**
  * Enter your Google Maps API Key directly in the UI (**`🔑 Maps API Key`** button) or set `GOOGLE_MAPS_API_KEY` in `.env`.
  * Renders real Google vector roadmap, satellite imagery, hybrid, and night mode styling.
  * Live **Google Real-Time Traffic Layer (`google.maps.TrafficLayer`)** displaying live congestion along Bengaluru corridors (Silk Board, Outer Ring Road, MG Road, Hosur Road).
  * Seamless fallback to Leaflet / CartoDB OpenStreetMap if no Google Maps API key is configured.
* **Real GPS Coordinates:** Accurate latitude & longitude across 16 major Bengaluru nodes:
  * 🏥 **Medical:** Victoria Hospital (KR Market) & Manipal Hospital (Old Airport Rd)
  * 💧 **Water Infrastructure:** BWSSB Central Kaveri Treatment Reservoir (High Grounds)
  * ⚡ **Power Substations:** KPTCL 220kV Peenya Major Grid & BESCOM Hoodi Substation
  * 🚇 **Multimodal Rail/Metro:** Kempegowda Majestic Intermodal Hub & Yeshwanthpur Metro
  * 🏢 **Technology Clusters:** Electronic City (Phase 1), Whitefield ITPL & MG Road CBD
  * 🛑 **Critical Bottlenecks:** Silk Board Interchange (3.6x congestion), Marathahalli ORR Crossing, Hebbal Flyover
  * 🚛 **Municipal Operations:** BBMP Bommanahalli Fleet Depot
* **Interactive View Modes:**
  * **🗺️ Bengaluru GIS Map:** Real street tiles, GPS polylines, dynamic congestion coloring, and vehicle animation.
  * **📐 Schematic Canvas:** Pure topological graph canvas with interactive drag-and-drop.

---

## 🖥️ Prototype Dashboard Features

1. **Executive Overview Dashboard (Default View):**
   * Live KPI strip: Total Intersections, Active Corridors, MST Capital Savings %, and 2D Planar Clash Status.
   * Interactive Phase Roadmap cards with live status badges and 1-click drill-down buttons.
2. **Phase 1 Tab:** Handshaking proof, degree sequence, connectivity report, and Euler's formula card.
3. **Phase 2A Tab:** Origin/Destination routing, transit mode selector, live congestion toggle, turn-by-turn itinerary.
4. **Phase 2B Tab:** Kruskal vs. Prim comparison table, loop elimination counter, capital savings metrics, glowing green MST overlay.
5. **Phase 2C Tab:** Animated street sweeper vehicle button and security patrol beacon simulation.
6. **Phase 3 Tab:** Engineering benchmark matrix and mathematical foundations reference.
