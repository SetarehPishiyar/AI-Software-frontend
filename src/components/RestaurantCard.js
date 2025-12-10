import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import { Favorite, FavoriteBorder, Star } from "@mui/icons-material";

const RestaurantCard = ({
  restaurant,
  isFavorite,
  toggleFavorite,
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: "pointer",
        p: 2,
        m: 1,
        minWidth: 230,
        borderRadius: "20px",
        backgroundColor: "#FBFADA",
        boxShadow: 0,
        "&:hover": {
          transform: "scale(1.1)",
          border: "2px solid #12372A",
        },
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={
          restaurant.photo
            ? `http://127.0.0.1:8000${restaurant.photo}`
            : "https://via.placeholder.com/120"
        }
        alt={restaurant.name}
      />
      <CardContent>
        <Typography variant="h6">{restaurant.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          <Star sx={{ pt: "12px" }} /> امتیاز: {restaurant.score}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          هزینه ارسال: {Math.floor(parseFloat(restaurant.delivery_price))} تومان
        </Typography>
      </CardContent>
      <IconButton
        sx={{ position: "absolute", top: 8, right: 8 }}
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(restaurant.id);
        }}
      >
        {isFavorite ? <Favorite sx={{ color: "red" }} /> : <FavoriteBorder />}
      </IconButton>
    </Card>
  );
};

export default RestaurantCard;
