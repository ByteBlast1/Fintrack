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
  Legend,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { useSelector } from 'react-redux';
import { RootState, Transaction } from '../types';
import PageTransition from '../components/PageTransition';
import NoDataDisplay from '../components/NoDataDisplay';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }: any) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (active && payload && payload.length) {
    return (
      <Paper 
        sx={{ 
          p: 2, 
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)', 
          backdropFilter: 'blur(4px)',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
        {payload.map((entry: any) => (
          <Typography 
            key={entry.name}
            variant="body2" 
            color={entry.color}
          >
            {entry.name}: ${Number(entry.value).toFixed(2)}
          </Typography>
        ))}
      </Paper>
    );
  }
  return null;
};

const Analytics = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const transactions = useSelector((state: RootState) => state.transactions.transactions);

  const getMonthlyData = () => {
    const monthlyMap = new Map();
    transactions.forEach((transaction: Transaction) => {
      const month = new Date(transaction.date).toLocaleString('default', { month: 'short' });
      const current = monthlyMap.get(month) || { income: 0, expense: 0, balance: 0 };
      if (transaction.type === 'income') {
        current.income += transaction.amount;
      } else {
        current.expense += transaction.amount;
      }
      current.balance = current.income - current.expense;
      monthlyMap.set(month, current);
    });
    return Array.from(monthlyMap, ([month, data]) => ({
      month,
      ...data,
    })).sort((a, b) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });
  };

  const getCategoryAnalysis = () => {
    const categoryMap = new Map();
    let totalExpense = 0;

    transactions.forEach((transaction: Transaction) => {
      if (transaction.type === 'expense') {
        const current = categoryMap.get(transaction.category) || { 
          amount: 0, 
          count: 0,
          average: 0,
        };
        current.amount += transaction.amount;
        current.count += 1;
        current.average = current.amount / current.count;
        categoryMap.set(transaction.category, current);
        totalExpense += transaction.amount;
      }
    });

    return Array.from(categoryMap, ([category, data]) => ({
      category,
      amount: data.amount,
      percentage: (data.amount / totalExpense) * 100,
      average: data.average,
      count: data.count,
    })).sort((a, b) => b.amount - a.amount);
  };

  const getComparativeData = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonth = transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((acc, t) => {
        if (t.type === 'income') acc.income += t.amount;
        else acc.expense += t.amount;
        return acc;
      }, { income: 0, expense: 0 });

    const lastMonth = transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === (currentMonth - 1 + 12) % 12 && 
          (currentMonth === 0 ? date.getFullYear() === currentYear - 1 : date.getFullYear() === currentYear);
      })
      .reduce((acc, t) => {
        if (t.type === 'income') acc.income += t.amount;
        else acc.expense += t.amount;
        return acc;
      }, { income: 0, expense: 0 });

    return {
      thisMonth,
      lastMonth,
      incomeChange: lastMonth.income ? ((thisMonth.income - lastMonth.income) / lastMonth.income) * 100 : 0,
      expenseChange: lastMonth.expense ? ((thisMonth.expense - lastMonth.expense) / lastMonth.expense) * 100 : 0,
    };
  };

  const monthlyData = getMonthlyData();
  const categoryAnalysis = getCategoryAnalysis();
  const comparativeData = getComparativeData();
  const hasData = monthlyData.length > 0;

  // Calculate summary statistics
  const totalIncome = transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum, 0);
  const totalExpense = transactions.reduce((sum, t) => t.type === 'expense' ? sum + t.amount : sum, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  return (
    <PageTransition>
      <Box>
        <Typography variant="h4" gutterBottom>
          Analytics
        </Typography>

        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12} md={4}>
            <Paper 
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              sx={{ p: 2 }}
            >
              <Typography variant="h6" gutterBottom>Savings Rate</Typography>
              <Typography variant="h4" color={savingsRate >= 20 ? 'success.main' : 'error.main'}>
                {savingsRate.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {savingsRate >= 20 ? 'Good saving habits!' : 'Consider reducing expenses'}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper 
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              sx={{ p: 2 }}
            >
              <Typography variant="h6" gutterBottom>Monthly Income Change</Typography>
              <Typography 
                variant="h4" 
                color={comparativeData.incomeChange >= 0 ? 'success.main' : 'error.main'}
              >
                {comparativeData.incomeChange >= 0 ? '↑' : '↓'} {Math.abs(comparativeData.incomeChange).toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                vs Last Month
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper 
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              sx={{ p: 2 }}
            >
              <Typography variant="h6" gutterBottom>Monthly Expense Change</Typography>
              <Typography 
                variant="h4" 
                color={comparativeData.expenseChange <= 0 ? 'success.main' : 'error.main'}
              >
                {comparativeData.expenseChange >= 0 ? '↑' : '↓'} {Math.abs(comparativeData.expenseChange).toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                vs Last Month
              </Typography>
            </Paper>
          </Grid>

          {/* Combined Income/Expense Chart */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, height: isMobile ? 300 : 400 }}>
              <Typography variant="h6" gutterBottom>
                Income vs Expenses
              </Typography>
              <Box sx={{ height: '100%' }}>
                {hasData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={monthlyData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                      }}
                    >
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#4CAF50" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f44336" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#f44336" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: isMobile ? 12 : 14 }}
                      />
                      <YAxis
                        tick={{ fontSize: isMobile ? 12 : 14 }}
                        width={60}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="top" height={36} />
                      <Area
                        name="Income"
                        type="natural"
                        dataKey="income"
                        stroke="#4CAF50"
                        fill="url(#colorIncome)"
                        strokeWidth={2}
                        fillOpacity={0.3}
                        isAnimationActive={true}
                        animationDuration={1000}
                        animationBegin={0}
                      />
                      <Area
                        name="Expenses"
                        type="natural"
                        dataKey="expense"
                        stroke="#f44336"
                        fill="url(#colorExpense)"
                        strokeWidth={2}
                        fillOpacity={0.3}
                        isAnimationActive={true}
                        animationDuration={1000}
                        animationBegin={200}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <NoDataDisplay message="Add transactions to see trends" />
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Category Analysis */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, height: isMobile ? 300 : 400 }}>
              <Typography variant="h6" gutterBottom>
                Expense Categories
              </Typography>
              <Box sx={{ height: '100%' }}>
                {hasData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoryAnalysis}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 60,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                      <XAxis
                        dataKey="category"
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                      />
                      <YAxis
                        tick={{ fontSize: isMobile ? 12 : 14 }}
                        width={60}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <Paper sx={{ 
                                p: 2, 
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                                backdropFilter: 'blur(4px)',
                                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                              }}>
                                <Typography variant="subtitle2" color="text.primary">{data.category}</Typography>
                                <Typography variant="body2" color="text.primary">
                                  Total: ${data.amount.toFixed(2)}
                                </Typography>
                                <Typography variant="body2" color="text.primary">
                                  Average: ${data.average.toFixed(2)}
                                </Typography>
                                <Typography variant="body2" color="text.primary">
                                  Count: {data.count}
                                </Typography>
                                <Typography variant="body2" color="text.primary">
                                  Share: {data.percentage.toFixed(1)}%
                                </Typography>
                              </Paper>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="amount"
                        fill={theme.palette.primary.main}
                        radius={[4, 4, 0, 0]}
                        isAnimationActive={true}
                        animationDuration={1000}
                        animationBegin={0}
                      >
                        {categoryAnalysis.map((entry, index) => (
                          <Cell 
                            key={entry.category}
                            fill={theme.palette.primary.main}
                            fillOpacity={theme.palette.mode === 'dark' ? 0.7 : 0.8}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <NoDataDisplay message="Add transactions to see category analysis" />
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </PageTransition>
  );
};

export default Analytics; 