import { useState, useEffect } from "react";
import axiosInstance from "../utills/publicAxiosInstance";

const useRestaurants = (searchTerm = "", businessType = "all") => {
  const [restaurants, setRestaurants] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const params = {};
        if (searchTerm) params.query = searchTerm;
        if (businessType && businessType !== "all")
          params.business_type = businessType;

        const response = await axiosInstance.get("/restaurant/profiles", {
          params,
        });
        const data = response.data;

        setAllRestaurants(data.restaurants || []);
        setRestaurants(data.restaurants || []);
        setItems(data.items || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setRestaurants([]);
        setItems([]);
        setAllRestaurants([]);
        setError("مشکلی در دریافت داده‌ها پیش آمد.");
      }
    };

    fetchRestaurants();
  }, [searchTerm, businessType]);

  return { restaurants, allRestaurants, items, error };
};

export default useRestaurants;
