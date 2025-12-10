// src/components/ItemComments.js
import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, Rating } from "@mui/material";
import publicAxiosInstance from "../utills/publicAxiosInstance";

const ItemComments = ({ itemId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await publicAxiosInstance.get(
          `/customer/items/${itemId}/reviews/`
        );
        setComments(
          res.data.map((c) => ({
            id: c.id,
            name: `${c.first_name} ${c.last_name}`,
            date: new Date().toLocaleDateString("fa-IR"),
            rating: c.score,
            comment: c.description,
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchComments();
  }, [itemId]);

  if (comments.length === 0)
    return (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        هنوز نظری ثبت نشده است.
      </Typography>
    );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {comments.map((c) => (
        <Box key={c.id} sx={{ borderBottom: "1px solid #eee", pb: 1 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ bgcolor: "#12372A" }} />
            <Box>
              <Typography variant="subtitle2">{c.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {c.date}
              </Typography>
            </Box>
          </Box>
          <Rating
            value={c.rating}
            readOnly
            precision={0.5}
            sx={{ color: "orange" }}
          />
          <Typography variant="body2" color="text.secondary">
            {c.comment}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ItemComments;
