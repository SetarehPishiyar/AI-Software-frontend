import React, { useState } from "react";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Container,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
} from "@mui/material";
import axiosInstance from "../../utills/axiosInstance";
import YumziImg from "../../assets/imgs/yumzi_icon.png";
import { useNavigate, useLocation } from "react-router-dom";

const CheckoutPage = () => {
  const location = useLocation();
  const {
    totalPrice,
    discount,
    tax,
    shippingCost,
    itemsTotal,
    deliveryMethod,
    cartID,
    description,
  } = location.state || {};

  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("online");

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleOrderSubmit = async () => {
    try {
      const response = await axiosInstance.post("/customer/orders", {
        cart_id: cartID,
        delivery_method: deliveryMethod,
        payment_method: paymentMethod,
        description: description,
      });

      if (response.status === 201) {
        alert("سفارش با موفقیت ثبت شد!");
        navigate(`/customer/orders/${response.data.order_id}/track-order`);
      }
    } catch (error) {
      alert("خطا در ثبت سفارش!");
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ADBC9F",
        minHeight: "100%",
        width: "100%",
        margin: "auto",
        pb: 5,
      }}
    >
      {/* هدر */}
      <AppBar position="static" sx={{ backgroundColor: "#12372A", height: 70 }}>
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
            تأیید نهایی و پرداخت
          </Typography>
        </Toolbar>
      </AppBar>

      {/* محتوای صفحه */}
      <Container
        width="75%"
        sx={{
          mt: 3,
          mb: 0,
          backgroundColor: "#ADBC9F",
          borderRadius: 2,
          p: 3,
        }}
      >
        {/* انتخاب آدرس */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold">
            انتخاب آدرس
          </Typography>

          <FormControl>
            <RadioGroup sx={{ mt: 1 }}>
              <FormControlLabel
                control={
                  <Radio
                    sx={{
                      color: "#12372A",
                      "&.Mui-checked": { color: "#12372A" },
                    }}
                  />
                }
                label="آدرس ذخیره شده شما"
              />
            </RadioGroup>
          </FormControl>

          <Box sx={{ textAlign: "left", mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate("/customer/edit-profile")}
              sx={{
                backgroundColor: "#12372A !important",
                color: "#FBFADA !important",
                "&:hover": { backgroundColor: "#0F2D23 !important" },
                padding: "8px 20px !important",
              }}
            >
              تغییر آدرس
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 4, borderColor: "#12372A" }} />

        {/* انتخاب روش پرداخت */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold">
            انتخاب روش پرداخت
          </Typography>

          <FormControl>
            <RadioGroup
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
              sx={{ mt: 2 }}
            >
              <FormControlLabel
                value="online"
                control={
                  <Radio
                    sx={{
                      color: "#12372A",
                      "&.Mui-checked": { color: "#12372A" },
                    }}
                  />
                }
                label="پرداخت آنلاین"
              />

              <FormControlLabel
                value="in_person"
                control={
                  <Radio
                    sx={{
                      color: "#12372A",
                      "&.Mui-checked": { color: "#12372A" },
                    }}
                  />
                }
                label="پرداخت در محل"
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <Divider sx={{ my: 4, borderColor: "#12372A" }} />

        {/* جزئیات پرداخت */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold">
            جزئیات پرداخت
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Typography>جمع سفارش:</Typography>
            <Typography>{itemsTotal?.toLocaleString()} تومان</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Typography color="success.main">سود شما از این خرید:</Typography>
            <Typography color="success.main">
              -{discount?.toLocaleString()} تومان
            </Typography>
          </Box>

          <Divider sx={{ my: 2, borderColor: "#12372A" }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Typography>مجموع اقلام پس از تخفیف:</Typography>
            <Typography>
              {(itemsTotal - discount)?.toLocaleString()} تومان
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Typography>هزینه ارسال:</Typography>
            <Typography>{shippingCost?.toLocaleString()} تومان</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Typography>مالیات (۹٪):</Typography>
            <Typography>{tax?.toLocaleString()} تومان</Typography>
          </Box>

          <Divider sx={{ my: 2, borderColor: "#12372A" }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              مبلغ قابل پرداخت:
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="#12372A">
              {totalPrice?.toLocaleString()} تومان
            </Typography>
          </Box>
        </Box>

        {/* دکمه پرداخت */}
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            onClick={handleOrderSubmit}
            sx={{
              backgroundColor: "#12372A !important",
              color: "#FBFADA !important",
              "&:hover": { backgroundColor: "#0F2D23 !important" },
              fontSize: "1.1rem",
              padding: "10px 20px !important",
            }}
          >
            پرداخت
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default CheckoutPage;
