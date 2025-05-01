import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  TextField, 
  Button, 
  Paper, 
  IconButton, 
  Divider,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [submitting, setSubmitting] = useState(false);
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'נא להזין שם';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'נא להזין אימייל';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'נא להזין כתובת אימייל תקינה';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'נא להזין הודעה';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // ניקוי שגיאות כאשר המשתמש מתקן
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      // שליחת הטופס לשרת
      await axios.post(`${API_URL}/api/contact`, formData);
      
      setSnackbar({
        open: true,
        message: 'ההודעה נשלחה בהצלחה! אחזור אליך בהקדם.',
        severity: 'success'
      });
      
      // איפוס הטופס
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setSnackbar({
        open: true,
        message: 'שגיאה בשליחת ההודעה. אנא נסו שוב.',
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center">
        צור קשר
      </Typography>
      
      <Typography variant="subtitle1" gutterBottom textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
        מוזמנים ליצור איתי קשר בכל שאלה או בקשה
      </Typography>
      
      <Grid container spacing={4} direction="row-reverse">
        {/* פרטי יצירת קשר וכרטיסיות */}
        <Grid item xs={12} md={4}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom textAlign="right">
              דרכי התקשרות
            </Typography>
            
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="flex-end" mb={2}>
                <Box mr={1}>
                  <Typography variant="body1" fontWeight="medium">
                    054-9491947
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    שיחה או הודעה
                  </Typography>
                </Box>
                <PhoneIcon color="primary" />
              </Box>
              
              <Button 
                variant="contained" 
                color="success" 
                fullWidth 
                startIcon={<WhatsAppIcon />}
                component="a"
                href="https://wa.me/972549491947"
                target="_blank"
                sx={{ mb: 2 }}
              >
                שליחת הודעת וואטסאפ
              </Button>
              
              <Button 
                variant="outlined"
                fullWidth
                startIcon={<EmailIcon />}
                component="a"
                href="mailto:leahgenish111@gmail.com"
              >
                leahgenish111@gmail.com
              </Button>
            </Paper>
            
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="flex-end" mb={2}>
                <Box mr={1}>
                  <Typography variant="body1" fontWeight="medium">
                    מיקום הקליניקה
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    רחוב הדקל 7, רמת גן
                  </Typography>
                </Box>
                <LocationOnIcon color="primary" />
              </Box>
              
              <Box sx={{ width: '100%', height: '180px', backgroundColor: '#f0f0f0', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  מפה תוצג כאן
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Grid>
        
        {/* טופס יצירת קשר */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom textAlign="right">
              השאירו פרטים ואחזור אליכם בהקדם
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, direction: 'rtl' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="שם מלא"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!formErrors.name}
                    helperText={formErrors.name || ''}
                    dir="rtl"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="אימייל"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!formErrors.email}
                    helperText={formErrors.email || ''}
                    dir="rtl"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="טלפון"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    dir="rtl"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="תוכן ההודעה"
                    name="message"
                    multiline
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    error={!!formErrors.message}
                    helperText={formErrors.message || ''}
                    dir="rtl"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    endIcon={<SendIcon />}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                        שולח...
                      </>
                    ) : 'שליחת הודעה'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* שעות פעילות */}
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom textAlign="center">
          שעות פעילות
        </Typography>
        
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" component="div" gutterBottom>
                  ימים א'-ה'
                </Typography>
                <Typography variant="body1">
                  9:00 - 19:00
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" component="div" gutterBottom>
                  יום ו'
                </Typography>
                <Typography variant="body1">
                  9:00 - 14:00
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" component="div" gutterBottom>
                  שבת
                </Typography>
                <Typography variant="body1">
                  סגור
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      {/* הודעת הצלחה/שגיאה */}
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
    </Container>
  );
};

export default Contact;