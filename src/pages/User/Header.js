import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import YumziImg from "../../assets/imgs/yumzi_icon.png";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import axiosInstance from "../../utills/publicAxiosInstance";
import { getUserInfo } from "../../services/userService";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "16px !important",
  backgroundColor: "#ADBC9F",
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  height: "40px",
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "400px",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  position: "absolute",
  left: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#12372A",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#000",
  "& .MuiInputBase-input": {
    padding: theme.spacing(0.8, 1, 0.8, 4),
    fontSize: "14px",
    width: "100%",
  },
}));

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [restaurantList, setRestaurantList] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const [userCity, setUserCity] = useState(""); 

  const navigate = useNavigate();

  const checkAuthentication = () => {
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");
    setIsLoggedIn(!!(accessToken && refreshToken));
  };

  useEffect(() => {
    checkAuthentication();
    const handleStorageChange = () => checkAuthentication();

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const fetchUserCity = async () => {
      try {
        if (!isLoggedIn) {
          setUserCity("");
          return;
        }

        const userData = await getUserInfo();
        if (userData?.province) {
          setUserCity(userData.province.trim());
        } else {
          setUserCity("");
        }
      } catch (err) {
        console.error("خطا در دریافت اطلاعات کاربر:", err);
        setUserCity("");
      }
    };

    fetchUserCity();
  }, [isLoggedIn]);

  const handleLoginClick = () => navigate("/login");
  const handleProfileClick = () => navigate(`/customer/profile`);

  const fetchRestaurantList = async (query) => {
    if (query.trim() === "") {
      setRestaurantList([]);
      return;
    }

    if (isLoggedIn && !userCity) {
      setRestaurantList([]);
      return;
    }

    try {
      const params = {
        query,
        ...(isLoggedIn && userCity ? { city_name: userCity } : {}),
      };

      const response = await axiosInstance.get("/restaurant/profiles", {
        params,
      });

      setRestaurantList(response.data || []);
    } catch (error) {
      console.error("Error fetching restaurant list:", error);
      setRestaurantList([]);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimeout) clearTimeout(debounceTimeout);

    const timeout = setTimeout(() => {
      fetchRestaurantList(value);
    }, 500);

    setDebounceTimeout(timeout);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const cityParam =
        isLoggedIn && userCity
          ? `&city_name=${encodeURIComponent(userCity)}`
          : "";
      navigate(`/search?query=${encodeURIComponent(searchTerm)}${cityParam}`);
    }
  };

  const handleRestaurantClick = (id) => {
    navigate(`/customer/restaurants/${id}`);
    setSearchTerm("");
    setRestaurantList([]);
  };

  return (
    <AppBar
      elevation={1}
      sx={{
        backgroundColor: "#12372A",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <img
          src={YumziImg}
          alt="Login Illustration"
          style={{ width: "140px", marginLeft: "15px" }}
        />

        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>

          <StyledInputBase
            placeholder="جستجو در یامزی"
            inputProps={{ "aria-label": "search" }}
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
          />

          {restaurantList.length > 0 && (
            <div
              role="button"
              tabIndex="0"
              aria-label="Interactive panel"
              style={{
                position: "absolute",
                top: "50px",
                left: "0",
                right: "0",
                backgroundColor: "#FBFADA",
                borderRadius: "8px",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                zIndex: "100",
                maxHeight: "500px",
                overflowY: "auto",
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") e.stopPropagation();
              }}
            >
              <ul style={{ listStyle: "none", margin: 0, padding: "10px" }}>
                {restaurantList.map((restaurant) => (
                  <li key={restaurant.id} style={{ listStyle: "none" }}>
                    <button
                      style={{
                        fontFamily: "vazir",
                        padding: "10px",
                        cursor: "pointer",
                        border: "none",
                        background: "none",
                        borderBottom: "1px solid #f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                      onClick={() => handleRestaurantClick(restaurant.id)}
                    >
                      {restaurant.photo && (
                        <img
                          src={`http://127.0.0.1:8000${restaurant.photo}`}
                          alt={restaurant.name}
                          style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "4px",
                            marginRight: "10px",
                          }}
                        />
                      )}

                      <div>
                        <div
                          style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            marginRight: "10px",
                            color: "#555",
                          }}
                        >
                          {restaurant.name}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#555",
                            marginRight: "10px",
                            textAlign: "right",
                          }}
                        >
                          {restaurant.city_name}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Search>

        {!isLoggedIn ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleLoginClick}
            sx={{
              marginTop: "10px !important",
              width: "130px",
              height: "45px",
              borderRadius: "50px !important",
              fontWeight: "400 !important",
            }}
          >
            ورود یا عضویت
          </Button>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ShoppingCartIcon
              sx={{
                color: "#FBFADA",
                cursor: "pointer",
                "&:hover": { color: "#000" },
              }}
              onClick={() => navigate("/customer/cart-list")}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleProfileClick}
              sx={{
                marginTop: "10px !important",
                width: "130px",
                height: "45px",
                borderRadius: "50px !important",
                fontWeight: "400 !important",
              }}
            >
              پروفایل
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
