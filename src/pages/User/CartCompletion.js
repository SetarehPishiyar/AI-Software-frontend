import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  Container,
  Grid,
  AppBar,
  Toolbar,
  Divider,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import YumziImg from "../../assets/imgs/yumzi_icon.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../utills/axiosInstance";
import publicAxiosInstance from "../../utills/publicAxiosInstance";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [description, setDescription] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get("restaurant_id");
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartID, setCartID] = useState(0);
  const [deliveryCost, setDeliveryCost] = useState(0);

  const DELIVERY_COST =
    deliveryMethod === "delivery" ? Math.floor(parseInt(deliveryCost)) : 0;
  const discount = cartItems.reduce(
    (acc, item) => acc + item.price * (item.discount / 100) * item.count,
    0
  );
  const tax = Math.round(parseInt(totalPrice) * 0.09);
  const totalAfterDiscount = parseInt(totalPrice) - discount;
  const finalAmount = totalAfterDiscount + tax + DELIVERY_COST;

  useEffect(() => {
    fetchProfileData();
    if (restaurantId) {
      fetchCartData();
    }
  }, [restaurantId]);

  const fetchCartData = async () => {
    try {
      const response = await axiosInstance.get("/customer/carts", {
        params: { restaurant_id: restaurantId },
      });

      const filteredData = response.data.filter(
        (cart) => cart.restaurant === parseInt(restaurantId)
      );
      setCartID(parseInt(filteredData[0].id));
      setTotalPrice(parseInt(filteredData[0].total_price));
      setCartItems(response.data?.[0]?.cart_items);
    } catch (error) {
      console.error("خطا در دریافت اطلاعات سبد خرید:", error);
    }
  };

  const handleQuantityChange = async (cartItemId, delta) => {
    try {
      const item = cartItems.find((item) => item.id === cartItemId);
      if (!item) return;

      const newCount = item.count + delta;
      if (newCount < 1) return;

      const response = await axiosInstance.put(`/customer/carts/${cartID}`, {
        cart_item_id: cartItemId,
        count: newCount,
      });
      fetchCartData();
    } catch (error) {
      console.error(
        "خطا در به‌روزرسانی تعداد آیتم:",
        error.response?.data || error
      );
    }
  };

  const handleDeleteItem = async (cartItemId) => {
    try {
      await axiosInstance.delete(
        `/customer/carts/${cartID}/items/${cartItemId}`
      );
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== cartItemId)
      );
      setTotalPrice(
        (prevTotal) =>
          prevTotal - cartItems.find((item) => item.id === cartItemId)?.price
      );
      fetchCartData();
    } catch (error) {
      console.error("خطا در حذف آیتم:", error.response?.data || error);
    }
  };

  const fetchProfileData = async () => {
    try {
      const response = await publicAxiosInstance.get(
        `/restaurant/profiles/${restaurantId}`
      );

      const data = response.data;

      if (data) {
        setDeliveryCost(data.delivery_price || 0);
      } else {
        console.error("No restaurant data received from API");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ADBC9F",
        minHeight: "100%",
        width: "100%",
        margin: "auto",
      }}
    >
      {/* هدر */}
      <AppBar position="static" sx={{ backgroundColor: "#12372A", height:70 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <img
              src={YumziImg}
              alt="Yumzi Logo"
              style={{ width: "130px", cursor: "pointer" }}
            />
          </a>

          <Typography
            variant="h5"
            sx={{
              color: "#fff",
              fontWeight: "bold",
              flex: 1,
              textAlign: "center",
              paddingRight: "60px",
            }}
          >
            سبد خرید من
          </Typography>
        </Toolbar>
      </AppBar>

      {/* محتوای سبد خرید */}
      <Container
        width="75%"
        sx={{ mt: 3, mb: 0, pb:5, backgroundColor: "#ADBC9F", borderRadius: 2 }}
      >
        <Grid container spacing={2}>
          {cartItems.map((item) => (
            <Grid item xs={12} key={item.id}>
              <Card
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  boxShadow: 2,
                  borderRadius: 2,
                  backgroundColor: "#12372A",
                }}
              >
                {/* تصویر */}
                <CardMedia
                  component="img"
                  image={
                    item.photo ? item.photo : "https://via.placeholder.com/120"
                  }
                  alt={item.name}
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: 2,
                    objectFit: "cover",
                  }}
                  onClick={() =>
                    navigate(
                      `/customer/restaurants/${restaurantId}/${item.item}`
                    )
                  }
                />

                {/* جزئیات */}
                <CardContent
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      cursor: "pointer",
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      color: "#FBFADA",
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {item.description}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="#12372A"
                    sx={{
                      pointerEvents: "none",
                      userSelect: "none",
                      textDecoration:
                        item.discount > 0 ? "line-through" : "none",
                      color: item.discount > 0 ? "gray" : "#12372A",
                      fontSize: { xs: "0.8rem", sm: "1rem" },
                      display: "inline",
                    }}
                  >
                    {Math.floor(item.price).toLocaleString()} هزار تومان
                  </Typography>
                  {item.discount > 0 && (
                    <Typography
                      color="#ADBC9F"
                      sx={{
                        fontWeight: "bold",
                        display: "inline",
                        marginLeft: "15px",
                        fontSize: { xs: "0.9rem", sm: "1rem" }, // تغییر اندازه فونت
                      }}
                    >
                      {Math.floor(
                        item.price - (item.price * item.discount) / 100
                      ).toLocaleString()}{" "}
                      هزار تومان
                    </Typography>
                  )}
                </CardContent>

                {/* دکمه‌های تغییر تعداد */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Delete />
                  </IconButton>
                  <IconButton
                    sx={{ color: "#ADBC9F" }}
                    onClick={() => handleQuantityChange(item.id, 1)}
                  >
                    <Add />
                  </IconButton>
                  <Typography
                    variant="h6"
                    sx={{
                      pointerEvents: "none",
                      userSelect: "none",
                      fontSize: { xs: "0.9rem", sm: "1rem", color: "#ADBC9F" }, // تغییر اندازه فونت
                    }}
                  >
                    {item.count}
                  </Typography>
                  <IconButton
                    sx={{ color: "#ADBC9F" }}
                    onClick={() => handleQuantityChange(item.id, -1)}
                  >
                    <Remove />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* توضیحات */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight="bold">
            توضیحات
          </Typography>
          <TextField
            placeholder="توضیحات سفارش خود را اینجا بنویسید..."
            multiline
            rows={3}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",

                "& fieldset": {
                  borderColor: "#12372A",
                },
                "&:hover fieldset": {
                  borderColor: "#12372A",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#12372A !important",
                  borderWidth: "2px",
                },
              },
              "& .MuiInputBase-input": {
                color: "#12372A",
              },
            }}
          />
        </Box>

        {/* انتخاب روش تحویل */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight="bold">
            انتخاب روش تحویل
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              row
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value)}
            >
              <FormControlLabel
                value="pickup"
                control={
                  <Radio
                    sx={{
                      color: "#12372A", // رنگ پیش‌فرض
                      "&.Mui-checked": {
                        color: "#12372A", // رنگ وقتی انتخاب شد
                      },
                    }}
                  />
                }
                label="تحویل حضوری"
              />
              <FormControlLabel
                value="delivery"
                control={
                  <Radio
                    sx={{
                      color: "#12372A", // رنگ پیش‌فرض
                      "&.Mui-checked": {
                        color: "#12372A", // رنگ وقتی انتخاب شد
                      },
                    }}
                  />
                }
                label={`تحویل با پیک (${Math.floor(
                  deliveryCost
                ).toLocaleString()}) هزار تومان`}
              />
            </RadioGroup>
          </FormControl>
        </Box>

        {/* محاسبات */}
        <Divider sx={{ my: 4 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography>جمع سفارش:</Typography>
          <Typography>
            {Math.floor(parseInt(totalPrice)).toLocaleString()} هزار تومان
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography color="success">سود شما از این خرید:</Typography>
          <Typography color="success">
            -{discount.toLocaleString()} تومان
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography>مجموع اقلام پس از تخفیف:</Typography>
          <Typography>
            {(totalPrice - discount).toLocaleString()} هزار تومان
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography>هزینه ارسال:</Typography>
          <Typography>{DELIVERY_COST.toLocaleString()} هزار تومان</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography>مالیات (۹٪):</Typography>
          <Typography>{tax.toLocaleString()} هزار تومان</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <Typography variant="h6" fontWeight="bold">
            مبلغ قابل پرداخت:
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="#12372A">
            {finalAmount.toLocaleString()} هزار تومان
          </Typography>
        </Box>

        {/* دکمه ادامه خرید */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Button
            variant="contained"
            onClick={() =>
              navigate(`/customer/carts/${cartID}/checkout`, {
                state: {
                  totalPrice: finalAmount,
                  discount: discount,
                  tax: tax,
                  shippingCost: DELIVERY_COST,
                  itemsTotal: totalAfterDiscount,
                  deliveryMethod: deliveryMethod,
                  cartID: cartID,
                  description: description,
                },
              })
            }
            sx={{
              color: "#FBFADA !important",
              backgroundColor: "#12372A !important",
              "&:hover": {
                backgroundColor: "#0F2D23 !important",
              },
              fontSize: "1.1rem",
              padding: "10px 20px !important",
            }}
          >
            ادامه خرید
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default CartPage;
