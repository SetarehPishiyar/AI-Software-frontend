import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import axiosInstance from "../../utills/axiosInstance";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import { FaMapMarkerAlt } from "react-icons/fa";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useNavigate, useParams } from "react-router-dom";
import { format, parse } from "date-fns";

const EditProfile = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryCost, setDeliveryCost] = useState("");
  const [description, setDescription] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [province, setProvince] = useState("");
  const [openingTime, setOpeningTime] = useState(null);
  const [closingTime, setClosingTime] = useState(null);
  const [logo, setLogo] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 35.6892, lng: 51.389 });
  const [mapMarker, setMapMarker] = useState({ lat: 35.6892, lng: 51.389 });
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await axiosInstance.get(`/restaurant/profiles/me`);
      const data = response.data;

      if (data) {
        console.log(data)
        setName(data.name || "");
        setAddress(data.address || "");
        setDeliveryCost(data.delivery_price || "");
        setDescription(data.description || "");
        setBusinessType(data.business_type || "");
        setProvince(data.city_name || "");
        const opening = parse(data.open_hour, "HH:mm:ss", new Date());
        const closing = parse(data.close_hour, "HH:mm:ss", new Date());
        setOpeningTime(opening);
        setClosingTime(closing);

        if (data.latitude && data.longitude) {
          setMapCenter({
            lat: parseFloat(data.latitude),
            lng: parseFloat(data.longitude),
          });
          setMapMarker({
            lat: parseFloat(data.latitude),
            lng: parseFloat(data.longitude),
          });
        }

        if (data.photo) setLogo(data.photo);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <Typography>در حال بارگذاری...</Typography>;
  }

  const handleFieldChange = (setter) => (e) => setter(e.target.value);

  const handleSave = async () => {
    try {
      const formattedOpeningTime =
        openingTime instanceof Date ? format(openingTime, "HH:mm:ss") : null;
      const formattedClosingTime =
        closingTime instanceof Date ? format(closingTime, "HH:mm:ss") : null;

      const formData = new FormData();
      formData.append("name", name);
      formData.append("address", address);
      formData.append("delivery_price", deliveryCost);
      formData.append("description", description);
      formData.append("business_type", businessType);
      formData.append("open_hour", formattedOpeningTime);
      formData.append("close_hour", formattedClosingTime);
      formData.append("latitude", mapMarker.lat.toFixed(6));
      formData.append("longitude", mapMarker.lng.toFixed(6));
      formData.append("city_name", province);

      if (logo instanceof File) formData.append("photo", logo);

      await axiosInstance.put(`/restaurant/profiles/me`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("اطلاعات با موفقیت ذخیره شد.");
      navigate(`/restaurant/${id}/profile`);
    } catch (error) {
      console.error("Error saving profile data:", error);
      alert("خطا در ذخیره اطلاعات.");
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; 

    if (file.size > maxSize) {
      alert("حجم فایل نباید بیشتر از 2 مگابایت باشد.");
      e.target.value = null; 
      return;
    }

    setLogo(file);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter({ lat: latitude, lng: longitude });
        setMapMarker({ lat: latitude, lng: longitude });
        fetchAddress(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("دسترسی به موقعیت مکانی ممکن نیست.");
      }
    );
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&language=fa`
      );
      const data = await response.json();
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
      console.error("Error fetching address:", error);
    }
  };

  const handleMapClick = ({ lat, lng }) => {
    setMapCenter({ lat, lng });
    setMapMarker({ lat, lng });
    fetchAddress(lat, lng);
  };

  return (
    <Box
      style={{
        width: "100%",
        margin: "0 auto",
        paddingTop: "120px",
        paddingLeft: "15px",
        paddingRight: "15px",
        backgroundColor: "#ADBC9F",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <Box
        style={{
          backgroundColor: "#12372A",
          padding: "15px",
          position: "fixed",
          top: 0,
          width: "100%",
          height: 90,
          textAlign: "center",
          zIndex: 1000,
        }}
      >
        <Typography variant="h4" style={{ color: "white", fontWeight: "bold" }}>
          ویرایش اطلاعات
        </Typography>
      </Box>

      {/* Form */}
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "80%",
        }}
      >
        {/* Business Type */}
        <FormControl
          fullWidth
          style={{ backgroundColor: "#12372A", borderRadius: "8px" }}
        >
          <InputLabel sx={{ color: "white" }}>نوع کسب و کار</InputLabel>
          <Select
            value={businessType}
            onChange={handleFieldChange(setBusinessType)}
            style={{ color: "white" }}
            label="نوع رستوران "
          >
            <MenuItem value="Iranian">ایرانی</MenuItem>
            <MenuItem value="FastFood">فست فود</MenuItem>
            <MenuItem value="Italian">ایتالیایی</MenuItem>
            <MenuItem value="Asian">آسیایی</MenuItem>
            <MenuItem value="Mexican">مکزیکی</MenuItem>
          </Select>
        </FormControl>

        {/* Store Name */}
        <TextField
          value={name}
          placeholder="نام فروشگاه"
          variant="outlined"
          fullWidth
          onChange={handleFieldChange(setName)}
          style={{ backgroundColor: "#12372A", borderRadius: "8px" }}
          InputProps={{ sx: { color: "white" } }}
        />

        <FormControl
          fullWidth
          style={{
            backgroundColor: "#12372A",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
        >
          <InputLabel sx={{ color: "white" }}>استان</InputLabel>
          <Select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            style={{ color: "white" }}
            label="استان"
          >
            {iranProvinces.map((p) => (
              <MenuItem key={p.en} value={p.en}>
                {p.fa}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Logo Upload */}
        <Box>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            style={{ display: "none" }}
            id="logo-upload"
          />
          <label htmlFor="logo-upload">
            <Button
              variant="contained"
              component="span"
              fullWidth
              style={{
                backgroundColor: "#12372A",
                color: "white",
                fontWeight: "bold",
              }}
            >
              بارگذاری لوگو
            </Button>
          </label>
          {logo && typeof logo === "string" ? (
            <img
              src={`http://localhost:8000${logo}`}
              alt="Logo preview"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/100";
              }}
              style={{
                marginTop: "10px",
                width: "100px",
                height: "100px",
                objectFit: "cover",
              }}
            />
          ) : (
            logo && (
              <img
                src={URL.createObjectURL(logo)}
                alt="Logo preview"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/100";
                }}
                style={{
                  marginTop: "10px",
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                }}
              />
            )
          )}
        </Box>

        {/* Time Pickers */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label="ساعت بازگشایی"
                value={openingTime}
                onChange={(time) => setOpeningTime(time)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    style={{
                      backgroundColor: "#12372A",
                      borderRadius: "8px",
                      color: "white",
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label="ساعت تعطیلی"
                value={closingTime}
                onChange={(time) => setClosingTime(time)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    style={{
                      backgroundColor: "#12372A",
                      borderRadius: "8px",
                      color: "white",
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>

        {/* Google Map */}
        <Box
          style={{
            height: "400px",
            borderRadius: "8px",
            overflow: "hidden",
            marginBottom: "10px",
            position: "relative",
          }}
        >
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyD5AZ9092BIIq6gW9SWqdRJ9MBRgTLHLPY",
            }}
            center={mapCenter}
            zoom={14}
            onClick={handleMapClick}
          >
            <div
              style={{
                color: "red",
                fontSize: "24px",
                transform: "translate(-50%, -50%)",
              }}
            >
              <FaMapMarkerAlt />
            </div>
          </GoogleMapReact>
        </Box>

        {/* Current Location Button */}
        <Button
          style={{
            backgroundColor: "#ADBC9F",
            color: "white",
            fontWeight: "bold",
            marginTop: "5px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={handleGetCurrentLocation}
        >
          <FaMapMarkerAlt
            style={{ color: "black", marginRight: "5px", fontSize: "25px" }}
          />
        </Button>

        {/* Address */}
        <TextField
          value={address}
          placeholder="آدرس"
          variant="outlined"
          fullWidth
          disabled
          style={{
            backgroundColor: "#12372A",
            borderRadius: "8px",
            color: "white",
          }}
          InputProps={{
            sx: {
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "white !important",
              },
            },
          }}
        />

        {/* Description */}
        <TextField
          InputProps={{ sx: { color: "white" } }}
          value={description}
          placeholder="توضیحات فروشگاه"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          style={{
            backgroundColor: "#12372A",
            borderRadius: "8px",
            color: "white",
          }}
          onChange={handleFieldChange(setDescription)}
        />

        {/* Delivery Cost */}
        <TextField
          InputProps={{ sx: { color: "white" } }}
          value={Math.floor(deliveryCost)}
          placeholder="هزینه پیک (به تومان)"
          variant="outlined"
          fullWidth
          style={{
            backgroundColor: "#12372A",
            borderRadius: "8px",
            color: "white",
          }}
          onChange={handleFieldChange(setDeliveryCost)}
        />

        {/* Save Button */}
        <Button
          variant="contained"
          style={{
            backgroundColor: "#12372A",
            color: "white",
            fontWeight: "bold",
            padding: "10px",
            borderRadius: "8px",
            textAlign: "center",
          }}
          onClick={handleSave}
        >
          تایید
        </Button>
      </Box>
    </Box>
  );
};

export default EditProfile;
