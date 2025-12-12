import React, { useEffect, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import RestaurantCard from "../../components/RestaurantCard";
import ItemCard from "../../components/ItemCard";
import useFavorites from "../../hooks/useFavorites";
import useRestaurants from "../../hooks/useRestaurants";
import YumziImg from "../../assets/imgs/yumzi_icon.png";
import { getUserInfo } from "../../services/userService";

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
  const [userCity, setUserCity] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const {
    restaurants = [],
    allRestaurants = [],
    items = [],
    error,
  } = useRestaurants(searchTerm, businessType);
  const { favorites, toggleFavorite } = useFavorites(isLoggedIn);

  useEffect(() => {
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
    fetchUserCity();
  }, []);

  const handleCategoryClick = (type) => setBusinessType(type);

  const findRestaurantName = (restaurantId) =>
    allRestaurants.find((r) => r.id === restaurantId)?.name || "";
  const filteredRestaurants = restaurants.filter((r) => {
    const cityMatch =
      isLoggedIn && userCity
        ? (r.city_name || r.province || "").trim().toLowerCase() ===
          userCity.toLowerCase()
        : true;

    if (!searchTerm) return cityMatch;
    return r.name.toLowerCase().includes(searchTerm.toLowerCase()) && cityMatch;
  });

const filteredItems = items.filter((item) => {
  const restaurant = allRestaurants.find((r) => r.id === item.restaurant);

  if (
    searchTerm &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) {
    return true;
  }

  if (!searchTerm) {
    if (!restaurant) return false;
    return isLoggedIn
      ? (restaurant.city_name || restaurant.province || "")
          .trim()
          .toLowerCase() === userCity.toLowerCase()
      : true;
  }

  return false;
});


  return (
    <Box sx={{ pb: 8, minHeight: "100vh", backgroundColor: "#ADBC9F" }}>
      {/* HEADER */}
      <Box
        sx={{
          width: "100%",
          height: 100,
          bgcolor: "#0f3924",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
          justifyContent: "flex-end",
          gap: 2,
          direction: "rtl",
        }}
      >
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              isFavorite={isLoggedIn ? !!favorites[restaurant.id] : false}
              toggleFavorite={
                isLoggedIn
                  ? toggleFavorite
                  : () => alert("برای افزودن به علاقه‌مندی‌ها لطفاً وارد شوید")
              }
              onClick={() => navigate(`/customer/restaurants/${restaurant.id}`)}
            />
          ))
        ) : (
          <Typography sx={{ color: "#12372A" }}></Typography>
        )}
      </Box>

      {/* Items */}
      {filteredItems.length > 0 && (
        <Box sx={{ marginTop: 4, paddingInline: "30px", direction: "rtl" }}>
          <Typography variant="h5" sx={{ marginBottom: 2, direction:"ltr" }}>
            آیتم‌ها
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "flex-end",
            }}
          >
            {filteredItems.map((item) => (
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
      {filteredRestaurants.length === 0 &&
        filteredItems.length === 0 &&
        !error && (
          <Typography sx={{ textAlign: "center", marginTop: 3 }}>
            هیچ موردی یافت نشد.
          </Typography>
        )}
    </Box>
  );
};

export default RestaurantListPage;
