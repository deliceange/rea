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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import { genres } from '../../data/mockData';
import '../../styles/main.scss';

const Movies = () => {
  const { movies, addMovie, updateMovie, deleteMovie, getMovieRentals } = useAppContext();
  
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    releaseYear: '',
    rentalPrice: '',
    coverImage: '',
    description: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'coverImage',
      headerName: 'Cover',
      width: 80,
      renderCell: (params) => (
        <Box
          component="img"
          src={params.value}
          alt={params.row.title}
          sx={{ width: 40, height: 60, objectFit: 'cover', borderRadius: 1 }}
        />
      ),
    },
    { field: 'title', headerName: 'Title', flex: 1, minWidth: 150 },
    { field: 'genre', headerName: 'Genre', width: 100 },
    { field: 'releaseYear', headerName: 'Year', width: 90 },
    {
      field: 'rentalPrice',
      headerName: 'Price (RWF)',
      width: 110,
      renderCell: (params) => `RWF ${params.value}`,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box className="action-buttons">
          <IconButton
            size="small"
            onClick={() => handleView(params.row)}
            color="primary"
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row)}
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteClick(params.row)}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleView = (movie) => {
    setSelectedMovie(movie);
    setViewOpen(true);
  };

  const handleEdit = (movie) => {
    setSelectedMovie(movie);
    setFormData({
      title: movie.title,
      genre: movie.genre,
      releaseYear: movie.releaseYear,
      rentalPrice: movie.rentalPrice,
      coverImage: movie.coverImage,
      description: movie.description || '',
    });
    setImagePreview(movie.coverImage);
    setOpen(true);
  };

  const handleDeleteClick = (movie) => {
    setSelectedMovie(movie);
    setDeleteOpen(true);
  };

  const handleAdd = () => {
    setSelectedMovie(null);
    setFormData({
      title: '',
      genre: '',
      releaseYear: '',
      rentalPrice: '',
      coverImage: '',
      description: '',
    });
    setImagePreview('');
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMovie(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setErrors((prev) => ({ ...prev, coverImage: 'Only JPG and PNG files are allowed' }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, coverImage: 'File size must be less than 2MB' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, coverImage: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.genre) newErrors.genre = 'Genre is required';
    if (!formData.releaseYear) newErrors.releaseYear = 'Release year is required';
    if (!formData.rentalPrice) {
      newErrors.rentalPrice = 'Rental price is required';
    } else if (!/^\d+$/.test(formData.rentalPrice)) {
      newErrors.rentalPrice = 'Rental price must be a number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    if (selectedMovie) {
      updateMovie(selectedMovie.id, formData);
    } else {
      addMovie(formData);
    }
    handleClose();
  };

  const handleConfirmDelete = () => {
    if (selectedMovie) {
      deleteMovie(selectedMovie.id);
    }
    setDeleteOpen(false);
    setSelectedMovie(null);
  };

  const movieRentals = selectedMovie ? getMovieRentals(selectedMovie.id) : [];

  return (
    <Box className="page-container">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" className="page-title">
          Movies
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Movie
        </Button>
      </Box>

      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={movies}
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
          {selectedMovie ? 'Edit Movie' : 'Add New Movie'}
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box className="form-container" sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              error={!!errors.title}
              helperText={errors.title}
              className="form-field"
              required
            />
            
            <FormControl fullWidth className="form-field" error={!!errors.genre}>
              <InputLabel>Genre</InputLabel>
              <Select
                name="genre"
                value={formData.genre}
                label="Genre"
                onChange={handleInputChange}
                required
              >
                {genres.map((g) => (
                  <MenuItem key={g} value={g}>{g}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Release Year"
              name="releaseYear"
              type="number"
              value={formData.releaseYear}
              onChange={handleInputChange}
              error={!!errors.releaseYear}
              helperText={errors.releaseYear}
              className="form-field"
              required
            />
            
            <TextField
              fullWidth
              label="Rental Price (RWF)"
              name="rentalPrice"
              type="number"
              value={formData.rentalPrice}
              onChange={handleInputChange}
              error={!!errors.rentalPrice}
              helperText={errors.rentalPrice}
              className="form-field"
              required
            />
            
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="form-field"
            />
            
            <Box className="form-field">
              <Typography variant="body2" gutterBottom>
                Cover Image (JPG/PNG, max 2MB)
              </Typography>
              <label className="upload-area">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <CloudUploadIcon sx={{ fontSize: 40, color: '#666' }} />
                <Typography variant="body2">
                  Click to upload cover image
                </Typography>
              </label>
              {errors.coverImage && (
                <Typography variant="caption" color="error">
                  {errors.coverImage}
                </Typography>
              )}
            </Box>
            
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="image-preview"
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {selectedMovie ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Movie Details
          <IconButton onClick={() => setViewOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedMovie && (
            <Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box
                  component="img"
                  src={selectedMovie.coverImage}
                  alt={selectedMovie.title}
                  sx={{ width: 150, height: 225, objectFit: 'cover', borderRadius: 2 }}
                />
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {selectedMovie.title}
                  </Typography>
                  <Chip label={selectedMovie.genre} color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {selectedMovie.releaseYear}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    RWF {selectedMovie.rentalPrice}/day
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    {selectedMovie.description}
                  </Typography>
                </Box>
              </Box>
              
              <Box className="details-section">
                <Typography variant="h6" gutterBottom>
                  Rental History
                </Typography>
                {movieRentals.length > 0 ? (
                  <Box className="activity-log">
                    {movieRentals.map((rental) => (
                      <Box key={rental.id} className="log-item">
                        <Typography variant="body2">
                          <strong>{rental.customerName}</strong> - {rental.rentalDate} to {rental.expectedReturnDate}
                        </Typography>
                        <Chip
                          size="small"
                          label={rental.status}
                          color={rental.status === 'active' ? 'primary' : 'success'}
                          sx={{ mt: 0.5 }}
                        />
                        {rental.lateFee > 0 && (
                          <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                            Late fee: RWF {rental.lateFee}
                          </Typography>
                        )}
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
            Are you sure you want to delete "{selectedMovie?.title}"?
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

export default Movies;