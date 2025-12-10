import React from "react";
import { Box } from "@mui/material";

const SectionWrapper = ({ children, height = "80vh", bgColor = "#ADBC9F" }) => (
  <Box
    sx={{
      width: "100%",
      minHeight: height,
      overflowX: "hidden",
      backgroundColor: bgColor,
      overflowY: "auto",
      "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari
      scrollbarWidth: "none", // Firefox
      "-ms-overflow-style": "none", // IE 10+
    }}
  >
    {children}
  </Box>
);

export default SectionWrapper;
