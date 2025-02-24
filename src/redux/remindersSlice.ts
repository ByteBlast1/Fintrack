import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Reminder {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  frequency: 'monthly' | 'weekly' | 'yearly';
  isRecurring: boolean;
}

interface RemindersState {
  reminders: Reminder[];
}

const initialState: RemindersState = {
  reminders: [],
};

const remindersSlice = createSlice({
  name: 'reminders',
  initialState,
  reducers: {
    addReminder: (state, action: PayloadAction<Reminder>) => {
      state.reminders.push(action.payload);
    },
    deleteReminder: (state, action: PayloadAction<string>) => {
      state.reminders = state.reminders.filter(reminder => reminder.id !== action.payload);
    },
    updateReminder: (state, action: PayloadAction<Reminder>) => {
      const index = state.reminders.findIndex(reminder => reminder.id === action.payload.id);
      if (index !== -1) {
        state.reminders[index] = action.payload;
      }
    },
  },
});

export const { addReminder, deleteReminder, updateReminder } = remindersSlice.actions;
export default remindersSlice.reducer; 