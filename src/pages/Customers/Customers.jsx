import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import '../../styles/main.scss';

const Customers = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer, getCustomerRentals } = useAppContext();
  
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState({});

  const columns = [
    { field: 'id', headerName: 'ID', width: 60, hide: true },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 120 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 140, hide: true },
    { field: 'phone', headerName: 'Phone', width: 100, hide: true },
    { field: 'address', headerName: 'Address', width: 100, hide: true },
    {
      field: 'totalRentals',
      headerName: 'Rentals',
      width: 80,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <Box className="action-buttons" sx={{ gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => handleView(params.row)}
            color="primary"
            sx={{ p: 0.5 }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row)}
            color="primary"
            sx={{ p: 0.5 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteClick(params.row)}
            color="error"
            sx={{ p: 0.5 }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setViewOpen(true);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    });
    setErrors({});
    setOpen(true);
  };

  const handleDeleteClick = (customer) => {
    setSelectedCustomer(customer);
    setDeleteOpen(true);
  };

  const handleAdd = () => {
    setSelectedCustomer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
    });
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCustomer(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    if (selectedCustomer) {
      updateCustomer(selectedCustomer.id, formData);
    } else {
      addCustomer(formData);
    }
    handleClose();
  };

  const handleConfirmDelete = () => {
    if (selectedCustomer) {
      deleteCustomer(selectedCustomer.id);
    }
    setDeleteOpen(false);
    setSelectedCustomer(null);
  };

  const customerRentals = selectedCustomer ? getCustomerRentals(selectedCustomer.id) : [];

  return (
    <Box className="page-container">
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 3, gap: 2 }}>
        <Typography variant="h4" className="page-title" sx={{ m: 0 }}>
          Customers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{ minWidth: 120 }}
        >
          Add
        </Button>
      </Box>

      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={customers}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
        />
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box className="form-container">
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
              className="form-field"
              required
            />
            
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              className="form-field"
              required
            />
            
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-field"
            />
            
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="form-field"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {selectedCustomer ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Customer Details
          <IconButton onClick={() => setViewOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedCustomer && (
            <Box>
              <Typography variant="h5" gutterBottom>
                {selectedCustomer.name}
              </Typography>
              
              <Box className="details-section">
                <Typography variant="body2" color="text.secondary">
                  <strong>Email:</strong> {selectedCustomer.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Phone:</strong> {selectedCustomer.phone}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Address:</strong> {selectedCustomer.address}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Member Since:</strong> {selectedCustomer.joinedDate}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Total Rentals:</strong> {selectedCustomer.totalRentals}
                </Typography>
              </Box>
              
              <Box className="details-section">
                <Typography variant="h6" gutterBottom>
                  Rental Activity Log
                </Typography>
                {customerRentals.length > 0 ? (
                  <Box className="activity-log">
                    {customerRentals.map((rental) => (
                      <Box key={rental.id} className="log-item">
                        <Typography variant="body2">
                          <strong>{rental.movieTitle}</strong>
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Rented: {rental.rentalDate} | Expected: {rental.expectedReturnDate}
                        </Typography>
                        {rental.actualReturnDate && (
                          <Typography variant="caption" color="text.secondary">
                            | Returned: {rental.actualReturnDate}
                          </Typography>
                        )}
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              display: 'inline-block',
                              px: 1,
                              py: 0.25,
                              borderRadius: 1,
                              backgroundColor:
                                rental.status === 'active'
                                  ? '#e3f2fd'
                                  : rental.lateFee > 0
                                  ? '#ffebee'
                                  : '#e8f5e9',
                              color:
                                rental.status === 'active'
                                  ? '#1976d2'
                                  : rental.lateFee > 0
                                  ? '#c62828'
                                  : '#2e7d32',
                            }}
                          >
                            {rental.status === 'active'
                              ? 'Active'
                              : rental.lateFee > 0
                              ? `Late (RWF ${rental.lateFee})`
                              : 'Returned'}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No rental history
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedCustomer?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Customers;