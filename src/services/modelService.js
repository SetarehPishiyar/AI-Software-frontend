import axios from "axios";

const modelAxios = axios.create({
  baseURL: "/model",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

modelAxios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 @returns {Promise<Array>} 
 */
export async function getModelRecommendations(userId, nRecs = 10) {
  const res = await modelAxios.get(`/recommend/${userId}`, {
    params: { n_recs: nRecs },
  });
  console.log(res.data)
  if (!Array.isArray(res.data)) {
    throw new Error("پاسخ مدل آرایه نیست.");
  }

  return res.data;
}
