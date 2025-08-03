import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const LeftSidebar = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: { xs: '80px', sm: '220px' },
        bgcolor: theme.palette.background.paper,
        boxShadow: 3,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 1100,
      }}
    >
      {/* ✅ Accessing the image from /public */}
      <img
        src="/Tasty_API.jpg"
        alt="Tasty API Logo"
        style={{
          width: '100%',
          maxWidth: 140,
          borderRadius: 8,
          marginBottom: 12,
          objectFit: 'contain',
        }}
      />

      {/* Description hidden on small screens */}
      <Typography
        variant="body2"
        align="center"
        sx={{
          display: { xs: 'none', sm: 'block' },
          fontSize: 12,
          color: theme.palette.text.secondary,
        }}
      >
        This AI-powered recipe app uses Regular Expression and multiple food APIs to fetch custom recipes based on your ingredients.
      </Typography>
    </Box>
  );
};

export default LeftSidebar;
