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
import YumziImg from "../assets/imgs/yumzi_icon.png";
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
    ////add image
    <>
      {/* عکس بالای صفحه */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#12372A",
          overflow:"hidden",
          pt: 2,
        }}
      >
        <Box
          component="img"
          src={YumziImg}
          alt="Top Logo"
          sx={{
            width: 220,
            height: "auto",
          }}
        />
      </Box>

      <Box
        className="login-container"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          height: "90vh", 
          width: "100%",
          p: { xs: 2, md: 3 }, 
          gap: { xs: 3, md: 10 }, 
          backgroundColor: "#12372A",
          overflow: "hidden !important", 
        }}
      >
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
            backgroundColor: "#ADBC9F",
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
            fullWidth
            sx={{
              mb: 3,
              backgroundColor: "#12372A !important",
              color: "#ADBC9F !important",
              "&:hover": {
                backgroundColor: "#96B47A !important",
                color: "#12372A !important",
              },
            }}
          >
            ورود
          </Button>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              mt: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#000 !important",
                "&:hover": {
                  cursor: "text",
                },
              }}
            >
              حساب کاربری ندارید؟
            </Typography>

            <Typography
              variant="body2"
              onClick={handleSignUpClick}
              sx={{ cursor: "pointer" }}
            >
              ثبت‌نام
            </Typography>
          </Box>

          <Typography
            variant="body2"
            onClick={handleStoreSignUpClick}
            sx={{
              cursor: "pointer",
              color: "primary.main",
              textAlign: "center",
              mt: 1,
            }}
          >
            ثبت‌نام فروشندگان
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export default Login;
