import React, { useState, useEffect } from 'react';
import {
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
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/articles/all`, {
          headers: { 'x-auth-token': token }
        });
        
        setArticles(response.data);
        setFilteredArticles(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('שגיאה בטעינת המאמרים. אנא נסה שוב.');
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, []);

  useEffect(() => {
    const results = articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArticles(results);
  }, [searchTerm, articles]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteClick = (article) => {
    setArticleToDelete(article);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setArticleToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/articles/${articleToDelete._id}`, {
        headers: { 'x-auth-token': token }
      });
      
      // עדכן את רשימת המאמרים לאחר המחיקה
      setArticles(articles.filter(article => article._id !== articleToDelete._id));
      
    } catch (err) {
      console.error('Error deleting article:', err);
      setError('שגיאה במחיקת המאמר. אנא נסה שוב.');
    } finally {
      setDeleteDialogOpen(false);
      setArticleToDelete(null);
    }
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

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4, mb: 4, direction: 'rtl' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">ניהול מאמרים</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/dashboard/articles/new"
        >
          מאמר חדש
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="חיפוש מאמרים..."
        value={searchTerm}
        onChange={handleSearchChange}
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="right">כותרת</TableCell>
              <TableCell align="right">תאריך</TableCell>
              <TableCell align="right">סטטוס</TableCell>
              <TableCell align="right">פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <TableRow key={article._id}>
                  <TableCell align="right">
                    <Box sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {article.title}
                    </Box>
                  </TableCell>
                  <TableCell align="right">{formatDate(article.date)}</TableCell>
                  <TableCell align="right">
                    <Chip
                      label={article.published ? 'מפורסם' : 'טיוטה'}
                      color={article.published ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      component="a"
                      href={`/articles/${article._id}`}
                      target="_blank"
                      size="small"
                      title="צפייה במאמר"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      component={RouterLink}
                      to={`/dashboard/articles/edit/${article._id}`}
                      size="small"
                      title="עריכת מאמר"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(article)}
                      size="small"
                      title="מחיקת מאמר"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  לא נמצאו מאמרים. הוסף מאמר חדש כדי להתחיל.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* דיאלוג אישור מחיקה */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>למחוק את המאמר?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            האם אתה בטוח שברצונך למחוק את המאמר "{articleToDelete?.title}"? פעולה זו לא ניתנת לביטול.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            ביטול
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            מחק
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ArticlesList;
