import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Grid, AppBar, Toolbar, Typography } from "@mui/material";
import YumziImg from "../../assets/imgs/yumzi_icon.png";

import { useAuthContext } from "../../contexts/AuthContext";
import useFavorites from "../../hooks/useFavorites";
import useSingleRestaurant from "../../components/SingleRestaurantFetcher";
import useRestaurantFoods from "../../hooks/useRestaurantFoods";
import useCart from "../../hooks/useCart";

import RestaurantInfo from "../../components/RestaurantInfo";
import FoodList from "../../components/FoodList";

const RestaurantPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { restaurant, loading, error } = useSingleRestaurant(id);
  const { isLoggedIn } = useAuthContext();
  const isAuthenticated = isLoggedIn;

  const { foodData } = useRestaurantFoods(id);
  const { addedToCart, addToCart } = useCart(id, isAuthenticated);
  const { favorites, toggleFavorite } = useFavorites(isAuthenticated);

  const handleViewCartClick = () => {
    if (isAuthenticated) {
      navigate(`/customer/carts?restaurant_id=${id}`);
    } else {
      alert("ابتدا وارد حساب کاربری خود شوید.");
    }
  };

  if (loading) return <p>در حال بارگذاری رستوران...</p>;
  if (error) return <p>خطا در دریافت اطلاعات رستوران</p>;
  if (!restaurant) return <p>رستورانی یافت نشد</p>;

  return (
    <Grid
      container
      gap={8}
      sx={{
        width: "100%",
        justifyContent: "center",
        backgroundColor: "#ADBC9F",
      }}
    >
      {/* Header Inline */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#12372A",
          boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <img
              src={YumziImg}
              alt="Yumzi Logo"
              style={{ width: "100px", cursor: "pointer" }}
            />
          </a>
          <Typography
            variant="h4"
            sx={{
              color: "#fff",
              fontWeight: "bold",
              flex: 1,
              textAlign: "center",
              userSelect: "none",
              pointerEvents: "none",
              paddingRight: "50px",
            }}
          >
            صفحه رستوران
          </Typography>
          <Box />
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <RestaurantInfo
        restaurant={restaurant}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        onViewCart={handleViewCartClick}
      />

      <FoodList
        foods={foodData}
        addedToCart={addedToCart}
        onAddToCart={(food) => addToCart(id, food)}
        navigateToFood={(itemId) =>
          navigate(`/customer/restaurants/${id}/${itemId}`)
        }
      />
    </Grid>
  );
};

export default RestaurantPage;
