import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown, AccountBalance } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface SummaryCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'income':
        return <TrendingUp sx={{ fontSize: 40, color: 'white' }} />;
      case 'expense':
        return <TrendingDown sx={{ fontSize: 40, color: 'white' }} />;
      default:
        return <AccountBalance sx={{ fontSize: 40, color: 'white' }} />;
    }
  };

  const getGradient = () => {
    switch (type) {
      case 'income':
        return 'linear-gradient(135deg, #34d399 0%, #10b981 100%)';
      case 'expense':
        return 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)';
      default:
        return 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
    }
  };

  return (
    <Paper
      component={motion.div}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      sx={{
        p: 3,
        height: 140,
        position: 'relative',
        overflow: 'hidden',
        background: getGradient(),
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          opacity: 0.1,
          transform: 'rotate(-15deg)',
        }}
      >
        {getIcon()}
      </Box>
      <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
        {title}
      </Typography>
      <Typography
        variant="h4"
        sx={{
          color: 'white',
          fontWeight: 600,
          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        ${amount.toFixed(2)}
      </Typography>
    </Paper>
  );
};

export default SummaryCard; 