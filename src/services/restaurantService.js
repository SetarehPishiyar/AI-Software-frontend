import publicAxiosInstance from "../utills/publicAxiosInstance";
import axiosInstance from "../utills/axiosInstance"; 

export const getRestaurants = async (city_name) => {
  try {
    const params = city_name ? { city_name } : {};

    const response = await publicAxiosInstance.get("/restaurant/profiles", {
      params,
    });

    return response.data;
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
