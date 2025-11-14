import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Button,
  useMediaQuery,
} from "@mui/material";
import Footer from "./Footer";
import Grid from "@mui/material/Grid2";
import homepageBurger from "../../assets/imgs/homepage burger.png";
import restaurantImg from "../../assets/imgs/restaurant.png";
import cafeImg from "../../assets/imgs/cafe.png";
import sweetsImg from "../../assets/imgs/sweets.png";
import iceCreamImg from "../../assets/imgs/ice_cream.png";
import bakeryImg from "../../assets/imgs/bakery.png";
import { FavoriteBorder, Favorite, Star } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utills/axiosInstance";
import publicAxiosInstance from "../../utills/publicAxiosInstance";

const HeroSection = () => (
  <Box
    sx={{
      width: "100%",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#12372A",
      overflowX: "hidden",
    }}
  >
    <Grid
      container
      spacing={2}
      alignItems="center"
      justifyContent="center"
      direction={{ xs: "column", sm: "row" }}
      sx={{
        width: "100%",
        maxWidth: "1200px",
        px: 2,
      }}
    >
      <Grid item xs={12} sm={6}>
        <Typography
          variant="h4"
          sx={{
            color: "#ADBC9F",
            fontWeight: "bold",
            textAlign: { xs: "center", sm: "left" },
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          بهترین طعم‌ها، در کمترین زمان.
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: "#FBFADA",
            fontWeight: "bold",
            mt: 2,
            textAlign: { xs: "center", sm: "left" },
            fontSize: { xs: "1.5rem", md: "2.1rem" },
          }}
        >
          غذای دلخواهت را سفارش بده.
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <img
          src={homepageBurger}
          alt="Hero Burger"
          onError={(e) => (e.target.src = "https://via.placeholder.com/100")}
          style={{ width: "100%", maxWidth: "500px", height: "auto" }}
        />
      </Grid>
    </Grid>
  </Box>
);

const Section = ({ children }) => (
  <Box
    sx={{
      width: "100%",
      minHeight: "100vh",
      overflowX: "hidden",
      overflowY: "auto",
      "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari
      scrollbarWidth: "none", // Firefox
      "-ms-overflow-style": "none", // IE 10+
    }}
  >
    {children}
  </Box>
);

const CategoryCards = () => {
  const navigate = useNavigate();
  const categories = [
    { title: "رستوران", image: restaurantImg, type: "restaurant" },
    { title: "کافه", image: cafeImg, type: "cafe" },
    { title: "شیرینی", image: sweetsImg, type: "sweets" },
    { title: "آبمیوه و بستنی", image: iceCreamImg, type: "ice_cream" },
    { title: "نانوایی", image: bakeryImg, type: "bakery" },
  ];

  const handleCategoryClick = (businessType) => {
    navigate(`/search?business_type=${businessType}`);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#ADBC9F",
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 6 },
        overflowX: "auto",
        display: "flex",
        flexDirection: "column",
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
        "-ms-overflow-style": "none",
      }}
    >
      {/* عنوان بالای سکشن */}
      <Typography
        variant="h2"
        sx={{
          mb: 4,
          textAlign: "center",
          color: "#12372A",
          fontWeight: "bold",
        }}
      >
        دسته بندی‌ها
      </Typography>

      {/* Wrapper کارت‌ها برای وسط چین عمودی و افقی */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center", // وسط افقی
          alignItems: "center", // وسط عمودی
          flexGrow: 1, // تمام فضای باقی مانده
          gap: 3,
        }}
      >
        {categories.map((category, index) => (
          <Card
            key={index}
            onClick={() => handleCategoryClick(category.type)}
            sx={{
              cursor: "pointer",
              textAlign: "center",
              borderRadius: "20px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
              backgroundColor: "#FBFADA",
              width: 200,
              height: 220,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "15px", // پدینگ داخلی کارت
              "&:hover": {
                transform: "scale(1.1)",
                border: "2px solid #12372A",
              },
            }}
          >
            <Box
              component="img"
              src={category.image}
              alt={category.title}
              sx={{
                width: 150,
                height: 150,
                mb: 2,
                objectFit: "contain",
              }}
            />
            <Typography sx={{ fontSize: "1.2rem", fontWeight: "700" }}>
              {category.title}
            </Typography>
          </Card>
        ))}
      </Box>
    </Box>
  );
};


