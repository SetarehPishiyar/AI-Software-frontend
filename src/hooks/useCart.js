import { useState, useEffect } from "react";
import axiosInstance from "../utills/axiosInstance";

const useCart = (restaurantId, isAuthenticated) => {
  const [addedToCart, setAddedToCart] = useState({});

  useEffect(() => {
    if (!isAuthenticated || !restaurantId) return;

    const fetchCartData = async () => {
      try {
        const response = await axiosInstance.get("/customer/carts", {
          params: { restaurant_id: restaurantId },
        });
        const cartItems = response.data?.[0]?.cart_items || [];
        const cartStatus = {};
        cartItems.forEach((item) => {
          cartStatus[item.item] = true;
        });
        setAddedToCart(cartStatus);
      } catch (err) {
        console.error("خطا در دریافت سبد خرید:", err);
      }
    };

    fetchCartData();
  }, [restaurantId, isAuthenticated]);

  const addToCart = async (restaurantId, foodItem) => {
    try {
      const response = await axiosInstance.post("/customer/carts", {
        restaurant_id: restaurantId,
        item_id: foodItem.item_id,
        count: 1,
      });
      if (response.status === 201) {
        setAddedToCart((prev) => ({ ...prev, [foodItem.item_id]: true }));
      }
    } catch (err) {
      console.error("خطا در افزودن به سبد خرید:", err);
    }
  };

  return { addedToCart, addToCart, setAddedToCart };
};

export default useCart;
