import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Modal,
  IconButton,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import { AuthContext } from '../../../context/AuthContext';
import '../../../styles/Coal_mine_theme.css';

function UserTypeCreationPopup({ open, onClose, userId, username, onSave }) {
  const theme = useTheme();
  const { isAuthenticated } = useContext(AuthContext);
  const [newUser, setNewUser] = useState({
    project: '',
    email: '',
    first_name: '',
    last_name: '',
    mobile: '',
    organization: '',
    user_type: '',
    password: '',
    confirmPassword: '',
    securityAnswer: '',
  });
  const [errors, setErrors] = useState({
    project: '',
    email: '',
    first_name: '',
    last_name: '',
    mobile: '',
    organization: '',
    user_type: '',
    password: '',
    confirmPassword: '',
  });
  const [projects] = useState([
    { id: '1', name: 'Project Alpha' },
    { id: '2', name: 'Project Beta' },
    { id: '3', name: 'Project Gamma' },
  ]);
  const [availableUserTypes, setAvailableUserTypes] = useState([
    { id: '1', name: 'Admin' },
    { id: '2', name: 'Editor' },
    { id: '3', name: 'Viewer' },
  ]);
  const [userTypeModalOpen, setUserTypeModalOpen] = useState(false);
  const [newUserType, setNewUserType] = useState('');
  const [userTypeToDelete, setUserTypeToDelete] = useState('');

  useEffect(() => {
    if (open && (userId || username) && isAuthenticated) {
      setNewUser({
        project: '1',
        email: username || 'example@domain.com',
        first_name: 'John',
        last_name: 'Doe',
        mobile: '1234567890',
        organization: 'Sample Org',
        user_type: '1',
        password: '',
        confirmPassword: '',
        securityAnswer: 'unset',
      });
    } else if (open && !userId && !username) {
      setNewUser({
        project: '',
        email: '',
        first_name: '',
        last_name: '',
        mobile: '',
        organization: '',
        user_type: availableUserTypes.length > 0 ? availableUserTypes[0].id.toString() : '',
        password: '',
        confirmPassword: '',
        securityAnswer: '',
      });
    }
  }, [open, userId, username, isAuthenticated, availableUserTypes]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      project: '',
      email: '',
      first_name: '',
      last_name: '',
      mobile: '',
      organization: '',
      user_type: '',
      password: '',
      confirmPassword: '',
    };

    if (!newUser.project) {
      newErrors.project = 'Project is required';
      isValid = false;
    }
    if (!newUser.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      newErrors.email = 'Valid email is required';
      isValid = false;
    }
    if (!newUser.first_name.trim()) {
      newErrors.first_name = 'First name is required';
      isValid = false;
    }
    if (!newUser.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
      isValid = false;
    }
    if (!newUser.mobile.match(/^\d{10}$/)) {
      newErrors.mobile = 'Valid 10-digit mobile number is required';
      isValid = false;
    }
    if (!newUser.organization.trim()) {
      newErrors.organization = 'Organization is required';
      isValid = false;
    }
    if (!newUser.user_type) {
      newErrors.user_type = 'User type is required';
      isValid = false;
    }
    if (!userId && !newUser.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }
    if (!userId && newUser.password !== newUser.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddUserType = () => {
    if (newUserType.trim()) {
      const newType = { id: (availableUserTypes.length + 1).toString(), name: newUserType.trim() };
      setAvailableUserTypes([...availableUserTypes, newType]);
      setNewUser({ ...newUser, user_type: newType.id.toString() });
      setNewUserType('');
      setUserTypeModalOpen(false);
    }
  };

  const handleDeleteUserType = () => {
    if (userTypeToDelete) {
      const updatedUserTypes = availableUserTypes.filter((type) => type.id.toString() !== userTypeToDelete);
      setAvailableUserTypes(updatedUserTypes);
      if (newUser.user_type === userTypeToDelete) {
        setNewUser({ ...newUser, user_type: updatedUserTypes[0]?.id.toString() || '' });
      }
      setUserTypeToDelete('');
      setUserTypeModalOpen(false);
    }
  };

  const handleSave = () => {
    if (!validateForm()) return;
    const userData = {
      email: newUser.email,
      username: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      mobile: newUser.mobile,
      organization: newUser.organization,
      user_type: newUser.user_type,
      project: newUser.project,
      password: newUser.password || undefined,
      security_answer: newUser.securityAnswer || 'unset',
    };
    console.log('Saving user data:', userData);
    onSave(userData);
    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') onClose();
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: '#1a1a1a',
            p: { xs: 1.5, sm: 2, md: 3 },
            borderRadius: '14px',
            width: { xs: '90%', sm: '80%', md: '400px' },
            maxWidth: { xs: '90%', sm: '400px', md: '450px' },
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            transition: 'all 0.3s ease-in-out',
            maxHeight: { xs: '85vh', sm: '80vh' },
            overflowY: 'auto',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: theme.palette.text.primary,
              fontWeight: 'bold',
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              textAlign: 'center',
            }}
          >
            {userId || username ? 'Edit User' : 'Add New User'}
          </Typography>
          <TextField
            select
            fullWidth
            label="Project"
            name="project"
            value={newUser.project}
            onChange={handleInputChange}
            error={!!errors.project}
            helperText={errors.project}
            sx={{ mb: 2, bgcolor: theme.palette.background.paper, borderRadius: '8px' }}
            size="small"
          >
            {projects.length > 0 ? (
              projects.map((project) => (
                <MenuItem key={project.id} value={project.id.toString()}>
                  {project.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No projects available</MenuItem>
            )}
          </TextField>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
            sx={{ mb: 2, bgcolor: theme.palette.background.paper, borderRadius: '8px' }}
            size="small"
          />
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 2 }, mb: 2 }}>
            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              value={newUser.first_name}
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
              value={newUser.last_name}
              onChange={handleInputChange}
              error={!!errors.last_name}
              helperText={errors.last_name}
              sx={{ bgcolor: theme.palette.background.paper, borderRadius: '8px' }}
              size="small"
            />
          </Box>
          <TextField
            fullWidth
            label="Mobile Number"
            name="mobile"
            value={newUser.mobile}
            onChange={handleInputChange}
            error={!!errors.mobile}
            helperText={errors.mobile}
            sx={{ mb: 2, bgcolor: theme.palette.background.paper, borderRadius: '8px' }}
            size="small"
          />
          <TextField
            fullWidth
            label="Organization"
            name="organization"
            value={newUser.organization}
            onChange={handleInputChange}
            error={!!errors.organization}
            helperText={errors.organization}
            sx={{ mb: 2, bgcolor: theme.palette.background.paper, borderRadius: '8px' }}
            size="small"
          />
          {!userId && (
            <>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={newUser.password}
                onChange={handleInputChange}
                error={!!errors.password}
                helperText={errors.password}
                sx={{ mb: 2, bgcolor: theme.palette.background.paper, borderRadius: '8px' }}
                size="small"
              />
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={newUser.confirmPassword}
                onChange={handleInputChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                sx={{ mb: 2, bgcolor: theme.palette.background.paper, borderRadius: '8px' }}
                size="small"
              />
            </>
          )}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.text.primary,
                fontSize: { xs: '0.9rem', sm: '1rem' },
                mb: 2,
                borderBottom: '1px solid #ccc',
                paddingBottom: '4px',
              }}
            >
              User Category
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <FormControl fullWidth sx={{ bgcolor: theme.palette.background.paper, borderRadius: '8px' }}>
                <InputLabel id="user-type-label">User Type</InputLabel>
                <Select
                  labelId="user-type-label"
                  name="user_type"
                  value={newUser.user_type}
                  onChange={handleInputChange}
                  label="User Type"
                  error={!!errors.user_type}
                  sx={{ '& .MuiInputBase-input': { fontSize: { xs: '0.8rem', sm: '0.875rem' } } }}
                  size="small"
                >
                  {availableUserTypes.length > 0 ? (
                    availableUserTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No user types available</MenuItem>
                  )}
                </Select>
                {errors.user_type && (
                  <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                    {errors.user_type}
                  </Typography>
                )}
              </FormControl>
              <IconButton onClick={() => setUserTypeModalOpen(true)} sx={{ color: theme.palette.primary.main }}>
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: { xs: 1, sm: 1.5 } }}>
            <Button
              className="btn-modern btn-modern-cancel"
              onClick={onClose}
              sx={{ color: theme.palette.text.secondary, fontSize: { xs: '0.75rem', sm: '0.875rem' }, px: { xs: 1.5, sm: 2 } }}
            >
              Cancel
            </Button>
            <Button
              className="btn-modern"
              onClick={handleSave}
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, px: { xs: 1.5, sm: 2 } }}
            >
              {userId || username ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={userTypeModalOpen}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') setUserTypeModalOpen(false);
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: '#1a1a1a',
            p: { xs: 1.5, sm: 2 },
            borderRadius: '8px',
            width: { xs: '80%', sm: '300px' },
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: theme.palette.text.primary,
              fontWeight: 'bold',
              fontSize: { xs: '1rem', sm: '1.1rem' },
              textAlign: 'center',
            }}
          >
            Manage User Types
          </Typography>
          <TextField
            fullWidth
            label="New User Type"
            value={newUserType}
            onChange={(e) => setNewUserType(e.target.value)}
            sx={{ mb: 2, bgcolor: theme.palette.background.paper, borderRadius: '8px' }}
            size="small"
          />
          <TextField
            select
            fullWidth
            label="Delete User Type"
            value={userTypeToDelete}
            onChange={(e) => setUserTypeToDelete(e.target.value)}
            sx={{ mb: 2, bgcolor: theme.palette.background.paper, borderRadius: '8px' }}
            size="small"
          >
            <MenuItem value="">Select a user type to delete</MenuItem>
            {availableUserTypes.map((type) => (
              <MenuItem key={type.id} value={type.id.toString()}>
                {type.name}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              className="btn-modern btn-modern-cancel"
              onClick={() => setUserTypeModalOpen(false)}
              sx={{ color: theme.palette.text.secondary, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Cancel
            </Button>
            <Button
              className="btn-modern"
              onClick={handleAddUserType}
              disabled={!newUserType.trim()}
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Add
            </Button>
            <Button
              className="btn-modern"
              onClick={handleDeleteUserType}
              disabled={!userTypeToDelete}
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default UserTypeCreationPopup;