import publicAxiosInstance from "../utills/publicAxiosInstance";

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
