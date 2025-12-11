import axiosInstance from "../utills/axiosInstance";

export const getUserInfo = async () => {
  try {
    const response = await axiosInstance.get("/customer/profile");
    return response.data;
  } catch (err) {
    console.error("خطا در دریافت اطلاعات کاربر:", err);
    return null;
  }
};

export const logout = () => {
  localStorage.clear()
}
