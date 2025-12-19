import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import yumzi_icon from "../../assets/imgs/yumzi_icon.png";
import { useAuthContext as useAuth } from "../../contexts/AuthContext";
import { useFoodCart } from "../../contexts/FoodCartContext";
import { useFetchSingleItem } from "../../hooks/useFetchSingleItem";
import CommentsList from "../../components/ItemComments";
import useSingleRestaurant from "../../components/SingleRestaurantFetcher";

const FoodItemPage = () => {
  const navigate = useNavigate();
  const { id, item_id } = useParams();
  const { isLoggedIn } = useAuth();
  const { cartItems, addToCart, updateCartItem, fetchCart } = useFoodCart();

  const { itemData: foodItem, loading } = useFetchSingleItem(id, item_id);
  const {
    restaurant,
    loading: restaurantLoading,
    error: restaurantError,
  } = useSingleRestaurant(id);

  const [cartLoaded, setCartLoaded] = useState(false);

  const isAvailable = foodItem?.state?.toLowerCase() === "available";

  useEffect(() => {
    let mounted = true;

    const loadCart = async () => {
      try {
        if (isLoggedIn) {
          await fetchCart(id);
        }
      } finally {
        if (mounted) setCartLoaded(true);
      }
    };

    loadCart();

    return () => {
      mounted = false;
    };
  }, [id, isLoggedIn, fetchCart]);

  useEffect(() => {
    if (!foodItem || !cartLoaded) return;

    if (!isAvailable) {
      const currentCartItem = cartItems.find((i) => i.item == item_id);
      if (currentCartItem && currentCartItem.count > 0) {
        updateCartItem(currentCartItem.id, 0);
      }
    }
  }, [cartItems, foodItem, cartLoaded, isAvailable, item_id, updateCartItem]);

  if (loading) return <Typography>در حال بارگذاری...</Typography>;
  if (!foodItem) return <Typography>آیتم پیدا نشد.</Typography>;

  const currentCartItem = cartItems.find((i) => i.item == item_id) || null;

  const handleAdd = () => {
    if (!isLoggedIn) {
      alert("ابتدا وارد حساب کاربری خود شوید");
      return;
    }
    addToCart(id, item_id, 1);
  };

  const handleQuantityChange = (delta) => {
    if (!currentCartItem && delta > 0) {
      handleAdd();
      return;
    }
    if (currentCartItem) {
      const newCount = currentCartItem.count + delta;
      if (newCount < 1) return;
      updateCartItem(currentCartItem.id, newCount);
    }
  };

  const getSpiceLabel = (spice) => {
    if (!spice) return "";
    const s = spice.toLowerCase();
    if (s === "no") return "کم";
    if (s === "mild") return "متوسط";
    if (s === "hot") return "زیاد";
    return spice;
  };

  const restaurantName =
    restaurant?.name ||
    restaurant?.restaurant?.name ||
    restaurant?.data?.name ||
    "";

  return (
    <Grid
      container
      gap={8}
      sx={{
        width: "100%",
        minHeight: "100vh",
        justifyContent: "center",
        backgroundColor: "#ADBC9F",
      }}
    >
      {/* AppBar */}
      <AppBar position="static" sx={{ backgroundColor: "#12372A" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <img
            src={yumzi_icon}
            alt="Ymzi Logo"
            style={{ width: "130px", height: "40px", cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
          <Typography
            variant="h5"
            sx={{
              color: "#fff",
              fontWeight: "bold",
              flexGrow: 1,
              textAlign: "center",
            }}
          >
            صفحه آیتم منو
          </Typography>
          <Box sx={{ width: 120 }} />
        </Toolbar>
      </AppBar>

      {/* Item Info */}
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          width: "30%",
          pb: "40px",
        }}
      >
        <Box
          sx={{ position: "relative", width: "fit-content", margin: "auto" }}
        >
          {foodItem.discount > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                bgcolor: "red",
                color: "white",
                p: "4px 8px",
                borderRadius: "8px",
              }}
            >
              {foodItem.discount}% تخفیف
            </Box>
          )}
          <img
            src={foodItem.photo || "https://via.placeholder.com/120"}
            alt="Food"
            style={{
              height: "250px",
              borderRadius: 18,
              display: "block",
              margin: "auto",
            }}
          />
        </Box>

        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography variant="h6" sx={{ py: 1 }}>
            {foodItem.name}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              cursor: restaurantName ? "pointer" : "default",
              textDecoration: restaurantName ? "underline" : "none",
              color: "#12372A",
              fontWeight: "bold",
            }}
            onClick={() => {
              if (!restaurantName) return;
              navigate(`/customer/restaurants/${id}`);
            }}
          >
            {restaurantLoading
              ? "در حال دریافت نام رستوران..."
              : restaurantError
              ? "خطا در دریافت نام رستوران"
              : restaurantName
              ? ` رستوران ${restaurantName}`
              : " رستوران -"}
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ my: 1 }}>
          {foodItem.description}
        </Typography>

        {foodItem.state && (
          <Typography
            variant="body2"
            sx={{
              mb: 0.5,
              color: isAvailable ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {isAvailable ? "موجود" : "ناموجود"}
          </Typography>
        )}

        {foodItem.spice && (
          <Typography variant="body2" sx={{ mb: 0.5, fontWeight: "bold" }}>
            تندی: {getSpiceLabel(foodItem.spice)}
          </Typography>
        )}

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              sx={{
                textDecoration: foodItem.discount > 0 ? "line-through" : "none",
                color: foodItem.discount > 0 ? "gray" : "black",
              }}
            >
              {Math.floor(foodItem.price).toLocaleString()} هزار تومان
            </Typography>
            {foodItem.discount > 0 && (
              <Typography sx={{ color: "green", fontWeight: "bold" }}>
                {Math.floor(
                  foodItem.price * (1 - foodItem.discount / 100)
                ).toLocaleString()}{" "}
                هزار تومان
              </Typography>
            )}
          </Box>

          {cartLoaded ? (
            isAvailable ? (
              currentCartItem && currentCartItem.count > 0 ? (
                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton onClick={() => handleQuantityChange(-1)}>
                    <RemoveIcon />
                  </IconButton>
                  <Typography>{currentCartItem.count}</Typography>
                  <IconButton onClick={() => handleQuantityChange(1)}>
                    <AddIcon />
                  </IconButton>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleAdd}
                  sx={{
                    backgroundColor: "#FBFADA !important",
                    color: "#000",
                    ml: 2,
                    "&:hover": { backgroundColor: "#E3EBC6 !important" },
                  }}
                >
                  افزودن به سبد خرید
                </Button>
              )
            ) : (
              <Typography sx={{ color: "red", fontWeight: "bold" }}>
                ناموجود
              </Typography>
            )
          ) : null}
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate(`/customer/carts?restaurant_id=${id}`)}
          sx={{
            mt: 2,
            backgroundColor: "#FBFADA !important",
            color: "#000",
            "&:hover": { backgroundColor: "#E3EBC6 !important" },
          }}
        >
          مشاهده سبد خرید
        </Button>
      </Grid>

      {/* Comments */}
      <Grid>
        <Box
          sx={{
            width: { lg: "500px" },
            bgcolor: "#FBFADA",
            p: 2,
            borderRadius: "8px",
            mt: 4,
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{ mb: 3, fontWeight: "bold" }}
          >
            نظر کاربران
          </Typography>
          <Box sx={{ maxHeight: "500px", overflowY: "auto" }}>
            <CommentsList itemId={item_id} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default FoodItemPage;
