import { useState, useEffect } from "react";
import axiosInstance from "../utills/axiosInstance";

export const useOrders = (userId) => {
  const [orders, setOrders] = useState([]);
  const [reviewsMap, setReviewsMap] = useState({});

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    const fetchOrdersAndReviews = async () => {
      try {
        // 1) سفارش‌ها
        const ordersRes = await axiosInstance.get("/customer/orders");
        if (cancelled) return;

        const orderList = ordersRes.data || [];
        setOrders(orderList);

        // 2) ریویوها را از روی آیتم‌ها می‌گیریم، ولی کلید match = review.order
        const map = {};

        for (const order of orderList) {
          const orderId = order.order_id; // این همونیه که تو UI نشون می‌دی
          if (!order?.order_items?.length) continue;

          let foundReview = null;

          for (const item of order.order_items) {
            const itemId = item.item ?? item.id;
            if (!itemId) continue;

            const res = await axiosInstance.get(
              `/customer/items/${itemId}/reviews/`
            );

            const reviews = res.data || [];
            // ✅ مچ درست: review.order با orderId
            const reviewForThisOrder = reviews.find(
              (r) => Number(r.order) === Number(orderId)
            );

            if (reviewForThisOrder) {
              foundReview = reviewForThisOrder;
              break;
            }
          }

          if (foundReview) {
            map[String(orderId)] = foundReview;
          }
        }

        if (cancelled) return;
        setReviewsMap(map);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrdersAndReviews();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { orders, reviewsMap };
};
