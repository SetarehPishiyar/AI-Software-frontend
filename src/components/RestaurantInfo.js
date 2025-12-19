import React from "react";
import { Box, Typography, Chip, Button, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { PLACEHOLDER_IMG } from "../utills/constants";

const RestaurantInfo = ({
  restaurant,
  favorites,
  toggleFavorite,
  onViewCart,
}) => {
  const parsedDeliveryCost = Number(restaurant.delivery_price);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "fit-content",
          mx: "auto",
          height: "auto",
        }}
      >
        <img
          src={restaurant.photo || PLACEHOLDER_IMG}
          alt={restaurant.name}
          style={{ height: "220px", display: "block", borderRadius: 18 }}
        />
        <IconButton
          sx={{
            position: "absolute",
            bottom: 8,
            left: 8,
            color: favorites[restaurant.id] ? "red" : "white",
          }}
          onClick={() => toggleFavorite(restaurant.id)}
        >
          {favorites[restaurant.id] ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        gap={2}
        alignItems="center"
        py={2}
      >
        <Chip label={restaurant.score} />
        <Chip label={restaurant.city_name} />
        <Chip
          label={
            parsedDeliveryCost === 0
              ? "رایگان"
              : `${parsedDeliveryCost.toLocaleString()} هزار تومان`
          }
        />
      </Box>

      <Typography variant="h6" sx={{ pointerEvents: "none", py: 1 }}>
        {restaurant.name}
      </Typography>
      <Typography
        variant="body2"
        sx={{ my: 1, pointerEvents: "none", width: { lg: "500px" } }}
      >
        ساعت کاری: {restaurant.open_hour.slice(0, 5)} تا{" "}
        {restaurant.close_hour.slice(0, 5)}
      </Typography>
      <Typography
        variant="body2"
        color="grey"
        sx={{ my: 1, pointerEvents: "none", width: { lg: "500px" } }}
      >
        آدرس: {restaurant.address}
      </Typography>
      <Typography
        variant="body2"
        sx={{ my: 1, pointerEvents: "none", width: { lg: "500px" } }}
      >
        {restaurant.description}
      </Typography>

      <Button
        variant="contained"
        fullWidth
        onClick={onViewCart}
        sx={{
          backgroundColor: "#FBFADA !important",
          color: "#000",
          "&:hover": { backgroundColor: "#e4eac7 !important" },
        }}
      >
        مشاهده سبد خرید
      </Button>
    </Box>
  );
};

export default RestaurantInfo;
