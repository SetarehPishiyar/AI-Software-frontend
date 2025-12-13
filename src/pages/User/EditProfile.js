import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from "@mui/material";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../../services/userService";
import axiosInstance from "../../utills/axiosInstance";

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

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [province, setProvince] = useState("");
  const [diet, setDiet] = useState("normal");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("M");

  const [address, setAddress] = useState();
  const [Department, setDepartment] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: 35.6892, lng: 51.389 });
  const [mapMarker, setMapMarker] = useState({ lat: 35.6892, lng: 51.389 });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const data = await getUserInfo();
      if (!data) {
        navigate("/login");
        return;
      }
      setUser(data);
      setName(data.user?.first_name || "");
      setFamilyName(data.user?.last_name || "");
      setProvince(data.province || "");
      setDiet(data.diet || "normal");
      setBirthdate(data.birthdate ? data.birthdate.replace(/\//g, "-") : "");
      setGender(data.gender || "M");

      const addrParts = data.address?.split("@") || [];
      setAddress(addrParts[0] || "آدرس");
      setDepartment(addrParts[1] || "");

      setMapCenter({
        lat: parseFloat(data.latitude) || 35.6892,
        lng: parseFloat(data.longitude) || 51.389,
      });
      setMapMarker({
        lat: parseFloat(data.latitude) || 35.6892,
        lng: parseFloat(data.longitude) || 51.389,
      });
      setLoading(false);
    };
    fetchUser();
  }, [navigate]);

  const handleFieldChange = (setter) => (e) => setter(e.target.value);
  const formatBirthdate = (dateStr) => dateStr.replace(/-/g, "/");

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setMapCenter({ lat: latitude, lng: longitude });
          setMapMarker({ lat: latitude, lng: longitude });
          fetchAddress(latitude, longitude);
        },
        () => alert("دسترسی به موقعیت مکانی ممکن نیست.")
      );
    } else {
      alert("مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند.");
    }
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&language=fa`
      );
      const data = await res.json();
      if (data?.address) {
        const road = data.address.road || "";
        const neighbourhood = data.address.neighbourhood || "";
        const suburb = data.address.suburb || "";
        const city = data.address.city || "";
        const cityDistrict = data.address.city_district || "";
        const state = data.address.state || "";
        const fullAddress = `${neighbourhood || suburb || ""} ${road || ""} ${
          cityDistrict || city || ""
        } ${state || ""}`;
        setAddress(fullAddress.trim());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMapClick = ({ lat, lng }) => {
    setMapCenter({ lat, lng });
    setMapMarker({ lat, lng });
    fetchAddress(lat, lng);
  };

  const handleSave = async () => {
    setErrorMessage("");
    if (!province || !diet || !birthdate) {
      setErrorMessage("لطفاً همه فیلدهای قابل ویرایش را پر کنید");
      return;
    }

    try {
      const userObject = {
        user: { first_name: name, last_name: familyName },
        address: address + "@" + Department,
        longitude: mapMarker.lng.toFixed(6).toString(),
        latitude: mapMarker.lat.toFixed(6).toString(),
        province,
        birthdate: formatBirthdate(birthdate),
        diet_groups:
          diet === "vegetarian" ? ["diet:vegetarian"] : ["diet:normal"],
        gender_groups: [gender === "M" ? "gender:M" : "gender:F"],
      };

      await axiosInstance.patch("/customer/profile", userObject, {
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });

      alert("اطلاعات با موفقیت ذخیره شد.");
      navigate("/customer/profile");
    } catch (error) {
      console.error(error);
      setErrorMessage("خطا در ذخیره اطلاعات.");
    }
  };

  if (loading)
    return <Box sx={{ textAlign: "center", mt: 5 }}>در حال بارگذاری...</Box>;

  return (
    <Box
      sx={{ width: "100%", height: "auto", pt: 12, px: 2, bgcolor: "#ADBC9F" }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#12372A",
          p: 2,
          position: "fixed",
          top: 0,
          width: "100%",
          height: 90,
          textAlign: "center",
          zIndex: 1000,
        }}
      >
        <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>
          ویرایش اطلاعات
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "80%",
          mx: "auto",
        }}
      >
        {/* نام و نام خانوادگی */}
        <TextField
          value={name}
          placeholder="نام"
          variant="outlined"
          fullWidth
          sx={{
            bgcolor: "#12372A",
            borderRadius: 1,
            px: 1,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { border: "none" },
            },
            input: { color: "white", px: 1 },
          }}
          onChange={handleFieldChange(setName)}
        />
        <TextField
          value={familyName}
          placeholder="نام خانوادگی"
          variant="outlined"
          fullWidth
          sx={{
            bgcolor: "#12372A",
            borderRadius: 1,
            px: 1,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { border: "none" },
            },
            input: { color: "white", px: 1 },
          }}
          onChange={handleFieldChange(setFamilyName)}
        />

        <TextField
          type="date"
          label="تاریخ تولد"
          value={birthdate}
          onChange={handleFieldChange(setBirthdate)}
          InputLabelProps={{ shrink: true, sx: { color: "white", px: 1 } }}
          variant="outlined"
          sx={{
            bgcolor: "#12372A",
            borderRadius: 1,
            px: 1,
            input: { color: "white", px: 1 },
            "& .MuiOutlinedInput-root fieldset": { border: "none" },
          }}
        />

        <TextField
          select
          label="استان"
          value={province}
          onChange={handleFieldChange(setProvince)}
          variant="outlined"
          sx={{
            bgcolor: "#12372A",
            borderRadius: 1,
            px: 1,
            input: { color: "white", px: 1 },
            "& .MuiOutlinedInput-root fieldset": { border: "none" },
          }}
        >
          {iranProvinces.map((p) => (
            <MenuItem key={p.en} value={p.en}>
              {p.fa}
            </MenuItem>
          ))}
        </TextField>

        {/* رژیم */}
        <Typography sx={{ color: "white", mt: 1 }}>رژیم</Typography>
        <RadioGroup row value={diet} onChange={handleFieldChange(setDiet)}>
          <FormControlLabel
            value="vegetarian"
            control={
              <Radio
                sx={{ color: "white", "&.Mui-checked": { color: "white" } }}
              />
            }
            label="گیاه‌خوار"
          />
          <FormControlLabel
            value="normal"
            control={
              <Radio
                sx={{ color: "white", "&.Mui-checked": { color: "white" } }}
              />
            }
            label="بدون رژیم"
          />
        </RadioGroup>

        {/* جنسیت غیرقابل تغییر */}
        <RadioGroup row value={gender}>
          <FormControlLabel
            value="M"
            control={<Radio disabled sx={{ color: "white" }} />}
            label="مرد"
          />
          <FormControlLabel
            value="F"
            control={<Radio disabled sx={{ color: "white" }} />}
            label="زن"
          />
        </RadioGroup>

        <Divider sx={{ bgcolor: "white", my: 2 }} />

        {/* نقشه */}
        <Box sx={{ height: 400, borderRadius: 1, overflow: "hidden" }}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyD5AZ9092BIIq6gW9SWqdRJ9MBRgTLHLPY",
            }}
            center={mapCenter}
            zoom={14}
            onClick={({ lat, lng }) => handleMapClick({ lat, lng })}
          >
            <div
              style={{
                color: "red",
                fontSize: 24,
                transform: "translate(-50%, -50%)",
              }}
            >
              <FaMapMarkerAlt />
            </div>
          </GoogleMapReact>
        </Box>

        <Button
          sx={{
            bgcolor: "#ADBC9F",
            color: "white",
            fontWeight: "bold",
            borderRadius: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={handleGetCurrentLocation}
        >
          <FaMapMarkerAlt
            style={{ color: "black", marginRight: 5, fontSize: 25 }}
          />
          دریافت موقعیت فعلی
        </Button>

        <TextField
          value={address}
          placeholder="آدرس"
          variant="outlined"
          fullWidth
          disabled
          sx={{
            bgcolor: "#12372A",
            borderRadius: 1,
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "white",
            },
          }}
        />

        <TextField
          value={Department}
          placeholder="پلاک و واحد"
          variant="outlined"
          fullWidth
          sx={{
            bgcolor: "#12372A",
            borderRadius: 1,
            input: { color: "white" },
          }}
          onChange={handleFieldChange(setDepartment)}
        />

        {errorMessage && (
          <Typography sx={{ color: "red" }}>{errorMessage}</Typography>
        )}

        <Button
          variant="contained"
          sx={{
            bgcolor: "#12372A !important",
            color: "white !important",
            fontWeight: "bold",
            p: 1,
            borderRadius: 1,
          }}
          onClick={handleSave}
        >
          ذخیره تغییرات
        </Button>
      </Box>
    </Box>
  );
};

export default EditProfile;
