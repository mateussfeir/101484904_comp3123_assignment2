import { useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Add, Delete, Edit, Visibility } from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { deleteEmployee, fetchEmployees } from '../api/employees';

const EmployeeListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchFields, setSearchFields] = useState({ department: '', position: '' });
  const [filters, setFilters] = useState({ department: '', position: '' });
  const [requestError, setRequestError] = useState('');

  const {
    data: employees = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['employees', filters],
    queryFn: () => fetchEmployees(filters),
  });

const deleteMutation = useMutation({
  mutationFn: deleteEmployee,
  onSuccess: () => {
    setRequestError('');
    queryClient.invalidateQueries({ queryKey: ['employees'] });
  },
    onError: (error) => {
      setRequestError(error.response?.data?.message || 'Failed to delete employee.');
    },
  });

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setFilters(searchFields);
  };

  const handleReset = () => {
    setSearchFields({ department: '', position: '' });
    setFilters({ department: '', position: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Stack spacing={3}>
      <Box component="section">
        <Typography variant="h4" gutterBottom>
          Employees List
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search employees by department or position, then manage their records.
        </Typography>
      </Box>

      <Card>
        <CardContent component="form" onSubmit={handleSearchSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="Department"
                value={searchFields.department}
                onChange={(event) =>
                  setSearchFields((prev) => ({ ...prev, department: event.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="Position"
                value={searchFields.position}
                onChange={(event) =>
                  setSearchFields((prev) => ({ ...prev, position: event.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button type="submit" variant="contained" fullWidth>
                  Search
                </Button>
                <Button variant="outlined" fullWidth onClick={handleReset}>
                  Reset
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Stack direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/employees/new')}
        >
          Add Employee
        </Button>
      </Stack>

      {requestError && (
        <Alert severity="error" onClose={() => setRequestError('')}>
          {requestError}
        </Alert>
      )}

      <Card>
        <CardContent>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : isError ? (
            <Alert severity="error">Unable to load employees. Please try again later.</Alert>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Salary</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee._id}>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            src={employee.profile_picture_url || undefined}
                            alt={employee.first_name}
                          >
                            {employee.first_name[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">
                              {employee.first_name} {employee.last_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Joined {new Date(employee.date_of_joining).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>
                        {Intl.NumberFormat('en-CA', {
                          style: 'currency',
                          currency: 'CAD',
                        }).format(employee.salary)}
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton
                            color="primary"
                            onClick={() => navigate(`/employees/${employee._id}`)}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={() => navigate(`/employees/${employee._id}/edit`)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(employee._id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {!employees.length && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography color="text.secondary" align="center">
                    No employees found. Try adjusting the filters or add a new employee.
                  </Typography>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
};

export default EmployeeListPage;
