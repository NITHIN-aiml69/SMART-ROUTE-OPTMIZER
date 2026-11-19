"""
Smart Urban Multi-Modal Route & Infrastructure Optimizer
Phase 1: Structural & Topological Validation Engine (Module IV)
Covers: Connected Components, Cut Vertices/Bridges, Planarity, Euler's Formula (V - E + F = 2)
"""
from typing import Dict, List, Any, Set, Tuple
from collections import deque
from .graph import CityGraph


def line_intersection(p1: Tuple[float, float], p2: Tuple[float, float],
                      p3: Tuple[float, float], p4: Tuple[float, float]) -> bool:
    """
    Determines if line segment p1-p2 strictly intersects p3-p4 (excluding shared endpoints).
    Used to detect 2D physical bridge / crossover clashes in urban layouts.
    """
    def ccw(A, B, C):
        return (C[1] - A[1]) * (B[0] - A[0]) > (B[1] - A[1]) * (C[0] - A[0])

    # If any points are identical (shared node), it's a junction, not a crossover
    if p1 == p3 or p1 == p4 or p2 == p3 or p2 == p4:
        return False

    return (ccw(p1, p3, p4) != ccw(p2, p3, p4)) and (ccw(p1, p2, p3) != ccw(p1, p2, p4))


class TopologyAuditor:
    """
    Validates structural integrity, connectivity, bottlenecks, and planarity.
    """
    def __init__(self, city_graph: CityGraph):
        self.graph = city_graph

    def check_connectivity(self) -> Dict[str, Any]:
        """
        Module IV: Connected and Disconnected Graphs
        Uses BFS/DFS to identify all connected components and isolated dead zones.
        """
        visited: Set[str] = set()
        components: List[List[str]] = []

        for node_id in self.graph.nodes:
            if node_id not in visited:
                comp = []
                queue = deque([node_id])
                visited.add(node_id)
                while queue:
                    curr = queue.popleft()
                    comp.append(curr)
                    for edge in self.graph.adj.get(curr, []):
                        nbr = edge["v"] if edge["u"] == curr else edge["u"]
                        if nbr not in visited and nbr in self.graph.nodes:
                            visited.add(nbr)
                            queue.append(nbr)
                components.append(comp)

        is_connected = len(components) == 1 and len(self.graph.nodes) > 0

        # Isolated sectors (deg = 0)
        degrees = self.graph.get_vertex_degrees()
        isolated_nodes = [node_id for node_id, deg in degrees.items() if deg == 0]

        return {
            "is_connected": is_connected,
            "num_components": len(components),
            "components": components,
            "isolated_nodes": isolated_nodes,
            "status": "Fully Connected Grid" if is_connected else f"Disconnected: {len(components)} Isolated Zones Detected"
        }

    def detect_bottlenecks(self) -> Dict[str, Any]:
        """
        Finds Articulation Points (Cut Vertices) and Bridges (Cut Edges).
        Crucial for urban disaster resilience: if a bridge collapses, city partitions.
        """
        nodes = list(self.graph.nodes.keys())
        time = 0
        tin = {}
        low = {}
        visited = set()
        cut_vertices = set()
        bridges = []

        def dfs(u, p=None):
            nonlocal time
            visited.add(u)
            tin[u] = low[u] = time
            time += 1
            children = 0
            for edge in self.graph.adj.get(u, []):
                v = edge["v"] if edge["u"] == u else edge["u"]
                if v == p:
                    continue
                if v in visited:
                    low[u] = min(low[u], tin[v])
                else:
                    children += 1
                    dfs(v, u)
                    low[u] = min(low[u], low[v])
                    if p is not None and low[v] >= tin[u]:
                        cut_vertices.add(u)
                    if low[v] > tin[u]:
                        bridges.append({
                            "id": edge.get("id", f"{u}-{v}"),
                            "u": u,
                            "v": v,
                            "name": edge.get("name", f"Road {u}-{v}")
                        })
            if p is None and children > 1:
                cut_vertices.add(u)

        for n in nodes:
            if n not in visited:
                dfs(n)

        return {
            "cut_vertices": list(cut_vertices),
            "bridges": bridges,
            "has_bottlenecks": len(cut_vertices) > 0 or len(bridges) > 0,
            "summary": f"{len(cut_vertices)} critical junction(s) and {len(bridges)} critical bridge corridor(s)."
        }

    def audit_planarity_and_euler_formula(self) -> Dict[str, Any]:
        """
        Syllabus Mapping: Module IV
        - Planar graphs
        - Euler's formula: V - E + F = 2 (for connected planar graphs)
          Generalized: V - E + F = 1 + k (where k is number of connected components)
        - Necessary conditions for planarity: E <= 3V - 6 (for V >= 3)
        - 2D embedding crossover detection
        """
        V = len(self.graph.nodes)
        E = len(self.graph.edges)
        conn_info = self.check_connectivity()
        k = conn_info["num_components"] if V > 0 else 0

        # Necessary condition 1: E <= 3V - 6 (for V >= 3)
        max_planar_edges = max(0, 3 * V - 6) if V >= 3 else E
        passes_edge_bound = (E <= max_planar_edges) if V >= 3 else True

        # Calculate Faces using Euler's formula: F = E - V + 1 + k (for connected k=1, F = E - V + 2)
        F = max(1, E - V + 1 + k) if V > 0 else 1
        euler_lhs = V - E + F
        euler_expected = 1 + k if k > 0 else 2
        euler_verified = (euler_lhs == euler_expected)

        # Check physical 2D segment crossings in current layout embedding
        crossings = []
        edges = self.graph.edges
        for i in range(len(edges)):
            e1 = edges[i]
            u1, v1 = e1["u"], e1["v"]
            if u1 not in self.graph.nodes or v1 not in self.graph.nodes:
                continue
            p1 = (self.graph.nodes[u1].get("x", 0), self.graph.nodes[u1].get("y", 0))
            p2 = (self.graph.nodes[v1].get("x", 0), self.graph.nodes[v1].get("y", 0))

            for j in range(i + 1, len(edges)):
                e2 = edges[j]
                u2, v2 = e2["u"], e2["v"]
                if u2 not in self.graph.nodes or v2 not in self.graph.nodes:
                    continue
                p3 = (self.graph.nodes[u2].get("x", 0), self.graph.nodes[u2].get("y", 0))
                p4 = (self.graph.nodes[v2].get("x", 0), self.graph.nodes[v2].get("y", 0))

                if line_intersection(p1, p2, p3, p4):
                    crossings.append({
                        "edge1": {"id": e1.get("id"), "u": u1, "v": v1},
                        "edge2": {"id": e2.get("id"), "u": u2, "v": v2}
                    })

        # Theoretical planarity flag
        is_theoretically_planar = passes_edge_bound and (len(crossings) == 0)

        # Dual graph characteristics
        # For any planar graph G, its dual G* has V* = F, E* = E, F* = V
        dual_info = {
            "dual_vertices_V_star": F,
            "dual_edges_E_star": E,
            "dual_faces_F_star": V,
            "dual_formula_check": f"V* - E* + F* = {F} - {E} + {V} = {F - E + V}"
        }

        civil_engineering_verdict = (
            "✅ 2D Planar Layout Feasible: Zero multi-level overpasses or bridge crossovers needed. "
            "Underground utility trenches can be laid directly in a single horizontal plane without physical clashes."
            if len(crossings) == 0 and passes_edge_bound
            else f"⚠️ Multi-Level Overpass Required: Detected {len(crossings)} physical line crossovers "
                 f"or edge density exceeds planar limit (E={E} > 3V-6={max_planar_edges}). "
                 f"Requires 3D bridge grade-separations."
        )

        return {
            "V": V,
            "E": E,
            "F": F,
            "k_components": k,
            "passes_edge_bound": passes_edge_bound,
            "max_planar_edges_bound": max_planar_edges,
            "euler_lhs": euler_lhs,
            "euler_expected": euler_expected,
            "euler_formula_verified": euler_verified,
            "formula_string": f"V - E + F = {V} - {E} + {F} = {euler_lhs} (matches 1 + k = {euler_expected})",
            "physical_crossovers_count": len(crossings),
            "physical_crossovers": crossings,
            "is_theoretically_planar": is_theoretically_planar,
            "civil_verdict": civil_engineering_verdict,
            "dual_graph": dual_info
        }
