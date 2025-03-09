import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Divider,
  Button,
  Breadcrumbs,
  Link,
  CircularProgress
} from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ArticleDetails = () => {
  const { id } = useParams();
//   const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/articles/${id}`);
        setArticle(response.data);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('המאמר לא נמצא או שאינו זמין');
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [id]);
  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd בMMMM yyyy', { locale: he });
    } catch (e) {
      return dateString;
    }
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          טוען מאמר...
        </Typography>
      </Container>
    );
  }
  
  if (error || !article) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error || 'המאמר לא נמצא'}
        </Typography>
        <Button 
          variant="contained" 
          component={RouterLink} 
          to="/articles" 
          sx={{ mt: 2 }}
        >
          חזרה לכל המאמרים
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2, direction: 'rtl' }}>
        <Link component={RouterLink} to="/" color="inherit">
          דף הבית
        </Link>
        <Link component={RouterLink} to="/articles" color="inherit">
          מאמרים
        </Link>
        <Typography color="text.primary">{article.title}</Typography>
      </Breadcrumbs>
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Typography variant="h3" component="h1" gutterBottom textAlign="right">
          {article.title}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            מאת {article.author} | פורסם: {formatDate(article.date)}
          </Typography>
        </Box>
        
        <Box 
          component="img" 
          src={article.image} 
          alt={article.title}
          sx={{
            width: '100%',
            height: 'auto',
            maxHeight: 400,
            objectFit: 'cover',
            borderRadius: 1,
            mb: 3
          }}
        />
        
        <Box 
          sx={{ 
            '& p, & ul, & ol, & h3': { 
              textAlign: 'right',
              direction: 'rtl'
            },
            '& h3': {
              mt: 4,
              mb: 2,
              color: 'primary.main'
            },
            '& ul, & ol': {
              paddingRight: 3,
              paddingLeft: 0
            }
          }}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </Paper>
      
      <Divider sx={{ my: 4 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Button 
          variant="contained" 
          component={RouterLink} 
          to="/contact" 
          sx={{ mb: 2 }}
        >
          קביעת תור לטיפול
        </Button>
        
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />} 
          component={RouterLink} 
          to="/articles"
          sx={{ mb: 2 }}
        >
          חזרה לכל המאמרים
        </Button>
      </Box>
    </Container>
  );
};

export default ArticleDetails;