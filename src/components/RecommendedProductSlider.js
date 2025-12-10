// src/components/RecommendedProductSlider.js
import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import ProductSlider from "./ProductSlider"; // فرض می‌کنیم ProductSlider رو دوباره استفاده می‌کنیم
import axiosInstance from "../utills/axiosInstance";

const RecommendedProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await axiosInstance.get("/customer/recommended-products");
        setProducts(res.data);
      } catch (err) {
        console.error("خطا در دریافت محصولات پیشنهادی:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        محصولات پیشنهادی برای شما
      </Typography>
      <ProductSlider products={products} />
    </Box>
  );
};

export default RecommendedProductSlider;
