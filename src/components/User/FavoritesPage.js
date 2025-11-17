import React, { useEffect, useState } from "react";
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
import axiosInstance from "../../utills/axiosInstance";
import { useNavigate } from "react-router-dom";

const COLORS = {
  dark: "#12372A",
  mid: "#ADBC9F",
  light: "#FBFADA",
};

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [fullFavoritesData, setFullFavoritesData] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/customer/favorites")
      .then((response) => {
        setFavorites(response.data);
      })
      .catch(() => {
        setError("خطا در بارگذاری داده‌ها");
      });
  }, []);

  useEffect(() => {
    const fetchAllRestaurantsDetails = async () => {
      try {
        const restaurantPromises = favorites.map((restaurant) =>
          axiosInstance.get(`/restaurant/profiles/${restaurant.restaurant}`)
        );

        const restaurantResponses = await Promise.all(restaurantPromises);
        const fullData = restaurantResponses.map((response, index) => {
          return {
            ...favorites[index],
            ...response.data,
          };
        });
        setFullFavoritesData(fullData);
      } catch (err) {
        setError("خطا در دریافت جزئیات رستوران‌ها");
      }
    };

    if (favorites.length > 0) {
      fetchAllRestaurantsDetails();
    }
  }, [favorites]);

  const deleteFromFavorites = async (restaurantId) => {
    try {
      const response = await axiosInstance.delete(`/customer/favorites`, {
        params: { restaurant_id: restaurantId },
      });

      if (response.status === 204) {
        alert("فروشگاه از لیست علاقه مندی شما حذف شد");

        setFavorites((prevFavorites) =>
          prevFavorites.filter(
            (favorite) => favorite.restaurant !== restaurantId
          )
        );
        setFullFavoritesData((prevData) =>
          prevData.filter((restaurant) => restaurant.id !== restaurantId)
        );
      }
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: COLORS.dark,
        padding: 0,
      }}
    >
      {/* هدر بالا */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: COLORS.dark,
        }}
      >
        <Toolbar sx={{ display: "flex", alignItems: "center" }}>
          {/* دکمه برگشت گرد مثل طرح */}
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              backgroundColor: COLORS.mid,
              color: COLORS.dark,
              borderRadius: "50%",
              width: 40,
              height: 40,
              "&:hover": {
                backgroundColor: COLORS.mid,
              },
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
              userSelect: "none",
            }}
          >
            لیست علاقه‌مندی‌های من
          </Typography>

          {/* برای بالانس Flex یک باکس خالی */}
          <Box sx={{ width: 40 }} />
        </Toolbar>
      </AppBar>

      {/* بدنه با پس‌زمینه سبز ملایم */}
      <Box
        sx={{
          bgcolor: COLORS.mid,
          minHeight: "calc(100vh - 64px)",
          px: 4,
          pt: 5,
        }}
      >
        <Grid container spacing={3} justifyContent="center">
          {fullFavoritesData.length === 0 ? (
            <Typography
              variant="h6"
              sx={{
                mt: 6,
                mr: 3,
                color: COLORS.dark,
                fontWeight: 500,
              }}
            >
              لیست علاقه‌مندی شما خالی است.
            </Typography>
          ) : (
            fullFavoritesData.map((restaurant) => (
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
                      restaurant.photo
                        ? restaurant.photo
                        : "https://via.placeholder.com/120"
                    }
                    alt={restaurant.name}
                    sx={{
                      borderRadius: "12px",
                      objectFit: "cover",
                      width: "100%",
                      mb: 1,
                    }}
                  />
                  <CardContent
                    sx={{
                      textAlign: "center",
                      p: 0.5,
                      pb: 0.5,
                    }}
                  >
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
                        deleteFromFavorites(restaurant.id);
                      }}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton
                      sx={{
                        color: "#FF6B81",
                        pointerEvents: "none",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Favorite />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default FavoritesPage;
