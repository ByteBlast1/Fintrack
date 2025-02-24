import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Flag as GoalIcon,
} from '@mui/icons-material';
import { useTheme, useMediaQuery } from '@mui/material';
import PageTransition from '../components/PageTransition';
import NoDataDisplay from '../components/NoDataDisplay';

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'savings' | 'investment' | 'debt' | 'purchase' | 'other';
}

interface EditGoalData {
  goalId: string | null;
  goal: Omit<Goal, 'id' | 'currentAmount'> | null;
}

const Goals = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : [];
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editGoalData, setEditGoalData] = useState<EditGoalData>({
    goalId: null,
    goal: null
  });

  const handleAddGoal = (goal: Omit<Goal, 'id' | 'currentAmount'>) => {
    const newGoals = [...goals, { ...goal, id: Date.now().toString(), currentAmount: 0 }];
    setGoals(newGoals);
    localStorage.setItem('goals', JSON.stringify(newGoals));
    setIsFormOpen(false);
  };

  const handleUpdateProgress = (goalId: string, amount: number) => {
    const newGoals = goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) }
        : goal
    );
    setGoals(newGoals);
    localStorage.setItem('goals', JSON.stringify(newGoals));
  };

  const handleDeleteGoal = (id: string) => {
    const newGoals = goals.filter(goal => goal.id !== id);
    setGoals(newGoals);
    localStorage.setItem('goals', JSON.stringify(newGoals));
  };

  const handleEditGoal = (goal: Goal) => {
    setEditGoalData({
      goalId: goal.id,
      goal: {
        title: goal.title,
        targetAmount: goal.targetAmount,
        deadline: goal.deadline,
        category: goal.category,
      }
    });
    setIsFormOpen(true);
  };

  const handleSaveGoal = (goalData: Omit<Goal, 'id' | 'currentAmount'>) => {
    if (editGoalData.goalId) {
      // Update existing goal
      const newGoals = goals.map(goal => 
        goal.id === editGoalData.goalId
          ? { ...goal, ...goalData }
          : goal
      );
      setGoals(newGoals);
      localStorage.setItem('goals', JSON.stringify(newGoals));
    } else {
      // Add new goal
      handleAddGoal(goalData);
    }
    setEditGoalData({ goalId: null, goal: null });
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
          <Typography variant="h4">Financial Goals</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsFormOpen(true)}
            size={isMobile ? "small" : "medium"}
          >
            Add Goal
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Active Goals
              </Typography>
              {goals.length > 0 ? (
                <List>
                  {goals.map((goal) => (
                    <ListItem key={goal.id}>
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle1">{goal.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            ${goal.currentAmount} / ${goal.targetAmount}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(goal.currentAmount / goal.targetAmount) * 100}
                          sx={{ mb: 1, height: 8, borderRadius: 4 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Due: {goal.deadline}
                          </Typography>
                          <Box>
                            <Button
                              size="small"
                              onClick={() => handleUpdateProgress(goal.id, 100)}
                            >
                              Add Progress
                            </Button>
                            <IconButton size="small" onClick={() => handleEditGoal(goal)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDeleteGoal(goal.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <NoDataDisplay message="No goals set" />
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
                  Total Goals: {goals.length}
                </Typography>
                <Typography variant="body1">
                  Total Progress: ${goals.reduce((sum, g) => sum + g.currentAmount, 0)} / 
                  ${goals.reduce((sum, g) => sum + g.targetAmount, 0)}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <GoalForm
          open={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditGoalData({ goalId: null, goal: null });
          }}
          onSubmit={handleSaveGoal}
          initialData={editGoalData.goal}
        />
      </Box>
    </PageTransition>
  );
};

interface GoalFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (goal: Omit<Goal, 'id' | 'currentAmount'>) => void;
  initialData: Omit<Goal, 'id' | 'currentAmount'> | null;
}

const GoalForm: React.FC<GoalFormProps> = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    deadline: '',
    category: 'savings' as Goal['category'],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        targetAmount: initialData.targetAmount.toString(),
        deadline: initialData.deadline,
        category: initialData.category,
      });
    } else {
      setFormData({
        title: '',
        targetAmount: '',
        deadline: '',
        category: 'savings',
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      targetAmount: Number(formData.targetAmount),
    });
    setFormData({
      title: '',
      targetAmount: '',
      deadline: '',
      category: 'savings',
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Goal' : 'Add New Goal'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Goal Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <TextField
              label="Target Amount"
              type="number"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              required
            />
            <TextField
              label="Deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Goal['category'] })}
              required
            >
              <MenuItem value="savings">Savings</MenuItem>
              <MenuItem value="investment">Investment</MenuItem>
              <MenuItem value="debt">Debt Repayment</MenuItem>
              <MenuItem value="purchase">Major Purchase</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {initialData ? 'Save Changes' : 'Add Goal'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default Goals; 