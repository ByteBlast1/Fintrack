import React, { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import { useDispatch } from 'react-redux';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { v4 as uuidv4 } from 'uuid';
import { addTransaction, updateTransaction } from '../redux/transactionsSlice';
import { Transaction } from '../types';

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  editTransaction?: Transaction | null;
}

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Rental Income',
  'Business',
  'Other Income'
];

const EXPENSE_CATEGORIES = [
  'Housing',
  'Transportation',
  'Food & Dining',
  'Utilities',
  'Insurance',
  'Healthcare',
  'Entertainment',
  'Shopping',
  'Education',
  'Personal Care',
  'Travel',
  'Debt Payment',
  'Other Expenses'
];

const TransactionForm: React.FC<TransactionFormProps> = ({ open, onClose, editTransaction }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    type: 'expense' as 'income' | 'expense',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (editTransaction) {
      setFormData({
        amount: editTransaction.amount.toString(),
        category: editTransaction.category,
        type: editTransaction.type,
        description: editTransaction.description,
        date: editTransaction.date,
      });
    }
  }, [editTransaction]);

  // Get categories based on transaction type
  const categories = useMemo(() => {
    return formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  }, [formData.type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTransaction) {
      dispatch(updateTransaction({
        id: editTransaction.id,
        amount: Number(formData.amount),
        category: formData.category,
        type: formData.type,
        description: formData.description,
        date: formData.date,
      }));
    } else {
      dispatch(addTransaction({
        id: Date.now().toString(),
        amount: Number(formData.amount),
        category: formData.category,
        type: formData.type,
        description: formData.description,
        date: formData.date,
      }));
    }
    onClose();
    setFormData({
      amount: '',
      category: '',
      type: 'expense',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  // Reset category when type changes
  const handleTypeChange = (newType: string) => {
    setFormData({
      ...formData,
      type: newType as 'income' | 'expense',
      category: '', // Reset category when type changes
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editTransaction ? 'Edit Transaction' : 'Add New Transaction'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
              inputProps={{ min: "0", step: "0.01" }}
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                label="Type"
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              multiline
              rows={2}
            />
            <TextField
              type="date"
              label="Date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {editTransaction ? 'Save Changes' : 'Add Transaction'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TransactionForm; 