"""
Smart Urban Multi-Modal Route & Infrastructure Optimizer
Phase 2 - Subsystem A: Multi-Modal Shortest Path Engine
Covers: Dijkstra's Algorithm with dynamic traffic congestion, multi-modal transit,
weather rain delays (OpenWeatherMap-inspired), and AQI air quality optimization (OpenAQ/AQICN-inspired).
"""
import heapq
from typing import Dict, List, Any, Optional
from .graph import CityGraph


class ShortestPathEngine:
    """
    Implements Dijkstra's Shortest Path Algorithm for multi-modal city networks
    with real-world traffic, weather slowdown, and AQI health exposure factors.
    """
    def __init__(self, city_graph: CityGraph):
        self.graph = city_graph

    def compute_edge_weight(self, edge: Dict[str, Any], travel_mode: str = "car",
                            traffic_enabled: bool = True, weather_rain: bool = False,
                            aqi_aware: bool = False) -> float:
        """
        Calculates effective travel cost / time based on mode, base distance, traffic,
        meteorological rain impact, and air quality exposure friction.
        
        Cost = Base_Length * Mode_Factor * Traffic_Factor * Weather_Factor * AQI_Penalty
        """
        length = float(edge.get("length", 1.0))
        traffic_factor = float(edge.get("traffic", 1.0)) if traffic_enabled else 1.0
        edge_mode = edge.get("mode", "road")
        edge_aqi = float(edge.get("aqi", 75.0))

        # Weather factor: Rain causes surface waterlogging & congestion (+45%), but metro is immune
        weather_factor = 1.0
        if weather_rain:
            if edge_mode == "road":
                weather_factor = 1.45  # 45% rain slowdown on surface roads
            else:
                weather_factor = 1.0   # Underground/elevated metro runs unaffected by surface waterlogging

        # AQI Health Friction: When aqi_aware is active, high PM2.5 corridors impose exposure resistance
        aqi_penalty = 1.0
        if aqi_aware:
            # Baseline AQI 50 (clean); higher AQI adds friction (e.g. AQI 175 adds +62.5% penalty)
            if edge_aqi > 50:
                aqi_penalty = 1.0 + ((edge_aqi - 50.0) / 200.0)

        # Mode factors
        if travel_mode == "emergency":
            # Emergency ambulances/fire trucks use sirens, bypassing 70% of congestion
            effective_traffic = 1.0 + (traffic_factor - 1.0) * 0.3
            return max(0.1, length * effective_traffic * 0.8 * weather_factor)

        elif travel_mode == "metro":
            if edge_mode == "metro":
                return max(0.1, length * 0.45 * weather_factor * aqi_penalty)  # Metro is high-speed
            else:
                return max(0.1, length * 1.5 * weather_factor * aqi_penalty)   # Connecting pedestrian leg

        elif travel_mode == "eco_walk":
            if edge_mode == "metro":
                return float("inf")  # Cannot walk on metro tracks
            # Walkers are highly vulnerable to AQI and rain
            walk_aqi_penalty = (1.0 + ((edge_aqi - 50.0) / 100.0)) if aqi_aware and edge_aqi > 50 else 1.0
            return max(0.1, length * 2.2 * (weather_factor ** 1.2) * walk_aqi_penalty)

        else:  # Standard "car" / delivery / ride-hailing
            if edge_mode == "metro":
                return float("inf")  # Cars cannot use metro rails
            return max(0.1, length * traffic_factor * weather_factor * aqi_penalty)

    def run_dijkstra(self, source: str, destination: str, travel_mode: str = "car",
                     traffic_enabled: bool = True, weather_rain: bool = False,
                     aqi_aware: bool = False) -> Dict[str, Any]:
        """
        Dijkstra's Shortest Path Algorithm
        Min-Priority Queue implementation with step-by-step trace.
        """
        if source not in self.graph.nodes or destination not in self.graph.nodes:
            return {
                "success": False,
                "error": f"Source '{source}' or Destination '{destination}' does not exist in network."
            }

        dist: Dict[str, float] = {node_id: float("inf") for node_id in self.graph.nodes}
        parent: Dict[str, Optional[str]] = {node_id: None for node_id in self.graph.nodes}
        edge_used: Dict[str, Optional[Dict[str, Any]]] = {node_id: None for node_id in self.graph.nodes}

        dist[source] = 0.0

        pq = [(0.0, source)]
        visited_order: List[str] = []
        visited_set = set()

        while pq:
            curr_dist, u = heapq.heappop(pq)

            if u in visited_set:
                continue
            visited_set.add(u)
            visited_order.append(u)

            if u == destination:
                break

            for edge in self.graph.adj.get(u, []):
                v = edge["v"] if edge["u"] == u else edge["u"]
                if v in visited_set:
                    continue

                weight = self.compute_edge_weight(
                    edge, travel_mode, traffic_enabled, weather_rain, aqi_aware
                )
                if weight == float("inf"):
                    continue

                if dist[u] + weight < dist[v]:
                    dist[v] = dist[u] + weight
                    parent[v] = u
                    edge_used[v] = edge
                    heapq.heappush(pq, (dist[v], v))

        if dist[destination] == float("inf"):
            return {
                "success": False,
                "error": f"No accessible route from '{source}' to '{destination}' under mode '{travel_mode}'."
            }

        # Reconstruct path
        path_nodes: List[str] = []
        path_edges: List[Dict[str, Any]] = []
        curr = destination
        while curr is not None:
            path_nodes.append(curr)
            if edge_used[curr]:
                path_edges.append(edge_used[curr])
            curr = parent[curr]
        path_nodes.reverse()
        path_edges.reverse()

        # Turn-by-turn directions & metrics
        turn_by_turn = []
        total_physical_km = 0.0
        weighted_aqi_sum = 0.0

        for i, edge in enumerate(path_edges):
            edge_len = float(edge.get("length", 1.0))
            traffic = float(edge.get("traffic", 1.0))
            aqi = float(edge.get("aqi", 75.0))
            total_physical_km += edge_len
            weighted_aqi_sum += (aqi * edge_len)

            turn_by_turn.append({
                "step": i + 1,
                "segment": f"{edge.get('name', 'Corridor')} ({path_nodes[i]} ➔ {path_nodes[i+1]})",
                "distance_km": round(edge_len, 2),
                "traffic_multiplier": f"{traffic}x" if traffic_enabled else "1.0x",
                "aqi": round(aqi),
                "mode": edge.get("mode", "road")
            })

        avg_aqi = round(weighted_aqi_sum / max(0.001, total_physical_km), 1)
        if avg_aqi <= 50:
            aqi_label = "Good (Clean Air)"
        elif avg_aqi <= 100:
            aqi_label = "Moderate"
        elif avg_aqi <= 150:
            aqi_label = "Unhealthy for Sensitive Groups"
        elif avg_aqi <= 200:
            aqi_label = "Unhealthy"
        else:
            aqi_label = "Very Unhealthy / Hazardous"

        return {
            "success": True,
            "source": source,
            "destination": destination,
            "travel_mode": travel_mode,
            "weather_rain": weather_rain,
            "aqi_aware": aqi_aware,
            "total_cost_minutes": round(dist[destination], 2),
            "total_physical_km": round(total_physical_km, 2),
            "avg_aqi": avg_aqi,
            "aqi_label": aqi_label,
            "path_nodes": path_nodes,
            "path_edges": path_edges,
            "path_node_count": len(path_nodes),
            "visited_nodes_order": visited_order,
            "turn_by_turn": turn_by_turn,
            "algorithm": "Dijkstra's Algorithm (Priority Queue O((V + E) log V))"
        }
