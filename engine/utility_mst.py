"""
Smart Urban Multi-Modal Route & Infrastructure Optimizer
Phase 2 - Subsystem B: Utility Infrastructure Optimizer (Module V)
Covers: Spanning Trees, Kruskal's Algorithm (DSU), Prim's Algorithm (Min-Heap)
"""
import heapq
import time
from typing import Dict, List, Any, Optional
from .graph import CityGraph


class DisjointSetUnion:
    """
    Disjoint Set Union (Union-Find) with Path Compression and Union by Rank.
    Used in Kruskal's algorithm to detect and prevent cycles in O(alpha(V)) time.
    """
    def __init__(self, elements: List[str]):
        self.parent = {x: x for x in elements}
        self.rank = {x: 0 for x in elements}

    def find(self, x: str) -> str:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]

    def union(self, x: str, y: str) -> bool:
        root_x = self.find(x)
        root_y = self.find(y)
        if root_x == root_y:
            return False  # Same set -> cycle detected!

        # Union by rank
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        return True


class UtilityMSTOptimizer:
    """
    Solves the optimal water pipeline / fiber-optic cable / power grid layout problem.
    """
    def __init__(self, city_graph: CityGraph):
        self.graph = city_graph

    def get_edge_cost(self, edge: Dict[str, Any]) -> float:
        """Utility construction cost based on distance and underground drilling factor."""
        base_cost = float(edge.get("cost", edge.get("length", 1.0) * 100000.0))
        return base_cost

    def run_kruskals_algorithm(self) -> Dict[str, Any]:
        """
        Syllabus Mapping: Module V - Kruskal's Algorithm
        Sorts all candidate edges, adds cheapest edge that does not form a cycle (via DSU).
        Complexity: O(E log E)
        """
        start_time = time.perf_counter()
        nodes = list(self.graph.nodes.keys())
        V = len(nodes)
        if V <= 1:
            return {"success": True, "mst_edges": [], "total_cost": 0.0, "algorithm": "Kruskal"}

        # Sort edges by cost
        sorted_edges = sorted(self.graph.edges, key=lambda e: self.get_edge_cost(e))
        dsu = DisjointSetUnion(nodes)

        mst_edges: List[Dict[str, Any]] = []
        rejected_cycle_edges: List[Dict[str, Any]] = []
        step_log: List[Dict[str, Any]] = []

        for edge in sorted_edges:
            u, v = edge["u"], edge["v"]
            cost = self.get_edge_cost(edge)
            if u not in dsu.parent or v not in dsu.parent:
                continue

            if dsu.union(u, v):
                mst_edges.append(edge)
                step_log.append({
                    "step": len(step_log) + 1,
                    "edge": f"{u} — {v}",
                    "cost": cost,
                    "action": "ADDED to MST",
                    "reason": "Connects two disjoint components (no cycle)"
                })
                if len(mst_edges) == V - 1:
                    break
            else:
                rejected_cycle_edges.append(edge)
                step_log.append({
                    "step": len(step_log) + 1,
                    "edge": f"{u} — {v}",
                    "cost": cost,
                    "action": "REJECTED",
                    "reason": "Forms a redundant cycle (loop)"
                })

        elapsed_ms = (time.perf_counter() - start_time) * 1000
        total_mst_cost = sum(self.get_edge_cost(e) for e in mst_edges)
        total_orig_cost = sum(self.get_edge_cost(e) for e in self.graph.edges)

        savings = max(0.0, total_orig_cost - total_mst_cost)
        savings_pct = (savings / total_orig_cost * 100.0) if total_orig_cost > 0 else 0.0

        is_spanning = (len(mst_edges) == V - 1)

        return {
            "success": is_spanning,
            "algorithm": "Kruskal's Algorithm (Greedy Edge-Sort + DSU)",
            "time_complexity": "O(E log E)",
            "execution_time_ms": round(elapsed_ms, 3),
            "num_mst_edges": len(mst_edges),
            "expected_edges": V - 1,
            "mst_edges": mst_edges,
            "total_mst_cost": round(total_mst_cost, 2),
            "total_original_cost": round(total_orig_cost, 2),
            "capital_saved": round(savings, 2),
            "cost_reduction_percent": round(savings_pct, 1),
            "redundant_loops_eliminated": len(self.graph.edges) - len(mst_edges),
            "step_log": step_log[:20],  # sample of steps for UI
            "status": "Optimal Spanning Tree Extracted" if is_spanning else "Graph Disconnected - Forest generated"
        }

    def run_prims_algorithm(self, root_node: Optional[str] = None) -> Dict[str, Any]:
        """
        Syllabus Mapping: Module V - Prim's Algorithm
        Grows tree outward from root node (e.g., Central Water Treatment Plant).
        Complexity: O(E log V)
        """
        start_time = time.perf_counter()
        nodes = list(self.graph.nodes.keys())
        V = len(nodes)
        if V <= 1:
            return {"success": True, "mst_edges": [], "total_cost": 0.0, "algorithm": "Prim"}

        if not root_node or root_node not in self.graph.nodes:
            # Pick node tagged as reservoir / substation or default to first
            root_node = nodes[0]
            for nid, n in self.graph.nodes.items():
                if n.get("type") in ["reservoir", "substation"]:
                    root_node = nid
                    break

        in_tree = {root_node}
        mst_edges: List[Dict[str, Any]] = []
        step_log: List[Dict[str, Any]] = []

        # Min-heap storing tuples: (cost, edge_obj, next_node)
        pq: List[Tuple[float, int, Dict[str, Any], str]] = []
        counter = 0

        for edge in self.graph.adj.get(root_node, []):
            nbr = edge["v"] if edge["u"] == root_node else edge["u"]
            cost = self.get_edge_cost(edge)
            counter += 1
            heapq.heappush(pq, (cost, counter, edge, nbr))

        while pq and len(in_tree) < V:
            cost, _, edge, u = heapq.heappop(pq)
            if u in in_tree:
                continue

            in_tree.add(u)
            mst_edges.append(edge)
            step_log.append({
                "step": len(mst_edges),
                "added_node": u,
                "via_edge": f"{edge['u']} — {edge['v']}",
                "cost": cost,
                "tree_size": len(in_tree)
            })

            # Add newly reachable edges
            for nxt_edge in self.graph.adj.get(u, []):
                nbr = nxt_edge["v"] if nxt_edge["u"] == u else nxt_edge["u"]
                if nbr not in in_tree:
                    counter += 1
                    nxt_cost = self.get_edge_cost(nxt_edge)
                    heapq.heappush(pq, (nxt_cost, counter, nxt_edge, nbr))

        elapsed_ms = (time.perf_counter() - start_time) * 1000
        total_mst_cost = sum(self.get_edge_cost(e) for e in mst_edges)
        total_orig_cost = sum(self.get_edge_cost(e) for e in self.graph.edges)

        savings = max(0.0, total_orig_cost - total_mst_cost)
        savings_pct = (savings / total_orig_cost * 100.0) if total_orig_cost > 0 else 0.0

        is_spanning = (len(mst_edges) == V - 1)

        return {
            "success": is_spanning,
            "algorithm": f"Prim's Algorithm (Priority Queue O(E log V), Root: {root_node})",
            "root_node": root_node,
            "time_complexity": "O(E log V)",
            "execution_time_ms": round(elapsed_ms, 3),
            "num_mst_edges": len(mst_edges),
            "expected_edges": V - 1,
            "mst_edges": mst_edges,
            "total_mst_cost": round(total_mst_cost, 2),
            "total_original_cost": round(total_orig_cost, 2),
            "capital_saved": round(savings, 2),
            "cost_reduction_percent": round(savings_pct, 1),
            "redundant_loops_eliminated": len(self.graph.edges) - len(mst_edges),
            "step_log": step_log[:20],
            "status": "Optimal Tree Generated from Root" if is_spanning else "Graph Disconnected - Forest generated"
        }
