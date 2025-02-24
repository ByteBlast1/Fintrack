import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/themeSlice';
import { RootState } from '../types';
import PageTransition from '../components/PageTransition';

const Settings = () => {
  const dispatch = useDispatch();
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  return (
    <PageTransition>
      <Box>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>

        <Paper sx={{ mt: 2 }}>
          <List>
            <ListItem>
              <ListItemText
                primary="Dark Mode"
                secondary="Toggle between light and dark theme"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={themeMode === 'dark'}
                  onChange={() => dispatch(toggleTheme())}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Currency"
                secondary="USD ($)"
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Version"
                secondary="1.0.0"
              />
            </ListItem>
          </List>
        </Paper>
      </Box>
    </PageTransition>
  );
};

export default Settings; 