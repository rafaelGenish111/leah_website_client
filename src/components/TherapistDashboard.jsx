import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from '@mui/material';
import { Search, Print, SaveAlt, Visibility } from '@mui/icons-material';
import axios from 'axios';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const TherapistDashboard = () => {
  const [declarations, setDeclarations] = useState([]);
  const [filteredDeclarations, setFilteredDeclarations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeclaration, setSelectedDeclaration] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchDeclarations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/declarations`, {
          headers: { 'x-auth-token': token }
        });
        setDeclarations(response.data);
        setFilteredDeclarations(response.data);
      } catch (error) {
        console.error('Error fetching declarations:', error);
      }
    };

    fetchDeclarations();
  }, []);

  useEffect(() => {
    const results = declarations.filter(declaration => 
      declaration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      declaration.idNumber.includes(searchTerm)
    );
    setFilteredDeclarations(results);
  }, [searchTerm, declarations]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewDeclaration = (declaration) => {
    setSelectedDeclaration(declaration);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handlePrintDeclaration = (declaration) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("הצהרת בריאות", 105, 30, { align: "center" });
    
    // Add patient info
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`שם: ${declaration.name}`, 190, 50, { align: "right" });
    doc.text(`ת.ז: ${declaration.idNumber}`, 190, 60, { align: "right" });
    doc.text(`טלפון: ${declaration.phone}`, 190, 70, { align: "right" });
    doc.text(`תאריך: ${new Date(declaration.date).toLocaleDateString('he-IL')}`, 190, 80, { align: "right" });
    
    // Add health conditions
    doc.setFont("helvetica", "bold");
    doc.text("מצבים רפואיים:", 190, 100, { align: "right" });
    doc.setFont("helvetica", "normal");
    
    let yPos = 110;
    const conditions = [
      { key: 'skinDiseases', label: 'מחלות עור' },
      { key: 'heartDiseases', label: 'מחלות לב' },
      { key: 'diabetes', label: 'סוכרת' },
      { key: 'bloodPressure', label: 'לחץ דם' },
      { key: 'spineProblems', label: 'בעיות בעמוד השדרה' },
      { key: 'fracturesOrSprains', label: 'שברים/נקעים' },
      { key: 'fluOrFever', label: 'שפעת/חום/דלקת' },
      { key: 'epilepsy', label: 'אפילפסיה' },
      { key: 'surgeries', label: 'ניתוחים' },
      { key: 'chronicMedications', label: 'נוטל תרופות כרוניות' },
      { key: 'pregnancy', label: 'הריון' },
      { key: 'otherConditions', label: 'בעיות רפואיות אחרות' }
    ];
    
    conditions.forEach(condition => {
      const checked = declaration.healthConditions[condition.key] ? "✓" : "✗";
      doc.text(`${condition.label}: ${checked}`, 190, yPos, { align: "right" });
      yPos += 10;
    });
    
    // Add additional details if applicable
    if (declaration.healthConditions.chronicMedications && declaration.healthConditions.medicationDetails) {
      doc.text(`פירוט תרופות כרוניות: ${declaration.healthConditions.medicationDetails}`, 190, yPos, { align: "right" });
      yPos += 10;
    }
    
    if (declaration.healthConditions.pregnancy) {
      const pregnancyStage = declaration.healthConditions.pregnancyOverWeek14 ? "מעל שבוע 14" : "עד שבוע 14";
      doc.text(`שלב הריון: ${pregnancyStage}`, 190, yPos, { align: "right" });
      yPos += 10;
    }
    
    if (declaration.healthConditions.otherConditions && declaration.healthConditions.otherDetails) {
      doc.text(`פירוט בעיות רפואיות אחרות: ${declaration.healthConditions.otherDetails}`, 190, yPos, { align: "right" });
      yPos += 20;
    }
    
    // Add signature
    if (declaration.signature) {
      doc.setFont("helvetica", "bold");
      doc.text("חתימה:", 190, yPos, { align: "right" });
      doc.addImage(declaration.signature, 'PNG', 100, yPos + 10, 50, 30);
    }
    
    // Save the PDF
    doc.save(`הצהרת_בריאות_${declaration.name}.pdf`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 1200, mx: 'auto', mt: 4, mb: 4, direction: 'rtl' }}>
      <Typography variant="h4" gutterBottom align="center">
        ניהול הצהרות בריאות
      </Typography>
      
      <Box sx={{ display: 'flex', mb: 3 }}>
        <TextField
          label="חיפוש לפי שם או ת.ז"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <Search color="action" sx={{ mr: 1 }} />,
          }}
        />
      </Box>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="right">שם</TableCell>
              <TableCell align="right">תעודת זהות</TableCell>
              <TableCell align="right">טלפון</TableCell>
              <TableCell align="right">תאריך</TableCell>
              <TableCell align="right">פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDeclarations.map((declaration) => (
              <TableRow key={declaration._id}>
                <TableCell align="right">{declaration.name}</TableCell>
                <TableCell align="right">{declaration.idNumber}</TableCell>
                <TableCell align="right">{declaration.phone}</TableCell>
                <TableCell align="right">{formatDate(declaration.date)}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleViewDeclaration(declaration)}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handlePrintDeclaration(declaration)}>
                    <Print />
                  </IconButton>
                  <IconButton onClick={() => handlePrintDeclaration(declaration)}>
                    <SaveAlt />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Declaration Details Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedDeclaration && (
          <>
            <DialogTitle>
              <Typography variant="h6" align="center">
                פרטי הצהרת בריאות
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Typography variant="h6" gutterBottom>פרטים אישיים</Typography>
              <Typography>{`שם: ${selectedDeclaration.name}`}</Typography>
              <Typography>{`תעודת זהות: ${selectedDeclaration.idNumber}`}</Typography>
              <Typography>{`טלפון: ${selectedDeclaration.phone}`}</Typography>
              <Typography>{`תאריך: ${formatDate(selectedDeclaration.date)}`}</Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>מצבים רפואיים</Typography>
              <Typography>{`מחלות עור: ${selectedDeclaration.healthConditions.skinDiseases ? 'כן' : 'לא'}`}</Typography>
              <Typography>{`מחלות לב: ${selectedDeclaration.healthConditions.heartDiseases ? 'כן' : 'לא'}`}</Typography>
              <Typography>{`סוכרת: ${selectedDeclaration.healthConditions.diabetes ? 'כן' : 'לא'}`}</Typography>
              <Typography>{`לחץ דם: ${selectedDeclaration.healthConditions.bloodPressure ? 'כן' : 'לא'}`}</Typography>
              <Typography>{`בעיות בעמוד השדרה: ${selectedDeclaration.healthConditions.spineProblems ? 'כן' : 'לא'}`}</Typography>
              <Typography>{`שברים/נקעים: ${selectedDeclaration.healthConditions.fracturesOrSprains ? 'כן' : 'לא'}`}</Typography>
              <Typography>{`שפעת/חום/דלקת: ${selectedDeclaration.healthConditions.fluOrFever ? 'כן' : 'לא'}`}</Typography>
              <Typography>{`אפילפסיה: ${selectedDeclaration.healthConditions.epilepsy ? 'כן' : 'לא'}`}</Typography>
              <Typography>{`ניתוחים: ${selectedDeclaration.healthConditions.surgeries ? 'כן' : 'לא'}`}</Typography>
              <Typography>{`נוטל תרופות כרוניות: ${selectedDeclaration.healthConditions.chronicMedications ? 'כן' : 'לא'}`}</Typography>
              
              {selectedDeclaration.healthConditions.chronicMedications && selectedDeclaration.healthConditions.medicationDetails && (
                <Typography>{`פירוט תרופות: ${selectedDeclaration.healthConditions.medicationDetails}`}</Typography>
              )}
              
              <Typography>{`הריון: ${selectedDeclaration.healthConditions.pregnancy ? 'כן' : 'לא'}`}</Typography>
              
              {selectedDeclaration.healthConditions.pregnancy && (
                <Typography>{`שלב הריון: ${selectedDeclaration.healthConditions.pregnancyOverWeek14 ? 'מעל שבוע 14' : 'עד שבוע 14'}`}</Typography>
              )}
              
              <Typography>{`בעיות רפואיות אחרות: ${selectedDeclaration.healthConditions.otherConditions ? 'כן' : 'לא'}`}</Typography>
              
              {selectedDeclaration.healthConditions.otherConditions && selectedDeclaration.healthConditions.otherDetails && (
                <Typography>{`פירוט בעיות רפואיות אחרות: ${selectedDeclaration.healthConditions.otherDetails}`}</Typography>
              )}
              
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>חתימה</Typography>
              {selectedDeclaration.signature && (
                <Box sx={{ textAlign: 'center', my: 2 }}>
                  <img 
                    src={selectedDeclaration.signature} 
                    alt="חתימה" 
                    style={{ maxWidth: '200px', border: '1px solid #ddd' }} 
                  />
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handlePrintDeclaration(selectedDeclaration)}>
                הדפסה / שמירה
              </Button>
              <Button onClick={handleCloseDialog}>
                סגור
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Paper>
  );
};

export default TherapistDashboard;