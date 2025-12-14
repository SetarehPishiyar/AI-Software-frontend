import axiosInstance from "../utills/axiosInstance";

export const getUserInfo = async () => {
  try {
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");
    if (!accessToken || !refreshToken) {
      // کاربر لاگین نیست → هیچ request زده نشود
      return null;
    }

    const resID = localStorage.getItem("res_id");
    const url = resID ? `/restaurant/profiles/me` : "/customer/profile";

    const response = await axiosInstance.get(url);
    return response.data;
  } catch (err) {
    console.error("خطا در دریافت اطلاعات کاربر:", err);
    return null;
  }
};



export const logout = () => {
  localStorage.clear()
}
