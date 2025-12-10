// src/context/FoodCartContext.js
import { createContext, useContext, useState } from "react";
import privateAxiosInstance from "../utills/axiosInstance";

const FoodCartContext = createContext();

export const FoodCartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchCart = async (restaurantId) => {
    try {
      const res = await privateAxiosInstance.get("/customer/carts", {
        params: { restaurant_id: restaurantId },
      });
      const filtered = res.data.filter(
        (cart) => cart.restaurant === parseInt(restaurantId)
      );
      if (filtered[0]) {
        setCartItems(filtered[0].cart_items || []);
        setTotalPrice(filtered[0].total_price);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = async (restaurantId, itemId, count = 1) => {
    try {
      await privateAxiosInstance.post("/customer/carts", {
        restaurant_id: restaurantId,
        item_id: parseInt(itemId),
        count,
      });
      fetchCart(restaurantId);
    } catch (error) {
      console.error(error);
    }
  };

  const updateCartItem = async (cartID, cartItemID, count) => {
    try {
      await privateAxiosInstance.put(`/customer/carts/${cartID}`, {
        cart_item_id: cartItemID,
        count,
      });
      fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FoodCartContext.Provider
      value={{ cartItems, totalPrice, fetchCart, addToCart, updateCartItem }}
    >
      {children}
    </FoodCartContext.Provider>
  );
};

export const useFoodCart = () => useContext(FoodCartContext);