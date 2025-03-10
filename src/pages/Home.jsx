import React from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  Button,
  Container
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="md">
          <Paper elevation={2} sx={{ p: 3, mt: 4, direction: 'rtl' }}>
            <Typography variant="h5" gutterBottom>
              טיפולי עיסוי ורפלקסולוגיה
            </Typography>
            
            <Typography variant="body1" paragraph>
              אנו מציעים מגוון טיפולי עיסוי ורפלקסולוגיה המותאמים אישית לצרכים שלכם.
              הטיפולים שלנו מסייעים להפחתת מתחים, שיפור זרימת הדם, הקלה בכאבים ושיפור הרגשה כללית.
            </Typography>
            
            <Typography variant="body1">
              לפרטים נוספים ותיאום טיפול, אנא צרו קשר.
            </Typography>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center', direction: 'rtl' }}>
        <Typography variant="h4" gutterBottom>
          ברוכים הבאים למערכת הצהרות הבריאות
        </Typography>
        
        <Typography variant="body1" paragraph>
          מטופלים יקרים, לפני כל טיפול יש למלא הצהרת בריאות.
          הצהרה זו תשמר במערכת ותאפשר לנו להעניק לכם את הטיפול המתאים ביותר.
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Button 
            variant="contained" 
            component={RouterLink} 
            to="/declaration" 
            size="large"
            sx={{ mx: 1 }}
          >
            מילוי הצהרת בריאות חדשה
          </Button>
          
          {/* <Button 
            variant="outlined" 
            component={RouterLink} 
            to="/leah-admin-portal" 
            size="large"
            sx={{ mx: 1, mt: { xs: 2, sm: 0 } }}
          >
            כניסה למטפלים
          </Button> */}
        </Box>
      </Paper>
      

      <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center', direction: 'rtl' }}>
        <Typography variant="h4" gutterBottom>
       זימון תורים און ליין
        </Typography>
        
        <Typography variant="body1" paragraph>
       באפשרותך לזמן תור אונליין על המקום
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Button 
            variant="contained" 
            component={RouterLink} 
            to="/booking" 
            size="large"
            sx={{ mx: 1 }}
          >
            זימון תור
          </Button>
          
          {/* <Button 
            variant="outlined" 
            component={RouterLink} 
            to="/leah-admin-portal" 
            size="large"
            sx={{ mx: 1, mt: { xs: 2, sm: 0 } }}
          >
            כניסה למטפלים
          </Button> */}
        </Box>
      </Paper>
    </Container>
  );
};

export default Home;