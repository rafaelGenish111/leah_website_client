import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const navItems = [
    { title: 'דף הבית', path: '/' },
    { title: 'השירותים שלנו', path: '/services' },
    { title: 'מאמרים', path: '/articles' },
    { title: 'גלריה', path: '/gallery' },
    { title: 'קביעת תורים', path: '/booking' },
    { title: 'צור קשר', path: '/contact' },
    { title: 'הצהרת בריאות', path: '/declaration' }
  ];

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };
  
  const drawer = (
    <Box
      sx={{ width: 250, direction: 'rtl' }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navItems.map((item) => (
          <ListItem 
            button 
            component={RouterLink} 
            to={item.path} 
            key={item.title}
          >
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
        {isAuthenticated && (
          <ListItem 
            button 
            component={RouterLink} 
            to="/dashboard"
          >
            <ListItemText primary="אזור אישי" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', direction: 'rtl' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src="/logo.jpeg" 
            alt="Leah Genish" 
            style={{ 
              height: '50px', 
              marginLeft: '10px' 
            }} 
          />
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/" 
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              fontSize: '1.5rem'
            }}
          >
            לאה גניש
          </Typography>
        </Box>
        
        {isMobile ? (
          // תפריט לנייד
          <IconButton
            color="inherit"
            aria-label="פתח תפריט"
            edge="start"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          // תפריט למחשב
          <Box>
            {navItems.map((item) => (
              <Button 
                color="inherit" 
                component={RouterLink} 
                to={item.path}
                key={item.title}
              >
                {item.title}
              </Button>
            ))}
            {/* {isAuthenticated && (
              <>
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/dashboard"
                >
                  אזור אישי
                </Button>
                <Button 
                  color="inherit"
                  onClick={logout}
                >
                  התנתקות
                </Button>
              </>
            )} */}
          </Box>
        )}
      </Toolbar>
      
      {/* תפריט צד לנייד */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;