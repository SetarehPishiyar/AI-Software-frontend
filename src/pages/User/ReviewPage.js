import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Rating,
  Card,
  CardMedia,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import { useAuthContext } from "../../contexts/AuthContext";
import { useOrders } from "../../hooks/useOrders";
import useSingleRestaurant from "../../components/SingleRestaurantFetcher";
import { getUserInfo } from "../../services/userService";

import axiosInstance from "../../utills/axiosInstance";
import { PLACEHOLDER_IMG } from "../../utills/constants"; 

const ReviewPage = () => {
  const { id } = useParams(); // order_id
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthContext();

  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      const data = await getUserInfo();
      if (!data) {
        navigate("/login");
        return;
      }
      setUser(data);
      setLoadingUser(false);
    };
    fetchUser();
  }, [navigate]);

  const userId = user?.user?.id;
  const { orders } = useOrders(userId);

  useEffect(() => {
    if (!orders || orders.length === 0) return;

    const found = orders.find((o) => o.order_id === Number(id));
    setOrder(found || null);
  }, [orders, id]);

  const restaurantId = order?.restaurant;
  const { restaurant, loading: loadingRestaurant } =
    useSingleRestaurant(restaurantId);

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) {
      alert("لطفاً امتیاز و نظر خود را وارد کنید.");
      return;
    }

    try {
      const res = await axiosInstance.post("/customer/reviews/create", {
        order: Number(id),
        score: rating,
        description: comment,
      });

      if (res.status === 201) {
        alert("نظر شما با موفقیت ثبت شد.");
        navigate("/customer/orders");
      }
    } catch (err) {
      console.error(err);
      alert("خطا در ثبت نظر. دوباره تلاش کنید.");
    }
  };

  if (loadingUser) {
    return (
      <Typography sx={{ mt: 5, textAlign: "center", color: "#fff" }}>
        در حال بارگذاری...
      </Typography>
    );
  }

  if (!order) {
    return (
      <Typography sx={{ mt: 5, textAlign: "center", color: "#fff" }}>
        سفارش موردنظر یافت نشد.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#ADBC9F",
        py: { xs: 3, sm: 5 },
        px: { xs: 2, sm: 4 },
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Card
        sx={{
          width: { xs: "100%", sm: "90%", md: "80%" },
          bgcolor: "#12372A",
          borderRadius: 3,
          boxShadow: 3,
          p: { xs: 2, sm: 4 },
          textAlign: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", mb: 3, color: "#fff" }}
        >
          ثبت نظر برای سفارش شماره {order.order_id}
        </Typography>

        {/* رستوران */}
        {!loadingRestaurant && restaurant && (
          <CardMedia
            component="img"
            image={
              restaurant.photo
                ? `http://127.0.0.1:8000${restaurant.photo}`
                : PLACEHOLDER_IMG
            }
            alt={restaurant.name}
            sx={{
              width: "100%",
              maxWidth: 250,
              height: "auto",
              borderRadius: 2,
              mx: "auto",
              mb: 3,
            }}
          />
        )}

        <Typography sx={{ fontWeight: "bold", mb: 1, color: "#fff" }}>
          امتیاز خود را ثبت کنید
        </Typography>

        <Rating
          value={rating}
          onChange={(e, v) => setRating(v)}
          size="large"
          precision={1}
          sx={{
            mb: 2,
            "& .MuiRating-iconFilled": { color: "#ebcc34" },
            "& .MuiRating-iconHover": { color: "#ebcc34" },
            "& .MuiRating-iconEmpty": { color: "#ffffff" },
          }}
        />

        <TextField
          fullWidth
          multiline
          minRows={3}
          placeholder="نظر خود را بنویسید..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{
            bgcolor: "#b9c3a7",
            borderRadius: 1.5,
            mb: 3,
          }}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            width: "100%",
            bgcolor: "#0f3924",
            color: "#fff",
            fontWeight: "bold",
            py: 1.5,
            "&:hover": { bgcolor: "#12372A" },
          }}
        >
          ثبت نظر
        </Button>
      </Card>
    </Box>
  );
};

export default ReviewPage;
