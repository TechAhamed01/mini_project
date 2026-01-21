import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  History as HistoryIcon,
  LocationOn as LocationIcon,
  Favorite as FavoriteIcon,
  Notifications as NotificationsIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI, inventoryAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [donations, setDonations] = useState([]);
  const [healthInfo, setHealthInfo] = useState(null);
  const [upcomingRequests, setUpcomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchDashboardData(),
          fetchDonations(),
          fetchHealthInfo(),
          fetchUpcomingRequests()
        ]);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await authAPI.dashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchDonations = async () => {
    try {
      const response = await inventoryAPI.getInventory({ donor: user?.id });
      setDonations(response.data);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  const fetchHealthInfo = async () => {
    try {
      const response = await authAPI.healthInfo();
      setHealthInfo(response.data);
    } catch (error) {
      console.error('Error fetching health info:', error);
    }
  };

  const fetchUpcomingRequests = async () => {
    try {
      const response = await inventoryAPI.getRequests();
      const filtered = response.data.filter(
        request => request.blood_group === user?.blood_group && 
                   request.status === 'PENDING'
      );
      setUpcomingRequests(filtered.slice(0, 5));
    } catch (error) {
      console.error('Error fetching upcoming requests:', error);
    }
  };

  const calculateEligibility = () => {
    if (!user?.last_donation_date) return 100;
    
    const lastDonation = new Date(user.last_donation_date);
    const today = new Date();
    const daysSince = Math.floor((today - lastDonation) / (1000 * 60 * 60 * 24));
    const eligibility = Math.min(100, (daysSince / 56) * 100); // 56 days required
    
    return Math.round(eligibility);
  };

  const eligibility = calculateEligibility();

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {loading && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="body1" color="textSecondary">
            Loading dashboard data...
          </Typography>
          <LinearProgress sx={{ mt: 2 }} />
        </Paper>
      )}
      {/* Welcome Section */}
      <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h4" gutterBottom>
              Welcome, {user?.first_name || user?.username}!
            </Typography>
            <Typography variant="subtitle1">
              Donor Dashboard - Your Lifesaving Journey
            </Typography>
          </Grid>
          <Grid item>
            <PersonIcon sx={{ fontSize: 60, opacity: 0.8 }} />
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FavoriteIcon sx={{ color: '#d32f2f', mr: 1 }} />
                <Typography color="textSecondary">
                  Blood Group
                </Typography>
              </Box>
              <Typography variant="h3" color="#d32f2f">
                {user?.blood_group || 'N/A'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Your blood type
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HistoryIcon sx={{ color: '#1976d2', mr: 1 }} />
                <Typography color="textSecondary">
                  Total Donations
                </Typography>
              </Box>
              <Typography variant="h3">
                {dashboardData?.total_donations || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                lifesaving donations
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <UpdateIcon sx={{ color: '#4caf50', mr: 1 }} />
                <Typography color="textSecondary">
                  Eligibility
                </Typography>
              </Box>
              <Typography variant="h3" color="#4caf50">
                {eligibility}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={eligibility} 
                sx={{ mt: 1 }}
                color={eligibility >= 100 ? 'success' : 'warning'}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsIcon sx={{ color: '#ff9800', mr: 1 }} />
                <Typography color="textSecondary">
                  Urgent Requests
                </Typography>
              </Box>
              <Typography variant="h3">
                {dashboardData?.upcoming_requests || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                in your area
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Donation History */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Donation History
            </Typography>
            {donations.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Blood Bank</TableCell>
                      <TableCell>Blood Group</TableCell>
                      <TableCell>Component</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {donations.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell>
                          {new Date(donation.collection_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{donation.blood_bank_details?.blood_bank_name}</TableCell>
                        <TableCell>
                          <Chip label={donation.blood_group} size="small" />
                        </TableCell>
                        <TableCell>{donation.component_type}</TableCell>
                        <TableCell>{donation.quantity} units</TableCell>
                        <TableCell>
                          <Chip
                            label={donation.status}
                            color={
                              donation.status === 'AVAILABLE' ? 'success' :
                              donation.status === 'USED' ? 'primary' : 'default'
                            }
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">
                You haven't made any donations yet. Consider donating to save lives!
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Health Info & Urgent Requests */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            {/* Health Information */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Health Information
                </Typography>
                {healthInfo ? (
                  <Box>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          Height
                        </Typography>
                        <Typography variant="body1">
                          {healthInfo.height} cm
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          Weight
                        </Typography>
                        <Typography variant="body1">
                          {healthInfo.weight} kg
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          Hemoglobin
                        </Typography>
                        <Typography variant="body1">
                          {healthInfo.hemoglobin_level} g/dL
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          Last Checkup
                        </Typography>
                        <Typography variant="body1">
                          {new Date(healthInfo.last_checkup_date).toLocaleDateString()}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{ mt: 2 }}
                      onClick={() => {/* Navigate to health info update */}}
                    >
                      Update Health Info
                    </Button>
                  </Box>
                ) : (
                  <Alert severity="warning">
                    Please update your health information to help match you with suitable donation requests.
                  </Alert>
                )}
              </Paper>
            </Grid>

            {/* Urgent Requests */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderColor: '#f44336', border: 1 }}>
                <Typography variant="h6" gutterBottom color="#f44336">
                  Urgent Blood Requests
                </Typography>
                {upcomingRequests.length > 0 ? (
                  <Box>
                    {upcomingRequests.slice(0, 3).map((request, index) => (
                      <Alert
                        key={index}
                        severity="error"
                        sx={{ mb: 1 }}
                        icon={<FavoriteIcon />}
                      >
                        <Typography variant="body2">
                          {request.hospital_details?.hospital_name}
                        </Typography>
                        <Typography variant="caption">
                          Needs {request.quantity_required} units of {request.blood_group}
                        </Typography>
                      </Alert>
                    ))}
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ mt: 1, bgcolor: '#d32f2f' }}
                      onClick={() => {/* Show all requests */}}
                    >
                      View All Requests
                    </Button>
                  </Box>
                ) : (
                  <Alert severity="info">
                    No urgent requests for your blood type at the moment.
                  </Alert>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Donation Eligibility */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Next Donation Eligibility
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={eligibility} 
              sx={{ height: 20, borderRadius: 10 }}
              color={eligibility >= 100 ? 'success' : 'warning'}
            />
          </Box>
          <Typography variant="h6">
            {eligibility >= 100 ? 'Ready to Donate!' : `${eligibility}%`}
          </Typography>
        </Box>
        
        {user?.last_donation_date && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            Last donation: {new Date(user.last_donation_date).toLocaleDateString()}
            {eligibility < 100 && (
              <>
                <br />
                You can donate again in {Math.max(0, 56 - Math.floor((new Date() - new Date(user.last_donation_date)) / (1000 * 60 * 60 * 24)))} days
              </>
            )}
          </Typography>
        )}
        
        <Button
          variant="contained"
          disabled={eligibility < 100}
          sx={{ 
            mt: 2,
            bgcolor: eligibility >= 100 ? '#d32f2f' : 'gray',
            '&:hover': { bgcolor: eligibility >= 100 ? '#b71c1c' : 'gray' }
          }}
        >
          {eligibility >= 100 ? 'Schedule Donation' : 'Not Eligible Yet'}
        </Button>
      </Paper>
    </Container>
  );
};

export default DonorDashboard;