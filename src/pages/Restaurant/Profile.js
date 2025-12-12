import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import YumziImg from "../../assets/imgs/yumzi_icon.png";
import axiosInstance from "../../utills/axiosInstance";

import RestaurantProfileInfo from "../../components/RestaurantProfileInfo";
import RestaurantOptionsList from "../../components/RestaurantOptionsList";
import LogoutDialog from "../../components/LogoutDialog";

const RestaurantProfilePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [info, setInfo] = useState({ name: "", phone: "" });
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  useEffect(() => {
    fetchRestaurantInfo();
  }, []);

  const fetchRestaurantInfo = async () => {
    try {
      const res = await axiosInstance.get("/restaurant/profiles/me");
      const phone = localStorage.getItem("phone");
      setInfo({
        name: res.data.name || "نام فروشگاه",
        phone: phone || "شماره تماس",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#b9c3a7" }}>
      {/* Header */}
      <Box
        sx={{
          width: "100%",
          height: 100,
          bgcolor: "#0f3924",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={YumziImg}
          alt="yumzi"
          style={{ height: 60 }}
        />
      </Box>

      <Grid container justifyContent="center" mt={4}>
        <Grid item xs={11} md={9} lg={10}>
          {/* Restaurant Info */}
          <RestaurantProfileInfo
            name={info.name}
            phone={info.phone}
            onEdit={() => navigate(`/restaurant/${id}/profileEdit`)}
          />

          {/* Options List */}
          <RestaurantOptionsList
            onMenu={() => navigate(`/restaurant/${id}/menu`)}
            onOrders={() => navigate(`/restaurant/${id}/orders`)}
            onReport={() => navigate(`/restaurant/${id}/report`)}
            onLogout={() => setOpenLogoutDialog(true)}
          />
        </Grid>
      </Grid>

      {/* Logout Dialog */}
      <LogoutDialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
        onConfirm={handleLogout}
      />
    </Box>
  );
};

export default RestaurantProfilePage;
