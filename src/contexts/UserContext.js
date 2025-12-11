// usercontext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utills/axiosInstance"; 

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async () => {
    const accessToken = localStorage.getItem("access");

    if (!accessToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const resID = localStorage.getItem("res_id");
      if (!resID || resID === "undefined") {
        const response = await axiosInstance.get("/customer/profile", {
          withCredentials: true, 
        });
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
      } else {
        const response = await axiosInstance.get(
          `/restaurant/${resID}/profile`,
          {
            withCredentials: true,
          }
        );
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
      }
    } catch (error) {
      console.error("خطا در دریافت پروفایل:", error);
      if (error.response?.status === 401) {
        console.warn("توکن منقضی شده یا کاربر وارد نشده است.");
        localStorage.clear();
        setUser(null);
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  return (
    <UserContext.Provider value={{ user, fetchUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserProvider;
