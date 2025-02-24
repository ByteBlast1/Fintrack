import React from 'react';
import { Box, Grid, Paper, Typography, useTheme, useMediaQuery } from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  TooltipProps,
  Legend,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { useSelector } from 'react-redux';
import { RootState, Transaction } from '../types';
import SummaryCard from '../components/SummaryCard';
import { motion } from 'framer-motion';
import NoDataDisplay from '../components/NoDataDisplay';

const COLORS = [
  '#2196F3', // Blue
  '#4CAF50', // Green
  '#FFC107', // Amber
  '#F44336', // Red
  '#9C27B0', // Purple
  '#FF9800', // Orange
  '#00BCD4', // Cyan
  '#795548', // Brown
  '#607D8B', // Blue Grey
  '#E91E63', // Pink
];

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const transactions = useSelector((state: RootState) => state.transactions.transactions);

  const calculateTotals = () => {
    return transactions.reduce(
      (acc: { income: number; expenses: number }, transaction: Transaction) => {
        if (transaction.type === 'income') {
          acc.income += transaction.amount;
        } else {
          acc.expenses += transaction.amount;
        }
        return acc;
      },
      { income: 0, expenses: 0 }
    );
  };

  const { income, expenses } = calculateTotals();
  const balance = income - expenses;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Custom tooltip for the area chart
  const CustomAreaTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          sx={{
            p: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            boxShadow: 3,
          }}
        >
          <Typography variant="subtitle2" color="textSecondary">
            Date: {label}
          </Typography>
          <Typography variant="body2" color="primary">
            Amount: ${payload[0].value?.toFixed(2)}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          sx={{
            p: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            boxShadow: 3,
          }}
        >
          <Typography variant="subtitle2">{payload[0].name}</Typography>
          <Typography variant="body2" color="textSecondary">
            Amount: ${payload[0].value?.toFixed(2)}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  const hasTransactions = transactions.length > 0;
  const hasExpenses = transactions.some((t: Transaction) => t.type === 'expense');

  // Or implement a basic chart if you want to use them now:
  const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    // ... more data
  ];

  return (
    <Box component={motion.div} initial="hidden" animate="visible" variants={containerVariants}>
      <Typography variant="h4" gutterBottom component={motion.h4} variants={itemVariants}>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} component={motion.div} variants={itemVariants}>
          <SummaryCard
            title="Total Balance"
            amount={balance}
            type="balance"
          />
        </Grid>
        <Grid item xs={12} md={4} component={motion.div} variants={itemVariants}>
          <SummaryCard
            title="Total Income"
            amount={income}
            type="income"
          />
        </Grid>
        <Grid item xs={12} md={4} component={motion.div} variants={itemVariants}>
          <SummaryCard
            title="Total Expenses"
            amount={expenses}
            type="expense"
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: isMobile ? 300 : 400 }}>
            <Typography variant="h6" gutterBottom>
              Cash Flow
            </Typography>
            <Box sx={{ height: '100%' }}>
              {hasTransactions ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={transactions}
                    margin={isMobile ? { top: 5, right: 10, left: -10, bottom: 5 } : { top: 20, right: 20, left: 20, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: isMobile ? 12 : 14 }}
                      interval={isMobile ? 1 : 0}
                      label={{ value: 'Date', position: 'bottom', offset: 0 }}
                    />
                    <YAxis 
                      tick={{ fontSize: isMobile ? 12 : 14 }}
                      width={isMobile ? 40 : 60}
                      label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomAreaTooltip />} />
                    <Legend 
                      verticalAlign="top" 
                      height={36}
                      wrapperStyle={{
                        paddingBottom: 10,
                        fontSize: isMobile ? 12 : 14,
                      }}
                    />
                    <Area
                      name="Transaction Amount"
                      type="monotone"
                      dataKey="amount"
                      stroke={theme.palette.primary.main}
                      fill="url(#colorAmount)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <NoDataDisplay message="Add transactions to see your cash flow" />
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: isMobile ? 300 : 400 }}>
            <Typography variant="h6" gutterBottom>
              Expense Distribution
            </Typography>
            <Box sx={{ height: '100%' }}>
              {hasExpenses ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={transactions.filter((t: Transaction) => t.type === 'expense')}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={isMobile ? 50 : 70}
                      outerRadius={isMobile ? 70 : 90}
                      paddingAngle={2}
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {transactions
                        .filter((t: Transaction) => t.type === 'expense')
                        .map((entry: Transaction, index: number) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]}
                            fillOpacity={theme.palette.mode === 'dark' ? 0.7 : 0.8}
                          />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <NoDataDisplay message="No expenses to display" />
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <LineChart width={600} height={300} data={data}>
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
    </Box>
  );
};

export default Dashboard; 