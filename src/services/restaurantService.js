import publicAxiosInstance from "../utills/publicAxiosInstance";
import axiosInstance from "../utills/axiosInstance"; 

export const getRestaurants = async () => {
  try {
    const response = await publicAxiosInstance.get("/restaurant/profiles");
    const sorted = response.data.restaurants.sort((a, b) => b.score - a.score);
    return sorted;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getRestaurantProfile = async () => {
  try {
    const response = await axiosInstance.get("/restaurant/profiles/me");
    return response.data;
  } catch (err) {
    console.error("Error fetching restaurant profile:", err);
    return null;
  }
};
