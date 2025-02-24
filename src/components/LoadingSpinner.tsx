import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        minHeight: 200,
      }}
    >
      <motion.div
        style={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          border: '3px solid transparent',
          borderTopColor: '#6366f1',
          borderLeftColor: '#8b5cf6',
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </Box>
  );
};

export default LoadingSpinner; 