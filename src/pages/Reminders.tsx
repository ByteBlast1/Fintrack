import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  NotificationsActive as ReminderIcon,
} from '@mui/icons-material';
import { useTheme, useMediaQuery } from '@mui/material';
import PageTransition from '../components/PageTransition';
import NoDataDisplay from '../components/NoDataDisplay';

interface Reminder {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  frequency: 'monthly' | 'weekly' | 'yearly';
  isRecurring: boolean;
}

interface EditReminderData {
  reminderId: string | null;
  reminder: Omit<Reminder, 'id'> | null;
}

const Reminders = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('reminders');
    return saved ? JSON.parse(saved) : [];
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editReminderData, setEditReminderData] = useState<EditReminderData>({
    reminderId: null,
    reminder: null
  });

  const handleAddReminder = (reminder: Omit<Reminder, 'id'>) => {
    const newReminders = [...reminders, { ...reminder, id: Date.now().toString() }];
    setReminders(newReminders);
    localStorage.setItem('reminders', JSON.stringify(newReminders));
    setIsFormOpen(false);
  };

  const handleDeleteReminder = (id: string) => {
    const newReminders = reminders.filter(reminder => reminder.id !== id);
    setReminders(newReminders);
    localStorage.setItem('reminders', JSON.stringify(newReminders));
  };

  const handleEditReminder = (reminder: Reminder) => {
    setEditReminderData({
      reminderId: reminder.id,
      reminder: {
        title: reminder.title,
        amount: reminder.amount,
        dueDate: reminder.dueDate,
        frequency: reminder.frequency,
        isRecurring: reminder.isRecurring,
      }
    });
    setIsFormOpen(true);
  };

  const handleSaveReminder = (reminderData: Omit<Reminder, 'id'>) => {
    if (editReminderData.reminderId) {
      // Update existing reminder
      const newReminders = reminders.map(reminder => 
        reminder.id === editReminderData.reminderId
          ? { ...reminder, ...reminderData }
          : reminder
      );
      setReminders(newReminders);
      localStorage.setItem('reminders', JSON.stringify(newReminders));
    } else {
      // Add new reminder
      handleAddReminder(reminderData);
    }
    setEditReminderData({ reminderId: null, reminder: null });
    setIsFormOpen(false);
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
          }}
        >
          <Typography variant="h4">Bill Reminders</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsFormOpen(true)}
            size={isMobile ? "small" : "medium"}
          >
            Add Reminder
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Upcoming Bills
              </Typography>
              {reminders.length > 0 ? (
                <List>
                  {reminders.map((reminder) => (
                    <ListItem key={reminder.id}>
                      <ReminderIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <ListItemText
                        primary={reminder.title}
                        secondary={`Due: ${reminder.dueDate} - $${reminder.amount}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="edit" onClick={() => handleEditReminder(reminder)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteReminder(reminder.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <NoDataDisplay message="No reminders set" />
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">
                  Total Bills: {reminders.length}
                </Typography>
                <Typography variant="body1">
                  Total Amount: ${reminders.reduce((sum, r) => sum + r.amount, 0)}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <ReminderForm
          open={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditReminderData({ reminderId: null, reminder: null });
          }}
          onSubmit={handleSaveReminder}
          initialData={editReminderData.reminder}
        />
      </Box>
    </PageTransition>
  );
};

interface ReminderFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reminder: Omit<Reminder, 'id'>) => void;
  initialData: Omit<Reminder, 'id'> | null;
}

const ReminderForm: React.FC<ReminderFormProps> = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    dueDate: '',
    frequency: 'monthly' as 'monthly' | 'weekly' | 'yearly',
    isRecurring: true,
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        amount: initialData.amount.toString(),
        dueDate: initialData.dueDate,
        frequency: initialData.frequency,
        isRecurring: initialData.isRecurring,
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        dueDate: '',
        frequency: 'monthly',
        isRecurring: true,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: Number(formData.amount),
      frequency: formData.frequency,
    });
    setFormData({
      title: '',
      amount: '',
      dueDate: '',
      frequency: 'monthly' as 'monthly' | 'weekly' | 'yearly',
      isRecurring: true,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Reminder' : 'Add New Reminder'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Bill Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <TextField
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
            <TextField
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Frequency</InputLabel>
              <Select
                value={formData.frequency}
                label="Frequency"
                onChange={(e) => 
                  setFormData({ 
                    ...formData, 
                    frequency: e.target.value as 'monthly' | 'weekly' | 'yearly' 
                  })
                }
              >
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography>Recurring</Typography>
              <Switch
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {initialData ? 'Save Changes' : 'Add Reminder'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default Reminders; 