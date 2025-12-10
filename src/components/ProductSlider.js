import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, IconButton } from "@mui/material";
import { ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import RestaurantCard from "./RestaurantCard";
import { useRestaurants } from "../contexts/RestaurantContext";
import useFavorites from "../hooks/useFavorites";

const ProductSlider = ({ title }) => {
  const navigate = useNavigate();
  const restaurants = useRestaurants(); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { favorites, toggleFavorite } = useFavorites(isLoggedIn); 

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");
    setIsLoggedIn(!!(accessToken && refreshToken));
  }, []);

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
          {Array.isArray(restaurants) &&
            restaurants
              .slice(0, 6)
              .map((r) => (
                <RestaurantCard
                  restaurant={r}
                  isFavorite={favorites[r.id]}
                  toggleFavorite={toggleFavorite}
                  onClick={() => navigate(`/customer/restaurants/${r.id}`)}
                  showDetails={true}
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
