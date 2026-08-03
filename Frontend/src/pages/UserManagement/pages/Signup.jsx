import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Paper, 
  InputAdornment, 
  Snackbar, 
  Alert 
} from "@mui/material";
import { styled } from '@mui/system';
import { FaUser, FaLock, FaQuestionCircle, FaBuilding, FaMapMarkerAlt, FaBriefcase, FaSitemap } from "react-icons/fa";
import apiClient from "../../../apiClient";
import CDACLogo from "../../../assets/CDAC_emblem.png";
import CMERILogo from "../../../assets/CMERI_emblem.png";
import CoalMineBg from "../../../assets/coal_mine_bg.jpg";

// Styled components
const Logo = styled('img')({
  width: '40px',
  height: 'auto',
});

const Background = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100vw',
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${CoalMineBg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '1rem',
  boxSizing: 'border-box',
  [theme.breakpoints.down('sm')]: {
    padding: '0.5rem',
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '1rem',
  width: '100%',
  maxWidth: '800px',
  maxHeight: '90vh',
  overflowY: 'auto',
  textAlign: 'center',
  borderRadius: '8px',
  background: '#1a1a1a',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    padding: '0.75rem',
  },
}));

const HeaderContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  marginBottom: '0.75rem',
});

const StyledHeading = styled(Typography)({
  fontSize: '1.1rem',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  color: '#fff',
  textAlign: 'center',
  fontFamily: "'Roboto', sans-serif",
  flex: 1,
});

const InputLabel = styled(Typography)({
  fontSize: '0.8rem',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  color: '#fff',
  textAlign: 'left',
  marginBottom: '0.2rem',
});

