import React from "react";
import { Box, Typography, Link, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";
import YumziImg from "../../assets/imgs/yumzi_icon.png";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#12372A",
        padding: "20px",
        marginTop: "auto",
        width: "100vw",
      }}
    >
      <Grid container spacing={2} paddingTop={2} paddingBottom={3}>
        <Grid
          sx={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <img src={YumziImg} alt="Yumzi Icon" style={{ width: "155px" }} />
          <Box>
            <IconButton
              href="#"
              aria-label="Facebook"
              sx={{ color: "#FBFADA" }}
            >
              <Facebook />
            </IconButton>
            <IconButton
              href="#"
              aria-label="Twitter"
              sx={{
                color: "#FBFADA",
                paddingLeft: "30px",
                paddingRight: "30px",
              }}
            >
              <Twitter />
            </IconButton>
            <IconButton
              href="#"
              aria-label="Instagram"
              sx={{ color: "#FBFADA" }}
            >
              <Instagram />
            </IconButton>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          marginLeft={1.8}
          sx={{
            marginRight: { xs: 0, sm: "auto" },
          }}
        >
          <Typography
            variant="h6"
            sx={{ pointerEvents: "none", color: "#FBFADA", fontWeight: "bold" }}
          >
            فودی
          </Typography>
          <Typography
            variant="h7"
            sx={{ pointerEvents: "none", paddingTop: "11px", color: "#FBFADA" }}
          >
            تجربه بهترین سفارش آنلاین غذا
          </Typography>
        </Grid>
        <Grid
          container
          direction="row"
          // justifyContent="space-between"
          // alignItems="center"
        >
          <Grid item xs={12} sm={6} paddingRight={7}>
            <Link
              href="#"
              sx={{
                display: "block",
                textDecoration: "none",
                color: "#FBFADA",
                "&:hover": {
                  textDecoration: "none",
                  color: "#FBFADA",
                },
              }}
            >
              ارتباط با ما
            </Link>
            <Link
              href="#"
              sx={{
                display: "block",
                textDecoration: "none",
                color: "#FBFADA",
                "&:hover": {
                  textDecoration: "none",
                  color: "#FBFADA",
                },
              }}
            >
              درباره ما
            </Link>
            <Link
              href="#"
              sx={{
                display: "block",
                textDecoration: "none",
                color: "#FBFADA",
                "&:hover": {
                  textDecoration: "none",
                  color: "#FBFADA",
                },
              }}
            >
              فرصت های شغلی
            </Link>
            <Link
              href="#"
              sx={{
                display: "block",
                textDecoration: "none",
                color: "#FBFADA",
                "&:hover": {
                  textDecoration: "none",
                  color: "#FBFADA",
                },
              }}
            >
              قوانین سایت
            </Link>
          </Grid>
          <Grid px={7}>
            <Link
              href="#"
              sx={{
                display: "block",
                textDecoration: "none",
                color: "#FBFADA",
                "&:hover": {
                  textDecoration: "none",
                  color: "#FBFADA",
                },
              }}
            >
              ثبت نام فروشندگان
            </Link>
            <Link
              href="#"
              sx={{
                display: "block",
                textDecoration: "none",
                color: "#FBFADA",
                "&:hover": {
                  textDecoration: "none",
                  color: "#FBFADA",
                },
              }}
            >
              پرسش های متدوال
            </Link>
            <Link
              href="#"
              sx={{
                display: "block",
                textDecoration: "none",
                color: "#FBFADA",
                "&:hover": {
                  textDecoration: "none",
                  color: "#FBFADA",
                },
              }}
            >
              ثبت شکایت
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
