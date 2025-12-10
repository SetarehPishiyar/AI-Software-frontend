import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Components
import HeroSection from "../../components/HeroSection";
import CategoryCardList from "../../components/CategoryCardList";
import ProductSlider from "../../components/ProductSlider";
import RecommendedProductSlider from "../../components/RecommendedProductSlider";
import UpFooter from "../../components/UpFooter";
import Footer from "../../components/Footer";

// Context
import { useUser } from "../../contexts/UserContext";

//Images
import homepageBurger from "../../assets/imgs/homepage burger.png";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    // اگر کاربر رستوران لاگین کرده بود، مستقیم به پروفایلش بره
    const resID = localStorage.getItem("res_id");
    if (resID && resID !== "undefined") {
      navigate(`/restaurant/${resID}/profile`);
    }
  }, [navigate]);

  return (
    <Box
      sx={{
        overflowX: "hidden",
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
        "-ms-overflow-style": "none",
      }}
    >
      <Box component="section" sx={{ width: "100%", minHeight: "100vh" }}>
        <HeroSection
          title="بهترین طعم‌ها، در کمترین زمان."
          subtitle="غذای دلخواهت را سفارش بده."
          image={homepageBurger}
        />
      </Box>

      <Box component="section" sx={{ width: "100%" }}>
        <CategoryCardList />
      </Box>

      <Box component="section" sx={{ width: "100%" }}>
        <ProductSlider title="محبوب ترین‌ها" />
      </Box>

      <Box component="section" sx={{ width: "100%" }}>
        <ProductSlider title="پیشنهاد شده به شما" />
      </Box>

      <Box component="section" sx={{ width: "100%" }}>
        <UpFooter />
      </Box>

      <Footer />
    </Box>
  );
};

export default HomePage;
