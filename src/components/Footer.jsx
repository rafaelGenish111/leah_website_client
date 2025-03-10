import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Link,
  IconButton
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import XIcon from '@mui/icons-material/X';
import { Link as RouterLink } from 'react-router-dom';


const Footer = () => {
  return (
    <Box
      sx={{
        bgcolor: 'primary.dark',
        color: 'white',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} direction="row-reverse">
          {/* עמודה ראשונה - לוגו ותיאור */}
          <Grid item xs={12} md={4} textAlign="center">
            <img 
               src="/logo.jpeg"  
              alt="Leah Genish" 
              style={{ 
                height: '80px',
              }} 
            />
            <Typography variant="h6" gutterBottom>
              לאה גניש
            </Typography>
            <Typography variant="body2">
              טיפולי עיסוי ורפלקסולוגיה מקצועיים
            </Typography>
          </Grid>
          
          {/* עמודה שניה - ניווט מהיר */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom textAlign="right">
              ניווט מהיר
            </Typography>
            <Box textAlign="right">
              <Link component={RouterLink} to="/" color="inherit" display="block" mb={1}>
                דף הבית
              </Link>
              <Link component={RouterLink} to="/services" color="inherit" display="block" mb={1}>
                השירותים שלנו
              </Link>
              <Link component={RouterLink} to="/articles" color="inherit" display="block" mb={1}>
                מאמרים
              </Link>
              <Link component={RouterLink} to="/gallery" color="inherit" display="block" mb={1}>
                גלריה
              </Link>
              <Link component={RouterLink} to="/contact" color="inherit" display="block" mb={1}>
                צור קשר
              </Link>
              <Link component={RouterLink} to="/declaration" color="inherit" display="block" mb={1}>
                הצהרת בריאות
              </Link>
            </Box>
          </Grid>
          
          {/* עמודה שלישית - פרטי קשר ורשתות חברתיות */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom textAlign="right">
              צור קשר
            </Typography>
            <Box textAlign="right" sx={{ mb: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="flex-end" mb={1}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  054-9491947
                </Typography>
                <PhoneIcon fontSize="small" />
              </Box>
              <Box display="flex" alignItems="center" justifyContent="flex-end" mb={1}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  leahgenish111@gmail.com
                </Typography>
                <EmailIcon fontSize="small" />
              </Box>
            </Box>
            
            <Typography variant="h6" gutterBottom textAlign="right">
              עקבו אחרינו
            </Typography>
            <Box textAlign="right">
              <IconButton color="inherit" aria-label="x" component={RouterLink} to="/leah-admin-portal"  target="_blank">
                <XIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="facebook" component="a" href="https://facebook.com/" target="_blank">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="instagram" component="a" href="https://instagram.com/leah_genish" target="_blank">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="whatsapp" component="a" href="https://wa.me/972549414947" target="_blank">
                <WhatsAppIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        
        <Typography variant="body2" align="center" sx={{ pt: 4 }}>
          © {new Date().getFullYear()} לאה גניש. כל הזכויות שמורות.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;