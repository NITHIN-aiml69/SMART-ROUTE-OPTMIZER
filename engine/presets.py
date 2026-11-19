"""
Smart Urban Multi-Modal Route & Infrastructure Optimizer
Smart City Preset Datasets for Academic Demonstration
"""
from typing import Dict, Any


def get_default_smart_grid() -> Dict[str, Any]:
    """
    Primary Demonstration Dataset: Neo-Metropolis Smart City
    Contains diverse zones (Residential, Medical, Utility, Metro, Depot)
    Geographic coordinates aligned with Canvas planar topology.
    """
    nodes = [
        {"id": "W1", "label": "Water Treatment Plant", "type": "reservoir", "lat": 13.0150, "lng": 77.5550, "x": 120, "y": 140, "icon": "💧"},
        {"id": "P1", "label": "Main Power Substation", "type": "substation", "lat": 12.9450, "lng": 77.5450, "x": 140, "y": 380, "icon": "⚡"},
        {"id": "H1", "label": "Central Hospital", "type": "hospital", "lat": 13.0150, "lng": 77.6250, "x": 480, "y": 150, "icon": "🏥"},
        {"id": "CBD", "label": "Central Business Dist.", "type": "commercial", "lat": 12.9750, "lng": 77.6050, "x": 440, "y": 320, "icon": "🏢"},
        {"id": "M1", "label": "Central Metro Station", "type": "metro_hub", "lat": 12.9800, "lng": 77.5750, "x": 300, "y": 240, "icon": "🚇"},
        {"id": "M2", "label": "East Metro Junction", "type": "metro_hub", "lat": 12.9750, "lng": 77.6500, "x": 660, "y": 260, "icon": "🚇"},
        {"id": "R1", "label": "North Residential Sector", "type": "residential", "lat": 13.0300, "lng": 77.5900, "x": 310, "y": 70, "icon": "🏘️"},
        {"id": "R2", "label": "South Residential Sector", "type": "residential", "lat": 12.9350, "lng": 77.5900, "x": 320, "y": 480, "icon": "🏘️"},
        {"id": "R3", "label": "East Residential Hub", "type": "residential", "lat": 12.9850, "lng": 77.6900, "x": 780, "y": 160, "icon": "🏘️"},
        {"id": "R4", "label": "West Suburbs", "type": "residential", "lat": 12.9850, "lng": 77.5300, "x": 80, "y": 260, "icon": "🏘️"},
        {"id": "D1", "label": "Municipal Depot / Fleet", "type": "depot", "lat": 12.9250, "lng": 77.6200, "x": 580, "y": 460, "icon": "🚛"},
        {"id": "U1", "label": "Smart University Campus", "type": "education", "lat": 12.9450, "lng": 77.6350, "x": 680, "y": 390, "icon": "🎓"},
    ]

    edges = [
        # Roads and utility corridors connecting the smart city
        {"id": "e1", "u": "W1", "v": "R1", "name": "North Aqueduct Blvd", "length": 3.2, "traffic": 1.2, "cost": 320000, "mode": "road"},
        {"id": "e2", "u": "W1", "v": "M1", "name": "Reservoir Ave", "length": 2.5, "traffic": 1.0, "cost": 250000, "mode": "road"},
        {"id": "e3", "u": "W1", "v": "R4", "name": "West Water Channel", "length": 1.8, "traffic": 1.1, "cost": 180000, "mode": "road"},
        {"id": "e4", "u": "R4", "v": "P1", "name": "Substation Linkway", "length": 2.0, "traffic": 1.0, "cost": 200000, "mode": "road"},
        {"id": "e5", "u": "P1", "v": "R2", "name": "Grid Corridor South", "length": 3.1, "traffic": 1.4, "cost": 310000, "mode": "road"},
        {"id": "e6", "u": "P1", "v": "M1", "name": "Powerway Central", "length": 2.8, "traffic": 1.5, "cost": 280000, "mode": "road"},
        {"id": "e7", "u": "R1", "v": "H1", "name": "Emergency North Expressway", "length": 2.9, "traffic": 2.4, "cost": 290000, "mode": "road"},
        {"id": "e8", "u": "R1", "v": "M1", "name": "Civic Link", "length": 2.1, "traffic": 1.3, "cost": 210000, "mode": "road"},
        {"id": "e9", "u": "M1", "v": "CBD", "name": "Financial Mall Road", "length": 2.0, "traffic": 2.8, "cost": 200000, "mode": "road"},
        {"id": "e10", "u": "M1", "v": "M2", "name": "Blue Metro Rapid Line", "length": 3.8, "traffic": 1.0, "cost": 750000, "mode": "metro"},
        {"id": "e11", "u": "H1", "v": "CBD", "name": "Hospital Parkway", "length": 2.2, "traffic": 1.8, "cost": 220000, "mode": "road"},
        {"id": "e12", "u": "H1", "v": "R3", "name": "East Medical Access", "length": 3.4, "traffic": 1.1, "cost": 340000, "mode": "road"},
        {"id": "e13", "u": "CBD", "v": "D1", "name": "Commercial South Way", "length": 2.4, "traffic": 1.6, "cost": 240000, "mode": "road"},
        {"id": "e14", "u": "R2", "v": "D1", "name": "Sanitation Ring Road", "length": 3.0, "traffic": 1.2, "cost": 300000, "mode": "road"},
        {"id": "e15", "u": "CBD", "v": "M2", "name": "Tech Corridor", "length": 2.3, "traffic": 2.0, "cost": 230000, "mode": "road"},
        {"id": "e16", "u": "M2", "v": "R3", "name": "East Metro Extension", "length": 1.9, "traffic": 1.2, "cost": 190000, "mode": "road"},
        {"id": "e17", "u": "M2", "v": "U1", "name": "Campus Boulevard", "length": 1.7, "traffic": 1.1, "cost": 170000, "mode": "road"},
        {"id": "e18", "u": "D1", "v": "U1", "name": "Municipal Utility Road", "length": 1.5, "traffic": 1.0, "cost": 150000, "mode": "road"}
    ]

    return {"name": "Neo-Metropolis Smart Grid", "nodes": nodes, "edges": edges}


