import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import RestaurantCard from "./RestaurantCard";
import { useRestaurants } from "../contexts/RestaurantContext";
import useFavorites from "../hooks/useFavorites";
import { getUserInfo } from "../services/userService";

const ProductSlider = ({ title }) => {
  const navigate = useNavigate();
  const restaurants = useRestaurants(); // همه رستوران‌ها
  const { favorites, toggleFavorite } = useFavorites();

  const [userCity, setUserCity] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  // دریافت شهر کاربر
  const fetchUserCity = async () => {
    try {
      const accessToken = localStorage.getItem("access");
      const refreshToken = localStorage.getItem("refresh");
      if (!accessToken || !refreshToken) return setLoadingUser(false);

      setIsLoggedIn(true);

      const userData = await getUserInfo();
      if (userData?.province) {
        setUserCity(userData.province.trim());
      }
    } catch (err) {
      console.error("خطا در دریافت اطلاعات کاربر:", err);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchUserCity();
  }, []);

  // فیلتر و مرتب سازی بهینه با useMemo
  const filteredRestaurants = useMemo(() => {
    if (!restaurants || restaurants.length === 0) return [];

    // اگر کاربر لاگین نیست، همه رستوران‌ها رو مرتب کن و برگردون
    if (!isLoggedIn) {
      return [...restaurants]
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 5); // فقط چند رستوران اولیه
    }

    // کاربر لاگین است، فیلتر بر اساس شهر
    if (userCity) {
      return [...restaurants]
        .filter((r) => {
          const city = (r.city_name || r.province || "").trim().toLowerCase();
          return city === userCity.toLowerCase();
        })
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 5);
    }

    return [];
  }, [restaurants, userCity, isLoggedIn]);

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      {/* عنوان */}
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
          {loadingUser ? (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress color="inherit" />
              <Typography variant="body1" sx={{ ml: 2, color: "#FBFADA" }}>
                در حال بارگذاری رستوران‌ها...
              </Typography>
            </Box>
          ) : filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((r) => (
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

        {/* دکمه مشاهده همه */}
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
