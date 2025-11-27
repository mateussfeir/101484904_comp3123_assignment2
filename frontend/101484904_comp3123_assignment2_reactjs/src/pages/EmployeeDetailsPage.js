import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { fetchEmployee } from '../api/employees';

const DetailRow = ({ label, value }) => (
  <Stack direction="row" justifyContent="space-between" py={1}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2">{value}</Typography>
  </Stack>
);

const EmployeeDetailsPage = () => {
  const { id } = useParams();

  const {
    data: employee,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => fetchEmployee(id),
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !employee) {
    return <Alert severity="error">Unable to load employee details.</Alert>;
  }

  return (
    <Card>
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={employee.profile_picture_url || 'https://via.placeholder.com/200x200'}
              alt={`${employee.first_name} ${employee.last_name}`}
              sx={{
                width: '100%',
                borderRadius: 2,
                objectFit: 'cover',
                border: '1px solid #e0e0e0',
              }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>
              {employee.first_name} {employee.last_name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {employee.position} in {employee.department}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <DetailRow label="Email" value={employee.email} />
            <DetailRow
              label="Salary"
              value={Intl.NumberFormat('en-CA', {
                style: 'currency',
                currency: 'CAD',
              }).format(employee.salary)}
            />
            <DetailRow
              label="Date of Joining"
              value={new Date(employee.date_of_joining).toLocaleDateString()}
            />
            <DetailRow
              label="Profile Created"
              value={new Date(employee.created_at).toLocaleDateString()}
            />
            <DetailRow
              label="Last Updated"
              value={new Date(employee.updated_at).toLocaleDateString()}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default EmployeeDetailsPage;
