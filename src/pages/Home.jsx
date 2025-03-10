import React from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  Button,
  Container, 
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="lg">
      {/* באנר ראשי */}
      <Paper elevation={3} sx={{ 
        p: { xs: 3, md: 6 }, 
        mt: 4, 
        textAlign: 'center', 
        direction: 'rtl',
        background: 'linear-gradient(to right, #f0e6ea, #ffffff)'
      }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#8c7b7f' }}>
          לאה גניש - עיסוי ורפלקסולוגיה
        </Typography>
        
        <Typography variant="h6" paragraph>
          טיפולי עיסוי ורפלקסולוגיה מקצועיים לאיזון הגוף והנפש
        </Typography>
        
        <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
          <Button 
            variant="contained" 
            component={RouterLink} 
            to="/booking" 
            size="large"
            sx={{ minWidth: 150 }}
          >
            קביעת תור
          </Button>
          
          <Button 
            variant="outlined" 
            component={RouterLink} 
            to="/declaration" 
            size="large"
            sx={{ minWidth: 150 }}
          >
            הצהרת בריאות
          </Button>
        </Box>
      </Paper>
      
      {/* מידע על הטיפולים */}
      <Grid container spacing={4} sx={{ mt: 4, mb: 6, direction: 'rtl' }}>
        {/* טיפולי עיסוי */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>
                טיפולי עיסוי הוליסטי
              </Typography>
              
              <Typography variant="body1" paragraph>
                עיסוי הוליסטי הוא טיפול המשלב טכניקות מגוונות המותאמות באופן אישי לצרכי המטופל. 
                הטיפול מיועד להקלה על כאבי גב, צוואר וכתפיים תפוסים, שחרור מתחים שרירים, 
                שיפור זרימת הדם והפחתת לחץ נפשי.
              </Typography>
              
              <Typography variant="body1">
                בטיפול אנו משתמשים בשמנים טבעיים איכותיים, בתנועות עיסוי מקצועיות 
                וביכולת התאמה אישית לכל מטופל בהתאם לצרכיו ולמצבו הבריאותי.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* רפלקסולוגיה */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>
                רפלקסולוגיה
              </Typography>
              
              <Typography variant="body1" paragraph>
                רפלקסולוגיה היא שיטת טיפול עתיקה המבוססת על לחיצות בכפות הרגליים, 
                המשקפות את כל איברי הגוף ומערכותיו. באמצעות לחיצות ממוקדות ניתן לטפל 
                במגוון רחב של בעיות כמו הפרעות במערכת העיכול, כאבי אוזניים, סינוסיטיס,
                קשיי פוריות, כאבי מחזור ועוד.
              </Typography>
              
              <Typography variant="body1">
                הטיפול ברפלקסולוגיה מסייע לאיזון מערכות הגוף, הפחתת מתחים, 
                חיזוק מערכת החיסון ושיפור תחושת הרווחה הכללית.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* יתרונות הטיפולים */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>
                היתרונות של הטיפולים שלנו
              </Typography>
              
              <Typography variant="body1" paragraph>
                הטיפולים מסייעים במגוון רחב של מצבים בריאותיים ומציעים הקלה משמעותית:
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ mb: 1 }}>• הקלה על כאבים כרוניים וכאבי שרירים</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>• שיפור תנועתיות והגמשת השרירים</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>• הפחתת לחץ וחרדה</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ mb: 1 }}>• שיפור איכות השינה</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>• חיזוק מערכת החיסון</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>• איזון הגוף והנפש</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* הזמנה אישית */}
        <Grid item xs={12}>
          <Card elevation={2} sx={{ backgroundColor: '#f0e6ea' }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h5" gutterBottom>
                הזמנה אישית מלאה
              </Typography>
              
              <Typography variant="body1" paragraph>
                אני מזמינה אתכם לחוויית טיפול מקצועית ומותאמת אישית. בקליניקה שלי בירושלים 
                תזכו לטיפול מסור, סביבה נעימה ורגועה ותוצאות מוכחות. 
                יחד נבנה תכנית טיפול המתאימה לצרכים הייחודיים שלכם.
              </Typography>
              
              <Button 
                variant="contained" 
                component={RouterLink} 
                to="/contact" 
                size="large"
                sx={{ mt: 2 }}
              >
                יצירת קשר
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    {/* <Container maxWidth="md">
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
          </Button> */}
          
          {/* <Button 
            variant="outlined" 
            component={RouterLink} 
            to="/leah-admin-portal" 
            size="large"
            sx={{ mx: 1, mt: { xs: 2, sm: 0 } }}
            >
            כניסה למטפלים
            </Button> */}
        {/* </Box>
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
           */}
          {/* <Button 
            variant="outlined" 
            component={RouterLink} 
            to="/leah-admin-portal" 
            size="large"
            sx={{ mx: 1, mt: { xs: 2, sm: 0 } }}
            >
            כניסה למטפלים
            </Button> */}
        {/* </Box>
      </Paper>
    </Container> */}
            </Container>
  );
};

export default Home;