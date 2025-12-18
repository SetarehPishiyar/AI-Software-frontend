import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import RestaurantCard from "../../components/RestaurantCard";
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

const iranProvinces = [
  { fa: "آذربایجان شرقی", en: "East Azerbaijan" },
  { fa: "آذربایجان غربی", en: "West Azerbaijan" },
  { fa: "اردبیل", en: "Ardabil" },
  { fa: "اصفهان", en: "Isfahan" },
  { fa: "البرز", en: "Alborz" },
  { fa: "ایلام", en: "Ilam" },
  { fa: "بوشهر", en: "Bushehr" },
  { fa: "تهران", en: "Tehran" },
  { fa: "چهارمحال و بختیاری", en: "Chaharmahal and Bakhtiari" },
  { fa: "خراسان جنوبی", en: "South Khorasan" },
  { fa: "خراسان شمالی", en: "North Khorasan" },
  { fa: "خراسان رضوی", en: "Razavi Khorasan" },
  { fa: "خوزستان", en: "Khuzestan" },
  { fa: "زنجان", en: "Zanjan" },
  { fa: "سمنان", en: "Semnan" },
  { fa: "سیستان و بلوچستان", en: "Sistan and Baluchestan" },
  { fa: "فارس", en: "Fars" },
  { fa: "قزوین", en: "Qazvin" },
  { fa: "قم", en: "Qom" },
  { fa: "کردستان", en: "Kurdistan" },
  { fa: "کرمان", en: "Kerman" },
  { fa: "کرمانشاه", en: "Kermanshah" },
  { fa: "کهگیلویه و بویراحمد", en: "Kohgiluyeh and Boyer-Ahmad" },
  { fa: "گلستان", en: "Golestan" },
  { fa: "گیلان", en: "Gilan" },
  { fa: "لرستان", en: "Lorestan" },
  { fa: "مازندران", en: "Mazandaran" },
  { fa: "مرکزی", en: "Markazi" },
  { fa: "هرمزگان", en: "Hormozgan" },
  { fa: "همدان", en: "Hamedan" },
  { fa: "یزد", en: "Yazd" },
];

const RestaurantListPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const [businessType, setBusinessType] = useState(
    searchParams.get("business_type") || "all"
  );

  const [userCity, setUserCity] = useState(""); 
  const [selectedCity, setSelectedCity] = useState(""); 
  const [isLoggedIn] = useState(() => {
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");
    return !!accessToken && !!refreshToken;
  });

  useEffect(() => {
    const fetchUserCity = async () => {
      try {
        if (!isLoggedIn) return;

        const userData = await getUserInfo();
        if (userData?.province) {
          const province = userData.province.trim();
          setUserCity(province);
          setSelectedCity(province);
        }
      } catch (err) {
        console.error("خطا در دریافت اطلاعات کاربر:", err);
      }
    };

    fetchUserCity();
  }, [isLoggedIn]);

const cityParam = useMemo(() => {
  if (isLoggedIn && !userCity && !selectedCity) return null;

  return selectedCity || "";
}, [isLoggedIn, userCity, selectedCity]);


  const {
    restaurants = [],
    error,
    loading,
  } = useRestaurants(searchTerm, businessType, cityParam);

  const { favorites, toggleFavorite } = useFavorites(isLoggedIn);

  const handleCategoryClick = (type) => setBusinessType(type);

  const filteredRestaurants = restaurants.filter((r) => {
    if (!searchTerm) return true;
    return r.name.toLowerCase().includes(searchTerm.toLowerCase());
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
          placeholder="جستجوی نام فروشگاه..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "80%", marginBottom: 2 }}
        />
      </Box>

      {/* City Filter */}
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
        <FormControl sx={{ width: "80%" }} size="small">
          <InputLabel id="province-select-label">استان</InputLabel>
          <Select
            labelId="province-select-label"
            value={selectedCity}
            label="استان"
            onChange={(e) => setSelectedCity(e.target.value)}
            displayEmpty
          >
            {!isLoggedIn && <MenuItem value="">همه استان‌ها</MenuItem>}

            {iranProvinces.map((p) => (
              <MenuItem key={p.en} value={p.fa}>
                {p.fa}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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

      {/* Error */}
      {error && (
        <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>
          {error}
        </Typography>
      )}

      {/* Loading */}
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            mt: 3,
          }}
        >
          <CircularProgress color="inherit" />
          <Typography>در حال بارگذاری...</Typography>
        </Box>
      )}

      {/* Restaurants */}
      {!loading && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            paddingInline: "30px",
            justifyContent: "flex-end",
            gap: 2,
            direction: "rtl",
            mt: 2,
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
                    : () =>
                        alert("برای افزودن به علاقه‌مندی‌ها لطفاً وارد شوید")
                }
                onClick={() =>
                  navigate(`/customer/restaurants/${restaurant.id}`)
                }
              />
            ))
          ) : (
            <Typography sx={{ color: "#12372A" }}></Typography>
          )}
        </Box>
      )}

      {/* Empty state */}
      {!loading && filteredRestaurants.length === 0 && !error && (
        <Typography sx={{ textAlign: "center", marginTop: 3 }}>
          هیچ موردی یافت نشد.
        </Typography>
      )}
    </Box>
  );
};

export default RestaurantListPage;
