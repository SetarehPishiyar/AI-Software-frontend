import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Chip,
} from "@mui/material";
import { ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { getModelRecommendations } from "../services/modelService";
import { getUserInfo } from "../services/userService";

import publicAxiosInstance from "../utills/publicAxiosInstance";
import { PLACEHOLDER_IMG } from "../utills/constants";

const mapSpiceFa = (spice) => {
  if (!spice) return null;
  const s = String(spice).trim().toLowerCase();

  if (["hot"].includes(s)) return "زیاد";
  if (["mild"].includes(s)) return "متوسط";
  if (["no"].includes(s)) return "کم";

  return spice;
};

const mapAvailabilityFa = (state) => {
  if (!state) return "-";
  const s = String(state).trim().toLowerCase();

  if (["available"].includes(s)) return "موجود";
  if (["unavailable"].includes(s)) return "ناموجود";

  return state;
};

const RecommendedItemCard = ({ item, onClick }) => {
  const finalPrice =
    item?.price && item?.discount
      ? (Number(item.price) * (100 - Number(item.discount))) / 100
      : item?.price
      ? Number(item.price)
      : null;

  const spiceFa = mapSpiceFa(item?.spice);
  const availabilityFa = mapAvailabilityFa(item?.state);

  return (
    <Box
      onClick={onClick}
      sx={{
        minWidth: 230,
        maxWidth: 230,
        height: 340,
        borderRadius: 5,
        backgroundColor: "#FBFADA",
        color: "#12372A",
        p: 2,
        cursor: "pointer",
        boxShadow: 2,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        "&:hover": { transform: "scale(1.02)" },
        transition: "transform 0.15s ease",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: 165,
          borderRadius: 3,
          overflow: "hidden",
          mb: 1.2,
          backgroundColor: "rgba(0,0,0,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={item.photo || PLACEHOLDER_IMG}
          alt={item.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          loading="lazy"
        />
      </Box>

      <Typography sx={{ fontWeight: "bold", mb: 1 }} noWrap>
        {item.name ?? "-"}
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mb: 1 }}>
        <Chip
          size="small"
          label={`وضعیت: ${availabilityFa}`}
          sx={{ backgroundColor: "rgba(18,55,42,0.08)", color: "#12372A" }}
        />

        {item.discount ? (
          <Chip
            size="small"
            label={`تخفیف: ${item.discount}%`}
            sx={{ backgroundColor: "rgba(255,0,0,0.08)", color: "#8b0000" }}
          />
        ) : null}
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mb: 1, flex: 1 }}>
        {spiceFa && (
          <Chip
            size="small"
            label={`تندی: ${spiceFa}`}
            sx={{ backgroundColor: "rgba(18,55,42,0.08)", color: "#12372A" }}
          />
        )}

        {typeof item.score === "number" && (
          <Chip
            size="small"
            label={`امتیاز: ${item.score.toFixed(2)}`}
            sx={{ backgroundColor: "rgba(18,55,42,0.08)", color: "#12372A" }}
          />
        )}
      </Box>

      <Box>
        {finalPrice != null ? (
          <>
            {item.discount ? (
              <Typography
                variant="caption"
                sx={{ textDecoration: "line-through", opacity: 0.7 }}
              >
                {Number(item.price).toLocaleString()} هزار تومان
              </Typography>
            ) : null}
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {finalPrice.toLocaleString()} هزار تومان
            </Typography>
          </>
        ) : (
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            قیمت نامشخص
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const fetchSingleItem = async (restaurantId, itemId) => {
  const res = await publicAxiosInstance.get(
    `/customer/restaurants/${restaurantId}/items/${itemId}`
  );
  const data = res.data;
  if (!data?.photo) data.photo = PLACEHOLDER_IMG;
  return data;
};

const RecommendedProductSlider = ({ title = "محصولات پیشنهادی برای شما" }) => {
  const navigate = useNavigate();
  const railRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchRecommended = async () => {
      setLoading(true);
      setError("");

      try {
        const accessToken = localStorage.getItem("access");
        const refreshToken = localStorage.getItem("refresh");

        if (!accessToken || !refreshToken) {
          if (!isMounted) return;
          setIsLoggedIn(false);
          setProducts([]);
          return;
        }

        if (!isMounted) return;
        setIsLoggedIn(true);

        const userData = await getUserInfo();
        const realUserId = userData?.user?.id ?? null;

        if (!realUserId) {
          if (!isMounted) return;
          setError("شناسه کاربر پیدا نشد.");
          setProducts([]);
          return;
        }

        const n = 10;
        const recs = await getModelRecommendations(realUserId, n);

        const recArray = Array.isArray(recs) ? recs : recs?.results || [];
        const top = recArray.slice(0, n);

        const detailed = await Promise.all(
          top.map(async (rec) => {
            try {
              const restaurantId =
                rec.restaurant_id ?? rec.restaurant ?? rec.res_id;
              const itemId = rec.item_id ?? rec.item ?? rec.itemId;

              const item = await fetchSingleItem(restaurantId, itemId);

              return {
                ...item,
                restaurantId: item.restaurant ?? restaurantId,
                id: item.item_id ?? itemId,
              };
            } catch (e) {
              const restaurantId = rec.restaurant_id ?? rec.restaurant ?? null;
              const itemId = rec.item_id ?? rec.item ?? null;

              return {
                id: itemId,
                item_id: itemId,
                restaurantId,
                restaurant: restaurantId,
                name: `Item #${itemId}`,
                photo: PLACEHOLDER_IMG,
                price: null,
                discount: null,
                state: rec.state ?? "unavailable",
                spice: null,
                score: null,
              };
            }
          })
        );

        if (!isMounted) return;
        setProducts(detailed);
      } catch (e) {
        const msg =
          e?.response?.data?.detail ||
          e?.response?.data?.message ||
          e?.message ||
          "خطا در دریافت پیشنهادها";

        if (!isMounted) return;
        setError(msg);
        setProducts([]);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    fetchRecommended();

    return () => {
      isMounted = false;
    };
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
        gap: 2,
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
          <Typography variant="body1">در حال بارگذاری پیشنهادها...</Typography>
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
            "&:hover": { backgroundColor: "#cfe3c5", transform: "scale(1.15)" },
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
              key={`${p.restaurantId}-${p.item_id}`}
              item={p}
              onClick={() =>
                navigate(`/customer/restaurants/${p.restaurantId}/${p.item_id}`)
              }
            />
          ))}
        </Box>

        <IconButton
          onClick={() => scrollRail("right")}
          sx={{
            backgroundColor: "#FBFADA",
            width: 44,
            height: 44,
            "&:hover": { backgroundColor: "#cfe3c5", transform: "scale(1.15)" },
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
