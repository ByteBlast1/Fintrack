import React from 'react';
import { Box, Typography } from '@mui/material';
import { DataUsageOutlined } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface NoDataDisplayProps {
  message?: string;
}

const NoDataDisplay: React.FC<NoDataDisplayProps> = ({ message = 'No data available' }) => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.secondary',
      }}
    >
      <DataUsageOutlined sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
      <Typography variant="body1">{message}</Typography>
    </Box>
  );
};

export default NoDataDisplay; 