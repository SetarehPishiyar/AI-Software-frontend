import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getRestaurants } from "../services/restaurantService";

const RestaurantContext = createContext();

export function RestaurantProvider({ children }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRestaurants = useCallback(async (city_name = "") => {
    setLoading(true);
    try {
      console.log("context   ",city_name )
      const data = await getRestaurants(city_name);
      setRestaurants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading restaurants:", err);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRestaurants("");
  }, [loadRestaurants]);

  return (
    <RestaurantContext.Provider
      value={{ restaurants, loading, loadRestaurants }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export const useRestaurants = () => {
  const context = useContext(RestaurantContext);
  if (!context)
    throw new Error("useRestaurants must be used within RestaurantProvider");
  return context.restaurants;
};

export const useRestaurantsLoading = () => {
  const context = useContext(RestaurantContext);
  if (!context)
    throw new Error(
      "useRestaurantsLoading must be used within RestaurantProvider"
    );
  return context.loading;
};

export const useRestaurantsActions = () => {
  const context = useContext(RestaurantContext);
  if (!context)
    throw new Error(
      "useRestaurantsActions must be used within RestaurantProvider"
    );
  return { loadRestaurants: context.loadRestaurants };
};
