import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import axios from "../../utills/axiosInstance";

const RestaurantReportPage = () => {
  const [filter, setFilter] = useState("today");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `/restaurant/sales-reports?filter=${filter}`
        );
        setData(response.data);
      } catch (err) {
        setError("خطایی در دریافت داده‌ها رخ داده است.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#ADBC9F",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress sx={{ color: "#12372A" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#ADBC9F",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
        }}
      >
        <Box
          sx={{
            bgcolor: "#12372A",
            color: "#ffb3b3",
            p: 2,
            borderRadius: 2,
            textAlign: "center",
            width: { xs: "95%", sm: "70%", md: "80%" },
            boxShadow: 2,
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>{error}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#ADBC9F", py: 4 }}>
      <Container sx={{ width: "80%", maxWidth: "1100px" }}>
        {/* Header */}
        <Box
          sx={{
            backgroundColor: "#12372A",
            padding: 2,
            borderRadius: 2,
            textAlign: "center",
            marginBottom: 2,
            boxShadow: 2,
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: "#FBFADA",
              fontWeight: "bold",
              cursor: "default",
              pointerEvents: "none",
            }}
          >
            گزارش مالی فروشگاه
          </Typography>
        </Box>

        {/* Filter */}
        <Box sx={{ marginBottom: 3, textAlign: "center" }}>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{
              width: 220,
              bgcolor: "#FBFADA",
              color: "#12372A",
              fontWeight: "bold",
              borderRadius: 2,
              boxShadow: 1,
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(18,55,42,0.35)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(18,55,42,0.7)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#12372A",
              },
              ".MuiSvgIcon-root": { color: "#12372A" },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: "#FBFADA",
                  color: "#12372A",
                  borderRadius: 2,
                },
              },
            }}
          >
            <MenuItem value="today">گزارش روزانه</MenuItem>
            <MenuItem value="last_week">گزارش هفتگی</MenuItem>
            <MenuItem value="last_month">گزارش ماهانه</MenuItem>
          </Select>
        </Box>

        {/* List of Sold Items */}
        <Grid container spacing={2}>
          {data?.items?.map((item, index) => (
            <Grid item xs={12} key={index}>
              <Card
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1.2,
                  backgroundColor: "#e8e9d6",
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <img
                  src={`http://127.0.0.1:8000/media/${item.photo}`}
                  alt={item.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    marginRight: "16px",
                  }}
                />

                <CardContent
                  sx={{
                    flex: 1,
                    paddingLeft: "16px",
                    paddingTop: 0,
                    paddingBottom: 0,
                  }}
                >
                  <Typography
                    variant="body1"
                    component="div"
                    sx={{
                      fontWeight: "bold",
                      color: "#12372A",
                      cursor: "default",
                      pointerEvents: "none",
                    }}
                  >
                    {item.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    component="div"
                    sx={{
                      color: "rgba(18,55,42,0.75)",
                      cursor: "default",
                      pointerEvents: "none",
                      mt: 0.5,
                    }}
                  >
                    تعداد فروش: {item.total_count}
                  </Typography>

                  <Typography
                    variant="body2"
                    component="div"
                    sx={{
                      color: "rgba(18,55,42,0.75)",
                      cursor: "default",
                      pointerEvents: "none",
                      mt: 0.2,
                    }}
                  >
                    مجموع قیمت: {Number(item.total_price).toLocaleString()}{" "}
                    هزار تومان
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Total Revenue */}
        <Box
          sx={{
            marginTop: 3,
            backgroundColor: "#12372A",
            padding: 2,
            borderRadius: 2,
            textAlign: "center",
            boxShadow: 2,
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: "#FBFADA",
              fontWeight: "bold",
              cursor: "default",
              pointerEvents: "none",
            }}
          >
            مجموع درآمد:{" "}
            {data?.total_income != null
              ? Number(data.total_income).toLocaleString()
              : "0"}{" "}
            هزار تومان
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default RestaurantReportPage;
