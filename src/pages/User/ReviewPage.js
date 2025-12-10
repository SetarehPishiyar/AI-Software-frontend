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
import axiosInstance from "../../utills/axiosInstance";

const ReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orderResponse = await axiosInstance.get("/customer/orders");
        const orderData = orderResponse.data;
        const selectedOrder = orderData.find(
          (order) => order.order_id === parseInt(id)
        );
        if (selectedOrder) {
          setOrder(selectedOrder);
          const restaurantId = selectedOrder.restaurant;
          const restaurantResponse = await axiosInstance.get(
            "/restaurant/profiles"
          );
          const restaurantData = restaurantResponse.data.restaurants;

          const selectedRestaurant = restaurantData.find(
            (restaurant) => restaurant.id === restaurantId
          );
          if (selectedRestaurant) {
            setRestaurant(selectedRestaurant);
          } else {
            console.error("Restaurant not found");
          }
        } else {
          console.error("Order not found");
        }
      } catch (error) {
        console.error("Error fetching order or restaurant data:", error);
      }
    };

    fetchOrders();
  }, [id]);

  const handleSubmit = async () => {
    if (rating === 0 || !comment.trim()) {
      alert("لطفاً امتیاز و نظر خود را وارد کنید.");
      return;
    }

    const reviewData = {
      order: parseInt(id),
      score: parseInt(rating),
      description: comment,
    };

    try {
      const response = await axiosInstance.post(
        "/customer/reviews/create",
        reviewData
      );

      if (response.status === 201) {
        alert("نظر با موفقیت ثبت شد.");
        navigate("/customer/orders");
      } else {
        alert("مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("خطای سرور. لطفاً دوباره تلاش کنید.");
    }
  };

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
          sx={{ fontWeight: "bold", color: "#12372A", mb: 3, color: "#fff" }}
        >
          نظردهی
        </Typography>

        {restaurant ? (
          <CardMedia
            component="img"
            image={`http://127.0.0.1:8000${restaurant.photo}`}
            alt={restaurant.name || "Restaurant Image"}
            sx={{
              width: "100%",
              maxWidth: "250px",
              height: "auto",
              color: "#fff",
              borderRadius: 2,
              mx: "auto",
              mb: 3,
            }}
          />
        ) : (
          <Typography variant="body2" color="text.secondary" mb={3}>
            در حال بارگذاری اطلاعات رستوران...
          </Typography>
        )}

        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", mb: 1, color: "#fff" }}
        >
          به سفارش خود امتیاز دهید
        </Typography>

        <Rating
          name="user-rating"
          value={rating}
          onChange={(event, newValue) => setRating(newValue)}
          size="large"
          precision={1}
          sx={{
            "& .MuiRating-iconEmpty": {
              color: "#ffffff",
            },
            "& .MuiRating-iconFilled": {
              color: "#ebcc34",
            },
            "& .MuiRating-iconHover": {
              color: "#ebcc34",
            },
            mb: 2,
          }}
        />

        <TextField
          fullWidth
          multiline
          minRows={3}
          placeholder="نظر خود را اینجا بنویسید..."
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
