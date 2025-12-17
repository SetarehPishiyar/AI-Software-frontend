import React, { useState } from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import { PLACEHOLDER_IMG } from "../utills/constants";

const ItemCard = ({ item, onClick }) => {
  const [imgSrc, setImgSrc] = useState(
    item.photo
      ? item.photo.startsWith("http")
        ? item.photo
        : `http://127.0.0.1:8000${item.photo}`
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
        textAlign: "center",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "scale(1.05)",
          border: "2px solid #12372A",
        },
      }}
    >
      <CardMedia
        component="img"
        height="150"
        image={imgSrc}
        alt={item.name || "Item"}
        onError={() => setImgSrc(PLACEHOLDER_IMG)}
        sx={{ borderRadius: "12px" }}
      />

      <CardContent sx={{ p: 1 }}>
        {/* نام آیتم */}
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 0.5 }}>
          {item.name}
        </Typography>

        {/* نام رستوران */}
        {item.restaurant_name && (
          <Typography
            variant="body2"
            sx={{ color: "#12372A", fontWeight: 500 }}
          >
            {item.restaurant_name}
          </Typography>
        )}

        {/* شهر / استان */}
        {item.restaurant_city && (
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", display: "block" }}
          >
            {item.restaurant_city}
          </Typography>
        )}

        {/* قیمت */}
        {item.price && (
          <Typography variant="body2" sx={{ mt: 0.5, fontWeight: "bold" }}>
            قیمت: {Math.floor(parseFloat(item.price))} هزار تومان
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ItemCard;
