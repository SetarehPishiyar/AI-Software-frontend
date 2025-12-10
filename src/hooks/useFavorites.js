import { useState, useEffect } from "react";
import axiosInstance from "../utills/axiosInstance";

const useFavorites = (isLoggedIn) => {
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isLoggedIn) return;
      try {
        const response = await axiosInstance.get("/customer/favorites");
        const favMap = {};
        response.data.forEach((fav) => {
          favMap[fav.restaurant] = true;
        });
        setFavorites(favMap);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFavorites();
  }, [isLoggedIn]);

  const toggleFavorite = async (restaurantId) => {
    if (!isLoggedIn) return alert("ابتدا وارد حساب شوید.");
    const isFav = favorites[restaurantId];
    try {
      if (isFav)
        await axiosInstance.delete("/customer/favorites", {
          params: { restaurant_id: restaurantId },
        });
      else
        await axiosInstance.post("/customer/favorites", {
          restaurant_id: restaurantId,
        });
      setFavorites((prev) => ({ ...prev, [restaurantId]: !isFav }));
    } catch (err) {
      console.error(err);
    }
  };

  return { favorites, toggleFavorite };
};

export default useFavorites;
