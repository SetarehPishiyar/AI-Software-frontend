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
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import KeyIcon from "@mui/icons-material/Key";
import PersonIcon from "@mui/icons-material/Person";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import YumziImg from "../../assets/imgs/yumzi_icon.png";
import publicAxiosInstance from "../../utills/publicAxiosInstance";
import MenuItem from "@mui/material/MenuItem";

function SignUp() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [province, setProvince] = useState("");
  const [diet, setDiet] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");

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
    { fa: "خراسان رضوی", en: "Razavi Khorasan" },
    { fa: "خراسان شمالی", en: "North Khorasan" },
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

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const formatBirthdate = (dateStr) => {
    return dateStr.replace(/-/g, "/");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !name ||
      !lastName ||
      !phoneNumber ||
      !password ||
      !confirmPassword ||
      !province ||
      !diet ||
      !gender ||
      !birthdate
    ) {
      setErrorMessage("لطفاً همه فیلدها را پر کنید");
      return;
    }

    if (
      !/^\d+$/.test(phoneNumber) ||
      !phoneNumber.startsWith("09") ||
      phoneNumber.length !== 11
    ) {
      setErrorMessage("شماره موبایل وارد شده صحیح نیست");
      return;
    }

    let formattedPhoneNumber = phoneNumber.trim();
    if (formattedPhoneNumber.startsWith("0")) {
      formattedPhoneNumber = `98${formattedPhoneNumber.slice(1)}`;
    } else if (!formattedPhoneNumber.startsWith("98")) {
      setErrorMessage("لطفاً شماره موبایل را به‌درستی وارد کنید");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "رمز عبور باید شامل حروف کوچک، حروف بزرگ انگلیسی و عدد باشد و حداقل 8 کاراکتر داشته باشد"
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("رمز عبور و تکرار آن همخوانی ندارند");
      return;
    }

    const diet_groups =
      diet === "vegetarian" ? ["diet:vegetarian"] : ["diet:normal"];
    const gender_groups = gender === "M" ? ["gender:M"] : ["gender:F"];

    const userData = {
      first_name: name,
      last_name: lastName,
      phone_number: formattedPhoneNumber,
      password,
      province,
      birthdate: formatBirthdate(birthdate),
      diet_groups,
      gender_groups,
    };

    try {
      const response = await publicAxiosInstance.post(
        "/auth/signup/customer",
        userData
      );

      if (response.status === 201) {
        alert("ثبت نام با موفقیت انجام شد. اکنون وارد شوید!");
        handleLoginClick();
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setErrorMessage("این شماره قبلاً ثبت‌نام کرده است.");
      } else {
        setErrorMessage(
          error.response?.data?.message ||
            "مشکلی پیش آمده، لطفاً دوباره تلاش کنید."
        );
      }
    }
  };

  return (
    <div
      className="signup-container"
      style={{ direction: "rtl", textAlign: "right" }}
    >
      <img
        src={YumziImg}
        alt="Login Illustration"
        style={{ width: "250px", marginBottom: "20px" }}
      />
      <Divider />

      {/* نام و نام خانوادگی */}
      <Box
        sx={{ display: "flex", alignItems: "flex-end", width: "50%" }}
        marginBottom={0.9}
      >
        <PermIdentityIcon sx={{ color: "action.active", mr: 1, mb: 2 }} />
        <TextField
          fullWidth
          type="name"
          label="نام"
          variant="standard"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          InputProps={{ style: { color: "white" } }}
        />
      </Box>

      <Box
        sx={{ display: "flex", alignItems: "flex-end", width: "50%" }}
        marginBottom={0.9}
      >
        <PersonIcon sx={{ color: "action.active", mr: 1, mb: 2 }} />
        <TextField
          fullWidth
          type="name"
          label="نام خانوادگی"
          variant="standard"
          margin="normal"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          InputProps={{ style: { color: "white" } }}
        />
      </Box>

      {/* شماره موبایل */}
      <Box
        sx={{ display: "flex", alignItems: "flex-end", width: "50%" }}
        marginBottom={0.9}
      >
        <PhoneEnabledIcon sx={{ color: "action.active", mr: 1, mb: 2 }} />
        <TextField
          fullWidth
          type="tel"
          label="شماره موبایل"
          variant="standard"
          margin="normal"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          InputProps={{ style: { color: "white" } }}
        />
      </Box>

      {/* رمز عبور */}
      <Box
        sx={{ display: "flex", alignItems: "flex-end", width: "51%" }}
        marginBottom={0.9}
      >
        <KeyIcon sx={{ color: "action.active", mr: 1, mb: 2 }} />
        <FormControl sx={{ m: 1 }} variant="standard" fullWidth>
          <InputLabel htmlFor="standard-adornment-password">رمزعبور</InputLabel>
          <Input
            fullWidth
            id="standard-adornment-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

      <Box sx={{ display: "flex", alignItems: "flex-end", width: "51%" }}>
        <KeyIcon sx={{ color: "action.active", mr: 1, mb: 2 }} />
        <FormControl sx={{ m: 1, mb: 4 }} variant="standard" fullWidth>
          <InputLabel htmlFor="standard-adornment-password">
            تکرار رمزعبور
          </InputLabel>
          <Input
            fullWidth
            id="standard-adornment-password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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

      <Box
        sx={{ display: "flex", alignItems: "flex-end", width: "50%" }}
        marginBottom={3}
        paddingLeft={5}
      >
        <TextField
          fullWidth
          type="date"
          label="تاریخ تولد"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          InputLabelProps={{ shrink: true, sx: { color: "gray" } }}
          InputProps={{ sx: { color: "gray" } }}
          variant="standard"
          required
        />
      </Box>

      {/* استان */}
      <Box
        sx={{ display: "flex", alignItems: "flex-end", width: "50%" }}
        marginBottom={1}
        paddingLeft={5}
      >
        <TextField
          select
          fullWidth
          label="استان"
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          InputProps={{
            sx: {
              color: "white", 
              textAlign: "left", 
            },
          }}
          variant="standard"
          required
        >
          {iranProvinces.map((p) => (
            <MenuItem key={p.en} value={p.en}>
              {p.fa}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* رژیم - Radio */}
      <Box
        sx={{ display: "flex", flexDirection: "column", width: "50%" }}
        marginBottom={0}
        paddingLeft={5}
      >
        <Typography>رژیم</Typography>
        <RadioGroup row value={diet} onChange={(e) => setDiet(e.target.value)}>
          <FormControlLabel
            value="vegetarian"
            control={
              <Radio
                sx={{ color: "white", "&.Mui-checked": { color: "gray" } }}
              />
            }
            label="گیاه‌خوار"
            sx={{ "& .MuiFormControlLabel-label": { color: "gray" } }}
          />
          <FormControlLabel
            value="normal"
            control={
              <Radio
                sx={{ color: "white", "&.Mui-checked": { color: "gray" } }}
              />
            }
            label="بدون رژیم"
            sx={{ "& .MuiFormControlLabel-label": { color: "gray" } }}
          />
        </RadioGroup>
      </Box>

      {/* جنسیت - Radio */}
      <Box
        sx={{ display: "flex", flexDirection: "column", width: "50%" }}
        marginBottom={2}
        paddingLeft={5}
      >
        <Typography>جنسیت</Typography>
        <RadioGroup
          row
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <FormControlLabel
            value="M"
            control={
              <Radio
                sx={{ color: "white", "&.Mui-checked": { color: "gray" } }}
              />
            }
            label="مرد"
            sx={{
              "& .MuiFormControlLabel-label": { color: "gray" },
              display: "flex",
              alignItems: "center",
            }}
          />
          <FormControlLabel
            value="F"
            control={
              <Radio
                sx={{ color: "white", "&.Mui-checked": { color: "gray" } }}
              />
            }
            label="زن"
            sx={{
              "& .MuiFormControlLabel-label": { color: "gray" },
              display: "flex",
              alignItems: "center",
              marginLeft: "15px",
            }}
          />
        </RadioGroup>
      </Box>

      {errorMessage && (
        <Typography style={{ color: "red" }}>{errorMessage}</Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginTop: "20px", width: "150px" }}
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
