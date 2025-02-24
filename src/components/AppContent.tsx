import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Dashboard from '../pages/Dashboard';
import Transactions from '../pages/Transactions';
import Analytics from '../pages/Analytics';
import Settings from '../pages/Settings';
import Reminders from '../pages/Reminders';
import Goals from '../pages/Goals';
import Calculator from '../pages/Calculator';

const AppContent = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/calculator" element={<Calculator />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AppContent; 