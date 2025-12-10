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

const FoodCard = ({ food, onAddToCart, added }) => (
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
    </CardContent>

    <Button
      variant="contained"
      onClick={(e) => {
        e.stopPropagation();
        onAddToCart(food);
      }}
      disabled={added}
      sx={{
        backgroundColor: added ? "gray" : "#12372A",
        color: added ? "white" : "black",
        alignSelf: "center",
        margin: 1,
        borderRadius: 20,
      }}
    >
      {added ? "افزوده شد" : "افزودن"}
    </Button>
  </Card>
);

export default FoodCard;
