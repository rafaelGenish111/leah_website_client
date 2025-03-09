import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Contact = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center">
        צור קשר
      </Typography>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body1">
          פרטי יצירת קשר וטופס פנייה יופיעו כאן בקרוב.
        </Typography>
      </Box>
    </Container>
  );
};

export default Contact;