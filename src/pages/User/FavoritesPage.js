// src/pages/User/FavoritesPage.js
import React from "react";
import {
  Box,
  Typography,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../contexts/AuthContext";
import useFavorites from "../../hooks/useFavorites";
import { useRestaurants } from "../../contexts/RestaurantContext";
import RestaurantCard from "../../components/RestaurantCard";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthContext();
  const restaurants = useRestaurants();
  const { favorites, toggleFavorite } = useFavorites(isLoggedIn);

  const fullFavoritesData = restaurants.filter((r) => favorites[r.id]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#12372A", padding: 0 }}>
      {/* AppBar */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#12372A" }}>
        <Toolbar sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              backgroundColor: "#ADBC9F",
              color: "#12372A",
              borderRadius: "50%",
              width: 40,
              height: 40,
              rotate: "180deg",
              "&:hover": { backgroundColor: "#ADBC9F" },
              ml: 1,
            }}
          >
            <ArrowBackIosNew fontSize="small" />
          </IconButton>

          <Typography
            variant="h6"
            sx={{
              flex: 1,
              textAlign: "center",
              color: "#FBFADA",
              fontWeight: "bold",
              fontSize: "1.1rem",
              userSelect: "none",
            }}
          >
            لیست علاقه‌مندی‌های من
          </Typography>

          <Box sx={{ width: 40 }} />
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Box
        sx={{
          bgcolor: "#ADBC9F",
          minHeight: "calc(100vh - 64px)",
          px: 4,
          pt: 5,
        }}
      >
        <Grid container spacing={3} justifyContent="center">
          {fullFavoritesData.length === 0 ? (
            <Typography
              variant="h6"
              sx={{ mt: 6, mr: 3, color: "#12372A", fontWeight: 500 }}
            >
              لیست علاقه‌مندی شما خالی است.
            </Typography>
          ) : (
            fullFavoritesData.map((restaurant) => (
              <Grid item xs={6} sm={4} md={2} key={restaurant.id}>
                <RestaurantCard
                  restaurant={restaurant}
                  isFavorite={true}
                  toggleFavorite={toggleFavorite}
                  onClick={() =>
                    navigate(`/customer/restaurants/${restaurant.id}`)
                  }
                  showDetails={false}
                />
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default FavoritesPage;
