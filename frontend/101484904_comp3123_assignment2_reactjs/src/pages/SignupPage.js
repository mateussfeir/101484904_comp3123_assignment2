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
import { signupUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formValues, setFormValues] = useState({ username: '', email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/employees');
    }
  }, [isAuthenticated, navigate]);

  const signupMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      login(data.token, data.user);
      navigate('/employees');
    },
    onError: (error) => {
      setErrorMessage(error.response?.data?.message || 'Unable to sign up.');
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
    signupMutation.mutate(formValues);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex' }}>
      <Paper elevation={6} sx={{ p: 4, my: 'auto', width: '100%' }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Sign Up
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Create an account to manage employees.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={formValues.username}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={formValues.password}
            onChange={handleChange}
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
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending ? 'Creating account...' : 'Sign Up'}
          </Button>
          <Link component={RouterLink} to="/login" variant="body2">
            Already have an account? Login
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignupPage;
