import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import FoodCard from "./FoodCard";
import { useFoodCart } from "../contexts/FoodCartContext";

const FoodList = ({ foods, navigateToFood }) => {
  const { cartItems, updateCartItem, addToCart } = useFoodCart();

  useEffect(() => {
    foods.forEach((food) => {
      if (food.state !== "available") {
        const inCart = cartItems.find((i) => i.item_id === food.item_id);
        if (inCart && inCart.count > 0) {
          updateCartItem(inCart.id, 0);
        }
      }
    });
  }, [foods, cartItems, updateCartItem]);

  const handleAddToCart = (food) => {
    addToCart(food.restaurant, food.item_id, 1);
  };

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
      {foods.map((food) => {
        const added = !!cartItems.find((i) => i.item_id === food.item_id);

        return (
          <div key={food.item_id} onClick={() => navigateToFood(food.item_id)}>
            <FoodCard
              food={food}
              onAddToCart={{
                ...handleAddToCart,
                removeItem: (item_id) => {
                  const inCart = cartItems.find((i) => i.item_id === item_id);
                  if (inCart) {
                    updateCartItem(inCart.id, 0);
                  }
                },
              }}
              added={added}
            />
          </div>
        );
      })}
    </Box>
  );
};

export default FoodList;
