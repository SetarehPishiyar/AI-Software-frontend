import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const RestaurantProfileInfo = ({ name, phone, onEdit }) => {
  return (
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
      <IconButton onClick={onEdit}>
        <EditIcon sx={{ fontSize: 30, color: "#0f3924" }} />
      </IconButton>

      {/* Name + Phone */}
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
            {name}
          </Typography>

          <Typography sx={{ fontSize: "0.9rem" }}>{phone}</Typography>
        </Box>

        <AccountCircleIcon sx={{ fontSize: 70, color: "#0f3924" }} />
      </Box>
    </Box>
  );
};

export default RestaurantProfileInfo;
