import React from "react";
import { Card, Box, Typography } from "@mui/material";

const CategoryCard = ({ title, image, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      cursor: "pointer",
      color: "#12372A",
      textAlign: "center",
      borderRadius: "20px",
      boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
      backgroundColor: "#FBFADA",
      width: 200,
      height: 220,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "15px",
      "&:hover": {
        transform: "scale(1.1)",
        border: "2px solid #12372A",
      },
    }}
  >
    <Box
      component="img"
      src={image}
      alt={title}
      sx={{
        width: 150,
        height: 150,
        mb: 2,
        objectFit: "contain",
      }}
    />
    <Typography sx={{ fontSize: "1.2rem", fontWeight: "700" }}>
      {title}
    </Typography>
  </Card>
);

export default CategoryCard;