def get_eulerian_sweeper_grid() -> Dict[str, Any]:
    """
    Eulerian Street Sweeping Grid
    Every vertex has degree 4 or 2 (All even degrees -> Perfect Euler Circuit)
    """
    nodes = [
        {"id": "D0", "label": "Municipal Depot", "type": "depot", "x": 100, "y": 100, "icon": "🚛"},
        {"id": "S1", "label": "Sector 1 Crossing", "type": "junction", "x": 300, "y": 100, "icon": "🛑"},
        {"id": "S2", "label": "Sector 2 Crossing", "type": "junction", "x": 500, "y": 100, "icon": "🛑"},
        {"id": "S3", "label": "Sector 3 Crossing", "type": "junction", "x": 100, "y": 300, "icon": "🛑"},
        {"id": "S4", "label": "Central Sector Crossing", "type": "junction", "x": 300, "y": 300, "icon": "🛑"},
        {"id": "S5", "label": "Sector 5 Crossing", "type": "junction", "x": 500, "y": 300, "icon": "🛑"},
    ]

    # Designed such that all vertices have even degree (deg = 2 or 4) or 0 odd
    # Let's verify degrees:
    # D0: connects to S1, S3, S4, S1(wait, simple graph):
    # D0-S1, S1-S2, S2-S5, S5-S4, S4-S3, S3-D0 (outer cycle: all deg 2)
    # Add diagonals: D0-S4, S1-S4, S2-S4, S5-S4, S3-S4?
    # Let's ensure:
    # D0: (S1, S3, S4, S2? let's make deg 4 or 2)
    edges = [
        {"id": "sw1", "u": "D0", "v": "S1", "name": "1st Ave North", "length": 2.0, "traffic": 1.0, "cost": 200000, "mode": "road"},
        {"id": "sw2", "u": "S1", "v": "S2", "name": "2nd Ave North", "length": 2.0, "traffic": 1.0, "cost": 200000, "mode": "road"},
        {"id": "sw3", "u": "S2", "v": "S5", "name": "East Perimeter Way", "length": 2.0, "traffic": 1.0, "cost": 200000, "mode": "road"},
        {"id": "sw4", "u": "S5", "v": "S4", "name": "Central Way East", "length": 2.0, "traffic": 1.0, "cost": 200000, "mode": "road"},
        {"id": "sw5", "u": "S4", "v": "S3", "name": "Central Way West", "length": 2.0, "traffic": 1.0, "cost": 200000, "mode": "road"},
        {"id": "sw6", "u": "S3", "v": "D0", "name": "West Perimeter Way", "length": 2.0, "traffic": 1.0, "cost": 200000, "mode": "road"},
        # Cross diagonals through S4:
        {"id": "sw7", "u": "D0", "v": "S4", "name": "Depot Diagonal", "length": 2.8, "traffic": 1.0, "cost": 280000, "mode": "road"},
        {"id": "sw8", "u": "S1", "v": "S4", "name": "North Diagonal", "length": 2.0, "traffic": 1.0, "cost": 200000, "mode": "road"},
        {"id": "sw9", "u": "S2", "v": "S4", "name": "North-East Diagonal", "length": 2.8, "traffic": 1.0, "cost": 280000, "mode": "road"},
        {"id": "sw10", "u": "S3", "v": "S4", "name": "West Loopback", "length": 2.0, "traffic": 1.0, "cost": 200000, "mode": "road"}, # duplicate edge? Let's use simple graph
    ]
    # In simple graphs, let's make an octahedron or envelope graph:
    # 6 nodes: A, B, C, D, E, F with degrees all 4 (Regular graph of degree 4, or cycle + chord)
    # Complete bipartite K_{3,3} is 3-regular (all odd 3).
    # Octahedron has 6 vertices, 12 edges, every vertex has degree 4! Perfect Euler graph!
    nodes_octa = [
        {"id": "D0", "label": "Depot Central", "type": "depot", "lat": 12.9450, "lng": 77.6250, "x": 300, "y": 80, "icon": "🚛"},
        {"id": "N1", "label": "North-West Ward", "type": "residential", "lat": 12.9350, "lng": 77.6100, "x": 150, "y": 200, "icon": "🏘️"},
        {"id": "N2", "label": "North-East Ward", "type": "residential", "lat": 12.9350, "lng": 77.6400, "x": 450, "y": 200, "icon": "🏘️"},
        {"id": "S1", "label": "South-West Ward", "type": "residential", "lat": 12.9150, "lng": 77.6100, "x": 150, "y": 380, "icon": "🏘️"},
        {"id": "S2", "label": "South-East Ward", "type": "residential", "lat": 12.9150, "lng": 77.6400, "x": 450, "y": 380, "icon": "🏘️"},
        {"id": "C0", "label": "South Sub-Depot", "type": "depot", "lat": 12.9050, "lng": 77.6250, "x": 300, "y": 500, "icon": "🚛"},
    ]
    # Every node has degree 4:
    edges_octa = [
        {"id": "e_d0_n1", "u": "D0", "v": "N1", "name": "Street 1", "length": 2.0, "traffic": 1.0, "cost": 100000, "mode": "road"},
        {"id": "e_d0_n2", "u": "D0", "v": "N2", "name": "Street 2", "length": 2.0, "traffic": 1.0, "cost": 100000, "mode": "road"},
        {"id": "e_d0_s1", "u": "D0", "v": "S1", "name": "Street 3", "length": 3.5, "traffic": 1.0, "cost": 150000, "mode": "road"},
        {"id": "e_d0_s2", "u": "D0", "v": "S2", "name": "Street 4", "length": 3.5, "traffic": 1.0, "cost": 150000, "mode": "road"},

        {"id": "e_c0_n1", "u": "C0", "v": "N1", "name": "Street 5", "length": 3.5, "traffic": 1.0, "cost": 150000, "mode": "road"},
        {"id": "e_c0_n2", "u": "C0", "v": "N2", "name": "Street 6", "length": 3.5, "traffic": 1.0, "cost": 150000, "mode": "road"},
        {"id": "e_c0_s1", "u": "C0", "v": "S1", "name": "Street 7", "length": 2.0, "traffic": 1.0, "cost": 100000, "mode": "road"},
        {"id": "e_c0_s2", "u": "C0", "v": "S2", "name": "Street 8", "length": 2.0, "traffic": 1.0, "cost": 100000, "mode": "road"},

        {"id": "e_n1_n2", "u": "N1", "v": "N2", "name": "Street 9", "length": 3.0, "traffic": 1.0, "cost": 120000, "mode": "road"},
        {"id": "e_n1_s1", "u": "N1", "v": "S1", "name": "Street 10", "length": 2.5, "traffic": 1.0, "cost": 110000, "mode": "road"},
        {"id": "e_n2_s2", "u": "N2", "v": "S2", "name": "Street 11", "length": 2.5, "traffic": 1.0, "cost": 110000, "mode": "road"},
        {"id": "e_s1_s2", "u": "S1", "v": "S2", "name": "Street 12", "length": 3.0, "traffic": 1.0, "cost": 120000, "mode": "road"},
    ]
    # Let's count degrees:
    # D0: N1, N2, S1, S2 -> 4
    # C0: N1, N2, S1, S2 -> 4
    # N1: D0, C0, N2, S1 -> 4
    # N2: D0, C0, N1, S2 -> 4
    # S1: D0, C0, N1, S2 -> 4
    # S2: D0, C0, N2, S1 -> 4
    # ALL DEGREES ARE EXACTLY 4! 100% Euler Circuit guaranteed!
    return {"name": "Perfect Eulerian Sweeper Grid (Regular Deg 4)", "nodes": nodes_octa, "edges": edges_octa}


