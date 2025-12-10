import { useState, useEffect } from "react";
import publicAxiosInstance from "../utills/publicAxiosInstance";

const useSingleRestaurant = (restaurantId) => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!restaurantId) return;

    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const response = await publicAxiosInstance.get(
          `/restaurant/profiles/${restaurantId}`
        );
        setRestaurant(response.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching restaurant:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurantId]);

  return { restaurant, loading, error };
};

export default useSingleRestaurant;
