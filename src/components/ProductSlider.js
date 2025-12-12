import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, IconButton } from "@mui/material";
import { ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import RestaurantCard from "./RestaurantCard";
import { useRestaurants } from "../contexts/RestaurantContext";
import useFavorites from "../hooks/useFavorites";
import { getUserInfo } from "../services/userService";

const ProductSlider = ({ title }) => {
  const navigate = useNavigate();
  const restaurants = useRestaurants();
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [userCity, setUserCity] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { favorites, toggleFavorite } = useFavorites(isLoggedIn);

  const fetchUserCity = async () => {
    try {
      const accessToken = localStorage.getItem("access");
      const refreshToken = localStorage.getItem("refresh");
      if (!accessToken || !refreshToken) return;

      setIsLoggedIn(true);

      const userData = await getUserInfo();
      if (userData?.province) {
        setUserCity(userData.province.trim());
      }
    } catch (err) {
      console.error("خطا در دریافت اطلاعات کاربر:", err);
    }
  };

  useEffect(() => {
    fetchUserCity();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      // اگر کاربر لاگین نیست، همه رستوران‌ها را نمایش بده
      setFilteredRestaurants(
        restaurants.sort((a, b) => (b.score || 0) - (a.score || 0))
      );
      return;
    }

    if (userCity && Array.isArray(restaurants)) {
      const filtered = restaurants
        .filter((r) => {
          const restaurantCity = r.city_name || r.province || "";
          return restaurantCity.trim().toLowerCase() === userCity.toLowerCase();
        })
        .sort((a, b) => (b.score || 0) - (a.score || 0));
      setFilteredRestaurants(filtered);
    } else {
      setFilteredRestaurants([]);
    }
  }, [userCity, restaurants, isLoggedIn]);

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      <Typography
        variant="h3"
        sx={{
          pt: 5,
          textAlign: "center",
          color: "#FBFADA",
          fontWeight: "bold",
          backgroundColor: "#12372A",
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "#12372A",
          p: 3,
          height: "70vh",
          alignItems: "center",
        }}
      >
        <Grid container spacing={1} sx={{ flex: 1 }}>
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants
              .slice(0, 6)
              .map((r) => (
                <RestaurantCard
                  key={r.id}
                  restaurant={r}
                  isFavorite={favorites[r.id]}
                  toggleFavorite={toggleFavorite}
                  onClick={() => navigate(`/customer/restaurants/${r.id}`)}
                  showDetails={true}
                />
              ))
          ) : (
            <Typography variant="body1" color="#FBFADA">
              رستورانی در شهر شما موجود نیست.
            </Typography>
          )}
        </Grid>

        <Box sx={{ display: "flex", alignItems: "flex-start", pt: 1 }}>
          <IconButton
            onClick={() => navigate(`/search?name=`)}
            sx={{
              backgroundColor: "#FBFADA",
              width: 40,
              height: 40,
              rotate: "180deg",
              "&:hover": {
                backgroundColor: "#cfe3c5",
                transform: "scale(1.15)",
              },
            }}
          >
            <ArrowForwardIos sx={{ color: "#12372A" }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductSlider;
