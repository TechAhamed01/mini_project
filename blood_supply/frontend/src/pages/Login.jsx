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
  FormControlLabel,
  Checkbox,
  Grid,
} from '@mui/material';
import { Bloodtype as BloodIcon } from '@mui/icons-material';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <BloodIcon sx={{ fontSize: 60, color: '#d32f2f', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            BloodChain AI
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Intelligent Blood Supply Chain Management
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username or Email"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            margin="normal"
            required
            autoFocus
          />
          
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            margin="normal"
            required
          />

          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
            sx={{ mt: 2 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            Sign In
          </Button>

          <Grid container justifyContent="space-between">
            <Grid item>
              <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Forgot password?
                </Typography>
              </Link>
            </Grid>
            <Grid item>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Don't have an account? Sign Up
                </Typography>
              </Link>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="textSecondary" align="center">
              Select your login type after signing up:
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={4}>
                <Paper sx={{ p: 1, textAlign: 'center', bgcolor: '#e3f2fd' }}>
                  <Typography variant="caption">Hospital</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper sx={{ p: 1, textAlign: 'center', bgcolor: '#f3e5f5' }}>
                  <Typography variant="caption">Blood Bank</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper sx={{ p: 1, textAlign: 'center', bgcolor: '#e8f5e9' }}>
                  <Typography variant="caption">Donor</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;