import React from "react";
import { Box, Grid, Typography } from "@mui/material";

const HeroSection = ({ title, subtitle, image }) => (
  <Box
    sx={{
      width: "100%",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#12372A",
      overflowX: "hidden",
    }}
  >
    <Grid
      container
      spacing={15}
      alignItems="center"
      justifyContent="center"
      direction={{ xs: "column", sm: "row" }}
      sx={{ width: "100%", maxWidth: "1200px", pt: 5 }}
    >
      <Grid item xs={12} sm={6}>
        <Typography
          variant="h4"
          sx={{
            color: "#ADBC9F",
            fontWeight: "bold",
            textAlign: { xs: "center", sm: "left" },
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: "#FBFADA",
            fontWeight: "bold",
            mt: 2,
            pl: 5,
            textAlign: { xs: "center", sm: "left" },
            fontSize: { xs: "1.5rem", md: "2.1rem" },
          }}
        >
          {subtitle}
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <img
          src={image}
          alt="Hero"
          onError={(e) => (e.target.src = "https://via.placeholder.com/100")}
          style={{ width: "100%", maxWidth: "500px", height: "auto" }}
        />
      </Grid>
    </Grid>
  </Box>
);

export default HeroSection;
