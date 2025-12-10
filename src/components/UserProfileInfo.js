import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

const UserProfileInfo = ({ user }) => {
  const navigate = useNavigate();
  const handleEditClick = () => navigate("/customer/edit-profile");

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
          <Typography sx={{ fontSize: "1.1rem", fontWeight: "bold", mr: 2 }}>
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
  );
};

export default UserProfileInfo;
