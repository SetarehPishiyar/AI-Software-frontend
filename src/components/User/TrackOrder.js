import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Grid,
  AppBar,
  Toolbar,
} from "@mui/material";
import YumziImg from "../../assets/imgs/yumzi_icon.png";
import axiosInstance from "../../utills/axiosInstance";
import MotorbikeImage from "../../assets/imgs/motorbike.png";

const TrackOrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    "در انتظار تایید",
    "در حال آماده سازی",
    "ارسال شده",
    "تحویل داده شده",
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axiosInstance.get("/customer/orders");
        const fetchedOrder = response.data.find(
          (order) => order.order_id.toString() === id
        );

        setOrder(fetchedOrder);

        switch (fetchedOrder.state) {
          case "pending":
            setActiveStep(0);
            break;
          case "preparing":
            setActiveStep(1);
            break;
          case "delivering":
            setActiveStep(2);
            break;
          case "completed":
            setActiveStep(3);
            navigate(`/customer/orders/${id}/review`);
            break;
          default:
            setActiveStep(0);
        }
      } catch (error) {
        console.error("خطا در دریافت اطلاعات سفارش:", error);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [id, navigate]);

  if (!order) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#b9c3a7",
        }}
      >
        <Typography>در حال بارگذاری...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#b9c3a7" }}>
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
          alt="Yumzi Logo"
          style={{ height: 60, cursor: "pointer" }}
          onClick={() => navigate("/")}
        />
      </Box>

      {/* MAIN CONTENT */}
      <Grid container justifyContent="center" mt={4}>
        <Grid item xs={11} md={8} lg={7}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "#12372A",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                mb: 2,
                fontSize: { xs: "1.3rem", sm: "1.8rem", color: "white" },
              }}
            >
              وضعیت سفارش شما
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 4,
                fontSize: { xs: "0.9rem", sm: "1.2rem", color: "white" },
              }}
            >
              سفارش شما به ثبت رسید.
            </Typography>

            <Box sx={{ my: 3 }}>
              <img
                src={MotorbikeImage}
                alt="Motorbike"
                style={{ width: "200px", maxWidth: "80%", height: "auto" }}
              />
            </Box>

            {/* STEPPER */}
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{
                "& .MuiStepConnector-line": { borderColor: "#355f4a" },
                "& .MuiStepLabel-label": {
                  fontSize: { xs: "0.75rem", sm: "0.9rem", color: "white" },
                },
                mt: 3,
              }}
            >
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel
                    StepIconProps={{
                      sx: {
                        color:
                          index <= activeStep ? "#e16d6dff !important" : "gray",
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TrackOrderPage;
