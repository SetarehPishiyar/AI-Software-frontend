import React from "react";
import { Grid, Box, Typography, Button, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import storeImg from "../assets/imgs/stores.png";

const UpFooter = () => {
  const navigate = useNavigate();
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      sx={{ backgroundColor: "#ADBC9F", p: isSmall ? 3 : 6 }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems={isSmall ? "center" : "flex-start"}
        textAlign={isSmall ? "center" : "left"}
        mr={isSmall ? 0 : 8}
        mb={isSmall ? 4 : 0}
      >
        <Typography
          variant={isSmall ? "h5" : "h4"}
          sx={{ mb: 2, color: "#12372A", fontWeight: "bold" }}
        >
          صاحب یک کسب و کار هستید؟
        </Typography>
        <Typography
          variant={isSmall ? "body1" : "h5"}
          sx={{ mb: 3, color: "#394533ff" }}
        >
          با یامزی کسب و کارتان را آنلاین کنید و فروشتان را افزایش دهید.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/restuarant/signup")}
          sx={{
            width: isSmall ? "100%" : 170,
            height: 50,
            borderRadius: "80px !important",
            fontWeight: 500,
            backgroundColor: "#12372A  !important",
            color: "#ADBC9F  !important",
            "&:hover": {
              backgroundColor: "#FBFADA !important",
              color: "#12372A !important",
            },
          }}
        >
          ثبت نام فروشندگان
        </Button>
      </Box>
      <Box>
        <img
          src={storeImg}
          alt="Business illustration"
          style={{ maxWidth: isSmall ? "80%" : 400, height: "auto" }}
        />
      </Box>
    </Grid>
  );
};

export default UpFooter;
