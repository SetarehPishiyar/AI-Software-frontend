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
import axiosInstance from "../utills/axiosInstance";
import { useUser } from "../contexts/UserContext";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { fetchUser } = useUser();

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const validateForm = () => {
    if (!phoneNumber) return "لطفاً شماره تلفن خود را وارد کنید";
    if (
      !/^\d+$/.test(phoneNumber) ||
      !phoneNumber.startsWith("09") ||
      phoneNumber.length !== 11
    )
      return "شماره موبایل وارد شده صحیح نیست";
    if (!password) return "لطفاً رمز عبور خود را وارد کنید";
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password))
      return "رمز عبور باید شامل حروف کوچک، حروف بزرگ انگلیسی و عدد باشد و حداقل 8 کاراکتر داشته باشد";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await axiosInstance.post("/auth/token", {
        phone_number: `98${phoneNumber.slice(1)}`,
        password,
      });

      const data = res.data;

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("phone", phoneNumber);
      if (data.restaurant_id) {
        localStorage.setItem("res_id", data.restaurant_id);
      }

      await fetchUser();

      if (data.restaurant_id) {
        switch (data.state) {
          case "approved":
            navigate(`/restaurant/${data.restaurant_id}/profile`);
            break;
          case "pending":
            alert("فروشگاه شما در انتظار تایید ادمین است");
            break;
          case "rejected":
            alert("فروشگاه شما توسط ادمین رد شده است");
            break;
          default:
            alert("وضعیت فروشگاه نامشخص است");
        }
      } else {
        window.location.replace("/");
      }
    } catch (err) {
      console.error("AXIOS ERROR:", err);
      if (err.response?.status === 401) setError("اطلاعات ورود صحیح نیست.");
      else setError("مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.");
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#12372A",
          pt: 2,
        }}
      >
        <Box
          component="img"
          src={YumziImg}
          alt="Top Logo"
          sx={{ width: 220, height: "auto" }}
        />
      </Box>

      <Box
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
        }}
      >
        <Box
          component="img"
          src={LoginImg}
          alt="Login Illustration"
          onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
          sx={{
            width: { xs: "70%", md: "40%" },
            maxWidth: 400,
            mb: { xs: 3, md: 0 },
          }}
        />

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
                      aria-label="toggle password visibility"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>

          {error && (
            <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
              {error}
            </Typography>
          )}

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
            <Typography variant="body2" sx={{ color: "#000 !important" }}>
              حساب کاربری ندارید؟
            </Typography>
            <Typography
              variant="body2"
              onClick={() => navigate("/customer/signup")}
              sx={{ cursor: "pointer" }}
            >
              ثبت‌نام
            </Typography>
          </Box>

          <Typography
            variant="body2"
            onClick={() => navigate("/restuarant/signup")}
            sx={{
              cursor: "pointer",
              color: "#000 !important",
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
