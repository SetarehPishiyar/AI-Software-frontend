import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getUserInfo, logout } from "../../services/userService";
import axiosInstance from "../../utills/axiosInstance";

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [address, setAddress] = useState("آدرس");
  const [Department, setDepartment] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: 35.6892, lng: 51.389 });
  const [mapMarker, setMapMarker] = useState({ lat: 35.6892, lng: 51.389 });

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

  const handleSave = async () => {
    try {
      const userObject = {
        user: { first_name: name, last_name: familyName },
        address: address + "@" + Department,
        longitude: mapMarker.lng.toFixed(6).toString(),
        latitude: mapMarker.lat.toFixed(6).toString(),
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
      if (error.response) {
        console.error("Server Response:", error.response.data);
      } else {
        console.error("Error saving profile data:", error);
      }
      alert("خطا در ذخیره اطلاعات.");
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
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
    } else {
      alert("مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند.");
    }
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&language=fa`
      );
      const data = await response.json();
      if (data && data.address) {
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

  if (loading)
    return <Box sx={{ textAlign: "center", mt: 5 }}>در حال بارگذاری...</Box>;

  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        paddingTop: "120px",
        paddingX: 2,
        bgcolor: "#ADBC9F",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#12372A",
          padding: 2,
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

      {/* Profile Form */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "80%",
          mx: "auto",
        }}
      >
        <TextField
          InputProps={{
            sx: {
              color: "white",
              "& input::placeholder": { color: "white", opacity: 1 },
            },
          }}
          value={name}
          placeholder="نام"
          variant="outlined"
          fullWidth
          sx={{ bgcolor: "#12372A", borderRadius: 1 }}
          onChange={handleFieldChange(setName)}
        />

        <TextField
          InputProps={{
            sx: {
              color: "white",
              "& input::placeholder": { color: "white", opacity: 1 },
            },
          }}
          value={familyName}
          placeholder="نام خانوادگی"
          variant="outlined"
          fullWidth
          sx={{ bgcolor: "#12372A", borderRadius: 1 }}
          onChange={handleFieldChange(setFamilyName)}
        />

        <Box sx={{ height: 400, borderRadius: 1, overflow: "hidden", mb: 1 }}>
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
          InputProps={{
            sx: {
              color: "white",
              "& input::placeholder": { color: "white", opacity: 1 },
            },
          }}
          value={Department}
          placeholder="پلاک و واحد"
          variant="outlined"
          fullWidth
          sx={{ bgcolor: "#12372A", borderRadius: 1 }}
          onChange={handleFieldChange(setDepartment)}
        />

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
          تایید
        </Button>
      </Box>
    </Box>
  );
};

export default EditProfile;
