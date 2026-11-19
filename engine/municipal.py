"""
Smart Urban Multi-Modal Route & Infrastructure Optimizer
Phase 2 - Subsystem A: Municipal Traversal Engine (Module IV)
Covers:
  - Euler Trails and Circuits (Hierholzer's Algorithm for Street Sweeping/Waste Management)
  - Hamiltonian Paths and Cycles (Backtracking / TSP for Smart Security Patrols)
"""
from typing import Dict, List, Any, Optional
from collections import defaultdict
from .graph import CityGraph


class MunicipalTraversalEngine:
    """
    Solves edge-covering (Euler) and vertex-visiting (Hamiltonian) municipal logistics.
    """
    def __init__(self, city_graph: CityGraph):
        self.graph = city_graph

    def analyze_eulerian_status(self) -> Dict[str, Any]:
        """
        Syllabus Mapping: Module IV - Euler Trails and Circuits
        Theorem (Euler):
        - A connected graph G has an Euler Circuit iff every vertex has an EVEN degree.
        - A connected graph G has an Euler Trail iff it has EXACTLY TWO vertices with ODD degree.
        """
        degrees = self.graph.get_vertex_degrees()
        odd_nodes = [node_id for node_id, deg in degrees.items() if deg % 2 != 0]
        even_nodes = [node_id for node_id, deg in degrees.items() if deg % 2 == 0]

        is_connected = True  # We assume connected subgraph for active streets
        if len(self.graph.nodes) > 0:
            # Check if non-zero degree vertices belong to a single component
            active_nodes = [n for n, d in degrees.items() if d > 0]
            if len(active_nodes) > 1:
                start = active_nodes[0]
                visited = set([start])
                queue = [start]
                while queue:
                    curr = queue.pop(0)
                    for edge in self.graph.adj.get(curr, []):
                        nbr = edge["v"] if edge["u"] == curr else edge["u"]
                        if nbr not in visited:
                            visited.add(nbr)
                            queue.append(nbr)
                if len(visited) != len(active_nodes):
                    is_connected = False

        status = "NONE"
        description = ""
        start_node_recommendation = None

        if not is_connected:
            status = "DISCONNECTED"
            description = "Graph is disconnected; street sweeper cannot reach all corridors."
        elif len(odd_nodes) == 0 and len(self.graph.edges) > 0:
            status = "EULER_CIRCUIT"
            description = (
                "🏆 Perfect Euler Circuit Exists! All vertices have even degrees. "
                "The street sweeper or garbage truck can start at ANY depot, traverse EVERY street "
                "exactly once with ZERO deadhead re-travel, and return to the starting depot."
            )
            start_node_recommendation = list(self.graph.nodes.keys())[0] if self.graph.nodes else None
        elif len(odd_nodes) == 2:
            status = "EULER_TRAIL"
            description = (
                f"🚚 Euler Trail Exists! Exactly two vertices have odd degrees: {odd_nodes}. "
                f"A continuous route covers every street exactly once, starting at {odd_nodes[0]} "
                f"and terminating at {odd_nodes[1]}."
            )
            start_node_recommendation = odd_nodes[0]
        else:
            status = "NON_EULERIAN"
            description = (
                f"⚠️ Non-Eulerian Network: {len(odd_nodes)} vertices have odd degrees. "
                f"Euler's theorem requires 0 or 2 odd vertices. "
                f"To sweep every street, the municipal fleet must re-traverse (double-cover) "
                f"at least {len(odd_nodes) // 2} street segments (Chinese Postman Problem)."
            )

        return {
            "status": status,
            "is_connected": is_connected,
            "odd_degree_count": len(odd_nodes),
            "odd_degree_nodes": odd_nodes,
            "even_degree_nodes": even_nodes,
            "description": description,
            "start_node_recommendation": start_node_recommendation,
            "euler_theorem_rule": "Euler Circuit: 0 odd vertices | Euler Trail: 2 odd vertices"
        }

    def generate_eulerian_route(self, start_node: Optional[str] = None) -> Dict[str, Any]:
        """
        Implements Hierholzer's Algorithm O(E) to find an Eulerian circuit or trail.
        """
        analysis = self.analyze_eulerian_status()
        if analysis["status"] not in ["EULER_CIRCUIT", "EULER_TRAIL"]:
            return {
                "success": False,
                "analysis": analysis,
                "error": analysis["description"]
            }

        # Multi-edge adjacency tracking
        adj = defaultdict(list)
        edge_map = {}
        for idx, edge in enumerate(self.graph.edges):
            u, v = edge["u"], edge["v"]
            edge_id = edge.get("id", f"edge_{idx}")
            edge_map[edge_id] = edge
            adj[u].append((v, edge_id))
            adj[v].append((u, edge_id))

        # Pick start node
        if not start_node or start_node not in self.graph.nodes:
            start_node = analysis["start_node_recommendation"]

        curr_path = [start_node]
        circuit = []
        used_edges = set()

        while curr_path:
            curr_v = curr_path[-1]

            # Find an unused incident edge
            next_edge = None
            next_v = None
            while adj[curr_v]:
                cand_v, cand_eid = adj[curr_v].pop()
                if cand_eid not in used_edges:
                    next_edge = cand_eid
                    next_v = cand_v
                    used_edges.add(cand_eid)
                    break

            if next_edge is not None:
                curr_path.append(next_v)
            else:
                circuit.append(curr_path.pop())

        circuit.reverse()

        # Build detailed step list
        route_steps = []
        for i in range(len(circuit) - 1):
            route_steps.append({
                "step": i + 1,
                "from": circuit[i],
                "to": circuit[i + 1]
            })

        return {
            "success": True,
            "type": analysis["status"],
            "start_node": start_node,
            "end_node": circuit[-1] if circuit else start_node,
            "nodes_sequence": circuit,
            "edges_traversed_count": len(circuit) - 1,
            "total_network_edges": len(self.graph.edges),
            "covers_all_edges_strictly_once": len(circuit) - 1 == len(self.graph.edges),
            "route_steps": route_steps,
            "analysis": analysis,
            "algorithm": "Hierholzer's Algorithm O(E)"
        }

    def find_hamiltonian_cycle(self, start_node: Optional[str] = None) -> Dict[str, Any]:
        """
        Syllabus Mapping: Module IV - Hamilton Paths and Cycles
        Finds a closed cycle that visits EVERY VERTEX exactly once and returns to start.
        Used for Smart Security Patrols / Inspector rounds.
        """
        nodes = list(self.graph.nodes.keys())
        V = len(nodes)
        if V == 0:
            return {"success": False, "error": "Graph is empty."}
        if V == 1:
            return {"success": True, "cycle": [nodes[0], nodes[0]], "is_hamiltonian": True}

        # Check Dirac's Theorem condition: If deg(v) >= V / 2 for all v, Hamiltonian cycle is guaranteed
        degrees = self.graph.get_vertex_degrees()
        min_deg = min(degrees.values()) if degrees else 0
        dirac_satisfied = (min_deg >= V / 2.0) and (V >= 3)

        if not start_node or start_node not in self.graph.nodes:
            start_node = nodes[0]

        path = [start_node]
        visited = set([start_node])

        def backtrack(curr: str) -> bool:
            if len(path) == V:
                # Check if there is an edge back to start_node to complete the cycle
                for edge in self.graph.adj.get(curr, []):
                    nbr = edge["v"] if edge["u"] == curr else edge["u"]
                    if nbr == start_node:
                        path.append(start_node)
                        return True
                return False

            for edge in self.graph.adj.get(curr, []):
                nbr = edge["v"] if edge["u"] == curr else edge["u"]
                if nbr not in visited:
                    visited.add(nbr)
                    path.append(nbr)
                    if backtrack(nbr):
                        return True
                    visited.remove(nbr)
                    path.pop()

            return False

        found = backtrack(start_node)

        return {
            "success": found,
            "is_hamiltonian": found,
            "start_node": start_node,
            "cycle_nodes": path if found else [],
            "dirac_theorem": {
                "condition": "deg(v) >= |V| / 2 for all v",
                "min_degree": min_deg,
                "required_threshold": V / 2.0,
                "satisfied": dirac_satisfied,
                "note": "Dirac's theorem is a SUFFICIENT condition (satisfying it guarantees a cycle, but cycles can still exist without it)."
            },
            "summary": (
                f"✅ Hamiltonian Security Patrol Cycle Found! Covers all {V} sectors once and returns to {start_node}."
                if found
                else f"❌ No Hamiltonian Cycle exists in this topology (or start node {start_node} cannot complete a closed cycle)."
            )
        }
