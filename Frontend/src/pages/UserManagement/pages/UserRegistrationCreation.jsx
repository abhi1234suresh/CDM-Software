import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Modal,
  Snackbar,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import '../../../styles/Coal_mine_theme.css';

function UserRegistrationPopup({ open, onClose, onSave, userToEdit }) {
  const theme = useTheme();
  const [user, setUser] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    profile: {
      first_name: '',
      last_name: '',
      organization: '',
      designation: '',
      department: '',
      mobile: '',
      address: '',
      security_question: 'What is your favorite color?',
      security_answer: '',
    },
  });
  const [errors, setErrors] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    organization: '',
    designation: '',
    department: '',
    mobile: '',
    address: '',
    security_question: '',
    security_answer: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  useEffect(() => {
    if (open && userToEdit) {
      setUser({
        email: userToEdit.email || '',
        username: userToEdit.username || '',
        password: '',
        confirmPassword: '',
        profile: {
          first_name: userToEdit.profile?.first_name || '',
          last_name: userToEdit.profile?.last_name || '',
          organization: userToEdit.profile?.organization || '',
          designation: userToEdit.profile?.designation || '',
          department: userToEdit.profile?.department || '',
          mobile: userToEdit.profile?.mobile || '',
          address: userToEdit.profile?.address || '',
          security_question: userToEdit.profile?.security_question || 'What is your favorite color?',
          security_answer: userToEdit.profile?.security_answer || '',
        },
      });
      setErrors({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        organization: '',
        designation: '',
        department: '',
        mobile: '',
        address: '',
        security_question: '',
        security_answer: '',
      });
    } else if (open) {
      setUser({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        profile: {
          first_name: '',
          last_name: '',
          organization: '',
          designation: '',
          department: '',
          mobile: '',
          address: '',
          security_question: 'What is your favorite color?',
          security_answer: '',
        },
      });
      setErrors({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        organization: '',
        designation: '',
        department: '',
        mobile: '',
        address: '',
        security_question: '',
        security_answer: '',
      });
    }
  }, [open, userToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in user.profile) {
      setUser({ ...user, profile: { ...user.profile, [name]: value } });
      setErrors({ ...errors, [name]: '' });
    } else {
      setUser({ ...user, [name]: value });
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSave = async () => {
    try {
      await onSave(user);
      setSnackbar({ open: true, message: userToEdit ? 'User updated successfully' : 'User registered successfully', severity: 'success' });
      onClose();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save user', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose();
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: '#1a1a1a',
          borderRadius: '14px',
          width: { xs: '90%', sm: '80%', md: '400px' },
          maxWidth: { xs: '90%', sm: '400px', md: '450px' },
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          transition: 'all 0.3s ease-in-out',
          maxHeight: { xs: '85vh', sm: '80vh' },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            flex: '1 1 auto',
            overflowY: 'auto',
            p: { xs: 1.5, sm: 2, md: 3 },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: theme.palette.text.primary,
              fontWeight: 'bold',
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
            }}
          >
            {userToEdit ? 'Edit User' : 'Register User'}
          </Typography>

          <TextField
            fullWidth
            label="Email ID"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
            sx={{ mb: 2, bgcolor: theme.palette.background.paper, borderRadius: '8px' }}
            size="small"
          />

          <TextField
            fullWidth
            label="Username (Optional)"
            name="username"
            value={user.username}
            onChange={handleInputChange}
            error={!!errors.username}
            helperText={errors.username}
            sx={{ mb: 2, bgcolor: theme.palette.background.paper, borderRadius: '8px' }}
            size="small"
          />

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              mb: 2,
            }}
          >
            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              value={user.profile.first_name}
              onChange={handleInputChange}
              error={!!errors.first_name}
              helperText={errors.first_name}
              sx={{ bgcolor: theme.palette.background.paper, borderRadius: '8px' }}
              size="small"
            />
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={user.profile.last_name}
              onChange={handleInputChange}
              error={!!errors.last_name}
              helperText={errors.last_name}
              sx={{ bgcolor: theme.palette.background.paper, borderRadius: '8px' }}
              size="small"
            />
          </Box>

          {!userToEdit && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={user.password}
                onChange={handleInputChange}
                error={!!errors.password}
                helperText={errors.password}
                sx={{ bgcolor: theme.palette.background.paper, borderRadius: '8px' }}
                size="small"
              />
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={user.confirmPassword}
                onChange={handleInputChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                sx={{ bgcolor: theme.palette.background.paper, borderRadius: '8px' }}
                size="small"
              />
            </Box>
          )}

          <TextField
            fullWidth
            label="Organization"
            name="organization"
            value={user.profile.organization}
            onChange={handleInputChange}
            error={!!errors.organization}
            helperText={errors.organization}
            sx={{ mb: 2, bgcolor: theme.palette.background.paper, borderRadius: '8px' }}
            size="small"
          />

          <TextField
            fullWidth
            label="Designation"
            name="designation"
            value={user.profile.designation}
            onChange={handleInputChange}
            error={!!errors.designation}
            helperText={errors.designation}
            sx={{ mb: 2, bgcolor: theme.palette.background.paper, borderRadius: '8px' }}
            size="small"
          />

          <TextField
            fullWidth
            label="Department"
            name="department"
            value={user.profile.department}
            onChange={handleInputChange}
            error={!!errors.department}
            helperText={errors.department}
            sx={{ mb: 2, bgcolor: theme.palette.background.paper, borderRadius: '8px' }}
            size="small"
          />

          <TextField
            fullWidth
            label="Mobile Number"
            name="mobile"
            value={user.profile.mobile}
            onChange={handleInputChange}
            error={!!errors.mobile}
            helperText={errors.mobile}
            sx={{ mb: 2, bgcolor: theme.palette.background.paper, borderRadius: '8px' }}
            size="small"
          />

          <TextField
            fullWidth
            label="Address"
            name="address"
            value={user.profile.address}
            onChange={handleInputChange}
            error={!!errors.address}
            helperText={errors.address}
            sx={{ mb: 2, bgcolor: theme.palette.background.paper, borderRadius: '8px' }}
            size="small"
          />

          <TextField
            fullWidth
            label="Security Question"
            name="security_question"
            value={user.profile.security_question}
            disabled
            sx={{ mb: 2, bgcolor: theme.palette.background.paper, borderRadius: '8px' }}
            size="small"
          />

          <TextField
            fullWidth
            label="Security Answer"
            name="security_answer"
            value={user.profile.security_answer}
            onChange={handleInputChange}
            error={!!errors.security_answer}
            helperText={errors.security_answer}
            sx={{ mb: 2, bgcolor: theme.palette.background.paper, borderRadius: '8px' }}
            size="small"
          />
        </Box>

        <Box
          sx={{
            flex: '0 0 auto',
            p: { xs: 1.5, sm: 2 },
            borderTop: "none",
            backgroundColor: '#1a1a1a',
            position: 'sticky',
            bottom: -700,
            zIndex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          <Button
            className="btn-modern btn-modern-cancel"
            onClick={onClose}
            sx={{ color: theme.palette.text.secondary }}
          >
            Cancel
          </Button>
          <Button className="btn-modern" onClick={handleSave}>
            {userToEdit ? 'Update' : 'Register'}
          </Button>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
}

export default UserRegistrationPopup;