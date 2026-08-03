/*
 * Copyright (C) 2025 CDAC-Trivandrum
 *
 * File name            : DeleteConfirmationDialog.jsx
 * Version              : 1.0.5
 * Project code         : TBD
 * Project Name         : Coal Dust Monitoring Software
 * ModuleName           : DeleteConfirmationDialog
 * Description          : Reusable modal dialog for confirming actions with default admin credentials. Uses grey border instead of orange and keeps dark theme.
 * Author               : TBD
 * Created on           : July 02, 2025
 * Modified on          : July 02, 2025
 */

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  useTheme,
} from "@mui/material";
import PropTypes from "prop-types";

function DeleteConfirmationDialog({
  open,
  onClose,
  onConfirm,
  message = "Are you sure you want to perform this action?",
  setSnackbar,
}) {
  const theme = useTheme();

  // Initialize with default credentials
  const [credentials, setCredentials] = useState({
    username: "admin",
    password: "admin123",
  });
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (credentials.username !== "admin" || credentials.password !== "admin123") {
      setSnackbar({
        open: true,
        message: "Invalid username or password.",
        severity: "error",
      });
      setCredentials({ username: "admin", password: "admin123" });
      return;
    }

    setLoading(true);
    try {
      await onConfirm();
      setCredentials({ username: "admin", password: "admin123" });
      onClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Action failed: ${error.message}`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCredentials({ username: "admin", password: "admin123" });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={() => {}} // Disable backdrop click
      disableEscapeKeyDown
      maxWidth="xs"
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: "#1a1a1a",
          color: theme.palette.text.primary,
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          width: { xs: "90%", sm: "280px" },
          minWidth: "240px",
        },
      }}
    >
      <DialogTitle
        id="confirm-dialog"
        sx={{
          fontSize: { xs: "1rem", sm: "1.2rem" },
          fontWeight: "bold",
          textTransform: "uppercase",
          fontFamily: "'Roboto', sans-serif",
          textAlign: "center",
          padding: { xs: "8px 12px", sm: "12px 16px" },
          backgroundColor: "#1a1a1a",
        }}
      >
        Confirm Action
      </DialogTitle>
      <DialogContent sx={{ padding: { xs: "8px 12px", sm: "8px 16px" } }}>
        <DialogContentText
          sx={{
            color: theme.palette.text.primary,
            fontSize: { xs: "0.85rem", sm: "0.9rem" },
            textAlign: "center",
            mb: 2,
          }}
        >
          {message}
        </DialogContentText>
        <TextField
          label="Username"
          value={credentials.username}
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
          fullWidth
          disabled={loading}
          sx={{
            mb: 2,
            "& .MuiInputBase-input": { color: theme.palette.text.primary },
            "& .MuiInputLabel-root": { color: theme.palette.text.secondary },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: theme.palette.grey[600] },
              "&:hover fieldset": { borderColor: theme.palette.grey[500] },
              "&.Mui-focused fieldset": { borderColor: theme.palette.grey[500] },
            },
          }}
        />
        <TextField
          label="Password"
          type="password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          fullWidth
          disabled={loading}
          sx={{
            "& .MuiInputBase-input": { color: theme.palette.text.primary },
            "& .MuiInputLabel-root": { color: theme.palette.text.secondary },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: theme.palette.grey[600] },
              "&:hover fieldset": { borderColor: theme.palette.grey[500] },
              "&.Mui-focused fieldset": { borderColor: theme.palette.grey[500] },
            },
          }}
        />
      </DialogContent>
      <DialogActions
        sx={{
          padding: { xs: "8px 12px", sm: "8px 16px" },
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <Button
          onClick={handleCancel}
          className="btn-modern btn-modern-cancel"
          disabled={loading}
          sx={{
            color: theme.palette.text.secondary,
            fontSize: { xs: "0.8rem", sm: "0.85rem" },
            minWidth: { xs: "70px", sm: "80px" },
            maxWidth: "100px",
            padding: "6px 12px",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
          aria-label="Cancel action"
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          className="btn-modern"
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: theme.palette.primary.main,
            fontSize: { xs: "0.8rem", sm: "0.85rem" },
            minWidth: { xs: "70px", sm: "80px" },
            maxWidth: "100px",
            padding: "6px 12px",
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
          aria-label="Confirm action"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DeleteConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  message: PropTypes.string,
  setSnackbar: PropTypes.func.isRequired,
};

export default DeleteConfirmationDialog;
