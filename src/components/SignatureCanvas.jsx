import React, { useRef, useState } from 'react';
import { Box, Button, Paper } from '@mui/material';
import SignaturePad from 'react-signature-canvas';

const SignatureCanvas = ({ onSignatureChange }) => {
  const sigCanvas = useRef({});
  const [isSigned, setIsSigned] = useState(false);

  const clear = () => {
    sigCanvas.current.clear();
    setIsSigned(false);
    onSignatureChange('');
  };

  const save = () => {
    if (sigCanvas.current.isEmpty()) {
      return;
    }
    
    const signatureData = sigCanvas.current.toDataURL('image/png');
    onSignatureChange(signatureData);
    setIsSigned(true);
  };

  const handleEnd = () => {
    save();
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Paper 
        elevation={1} 
        sx={{ 
          border: '1px solid #ddd', 
          width: '100%', 
          height: 200, 
          mb: 2 
        }}
      >
        <SignaturePad
          ref={sigCanvas}
          canvasProps={{
            width: '100%',
            height: 200,
            className: "signature-canvas"
          }}
          onEnd={handleEnd}
        />
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={clear}
        >
          נקה חתימה
        </Button>
        <Button 
          variant="contained" 
          onClick={save}
          disabled={isSigned}
        >
          שמור חתימה
        </Button>
      </Box>
    </Box>
  );
};

export default SignatureCanvas;
