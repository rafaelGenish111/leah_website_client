import React, { useState, useEffect, useRef } from 'react';
import {
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  FormControlLabel,
  Switch,
  CircularProgress,
  Snackbar,
  Alert,
  CardMedia,
  Card
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ArticleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    published: true,
  });
  
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // טעינת מאמר קיים במצב עריכה
  useEffect(() => {
    if (isEditMode) {
      const fetchArticle = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`${API_URL}/api/articles/admin/${id}`, {
            headers: { 'x-auth-token': token }
          });
          
          const article = res.data;
          setFormData({
            title: article.title,
            summary: article.summary,
            content: article.content,
            published: article.published
          });
          
          setImagePreview(article.image);
        } catch (err) {
          console.error('Error fetching article:', err);
          showSnackbar('שגיאה בטעינת המאמר', 'error');
          navigate('/dashboard/articles');
        } finally {
          setLoading(false);
        }
      };

      fetchArticle();
    } else {
      setLoading(false);
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // בדיקת תקינות
    if (!formData.title.trim() || !formData.summary.trim() || !formData.content.trim()) {
      showSnackbar('נא למלא את כל השדות הנדרשים', 'error');
      return;
    }
    
    if (!isEditMode && !image) {
      showSnackbar('נא להעלות תמונה', 'error');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      formDataToSend.append('title', formData.title);
      formDataToSend.append('summary', formData.summary);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('published', formData.published);
      
      if (image) {
        formDataToSend.append('image', image);
      }
      
      let response;
      
      if (isEditMode) {
        response = await axios.put(
          `${API_URL}/api/articles/${id}`,
          formDataToSend,
          {
            headers: {
              'x-auth-token': token,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        showSnackbar('המאמר עודכן בהצלחה', 'success');
      } else {
        response = await axios.post(
          `${API_URL}/api/articles`,
          formDataToSend,
          {
            headers: {
              'x-auth-token': token,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        showSnackbar('המאמר נוצר בהצלחה', 'success');
      }
      
      // המתנה קצרה לפני ניווט בחזרה
      setTimeout(() => {
        navigate('/dashboard/articles');
      }, 1500);
      
    } catch (err) {
      console.error('Error saving article:', err);
      showSnackbar('שגיאה בשמירת המאמר', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>טוען מאמר...</Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        {isEditMode ? 'עריכת מאמר' : 'מאמר חדש'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={3} direction="row-reverse">
          <Grid item xs={12}>
            <TextField
              name="title"
              label="כותרת המאמר"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ dir: 'rtl' }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="summary"
              label="תקציר המאמר"
              value={formData.summary}
              onChange={handleChange}
              fullWidth
              required
              multiline
              rows={3}
              inputProps={{ dir: 'rtl' }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="content"
              label="תוכן המאמר"
              value={formData.content}
              onChange={handleChange}
              fullWidth
              required
              multiline
              rows={10}
              inputProps={{ dir: 'rtl' }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom sx={{ textAlign: 'right' }}>
              תמונת המאמר
            </Typography>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <Button
              variant="outlined"
              onClick={() => fileInputRef.current.click()}
              fullWidth
              sx={{ mb: 2 }}
            >
              {isEditMode ? 'החלף תמונה' : 'העלה תמונה'}
            </Button>
            
            {imagePreview && (
              <Card sx={{ maxWidth: '100%', mb: 2 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={imagePreview}
                  alt="תצוגה מקדימה של התמונה"
                  sx={{ objectFit: 'cover' }}
                />
              </Card>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'right', mt: { xs: 0, md: 4 } }}>
              <FormControlLabel
                control={
                  <Switch
                    name="published"
                    checked={formData.published}
                    onChange={handleChange}
                  />
                }
                label="פרסם מאמר"
                labelPlacement="start"
              />
              
              <Typography variant="body2" color="text.secondary">
                {formData.published 
                  ? 'המאמר יפורסם באתר ויהיה זמין לקריאה' 
                  : 'המאמר יישמר כטיוטה ולא יוצג באתר'}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/dashboard/articles')}
                disabled={submitting}
              >
                ביטול
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
              >
                {submitting ? (
                  <CircularProgress size={24} />
                ) : (
                  isEditMode ? 'עדכן מאמר' : 'צור מאמר'
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      {/* הודעות המערכת */}
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

export default ArticleForm;