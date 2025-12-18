import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import { ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getModelRecommendations } from "../services/modelService";
import { getUserInfo } from "../services/userService"; 

const RecommendedItemCard = ({ item, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        minWidth: 230,
        maxWidth: 230,
        height: 300,
        borderRadius: 5,
        backgroundColor: "#FBFADA",
        color: "#12372A",
        p: 2,
        cursor: "pointer",
        boxShadow: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        "&:hover": { transform: "scale(1.02)" },
        transition: "transform 0.15s ease",
      }}
    >
      <Box>
        <Typography sx={{ fontWeight: "bold", mb: 1 }}>{item.name}</Typography>

        <Typography variant="body2" sx={{ opacity: 0.85 }}>
          مدل: {item.state ?? "-"}
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
          امتیاز: {typeof item.score === "number" ? item.score.toFixed(4) : "-"}
        </Typography>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          {item.price ? `${item.price.toLocaleString()} تومان` : "قیمت نامشخص"}
        </Typography>
      </Box>
    </Box>
  );
};

const RecommendedProductSlider = ({ title = "محصولات پیشنهادی برای شما" }) => {
  const navigate = useNavigate();
  const railRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommended = async () => {
      setLoading(true);
      setError("");

      try {
        const accessToken = localStorage.getItem("access");
        const refreshToken = localStorage.getItem("refresh");

        if (!accessToken || !refreshToken) {
          setIsLoggedIn(false);
          setProducts([]);
          return;
        }

        setIsLoggedIn(true);

        const userData = await getUserInfo();
        console.log(userData)
        const realUserId = 
          userData?.user.id??
          null;

        if (!realUserId) {
          setError("شناسه کاربر پیدا نشد.");
          setProducts([]);
          return;
        }

        const n = 10;
        const data = await getModelRecommendations(realUserId, n);

        const mapped = (data || []).slice(0, 10).map((item) => ({
          id: item.item_id,
          name: `Item #${item.item_id}`,
          image: "",
          price: null,
          state: item.item_id_model,
          score: item.score,
        }));

        setProducts(mapped);
      } catch (e) {
        const msg =
          e?.response?.data?.detail ||
          e?.response?.data?.message ||
          e?.message ||
          "خطا در دریافت پیشنهادها";

        setError(msg);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  const scrollRail = (dir = "right") => {
    const el = railRef.current;
    if (!el) return;

    const step = 500;
    el.scrollBy({
      left: dir === "right" ? step : -step,
      behavior: "smooth",
    });
  };

  const CenterMessage = ({ children, color = "#FBFADA" }) => (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        color,
        textAlign: "center",
        px: 2,
      }}
    >
      {children}
    </Box>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <CenterMessage>
          <CircularProgress color="inherit" />
          <Typography variant="body1" sx={{ ml: 2 }}>
            در حال بارگذاری پیشنهادها...
          </Typography>
        </CenterMessage>
      );
    }

    if (!isLoggedIn) {
      return (
        <CenterMessage>
          <Typography variant="body1">
            برای مشاهده محصولات پیشنهادی لطفاً وارد شوید.
          </Typography>
        </CenterMessage>
      );
    }

    if (error) {
      return (
        <CenterMessage color="#ffb3b3">
          <Typography variant="body1">
            خطا در دریافت پیشنهادها: {error}
          </Typography>
        </CenterMessage>
      );
    }

    if (!products.length) {
      return (
        <CenterMessage>
          <Typography variant="body1">محصول پیشنهادی موجود نیست.</Typography>
        </CenterMessage>
      );
    }

    return (
      <>
        <IconButton
          onClick={() => scrollRail("left")}
          sx={{
            backgroundColor: "#FBFADA",
            width: 44,
            height: 44,
            "&:hover": {
              backgroundColor: "#cfe3c5",
              transform: "scale(1.15)",
            },
          }}
        >
          <ArrowForwardIos sx={{ color: "#12372A", rotate: "180deg" }} />
        </IconButton>

        <Box
          ref={railRef}
          sx={{
            flex: 1,
            display: "flex",
            gap: 2,
            overflowX: "hidden",
            scrollBehavior: "smooth",
            py: 2,
            px: 1,
            "&::-webkit-scrollbar": { height: 8 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(251,250,218,0.35)",
              borderRadius: 10,
            },
          }}
        >
          {products.map((p) => (
            <RecommendedItemCard
              key={p.id}
              item={p}
              onClick={() => navigate(`/customer/restaurants/resid/${p.id}`)}
            />
          ))}
        </Box>

        <IconButton
          onClick={() => scrollRail("right")}
          sx={{
            backgroundColor: "#FBFADA",
            width: 44,
            height: 44,
            "&:hover": {
              backgroundColor: "#cfe3c5",
              transform: "scale(1.15)",
            },
          }}
        >
          <ArrowForwardIos sx={{ color: "#12372A" }} />
        </IconButton>
      </>
    );
  };

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      <Typography
        variant="h3"
        sx={{
          pt: 5,
          textAlign: "center",
          color: "#FBFADA",
          fontWeight: "bold",
          backgroundColor: "#12372A",
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "#12372A",
          p: 3,
          height: "70vh",
          alignItems: "center",
          gap: 2,
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default RecommendedProductSlider;
