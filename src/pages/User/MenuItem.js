// src/pages/User/FoodItemPage.js
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
import { useAuthContext as useAuth } from "../../contexts/AuthContext"; // ← اصلاح شد
import { useFoodCart } from "../../contexts/FoodCartContext"; // ← مسیر کانتکست
import { useFetchSingleItem } from "../../hooks/useFetchSingleItem"; // ← هوک fetch single item
import CommentsList from "../../components/ItemComments";

const FoodItemPage = () => {
  const navigate = useNavigate();
  const { id, item_id } = useParams();
  const { isLoggedIn } = useAuth();
  const { cartItems, addToCart, updateCartItem, fetchCart } = useFoodCart();

  const { itemData: foodItem, loading } = useFetchSingleItem(id, item_id);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchItemComments();
    if (isLoggedIn) fetchCart(id);
  }, [id, item_id, isLoggedIn]);

  const fetchItemComments = async () => {
    try {
      const res = await fetch(`/customer/items/${item_id}/reviews/`).then((r) =>
        r.json()
      );
      const reviews = res.map((review) => ({
        id: review.id,
        name: `${review.first_name} ${review.last_name}`,
        date: new Date(review.created_at).toLocaleDateString("fa-IR"),
        rating: review.score,
        comment: review.description,
      }));
      setComments(reviews);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  if (loading) return <Typography>در حال بارگذاری...</Typography>;
  if (!foodItem) return <Typography>آیتم پیدا نشد.</Typography>;

  const cartItem = cartItems.find((i) => i.item === parseInt(item_id));

  const handleAdd = () => {
    if (!isLoggedIn) {
      alert("ابتدا وارد حساب کاربری خود شوید");
      return;
    }
    addToCart(id, item_id, 1);
  };

  const handleQuantityChange = (delta) => {
    if (!cartItem && delta > 0) {
      handleAdd();
      return;
    }
    if (cartItem) {
      const newCount = cartItem.count + delta;
      if (newCount < 1) return;
      updateCartItem(cartItem.id, newCount);
    }
  };

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
      <Grid sx={{ display: "flex", flexDirection: "column", gap: 0.5, width: "30%", pb:"40px" }}>
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
        <Typography variant="body2" sx={{ my: 1, width: { lg: "500px" } }}>
          {foodItem.description}
        </Typography>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              sx={{
                textDecoration: foodItem.discount > 0 ? "line-through" : "none",
                color: foodItem.discount > 0 ? "gray" : "black",
              }}
            >
              {Math.floor(foodItem.price).toLocaleString()} تومان
            </Typography>
            {foodItem.discount > 0 && (
              <Typography sx={{ color: "green", fontWeight: "bold" }}>
                {Math.floor(
                  foodItem.price * (1 - foodItem.discount / 100)
                ).toLocaleString()}{" "}
                تومان
              </Typography>
            )}
          </Box>

          {!cartItem || cartItem.count === 0 ? (
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={handleAdd}
            >
              افزودن
            </Button>
          ) : (
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton
                onClick={() => handleQuantityChange(-1)}
                disabled={cartItem.count === 0}
              >
                <RemoveIcon />
              </IconButton>
              <Typography>{cartItem.count}</Typography>
              <IconButton onClick={() => handleQuantityChange(1)}>
                <AddIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate(`/customer/carts?restaurant_id=${id}`)}
          sx={{
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
            sx={{ mb: 3, fontWeight: "bold", pointerEvents: "none" }}
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
