import React from "react";
import { Box, Typography } from "@mui/material";
import FoodCard from "./FoodCard";

const FoodList = ({ foods, onAddToCart, addedToCart, navigateToFood }) => {
  if (!foods || foods.length === 0) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: "center" }}
      >
        هیچ غذایی در منو وجود ندارد.
      </Typography>
    );
  }

  return (
    <Box sx={{ width: { lg: "700px" } }}>
      {foods.map((food) => (
        <div key={food.item_id} onClick={() => navigateToFood(food.item_id)}>
          <FoodCard
            food={food}
            onAddToCart={onAddToCart}
            added={!!addedToCart?.[food.item_id]}
          />
        </div>
      ))}
    </Box>
  );
};

export default FoodList;
