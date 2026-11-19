"""
Smart Urban Multi-Modal Route & Infrastructure Optimizer
Flask Web Application Backend
"""
import os
from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
from engine import (
    CityGraph, TopologyAuditor, ShortestPathEngine,
    MunicipalTraversalEngine, UtilityMSTOptimizer,
    get_default_smart_grid, get_eulerian_sweeper_grid, get_planarity_dilemma_grid,
    get_bangalore_gis_grid
)

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

# In-memory active city graph (defaults to Bengaluru Real-World GIS Grid)
ACTIVE_GRID_DATA = get_bangalore_gis_grid()
ACTIVE_GRAPH = CityGraph(ACTIVE_GRID_DATA)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/config/maps", methods=["GET", "POST"])
def config_maps():
    """Manage Google Maps API Key configuration"""
    env_file = os.path.join(os.path.dirname(__file__), ".env")
    if request.method == "POST":
        data = request.get_json() or {}
        api_key = data.get("api_key", "").strip()
        os.environ["GOOGLE_MAPS_API_KEY"] = api_key
        try:
            with open(env_file, "w") as f:
                f.write(f"GOOGLE_MAPS_API_KEY={api_key}\n")
        except Exception as e:
            pass
        return jsonify({"status": "success", "has_key": bool(api_key)})

    key = os.environ.get("GOOGLE_MAPS_API_KEY", "")
    if not key and os.path.exists(env_file):
        try:
            with open(env_file, "r") as f:
                for line in f:
                    if line.startswith("GOOGLE_MAPS_API_KEY="):
                        key = line.split("=", 1)[1].strip()
                        os.environ["GOOGLE_MAPS_API_KEY"] = key
        except Exception:
            pass
    return jsonify({"api_key": key, "has_key": bool(key)})


@app.route("/api/presets", methods=["GET"])
def list_presets():
    return jsonify({
        "presets": [
            {"id": "bangalore", "name": "Bengaluru Real-World Smart Grid (GIS Map)", "description": "16-node authentic GPS map of Bangalore with Silk Board, Electronic City, Whitefield ITPL, Majestic, Metro, Hospitals & BWSSB/KPTCL grids."},
            {"id": "default", "name": "Neo-Metropolis Smart Grid (Full Multi-Modal)", "description": "12-node comprehensive urban grid with hospital, power substation, reservoir, metro lines, and residential sectors."},
            {"id": "eulerian", "name": "High-Density Municipal Sweeper Grid (Zero Deadhead)", "description": "Regular 4-degree municipal grid where all vertices have even degrees; perfect continuous sweep circuit."},
            {"id": "planarity", "name": "Underground Utility Conflict Grid (Planarity Clash)", "description": "Complete bipartite utility network demonstrating physical 2D crossover clashes and planarity limits."}
        ]
    })


@app.route("/api/preset/<preset_id>", methods=["GET"])
def load_preset(preset_id):
    global ACTIVE_GRID_DATA, ACTIVE_GRAPH
    if preset_id == "bangalore":
        ACTIVE_GRID_DATA = get_bangalore_gis_grid()
    elif preset_id == "eulerian":
        ACTIVE_GRID_DATA = get_eulerian_sweeper_grid()
    elif preset_id == "planarity":
        ACTIVE_GRID_DATA = get_planarity_dilemma_grid()
    else:
        ACTIVE_GRID_DATA = get_default_smart_grid()

    ACTIVE_GRAPH = CityGraph(ACTIVE_GRID_DATA)
    return jsonify(ACTIVE_GRID_DATA)


@app.route("/api/graph", methods=["GET", "POST"])
def handle_graph():
    global ACTIVE_GRID_DATA, ACTIVE_GRAPH
    if request.method == "POST":
        ACTIVE_GRID_DATA = request.get_json()
        ACTIVE_GRAPH = CityGraph(ACTIVE_GRID_DATA)
        return jsonify({"status": "success", "message": "Graph updated"})
    return jsonify(ACTIVE_GRID_DATA)


@app.route("/api/audit/handshaking", methods=["POST"])
def audit_handshaking():
    data = request.get_json() or ACTIVE_GRID_DATA
    g = CityGraph(data)
    result = g.verify_handshaking_property()
    return jsonify(result)


@app.route("/api/audit/topology", methods=["POST"])
def audit_topology():
    data = request.get_json() or ACTIVE_GRID_DATA
    g = CityGraph(data)
    auditor = TopologyAuditor(g)
    connectivity = auditor.check_connectivity()
    bottlenecks = auditor.detect_bottlenecks()
    planarity = auditor.audit_planarity_and_euler_formula()
    return jsonify({
        "connectivity": connectivity,
        "bottlenecks": bottlenecks,
        "planarity": planarity
    })


