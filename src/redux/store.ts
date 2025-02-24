import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import themeReducer from './themeSlice';
import transactionsReducer from './transactionsSlice';
import remindersReducer from './remindersSlice';
import goalsReducer from './goalsSlice';
import { RootState } from '../types';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['theme', 'transactions', 'reminders', 'goals'],
};

const rootReducer = combineReducers({
  theme: themeReducer,
  transactions: transactionsReducer,
  reminders: remindersReducer,
  goals: goalsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch; 