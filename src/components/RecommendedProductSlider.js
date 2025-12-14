// import React, { useEffect, useState } from "react";
// import { Box, Typography, CircularProgress } from "@mui/material";
// import ProductSlider from "./ProductSlider";
// import { getUserInfo } from "../services/userService";

// const RecommendedProductSlider = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const fetchRecommended = async () => {
//       try {
//         // چک توکن‌ها
//         const accessToken = localStorage.getItem("access");
//         const refreshToken = localStorage.getItem("refresh");

//         if (!accessToken || !refreshToken) {
//           setIsLoggedIn(false);
//           setLoading(false);
//           return;
//         }

//         setIsLoggedIn(true);

//         // گرفتن اطلاعات کاربر
//         // const userData = await getUserInfo();
//         // console.log(userData)
//         // if (!userData || !userData.user.id) {
//         //   console.warn("کاربر لاگین است ولی userData یا id موجود نیست.");
//         //   setLoading(false);
//         //   return;
//         // }

//         // const userId = userData.user.id;
//         const n = 10;
//         const requestUrl = `/model/recommend/1?n_recs=${n}`;
//         console.log("Sending request to:", requestUrl);

//         // fetch اصلی
//         const response = await fetch(requestUrl);

//         // clone برای debug قبل از parse
//         const responseClone = response.clone();

//         // چاپ اطلاعات اولیه
//         console.log("Response status:", response.status);
//         console.log("Response headers:", [...response.headers]);

//         // parse JSON
//         const data = await response.json();

//         // debug raw text
//         const debugText = await responseClone.text();
//         console.log("Raw response body:", debugText);

//         if (!response.ok) {
//           console.error("خطا در دریافت داده‌ها از مدل");
//           setLoading(false);
//           return;
//         }
//         console.log(data)
//         const recommendedProducts = data.map((item) => ({
//           id: item.item_id,
//           name: item.name,
//           image: item.image_url,
//           price: item.price,
//           state: item.state,
//         }));

//         console.log("Recommended products:", recommendedProducts);

//         setProducts(recommendedProducts);
//       } catch (err) {
//         console.error("خطا در fetch کردن محصولات پیشنهادی:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecommended();
//   }, []);

//   if (loading)
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
//         <CircularProgress />
//       </Box>
//     );

//   if (!isLoggedIn)
//     return (
//       <Typography sx={{ textAlign: "center", mt: 2 }}>
//         برای مشاهده محصولات پیشنهادی لطفاً وارد شوید.
//       </Typography>
//     );

//   if (!products.length)
//     return (
//       <Typography sx={{ textAlign: "center", mt: 2 }}>
//         محصول پیشنهادی موجود نیست.
//       </Typography>
//     );

//   return (
//     <Box sx={{ width: "100%", padding: 2 }}>
//       <Typography variant="h6" sx={{ mb: 2 }}>
//         محصولات پیشنهادی برای شما
//       </Typography>
//       <ProductSlider products={products} />
//     </Box>
//   );
// };

// export default RecommendedProductSlider;

import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import ProductSlider from "./ProductSlider";
import { getUserInfo } from "../services/userService";

const RecommendedProductSlider = () => {
  const [productsRaw, setProductsRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const accessToken = localStorage.getItem("access");
        const refreshToken = localStorage.getItem("refresh");

        if (!accessToken || !refreshToken) {
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }

        setIsLoggedIn(true);

        // نمونه کاربر، userId واقعی از getUserInfo بگیر
        // const userData = await getUserInfo();
        // const userId = userData?.user?.id || 1; // fallback به 1 برای تست
        const n = 10;

        const requestUrl = `/model/recommend/1?n_recs=${n}`;
        console.log("Sending request to:", requestUrl);

        const response = await fetch(requestUrl);
        const rawText = await response.text();

        console.log("Raw response body:", rawText);
        setProductsRaw(rawText); // نمایش بدون parse
      } catch (err) {
        console.error("خطا در fetch کردن محصولات پیشنهادی:", err);
        setProductsRaw(`خطا: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <CircularProgress />
      </Box>
    );

  if (!isLoggedIn)
    return (
      <Typography sx={{ textAlign: "center", mt: 2 }}>
        برای مشاهده محصولات پیشنهادی لطفاً وارد شوید.
      </Typography>
    );

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        پاسخ خام مدل:
      </Typography>
      <Box
        sx={{
          p: 2,
          backgroundColor: "#f0f0f0",
          borderRadius: 2,
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {productsRaw || "پاسخی دریافت نشده است."}
      </Box>
    </Box>
  );
};

export default RecommendedProductSlider;
