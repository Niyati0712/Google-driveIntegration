import React from 'react';
import { Typography, Button, Box, Stack } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import Salventlogo from '../../assets/images/salevant_ai_image.png';
import DriveLogo from '../../assets/images/google drive.svg';
import rightLogo from '../../assets/images/right.svg';

const StateOneComponent = ({ onSyncNow }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        py:1,
        maxWidth: '1000px',
        width: '80%',
        // minHeight: "100%",
        // height: "100vh",
        // overflowY: 'auto',
        mx: 'auto',
        // boxShadow: '0px 4px 8px rgba(0,0,0,0.12)'
      }}
    >
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 6, mt:3 }}>
        Sync Google Drive
      </Typography>
      <Stack direction="row" spacing={5} alignItems="center" sx={{ mb: 5, mt:3 }}>
      <img src={DriveLogo} alt="Google Drive" style={{ width: '140px', height: '140px', mr:4 }} />
      <img src={rightLogo} alt="Right Arrow" style={{ width: '65px', height: '65px', mr: 4, ml: 4 }} />
        <img src={Salventlogo} alt="Salvent Logo" style={{ width: '200px', height: '200px', ml:4 }} />
        
        
      </Stack>
      <Stack spacing={1} sx={{ mb: 5, mt:3 }}>
      <Box display="flex" alignItems="center">
        <Typography variant="h6" component="span" sx={{ width: '2rem' }}>1.</Typography>
        <Typography variant="h6">Select the folder for continuous syncing</Typography>
      </Box>
      <Box display="flex" alignItems="center">
        <Typography variant="h6" component="span" sx={{ width: '2rem' }}>2.</Typography>
        <Typography variant="h6">Upload/Change documents in the folder</Typography>
      </Box>
      <Box display="flex" alignItems="center">
        <Typography variant="h6" component="span" sx={{ width: '2rem' }}>3.</Typography>
        <Typography variant="h6">Docs getting auto-synced with the model</Typography>
      </Box>
    </Stack>
      <Button
        variant="contained"
        startIcon={<SyncIcon />}
        onClick={onSyncNow}
        sx={{
          bgcolor: '#1A73E8',
          color: '#fff',
          textTransform: 'none',
          fontSize:'1.175rem',
          px: 4,
          py: 1,
          '&:hover': {
            bgcolor: '#185ABC',
          },
          mb: 2,
        }}
      >
        Sync Now
      </Button>
    </Box>
  );
};

export default StateOneComponent;
