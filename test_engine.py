"""
Automated Unit Tests for Module IV & Module V Graph Algorithms
"""
import sys
from engine import (
    CityGraph, TopologyAuditor, ShortestPathEngine,
    MunicipalTraversalEngine, UtilityMSTOptimizer,
    get_default_smart_grid, get_eulerian_sweeper_grid, get_planarity_dilemma_grid,
    get_bangalore_gis_grid
)

def test_handshaking_and_topology():
    print("Testing Handshaking Theorem & Topology...")
    grid = get_default_smart_grid()
    g = CityGraph(grid)

    # 1. Handshaking
    hs = g.verify_handshaking_property()
    assert hs["handshaking_verified"] is True, "Handshaking theorem failed!"
    assert hs["odd_count_is_even"] is True, "Odd-degree count must be even!"
    print(f" [PASS] Handshaking: sum(deg) = {hs['sum_of_degrees']} == 2|E| = {hs['two_e']}")

    # 2. Topology & Euler Formula
    auditor = TopologyAuditor(g)
    conn = auditor.check_connectivity()
    assert conn["is_connected"] is True, "Smart grid should be connected!"
    print(f" [PASS] Connectivity: {conn['status']}")

    planarity = auditor.audit_planarity_and_euler_formula()
    assert planarity["euler_formula_verified"] is True, "Euler formula check failed!"
    print(f" [PASS] Euler Formula: {planarity['formula_string']}")

def test_routing():
    print("\nTesting Multi-Modal Dijkstra...")
    grid = get_default_smart_grid()
    g = CityGraph(grid)
    engine = ShortestPathEngine(g)

    # Emergency from R4 to H1
    res = engine.run_dijkstra("R4", "H1", travel_mode="emergency", traffic_enabled=True)
    assert res["success"] is True, "Dijkstra failed!"
    assert res["path_nodes"][0] == "R4" and res["path_nodes"][-1] == "H1"
    print(f" [PASS] Dijkstra Route R4 -> H1: {' -> '.join(res['path_nodes'])}, Time: {res['total_cost_minutes']} mins")

def test_municipal():
    print("\nTesting Municipal Logistics (Euler & Hamilton)...")
    # Octahedron grid should have perfect Euler circuit
    octa = get_eulerian_sweeper_grid()
    g_octa = CityGraph(octa)
    muni_octa = MunicipalTraversalEngine(g_octa)

    euler_res = muni_octa.generate_eulerian_route()
    assert euler_res["success"] is True, "Hierholzer failed on Eulerian grid!"
    assert euler_res["covers_all_edges_strictly_once"] is True
    print(f" [PASS] Hierholzer Euler Circuit: traversed {euler_res['edges_traversed_count']} edges")

    # Hamiltonian cycle on octahedron
    hamilton_res = muni_octa.find_hamiltonian_cycle()
    assert hamilton_res["success"] is True, "Hamiltonian cycle should exist on octahedron!"
    print(f" [PASS] Hamiltonian Cycle: {' -> '.join(hamilton_res['cycle_nodes'])}")

def test_mst():
    print("\nTesting Kruskal & Prim MST...")
    grid = get_default_smart_grid()
    g = CityGraph(grid)
    mst_engine = UtilityMSTOptimizer(g)

    kruskal = mst_engine.run_kruskals_algorithm()
    prim = mst_engine.run_prims_algorithm("W1")

    assert kruskal["success"] is True
    assert prim["success"] is True
    # Both algorithms must yield identical minimum total cost
    assert abs(kruskal["total_mst_cost"] - prim["total_mst_cost"]) < 1e-4, "Kruskal & Prim total costs differ!"
    assert kruskal["num_mst_edges"] == len(grid["nodes"]) - 1
    print(f" [PASS] MST Cost: Kruskal = ${kruskal['total_mst_cost']:,.2f} == Prim = ${prim['total_mst_cost']:,.2f}")
    print(f" [PASS] Capital saved: {kruskal['cost_reduction_percent']}% | Redundant loops removed: {kruskal['redundant_loops_eliminated']}")

def test_planarity_dilemma():
    print("\nTesting Planarity Dilemma (K3,3)...")
    k33 = get_planarity_dilemma_grid()
    g = CityGraph(k33)
    auditor = TopologyAuditor(g)
    planarity = auditor.audit_planarity_and_euler_formula()
    assert planarity["physical_crossovers_count"] > 0, "K3,3 should have crossovers in 2D!"
    print(f" [PASS] Non-planar crossovers detected: {planarity['physical_crossovers_count']}")

