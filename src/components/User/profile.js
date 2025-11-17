// Updated UserProfilePage with header containing only Yumzi logo
import React, { useState } from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import YumziImg from "../../assets/imgs/yumzi_icon.png";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleEditClick = () => navigate("/customer/edit-profile");
  const handleSignUpClick = () => navigate("/restuarant/signup");
  const handleFavorites = () => navigate("/customer/favorites");
  const handleOrdersHistory = () => navigate("/customer/orders");

  const handleLogOutClick = () => {
    localStorage.clear();
    navigate("/");
  };

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
        <img src={YumziImg} alt="yumzi" style={{ height: 60 }} />
      </Box>

      {/* PROFILE SECTION BELOW HEADER (desktop style) */}
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
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={handleEditClick}>
                <EditIcon sx={{ fontSize: 30, color: "#0f3924" }} />
              </IconButton>
            </Box>
            <Box
              sx={{
                textAlign: "right",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  sx={{ fontSize: "1.1rem", fontWeight: "bold", mr: 2 }}
                >
                  {user?.user?.first_name + " " + user?.user?.last_name ||
                    "نام و نام خانوادگی"}
                </Typography>
                <Typography sx={{ fontSize: "0.9em", mr: 2 }}>
                  {user?.user?.phone_number || "شماره تلفن"}
                </Typography>
              </Box>

              <AccountCircleIcon sx={{ fontSize: 70, color: "#0f3924" }} />
            </Box>
          </Box>

          {/* MAIN LIST */}
          <List
            sx={{
              bgcolor: "#0f3924",
              borderRadius: 2,
              color: "white",
              p: 1,
            }}
          >
            <ListItem button onClick={handleOrdersHistory}>
              <ListItemIcon>
                <ShoppingBagIcon
                  sx={{
                    color: "white",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary="سفارش‌های من"
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              />
            </ListItem>
            <Divider sx={{ bgcolor: "#355f4a", mt: 1, mb: 1 }} />

            <ListItem button onClick={handleFavorites}>
              <ListItemIcon>
                <FavoriteIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText
                primary="لیست علاقه‌مندی‌ها"
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              />
            </ListItem>
            <Divider sx={{ bgcolor: "#355f4a", mt: 1, mb: 1 }} />

            <ListItem button onClick={handleSignUpClick}>
              <ListItemIcon>
                <AssignmentIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText
                primary="ثبت نام فروشندگان"
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              />
            </ListItem>
            <Divider
              sx={{
                bgcolor: "#355f4a",
                mt: 1,
                mb: 1,
              }}
            />

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
      >
        <DialogTitle>تأیید خروج</DialogTitle>
        <DialogContent>
          <DialogContentText>
            آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟
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

export default UserProfilePage;
