import { createTheme, ThemeOptions, alpha } from '@mui/material';

const commonTheme: ThemeOptions = {
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          },
        },
        outlined: {
          background: 'transparent',
          borderColor: '#6366f1',
          color: '#6366f1',
          '&:hover': {
            background: alpha('#6366f1', 0.04),
            borderColor: '#4f46e5',
          },
        },
        text: {
          background: 'transparent',
          color: '#6366f1',
          '&:hover': {
            background: alpha('#6366f1', 0.04),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
        },
      },
    },
  },
};

const lightThemeOptions: ThemeOptions = {
  ...commonTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8b5cf6',
      light: '#a78bfa',
      dark: '#7c3aed',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      secondary: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
      success: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      warning: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      error: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)',
    },
  },
};

const darkThemeOptions: ThemeOptions = {
  ...commonTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#818cf8',
      light: '#93c5fd',
      dark: '#6366f1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#a78bfa',
      light: '#c4b5fd',
      dark: '#8b5cf6',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
      secondary: 'linear-gradient(135deg, #a78bfa 0%, #f0abfc 100%)',
      success: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      warning: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      error: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)',
    },
  },
  components: {
    ...commonTheme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(30,41,59,0.9) 0%, rgba(30,41,59,0.7) 100%)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(30,41,59,0.9) 0%, rgba(30,41,59,0.7) 100%)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
  },
};

// Add custom gradient palette to theme
declare module '@mui/material/styles' {
  interface Palette {
    gradient: {
      primary: string;
      secondary: string;
      success: string;
      warning: string;
      error: string;
    };
  }
  interface PaletteOptions {
    gradient?: {
      primary: string;
      secondary: string;
      success: string;
      warning: string;
      error: string;
    };
  }
}

export const lightTheme = createTheme(lightThemeOptions);
export const darkTheme = createTheme(darkThemeOptions); 