import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Box, 
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);
  
  const { login, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 8, direction: 'rtl' }}>
      <Typography variant="h4" gutterBottom align="center">
        כניסה למערכת
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="אימייל"
          type="email"
          name="email"
          fullWidth
          required
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          dir="rtl"
        />
        
        <TextField
          label="סיסמה"
          type="password"
          name="password"
          fullWidth
          required
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          dir="rtl"
        />
        
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          sx={{ mt: 3 }}
          disabled={submitting}
        >
          {submitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'התחברות'
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default Login;