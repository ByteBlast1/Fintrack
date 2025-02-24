import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'savings' | 'investment' | 'debt' | 'purchase' | 'other';
}

interface GoalsState {
  goals: Goal[];
}

const initialState: GoalsState = {
  goals: [],
};

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    addGoal: (state, action: PayloadAction<Goal>) => {
      state.goals.push(action.payload);
    },
    deleteGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter(goal => goal.id !== action.payload);
    },
    updateGoal: (state, action: PayloadAction<Goal>) => {
      const index = state.goals.findIndex(goal => goal.id === action.payload.id);
      if (index !== -1) {
        state.goals[index] = action.payload;
      }
    },
    updateGoalProgress: (state, action: PayloadAction<{ id: string; amount: number }>) => {
      const goal = state.goals.find(g => g.id === action.payload.id);
      if (goal) {
        goal.currentAmount = Math.min(goal.currentAmount + action.payload.amount, goal.targetAmount);
      }
    },
  },
});

export const { addGoal, deleteGoal, updateGoal, updateGoalProgress } = goalsSlice.actions;
export default goalsSlice.reducer; 