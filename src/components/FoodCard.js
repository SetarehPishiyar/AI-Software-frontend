import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { PLACEHOLDER_IMG } from "../utills/constants";

const FoodCard = ({ food, onAddToCart, added }) => {
  const isAvailable = food.state === "available";

  const buttonDisabled = added || !isAvailable;
  const buttonText = !isAvailable ? "ناموجود" : added ? "افزوده شد" : "افزودن";

  return (
    <Card
      sx={{
        display: "flex",
        mb: 2,
        boxShadow: "none",
        padding: 2,
        borderRadius: 3,
        borderBottom: "1px solid gray",
        backgroundColor: "#FBFADA",
        "&:hover": { backgroundColor: "#e4eac7 !important" },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          image={food.photo || PLACEHOLDER_IMG}
          alt={food.name}
          sx={{ width: 120, borderRadius: 3 }}
        />
        {food.discount > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "red",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
              padding: "2px 6px",
              borderRadius: "3px",
            }}
          >
            {food.discount}٪ تخفیف
          </Box>
        )}
      </Box>

      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" sx={{ pointerEvents: "none" }}>
          {food.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ pointerEvents: "none" }}
        >
          {food.description}
        </Typography>

        <Box sx={{ paddingTop: 2 }}>
          {food.discount > 0 ? (
            <>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  textDecoration: "line-through",
                  display: "inline-block",
                  marginRight: "8px",
                }}
              >
                {Math.floor(food.price).toLocaleString()} تومان
              </Typography>
              <Typography
                variant="body1"
                color="#12372A"
                sx={{ display: "inline-block" }}
              >
                {Math.floor(
                  food.price * (1 - food.discount / 100)
                ).toLocaleString()}{" "}
                تومان
              </Typography>
            </>
          ) : (
            <Typography variant="body1">
              {Math.floor(food.price).toLocaleString()} تومان
            </Typography>
          )}
        </Box>

        {/* ✅ نمایش وضعیت */}
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: isAvailable ? "green" : "red",
              fontWeight: 600,
              pointerEvents: "none",
            }}
          >
            {isAvailable ? "موجود" : "ناموجود"}
          </Typography>
        </Box>
      </CardContent>

      <Button
        variant="contained"
        onClick={(e) => {
          e.stopPropagation();
          const access = localStorage.getItem("access");
          const refresh = localStorage.getItem("refresh");
          const isLoggedIn = !!access && !!refresh;

          if (!isLoggedIn) {
            alert("برای افزودن به سبد، ابتدا وارد حساب کاربری شوید");
            return;
          }
          if (!isAvailable || added) return;
          onAddToCart(food);
        }}
        disabled={buttonDisabled}
        sx={{
          backgroundColor: buttonDisabled ? "gray" : "#12372A",
          color: "white",
          alignSelf: "center",
          margin: 1,
          borderRadius: 20,
        }}
      >
        {buttonText}
      </Button>
    </Card>
  );
};

export default FoodCard;
