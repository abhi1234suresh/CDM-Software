import { Box, Button, Typography, Modal, Fade, IconButton } from "@mui/material";
import { useEffect } from "react";
import { CheckCircle, Error, Warning, Info, Close } from "@mui/icons-material";

export default function MessageBox({
  open,
  message,
  severity = "info",
  onClose,
  autoHideDuration = null,
  title = null
}) {
  useEffect(() => {
    if (open && autoHideDuration) {
      const timer = setTimeout(onClose, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [open, autoHideDuration, onClose]);

  // Severity colors + icons
  const getSeverityProps = (severity) => {
    switch (severity) {
      case "success":
        return { 
          color: "#4CAF50", 
          iconColor: "#4CAF50",
          bgColor: "rgba(76, 175, 80, 0.1)",
          Icon: CheckCircle 
        };
      case "error":
        return { 
          color: "#F44336", 
          iconColor: "#F44336",
          bgColor: "rgba(244, 67, 54, 0.1)",
          Icon: Error 
        };
      case "warning":
        return { 
          color: "#FFC107", 
          iconColor: "#FFC107",
          bgColor: "rgba(255, 193, 7, 0.1)",
          Icon: Warning 
        };
      case "info":
      default:
        return { 
          color: "#03A9F4", 
          iconColor: "#03A9F4",
          bgColor: "rgba(3, 169, 244, 0.1)",
          Icon: Info 
        };
    }
  };

  const { color, iconColor, bgColor, Icon } = getSeverityProps(severity);

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(0, 0, 0, 0.4)"
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            width: { xs: "90%", sm: "420px", md: "450px" },
            borderRadius: "12px",
            p: "20px 24px",
            backdropFilter: "blur(16px) saturate(180%)",
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px ${color}40`,
            color: "#fff",
            position: "relative",
            overflow: "hidden",
            transform: "translateY(0)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: `0 12px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px ${color}60`
            }
          }}
        >
          {/* Glow overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, ${color}10 0%, transparent 70%)`,
              pointerEvents: "none"
            }}
          />

          {/* Close button */}
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              color: "rgba(255,255,255,0.6)",
              transition: "all 0.2s ease",
              "&:hover": {
                color: "rgba(255,255,255,0.9)",
                background: "rgba(255,255,255,0.1)"
              }
            }}
          >
            <Close fontSize="small" />
          </IconButton>

          {/* Icon + Content */}
          <Box sx={{ display: "flex", gap: 2 }}>
            {/* Icon with background */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: bgColor,
                flexShrink: 0,
                mt: 0.5
              }}
            >
              <Icon sx={{ fontSize: 24, color: iconColor }} />
            </Box>

            {/* Message content */}
            <Box sx={{ flex: 1 }}>
              {title && (
                <Typography
                  variant="h6"
                  sx={{
                    color: "#fff",
                    fontWeight: 600,
                    mb: 0.5,
                    lineHeight: 1.3
                  }}
                >
                  {title}
                </Typography>
              )}
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255,255,255,0.85)",
                  fontWeight: 400,
                  lineHeight: 1.5,
                  fontSize: "0.95rem"
                }}
              >
                {message}
              </Typography>

              {/* OK Button */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  onClick={onClose}
                  variant="outlined"
                  sx={{
                    color: "#fff",
                    borderRadius: "8px",
                    px: 3,
                    py: 0.8,
                    fontWeight: 500,
                    fontSize: "0.85rem",
                    textTransform: "none",
                    border: "1px solid rgba(255,255,255,0.3)",
                    background: "rgba(255, 255, 255, 0.05)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.15)",
                      border: "1px solid rgba(255,255,255,0.5)",
                      boxShadow: `0 0 0 1px ${color}80`
                    }
                  }}
                >
                  OK
                </Button>
              </Box>
            </Box> 
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}