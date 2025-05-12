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
  FormGroup,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Collapse
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
      skinDiseases: false,
      heartDiseases: false,
      diabetes: false,
      bloodPressure: false,
      spineProblems: false,
      fracturesOrSprains: false,
      fluOrFever: false,
      epilepsy: false,
      surgeries: false,
      chronicMedications: false,
      medicationDetails: '',
      pregnancy: false,
      pregnancyOverWeek14: false,
      otherConditions: false,
      otherDetails: ''
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

  const handleRadioChange = (e) => {
    const value = e.target.value === 'true';
    setFormData(prev => ({
      ...prev,
      healthConditions: {
        ...prev.healthConditions,
        pregnancyOverWeek14: value
      }
    }));
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
                        checked={formData.healthConditions.skinDiseases}
                        onChange={handleChange}
                        name="healthConditions.skinDiseases"
                      />
                    }
                    label="מחלות עור"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.healthConditions.heartDiseases}
                        onChange={handleChange}
                        name="healthConditions.heartDiseases"
                      />
                    }
                    label="מחלות לב"
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
                        checked={formData.healthConditions.bloodPressure}
                        onChange={handleChange}
                        name="healthConditions.bloodPressure"
                      />
                    }
                    label="לחץ דם"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.healthConditions.spineProblems}
                        onChange={handleChange}
                        name="healthConditions.spineProblems"
                      />
                    }
                    label="בעיות בעמוד השדרה"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.healthConditions.fracturesOrSprains}
                        onChange={handleChange}
                        name="healthConditions.fracturesOrSprains"
                      />
                    }
                    label="שברים/נקעים"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.healthConditions.fluOrFever}
                        onChange={handleChange}
                        name="healthConditions.fluOrFever"
                      />
                    }
                    label="שפעת/חום/דלקת"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.healthConditions.epilepsy}
                        onChange={handleChange}
                        name="healthConditions.epilepsy"
                      />
                    }
                    label="אפילפסיה"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.healthConditions.surgeries}
                        onChange={handleChange}
                        name="healthConditions.surgeries"
                      />
                    }
                    label="ניתוחים"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.healthConditions.chronicMedications}
                        onChange={handleChange}
                        name="healthConditions.chronicMedications"
                      />
                    }
                    label="נוטל תרופות כרוניות"
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
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.healthConditions.otherConditions}
                        onChange={handleChange}
                        name="healthConditions.otherConditions"
                      />
                    }
                    label="בעיות רפואיות אחרות"
                  />
                </Grid>
              </Grid>

              {/* פרטים נוספים לתרופות כרוניות */}
              <Collapse in={formData.healthConditions.chronicMedications} timeout="auto">
                <Box sx={{ mt: 2, mb: 2, pl: 3, pr: 3 }}>
                  <TextField
                    fullWidth
                    label="פירוט תרופות כרוניות"
                    name="healthConditions.medicationDetails"
                    value={formData.healthConditions.medicationDetails}
                    onChange={handleChange}
                    dir="rtl"
                    multiline
                    rows={2}
                  />
                </Box>
              </Collapse>

              {/* אפשרויות הריון */}
              <Collapse in={formData.healthConditions.pregnancy} timeout="auto">
                <Box sx={{ mt: 2, mb: 2, pl: 3, pr: 3 }}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">שבוע הריון:</FormLabel>
                    <RadioGroup
                      row
                      value={formData.healthConditions.pregnancyOverWeek14.toString()}
                      onChange={handleRadioChange}
                    >
                      <FormControlLabel value="false" control={<Radio />} label="עד שבוע 14" />
                      <FormControlLabel value="true" control={<Radio />} label="מעל שבוע 14" />
                    </RadioGroup>
                  </FormControl>
                </Box>
              </Collapse>

              {/* בעיות רפואיות אחרות */}
              <Collapse in={formData.healthConditions.otherConditions} timeout="auto">
                <Box sx={{ mt: 2, mb: 2, pl: 3, pr: 3 }}>
                  <TextField
                    fullWidth
                    label="פירוט בעיות רפואיות אחרות"
                    name="healthConditions.otherDetails"
                    value={formData.healthConditions.otherDetails}
                    onChange={handleChange}
                    dir="rtl"
                    multiline
                    rows={2}
                  />
                </Box>
              </Collapse>
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