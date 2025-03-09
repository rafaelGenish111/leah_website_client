import React, { useState } from 'react';
import { 
  TextField, 
  Checkbox, 
  FormControlLabel, 
  Button, 
  Typography, 
  Box, 
  Paper, 
  Grid,
  FormGroup
} from '@mui/material';
import SignatureCanvas from './SignatureCanvas';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DeclarationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    phone: '',
    healthConditions: {
      heartProblems: false,
      highBloodPressure: false,
      diabetes: false,
      pregnancy: false,
      recentSurgery: false,
      skinConditions: false,
      allergies: false,
      other: ''
    },
    confirmTruth: false,
    signature: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSignatureChange = (signatureData) => {
    setFormData(prev => ({
      ...prev,
      signature: signatureData
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post(`${API_URL}/api/declarations`, formData);
      alert('ההצהרה נשלחה בהצלחה!');
      navigate('/');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('שגיאה בשליחת הטופס. אנא נסו שוב.');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4, mb: 4, direction: 'rtl' }}>
      <Typography variant="h4" gutterBottom align="center">
        הצהרת בריאות
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="שם מלא"
              name="name"
              value={formData.name}
              onChange={handleChange}
              dir="rtl"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="מספר תעודת זהות"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              dir="rtl"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="טלפון"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              dir="rtl"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              מצבים רפואיים
            </Typography>
            <Typography variant="body2" gutterBottom color="text.secondary">
              סמן/י האם יש לך אחד או יותר מהמצבים הבאים:
            </Typography>
            
            <FormGroup>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.healthConditions.heartProblems}
                        onChange={handleChange}
                        name="healthConditions.heartProblems"
                      />
                    }
                    label="בעיות לב"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.healthConditions.highBloodPressure}
                        onChange={handleChange}
                        name="healthConditions.highBloodPressure"
                      />
                    }
                    label="לחץ דם גבוה"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.healthConditions.diabetes}
                        onChange={handleChange}
                        name="healthConditions.diabetes"
                      />
                    }
                    label="סוכרת"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.healthConditions.pregnancy}
                        onChange={handleChange}
                        name="healthConditions.pregnancy"
                      />
                    }
                    label="הריון"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.healthConditions.recentSurgery}
                        onChange={handleChange}
                        name="healthConditions.recentSurgery"
                      />
                    }
                    label="ניתוח לאחרונה"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.healthConditions.skinConditions}
                        onChange={handleChange}
                        name="healthConditions.skinConditions"
                      />
                    }
                    label="בעיות עור"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.healthConditions.allergies}
                        onChange={handleChange}
                        name="healthConditions.allergies"
                      />
                    }
                    label="אלרגיות"
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="מצבים רפואיים נוספים"
                name="healthConditions.other"
                value={formData.healthConditions.other}
                onChange={handleChange}
                dir="rtl"
                multiline
                rows={2}
                sx={{ mt: 2 }}
              />
            </FormGroup>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              חתימה
            </Typography>
            <FormControlLabel
              required
              control={
                <Checkbox 
                  checked={formData.confirmTruth}
                  onChange={handleChange}
                  name="confirmTruth"
                />
              }
              label="אני מצהיר/ה כי כל הפרטים שמסרתי הינם נכונים ומלאים"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" gutterBottom>
              חתימה ידנית:
            </Typography>
            <SignatureCanvas onSignatureChange={handleSignatureChange} />
          </Grid>

          <Grid item xs={12}>
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth
              disabled={!formData.confirmTruth || !formData.signature}
              sx={{ mt: 2 }}
            >
              שלח הצהרה
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default DeclarationForm;