def get_planarity_dilemma_grid() -> Dict[str, Any]:
    """
    Famous Utilities Problem K_{3,3} (Three Utilities to Three Houses)
    Proves why underground utility lines clash in 2D and require multi-level routing.
    """
    nodes = [
        {"id": "Gas", "label": "Gas Plant (U1)", "type": "reservoir", "lat": 12.9920, "lng": 77.5800, "x": 150, "y": 120, "icon": "⛽"},
        {"id": "Water", "label": "Water Plant (U2)", "type": "reservoir", "lat": 12.9920, "lng": 77.5950, "x": 350, "y": 120, "icon": "💧"},
        {"id": "Power", "label": "Power Station (U3)", "type": "substation", "lat": 12.9920, "lng": 77.6100, "x": 550, "y": 120, "icon": "⚡"},

        {"id": "HouseA", "label": "Residential Complex A", "type": "residential", "lat": 12.9780, "lng": 77.5800, "x": 150, "y": 380, "icon": "🏠"},
        {"id": "HouseB", "label": "Residential Complex B", "type": "residential", "lat": 12.9780, "lng": 77.5950, "x": 350, "y": 380, "icon": "🏠"},
        {"id": "HouseC", "label": "Residential Complex C", "type": "residential", "lat": 12.9780, "lng": 77.6100, "x": 550, "y": 380, "icon": "🏠"},
    ]

    # Connect every utility to every house (Complete Bipartite K_{3,3})
    edges = [
        {"id": "k1", "u": "Gas", "v": "HouseA", "name": "Gas Pipe A", "length": 3.0, "traffic": 1.0, "cost": 300000, "mode": "utility"},
        {"id": "k2", "u": "Gas", "v": "HouseB", "name": "Gas Pipe B", "length": 3.5, "traffic": 1.0, "cost": 350000, "mode": "utility"},
        {"id": "k3", "u": "Gas", "v": "HouseC", "name": "Gas Pipe C", "length": 4.5, "traffic": 1.0, "cost": 450000, "mode": "utility"},

        {"id": "k4", "u": "Water", "v": "HouseA", "name": "Water Pipe A", "length": 3.5, "traffic": 1.0, "cost": 350000, "mode": "utility"},
        {"id": "k5", "u": "Water", "v": "HouseB", "name": "Water Pipe B", "length": 3.0, "traffic": 1.0, "cost": 300000, "mode": "utility"},
        {"id": "k6", "u": "Water", "v": "HouseC", "name": "Water Pipe C", "length": 3.5, "traffic": 1.0, "cost": 350000, "mode": "utility"},

        {"id": "k7", "u": "Power", "v": "HouseA", "name": "Power Cable A", "length": 4.5, "traffic": 1.0, "cost": 450000, "mode": "utility"},
        {"id": "k8", "u": "Power", "v": "HouseB", "name": "Power Cable B", "length": 3.5, "traffic": 1.0, "cost": 350000, "mode": "utility"},
        {"id": "k9", "u": "Power", "v": "HouseC", "name": "Power Cable C", "length": 3.0, "traffic": 1.0, "cost": 300000, "mode": "utility"},
    ]

    return {"name": "K3,3 Utility Problem (Non-Planar Crossover Proof)", "nodes": nodes, "edges": edges}
