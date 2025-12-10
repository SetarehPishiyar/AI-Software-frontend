// src/pages/User/FavoritesPage.js
import React from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Grid,
  Toolbar,
  AppBar,
} from "@mui/material";

import Delete from "@mui/icons-material/Delete";
import Favorite from "@mui/icons-material/Favorite";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../contexts/AuthContext";
import useFavorites from "../../hooks/useFavorites";
import { useRestaurants } from "../../contexts/RestaurantContext";

const COLORS = {
  dark: "#12372A",
  mid: "#ADBC9F",
  light: "#FBFADA",
};

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthContext() || {}; // اضافه کردن fallback
  const { favorites, toggleFavorite } = useFavorites(isLoggedIn);
  const { restaurants = [], loading } = useRestaurants();

  // مطمئن شدن که آرایه است
  const favoriteRestaurants = Array.isArray(restaurants)
    ? restaurants.filter((r) => favorites[r.id])
    : [];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: COLORS.dark }}>
      {/* هدر بالا */}
      <AppBar
        position="static"
        elevation={0}
        sx={{ backgroundColor: COLORS.dark }}
      >
        <Toolbar sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              backgroundColor: COLORS.mid,
              color: COLORS.dark,
              borderRadius: "50%",
              width: 40,
              height: 40,
              rotate: "180deg",
              "&:hover": { backgroundColor: COLORS.mid },
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
              color: COLORS.light,
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            لیست علاقه‌مندی‌های من
          </Typography>

          <Box sx={{ width: 40 }} />
        </Toolbar>
      </AppBar>

      {/* بدنه */}
      <Box
        sx={{
          bgcolor: COLORS.mid,
          minHeight: "calc(100vh - 64px)",
          px: 4,
          pt: 5,
        }}
      >
        {loading ? (
          <Typography sx={{ textAlign: "center", mt: 6, color: COLORS.dark }}>
            در حال بارگذاری...
          </Typography>
        ) : favoriteRestaurants.length === 0 ? (
          <Typography sx={{ textAlign: "center", mt: 6, color: COLORS.dark }}>
            لیست علاقه‌مندی شما خالی است.
          </Typography>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {favoriteRestaurants.map((restaurant) => (
              <Grid item xs={6} sm={4} md={2} key={restaurant.id}>
                <Card
                  sx={{
                    position: "relative",
                    p: 1.5,
                    borderRadius: "18px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                    minHeight: "260px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    maxWidth: "100%",
                    bgcolor: COLORS.light,
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.25)",
                    },
                    transition: "all 0.2s ease",
                  }}
                  onClick={() =>
                    navigate(`/customer/restaurants/${restaurant.id}`)
                  }
                >
                  <CardMedia
                    component="img"
                    image={
                      restaurant.photo || "https://via.placeholder.com/120"
                    }
                    alt={restaurant.name}
                    sx={{
                      borderRadius: "12px",
                      objectFit: "cover",
                      width: "100%",
                      mb: 1,
                    }}
                  />
                  <CardContent sx={{ textAlign: "center", p: 0.5, pb: 0.5 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        fontFamily: "'Vazir', sans-serif",
                        fontSize: "0.95rem",
                        color: COLORS.dark,
                      }}
                    >
                      {restaurant.name}
                    </Typography>
                  </CardContent>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      width: "100%",
                      mt: 1,
                    }}
                  >
                    <IconButton
                      sx={{ color: COLORS.dark }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(restaurant.id);
                      }}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton sx={{ color: "red", pointerEvents: "none" }}>
                      <Favorite />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default FavoritesPage;