def test_bangalore_grid():
    print("\nTesting Bengaluru Real-World GIS Grid (All 4 Metro Lines 2026 + 55 Empanelled Hospitals)...")
    blr = get_bangalore_gis_grid()
    assert len(blr["nodes"]) == 162, f"Expected 162 nodes, got {len(blr['nodes'])}"
    assert len(blr["edges"]) == 164, f"Expected 164 edges, got {len(blr['edges'])}"
    g = CityGraph(blr)

    # 1. Handshaking
    hs = g.verify_handshaking_property()
    assert hs["handshaking_verified"] is True
    assert hs["two_e"] == 328
    print(f" [PASS] Bengaluru Handshaking: sum(deg) = {hs['sum_of_degrees']} == 2|E| = {hs['two_e']} (162 nodes, 164 edges)")

    # 2. Connectivity
    auditor = TopologyAuditor(g)
    conn = auditor.check_connectivity()
    assert conn["is_connected"] is True, "Grid must be fully connected!"
    print(f" [PASS] Bangalore Metro & Healthcare Connectivity: {conn['status']}")

    # 3. Dijkstra End-to-End Transits on all 4 lines
    router = ShortestPathEngine(g)

    # 3a. 🟣 Purple Line: Challaghatta to Whitefield (Kadugodi)
    p_route = router.run_dijkstra("MTR_P_CHALLA", "MTR_P_WHITEFIELD", travel_mode="metro")
    assert p_route["success"] is True and len(p_route["path_nodes"]) == 37
    print(f" [PASS] Purple Line (Challaghatta -> Whitefield): 37 stations traversed, Time: {p_route['total_cost_minutes']} mins")

    # 3b. 🟢 Green Line: Madavara (BIEC) to Silk Institute
    g_route = router.run_dijkstra("MTR_G_MADAVARA", "MTR_G_SILK_INST", travel_mode="metro")
    assert g_route["success"] is True and len(g_route["path_nodes"]) == 32
    print(f" [PASS] Green Line (Madavara -> Silk Institute): 32 stations traversed, Time: {g_route['total_cost_minutes']} mins")

    # 3c. 🟡 Yellow Line: RV Road to Delta Electronics Bommasandra
    y_route = router.run_dijkstra("BLR_RV_RD", "BLR_BOMMA", travel_mode="metro")
    assert y_route["success"] is True and len(y_route["path_nodes"]) == 16
    print(f" [PASS] Yellow Line (RV Road -> Bommasandra): 16 stations traversed, Time: {y_route['total_cost_minutes']} mins")

    # 3d. 🌸 Pink Line: Kalena Agrahara to Nagawara
    pk_route = router.run_dijkstra("BLR_KALENA", "BLR_NAGAW", travel_mode="metro")
    assert pk_route["success"] is True and len(pk_route["path_nodes"]) == 18
    print(f" [PASS] Pink Line (Kalena Agrahara -> Nagawara): 18 stations traversed, Time: {pk_route['total_cost_minutes']} mins")

    # 3e. 🔀 Multi-Interchange Cross-Town Transfer: Challaghatta to Bommasandra
    multi_route = router.run_dijkstra("MTR_P_CHALLA", "BLR_BOMMA", travel_mode="metro")
    assert multi_route["success"] is True
    print(f" [PASS] Cross-Line Multi-Interchange (Challaghatta -> Bommasandra): {len(multi_route['path_nodes'])} stations, Time: {multi_route['total_cost_minutes']} mins")

    # 3f. 🚑 Emergency Ambulance Dispatch to Empanelled Hospitals
    hosp_route_1 = router.run_dijkstra("BLR_MAJ", "HSP_APOLLO_BG", travel_mode="emergency")
    assert hosp_route_1["success"] is True
    print(f" [PASS] Emergency Dispatch Majestic -> Apollo Bannerghatta: {hosp_route_1['total_cost_minutes']} mins, {hosp_route_1['total_physical_km']} km")

    hosp_route_2 = router.run_dijkstra("BLR_SILK", "HSP_JAYADEVA", travel_mode="emergency")
    assert hosp_route_2["success"] is True
    print(f" [PASS] Emergency Dispatch Silk Board -> Jayadeva Cardiology: {hosp_route_2['total_cost_minutes']} mins, {hosp_route_2['total_physical_km']} km")

    # 4. Minimum Spanning Tree across Bangalore Metro & Urban Infrastructure
    mst_eng = UtilityMSTOptimizer(g)
    kruskal = mst_eng.run_kruskals_algorithm()
    assert kruskal["success"] is True
    assert kruskal["num_mst_edges"] == 161
    print(f" [PASS] Bangalore Kaveri/Power MST Cost: ${kruskal['total_mst_cost']:,.2f} (Saved {kruskal['cost_reduction_percent']}%, {kruskal['redundant_loops_eliminated']} loops removed)")

if __name__ == "__main__":
    try:
        test_handshaking_and_topology()
        test_routing()
        test_municipal()
        test_mst()
        test_planarity_dilemma()
        test_bangalore_grid()
        print("\n🎉 ALL TESTS PASSED SUCCESSFULLY! Mathematical & GIS engine is 100% verified.")
    except Exception as e:
        print(f"\n❌ TEST FAILED: {e}")
        sys.exit(1)
