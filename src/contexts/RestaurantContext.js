import { createContext, useContext, useState, useEffect } from "react";
import { getRestaurants } from "@/services/restaurantService";

const RestaurantContext = createContext();

export function RestaurantProvider({ children }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
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

export const useRestaurants = () => useContext(RestaurantContext);
