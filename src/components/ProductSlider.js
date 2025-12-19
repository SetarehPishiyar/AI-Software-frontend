import React, { useEffect, useState, useMemo, useCallback } from "react";
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
import {
  useRestaurants,
  useRestaurantsLoading,
  useRestaurantsActions,
} from "../contexts/RestaurantContext";
import useFavorites from "../hooks/useFavorites";
import { getUserInfo } from "../services/userService";

const ProductSlider = ({ title }) => {
  const navigate = useNavigate();
  const restaurants = useRestaurants();
  const loadingRestaurants = useRestaurantsLoading();
  const { loadRestaurants } = useRestaurantsActions(); 

  const [userCity, setUserCity] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);

  const isLoggedIn = useMemo(() => {
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");
    return !!accessToken && !!refreshToken;
  }, []);

  const { favorites, toggleFavorite } = useFavorites(isLoggedIn);

  const fetchUserCity = async () => {
    try {
      const accessToken = localStorage.getItem("access");
      const refreshToken = localStorage.getItem("refresh");
      if (!accessToken || !refreshToken) return;

      const userData = await getUserInfo();
      if (userData?.province) setUserCity(userData.province.trim());
    } catch (err) {
      console.error("خطا در دریافت اطلاعات کاربر:", err);
    }
  };

  useEffect(() => {
    const run = async () => {
      setLoadingUser(true);
      await fetchUserCity();
      setLoadingUser(false);
    };
    run();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      loadRestaurants("");
      return;
    }
    console.log(userCity)
    if (isLoggedIn && !userCity) return;
    loadRestaurants(userCity);
  }, [isLoggedIn, userCity, loadRestaurants]);

  const handleToggleFavorite = useCallback(
    (restaurantId) => {
      const accessToken = localStorage.getItem("access");
      const refreshToken = localStorage.getItem("refresh");

      if (!accessToken || !refreshToken) {
        alert("برای افزودن به علاقه‌مندی‌ها ابتدا وارد حساب کاربری شوید");
        navigate("/login");
        return;
      }

      toggleFavorite(restaurantId);
    },
    [toggleFavorite, navigate]
  );

  const filteredRestaurants = useMemo(() => {
    if (!restaurants || restaurants.length === 0) return [];
    return [...restaurants]
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 5);
  }, [restaurants]);

  const isLoading = loadingRestaurants || loadingUser;

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
          {isLoading ? (
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
                toggleFavorite={() => handleToggleFavorite(r.id)}
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
