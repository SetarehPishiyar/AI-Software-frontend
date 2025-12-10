import axiosInstance from "../utills/axiosInstance";

export const getUserInfo = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const logout = () => {
  localStorage.clear();
};
