import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Grid,
  Avatar,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import DescriptionIcon from "@mui/icons-material/Description";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utills/axiosInstance";
import YumziImg from "../../assets/imgs/yumzi_icon.png";

const RestaurantProfile = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await axiosInstance.get(`/restaurant/profiles/me`);
      const data = response.data;

      if (data) {
        setName(data.name || "");
        const phone = localStorage.getItem("phone");
        setPhoneNumber(phone || "");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleProfileEditClick = () =>
    navigate(`/restaurant/${id}/profileEdit`);
  const handleMenuClick = () => navigate(`/restaurant/${id}/menu`);
  const handleReportClick = () => navigate(`/restaurant/${id}/report`);
  const handleOrdersClick = () => navigate(`/restaurant/${id}/orders`);

  const handleLogOutClick = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#b9c3a7" }}>
      {/* HEADER */}
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
        <img src={YumziImg} alt="yumzi" style={{ height: 60 }} />
      </Box>

      {/* PROFILE SECTION */}
      <Grid container justifyContent="center" mt={4}>
        <Grid item xs={11} md={9} lg={10}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: "#e8e9d6",
              borderRadius: 2,
              p: 2,
              mb: 3,
              flexDirection: { xs: "column-reverse", sm: "row" },
            }}
          >
            {/* Edit Button */}
            <IconButton onClick={handleProfileEditClick}>
              <EditIcon sx={{ fontSize: 30, color: "#0f3924" }} />
            </IconButton>

            {/* Name + Phone + Avatar */}
            <Box
              sx={{
                textAlign: "right",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box>
                <Typography sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                  {name || "نام فروشگاه"}
                </Typography>

                <Typography sx={{ fontSize: "0.9em" }}>
                  {phoneNumber || "شماره تماس"}
                </Typography>
              </Box>

              <AccountCircleIcon sx={{ fontSize: 70, color: "#0f3924" }} />
            </Box>
          </Box>

          {/* MAIN LIST (Styled like UserProfilePage) */}
          <List
            sx={{
              bgcolor: "#0f3924",
              borderRadius: 2,
              color: "white",
              p: 1,
            }}
          >
            <ListItem button onClick={handleMenuClick}>
              <ListItemIcon>
                <RestaurantMenuIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText
                primary="منوی فروشگاه"
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              />
            </ListItem>
            <Divider sx={{ bgcolor: "#355f4a", my: 1 }} />

            <ListItem button onClick={handleOrdersClick}>
              <ListItemIcon>
                <ShoppingBagIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText
                primary="سفارش‌های فروشگاه"
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              />
            </ListItem>
            <Divider sx={{ bgcolor: "#355f4a", my: 1 }} />

            <ListItem button onClick={handleReportClick}>
              <ListItemIcon>
                <DescriptionIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText
                primary="گزارش مالی فروشگاه"
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              />
            </ListItem>
            <Divider sx={{ bgcolor: "#355f4a", my: 1 }} />

            <ListItem button onClick={() => setOpenLogoutDialog(true)}>
              <ListItemIcon>
                <LogoutIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText
                primary="خروج از حساب کاربری"
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              />
            </ListItem>
          </List>
        </Grid>
      </Grid>

      {/* LOGOUT DIALOG */}
      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
        sx={{ "& .MuiDialog-paper": { borderRadius: 3 } }}
      >
        <DialogTitle>تأیید خروج</DialogTitle>
        <DialogContent>
          <DialogContentText>
            آیا مطمئن هستید که می‌خواهید از حساب خود خارج شوید؟
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)}>خیر</Button>
          <Button
            onClick={handleLogOutClick}
            variant="contained"
            color="warning"
          >
            بله
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RestaurantProfile;
