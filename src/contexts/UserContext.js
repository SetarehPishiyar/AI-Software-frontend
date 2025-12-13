import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { getUserInfo, logout as logoutService } from "../services/userService";

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
      const data = await getUserInfo(resID);
      setUser(data);
    } catch (error) {
      console.error("خطا در دریافت پروفایل:", error);
      setUser(null);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = () => {
    logoutService();
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
