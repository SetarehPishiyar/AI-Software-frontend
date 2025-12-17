import { useState, useEffect } from "react";
import axiosInstance from "../utills/axiosInstance";

export const useOrders = (userId) => {
  const [orders, setOrders] = useState([]);
  const [reviewsMap, setReviewsMap] = useState({}); 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("/customer/orders");
        setOrders(response.data);

        // fetch reviews
        for (let order of response.data) {
          if (!order.order_items || order.order_items.length === 0) continue;
          let found = false;
          for (let item of order.order_items) {
            const res = await axiosInstance.get(
              `/customer/items/${item.item || item.id}/reviews/`
            );
            const myReview = res.data.find((r) => r.user_id === userId);
            if (myReview) {
              setReviewsMap((prev) => ({
                ...prev,
                [order.order_id]: myReview,
              }));
              found = true;
              break;
            }
          }
          if (!found) {
            setReviewsMap((prev) => ({ ...prev, [order.order_id]: null }));
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, [userId]);

  return { orders, reviewsMap };
};
