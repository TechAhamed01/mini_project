import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Bloodtype as BloodIcon } from '@mui/icons-material';

const Register = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    username: '',
    email: '',
    password: '',
    password2: '',
    user_type: 'HOSPITAL',
    
    // Step 2: Personal Info
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    latitude: '',
    longitude: '',
    
    // Step 3: Type Specific
    hospital_name: '',
    has_blood_bank: false,
    license_number: '',
    blood_bank_name: '',
    blood_bank_license: '',
    blood_group: '',
    date_of_birth: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const userTypes = [
    { value: 'HOSPITAL', label: 'Hospital', icon: '🏥' },
    { value: 'BLOOD_BANK', label: 'Blood Bank', icon: '🩸' },
    { value: 'DONOR', label: 'Donor', icon: '❤️' },
  ];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      return;
    }

    // Client-side validation for required fields
    const requiredFields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name', 'phone', 'address', 'city', 'state', 'pincode'];
    
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        const fieldLabel = field === 'password2' ? 'Confirm Password' : field.replace(/_/g, ' ').toUpperCase();
        setError(`${fieldLabel} is required`);
        return;
      }
    }

    // Validate user type specific fields
    if (formData.user_type === 'HOSPITAL' && !formData.hospital_name) {
      setError('Hospital Name is required');
      return;
    }
    if (formData.user_type === 'BLOOD_BANK' && !formData.blood_bank_name) {
      setError('Blood Bank Name is required');
      return;
    }
    if (formData.user_type === 'DONOR' && !formData.blood_group) {
      setError('Blood Group is required for donors');
      return;
    }

    try {
      // Prepare data for submission
      const submitData = { ...formData };
      
      // DO NOT delete password2 - backend needs it for validation
      // Remove only other empty fields EXCEPT for false booleans and required fields
      Object.keys(submitData).forEach(key => {
        if ((submitData[key] === '' || submitData[key] === null) && key !== 'has_blood_bank' && key !== 'password2') {
          delete submitData[key];
        }
      });

      console.log('Submitting registration data:', submitData);

      await register(submitData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response?.data);
      
      // Show detailed error message
      const errorData = err.response?.data;
      let errorMsg = 'Registration failed';
      
      if (errorData?.errors && typeof errorData.errors === 'object') {
        // Get first error from validation errors
        for (const [key, messages] of Object.entries(errorData.errors)) {
          if (Array.isArray(messages)) {
            errorMsg = `${key}: ${messages[0]}`;
          } else {
            errorMsg = `${key}: ${messages}`;
          }
          break;
        }
      } else if (errorData?.message) {
        errorMsg = errorData.message;
      }
      
      setError(errorMsg);
    }
  };

  const steps = ['Account Type', 'Personal Information', 'Complete Registration'];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Your Account Type
            </Typography>
            <TextField
              select
              fullWidth
              label="Account Type"
              name="user_type"
              value={formData.user_type}
              onChange={handleChange}
              margin="normal"
              required
            >
              {userTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ mr: 1 }}>{type.icon}</Typography>
                    {type.label}
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Confirm Password"
              name="password2"
              type="password"
              value={formData.password2}
              onChange={handleChange}
              margin="normal"
              required
            />
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Address"
              name="address"
              multiline
              rows={2}
              value={formData.address}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  margin="normal"
                  required
                  disabled
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {formData.user_type === 'HOSPITAL' ? 'Hospital Information' : 
               formData.user_type === 'BLOOD_BANK' ? 'Blood Bank Information' : 
               'Donor Information'}
            </Typography>

            {formData.user_type === 'HOSPITAL' && (
              <Box>
                <TextField
                  fullWidth
                  label="Hospital Name"
                  name="hospital_name"
                  value={formData.hospital_name}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      name="has_blood_bank"
                      checked={formData.has_blood_bank}
                      onChange={handleChange}
                    />
                  }
                  label="Has Blood Bank Facility"
                />
                
                {formData.has_blood_bank && (
                  <TextField
                    fullWidth
                    label="License Number"
                    name="license_number"
                    value={formData.license_number}
                    onChange={handleChange}
                    margin="normal"
                  />
                )}
              </Box>
            )}

            {formData.user_type === 'BLOOD_BANK' && (
              <Box>
                <TextField
                  fullWidth
                  label="Blood Bank Name"
                  name="blood_bank_name"
                  value={formData.blood_bank_name}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                
                <TextField
                  fullWidth
                  label="Blood Bank License"
                  name="blood_bank_license"
                  value={formData.blood_bank_license}
                  onChange={handleChange}
                  margin="normal"
                />
              </Box>
            )}

            {formData.user_type === 'DONOR' && (
              <Box>
                <TextField
                  select
                  fullWidth
                  label="Blood Group"
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleChange}
                  margin="normal"
                  required
                >
                  {bloodGroups.map((group) => (
                    <MenuItem key={group} value={group}>
                      {group}
                    </MenuItem>
                  ))}
                </TextField>
                
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            )}

            <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Review your information:
              </Typography>
              <Typography variant="body2">
                Username: {formData.username}
              </Typography>
              <Typography variant="body2">
                Email: {formData.email}
              </Typography>
              <Typography variant="body2">
                Account Type: {userTypes.find(t => t.value === formData.user_type)?.label}
              </Typography>
            </Box>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <BloodIcon sx={{ fontSize: 60, color: '#d32f2f', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Register for BloodChain AI
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Join our intelligent blood supply network
          </Typography>
        </Box>

        <Stepper activeStep={step} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {getStepContent(step)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={step === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            
            <Box>
              {step === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}
                >
                  Complete Registration
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Already have an account?{' '}
            <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
              Sign In
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;