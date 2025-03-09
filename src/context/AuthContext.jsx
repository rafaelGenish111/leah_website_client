// AuthContext.jsx - גרסה מתוקנת
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // טיימר לניתוק אוטומטי
  const logoutTimerRef = useRef(null);
  const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 דקות במילישניות
  
  // מאתחל את הטיימר לניתוק אוטומטי
  const resetLogoutTimer = () => {
    // ניקוי טיימר קודם אם קיים
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    
    // הגדרת טיימר חדש
    logoutTimerRef.current = setTimeout(() => {
      // ניתוק אוטומטי
      logout("פג תוקף הישיבה עקב חוסר פעילות.");
    }, SESSION_TIMEOUT);
  };

  // Load user
  useEffect(() => {
    const loadUser = async () => {
      // Check if token exists in localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      // Set default headers with token
      axios.defaults.headers.common['x-auth-token'] = token;
      
      try {
        const res = await axios.get(`${API_URL}/api/auth`);
        setUser(res.data);
        setIsAuthenticated(true);
        
        // איפוס טיימר הניתוק בטעינה
        resetLogoutTimer();
      } catch (err) {
        console.error('Error loading user:', err);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
    
    // ניקוי טיימר בסגירת הקומפוננטה
    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, []);
  
  // האזנה לפעילות המשתמש לאיפוס הטיימר
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // רשימת אירועים להאזנה
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // פונקציה המאפסת את הטיימר בכל פעילות
    const resetTimerOnActivity = () => {
      resetLogoutTimer();
    };
    
    // הוספת האזנה לכל האירועים
    events.forEach(event => {
      window.addEventListener(event, resetTimerOnActivity);
    });
    
    // הסרת האירועים בסגירת הקומפוננטה
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimerOnActivity);
      });
    };
  }, [isAuthenticated]);

  // Login
  const login = async (email, password) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    try {
      setError(null);
      const res = await axios.post(
        `${API_URL}/api/auth`,
        { email, password },
        config
      );
      
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      
      // Load user data
      const userRes = await axios.get(`${API_URL}/api/auth`);
      setUser(userRes.data);
      setIsAuthenticated(true);
      
      // איפוס טיימר הניתוק בהתחברות
      resetLogoutTimer();
      
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || 'שגיאה בהתחברות');
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      return false;
    }
  };

  // Logout - הסרנו את navigate מכאן
  const logout = (message = null) => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
    setIsAuthenticated(false);
    
    // ניקוי הטיימר
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
    
    // אם התקבלה הודעה, הצג אותה
    if (message) {
      setError(message);
    }
    
    // לא משתמשים יותר ב-navigate כאן
    // במקום זה, הדפים שמשתמשים בAuthContext יטפלו בניווט
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        resetLogoutTimer
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};