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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
  LocalHospital as HospitalIcon,
  Bloodtype as BloodIcon,
  Notifications as NotificationsIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { inventoryAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HospitalDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    blood_group: '',
    component_type: '',
    quantity_required: 1,
    urgency: 'MEDIUM',
    patient_details: '',
    purpose: '',
    required_by: '',
  });
  const [searchParams, setSearchParams] = useState({
    blood_group: '',
    component_type: '',
    quantity: 1,
  });
  const [searchResults, setSearchResults] = useState(null);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const componentTypes = ['WHOLE_BLOOD', 'RBC', 'PLASMA', 'PLATELETS', 'CRYOPRECIPITATE'];
  const urgencyLevels = [
    { value: 'LOW', label: 'Low Priority', color: '#4caf50' },
    { value: 'MEDIUM', label: 'Medium Priority', color: '#ff9800' },
    { value: 'HIGH', label: 'High Priority', color: '#f44336' },
    { value: 'CRITICAL', label: 'Critical Emergency', color: '#d32f2f' },
  ];

  useEffect(() => {
    fetchDashboardData();
    fetchRequests();
    if (user?.has_blood_bank) {
      fetchInventory();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await authAPI.dashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await inventoryAPI.getRequests();
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await inventoryAPI.getInventory();
      setInventory(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const handleCreateRequest = async () => {
    try {
      await inventoryAPI.createRequest(newRequest);
      toast.success('Blood request created successfully!');
      setOpenRequestDialog(false);
      setNewRequest({
        blood_group: '',
        component_type: '',
        quantity_required: 1,
        urgency: 'MEDIUM',
        patient_details: '',
        purpose: '',
        required_by: '',
      });
      fetchRequests();
    } catch (error) {
      toast.error('Failed to create request');
    }
  };

  const handleSearchBlood = async () => {
    try {
      const response = await inventoryAPI.searchBlood(searchParams);
      setSearchResults(response.data);
      toast.success('Search completed!');
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      APPROVED: 'info',
      FULFILLED: 'success',
      REJECTED: 'error',
      CANCELLED: 'default',
    };
    return colors[status] || 'default';
  };

  const getUrgencyColor = (urgency) => {
    return urgencyLevels.find(u => u.value === urgency)?.color || '#ff9800';
  };

  // Sample data for charts
  const requestTrendData = [
    { month: 'Jan', requests: 12 },
    { month: 'Feb', requests: 19 },
    { month: 'Mar', requests: 15 },
    { month: 'Apr', requests: 25 },
    { month: 'May', requests: 22 },
    { month: 'Jun', requests: 30 },
  ];

  const bloodGroupDistribution = bloodGroups.map(bg => ({
    name: bg,
    value: Math.floor(Math.random() * 100) + 20,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1'];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Section */}
      <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h4" gutterBottom>
              Welcome, {user?.hospital_name || user?.username}!
            </Typography>
            <Typography variant="subtitle1">
              Hospital Dashboard - AI-Powered Blood Management
            </Typography>
          </Grid>
          <Grid item>
            <HospitalIcon sx={{ fontSize: 60, opacity: 0.8 }} />
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Requests
              </Typography>
              <Typography variant="h4">
                {dashboardData?.pending_requests || 0}
              </Typography>
              <LinearProgress variant="determinate" value={40} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Fulfilled Requests
              </Typography>
              <Typography variant="h4">
                {dashboardData?.fulfilled_requests || 0}
              </Typography>
              <LinearProgress variant="determinate" value={80} color="success" sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>

        {user?.has_blood_bank && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Inventory
                  </Typography>
                  <Typography variant="h4">
                    {dashboardData?.total_inventory_units || 0} units
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <BloodIcon sx={{ color: '#d32f2f', mr: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      {inventory.length} blood types
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', borderColor: '#ff9800', border: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <WarningIcon sx={{ color: '#ff9800', mr: 1 }} />
                    <Typography color="textSecondary">
                      Expiring Soon
                    </Typography>
                  </Box>
                  <Typography variant="h4" color="#ff9800">
                    {dashboardData?.expiring_soon_count || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Within 7 days
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>

      {/* Action Buttons */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenRequestDialog(true)}
            sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}
          >
            New Blood Request
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            startIcon={<SearchIcon />}
            onClick={() => setSearchDialogOpen(true)}
          >
            Search Blood Availability
          </Button>
        </Grid>
        {user?.has_blood_bank && (
          <Grid item>
            <Button variant="outlined" startIcon={<WarningIcon />}>
              View Expiry Alerts
            </Button>
          </Grid>
        )}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Blood Request Trends
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={requestTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="requests" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Blood Group Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bloodGroupDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bloodGroupDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Requests Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Blood Requests
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Blood Group</TableCell>
                <TableCell>Component</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Urgency</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.slice(0, 5).map((request) => (
                <TableRow key={request.id}>
                  <TableCell>#{request.id}</TableCell>
                  <TableCell>
                    <Chip label={request.blood_group} size="small" />
                  </TableCell>
                  <TableCell>{request.component_type}</TableCell>
                  <TableCell>{request.quantity_required} units</TableCell>
                  <TableCell>
                    <Chip
                      label={request.urgency}
                      size="small"
                      sx={{ backgroundColor: getUrgencyColor(request.urgency), color: 'white' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={request.status}
                      color={getStatusColor(request.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(request.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <ArrowForwardIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create Request Dialog */}
      <Dialog open={openRequestDialog} onClose={() => setOpenRequestDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Blood Request</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Blood Group"
                value={newRequest.blood_group}
                onChange={(e) => setNewRequest({ ...newRequest, blood_group: e.target.value })}
                required
              >
                {bloodGroups.map((group) => (
                  <MenuItem key={group} value={group}>
                    {group}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Component Type"
                value={newRequest.component_type}
                onChange={(e) => setNewRequest({ ...newRequest, component_type: e.target.value })}
                required
              >
                {componentTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.replace('_', ' ')}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Quantity Required"
                type="number"
                value={newRequest.quantity_required}
                onChange={(e) => setNewRequest({ ...newRequest, quantity_required: parseInt(e.target.value) })}
                required
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Urgency"
                value={newRequest.urgency}
                onChange={(e) => setNewRequest({ ...newRequest, urgency: e.target.value })}
                required
              >
                {urgencyLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Patient Details"
                multiline
                rows={2}
                value={newRequest.patient_details}
                onChange={(e) => setNewRequest({ ...newRequest, patient_details: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Purpose"
                value={newRequest.purpose}
                onChange={(e) => setNewRequest({ ...newRequest, purpose: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Required By"
                type="datetime-local"
                value={newRequest.required_by}
                onChange={(e) => setNewRequest({ ...newRequest, required_by: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRequestDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateRequest} variant="contained">
            Create Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Search Dialog */}
      <Dialog open={searchDialogOpen} onClose={() => setSearchDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Search Blood Availability</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Blood Group"
                value={searchParams.blood_group}
                onChange={(e) => setSearchParams({ ...searchParams, blood_group: e.target.value })}
                required
              >
                {bloodGroups.map((group) => (
                  <MenuItem key={group} value={group}>
                    {group}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Component Type"
                value={searchParams.component_type}
                onChange={(e) => setSearchParams({ ...searchParams, component_type: e.target.value })}
                required
              >
                {componentTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.replace('_', ' ')}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={searchParams.quantity}
                onChange={(e) => setSearchParams({ ...searchParams, quantity: parseInt(e.target.value) })}
                required
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
          </Grid>

          {searchResults && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Search Results
              </Typography>
              
              {searchResults.blood_bank_suggestions.length > 0 ? (
                <>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Found {searchResults.blood_bank_suggestions.length} blood bank(s) with available stock
                  </Alert>
                  
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Blood Bank</TableCell>
                          <TableCell>Distance</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Expires In</TableCell>
                          <TableCell>Priority Score</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {searchResults.blood_bank_suggestions.map((bank, index) => (
                          <TableRow key={index}>
                            <TableCell>{bank.blood_bank_name}</TableCell>
                            <TableCell>{bank.distance_km} km</TableCell>
                            <TableCell>{bank.quantity} units</TableCell>
                            <TableCell>{bank.expiry_days} days</TableCell>
                            <TableCell>
                              <LinearProgress 
                                variant="determinate" 
                                value={bank.priority_score * 100} 
                                sx={{ width: 100 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Button size="small" variant="outlined">
                                Request
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              ) : (
                <>
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    No blood banks found with available stock. Showing donor matches instead.
                  </Alert>
                  
                  {searchResults.donor_matches.length > 0 ? (
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Donor Name</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell>Distance</TableCell>
                            <TableCell>Last Donation</TableCell>
                            <TableCell>Availability Score</TableCell>
                            <TableCell>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {searchResults.donor_matches.map((donor, index) => (
                            <TableRow key={index}>
                              <TableCell>{donor.name}</TableCell>
                              <TableCell>{donor.phone}</TableCell>
                              <TableCell>{donor.distance_km || 'N/A'} km</TableCell>
                              <TableCell>
                                {donor.last_donation ? new Date(donor.last_donation).toLocaleDateString() : 'Never'}
                              </TableCell>
                              <TableCell>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={donor.availability_score * 100} 
                                  sx={{ width: 100 }}
                                />
                              </TableCell>
                              <TableCell>
                                <Button size="small" variant="outlined">
                                  Contact
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Alert severity="error">
                      No available blood or donors found. Please try different search parameters.
                    </Alert>
                  )}
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setSearchDialogOpen(false);
            setSearchResults(null);
          }}>
            Close
          </Button>
          <Button onClick={handleSearchBlood} variant="contained" startIcon={<SearchIcon />}>
            Search
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HospitalDashboard;