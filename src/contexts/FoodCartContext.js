import { createContext, useContext, useState } from "react";
import privateAxiosInstance from "../utills/axiosInstance";

const FoodCartContext = createContext();

export const FoodCartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [restaurantIdState, setRestaurantIdState] = useState(null);

const fetchCart = async (restaurantId) => {
  try {
    setRestaurantIdState(restaurantId);

    const res = await privateAxiosInstance.get("/customer/carts", {
      params: { restaurant_id: restaurantId },
    });
    const cartObj = res.data.length > 0 ? res.data[0] : null;

    if (cartObj) {
      setCart(cartObj);

      setCartItems(cartObj.cart_items || []);
      setTotalPrice(parseFloat(cartObj.total_price || 0));
    } else {
      setCart(null);
      setCartItems([]);
      setTotalPrice(0);
    }
  } catch (error) {
    console.error("CART FETCH ERROR:", error);
    setCart(null);
    setCartItems([]);
    setTotalPrice(0);
  }
};


  const addToCart = async (restaurantId, itemId, count = 1) => {
    try {
      const payload = {
        restaurant_id: parseInt(restaurantId),
        item_id: parseInt(itemId),
        count,
      };

      await privateAxiosInstance.post("/customer/carts", payload);

      await fetchCart(restaurantId);
    } catch (error) {
      console.error("CART ADD ERROR:", error.response?.data || error);
    }
  };

  const updateCartItem = async (cartItemID, count) => {
    try {
      if (!cart?.id) {
        console.error("Cart ID not found. Call fetchCart first.");
        return;
      }

      await privateAxiosInstance.put(`/customer/carts/${cart.id}`, {
        cart_item_id: cartItemID,
        count,
      });

      if (restaurantIdState) {
        await fetchCart(restaurantIdState);
      }
    } catch (error) {
      console.error("UPDATE CART ITEM ERROR:", error.response?.data || error);
    }
  };

  return (
    <FoodCartContext.Provider
      value={{
        cart,
        cartItems,
        totalPrice,
        fetchCart,
        addToCart,
        updateCartItem,
      }}
    >
      {children}
    </FoodCartContext.Provider>
  );
};

export const useFoodCart = () => useContext(FoodCartContext);
