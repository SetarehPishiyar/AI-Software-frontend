import { useState, useEffect } from "react";
import axiosInstance from "../utills/publicAxiosInstance";

const useRestaurants = (searchTerm = "", businessType = "all") => {
  const [restaurants, setRestaurants] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchRestaurants = async () => {
      if (isMounted) setLoading(true);

      try {
        const params = {};
        if (searchTerm) params.query = searchTerm;
        if (businessType && businessType !== "all")
          params.business_type = businessType;

        const response = await axiosInstance.get("/restaurant/profiles", {
          params: {
            limit: 20,
            ...(searchTerm && { query: searchTerm }),
            ...(businessType !== "all" && { business_type: businessType }),
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
  }, [searchTerm, businessType]);

  return { restaurants, allRestaurants, items, error, loading };
};

export default useRestaurants;
