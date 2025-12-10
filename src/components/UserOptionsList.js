import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout";

const UserOptionsList = ({
  onOrders,
  onFavorites,
  onSignUp,
  onLogoutClick,
}) => (
  <List sx={{ bgcolor: "#0f3924", borderRadius: 2, color: "white", p: 1 }}>
    <ListItem button onClick={onOrders}>
      <ListItemIcon>
        <ShoppingBagIcon sx={{ color: "white" }} />
      </ListItemIcon>
      <ListItemText
        primary="سفارش‌های من"
        sx={{ "&:hover": { cursor: "pointer" } }}
      />
    </ListItem>
    <Divider sx={{ bgcolor: "#355f4a", mt: 1, mb: 1 }} />

    <ListItem button onClick={onFavorites}>
      <ListItemIcon>
        <FavoriteIcon sx={{ color: "white" }} />
      </ListItemIcon>
      <ListItemText
        primary="لیست علاقه‌مندی‌ها"
        sx={{ "&:hover": { cursor: "pointer" } }}
      />
    </ListItem>
    <Divider sx={{ bgcolor: "#355f4a", mt: 1, mb: 1 }} />

    <ListItem button onClick={onSignUp}>
      <ListItemIcon>
        <AssignmentIcon sx={{ color: "white" }} />
      </ListItemIcon>
      <ListItemText
        primary="ثبت نام فروشندگان"
        sx={{ "&:hover": { cursor: "pointer" } }}
      />
    </ListItem>
    <Divider sx={{ bgcolor: "#355f4a", mt: 1, mb: 1 }} />

    <ListItem button onClick={onLogoutClick}>
      <ListItemIcon>
        <LogoutIcon sx={{ color: "white" }} />
      </ListItemIcon>
      <ListItemText
        primary="خروج از حساب کاربری"
        sx={{ "&:hover": { cursor: "pointer" } }}
      />
    </ListItem>
  </List>
);

export default UserOptionsList;
