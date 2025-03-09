import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button,
  Box,
  TextField,
  InputAdornment
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // בשלב זה נשתמש בנתונים מדומים עד שנחבר למסד נתונים
  useEffect(() => {
    const dummyArticles = [
      {
        id: 1,
        title: 'היתרונות הבריאותיים של עיסוי',
        summary: 'עיסוי אינו רק פינוק, אלא טיפול בעל יתרונות בריאותיים רבים. במאמר זה נדון ביתרונות העיקריים של עיסוי קבוע.',
        image: 'https://via.placeholder.com/400x250?text=עיסוי+בריאותי',
        date: '15 פברואר 2025'
      },
      {
        id: 2,
        title: 'רפלקסולוגיה ככלי לטיפול בכאבי ראש',
        summary: 'כיצד רפלקסולוגיה יכולה לסייע בהקלה על כאבי ראש וכאבי מיגרנה. טכניקות ונקודות לחיצה מומלצות.',
        image: 'https://via.placeholder.com/400x250?text=רפלקסולוגיה',
        date: '3 ינואר 2025'
      },
      {
        id: 3,
        title: 'מתח ושחרור: טיפול בלחץ נפשי באמצעות עיסוי',
        summary: 'כיצד עיסוי יכול לסייע בהפחתת סטרס ולחץ נפשי. טכניקות ושיטות להרגעת מערכת העצבים.',
        image: 'https://via.placeholder.com/400x250?text=מתח+ושחרור',
        date: '22 דצמבר 2024'
      },
      {
        id: 4,
        title: 'עיסוי במהלך ההריון: היתרונות והשיקולים',
        summary: 'הנחיות ויתרונות לעיסוי במהלך ההריון. מתי מומלץ ומתי יש להימנע, וכיצד הוא יכול להקל על תסמיני הריון נפוצים.',
        image: 'https://via.placeholder.com/400x250?text=עיסוי+בהריון',
        date: '5 נובמבר 2024'
      },
    ];
    
    setArticles(dummyArticles);
    setFilteredArticles(dummyArticles);
    

    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/articles`);
        setArticles(response.data);
        setFilteredArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
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
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center">
        מאמרים ומידע מקצועי
      </Typography>
      
      <Box sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
        <TextField
          fullWidth
          placeholder="חיפוש מאמרים..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          sx={{ direction: 'rtl' }}
        />
      </Box>
      
      <Grid container spacing={4}>
        {filteredArticles.map((article) => (
          <Grid item xs={12} sm={6} md={4} key={article.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={article.image}
                alt={article.title}
              />
              <CardContent sx={{ flexGrow: 1, textAlign: 'right' }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {article.date}
                </Typography>
                <Typography variant="body1">
                  {article.summary}
                </Typography>
              </CardContent>
              <Box p={2} textAlign="center">
                <Button 
                  variant="contained" 
                  component={RouterLink} 
                  to={`/articles/${article.id}`}
                >
                  קרא עוד
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {filteredArticles.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6">
            לא נמצאו מאמרים התואמים את החיפוש שלך.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Articles;
