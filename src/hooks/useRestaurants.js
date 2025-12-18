import { useState, useEffect } from "react";
import axiosInstance from "../utills/publicAxiosInstance";

const useRestaurants = (
  searchTerm = "",
  businessType = "all",
  city = ""
) => {
  const [restaurants, setRestaurants] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (city === null) return;

    const fetchRestaurants = async () => {
      if (isMounted) setLoading(true);

      try {
        const response = await axiosInstance.get("/restaurant/profiles", {
          params: {
            ...(searchTerm && { query: searchTerm }),
            ...(businessType &&
              businessType !== "all" && {
                business_type: businessType,
              }),
            ...(city && { city }), 
          },
        });

        const data = response.data;

        if (!isMounted) return;

        setAllRestaurants(data.restaurants || []);
        setRestaurants(data.restaurants || []);
        setItems(data.items || []);
        setError(null);
      } catch (err) {
        console.error(err);
        if (!isMounted) return;

        setRestaurants([]);
        setItems([]);
        setAllRestaurants([]);
        setError("مشکلی در دریافت داده‌ها پیش آمد.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRestaurants();

    return () => {
      isMounted = false;
    };
  }, [searchTerm, businessType, city]);

  return { restaurants, allRestaurants, items, error, loading };
};

export default useRestaurants;
