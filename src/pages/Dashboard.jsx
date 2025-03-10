import React, { useEffect } from 'react';
import { 
  Container, 
  CircularProgress, 
  Box, 
  Typography,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TherapistDashboard from '../components/TherapistDashboard';
import ArticleManager from '../components/dashboard/ArticleManager';
import ArticleForm from '../components/dashboard/ArticleForm';
import SessionTimeout from '../components/SessionTimeout'; 
import GalleryManager from '../components/dashboard/GalleryManager';

const Dashboard = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/leah-admin-portal'); // עדכן לנתיב הנכון של דף ההתחברות
    }
  }, [isAuthenticated, loading, navigate]);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!isAuthenticated) {
    return null; // יעביר לדף ההתחברות דרך useEffect
  }
  
  // זיהוי הטאב הפעיל לפי הנתיב
  const getActiveTab = () => {
    if (location.pathname.includes('/dashboard/articles')) {
      return 1;
    }
    return 0;
  };
  
  const handleTabChange = (event, newValue) => {
    if (newValue === 0) {
      navigate('/dashboard');
    } else if (newValue === 1) {
      navigate('/dashboard/articles');
    } else if (newValue === 2) {
      navigate('/dashboard/gallery');
    }
  };
  
  return (
    <Container maxWidth="lg">
      <Paper sx={{ mb: 3, borderRadius: 0 }}>
        <Tabs
          value={getActiveTab()}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="הצהרות בריאות" />
          <Tab label="ניהול מאמרים" />
          <Tab label="ניהול גלריה" />
        </Tabs>
      </Paper>
      
      <Routes>
        <Route path="/" element={<TherapistDashboard />} />
        <Route path="/articles" element={<ArticleManager />} />
        <Route path="/articles/new" element={<ArticleForm />} />
        <Route path="/articles/edit/:id" element={<ArticleForm />} />
        <Route path="/gallery" element={<GalleryManager />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <SessionTimeout />
    </Container>
  );
};

export default Dashboard;