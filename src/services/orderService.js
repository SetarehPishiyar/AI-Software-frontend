import axiosInstance from "../utills/axiosInstance";

export const getUserOrders = async () => {
  try {
    const response = await axiosInstance.get("/customer/orders");
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};
