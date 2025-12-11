import React, { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import YumziImg from "../../assets/imgs/yumzi_icon.png";
import UserProfileInfo from "../../components/UserProfileInfo";
import UserOptionsList from "../../components/UserOptionsList";
import LogoutDialog from "../../components/LogoutDialog";
import { getUserInfo, logout } from "../../services/userService";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const data = await getUserInfo();
      setUser(data);
      setLoading(false);
    };
    fetchUser();
  }, []);

  // HANDLERS
  const handleEditClick = () => navigate("/customer/edit-profile");
  const handleSignUpClick = () => navigate("/restuarant/signup");
  const handleFavorites = () => navigate("/customer/favorites");
  const handleOrdersHistory = () => navigate("/customer/orders");
  const handleLogOutClick = () => {
    logout();
    navigate("/");
  };

  if (loading)
    return <Box sx={{ textAlign: "center", mt: 5 }}>در حال بارگذاری...</Box>;

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#b9c3a7" }}>
      {/* HEADER (Logo Only) */}
      <Box
        sx={{
          width: "100%",
          height: 100,
          bgcolor: "#0f3924",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        <img
          src={YumziImg}
          alt="yumzi"
          style={{ height: 60, cursor: "pointer" }}
          onClick={() => navigate("/")}
        />
      </Box>

      {/* PROFILE SECTION */}
      <Grid container justifyContent="center" mt={4}>
        <Grid item xs={11} md={9} lg={10}>
          {/* User Info */}
          <UserProfileInfo user={user} onEditClick={handleEditClick} />

          {/* Options List */}
          <UserOptionsList
            onOrders={handleOrdersHistory}
            onFavorites={handleFavorites}
            onSignUp={handleSignUpClick}
            onLogoutClick={() => setOpenLogoutDialog(true)}
          />
        </Grid>
      </Grid>

      {/* Logout Dialog */}
      <LogoutDialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
        onConfirm={handleLogOutClick}
      />
    </Box>
  );
};

export default UserProfilePage;
