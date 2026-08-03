import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
} from '@mui/material';
import '../../../styles/Coal_mine_theme.css';

const UserPrivilegePopup = ({ open, onClose, users = [], userTypes = [] }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    user: '',
    user_type: '',
    modules_user_management: false,
    modules_user_registration: false,
    modules_user_type_creation: false,
    modules_user_privilege: false,
    configuration_settings: false,
    configuration_services: false,
    dashboard: false,
    reports: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'user') {
      const user = users.find(u => u.id === value);
      setSelectedUser(user);

      setFormData({
        ...formData,
        user: value,
        user_type: '', // Reset user_type when user changes
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleSubmit = () => {
    const payload = { ...formData };
    console.log('Submitting data:', payload);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        console.log('UserPrivilegePopup Dialog onClose triggered:', { reason });
        if (reason !== 'backdropClick') {
          onClose();
        }
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Manage User Privileges</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Assign privileges to a user based on their user type.
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="user-label">User</InputLabel>
          <Select
            labelId="user-label"
            id="user-select"
            name="user"
            value={formData.user}
            onChange={handleChange}
            label="User"
            disabled={!Array.isArray(users) || users.length === 0}
          >
            {Array.isArray(users) && users.length > 0 ? (
              users.map(user => (
                <MenuItem key={user.id} value={user.id}>
                  {user.email}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No users available</MenuItem>
            )}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="user-type-label">User Type</InputLabel>
          <Select
            labelId="user-type-label"
            id="user-type-select"
            name="user_type"
            value={formData.user_type}
            onChange={handleChange}
            label="User Type"
            disabled={!Array.isArray(userTypes) || userTypes.length === 0}
          >
            {Array.isArray(userTypes) && userTypes.length > 0 ? (
              userTypes.map(userType => (
                <MenuItem key={userType.id} value={userType.id}>
                  {userType.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No user types available</MenuItem>
            )}
          </Select>
        </FormControl>

        {selectedUser && (
          <TextField
            label="Assigned User Role"
            value={selectedUser.role || 'N/A'}
            fullWidth
            sx={{ mb: 2 }}
            InputProps={{ readOnly: true }}
          />
        )}

        <Typography variant="subtitle2" sx={{ mb: 1 }}>Module Permissions</Typography>
        <FormControlLabel
          control={<Checkbox name="modules_user_management" checked={formData.modules_user_management} onChange={handleChange} />}
          label="User Management"
        />
        <FormControlLabel
          control={<Checkbox name="modules_user_registration" checked={formData.modules_user_registration} onChange={handleChange} />}
          label="User Registration"
        />
        <FormControlLabel
          control={<Checkbox name="modules_user_type_creation" checked={formData.modules_user_type_creation} onChange={handleChange} />}
          label="User Type Creation"
        />
        <FormControlLabel
          control={<Checkbox name="modules_user_privilege" checked={formData.modules_user_privilege} onChange={handleChange} />}
          label="User Privilege"
        />
        <FormControlLabel
          control={<Checkbox name="configuration_settings" checked={formData.configuration_settings} onChange={handleChange} />}
          label="Configuration Settings"
        />
        <FormControlLabel
          control={<Checkbox name="configuration_services" checked={formData.configuration_services} onChange={handleChange} />}
          label="Configuration Services"
        />
        <FormControlLabel
          control={<Checkbox name="dashboard" checked={formData.dashboard} onChange={handleChange} />}
          label="Dashboard"
        />
        <FormControlLabel
          control={<Checkbox name="reports" checked={formData.reports} onChange={handleChange} />}
          label="Reports"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} className="btn-modern btn-modern-cancel">
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="btn-modern">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserPrivilegePopup;