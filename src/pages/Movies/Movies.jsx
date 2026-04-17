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
  Card,
  CardContent,
  CardMedia,
  CardActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { genres } from '../../data/mockData';
import '../../styles/main.scss';

const Movies = () => {
  const { movies, addMovie, updateMovie, deleteMovie, getMovieRentals, createRental } = useAppContext();
  const { isAdmin, user } = useAuth();
  
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [rentOpen, setRentOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    releaseYear: '',
    rentalPrice: '',
    totalDvds: '',
    coverImage: '',
    description: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [rentalFormData, setRentalFormData] = useState({
    rentalDate: '',
    days: 1,
  });

  const movieRentals = selectedMovie ? getMovieRentals(selectedMovie.id) : [];

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
      totalDvds: movie.totalDvds || '',
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

  const handleRentClick = () => {
    if (selectedMovie.availableDvds <= 0) {
      alert('No DVDs available for this movie!');
      return;
    }
    setRentalFormData({
      rentalDate: new Date().toISOString().split('T')[0],
      days: 1,
    });
    setRentOpen(true);
  };

  const handleRentalFormChange = (e) => {
    const { name, value } = e.target;
    setRentalFormData((prev) => ({ ...prev, [name]: name === 'days' ? parseInt(value) : value }));
  };

  const handleRentalSubmit = () => {
    if (!rentalFormData.rentalDate || !rentalFormData.days) {
      alert('Please fill in all rental details');
      return;
    }

    const rentalDate = new Date(rentalFormData.rentalDate);
    const expectedReturnDate = new Date(rentalDate);
    expectedReturnDate.setDate(expectedReturnDate.getDate() + rentalFormData.days);

    const rental = {
      customerId: user.id,
      movieId: selectedMovie.id,
      rentalDate: rentalFormData.rentalDate,
      expectedReturnDate: expectedReturnDate.toISOString().split('T')[0],
    };

    createRental(rental);
    setRentOpen(false);
    setViewOpen(false);
    alert(`Rental created successfully for ${selectedMovie.title}!`);
  };

  const handleAdd = () => {
    setSelectedMovie(null);
    setFormData({
      title: '',
      genre: '',
      releaseYear: '',
      rentalPrice: '',
      totalDvds: '',
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
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, coverImage: 'Only image files are allowed' }));
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
    if (isAdmin && !formData.totalDvds) {
      newErrors.totalDvds = 'Total DVDs is required';
    } else if (isAdmin && !/^\d+$/.test(formData.totalDvds)) {
      newErrors.totalDvds = 'Total DVDs must be a number';
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

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 3, gap: 2 }}>
        <Typography variant="h4" sx={{ m: 0, fontWeight: 700 }}>
          Movies
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ minWidth: 120 }}
          >
            Add
          </Button>
        )}
      </Box>

      <Box className="card-grid">
        {movies.map((movie) => (
          <Card key={movie.id} className="movie-card" sx={{ maxWidth: 345, position: 'relative', overflow: 'hidden' }}>
            <CardMedia
              component="img"
              height="200"
              image={movie.coverImage}
              alt={movie.title}
              sx={{ objectFit: 'cover' }}
            />
            <Box
              className="movie-overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                p: 2,
              }}
            >
              <Typography variant="h6" component="div" sx={{ color: 'white', fontWeight: 'bold' }}>
                {movie.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                {movie.genre} • {movie.releaseYear} • RWF {movie.rentalPrice}/day
              </Typography>
            </Box>
<Box
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                display: 'flex',
                gap: 0.5,
                zIndex: 3,
                backgroundColor: 'rgba(0,0,0,0.7)',
                borderRadius: 2,
                p: 0.5,
                backdropFilter: 'blur(4px)',
                pointerEvents: 'auto'
              }}
            >
              <IconButton 
                size="small" 
                onClick={() => handleView(movie)} 
                sx={{ 
                  color: 'white', 
                  minWidth: 32, 
                  width: 32, 
                  height: 32,
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
              {isAdmin && (
                <>
                  <IconButton 
                    size="small" 
                    onClick={() => handleEdit(movie)} 
                    sx={{ 
                      color: 'white', 
                      minWidth: 32, 
                      width: 32, 
                      height: 32,
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDeleteClick(movie)} 
                    sx={{ 
                      color: 'white', 
                      minWidth: 32, 
                      width: 32, 
                      height: 32,
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </>
              )}
            </Box>
          </Card>
        ))}
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
            {isAdmin && (
              <TextField
                fullWidth
                label="Total DVDs Available"
                name="totalDvds"
                type="number"
                inputProps={{ min: 1 }}
                value={formData.totalDvds}
                onChange={handleInputChange}
                error={!!errors.totalDvds}
                helperText={errors.totalDvds}
                className="form-field"
                required
              />
            )}
            
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
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2, alignItems: { xs: 'center', sm: 'flex-start' } }}>
                <Box
                  component="img"
                  src={selectedMovie.coverImage}
                  alt={selectedMovie.title}
                  sx={{ width: { xs: 120, sm: 150 }, height: { xs: 180, sm: 225 }, objectFit: 'cover', borderRadius: 2 }}
                />
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography variant="h5" gutterBottom>
                    {selectedMovie.title}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Chip label={selectedMovie.genre} color="primary" sx={{ mr: 0.5, mb: 0.5 }} />
                  </Box>
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
        <DialogActions sx={{ p: 2 }}>
          {!isAdmin && (
            <Button variant="contained" color="primary" onClick={handleRentClick}>
              Rent Now
            </Button>
          )}
          <Button onClick={() => setViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Rental Dialog */}
      <Dialog open={rentOpen} onClose={() => setRentOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Rent: {selectedMovie?.title}
          <IconButton onClick={() => setRentOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Rental Date"
              name="rentalDate"
              type="date"
              value={rentalFormData.rentalDate}
              onChange={handleRentalFormChange}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Number of Days"
              name="days"
              type="number"
              inputProps={{ min: 1, max: 30 }}
              value={rentalFormData.days}
              onChange={handleRentalFormChange}
              sx={{ mb: 2 }}
            />
            <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Rental Price:</strong> RWF {selectedMovie?.rentalPrice}/day
              </Typography>
              <Typography variant="h6" color="primary">
                <strong>Total:</strong> RWF {(selectedMovie?.rentalPrice || 0) * rentalFormData.days}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRentOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleRentalSubmit}>
            Confirm Rental
          </Button>
        </DialogActions>
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