@app.route("/api/route/dijkstra", methods=["POST"])
def route_dijkstra():
    req = request.get_json() or {}
    source = req.get("source")
    dest = req.get("destination")
    mode = req.get("mode") or req.get("travel_mode", "car")
    traffic = req.get("traffic_enabled", True)
    weather_rain = req.get("weather_rain", False)
    aqi_aware = req.get("aqi_aware", False)
    data = req.get("graph") or ACTIVE_GRID_DATA

    g = CityGraph(data)
    router = ShortestPathEngine(g)
    res = router.run_dijkstra(
        source, dest, travel_mode=mode, traffic_enabled=traffic,
        weather_rain=weather_rain, aqi_aware=aqi_aware
    )
    return jsonify(res)


@app.route("/api/route/road", methods=["POST"])
def route_road():
    req = request.get_json() or {}
    origin_lat = req.get("origin_lat")
    origin_lng = req.get("origin_lng")
    dest_lat = req.get("dest_lat")
    dest_lng = req.get("dest_lng")
    mode = req.get("mode", "car")
    profile = "walking" if mode == "eco_walk" else "driving"
    url = f"https://router.project-osrm.org/route/v1/{profile}/{origin_lng},{origin_lat};{dest_lng},{dest_lat}?overview=full&geometries=geojson&steps=true"
    try:
        import urllib.request, json
        osrm_req = urllib.request.Request(url, headers={"User-Agent": "BengaluruGisRouter/1.0"})
        with urllib.request.urlopen(osrm_req, timeout=8) as resp:
            data = json.loads(resp.read().decode())
            return jsonify(data)
    except Exception as e:
        return jsonify({"code": "Error", "message": str(e)}), 502


@app.route("/api/route/cab_fare", methods=["POST"])
def calculate_cab_fare():
    req = request.get_json() or {}
    try:
        distance_km = float(req.get("distance_km", 5.0))
        duration_min = float(req.get("duration_minutes", 15.0))
        traffic_surge = float(req.get("traffic_surge", 1.0))
        monsoon = bool(req.get("weather_rain", False))
        surge = traffic_surge * (1.25 if monsoon else 1.0)

        # Namma Yatri / Auto: Base Rs 36 (first 2km), Rs 15/km, Rs 0.5/min
        auto_fare = max(36, round(36 + max(0.0, distance_km - 2.0) * 15.0 + max(0.0, duration_min - distance_km * 1.8) * 0.5))
        # Uber Go / Ola Mini: Rs 55 base + Rs 15.5/km + Rs 1.5/min * surge
        go_fare = round((55.0 + distance_km * 15.5 + duration_min * 1.5) * surge)
        # Uber Premier: Rs 90 base + Rs 19/km + Rs 2.0/min * surge
        premier_fare = round((90.0 + distance_km * 19.0 + duration_min * 2.0) * surge)
        # Bike Taxi: Rs 25 base + Rs 8.5/km + Rs 0.8/min
        bike_fare = round((25.0 + distance_km * 8.5 + duration_min * 0.8) * (1.3 if monsoon else 1.0))

        return jsonify({
            "success": True,
            "distance_km": distance_km,
            "duration_minutes": duration_min,
            "surge_multiplier": round(surge, 2),
            "fares": {
                "auto": {"provider": "Namma Yatri / Auto", "fare": auto_fare, "eta_minutes": 3, "currency": "INR"},
                "go": {"provider": "Uber Go / Ola Mini", "fare": go_fare, "eta_minutes": 4, "currency": "INR"},
                "premier": {"provider": "Uber Premier / Prime", "fare": premier_fare, "eta_minutes": 5, "currency": "INR"},
                "bike": {"provider": "Rapido Bike Taxi", "fare": bike_fare, "eta_minutes": 2, "currency": "INR"}
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@app.route("/api/municipal/euler", methods=["POST"])
def municipal_euler():
    req = request.get_json() or {}
    data = req.get("graph") or ACTIVE_GRID_DATA
    start_node = req.get("start_node")
    g = CityGraph(data)
    muni = MunicipalTraversalEngine(g)
    analysis = muni.analyze_eulerian_status()
    route = muni.generate_eulerian_route(start_node)
    return jsonify({"analysis": analysis, "route": route})


@app.route("/api/municipal/hamilton", methods=["POST"])
def municipal_hamilton():
    req = request.get_json() or {}
    data = req.get("graph") or ACTIVE_GRID_DATA
    start_node = req.get("start_node")
    g = CityGraph(data)
    muni = MunicipalTraversalEngine(g)
    res = muni.find_hamiltonian_cycle(start_node)
    return jsonify(res)


@app.route("/api/utility/mst", methods=["POST"])
def utility_mst():
    req = request.get_json() or {}
    data = req.get("graph") or ACTIVE_GRID_DATA
    root = req.get("root_node")
    g = CityGraph(data)
    mst_engine = UtilityMSTOptimizer(g)
    kruskal = mst_engine.run_kruskals_algorithm()
    prim = mst_engine.run_prims_algorithm(root)
    return jsonify({
        "kruskal": kruskal,
        "prim": prim
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5050))
    print(f"\n🚀 Starting Smart Urban Route & Infrastructure Optimizer...")
    print(f"📍 Open http://127.0.0.1:{port} in your web browser\n")
    app.run(host="0.0.0.0", port=port, debug=False)
