import axiosInstance from "../utills/axiosInstance";

export const getFavorites = async () => {
  try {
    const response = await axiosInstance.get("/customer/favorites");
    return response.data; // [{ restaurant: 1 }, { restaurant: 2 }, ...]
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const addFavorite = async (restaurantId) => {
  try {
    await axiosInstance.post("/customer/favorites", {
      restaurant_id: restaurantId,
    });
  } catch (err) {
    console.error(err);
  }
};

export const removeFavorite = async (restaurantId) => {
  try {
    await axiosInstance.delete("/customer/favorites", {
      params: { restaurant_id: restaurantId },
    });
  } catch (err) {
    console.error(err);
  }
};