const CustomTextField = styled(TextField)(({ theme }) => ({
  marginBottom: '0.75rem',
  background: '#fff',
  borderRadius: '4px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    padding: '4px 6px',
  },
  '& .MuiOutlinedInput-input': {
    fontSize: '0.85rem',
    color: '#333',
    padding: '6px 0',
  },
  '& .MuiInputBase-input::placeholder': {
    color: '#999',
    opacity: 1,
    fontSize: '0.85rem',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 6px ${theme.palette.primary.main}50`,
  },
}));

const FormGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '0.75rem',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    organization: "",
    designation: "",
    department: "",
    mobile: "",
    address: "",
    security_question: "What is your favorite color?",
    security_answer: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const requiredFields = [
      { key: 'email', label: 'Email' },
      { key: 'first_name', label: 'First Name' },
      { key: 'last_name', label: 'Last Name' },
      { key: 'organization', label: 'Organization' },
      { key: 'designation', label: 'Designation' },
      { key: 'department', label: 'Department' },
      { key: 'mobile', label: 'Mobile' },
      { key: 'address', label: 'Address' },
      { key: 'password', label: 'Password' },
      { key: 'confirmPassword', label: 'Confirm Password' },
      { key: 'security_answer', label: 'Security Answer' },
    ];
    const errors = [];
    
    requiredFields.forEach(({ key, label }) => {
      if (!formData[key].trim()) {
        errors.push(`${label} is required`);
      }
    });

    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      errors.push("Passwords do not match");
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push("Invalid email format");
    }

    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      errors.push("Mobile number must be 10 digits");
    }

    return errors;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setOpenSnackbar(false);

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrorMessage(`⚠️ ${validationErrors.join('; ')}`);
      setOpenSnackbar(true);
      return;
    }

    try {
      const payload = {
        email: formData.email.trim(),
        username: formData.username.trim() || null,
        password: formData.password.trim(),
        confirm_password: formData.confirmPassword.trim(),
        profile: {
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          organization: formData.organization.trim(),
          designation: formData.designation.trim(),
          department: formData.department.trim(),
          mobile: formData.mobile.trim(),
          address: formData.address.trim(),
          security_question: formData.security_question,
          security_answer: formData.security_answer.trim(),
        },
      };

      console.log("Payload being sent:", JSON.stringify(payload, null, 2));

      const response = await apiClient.post("/users/", payload);
      console.log("API Response:", response.data, "Status:", response.status);

      setErrorMessage("✅ Signup successful! Please wait for admin approval.");
      setOpenSnackbar(true);
      setTimeout(() => navigate("/login"), 2000); // Redirect only on success
    } catch (error) {
      console.error("Signup API Error:", error);
      let errorMsg = "⚠️ Failed to sign up. Please try again.";
      if (error.response) {
        console.log("Error Response:", error.response.data, "Status:", error.response.status);
        if (typeof error.response.data === 'object') {
          errorMsg = Object.entries(error.response.data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ');
        } else {
          errorMsg = error.response.data?.detail || errorMsg;
        }
      } else if (error.request) {
        console.log("No response received:", error.request);
        errorMsg = "⚠️ No response from server. Check your internet or server status.";
      } else {
        console.log("Error setting up request:", error.message);
        errorMsg = `⚠️ Error: ${error.message}`;
      }
      setErrorMessage(errorMsg);
      setOpenSnackbar(true);
      // No redirect on error
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage("");
  };

  return (
    <Background>
      <StyledPaper elevation={3}>
        <HeaderContainer>
          <Logo src={CDACLogo} alt="CDAC Logo" style={{ marginRight: "8px" }} />
          <StyledHeading variant="h6">
            Coal Dust Monitoring Software
          </StyledHeading>
          <Logo src={CMERILogo} alt="CMERI Logo" style={{ marginLeft: "8px" }} />
        </HeaderContainer>

        <Typography
          variant="h6"
          sx={{
            mb: 1,
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1rem',
            textTransform: 'uppercase',
          }}
        >
          Create an Account
        </Typography>

        <form onSubmit={handleSignup} style={{ width: '100%' }}>
          <FormGrid>
            <Box>
              <InputLabel>Email *</InputLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
                type="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaUser style={{ color: '#ff6200' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box>
              <InputLabel>Username (Optional)</InputLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaUser style={{ color: '#ff6200' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box>
              <InputLabel>First Name *</InputLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
                placeholder="Enter your first name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaUser style={{ color: '#ff6200' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box>
              <InputLabel>Last Name *</InputLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                required
                placeholder="Enter your last name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaUser style={{ color: '#ff6200' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box>
              <InputLabel>Organization *</InputLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                required
                placeholder="Enter your organization"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaBuilding style={{ color: '#ff6200' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box>
              <InputLabel>Designation *</InputLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                required
                placeholder="Enter your designation"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaBriefcase style={{ color: '#ff6200' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box>
              <InputLabel>Department *</InputLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
                placeholder="Enter your department"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaSitemap style={{ color: '#ff6200' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box>
              <InputLabel>Mobile *</InputLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                required
                placeholder="Enter your 10-digit mobile number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaUser style={{ color: '#ff6200' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box>
              <InputLabel>Address *</InputLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                placeholder="Enter your address"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaMapMarkerAlt style={{ color: '#ff6200' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box>
              <InputLabel>Password *</InputLabel>
              <CustomTextField
                type="password"
                variant="outlined"
                fullWidth
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter your password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaLock style={{ color: '#ff6200' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box>
              <InputLabel>Confirm Password *</InputLabel>
              <CustomTextField
                type="password"
                variant="outlined"
                fullWidth
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                placeholder="Confirm your password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaLock style={{ color: '#ff6200' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box>
              <InputLabel>Security Question: What is your favorite color? *</InputLabel>
              <CustomTextField
                variant="outlined"
                fullWidth
                name="security_answer"
                value={formData.security_answer}
                onChange={handleInputChange}
                required
                placeholder="Enter your security answer"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaQuestionCircle style={{ color: '#ff6200' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </FormGrid>
          <Button
            type="submit"
            className="btn-modern"
            variant="contained"
            fullWidth
            sx={{
              mt: 1,
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
            Sign Up
          </Button>
        </form>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={errorMessage.startsWith('✅') ? 'success' : 'error'}
            sx={{ width: '100%' }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>

        <Typography variant="body2" sx={{ color: '#fff', fontSize: '0.8rem' }}>
          Already have an account?{' '}
          <span
            onClick={() => navigate("/login")}
            style={{ cursor: 'pointer', color: '#ff6200', fontWeight: '600', textTransform: 'uppercase' }}
          >
            Log in
          </span>
        </Typography>
      </StyledPaper>
    </Background>
  );
};

export default Signup;