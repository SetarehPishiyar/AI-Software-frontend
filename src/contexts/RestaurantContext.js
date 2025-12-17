import { createContext, useContext, useState, useEffect } from "react";
import { getRestaurants } from "../services/restaurantService";

const RestaurantContext = createContext();

export function RestaurantProvider({ children }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading restaurants:", err);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <RestaurantContext.Provider value={{ restaurants, loading }}>
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
