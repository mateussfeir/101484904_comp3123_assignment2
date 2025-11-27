import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            component={RouterLink}
            to="/employees"
            color="inherit"
            variant="h6"
            sx={{ textDecoration: 'none' }}
          >
            Employee Manager
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user && (
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                Welcome, {user.username}
              </Typography>
            )}
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default DashboardLayout;
