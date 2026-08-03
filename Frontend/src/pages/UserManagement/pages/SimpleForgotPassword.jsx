import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import CoalMineBg from '../../../assets/coal_mine_bg.jpg';
import apiClient from '../../../apiClient';

// Styled components
const Background = styled(Box)({
  height: '100vh',
  width: '100vw',
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${CoalMineBg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const StyledPaper = styled('div')({
  padding: '1rem',
  width: '100%',
  maxWidth: '360px',
  textAlign: 'center',
  borderRadius: '8px',
  background: '#1a1a1a',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
});

const InputLabel = styled(Typography)({
  fontSize: '0.85rem',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  color: '#fff',
  textAlign: 'left',
  marginBottom: '0.2rem',
});

const CustomTextField = styled(TextField)({
  marginBottom: '0.5rem',
  background: '#fff',
  borderRadius: '4px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    padding: '6px 8px',
  },
  '& .MuiOutlinedInput-input': {
    fontSize: '0.9rem',
    color: '#333',
    padding: '6px 0',
  },
});

const SimpleForgotPassword = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setOpenSnackbar(false);

    if (!emailOrUsername || !securityAnswer || !newPassword || !confirmPassword) {
      setMessage('All fields are required.');
      setOpenSnackbar(true);
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await apiClient.post('/reset-password/', {
        identifier: emailOrUsername,
        security_answer: securityAnswer,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setMessage(response.data.message || 'Password reset successfully. Redirecting to login...');
      setOpenSnackbar(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'An error occurred. Please try again.';
      setMessage(errorMsg);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setMessage('');
  };

  return (
    <Background>
      <StyledPaper>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1rem',
            textTransform: 'uppercase',
          }}
        >
          Reset Password
        </Typography>
        <form onSubmit={handleResetPassword} style={{ width: '100%' }}>
          <Box sx={{ mb: 1 }}>
            <InputLabel>Email or Username *</InputLabel>
            <CustomTextField
              variant="outlined"
              fullWidth
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
              placeholder="Enter your email or username"
            />
          </Box>
          <Box sx={{ mb: 1 }}>
            <InputLabel>Security Question: What is your favorite color? *</InputLabel>
            <CustomTextField
              variant="outlined"
              fullWidth
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              required
              placeholder="Enter your answer"
            />
          </Box>
          <Box sx={{ mb: 1 }}>
            <InputLabel>New Password *</InputLabel>
            <CustomTextField
              type="password"
              variant="outlined"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Enter new password"
            />
          </Box>
          <Box sx={{ mb: 1 }}>
            <InputLabel>Confirm Password *</InputLabel>
            <CustomTextField
              type="password"
              variant="outlined"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mb: 1,
              fontWeight: 600,
              padding: '6px',
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              backgroundColor: '#005b9f',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#003f6b',
              },
            }}
          >
            Reset Password
          </Button>
        </form>
        <Typography variant="body2" sx={{ color: '#fff', fontSize: '0.8rem', mt: 1 }}>
          Back to{' '}
          <span
            onClick={() => navigate('/login')}
            style={{
              cursor: 'pointer',
              color: '#ff6200',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            Login
          </span>
        </Typography>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={message.includes('successfully') ? 'success' : 'error'}
            sx={{ width: '100%' }}
          >
            {message}
          </Alert>
        </Snackbar>
      </StyledPaper>
    </Background>
  );
};

export default SimpleForgotPassword;