import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Chip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Close as CloseIcon,
  AssignmentReturn as ReturnIcon,
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import '../../styles/main.scss';

const Rentals = () => {
  const { movies, customers, rentals, createRental, returnRental } = useAppContext();
  
  const [open, setOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [formData, setFormData] = useState({
    movieId: '',
    customerId: '',
    rentalDate: new Date().toISOString().split('T')[0],
    expectedReturnDate: '',
  });
  const [actualReturnDate, setActualReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState({});

  const availableMovies = useMemo(() => {
    const activeRentals = rentals.filter((r) => r.status === 'active').map((r) => r.movieId);
    return movies.filter((m) => !activeRentals.includes(m.id));
  }, [movies, rentals]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'movie',
      headerName: 'Movie',
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) => {
        const movie = movies.find((m) => m.id === row.movieId);
        return movie?.title || 'Unknown';
      },
    },
    {
      field: 'customer',
      headerName: 'Customer',
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) => {
        const customer = customers.find((c) => c.id === row.customerId);
        return customer?.name || 'Unknown';
      },
    },
    { field: 'rentalDate', headerName: 'Rental Date', width: 120 },
    { field: 'expectedReturnDate', headerName: 'Expected Return', width: 120 },
    {
      field: 'actualReturnDate',
      headerName: 'Actual Return',
      width: 120,
      valueGetter: (value, row) => row.actualReturnDate || '-',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        const isLate = params.row.lateFee > 0;
        return (
          <Chip
            size="small"
            label={
              params.row.status === 'active'
                ? 'Active'
                : isLate
                ? 'Late'
                : 'Returned'
            }
            color={
              params.row.status === 'active'
                ? 'primary'
                : isLate
                ? 'error'
                : 'success'
            }
          />
        );
      },
    },
    {
      field: 'lateFee',
      headerName: 'Late Fee',
      width: 100,
      renderCell: (params) =>
        params.value > 0 ? `RWF ${params.value}` : '-',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) =>
        params.row.status === 'active' ? (
          <Button
            size="small"
            variant="contained"
            startIcon={<ReturnIcon />}
            onClick={() => handleReturn(params.row)}
          >
            Return
          </Button>
        ) : null,
    },
  ];

  const handleReturn = (rental) => {
    setSelectedRental(rental);
    setActualReturnDate(new Date().toISOString().split('T')[0]);
    setReturnOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      movieId: '',
      customerId: '',
      rentalDate: new Date().toISOString().split('T')[0],
      expectedReturnDate: '',
    });
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.movieId) newErrors.movieId = 'Please select a movie';
    if (!formData.customerId) newErrors.customerId = 'Please select a customer';
    if (!formData.rentalDate) newErrors.rentalDate = 'Rental date is required';
    if (!formData.expectedReturnDate) newErrors.expectedReturnDate = 'Expected return date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    createRental(formData);
    handleClose();
  };

  const handleReturnSubmit = () => {
    if (selectedRental) {
      returnRental(selectedRental.id, actualReturnDate);
    }
    setReturnOpen(false);
  };

  return (
    <Box className="page-container">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" className="page-title">
          Rentals
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          New Rental
        </Button>
      </Box>

      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={rentals}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
        />
      </Box>

      {/* New Rental Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          New Rental
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box className="form-container">
            <FormControl fullWidth className="form-field" error={!!errors.movieId}>
              <InputLabel>Select Movie</InputLabel>
              <Select
                name="movieId"
                value={formData.movieId}
                label="Select Movie"
                onChange={handleInputChange}
              >
                {availableMovies.map((movie) => (
                  <MenuItem key={movie.id} value={movie.id}>
                    {movie.title} (RWF {movie.rentalPrice}/day)
                  </MenuItem>
                ))}
              </Select>
              {errors.movieId && (
                <Typography variant="caption" color="error">
                  {errors.movieId}
                </Typography>
              )}
            </FormControl>
            
            <FormControl fullWidth className="form-field" error={!!errors.customerId}>
              <InputLabel>Select Customer</InputLabel>
              <Select
                name="customerId"
                value={formData.customerId}
                label="Select Customer"
                onChange={handleInputChange}
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email})
                  </MenuItem>
                ))}
              </Select>
              {errors.customerId && (
                <Typography variant="caption" color="error">
                  {errors.customerId}
                </Typography>
              )}
            </FormControl>
            
            <TextField
              fullWidth
              label="Rental Date"
              name="rentalDate"
              type="date"
              value={formData.rentalDate}
              onChange={handleInputChange}
              error={!!errors.rentalDate}
              helperText={errors.rentalDate}
              className="form-field"
              InputLabelProps={{ shrink: true }}
              required
            />
            
            <TextField
              fullWidth
              label="Expected Return Date"
              name="expectedReturnDate"
              type="date"
              value={formData.expectedReturnDate}
              onChange={handleInputChange}
              error={!!errors.expectedReturnDate}
              helperText={errors.expectedReturnDate}
              className="form-field"
              InputLabelProps={{ shrink: true }}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Create Rental
          </Button>
        </DialogActions>
      </Dialog>

      {/* Return Dialog */}
      <Dialog open={returnOpen} onClose={() => setReturnOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Mark as Returned</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            Movie: {selectedRental && (
              movies.find((m) => m.id === selectedRental.movieId)?.title
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Customer: {selectedRental && (
              customers.find((c) => c.id === selectedRental.customerId)?.name
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Expected Return: {selectedRental?.expectedReturnDate}
          </Typography>
          
          <TextField
            fullWidth
            label="Actual Return Date"
            type="date"
            value={actualReturnDate}
            onChange={(e) => setActualReturnDate(e.target.value)}
            className="form-field"
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReturnOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleReturnSubmit}>
            Confirm Return
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Rentals;