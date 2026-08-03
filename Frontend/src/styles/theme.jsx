import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212', // deep coal black
      paper: '#1E1E1E',    // dark panel gray
    },
    primary: {
      main: '#FF6F00',     // glowing coal-orange
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4FC3F7',     // cool blue for contrast
      contrastText: '#ffffff',
    },
    text: {
      primary: '#F5F5F5',
      secondary: '#B0BEC5',
    },
    error: {
      main: '#EF5350',
    },
    warning: {
      main: '#FFB300',
    },
    info: {
      main: '#29B6F6',
    },
    success: {
      main: '#66BB6A',
    },
  },
  typography: {
    fontFamily: `'Roboto', 'Segoe UI', sans-serif`,
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '10px 18px',
          backdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(255, 111, 0, 0.15)',
          color: '#FF6F00',
          border: '1px solid #FF6F00',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 111, 0, 0.35)',
            boxShadow: '0 0 12px rgba(255, 111, 0, 0.4)',
          },
          '&:active': {
            backgroundColor: '#FF6F00',
            color: '#000',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1A1A1A',
          color: '#fff',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: '14px',
          padding: '20px',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.6)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#2c2c2c',
          color: '#FF6F00',
          fontWeight: 'bold',
        },
        body: {
          color: '#E0E0E0',
        },
      },
    },
  },
});

export default theme;
