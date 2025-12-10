import { createContext, useContext, useState, useEffect } from "react";
import { getRestaurants } from "../services/restaurantService";
import { getFavorites } from "../services/favoriteService";
import { useAuthContext } from "./AuthContext";

const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const { isLoggedIn } = useAuthContext();
  const [restaurants, setRestaurants] = useState([]);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    const fetchRestaurants = async () => {
      const data = await getRestaurants();
      setRestaurants(data);
    };

    const fetchFavorites = async () => {
      if (!isLoggedIn) return;
      const favData = await getFavorites();
      const favMap = {};
      favData.forEach((fav) => {
        favMap[fav.restaurant] = true;
      });
      setFavorites(favMap);
    };

    fetchRestaurants();
    fetchFavorites();
  }, [isLoggedIn]);

  return (
    <RestaurantContext.Provider
      value={{ restaurants, favorites, setFavorites }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurantContext = () => useContext(RestaurantContext);
