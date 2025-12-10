import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import restaurantImg from "../../assets/imgs/restaurant.png";
import cafeImg from "../../assets/imgs/cafe.png";
import sweetsImg from "../../assets/imgs/sweets.png";
import iceCreamImg from "../../assets/imgs/ice_cream.png";
import bakeryImg from "../../assets/imgs/bakery.png";

const categories = [
  { title: "رستوران", image: restaurantImg, type: "restaurant" },
  { title: "کافه", image: cafeImg, type: "cafe" },
  { title: "شیرینی", image: sweetsImg, type: "sweets" },
  { title: "آبمیوه و بستنی", image: iceCreamImg, type: "ice_cream" },
  { title: "نانوایی", image: bakeryImg, type: "bakery" },
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
