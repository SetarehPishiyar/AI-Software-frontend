import { useState, useEffect } from "react";
import publicAxiosInstance from "../utills/publicAxiosInstance";

const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await publicAxiosInstance.get("/restaurant/profiles");
        const sorted = response.data.restaurants.sort(
          (a, b) => b.score - a.score
        );
        setRestaurants(sorted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRestaurants();
  }, []);

  return restaurants;
};

export default useRestaurants;
