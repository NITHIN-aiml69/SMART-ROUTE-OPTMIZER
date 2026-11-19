"""
Smart Urban Multi-Modal Route & Infrastructure Optimizer
Graph Data Structure & Handshaking Theorem Engine (Module IV)
"""
from typing import Dict, List, Any, Tuple


class CityGraph:
    """
    Represents the Smart City multi-modal and utility network graph G = (V, E, W).
    """
    def __init__(self, data: Dict[str, Any] = None):
        self.nodes: Dict[str, Dict[str, Any]] = {}
        self.edges: List[Dict[str, Any]] = []
        self.adj: Dict[str, List[Dict[str, Any]]] = {}

        if data:
            self.load_from_dict(data)

    def load_from_dict(self, data: Dict[str, Any]):
        self.nodes = {n["id"]: n for n in data.get("nodes", [])}
        self.edges = data.get("edges", [])
        self.rebuild_adjacency()

    def rebuild_adjacency(self):
        self.adj = {node_id: [] for node_id in self.nodes}
        for edge in self.edges:
            u, v = edge["u"], edge["v"]
            if u in self.adj and v in self.adj:
                self.adj[u].append(edge)
                if not edge.get("directed", False):
                    self.adj[v].append(edge)

    def get_vertex_degrees(self) -> Dict[str, int]:
        """
        Computes deg(v) for each vertex in the network.
        For undirected edges, deg(v) = number of incident edges.
        """
        degrees = {node_id: 0 for node_id in self.nodes}
        for edge in self.edges:
            u, v = edge["u"], edge["v"]
            if u in degrees:
                degrees[u] += 1
            if v in degrees:
                degrees[v] += 1
        return degrees

    def verify_handshaking_property(self) -> Dict[str, Any]:
        """
        Syllabus Mapping: Module IV - Handshaking Property
        Theorem: In every finite undirected graph G = (V, E),
                 sum_{v in V} deg(v) = 2 * |E|
        Corollary: The number of vertices with odd degree is always even.
        """
        degrees = self.get_vertex_degrees()
        sum_of_degrees = sum(degrees.values())
        num_edges = len(self.edges)
        two_e = 2 * num_edges
        is_handshaking_valid = (sum_of_degrees == two_e)

        odd_degree_nodes = [node_id for node_id, deg in degrees.items() if deg % 2 != 0]
        even_degree_nodes = [node_id for node_id, deg in degrees.items() if deg % 2 == 0]

        is_odd_count_even = (len(odd_degree_nodes) % 2 == 0)

        degree_sequence = sorted(list(degrees.values()), reverse=True)

        return {
            "num_vertices": len(self.nodes),
            "num_edges": num_edges,
            "degrees": degrees,
            "degree_sequence": degree_sequence,
            "sum_of_degrees": sum_of_degrees,
            "two_e": two_e,
            "handshaking_verified": is_handshaking_valid,
            "odd_degree_vertices": odd_degree_nodes,
            "odd_degree_count": len(odd_degree_nodes),
            "even_degree_vertices": even_degree_nodes,
            "even_degree_count": len(even_degree_nodes),
            "odd_count_is_even": is_odd_count_even,
            "formula": "∑ deg(v) = 2 · |E|",
            "proof_statement": (
                f"Sum of degrees = {sum_of_degrees}. "
                f"2 * |E| = 2 * {num_edges} = {two_e}. "
                f"Handshaking Theorem is {'SATISFIED' if is_handshaking_valid else 'VIOLATED'}. "
                f"Number of odd-degree vertices = {len(odd_degree_nodes)} (even number)."
            )
        }

    def to_dict(self) -> Dict[str, Any]:
        return {
            "nodes": list(self.nodes.values()),
            "edges": self.edges
        }
