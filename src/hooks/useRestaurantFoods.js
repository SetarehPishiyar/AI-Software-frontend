import { useState, useEffect } from "react";
import publicAxiosInstance from "../utills/publicAxiosInstance";

const useRestaurantFoods = (restaurantId) => {
  const [foodData, setFoodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!restaurantId) return;

    const fetchFoodData = async () => {
      setLoading(true);
      try {
        const response = await publicAxiosInstance.get(
          `/customer/restaurants/${restaurantId}/items`
        );
        setFoodData(response.data);
      } catch (err) {
        console.error("خطا در دریافت منو:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodData();
  }, [restaurantId]);

  return { foodData, loading, error };
};

export default useRestaurantFoods;
