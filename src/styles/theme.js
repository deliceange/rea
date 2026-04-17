import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#D4A017', // Warm Gold
      light: '#FCD34D',
      dark: '#B8940A',
    },
    secondary: {
      main: '#B8860B', // Dark Gold
      light: '#E5C07A',
      dark: '#9C7A00',
    },
    background: {
      default: '#FDF6E3', // Luxury Cream
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#4A5568',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: '24px',
      fontWeight: 500,
    },
    h2: {
      fontSize: '20px',
      fontWeight: 500,
    },
    h3: {
      fontSize: '18px',
      fontWeight: 500,
    },
    body1: {
      fontSize: '14px',
    },
    body2: {
      fontSize: '12px',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(212, 160, 23, 0.15)', // Gold-tinted shadow
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(145deg, #FFFFFF 0%, #FDF6E3 100%)',
        }
      }
    }
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF8C00', // Dark Orange Gold
      light: '#FFB347',
      dark: '#E67700',
    },
    secondary: {
      main: '#DAA520', // Goldenrod
      light: '#F0D5A0',
      dark: '#B8860B',
    },
    background: {
      default: '#0C0F14', // Deep Luxury Navy
      paper: '#1A1D24',
    },
    text: {
      primary: '#F5F5F5',
      secondary: '#A0AEC0',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: '24px',
      fontWeight: 500,
    },
    h2: {
      fontSize: '20px',
      fontWeight: 500,
    },
    h3: {
      fontSize: '18px',
      fontWeight: 500,
    },
    body1: {
      fontSize: '14px',
    },
    body2: {
      fontSize: '12px',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 32px rgba(212, 160, 23, 0.25)', // Luxury gold glow
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(145deg, #1A1D24 0%, #0C0F14 100%)',
        }
      }
    }
  },
});

export { lightTheme, darkTheme };