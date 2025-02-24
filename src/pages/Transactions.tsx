import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, Transaction } from '../types';
import { deleteTransaction } from '../redux/transactionsSlice';
import TransactionForm from '../components/TransactionForm';
import PageTransition from '../components/PageTransition';

const Transactions = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const transactions = useSelector((state: RootState) => state.transactions.transactions);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  return (
    <PageTransition>
      <Box>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3,
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            gap: 1
          }}
        >
          <Typography variant="h4" sx={{ mb: isMobile ? 1 : 0 }}>
            Transactions
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsFormOpen(true)}
            size={isMobile ? "small" : "medium"}
            sx={{
              whiteSpace: 'nowrap',
              minWidth: isMobile ? 'auto' : undefined,
            }}
          >
            {isMobile ? 'Add' : 'Add Transaction'}
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction: Transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell align="right" sx={{
                    color: transaction.type === 'income' ? 'success.main' : 'error.main'
                  }}>
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleEdit(transaction)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => dispatch(deleteTransaction(transaction.id))}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TransactionForm 
          open={isFormOpen} 
          onClose={handleCloseForm}
          editTransaction={editingTransaction}
        />
      </Box>
    </PageTransition>
  );
};

export default Transactions; 