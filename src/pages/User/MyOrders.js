import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Collapse,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import moment from "moment-jalaali";
import { useNavigate } from "react-router-dom";
import YumziImg from "../../assets/imgs/yumzi_icon.png";
import { useOrders } from "../../hooks/useOrders";
import { getUserInfo } from "../../services/userService";

const deliveryMethodMap = {
  pickup: "دریافت حضوری",
  delivery: "ارسال با پیک",
};

const paymentMethodMap = {
  in_person: "نقدی",
  online: "آنلاین",
};

const MyOrders = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      const data = await getUserInfo();
      if (!data) {
        navigate("/login");
        return;
      }
      setUser(data);
      setLoadingUser(false);
    };
    fetchUser();
  }, [navigate]);

  const userId = user?.user?.id;
  const { orders, reviewsMap } = useOrders(userId);


  console.log(useOrders(userId))

  const handleCollapseToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loadingUser) {
    return (
      <Typography sx={{ mt: 5, textAlign: "center", color: "#0f3924" }}>
        در حال بارگذاری اطلاعات کاربر...
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%", minHeight: "120vh", bgcolor: "#b9c3a7" }}>
      {/* HEADER */}
      <Box
        sx={{
          width: "100%",
          height: 100,
          bgcolor: "#0f3924",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        <img
          src={YumziImg}
          alt="logo"
          style={{ height: 60, cursor: "pointer" }}
          onClick={() => navigate("/")}
        />
      </Box>

      {/* PAGE TITLE */}
      <Typography
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.4rem",
          mt: 3,
          color: "#0f3924",
        }}
      >
        سفارش‌های من
      </Typography>

      {/* ORDERS LIST */}
      <Grid container justifyContent="center" mt={4} spacing={2}>
        {orders.length === 0 ? (
          <Typography
            sx={{
              mt: 6,
              fontSize: "1.1rem",
              textAlign: "center",
              color: "#0f3924",
            }}
          >
            لیست سفارش‌های شما خالی است.
          </Typography>
        ) : (
          orders.map((order, index) => (
            <Card
              key={order.id}
              sx={{
                width: { xs: "92%", sm: "80%", md: "85%" },
                bgcolor: "#e8e9d6",
                borderRadius: 2,
                boxShadow: 3,
                p: 2,
              }}
            >
              {/* CARD CONTENT */}
              <CardContent>
                <Typography
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    color: "#12372A",
                  }}
                >
                  سفارش شماره {order.order_id}
                </Typography>
                <Typography
                  sx={{ mt: 1, fontWeight: "bold", color: "#12372A" }}
                >
                  {order.restaurant_name}
                </Typography>
                <Typography sx={{ mt: 1, color: "#333" }}>
                  {order.description}
                </Typography>
                <Typography sx={{ mt: 2, color: "#555" }}>
                  تاریخ سفارش:{" "}
                  {moment(order.order_date).format("jYYYY/jMM/jDD")} -{" "}
                  {moment(order.order_date).format("HH:mm")}
                </Typography>
                <Typography sx={{ mt: 1, color: "#555" }}>
                  آدرس: {order.address}
                </Typography>
                <Typography sx={{ mt: 1, color: "#555" }}>
                  روش ارسال: {deliveryMethodMap[order.delivery_method]}
                </Typography>
                <Typography sx={{ mt: 1, color: "#555" }}>
                  روش پرداخت: {paymentMethodMap[order.payment_method]}
                </Typography>
                <Typography
                  sx={{ mt: 2, fontWeight: "bold", color: "#12372A" }}
                >
                  قیمت کل: {Math.floor(order.total_price).toLocaleString()}{" "}
                  تومان
                </Typography>
              </CardContent>

              {/* CARD ACTIONS */}
              <CardActions
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {order.state === "completed" ? (
                    <Button
                      variant="contained"
                      disabled
                      sx={{ bgcolor: "#355f4a", color: "white", minWidth: 120 }}
                    >
                      تحویل شده
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: "#0f3924",
                        "&:hover": { bgcolor: "#12372A" },
                        minWidth: 120,
                      }}
                      onClick={() =>
                        navigate(
                          `/customer/orders/${order.order_id}/track-order`
                        )
                      }
                    >
                      پیگیری سفارش
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#0f3924",
                      "&:hover": { bgcolor: "#12372A" },
                      minWidth: 120,
                    }}
                    onClick={() =>
                      navigate(`/customer/restaurants/${order.restaurant}`)
                    }
                  >
                    سفارش مجدد
                  </Button>

                  {order.state === "completed" && (
                    <>
                      {reviewsMap[order.order_id] ? (
                        <Button
                          variant="contained"
                          disabled
                          sx={{
                            bgcolor: "#0f3924",
                            "&:hover": { bgcolor: "#12372A" },
                            minWidth: 120,
                          }}
                        >
                          امتیاز شما: {reviewsMap[order.order_id].score} ⭐
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: "#0f3924",
                            "&:hover": { bgcolor: "#12372A" },
                            minWidth: 120,
                          }}
                          onClick={() =>
                            navigate(
                              `/customer/orders/${order.order_id}/review`
                            )
                          }
                        >
                          ثبت نظر
                        </Button>
                      )}
                    </>
                  )}
                </Box>

                <Button
                  sx={{
                    bgcolor: "#0f3924",
                    color: "white",
                    "&:hover": { bgcolor: "#12372A" },
                    minWidth: 40,
                  }}
                  onClick={() => handleCollapseToggle(index)}
                >
                  <ExpandMoreIcon />
                </Button>
              </CardActions>

              {/* COLLAPSE SECTION */}
              <Collapse in={openIndex === index}>
                <CardContent>
                  <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                    آیتم‌های سفارش:
                  </Typography>
                  <List>
                    {order.order_items.map((item, idx) => (
                      <ListItem key={idx} sx={{ px: 0 }}>
                        <ListItemText
                          primary={`${item.name} - تعداد: ${item.count}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Collapse>
            </Card>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default MyOrders;
