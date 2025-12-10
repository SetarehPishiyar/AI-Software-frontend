import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import YumziImg from "../assets/imgs/yumzi_icon.png";
import { useAuthContext } from "../contexts/AuthContext";
import useRestaurants from "../hooks/useRestaurants";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "16px",
  backgroundColor: "#ADBC9F",
  width: "100%",
  maxWidth: 400,
  height: 40,
  display: "flex",
  alignItems: "center",
}));

const SearchIconWrapper = styled("div")({
  position: "absolute",
  left: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#12372A",
});

const StyledInputBase = styled(InputBase)({
  color: "#000",
  width: "100%",
  paddingLeft: 36,
  fontSize: 14,
});

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthContext();
  const restaurants = useRestaurants(); // شامل رستوران‌ها و آیتم‌ها در hook

  const [searchTerm, setSearchTerm] = useState("");

  const handleLoginClick = () => navigate("/login");
  const handleProfileClick = () => navigate("/customer/profile");
  const handleCartClick = () => navigate("/customer/cart-list");

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      navigate(`/search?query=${searchTerm}`);
    }
  };

  // فیلتر ساده برای جستجو
  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppBar elevation={1} sx={{ backgroundColor: "#12372A" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <img
          src={YumziImg}
          alt="Yumzi Logo"
          style={{ width: 140, marginLeft: 15, cursor: "pointer" }}
          onClick={() => navigate("/")}
        />

        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="جستجو در یامزی"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          {searchTerm && filteredRestaurants.length > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: 50,
                left: 0,
                right: 0,
                backgroundColor: "#FBFADA",
                borderRadius: 1,
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                zIndex: 100,
                maxHeight: 500,
                overflowY: "auto",
              }}
            >
              <ul style={{ listStyle: "none", margin: 0, padding: 10 }}>
                {filteredRestaurants.map((r) => (
                  <li key={r.id}>
                    <button
                      style={{
                        width: "100%",
                        padding: 10,
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                      onClick={() => navigate(`/customer/restaurants/${r.id}`)}
                    >
                      {r.photo && (
                        <img
                          src={`http://127.0.0.1:8000${r.photo}`}
                          alt={r.name}
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: 4,
                            marginRight: 10,
                          }}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: "bold", color: "#555" }}>
                          {r.name}
                        </div>
                        <div style={{ fontSize: 12, color: "#555" }}>
                          {r.city_name}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </Box>
          )}
        </Search>

        {!isLoggedIn ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleLoginClick}
            sx={{ width: 130, height: 45, borderRadius: 50 }}
          >
            ورود یا عضویت
          </Button>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ShoppingCartIcon
              sx={{ color: "#FBFADA", cursor: "pointer" }}
              onClick={handleCartClick}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleProfileClick}
              sx={{ width: 130, height: 45, borderRadius: 50 }}
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
