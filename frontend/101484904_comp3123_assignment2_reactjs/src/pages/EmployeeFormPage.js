import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { createEmployee, fetchEmployee, updateEmployee } from '../api/employees';

const emptyForm = {
  first_name: '',
  last_name: '',
  email: '',
  position: '',
  salary: '',
  date_of_joining: '',
  department: '',
};

const EmployeeFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const queryClient = useQueryClient();
  const [formValues, setFormValues] = useState(emptyForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const { data: employeeData, isLoading: employeeLoading } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => fetchEmployee(id),
    enabled: isEdit,
  });

  useEffect(() => {
    if (employeeData) {
      setFormValues({
        first_name: employeeData.first_name || '',
        last_name: employeeData.last_name || '',
        email: employeeData.email || '',
        position: employeeData.position || '',
        salary: employeeData.salary?.toString() || '',
        date_of_joining: employeeData.date_of_joining
          ? new Date(employeeData.date_of_joining).toISOString().split('T')[0]
          : '',
        department: employeeData.department || '',
      });
      setPreviewUrl(employeeData.profile_picture_url || null);
    }
  }, [employeeData]);

  const mutation = useMutation({
    mutationFn: (payload) => (isEdit ? updateEmployee(id, payload) : createEmployee(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      navigate('/employees');
    },
    onError: (error) => {
      setErrorMessage(error.response?.data?.message || 'Unable to save employee.');
    },
  });

  const pageTitle = isEdit ? 'Update Employee' : 'Add Employee';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
    const data = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        data.append(key, value);
      }
    });
    if (selectedFile) {
      data.append('profile_picture', selectedFile);
    }
    mutation.mutate(data);
  };

  if (employeeLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent component="form" onSubmit={handleSubmit}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">{pageTitle}</Typography>
          <Button variant="outlined" onClick={() => navigate('/employees')}>
            Cancel
          </Button>
        </Stack>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="First Name"
              name="first_name"
              value={formValues.first_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Last Name"
              name="last_name"
              value={formValues.last_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formValues.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Position"
              name="position"
              value={formValues.position}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Salary"
              name="salary"
              type="number"
              value={formValues.salary}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Date of Joining"
              name="date_of_joining"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formValues.date_of_joining}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Department"
              name="department"
              value={formValues.department}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="outlined" component="label" fullWidth>
              {selectedFile ? 'Change Profile Picture' : 'Upload Profile Picture'}
              <input hidden accept="image/*" type="file" onChange={handleFileChange} />
            </Button>
            {previewUrl && (
              <Box
                component="img"
                src={previewUrl}
                alt="Employee preview"
                sx={{ width: 120, height: 120, mt: 2, borderRadius: 2, objectFit: 'cover' }}
              />
            )}
          </Grid>
        </Grid>
        {errorMessage && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {errorMessage}
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3 }}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Saving...' : isEdit ? 'Update Employee' : 'Create Employee'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmployeeFormPage;
