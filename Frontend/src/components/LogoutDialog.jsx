import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

function LogoutDialog({ open, onConfirm, onCancel }) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="logout-confirm-dialog"
      aria-describedby="logout-confirm-description"
      maxWidth="xs"
      sx={{
        '& .MuiPaper-root': {
          backgroundColor: '#1a1a1a',
          color: theme.palette.text.primary,
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          width: { xs: '90%', sm: '280px' },
          minWidth: '240px',
        },
      }}
    >
      <DialogTitle
        id="logout-confirm-dialog"
        sx={{
          fontSize: { xs: '1rem', sm: '1.2rem' },
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontFamily: "'Roboto', sans-serif",
          textAlign: 'center',
          padding: { xs: '8px 12px', sm: '12px 16px' },
          backgroundColor: '#1a1a1a',
        }}
      >
        Confirm Logout
      </DialogTitle>
      <DialogContent sx={{ padding: { xs: '8px 12px', sm: '8px 16px' } }}>
        <DialogContentText
          id="logout-confirm-description"
          sx={{
            color: theme.palette.text.primary,
            fontSize: { xs: '0.85rem', sm: '0.9rem' },
            textAlign: 'center',
          }}
        >
          Are you sure you want to log out?
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          padding: { xs: '8px 12px', sm: '8px 16px' },
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <Button
          onClick={onCancel}
          className="btn-modern"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: { xs: '0.8rem', sm: '0.85rem' },
            minWidth: { xs: '70px', sm: '80px' },
            maxWidth: '100px',
            padding: '6px 12px',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
          aria-label="Cancel logout"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          className="btn-modern"
          variant="contained"
          sx={{
            backgroundColor: theme.palette.primary.main,
            fontSize: { xs: '0.8rem', sm: '0.85rem' },
            minWidth: { xs: '70px', sm: '80px' },
            maxWidth: '100px',
            padding: '6px 12px',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
          aria-label="Confirm logout"
        >
          Yes, Log Out
        </Button>
      </DialogActions>
    </Dialog>
  );
}

LogoutDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default LogoutDialog;