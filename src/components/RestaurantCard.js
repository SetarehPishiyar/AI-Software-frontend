import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { Favorite, FavoriteBorder, Star, Delete } from "@mui/icons-material";
import { PLACEHOLDER_IMG } from "../utills/constants";

const RestaurantCard = ({
  restaurant,
  isFavorite,
  toggleFavorite,
  onClick,
  showDetails = true, 
}) => {
  const [imgSrc, setImgSrc] = useState(
    restaurant.photo
      ? restaurant.photo.startsWith("http")
        ? restaurant.photo
        : `http://127.0.0.1:8000${restaurant.photo}`
      : PLACEHOLDER_IMG
  );

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
        position: "relative",
        "&:hover": { transform: "scale(1.05)", border: "2px solid #12372A" },
      }}
    >
      {/* تصویر */}
      <CardMedia
        component="img"
        height="200"
        image={imgSrc}
        alt={restaurant.name || "Restaurant"}
        onError={() => setImgSrc(PLACEHOLDER_IMG)}
      />

      {/* محتوا */}
      <CardContent sx={{ textAlign: "center", p: 0.5, pb: 0.5 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", fontSize: "1rem" }}
        >
          {restaurant.name}
        </Typography>

        {showDetails && (
          <>
            <Typography variant="body2" color="text.secondary">
              <Star sx={{ pt: "12px" }} /> امتیاز: {restaurant.score}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              هزینه ارسال: {Math.floor(parseFloat(restaurant.delivery_price))}{" "}
              تومان
            </Typography>
          </>
        )}
      </CardContent>

      {/* آیکون‌ها */}
      <Box
        sx={{ display: "flex", justifyContent: "space-evenly", width: "100%" }}
      >
        {showDetails ? (
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(restaurant.id);
            }}
          >
            {isFavorite ? (
              <Favorite sx={{ color: "red" }} />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>
        ) : (
          <>
            <IconButton
              sx={{ color: "red" }}
            >
              <Favorite />
            </IconButton>
            <IconButton
              sx={{ color: "#12372A" }}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(restaurant.id); 
              }}
            >
              <Delete />
            </IconButton>
          </>
        )}
      </Box>
    </Card>
  );
};

export default RestaurantCard;
