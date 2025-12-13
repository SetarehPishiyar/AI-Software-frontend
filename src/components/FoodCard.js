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
const isLoggedIn = !!localStorage.getItem("access");
const FoodCard = ({ food, onAddToCart, added }) => {
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

        <Box sx={{ display: "flex", gap: 2, marginTop: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: food.state === "available" ? "green" : "red",
              fontWeight: 500,
            }}
          >
            {food.state === "available" ? "موجود" : "ناموجود"}
          </Typography>
          {food.spice && (
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              تندی:{" "}
              {food.spice === "No"
                ? "کم"
                : food.spice === "Mild"
                ? "متوسط"
                : "زیاد"}
            </Typography>
          )}
        </Box>
      </CardContent>

      <Button
        variant="contained"
        onClick={(e) => {
          e.stopPropagation();

          const isLoggedIn = !!localStorage.getItem("access");

          if (!isLoggedIn) {
            alert("برای افزودن به سبد، ابتدا وارد حساب کاربری شوید");
            return;
          }

          if (food.state === "available" && onAddToCart) {
            onAddToCart(food);
          }
        }}
        disabled={!onAddToCart || added || food.state !== "available"}
        sx={{
          backgroundColor:
            added || food.state !== "available" ? "gray" : "#12372A",
          color: "white",
          alignSelf: "center",
          margin: 1,
          borderRadius: 20,
        }}
      >
        {!localStorage.getItem("access")
          ? "افزودن"
          : food.state !== "available"
          ? "ناموجود"
          : added
          ? "افزوده شد"
          : "افزودن"}
      </Button>
    </Card>
  );
};

export default FoodCard;
