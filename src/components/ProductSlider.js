import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, IconButton } from "@mui/material";
import { ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utills/axiosInstance";
import publicAxiosInstance from "../../utills/publicAxiosInstance";
import RestaurantCard from "./RestaurantCard";

const ProductSlider = ({ title }) => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favorites, setFavorites] = useState({});

  const checkAuthentication = () => {
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");
    setIsLoggedIn(!!(accessToken && refreshToken));
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

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
    const fetchFavorites = async () => {
      if (!isLoggedIn) return;
      try {
        const res = await axiosInstance.get("/customer/favorites");
        const favMap = {};
        res.data.forEach((f) => {
          favMap[f.restaurant] = true;
        });
        setFavorites(favMap);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRestaurants();
    fetchFavorites();
  }, [isLoggedIn]);

  const toggleFavorite = async (id) => {
    if (!isLoggedIn) return alert("ابتدا وارد حساب شوید.");
    const isFav = favorites[id];
    try {
      if (isFav)
        await axiosInstance.delete("/customer/favorites", {
          params: { restaurant_id: id },
        });
      else
        await axiosInstance.post("/customer/favorites", { restaurant_id: id });
      setFavorites((prev) => ({ ...prev, [id]: !isFav }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      <Typography
        variant="h2"
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
          alignItems: "center",
        }}
      >
        <Grid container spacing={1} sx={{ flex: 1 }}>
          {restaurants.slice(0, 6).map((r) => (
            <RestaurantCard
              key={r.id}
              restaurant={r}
              isFavorite={favorites[r.id]}
              toggleFavorite={toggleFavorite}
              onClick={() => navigate(`/customer/restaurants/${r.id}`)}
            />
          ))}
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
