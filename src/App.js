import React, { useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme/theme';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import NewDeclaration from './pages/NewDeclaration';
import Dashboard from './pages/Dashboard';
import Articles from './pages/Articles';
import ArticleDetails from './pages/ArticleDetails';
import Gallery from './pages/Gallery';
import Services from './pages/Services';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import { AuthProvider } from './context/AuthContext';
import Booking from './pages/Booking';


// קבע את נתיב הכניסה למנהל - שנה אותו למשהו ייחודי שרק את תדעי
const ADMIN_PATH = "leah-admin-portal"; // יש לשנות זאת לפי הצורך

function App() {
  useEffect(() => {
    // בקשה קלה לשרת כדי "להעיר" אותו
    fetch('https://leah-website-server.onrender.com/api/ping')
      .catch(err => console.log('Wake-up ping error:', err));
  }, []);
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/declaration" element={<NewDeclaration />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/articles/:id" element={<ArticleDetails />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/services" element={<Services />} />
                <Route path="/booking" element={<Booking />} /> 
                <Route path="/contact" element={<Contact />} />
                <Route path={`/${ADMIN_PATH}`} element={<AdminLogin />} /> {/* נתיב מוסתר */}
                <Route path="/dashboard/*" element={<Dashboard />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;