import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { Calculate as CalculateIcon } from '@mui/icons-material';
import PageTransition from '../components/PageTransition';

interface DebtCalculation {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  remainingBalance: number;
}

const PAYMENT_FREQUENCIES = {
  weekly: { label: 'Weekly', periodsPerYear: 52 },
  biweekly: { label: 'Bi-weekly', periodsPerYear: 26 },
  semimonthly: { label: 'Semi-monthly', periodsPerYear: 24 },
  monthly: { label: 'Monthly', periodsPerYear: 12 },
  quarterly: { label: 'Quarterly', periodsPerYear: 4 },
  annually: { label: 'Annually', periodsPerYear: 1 },
} as const;

type FrequencyType = keyof typeof PAYMENT_FREQUENCIES;

const Calculator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [formData, setFormData] = useState({
    loanAmount: '',
    interestRate: '',
    paymentAmount: '',
    paymentFrequency: 'monthly' as FrequencyType,
  });
  const [calculations, setCalculations] = useState<DebtCalculation[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateDebtPayoff = async () => {
    setIsCalculating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const principal = Number(formData.loanAmount);
      const annualRate = Number(formData.interestRate) / 100;
      const frequency = PAYMENT_FREQUENCIES[formData.paymentFrequency];
      const periodicRate = annualRate / frequency.periodsPerYear;
      const payment = Number(formData.paymentAmount);

      let balance = principal;
      const results: DebtCalculation[] = [];
      let period = 1;

      while (balance > 0 && period <= frequency.periodsPerYear * 30) { // 30 years maximum
        const interest = balance * periodicRate;
        const principalPayment = Math.min(payment - interest, balance);
        balance = Math.max(0, balance - principalPayment);

        results.push({
          month: period,
          payment,
          interest,
          principal: principalPayment,
          remainingBalance: balance,
        });

        period++;
      }

      setCalculations(results);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <PageTransition>
      <Box>
        <Typography variant="h4" gutterBottom>
          Debt Payoff Calculator
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Loan Details
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Loan Amount"
                  type="number"
                  value={formData.loanAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, loanAmount: e.target.value })
                  }
                  InputProps={{ startAdornment: '$' }}
                />
                <TextField
                  label="Annual Interest Rate"
                  type="number"
                  value={formData.interestRate}
                  onChange={(e) =>
                    setFormData({ ...formData, interestRate: e.target.value })
                  }
                  InputProps={{ endAdornment: '%' }}
                />
                <TextField
                  label="Payment Amount"
                  type="number"
                  value={formData.paymentAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentAmount: e.target.value })
                  }
                  InputProps={{ startAdornment: '$' }}
                />
                <FormControl fullWidth>
                  <InputLabel>Payment Frequency</InputLabel>
                  <Select
                    value={formData.paymentFrequency}
                    label="Payment Frequency"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentFrequency: e.target.value as FrequencyType,
                      })
                    }
                  >
                    {Object.entries(PAYMENT_FREQUENCIES).map(([key, { label }]) => (
                      <MenuItem key={key} value={key}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={calculateDebtPayoff}
                  startIcon={isCalculating ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <CalculateIcon />
                  )}
                  disabled={
                    isCalculating ||
                    !formData.loanAmount ||
                    !formData.interestRate ||
                    !formData.paymentAmount
                  }
                >
                  {isCalculating ? 'Calculating...' : 'Calculate'}
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Amortization Schedule
              </Typography>
              {calculations.length > 0 ? (
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader size={isMobile ? "small" : "medium"}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Month</TableCell>
                        <TableCell align="right">Payment</TableCell>
                        <TableCell align="right">Interest</TableCell>
                        <TableCell align="right">Principal</TableCell>
                        <TableCell align="right">Remaining</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {calculations.map((row) => (
                        <TableRow key={row.month}>
                          <TableCell>{row.month}</TableCell>
                          <TableCell align="right">
                            ${row.payment.toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            ${row.interest.toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            ${row.principal.toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            ${row.remainingBalance.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    Enter loan details and click Calculate to see the amortization schedule
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {calculations.length > 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body1">
                      Total Payments: {calculations.length}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body1">
                      Total Interest: $
                      {calculations
                        .reduce((sum, calc) => sum + calc.interest, 0)
                        .toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body1">
                      Total Cost: $
                      {calculations
                        .reduce((sum, calc) => sum + calc.payment, 0)
                        .toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </PageTransition>
  );
};

export default Calculator; 