import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import DescriptionIcon from "@mui/icons-material/Description";
import LogoutIcon from "@mui/icons-material/Logout";

const RestaurantOptionsList = ({ onMenu, onOrders, onReport, onLogout }) => {
  return (
    <List
      sx={{
        bgcolor: "#0f3924",
        borderRadius: 2,
        color: "white",
        p: 1,
      }}
    >
      {/* Menu */}
      <ListItem button onClick={onMenu}>
        <ListItemIcon>
          <RestaurantMenuIcon sx={{ color: "white" }} />
        </ListItemIcon>
        <ListItemText
          primary="منوی فروشگاه"
          sx={{ "&:hover": { cursor: "pointer" } }}
        />
      </ListItem>

      <Divider sx={{ bgcolor: "#355f4a", my: 1 }} />

      {/* Orders */}
      <ListItem button onClick={onOrders}>
        <ListItemIcon>
          <ShoppingBagIcon sx={{ color: "white" }} />
        </ListItemIcon>
        <ListItemText
          primary="سفارش‌های فروشگاه"
          sx={{ "&:hover": { cursor: "pointer" } }}
        />
      </ListItem>

      <Divider sx={{ bgcolor: "#355f4a", my: 1 }} />

      {/* Report */}
      <ListItem button onClick={onReport}>
        <ListItemIcon>
          <DescriptionIcon sx={{ color: "white" }} />
        </ListItemIcon>
        <ListItemText
          primary="گزارش مالی فروشگاه"
          sx={{ "&:hover": { cursor: "pointer" } }}
        />
      </ListItem>

      <Divider sx={{ bgcolor: "#355f4a", my: 1 }} />

      {/* Logout */}
      <ListItem button onClick={onLogout}>
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
};

export default RestaurantOptionsList;
