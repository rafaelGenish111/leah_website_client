// client/src/components/dashboard/ArticleManager.jsx
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ArticleManager = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/articles/all`, {
          headers: { 'x-auth-token': token }
        });
        setArticles(res.data);
      } catch (err) {
        console.error('Error fetching articles:', err);
        showSnackbar('שגיאה בטעינת המאמרים', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleDeleteClick = (article) => {
    setArticleToDelete(article);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/articles/${articleToDelete._id}`, {
        headers: { 'x-auth-token': token }
      });
      
      setArticles(articles.filter(article => article._id !== articleToDelete._id));
      showSnackbar('המאמר נמחק בהצלחה', 'success');
    } catch (err) {
      console.error('Error deleting article:', err);
      showSnackbar('שגיאה במחיקת המאמר', 'error');
    } finally {
      setDeleteDialogOpen(false);
      setArticleToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setArticleToDelete(null);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography>טוען מאמרים...</Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">ניהול מאמרים</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          component={RouterLink}
          to="/dashboard/articles/new"
        >
          מאמר חדש
        </Button>
      </Box>

      {articles.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" gutterBottom>
            אין מאמרים במערכת
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<Add />}
            component={RouterLink}
            to="/dashboard/articles/new"
            sx={{ mt: 2 }}
          >
            הוסף מאמר ראשון
          </Button>
        </Box>
      ) : (
        <TableContainer>
          <Table sx={{ direction: 'rtl' }}>
            <TableHead>
              <TableRow>
                <TableCell>כותרת</TableCell>
                <TableCell>תאריך</TableCell>
                <TableCell>סטטוס</TableCell>
                <TableCell align="center">פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article._id}>
                  <TableCell>{article.title}</TableCell>
                  <TableCell>{formatDate(article.date)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={article.published ? 'מפורסם' : 'טיוטה'} 
                      color={article.published ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      color="info" 
                      component={RouterLink}
                      to={`/articles/${article._id}`}
                      target="_blank"
                      title="צפייה במאמר"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton 
                      color="primary" 
                      component={RouterLink}
                      to={`/dashboard/articles/edit/${article._id}`}
                      title="עריכת מאמר"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteClick(article)}
                      title="מחיקת מאמר"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* דיאלוג אישור מחיקה */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>האם למחוק את המאמר?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {articleToDelete && `האם אתה בטוח שברצונך למחוק את המאמר "${articleToDelete.title}"? פעולה זו אינה ניתנת לביטול.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>ביטול</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            מחק
          </Button>
        </DialogActions>
      </Dialog>

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

export default ArticleManager;