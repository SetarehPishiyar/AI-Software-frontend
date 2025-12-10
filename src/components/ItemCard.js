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
        "&:hover": { transform: "scale(1.05)", border: "2px solid #12372A" },
        textAlign: "center",
      }}
    >
      <CardMedia
        component="img"
        height="150"
        image={imgSrc}
        alt={item.name || "Item"}
        onError={() => setImgSrc(PLACEHOLDER_IMG)}
      />
      <CardContent sx={{ p: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          قیمت: {Math.floor(parseFloat(item.price))} تومان
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
