import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  Snackbar,
  Alert,
  Tooltip,
  Select,
  MenuItem,
} from '@mui/material';
import { FaUserCog, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { useTheme } from '@mui/material/styles';
import apiClient from '../../apiClient';
import UserTypeCreationPopup from './pages/UserTypeCreation';
import UserPrivilegePopup from './pages/UserPrivilegeCreation';
import UserRegistrationPopup from './pages/UserRegistrationCreation';
import '../../styles/Coal_mine_theme.css';

function UserManagement() {
  const theme = useTheme();
  const navBarHeight = 64 + 48;
  const ptReduction = 30;
  const [users, setUsers] = useState([]);
  const [openUserRegistrationModal, setOpenUserRegistrationModal] = useState(false);
  const [openUserTypeModal, setOpenUserTypeModal] = useState(false);
  const [openPrivilegeModal, setOpenPrivilegeModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get('users/');
        setUsers(response.data);
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to fetch users', severity: 'error' });
      }
    };
    fetchUsers();
  }, []);

  const handleOpenModal = (type, user = null) => {
    setCurrentUser(user);
    if (type === 'register') {
      setOpenUserRegistrationModal(true);
    } else if (type === 'type') {
      setOpenUserTypeModal(true);
    } else if (type === 'privilege') {
      setOpenPrivilegeModal(true);
    }
  };

  const handleCloseUserRegistrationModal = () => {
    setOpenUserRegistrationModal(false);
    setCurrentUser(null);
  };

  const handleCloseUserTypeModal = () => {
    setOpenUserTypeModal(false);
  };

  const handleClosePrivilegeModal = () => {
    setOpenPrivilegeModal(false);
  };

  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleSaveUser = async (userData) => {
    try {
      if (currentUser) {
        await apiClient.put(`users/${currentUser.id}/`, userData);
        setSnackbar({ open: true, message: 'User updated successfully', severity: 'success' });
      } else {
        await apiClient.post('users/', userData);
        setSnackbar({ open: true, message: 'User registered successfully', severity: 'success' });
      }
      const response = await apiClient.get('users/');
      setUsers(response.data);
      handleCloseUserRegistrationModal();
    } catch (error) {
      const errorMsg = error.response?.data?.detail || Object.values(error.response?.data || {}).flat().join('; ') || 'Failed to save user';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    }
  };

  const handleDeleteUser = async () => {
    try {
      await apiClient.delete(`users/${userToDelete.id}/`);
      setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
      const response = await apiClient.get('users/');
      setUsers(response.data);
      handleCloseDeleteDialog();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete user', severity: 'error' });
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await apiClient.patch(`users/approve/${userId}/`, { status: newStatus });
      setSnackbar({ open: true, message: `User ${newStatus} successfully`, severity: 'success' });
      const response = await apiClient.get('users/');
      setUsers(response.data);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to update status';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.profile?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.profile?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      sx={{
        pt: { xs: `${56 + 48 - ptReduction}px`, sm: `${64 + 48 - ptReduction}px`, md: `${80 + 48 - ptReduction}px` },
        px: { xs: 1, sm: 2, md: 3 },
        bgcolor: theme.palette.background.default,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: {
          xs: `calc(100vh - ${56 + 48 - ptReduction}px)`,
          sm: `calc(100vh - ${64 + 48 - ptReduction}px)`,
          md: `calc(100vh - ${80 + 48 - ptReduction}px)`,
        },
        overflow: 'hidden',
      }}
    >
      <Paper
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: '14px',
          bgcolor: '#1a1a1a',
          width: '100%',
          maxWidth: { xs: '100%', sm: '900px', md: '1200px' },
          maxHeight: `calc(100vh - ${navBarHeight - ptReduction}px - 32px)`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FaUserCog size={24} color={theme.palette.primary.main} />
            <Typography
              variant="h6"
              sx={{
                ml: 1,
                color: theme.palette.text.primary,
                fontWeight: 'bold',
                fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
              }}
            >
              User Management
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            gap: { xs: 1, sm: 2 },
            flexWrap: 'wrap',
          }}
        >
          <TextField
            size="small"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaSearch color={theme.palette.text.secondary} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: '100%', sm: '200px', md: '250px' },
              bgcolor: theme.palette.background.paper,
              '& .MuiInputBase-root': { fontSize: { xs: '0.8rem', sm: '0.875rem' } },
            }}
          />
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 1, sm: 1.5 },
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', sm: 'flex-end' },
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            <Button className="btn-modern" onClick={() => handleOpenModal('register')}>
              User Registration
            </Button>
            <Button className="btn-modern" onClick={() => handleOpenModal('type')}>
              User Type Creation
            </Button>
            <Button className="btn-modern" onClick={() => handleOpenModal('privilege')}>
              User Privilege
            </Button>
          </Box>
        </Box>

        <TableContainer
          sx={{
            maxHeight: `calc(100vh - ${navBarHeight - ptReduction}px - 200px)`,
            overflowY: 'auto',
            overflowX: 'auto',
          }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Role</TableCell>
                <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold', display: { xs: 'none', sm: 'table-cell' } }}>
                  Email
                </TableCell>
                <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold', display: { xs: 'none', sm: 'table-cell' } }}>
                  Status
                </TableCell>
                <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold', display: { xs: 'none', md: 'table-cell' } }}>
                  Date Joined
                </TableCell>
                <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell sx={{ color: theme.palette.text.secondary }}>{user.id}</TableCell>
                  <TableCell sx={{ color: theme.palette.text.secondary }}>
                    {user.profile?.first_name} {user.profile?.last_name}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.secondary }}>{user.profile?.designation || 'User'}</TableCell>
                  <TableCell sx={{ color: theme.palette.text.secondary, display: { xs: 'none', sm: 'table-cell' } }}>
                    {user.email}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.secondary, display: { xs: 'none', sm: 'table-cell' } }}>
                    <Select
                      value={user.status}
                      onChange={(e) => handleStatusChange(user.id, e.target.value)}
                      size="small"
                      disabled={!user.is_admin} // Disable if current user is not admin (adjust based on your auth logic)
                      sx={{ minWidth: 100 }}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.secondary, display: { xs: 'none', md: 'table-cell' } }}>
                    {new Date(user.date_joined).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit user">
                      <span>
                        <IconButton
                          onClick={() => handleOpenModal('register', user)}
                          color="primary"
                          size="small"
                        >
                          <FaEdit size={16} />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Delete user">
                      <span>
                        <IconButton
                          onClick={() => handleOpenDeleteDialog(user)}
                          color="error"
                          size="small"
                        >
                          <FaTrash size={16} />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <UserRegistrationPopup
          open={openUserRegistrationModal}
          onClose={handleCloseUserRegistrationModal}
          onSave={handleSaveUser}
          userToEdit={currentUser}
        />

        <UserTypeCreationPopup
          open={openUserTypeModal}
          onClose={handleCloseUserTypeModal}
        />

        <UserPrivilegePopup
          open={openPrivilegeModal}
          onClose={handleClosePrivilegeModal}
        />

        <Dialog
          open={deleteDialogOpen}
          onClose={(event, reason) => {
            if (reason !== 'backdropClick') {
              handleCloseDeleteDialog();
            }
          }}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: theme.palette.text.primary }}>
              Are you sure you want to delete {userToDelete?.profile?.first_name} {userToDelete?.profile?.last_name}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button className="btn-modern btn-modern-cancel" onClick={handleCloseDeleteDialog}>
              Cancel
            </Button>
            <Button className="btn-modern btn-modern-delete" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

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
      </Paper>
    </Box>
  );
}

export default UserManagement;