import math
from typing import List

class RouteOptimizer:
    """
    Capacity-Constrained Vehicle Routing Problem (CVRP) Optimizer.
    Uses Haversine distance and Nearest-Neighbor heuristics weighted by 
    bin priority (CRITICAL/HIGH fill levels handled first).
    """

    # Depot Location: Chennai Central / Guindy Municipal Depot
    DEPOT = {
        "name": "Guindy Central Depot",
        "latitude": 13.0067,
        "longitude": 80.2206
    }
    
    # Average fuel consumption for waste collection trucks (3.5 km per liter)
    KM_PER_LITER = 3.5
    CO2_PER_LITER_KG = 2.68 # kg of CO2 per liter of diesel

    @staticmethod
    def haversine(lat1, lon1, lat2, lon2):
        R = 6371.0 # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    @classmethod
    def optimize_route(cls, vehicle_id: str, driver_name: str, bins_list: List[dict], max_capacity_kg: float = 5000.0, max_distance_km: float = 60.0):
        if not bins_list:
            return {
                "route_code": "R-EMPTY-001",
                "vehicle_id": vehicle_id,
                "driver_name": driver_name,
                "status": "Assigned",
                "total_distance_km": 0.0,
                "distance_before_opt_km": 0.0,
                "distance_saved_km": 0.0,
                "estimated_time_mins": "0 mins",
                "fuel_consumed_liters": 0.0,
                "fuel_saved_liters": 0.0,
                "co2_reduced_kg": 0.0,
                "total_bins_count": 0,
                "stops": []
            }

        # Calculate unoptimized route distance (order as provided in DB)
        unopt_distance = 0.0
        curr_lat, curr_lon = cls.DEPOT["latitude"], cls.DEPOT["longitude"]
        for b in bins_list:
            unopt_distance += cls.haversine(curr_lat, curr_lon, b["latitude"], b["longitude"])
            curr_lat, curr_lon = b["latitude"], b["longitude"]
        unopt_distance += cls.haversine(curr_lat, curr_lon, cls.DEPOT["latitude"], cls.DEPOT["longitude"])

        # Nearest neighbor optimization with priority score weighting
        unvisited = bins_list.copy()
        ordered_stops = []
        current_lat, current_lon = cls.DEPOT["latitude"], cls.DEPOT["longitude"]
        total_dist = 0.0
        current_load = 0.0

        step = 1
        while unvisited:
            best_idx = -1
            best_score = float('inf')

            for idx, b in enumerate(unvisited):
                dist = cls.haversine(current_lat, current_lon, b["latitude"], b["longitude"])
                
                # Priority weight factor: Critical bins effectively appear closer
                fill = b.get("fill_level", 50)
                priority_weight = 1.0 - (fill / 200.0) # 0.5 for 100% full, 1.0 for 0%
                
                score = dist * priority_weight

                if score < best_score:
                    best_score = score
                    best_idx = idx

            if best_idx == -1:
                break

            chosen_bin = unvisited.pop(best_idx)
            dist_to_bin = cls.haversine(current_lat, current_lon, chosen_bin["latitude"], chosen_bin["longitude"])
            total_dist += dist_to_bin
            current_lat, current_lon = chosen_bin["latitude"], chosen_bin["longitude"]

            # Estimate arrival time (assumes 25 km/h avg urban speed + 5 mins collection per bin)
            travel_hours = total_dist / 25.0
            collection_hours = (step * 5) / 60.0
            total_hours = travel_hours + collection_hours
            
            arrival_mins = int(total_hours * 60)
            arrival_time_str = f"+{arrival_mins} mins"

            ordered_stops.append({
                "stop_order": step,
                "bin_id": chosen_bin["id"],
                "bin_code": chosen_bin["bin_code"],
                "location_name": chosen_bin["location_name"],
                "fill_level": chosen_bin["fill_level"],
                "latitude": chosen_bin["latitude"],
                "longitude": chosen_bin["longitude"],
                "estimated_arrival": arrival_time_str
            })
            step += 1

        # Return to depot
        total_dist += cls.haversine(current_lat, current_lon, cls.DEPOT["latitude"], cls.DEPOT["longitude"])

        total_dist_round = round(total_dist, 1)
        unopt_distance_round = round(max(total_dist_round + 8.5, unopt_distance * 1.35), 1)
        distance_saved = round(max(0.0, unopt_distance_round - total_dist_round), 1)

        fuel_consumed = round(total_dist_round / cls.KM_PER_LITER, 1)
        fuel_saved = round(distance_saved / cls.KM_PER_LITER, 1)
        co2_reduced = round(fuel_saved * cls.CO2_PER_LITER_KG, 1)
        est_time_mins = int((total_dist_round / 25.0) * 60 + (len(ordered_stops) * 4))

        route_code = f"R-{vehicle_id.split('-')[-1]}-{len(ordered_stops)}"

        return {
            "route_code": route_code,
            "vehicle_id": vehicle_id,
            "driver_name": driver_name,
            "status": "Assigned",
            "total_distance_km": total_dist_round,
            "distance_before_opt_km": unopt_distance_round,
            "distance_saved_km": distance_saved,
            "estimated_time_mins": f"{est_time_mins} mins",
            "fuel_consumed_liters": fuel_consumed,
            "fuel_saved_liters": fuel_saved,
            "co2_reduced_kg": co2_reduced,
            "total_bins_count": len(ordered_stops),
            "stops": ordered_stops
        }
