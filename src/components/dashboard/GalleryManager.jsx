import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  DragIndicator as DragIcon
} from '@mui/icons-material';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const GalleryManager = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    published: true,
    order: 0
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // קטגוריות לבחירה
  const categories = [
    { value: 'general', label: 'כללי' },
    { value: 'treatment_room', label: 'חדר טיפולים' },
    { value: 'massage', label: 'עיסוי' },
    { value: 'reflexology', label: 'רפלקסולוגיה' },
    { value: 'testimonials', label: 'המלצות' }
  ];

  // טעינת התמונות בטעינת הדף
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/gallery`, {
          headers: { 'x-auth-token': token }
        });
        setImages(res.data);
        setFilteredImages(res.data);
      } catch (err) {
        console.error('Error fetching gallery images:', err);
        showSnackbar('שגיאה בטעינת התמונות', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // סינון תמונות לפי חיפוש
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredImages(images);
    } else {
      const results = images.filter(
        image => 
          image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          image.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredImages(results);
    }
  }, [searchTerm, images]);

  // טיפול בשינוי בשדות הטופס
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // טיפול בשינוי תמונה
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // פתיחת דיאלוג הוספת תמונה
  const handleOpenAddDialog = () => {
    setFormData({
      title: '',
      description: '',
      category: 'general',
      published: true,
      order: 0
    });
    setImageFile(null);
    setImagePreview('');
    setOpenAddDialog(true);
  };

  // פתיחת דיאלוג עריכת תמונה
  const handleOpenEditDialog = (image) => {
    setCurrentImage(image);
    setFormData({
      title: image.title,
      description: image.description || '',
      category: image.category || 'general',
      published: image.published,
      order: image.order || 0
    });
    setImagePreview(image.image);
    setImageFile(null);
    setOpenEditDialog(true);
  };

  // פתיחת דיאלוג מחיקת תמונה
  const handleOpenDeleteDialog = (image) => {
    setCurrentImage(image);
    setOpenDeleteDialog(true);
  };

  // שמירת תמונה חדשה
  const handleAddImage = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      showSnackbar('נא להעלות תמונה', 'error');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('title', formData.title);
      formDataToSubmit.append('description', formData.description);
      formDataToSubmit.append('category', formData.category);
      formDataToSubmit.append('published', formData.published);
      formDataToSubmit.append('order', formData.order);
      formDataToSubmit.append('image', imageFile);
      
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/api/gallery`, formDataToSubmit, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setImages([...images, res.data]);
      showSnackbar('התמונה נוספה בהצלחה', 'success');
      setOpenAddDialog(false);
    } catch (err) {
      console.error('Error adding image:', err);
      showSnackbar('שגיאה בהוספת התמונה', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // עדכון תמונה קיימת
  const handleUpdateImage = async (e) => {
    e.preventDefault();
    
    if (!currentImage) return;
    
    setSubmitting(true);
    
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('title', formData.title);
      formDataToSubmit.append('description', formData.description);
      formDataToSubmit.append('category', formData.category);
      formDataToSubmit.append('published', formData.published);
      formDataToSubmit.append('order', formData.order);
      
      if (imageFile) {
        formDataToSubmit.append('image', imageFile);
      }
      
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/api/gallery/${currentImage._id}`, formDataToSubmit, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // עדכון המערך המקומי
      setImages(images.map(img => img._id === currentImage._id ? res.data : img));
      
      showSnackbar('התמונה עודכנה בהצלחה', 'success');
      setOpenEditDialog(false);
    } catch (err) {
      console.error('Error updating image:', err);
      showSnackbar('שגיאה בעדכון התמונה', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // מחיקת תמונה
  const handleDeleteImage = async () => {
    if (!currentImage) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/gallery/${currentImage._id}`, {
        headers: { 'x-auth-token': token }
      });
      
      // עדכון המערך המקומי
      setImages(images.filter(img => img._id !== currentImage._id));
      
      showSnackbar('התמונה נמחקה בהצלחה', 'success');
      setOpenDeleteDialog(false);
    } catch (err) {
      console.error('Error deleting image:', err);
      showSnackbar('שגיאה במחיקת התמונה', 'error');
    }
  };

  // סגירת כל הדיאלוגים
  const handleCloseDialogs = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setCurrentImage(null);
  };

  // הצגת הודעת סנאקבר
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // סגירת סנאקבר
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // שליפת שם הקטגוריה לפי ערך
  const getCategoryLabel = (value) => {
    const category = categories.find(cat => cat.value === value);
    return category ? category.label : value;
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>טוען תמונות...</Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">ניהול גלריה</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          הוספת תמונה
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="חיפוש תמונות..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        margin="normal"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {filteredImages.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" gutterBottom>
            אין תמונות בגלריה
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{ mt: 2 }}
          >
            הוסף תמונה ראשונה
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredImages.map((image) => (
            <Grid item xs={12} sm={6} md={4} key={image._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={image.image}
                    alt={image.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  {!image.published && (
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 10, 
                        right: 10, 
                        bgcolor: 'rgba(0,0,0,0.6)',
                        borderRadius: '50%',
                        p: 0.5  
                      }}
                    >
                      <VisibilityOffIcon color="error" />
                    </Box>
                  )}
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {image.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    קטגוריה: {getCategoryLabel(image.category)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    סדר: {image.order}
                  </Typography>
                  {image.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {image.description}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenEditDialog(image)}
                    title="ערוך תמונה"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenDeleteDialog(image)} 
                    color="error"
                    title="מחק תמונה"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <Box sx={{ flexGrow: 1 }} />
                  <IconButton
                    size="small"
                    title="סדר תמונות"
                    sx={{ cursor: 'grab' }}
                  >
                    <DragIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* דיאלוג הוספת תמונה */}
      <Dialog open={openAddDialog} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
        <form onSubmit={handleAddImage}>
          <DialogTitle>הוספת תמונה לגלריה</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="כותרת"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>קטגוריה</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    label="קטגוריה"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="סדר הצגה"
                  name="order"
                  type="number"
                  value={formData.order}
                  onChange={handleFormChange}
                  helperText="מספר נמוך יותר יוצג ראשון"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.published}
                      onChange={handleFormChange}
                      name="published"
                    />
                  }
                  label="פרסם תמונה"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="תיאור"
                  name="description"
                  multiline
                  rows={2}
                  value={formData.description}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  בחר תמונה
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                {imagePreview && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <img
                      src={imagePreview}
                      alt="תצוגה מקדימה"
                      style={{ maxWidth: '100%', maxHeight: '200px' }}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>ביטול</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={!imageFile || !formData.title || submitting}
            >
              {submitting ? <CircularProgress size={24} /> : 'הוסף תמונה'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* דיאלוג עריכת תמונה */}
      <Dialog open={openEditDialog} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
        <form onSubmit={handleUpdateImage}>
          <DialogTitle>עריכת תמונה</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="כותרת"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>קטגוריה</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    label="קטגוריה"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="סדר הצגה"
                  name="order"
                  type="number"
                  value={formData.order}
                  onChange={handleFormChange}
                  helperText="מספר נמוך יותר יוצג ראשון"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.published}
                      onChange={handleFormChange}
                      name="published"
                    />
                  }
                  label="פרסם תמונה"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="תיאור"
                  name="description"
                  multiline
                  rows={2}
                  value={formData.description}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  החלף תמונה
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                {imagePreview && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <img
                      src={imagePreview}
                      alt="תצוגה מקדימה"
                      style={{ maxWidth: '100%', maxHeight: '200px' }}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>ביטול</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={!formData.title || submitting}
            >
              {submitting ? <CircularProgress size={24} /> : 'עדכן תמונה'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* דיאלוג מחיקת תמונה */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialogs}>
        <DialogTitle>מחיקת תמונה</DialogTitle>
        <DialogContent>
          <DialogContentText>
            האם אתה בטוח שברצונך למחוק את התמונה "{currentImage?.title}"?
            פעולה זו אינה ניתנת לשחזור.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>ביטול</Button>
          <Button onClick={handleDeleteImage} color="error">
            מחק
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar להודעות */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default GalleryManager;