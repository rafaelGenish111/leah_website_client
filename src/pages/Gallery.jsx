import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Gallery = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center">
        גלריה
      </Typography>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body1">
          בקרוב תוכלו לראות כאן תמונות מחדר הטיפולים והצוות.
        </Typography>
      </Box>
    </Container>
  );
};

export default Gallery;