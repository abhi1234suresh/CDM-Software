import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  Snackbar,
  Alert,
} from '@mui/material';
import { AccountCircle, Lock } from '@mui/icons-material';
import { FaHardHat } from 'react-icons/fa';
import { AuthContext } from '../../../context/AuthContext';
import CDACLogo from '../../../assets/CDAC_emblem.png';
import CMERILogo from '../../../assets/CMERI_emblem.png';
import CoalMineBg from '../../../assets/coal_mine_bg.jpg';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const trimmedIdentifier = identifier.trim();
    const trimmedPassword = password.trim();
    setErrorMessage('');
    setOpenSnackbar(false);

    if (!trimmedIdentifier || !trimmedPassword) {
      setErrorMessage('Please enter both email/username and password.');
      setOpenSnackbar(true);
      setIsSubmitting(false);
      return;
    }

    try {
      await login(trimmedIdentifier, trimmedPassword);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Invalid credentials.';
      setErrorMessage(errorMsg);
      setOpenSnackbar(true);
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage('');
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          backgroundImage: `url(${CoalMineBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
          opacity: 0.6,
        }}
      />

      {/* Description on Left */}
      <Box
        sx={{
          width: '80%',
          maxWidth: 700,
          p: 4,
          mt: -50,
          color: '#f0f0f0',
          position: 'absolute',
          left: 40,
          textAlign: 'left',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 2,
            fontFamily: "'Roboto', sans-serif",
            letterSpacing: '0.5px',
            color: '#ffffff',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
          }}
        >
          Coal Dust Monitoring Software
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#e0e0e0',
            lineHeight: 1.8,
            fontSize: '1.1rem',
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 300,
            textShadow: '0 0 2px rgba(0, 0, 0, 0.3)',
          }}
        >
          
        </Typography>
      </Box>

      {/* Logos */}
      <img src={CDACLogo} alt="CDAC Logo" style={{ position: 'absolute', top: 20, left: 20, height: 80 }} />
      <img src={CMERILogo} alt="CMERI Logo" style={{ position: 'absolute', top: 20, right: 20, height: 80 }} />

      {/* Login Box */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 490,
          maxHeight: 800,
          p: 10,
          borderRadius: '20px',
          backgroundColor: 'rgba(255,255,255, 0.2)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          boxShadow: '0 0 30px rgba(0, 0, 0, 0.2)',
          color: '#f0f0f0',
          border: '1px solid rgba(255,255,255,0.1)',
          position: 'relative',
          right: '-25%',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <FaHardHat size={48} color="#FFFF00" />
          <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
            Sign In
          </Typography>
          <Typography variant="body2" sx={{ color: '#ccc' }}>
            Secure access to coal dust monitoring software
          </Typography>
        </Box>

        <form onSubmit={handleLogin}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Enter email or username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle sx={{ color: '#aaa' }} />
                </InputAdornment>
              ),
              sx: {
                input: { color: '#fff' },
                backgroundColor: 'rgba(255,255,255,0.04)',
                borderRadius: '10px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#888',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#aaa',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#bbb',
                },
              },
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            type="password"
            variant="outlined"
            fullWidth
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#aaa' }} />
                </InputAdornment>
              ),
              sx: {
                input: { color: '#fff' },
                backgroundColor: 'rgba(255,255,255,0.04)',
                borderRadius: '10px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#888',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#aaa',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#bbb',
                },
              },
            }}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            disabled={isSubmitting}
            sx={{
              background: 'linear-gradient(135deg, #37474f, #263238)',
              color: '#ffffff',
              fontWeight: 700,
              py: 1.5,
              fontSize: '1.1rem',
              borderRadius: '16px',
              transition: 'all 0.4s ease-in-out',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)',
              textTransform: 'none',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              '&:hover': {
                background: 'linear-gradient(135deg, #455a64, #37474f)',
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:disabled': {
                background: 'linear-gradient(135deg, #546e7a, #455a64)',
                boxShadow: 'none',
                transform: 'none',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
              '&:active': {
                transform: 'translateY(0)',
                boxShadow: '0 3px 10px rgba(0, 0, 0, 0.4)',
              },
            }}
          >
            {isSubmitting ? 'Logging in...' : 'Sign In'}
          </Button>
        </form>

        <Typography
          sx={{
            color: '#ccc',
            fontSize: '0.9rem',
            textAlign: 'center',
            mt: 2,
          }}
        >
          Forgot password?{' '}
          <span
            style={{ color: '#FFFFFF', cursor: 'pointer' }}
            onClick={() => navigate('/simple-forgot-password')}
          >
            Reset here
          </span>
        </Typography>

        <Typography
          sx={{
            color: '#ccc',
            fontSize: '0.9rem',
            textAlign: 'center',
            mt: 1,
          }}
        >
          Don’t have an account?{' '}
          <span
            style={{ color: '#FFFFFF', cursor: 'pointer' }}
            onClick={() => navigate('/signup')}
          >
            Sign up
          </span>
        </Typography>

        <Typography
          sx={{
            color: '#aaa',
            fontSize: '0.71rem',
            textAlign: 'center',
            mt: 3,
            fontStyle: 'italic',
          }}
        >
          © 2025 Centre for Development of Advanced Computing (C-DAC)
        </Typography>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Login;
