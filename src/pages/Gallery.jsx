import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent,
  CircularProgress,
  Tabs,
  Tab,
  Dialog,
  DialogContent,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // טעינת התמונות בטעינת הדף
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/gallery/public`);
        setImages(res.data);
      } catch (err) {
        console.error('Error fetching gallery images:', err);
        setError('שגיאה בטעינת התמונות. אנא נסה לרענן את הדף.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // סינון תמונות לפי קטגוריה
  const filteredImages = activeTab === 'all' 
    ? images 
    : images.filter(image => image.category === activeTab);

  // החלפת לשונית פעילה
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // פתיחת דיאלוג הצגת תמונה מוגדלת
  const handleOpenImage = (image) => {
    setSelectedImage(image);
    setOpenDialog(true);
  };

  // סגירת דיאלוג
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // ארגון הקטגוריות לטאבים
  const tabs = [
    { value: 'all', label: 'הכל' },
    { value: 'treatment_room', label: 'חדר טיפולים' },
    { value: 'massage', label: 'עיסוי' },
    { value: 'reflexology', label: 'רפלקסולוגיה' },
    { value: 'testimonials', label: 'המלצות' },
    { value: 'general', label: 'כללי' }
  ];

  // בדיקה אם קיימות תמונות בקטגוריה מסוימת
  const hasImagesInCategory = (category) => {
    if (category === 'all') return images.length > 0;
    return images.some(image => image.category === category);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          טוען תמונות...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center">
        גלריה
      </Typography>

      {images.length === 0 ? (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body1">
            בקרוב תוכלו לראות כאן תמונות מחדר הטיפולים והצוות.
          </Typography>
        </Box>
      ) : (
        <>
          {/* לשוניות קטגוריות */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
              centered
              sx={{ direction: 'rtl' }}
            >
              {tabs.map((tab) => (
                hasImagesInCategory(tab.value) && (
                  <Tab 
                    key={tab.value} 
                    value={tab.value} 
                    label={tab.label} 
                  />
                )
              ))}
            </Tabs>
          </Box>

          {/* תצוגת התמונות */}
          <Grid container spacing={3}>
            {filteredImages.map((image) => (
              <Grid item xs={12} sm={6} md={4} key={image._id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: 3
                    }
                  }}
                  onClick={() => handleOpenImage(image)}
                >
                  <CardMedia
                    component="img"
                    height="250"
                    image={image.image}
                    alt={image.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom textAlign="center">
                      {image.title}
                    </Typography>
                    {image.description && (
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        {image.description}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* דיאלוג הצגת תמונה מוגדלת */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 1, position: 'relative' }}>
          <IconButton
            sx={{ position: 'absolute', right: 8, top: 8, bgcolor: 'rgba(0,0,0,0.4)', color: 'white' }}
            onClick={handleCloseDialog}
          >
            <CloseIcon />
          </IconButton>
          {selectedImage && (
            <Box sx={{ textAlign: 'center' }}>
              <img 
                src={selectedImage.image} 
                alt={selectedImage.title} 
                style={{ maxWidth: '100%', maxHeight: '80vh' }} 
              />
              <Typography variant="h6" sx={{ mt: 2 }}>
                {selectedImage.title}
              </Typography>
              {selectedImage.description && (
                <Typography variant="body1" color="text.secondary">
                  {selectedImage.description}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Gallery;