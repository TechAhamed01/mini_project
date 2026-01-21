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
  Inventory as InventoryIcon,
  Bloodtype as BloodIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI, inventoryAPI, notificationAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BloodBankDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [expiryAlerts, setExpiryAlerts] = useState([]);
  const [newInventory, setNewInventory] = useState({
    blood_group: '',
    component_type: 'WHOLE_BLOOD',
    quantity: 1,
    unit_volume: 450,
    collection_date: new Date().toISOString().split('T')[0],
    expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    storage_temperature: 4,
    storage_location: '',
    donor: '',
    status: 'AVAILABLE',
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const componentTypes = [
    { value: 'WHOLE_BLOOD', label: 'Whole Blood' },
    { value: 'RBC', label: 'Red Blood Cells' },
    { value: 'PLASMA', label: 'Plasma' },
    { value: 'PLATELETS', label: 'Platelets' },
    { value: 'CRYOPRECIPITATE', label: 'Cryoprecipitate' },
  ];

  useEffect(() => {
    fetchDashboardData();
    fetchInventory();
    fetchRequests();
    fetchExpiryAlerts();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await authAPI.dashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

  const fetchRequests = async () => {
    try {
      const response = await inventoryAPI.getRequests();
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const fetchExpiryAlerts = async () => {
    try {
      const response = await inventoryAPI.getExpiryAlerts();
      setExpiryAlerts(response.data.alerts || []);
    } catch (error) {
      console.error('Error fetching expiry alerts:', error);
    }
  };

  const handleAddInventory = async () => {
    try {
      console.log('🚀 Starting inventory add request');
      console.log('📦 Inventory data:', newInventory);
      console.log('🔑 localStorage keys:', Object.keys(localStorage));
      console.log('🔐 access_token exists:', !!localStorage.getItem('access_token'));
      console.log('👤 user in storage:', localStorage.getItem('user'));
      
      await inventoryAPI.addInventory(newInventory);
      toast.success('Blood inventory added successfully!');
      setOpenAddDialog(false);
      setNewInventory({
        blood_group: '',
        component_type: 'WHOLE_BLOOD',
        quantity: 1,
        unit_volume: 450,
        collection_date: new Date().toISOString().split('T')[0],
        expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        storage_temperature: 4,
        storage_location: '',
        donor: '',
        status: 'AVAILABLE',
      });
      fetchInventory();
    } catch (error) {
      console.error('Error adding inventory:', error);
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || error.message || 'Failed to add inventory';
      toast.error(`Error: ${errorMsg}`);
    }
  };

  const handleFulfillRequest = async (requestId) => {
    try {
      await inventoryAPI.fulfillRequest(requestId);
      toast.success('Request fulfilled successfully!');
      fetchRequests();
      fetchInventory();
    } catch (error) {
      toast.error('Failed to fulfill request');
    }
  };

  // Sample data for charts
  const inventoryData = bloodGroups.map(bg => ({
    name: bg,
    value: inventory.filter(item => item.blood_group === bg)
      .reduce((sum, item) => sum + item.quantity, 0)
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1'];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Section */}
      <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h4" gutterBottom>
              Welcome, {user?.blood_bank_name || user?.username}!
            </Typography>
            <Typography variant="subtitle1">
              Blood Bank Dashboard - Manage Blood Inventory
            </Typography>
          </Grid>
          <Grid item>
            <InventoryIcon sx={{ fontSize: 60, opacity: 0.8 }} />
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BloodIcon sx={{ color: '#d32f2f', mr: 1 }} />
                <Typography color="textSecondary">
                  Total Inventory
                </Typography>
              </Box>
              <Typography variant="h3">
                {dashboardData?.total_inventory_units || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                units in stock
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsIcon sx={{ color: '#ff9800', mr: 1 }} />
                <Typography color="textSecondary">
                  Pending Requests
                </Typography>
              </Box>
              <Typography variant="h3">
                {dashboardData?.pending_requests || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                awaiting fulfillment
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WarningIcon sx={{ color: '#f44336', mr: 1 }} />
                <Typography color="textSecondary">
                  Expiring Soon
                </Typography>
              </Box>
              <Typography variant="h3" color="#f44336">
                {dashboardData?.expiring_soon_count || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                within 7 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ color: '#4caf50', mr: 1 }} />
                <Typography color="textSecondary">
                  Blood Types
                </Typography>
              </Box>
              <Typography variant="h3" color="#4caf50">
                8
              </Typography>
              <Typography variant="body2" color="textSecondary">
                different groups
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddDialog(true)}
            sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}
          >
            Add New Inventory
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            startIcon={<WarningIcon />}
            onClick={fetchExpiryAlerts}
          >
            View Expiry Alerts ({expiryAlerts.length})
          </Button>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Inventory by Blood Group
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Units" />
              </BarChart>
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
                  data={inventoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {inventoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Requests */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Blood Requests
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Hospital</TableCell>
                    <TableCell>Blood Group</TableCell>
                    <TableCell>Component</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Urgency</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.slice(0, 5).map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.hospital_details?.hospital_name}</TableCell>
                      <TableCell>
                        <Chip label={request.blood_group} size="small" />
                      </TableCell>
                      <TableCell>{request.component_type}</TableCell>
                      <TableCell>{request.quantity_required} units</TableCell>
                      <TableCell>
                        <Chip
                          label={request.urgency}
                          size="small"
                          sx={{
                            backgroundColor: 
                              request.urgency === 'CRITICAL' ? '#d32f2f' :
                              request.urgency === 'HIGH' ? '#f57c00' :
                              request.urgency === 'MEDIUM' ? '#ffb300' : '#4caf50',
                            color: 'white'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={request.status}
                          color={
                            request.status === 'PENDING' ? 'warning' :
                            request.status === 'FULFILLED' ? 'success' : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {request.status === 'PENDING' && (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleFulfillRequest(request.id)}
                            sx={{ bgcolor: '#4caf50' }}
                          >
                            Fulfill
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Expiry Alerts */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderColor: '#ff9800', border: 2 }}>
            <Typography variant="h6" gutterBottom color="#ff9800">
              <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Expiry Alerts
            </Typography>
            {expiryAlerts.length > 0 ? (
              <Box>
                {expiryAlerts.slice(0, 3).map((alert, index) => (
                  <Alert
                    key={index}
                    severity="warning"
                    sx={{ mb: 1 }}
                  >
                    <Typography variant="body2">
                      {alert.blood_group} - {alert.quantity} units
                    </Typography>
                    <Typography variant="caption">
                      Expires in {alert.days_until_expiry} days
                    </Typography>
                  </Alert>
                ))}
                {expiryAlerts.length > 3 && (
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    + {expiryAlerts.length - 3} more alerts
                  </Typography>
                )}
              </Box>
            ) : (
              <Alert severity="info">
                No expiry alerts at the moment.
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Add Inventory Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Blood Inventory</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Blood Group"
                value={newInventory.blood_group}
                onChange={(e) => setNewInventory({ ...newInventory, blood_group: e.target.value })}
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
                value={newInventory.component_type}
                onChange={(e) => setNewInventory({ ...newInventory, component_type: e.target.value })}
                required
              >
                {componentTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={newInventory.quantity}
                onChange={(e) => setNewInventory({ ...newInventory, quantity: parseInt(e.target.value) })}
                required
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Collection Date"
                type="date"
                value={newInventory.collection_date}
                onChange={(e) => setNewInventory({ ...newInventory, collection_date: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                type="date"
                value={newInventory.expiry_date}
                onChange={(e) => setNewInventory({ ...newInventory, expiry_date: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Storage Temperature (°C)"
                type="number"
                value={newInventory.storage_temperature}
                onChange={(e) => setNewInventory({ ...newInventory, storage_temperature: parseFloat(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Storage Location"
                value={newInventory.storage_location}
                onChange={(e) => setNewInventory({ ...newInventory, storage_location: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Donor ID (Optional)"
                value={newInventory.donor}
                onChange={(e) => setNewInventory({ ...newInventory, donor: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAddInventory} variant="contained">
            Add to Inventory
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BloodBankDashboard;