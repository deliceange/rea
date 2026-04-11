import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider, useAppContext } from './context/AppContext';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Movies from './pages/Movies/Movies';
import Customers from './pages/Customers/Customers';
import Rentals from './pages/Rentals/Rentals';
import Analytics from './pages/Analytics/Analytics';
import './styles/main.scss';

const AppContent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { sidebarOpen } = useAppContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const drawerWidth = 240;
  const sidebarWidth = isMobile ? 0 : (sidebarOpen ? drawerWidth : 0);

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header onMenuClick={handleMobileToggle} />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          backgroundColor: 'background.default',
          minHeight: '100vh',
          ml: `${sidebarWidth}px`,
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Toolbar />
        <Routes>
          <Route path="/" element={<Movies />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;