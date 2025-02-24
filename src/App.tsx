import React from 'react';
import { ThemeProvider, CssBaseline, Box, Container } from '@mui/material';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { lightTheme, darkTheme } from './theme/theme';
import Navbar from './components/Navbar';
import AppContent from './components/AppContent';

function App() {
  const themeMode = useSelector((state: any) => state.theme.mode);

  return (
    <ThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
          <Navbar />
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <AppContent />
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 