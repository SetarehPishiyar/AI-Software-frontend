import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardMedia,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utills/axiosInstance";

const CartsList = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  const handleDeleteItem = async (id) => {
    try {
      const response = await axiosInstance.delete(`/customer/carts/${id}`);

      if (response.status === 200) {
        alert(`کارت با موفقیت حذف شد.`);
        fetchCartData();
      } else {
        alert("حذف کارت ناموفق بود.");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("کارت پیدا نشد.");
      } else {
        alert("خطا در حذف کارت. لطفاً دوباره تلاش کنید.");
      }
      console.error("خطا در حذف کارت:", error);
    }
  };

  const handleContinueShopping = (resID) => {
    navigate(`/customer/carts?restaurant_id=${resID}`);
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      const response = await axiosInstance.get("/customer/carts");
      const carts = response.data;

      const updatedCarts = await Promise.all(
        carts.map(async (cart) => {
          try {
            const profileResponse = await axiosInstance.get(
              `/restaurant/profiles/${cart.restaurant}`
            );
            const restaurantProfile = profileResponse.data;

            return {
              ...cart,
              photo: restaurantProfile.photo,
            };
          } catch (error) {
            console.error(
              `خطا در دریافت اطلاعات رستوران برای کارت با آیدی ${cart.restaurant}:`,
              error
            );
            return cart;
          }
        })
      );
      setCartItems(updatedCarts);
    } catch (error) {
      console.error("خطا در دریافت اطلاعات سبد خرید:", error);
    }
  };

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#b9c3a7" }}>
      {/* Header */}
      <Box
        sx={{
          width: "100%",
          margin: "0 auto",
          backgroundColor: "#12372A",
          padding: "16px",
          textAlign: "center",
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
          لیست سبد خرید ها
        </Typography>
      </Box>

      {/* Cart Items */}
      <Container sx={{ mt: 2, width:"80%" }}>
        <Grid container spacing={2} justifyContent="center">
          {cartItems.length === 0 ? (
            <Typography
              variant="h6"
              color="text.secondary"
              style={{ marginTop: "40px" }}
            >
              در حال حاضر سبد خرید فعالی ندارید.
            </Typography>
          ) : (
            cartItems.map((item) => (
              <Grid item xs={12} key={item.id}>
                <Card
                  sx={{
                    display: "flex",
                    margin: "auto",
                    justifyContent: "space-between",
                    backgroundColor: "#12372A",
                    alignItems: "center",
                    padding: 3,
                    borderRadius: "8px",
                    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
                    transition: "box-shadow 0.3s ease",
                    "&:hover": {
                      boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.3)",
                      backgroundColor: "#24453aff",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={
                        item.photo
                          ? item.photo
                          : "https://via.placeholder.com/120"
                      }
                      alt={item.restaurant_name}
                      sx={{
                        width: 150,
                        height: 150,
                        borderRadius: "8px",
                        color: "#f0f0f0",
                      }}
                      onClick={() => navigate(`//${item.restaurant}`)}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        mt: 1,
                        textAlign: "center",
                        fontSize: "16px",
                        color: "#f0f0f0",
                      }}
                    >
                      {item.restaurant_name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() => handleDeleteItem(item.id)}
                      sx={{
                        minWidth: "100px",
                        borderRadius: "20px",
                        color: "white",
                      }}
                    >
                      حذف سبد
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleContinueShopping(item.restaurant)}
                      sx={{
                        minWidth: "100px",
                        borderRadius: "20px",
                        backgroundColor: "red",
                      }}
                    >
                      ادامه خرید
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default CartsList;
