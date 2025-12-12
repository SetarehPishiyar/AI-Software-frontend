import React, { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import RestaurantCard from "../../components/RestaurantCard";
import useFavorites from "../../hooks/useFavorites";
import useRestaurants from "../../hooks/useRestaurants";
import YumziImg from "../../assets/imgs/yumzi_icon.png";
import ItemCard from "../../components/ItemCard";

const categories = {
  all: "همه",
  Iranian: "ایرانی",
  FastFood: "فست فود",
  Italian: "ایتالیایی",
  Asian: "آسیایی",
  Mexican: "مکزیکی",
};

const RestaurantListPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const [businessType, setBusinessType] = useState(
    searchParams.get("business_type") || "all"
  );

  const {
    restaurants = [],
    allRestaurants = [],
    items = [],
    error,
  } = useRestaurants(searchTerm, businessType);
  const { favorites, toggleFavorite, isAuthenticated } = useFavorites();

  const handleCategoryClick = (type) => setBusinessType(type);

  const findRestaurantName = (restaurantId) =>
    allRestaurants.find((r) => r.id === restaurantId)?.name || "";

  return (
    <Box sx={{ pb: 8, minHeight: "100vh", backgroundColor: "#ADBC9F" }}>
      {/* HEADER (Logo Only) */}
      <Box
        sx={{
          width: "100%",
          height: 100,
          bgcolor: "#0f3924",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        <img
          src={YumziImg}
          alt="yumzi"
          style={{ height: 60, cursor: "pointer" }}
          onClick={() => navigate("/")}
        />
      </Box>

      {/* Search */}
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "60px" }}
      >
        <TextField
          variant="outlined"
          placeholder="جستجوی نام فروشگاه یا غذا..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "80%", marginBottom: 3 }}
        />
      </Box>

      {/* Categories */}
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
        {Object.entries(categories).map(([key, label]) => (
          <Typography
            key={key}
            onClick={() => handleCategoryClick(key)}
            sx={{
              cursor: "pointer",
              padding: 1,
              margin: 1,
              border:
                key === businessType ? "2px solid #12372A" : "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: key === businessType ? "#fceddc" : "transparent",
            }}
          >
            {label}
          </Typography>
        ))}
      </Box>

      {/* Restaurants */}
      {error && <Typography color="error">{error}</Typography>}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          paddingInline: "30px",
          justifyContent: "flex-end", // راست‌چین کردن container
          gap: 2,
          direction: "rtl", // می‌تواند روی متن‌ها هم تاثیر داشته باشد
        }}
      >
        {(restaurants || []).map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            isFavorite={!!favorites[restaurant.id]}
            toggleFavorite={toggleFavorite}
            onClick={() => navigate(`/customer/restaurants/${restaurant.id}`)}
          />
        ))}
      </Box>

      {/* Items */}
      {searchTerm && (items || []).length > 0 && (
        <Box sx={{ marginTop: 4, paddingInline: "30px" }}>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            آیتم‌ها
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "flex-end",
              direction: "rtl",
            }}
          >
            {(items || []).map((item) => (
              <ItemCard
                key={item.item_id}
                item={{
                  ...item,
                  restaurant_name: findRestaurantName(item.restaurant),
                }}
                onClick={() =>
                  navigate(
                    `/customer/restaurants/${item.restaurant}/${item.item_id}`
                  )
                }
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Empty state */}
      {(restaurants || []).length === 0 &&
        (items || []).length === 0 &&
        !error && (
          <Typography sx={{ textAlign: "center", marginTop: 3 }}>
            هیچ موردی یافت نشد.
          </Typography>
        )}
    </Box>
  );
};

export default RestaurantListPage;