const ProductSlider = () => {
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
        const sortedRestaurants = response.data.restaurants.sort(
          (a, b) => b.score - a.score
        );
        setRestaurants(sortedRestaurants);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchFavorites = async () => {
      if (isLoggedIn) {
        try {
          const response = await axiosInstance.get("/customer/favorites");
          const favoriteMap = {};
          response.data.forEach((fav) => {
            favoriteMap[fav.restaurant] = true;
          });
          setFavorites(favoriteMap);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchRestaurants();
    fetchFavorites();
  }, [isLoggedIn]);

  const toggleFavorite = async (restaurantId) => {
    if (!isLoggedIn) {
      alert("ابتدا وارد حساب شوید.");
      return;
    }
    const isFav = favorites[restaurantId];
    try {
      if (isFav) {
        await axiosInstance.delete("/customer/favorites", {
          params: { restaurant_id: restaurantId },
        });
        setFavorites((prev) => ({ ...prev, [restaurantId]: false }));
      } else {
        await axiosInstance.post("/customer/favorites", {
          restaurant_id: restaurantId,
        });
        setFavorites((prev) => ({ ...prev, [restaurantId]: true }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ m: 2, mt: 4 }}
      >
        <Typography variant="h2" sx={{ color: "#12372A", fontWeight: "bold" }}>
          محبوب ترین ها
        </Typography>
        <Button
          variant="text"
          sx={{
            color: "#12372A",
            backgroundColor: "transparent",
            fontWeight: "bold",
            fontSize: "14px",
            textDecoration: "underline",
          }}
          onClick={() => navigate(`/search?name=`)}
        >
          مشاهده همه
        </Button>
      </Box>
      <Grid
        container
        spacing={1}
        sx={{ backgroundColor: "#12372A", p: 3, overflowX: "hidden" }}
      >
        {restaurants.slice(0, 6).map((r) => (
          <Card
            key={r.id}
            onClick={() => navigate(`/customer/restaurants/${r.id}`)}
            sx={{
              cursor: "pointer",
              p: 2,
              m: 1,
              minWidth: 230,
              borderRadius: "20px",
              boxShadow: 0,
              "&:hover": {
                transform: "scale(1.05)",
                border: "2px solid #D68240",
              },
            }}
          >
            <CardMedia
              component="img"
              height="140"
              image={
                r.photo
                  ? `http://127.0.0.1:8000${r.photo}`
                  : "https://via.placeholder.com/120"
              }
              alt={r.name}
            />
            <CardContent>
              <Typography variant="h6">{r.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                <Star sx={{ pt: "12px" }} /> امتیاز: {r.score}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                هزینه ارسال: {Math.floor(parseFloat(r.delivery_price))} تومان
              </Typography>
            </CardContent>
            <IconButton
              sx={{ position: "absolute", top: 8, right: 8 }}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(r.id);
              }}
            >
              {favorites[r.id] ? (
                <Favorite sx={{ color: "red" }} />
              ) : (
                <FavoriteBorder />
              )}
            </IconButton>
          </Card>
        ))}
      </Grid>
    </Box>
  );
};

const UpFooter = () => {
  const navigate = useNavigate();
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery((theme) =>
    theme.breakpoints.between("sm", "md")
  );

  return (
    <Grid
      container
      alignItems="center"
      direction={isSmall ? "column" : "row"}
      sx={{ p: isSmall ? 2 : 0 }}
    >
      <Box
        ml={isSmall ? 0 : 12}
        mt={isSmall ? 4 : 8}
        mb={isSmall ? 0 : 8}
        mr={isSmall ? 0 : 15}
        textAlign="left"
      >
        <Typography
          variant={isSmall ? "h5" : "h4"}
          sx={{ mb: 2, color: "#D68240", fontWeight: "bold" }}
        >
          صاحب یک کسب و کار هستید؟
        </Typography>
        <Typography
          variant={isSmall ? "body1" : "h5"}
          sx={{ mb: 2, color: "black" }}
        >
          با فودی کسب و کارتان را آنلاین کنید و فروشتان را افزایش دهید.
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/restuarant/signup")}
        sx={{
          ml: isSmall ? 0 : 10,
          mb: isMedium ? "50px !important" : 0,
          width: isSmall ? "100%" : 155,
          height: 50,
          borderRadius: "50px !important",
          fontWeight: 400,
        }}
      >
        ثبت نام فروشندگان
      </Button>
    </Grid>
  );
};

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const resID = localStorage.getItem("res_id");
    if (resID && resID !== "undefined") navigate(`restaurant/${resID}/profile`);
  }, [navigate]);

  return (
    <Box
      sx={{
        overflowX: "hidden",
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
        "-ms-overflow-style": "none",
      }}
    >
      <Section>
        <HeroSection />
      </Section>
      <Section>
        <CategoryCards />
      </Section>
      <Section>
        <ProductSlider />
      </Section>
      <Section>
        <UpFooter />
      </Section>
      <Footer />
    </Box>
  );
};

export default HomePage;
