import { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formValues, setFormValues] = useState({ email: '', username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/employees');
    }
  }, [isAuthenticated, navigate]);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data.token, data.user);
      navigate('/employees');
    },
    onError: (error) => {
      setErrorMessage(error.response?.data?.message || 'Unable to login. Please try again.');
    },
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formValues.email && !formValues.username) {
      setErrorMessage('Please enter either email or username.');
      return;
    }
    setErrorMessage('');
    loginMutation.mutate({
      email: formValues.email || undefined,
      username: formValues.username || undefined,
      password: formValues.password,
    });
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex' }}>
      <Paper elevation={6} sx={{ p: 4, my: 'auto', width: '100%' }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Login
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Use your Assignment 2 API credentials to access the employee dashboard.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            value={formValues.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={formValues.username}
            onChange={handleInputChange}
            helperText="You can login using either email or username."
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formValues.password}
            onChange={handleInputChange}
          />
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Signing in...' : 'Login'}
          </Button>
          <Link component={RouterLink} to="/signup" variant="body2">
            Don&apos;t have an account? Sign Up
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
