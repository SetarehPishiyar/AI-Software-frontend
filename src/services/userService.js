import axiosInstance from "../utills/axiosInstance";

export const getUserInfo = async () => {
  try {
    const resID = localStorage.getItem("res_id"); 
    const url = resID ? `/restaurant/profiles/me` : "/customer/profile";

    const response = await axiosInstance.get(url);
    // console.log(response.data)
    return response.data;
  } catch (err) {
    console.error("خطا در دریافت اطلاعات کاربر:", err);
    return null;
  }
};


export const logout = () => {
  localStorage.clear()
}
