import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
  LinearProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const SessionTimeout = () => {
  const { isAuthenticated, logout, resetLogoutTimer } = useAuth();
  const [open, setOpen] = useState(false);
  const [countdown, setCountdown] = useState(60); // 60 שניות להתראה
  const countdownTimerRef = useRef(null);
  
  // זמן לפני ניתוק אוטומטי (9 דקות)
  const WARNING_TIMEOUT = 9 * 60 * 1000;
  
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // הגדרת טיימר להצגת ההתראה
    const warningTimer = setTimeout(() => {
      setOpen(true);
      startCountdown();
    }, WARNING_TIMEOUT);
    
    return () => {
      clearTimeout(warningTimer);
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, [isAuthenticated]);
  
  // התחלת ספירה לאחור
  const startCountdown = () => {
    setCountdown(60);
    
    countdownTimerRef.current = setInterval(() => {
      setCountdown(prevCount => {
        if (prevCount <= 1) {
          clearInterval(countdownTimerRef.current);
          setOpen(false);
          // המשתמש לא הגיב - ביצוע ניתוק
          logout("פג תוקף הישיבה עקב חוסר פעילות.");
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };
  
  // המשך פעילות
  const handleContinue = () => {
    setOpen(false);
    
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
    
    // איפוס טיימר הניתוק
    resetLogoutTimer();
  };
  
  return (
    <Dialog
      open={open}
      onClose={handleContinue}
    >
      <DialogTitle>האם אתה עדיין שם?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          המערכת תנתק אותך באופן אוטומטי עוד {countdown} שניות עקב חוסר פעילות.
        </DialogContentText>
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={(countdown / 60) * 100} 
            color="error" 
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleContinue} color="primary" autoFocus>
          המשך פעילות
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionTimeout;