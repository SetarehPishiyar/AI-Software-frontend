import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import moment from "moment-jalaali";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axiosInstance from "../../utills/axiosInstance";
import YumziImg from "../../assets/imgs/yumzi_icon.png";

const getStatusInFarsi = (status) => {
  switch (status) {
    case "pending":
      return "در انتظار تایید";
    case "preparing":
      return "در حال آماده سازی";
    case "delivering":
      return "ارسال شده";
    case "completed":
      return "تحویل داده شده";
    default:
      return status;
  }
};

const deliveryMethodMap = {
  pickup: "دریافت حضوری",
  delivery: "ارسال با پیک",
};

const paymentMethodMap = {
  in_person: "نقدی",
  online: "آنلاین",
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("/restaurant/orders");
      const ordersWithId = response.data.map((order, index) => ({
        ...order,
        id: index + 1,
        status: getStatusInFarsi(order.status),
      }));
      setOrders(ordersWithId);
    } catch (err) {
      console.log("خطا در دریافت اطلاعات");
    }
  };

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleCloseDialog = async () => {
    if (selectedOrder) {
      try {
        await axiosInstance.patch(
          `/restaurant/orders/${selectedOrder.order_id}/status`,
          { state: status }
        );
      } catch (err) {
        console.error("خطا در به‌روزرسانی وضعیت سفارش:", err);
      }
    }
    fetchOrders();
    setOpen(false);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#ADBC9F",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          width: "100%",
          height: 100,
          bgcolor: "#12372A",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={YumziImg}
          alt="yumzi"
          style={{ height: 60, cursor: "pointer" }}
          onClick={() => (window.location.href = "/")}
        />
      </Box>

      {/* PAGE TITLE */}
      <Typography
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.4rem",
          mt: 3,
          color: "#12372A",
        }}
      >
        لیست سفارش‌ها
      </Typography>

      {/* ORDER LIST */}
      <Box
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pb: 4,
        }}
      >
        {orders.length === 0 ? (
          <Typography
            sx={{
              mt: 6,
              fontSize: "1.1rem",
              textAlign: "center",
              color: "#12372A",
            }}
          >
            سفارشی در لیست شما وجود ندارد
          </Typography>
        ) : (
          orders.map((order, index) => (
            <Accordion
              key={order.id}
              sx={{
                width: { xs: "92%", sm: "80%", md: "85%" },
                borderRadius: 2,
                mb: 2,
                backgroundColor: "#e8e9d6",
                boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      color: "#12372A",
                    }}
                  >
                    سفارش شماره {index + 1}
                  </Typography>

                  <Typography sx={{ color: "#333", mt: 1 }}>
                    تاریخ سفارش:{" "}
                    {moment(order.order_date).format("jYYYY/jMM/jDD")} -{" "}
                    {moment(order.order_date).format("HH:mm")}
                  </Typography>

                  <Typography sx={{ color: "#333", mt: 0.5 }}>
                    روش ارسال: {deliveryMethodMap[order.delivery_method]}
                  </Typography>

                  <Typography sx={{ color: "#333", mt: 0.5 }}>
                    روش پرداخت: {paymentMethodMap[order.payment_method]}
                  </Typography>

                  <Typography sx={{ color: "#333", mt: 0.5 }}>
                    آدرس: {order.address}
                  </Typography>

                  <Typography sx={{ color: "#12372A", mt: 0.5 }}>
                    وضعیت فعلی: {getStatusInFarsi(order.state)}
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: "#12372A",
                    minWidth: "120px",
                    textAlign: "center",
                  }}
                >
                  {Math.floor(order.total_price).toLocaleString()} تومان
                </Typography>
              </AccordionSummary>

              <AccordionDetails sx={{ bgcolor: "#f5f5eb", borderRadius: 2 }}>
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

                <Typography sx={{ mt: 2, fontWeight: "bold" }}>
                  توضیحات سفارش:
                </Typography>
                <Typography sx={{ color: "#444" }}>
                  {order.description || "بدون توضیحات"}
                </Typography>

                <Button
                  variant="contained"
                  disabled={order.state === "completed"}
                  onClick={() => handleOpenDialog(order)}
                  sx={{
                    mt: 2,
                    color: "#f5f5eb !important",
                    bgcolor: "#12372A !important",
                    "&:hover": {
                      bgcolor: "#ADBC9F !important",
                      color: "#12372A !important",
                    },
                  }}
                >
                  وارد کردن وضعیت سفارش
                </Button>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Box>

      {/* STATUS DIALOG */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        BackdropProps={{
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.55)", // تیره‌تر و شفافیت کمتر
            backdropFilter: "blur(12px)", // بلور قوی‌تر و زیباتر
            WebkitBackdropFilter: "blur(12px)", // برای Safari
            transition: "all 0.3s ease-in-out",
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "1.5rem",
            minWidth: "300px",
            backgroundColor: "rgba(173, 188, 159, 0.85)", // کمی شیشه‌ای‌تر
            backdropFilter: "blur(6px)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
            transition: "all 0.3s ease",
          },
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            وضعیت این سفارش را وارد کنید.
          </Typography>

          <FormControl fullWidth>
            <InputLabel>وضعیت سفارش</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="وضعیت سفارش"
              sx={{
                backgroundColor: "#rgba(173, 188, 159, 0.85)",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            >
              <MenuItem value="preparing">در حال آماده سازی</MenuItem>
              <MenuItem value="delivering">ارسال شده</MenuItem>
              <MenuItem value="completed">تحویل داده شده</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            fullWidth
            onClick={handleCloseDialog}
            sx={{
              color: "#f5f5eb !important",
              bgcolor: "#12372A !important",
              "&:hover": {
                bgcolor: "#adbc9fff !important",
                color: "#12372A !important",
              },
            }}
          >
            تایید
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default OrderList;
