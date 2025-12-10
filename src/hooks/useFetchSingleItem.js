import { useEffect, useState } from "react";
import publicAxiosInstance from "../utills/publicAxiosInstance";
import { PLACEHOLDER_IMG } from "../utills/constants"; // آدرس placeholder

export const useFetchSingleItem = (restaurantId, itemId) => {
  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchItem = async () => {
    try {
      const res = await publicAxiosInstance.get(
        `/customer/restaurants/${restaurantId}/items/${itemId}`
      );
      const data = res.data;
      if (!data.photo) data.photo = PLACEHOLDER_IMG;
      setItemData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurantId && itemId) fetchItem();
  }, [restaurantId, itemId]);

  return { itemData, loading };
};
