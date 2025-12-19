import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
import Select from "@mui/material/Select";
import KeyIcon from "@mui/icons-material/Key";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import StoreIcon from "@mui/icons-material/Store";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import YumziImg from "../../assets/imgs/yumzi_icon.png";

function SignUp() {
  const [businessType, setBusinessType] = useState("");
  const [provinceName, setProvinceName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setErrors] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const iranProvinces = [
    { fa: "آذربایجان شرقی", en: "East Azerbaijan" },
    { fa: "آذربایجان غربی", en: "West Azerbaijan" },
    { fa: "اردبیل", en: "Ardabil" },
    { fa: "اصفهان", en: "Isfahan" },
    { fa: "البرز", en: "Alborz" },
    { fa: "ایلام", en: "Ilam" },
    { fa: "بوشهر", en: "Bushehr" },
    { fa: "تهران", en: "Tehran" },
    { fa: "چهارمحال و بختیاری", en: "Chaharmahal and Bakhtiari" },
    { fa: "خراسان جنوبی", en: "South Khorasan" },
    { fa: "خراسان شمالی", en: "North Khorasan" },
    { fa: "خراسان رضوی", en: "Razavi Khorasan" },
    { fa: "خوزستان", en: "Khuzestan" },
    { fa: "زنجان", en: "Zanjan" },
    { fa: "سمنان", en: "Semnan" },
    { fa: "سیستان و بلوچستان", en: "Sistan and Baluchestan" },
    { fa: "فارس", en: "Fars" },
    { fa: "قزوین", en: "Qazvin" },
    { fa: "قم", en: "Qom" },
    { fa: "کردستان", en: "Kurdistan" },
    { fa: "کرمان", en: "Kerman" },
    { fa: "کرمانشاه", en: "Kermanshah" },
    { fa: "کهگیلویه و بویراحمد", en: "Kohgiluyeh and Boyer-Ahmad" },
    { fa: "گلستان", en: "Golestan" },
    { fa: "گیلان", en: "Gilan" },
    { fa: "لرستان", en: "Lorestan" },
    { fa: "مازندران", en: "Mazandaran" },
    { fa: "مرکزی", en: "Markazi" },
    { fa: "هرمزگان", en: "Hormozgan" },
    { fa: "همدان", en: "Hamedan" },
    { fa: "یزد", en: "Yazd" },
  ];

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !businessType ||
      !provinceName ||
      !storeName ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      setErrors("لطفاً همه فیلدها را پر کنید");
      return;
    }

    if (
      !/^\d+$/.test(phoneNumber) ||
      !phoneNumber.startsWith("09") ||
      phoneNumber.length != 11
    ) {
      setErrors("شماره موبایل وارد شده صحیح نیست");
      return;
    }

    let formattedPhoneNumber = phoneNumber.trim();
    if (formattedPhoneNumber.startsWith("0")) {
      formattedPhoneNumber = `98${formattedPhoneNumber.slice(1)}`;
    } else if (!formattedPhoneNumber.startsWith("98")) {
      setErrors("لطفاً شماره موبایل را به‌درستی وارد کنید");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrors(
        "رمز عبور باید شامل حروف کوچک، حروف بزرگ انگلیسی و عدد باشد و حداقل 8 کاراکتر داشته باشد"
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrors("رمز عبور و تکرار آن همخوانی ندارند");
      return;
    }

    const RestaurantData = {
      name: storeName,
      city_name: provinceName,
      phone_number: formattedPhoneNumber,
      password: password,
      business_type: businessType,
    };

    try {
      const response = await axios.post(
        "http://localhost/api/auth/signup/restaurant",
        RestaurantData
      );

      if (response.status === 201) {
        alert("ثبت نام با موفقیت انجام شد. اکنون وارد شوید!");
        handleLoginClick();
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setErrors("این شماره قبلاً ثبت‌نام کرده است.");
      } else {
        setErrors(
          error.response?.data?.message ||
            "مشکلی پیش آمده، لطفاً دوباره تلاش کنید."
        );
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="signup-container">
      <img
        src={YumziImg}
        alt="Login Illustration"
        style={{ width: "250px", marginBottom: "10px", marginTop: "20px" }}
      />

      <Divider />

      {/* نوع رستوران */}
      <FormControl variant="standard" sx={{ width: "50%" }}>
        <InputLabel>نوع رستوران</InputLabel>
        <Select
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          sx={{ color: "#fff", textAlign: "left", mb: 3 }}
        >
          <MenuItem value="Iranian">ایرانی</MenuItem>
          <MenuItem value="FastFood">فست فود</MenuItem>
          <MenuItem value="Italian">ایتالیایی</MenuItem>
          <MenuItem value="Asian">آسیایی</MenuItem>
          <MenuItem value="Mexican">مکزیکی</MenuItem>
        </Select>
      </FormControl>

      {/* استان */}
      <FormControl variant="standard" sx={{ width: "50%" }}>
        <InputLabel>استان</InputLabel>
        <Select
          value={provinceName}
          onChange={(e) => setProvinceName(e.target.value)}
          sx={{ color: "#fff", textAlign: "left" }}
        >
          {iranProvinces.map((p) => (
            <MenuItem key={p.fa} value={p.fa}>
              {p.fa}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box
        sx={{ display: "flex", alignItems: "flex-end", width: "52%" }}
        marginBottom={0.9}
      >
        <StoreIcon sx={{ color: "action.active", mr: 1, mb: 2 }} />
        <TextField
          fullWidth
          type="text"
          label="نام فروشگاه"
          variant="standard"
          margin="normal"
          name="storeName"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          InputProps={{ style: { color: "white" } }}
        />
      </Box>

      <Box
        sx={{ display: "flex", alignItems: "flex-end", width: "52%" }}
        marginBottom={0.9}
      >
        <PhoneEnabledIcon sx={{ color: "action.active", mr: 1, mb: 2 }} />
        <TextField
          fullWidth
          type="tel"
          label="شماره تلفن"
          variant="standard"
          margin="normal"
          name="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          InputProps={{ style: { color: "white" } }}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "flex-end", width: "52%" }}>
        <KeyIcon sx={{ color: "action.active", mr: 1, mb: 2 }} />
        <FormControl
          sx={{ m: 1 }}
          fullWidth
          variant="standard"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{ style: { color: "white" } }}
        >
          <InputLabel htmlFor="standard-adornment-password">رمزعبور</InputLabel>
          <Input
            fullWidth
            id="standard-adornment-password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? "hide the password" : "display the password"
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  InputProps={{ style: { color: "white" } }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>

      <Box sx={{ display: "flex", alignItems: "flex-end", width: "52%" }}>
        <KeyIcon sx={{ color: "action.active", mr: 1, mb: 2 }} />
        <FormControl
          sx={{ m: 1 }}
          fullWidth
          variant="standard"
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        >
          <InputLabel htmlFor="standard-adornment-password">
            تکرار رمزعبور
          </InputLabel>
          <Input
            fullWidth
            id="standard-adornment-password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? "hide the password" : "display the password"
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

      {error && <Typography style={{ color: "red" }}>{error}</Typography>}

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "20px", width: "150px", mb: 3 }}
        onClick={handleSubmit}
      >
        ثبت‌نام
      </Button>

      <Box>
        <Typography
          variant="body2"
          display={"inline"}
          style={{ marginTop: "15px", color: "#616161" }}
        >
          حساب کاربری دارید؟
        </Typography>

        <Typography
          variant="body2"
          display={"inline"}
          style={{ marginTop: "15px", marginRight: "10px", cursor: "pointer" }}
          onClick={handleLoginClick}
          sx={{ pointerEvents: "auto", color: "#fff !important" }}
        >
          وارد شوید
        </Typography>
      </Box>
    </div>
  );
}

export default SignUp;
