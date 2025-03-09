import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Services = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center">
        השירותים שלנו
      </Typography>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body1">
          מידע על השירותים השונים שאנו מציעים יופיע כאן בקרוב.
        </Typography>
      </Box>
    </Container>
  );
};

export default Services;