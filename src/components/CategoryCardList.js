import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import iranianImg from "../assets/imgs/iranian.png";
import fastfoodImg from "../assets/imgs/fastfood.png";
import italianImg from "../assets/imgs/italian.png";
import asianImg from "../assets/imgs/asian.png";
import mexicanImg from "../assets/imgs/mexican.png";

const categories = [
  { title: "ایرانی", image: iranianImg, type: "Iranian" },
  { title: "فست فود", image: fastfoodImg, type: "FastFood" },
  { title: "ایتالیایی", image: italianImg, type: "Italian" },
  { title: "آسیایی", image: asianImg, type: "Asian" },
  { title: "مکزیکی", image: mexicanImg, type: "Mexican" },
];

const CategoryCardList = () => {
  const navigate = useNavigate();
  const handleCategoryClick = (type) =>
    navigate(`/search?business_type=${type}`);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#ADBC9F",
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 6 },
        overflowX: "auto",
        display: "flex",
        flexDirection: "column",
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
        "-ms-overflow-style": "none",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          mb: 1,
          textAlign: "center",
          color: "#12372A",
          fontWeight: "bold",
        }}
      >
        دسته بندی‌ها
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
          gap: 3,
        }}
      >
        {categories.map((c, i) => (
          <CategoryCard
            key={i}
            title={c.title}
            image={c.image}
            onClick={() => handleCategoryClick(c.type)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default CategoryCardList;
