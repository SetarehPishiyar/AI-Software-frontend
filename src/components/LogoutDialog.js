import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

const LogoutDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>تأیید خروج</DialogTitle>
    <DialogContent>
      <DialogContentText>
        آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>خیر</Button>
      <Button onClick={onConfirm} variant="contained" color="warning">
        بله
      </Button>
    </DialogActions>
  </Dialog>
);

export default LogoutDialog;
