import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Input,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import LoginImg from "../assets/imgs/login.png";
import axios from "../utills/axiosInstance.js";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate("/customer/signup");
  };

  const handleStoreSignUpClick = () => {
    navigate("/restuarant/signup");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!phoneNumber) {
      setError("لطفاً شماره تلفن خود را وارد کنید");
      return;
    }

    if (
      !/^\d+$/.test(phoneNumber) ||
      !phoneNumber.startsWith("09") ||
      phoneNumber.length !== 11
    ) {
      setError("شماره موبایل وارد شده صحیح نیست");
      return;
    }

    if (!password) {
      setError("لطفاً رمز عبور خود را وارد کنید");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "رمز عبور باید شامل حروف کوچک، حروف بزرگ انگلیسی و عدد باشد و حداقل 8 کاراکتر داشته باشد"
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/token",
        {
          phone_number: `98${phoneNumber.slice(1)}`,
          password: password,
        }
      );

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("res_id", response.data.restaurant_id);
      localStorage.setItem("phone", phoneNumber);

      if (response.data.restaurant_id) {
        if (response.data.state === "approved") {
          navigate(`/restaurant/${response.data.restaurant_id}/profile`);
        } else if (response.data.state === "pending") {
          localStorage.clear();
          alert("فروشگاه شما در انتظار تایید ادمین است");
        } else if (response.data.state === "rejected") {
          localStorage.clear();
          alert("فروشگاه شما توسط ادمین رد شده است");
        }
      } else {
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setError("اطلاعات ورود صحیح نیست.");
      } else {
        setError("مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.");
      }
    }
  };

  return (
    <Box
      className="login-container"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        p: 3,
        gap: { xs: 5, md: 15 },
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* تصویر سمت چپ */}
      <Box
        component="img"
        src={LoginImg}
        alt="Login Illustration"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/300";
        }}
        sx={{
          width: { xs: "70%", md: "40%" },
          maxWidth: 400,
          mb: { xs: 3, md: 0 },
        }}
      />

      {/* فرم ورود */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xs: "90%", sm: 400 },
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#fff",
        }}
      >
        {/* شماره موبایل */}
        <Box sx={{ display: "flex", alignItems: "flex-end", mb: 2 }}>
          <PhoneEnabledIcon sx={{ color: "action.active", mr: 1, mb: 1 }} />
          <TextField
            fullWidth
            type="tel"
            label="شماره موبایل"
            variant="standard"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </Box>

        {/* رمز عبور */}
        <Box sx={{ display: "flex", alignItems: "flex-end", mb: 2 }}>
          <KeyIcon sx={{ color: "action.active", mr: 1, mb: 1 }} />
          <FormControl variant="standard" fullWidth>
            <InputLabel htmlFor="standard-adornment-password">
              رمزعبور
            </InputLabel>
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>

        {/* پیام خطا */}
        {error && (
          <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )}

        {/* دکمه ورود */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 3 }}
        >
          ورود
        </Button>

        {/* لینک‌های ثبت‌نام خارج از فرم برای جلوگیری از submit */}
        <Typography
          variant="body2"
          sx={{ color: "#616161", mb: 1, textAlign: "center" }}
        >
          حساب کاربری ندارید؟
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 3,
          }}
        >
          <Typography
            variant="body2"
            onClick={handleSignUpClick}
            sx={{ cursor: "pointer", color: "primary.main" }}
          >
            ثبت‌نام
          </Typography>
          <Typography
            variant="body2"
            onClick={handleStoreSignUpClick}
            sx={{ cursor: "pointer", color: "primary.main" }}
          >
            ثبت نام فروشندگان
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
