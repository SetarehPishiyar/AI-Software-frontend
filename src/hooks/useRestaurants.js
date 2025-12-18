import { useState, useEffect } from "react";
import axiosInstance from "../utills/publicAxiosInstance";

const useRestaurants = (
  searchTerm = "",
  businessType = "all",
  city_name = ""
) => {
  const [restaurants, setRestaurants] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (city_name === null) return;

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
            ...(city_name && { city_name }),
          },
        });

        const data = response.data;

        if (!isMounted) return;

        setAllRestaurants(data || []);
        setRestaurants(data || []);
        setError(null);
      } catch (err) {
        console.error(err);
        if (!isMounted) return;

        setRestaurants([]);
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
  }, [searchTerm, businessType, city_name]);

  return { restaurants, allRestaurants, error, loading };
};

export default useRestaurants;
