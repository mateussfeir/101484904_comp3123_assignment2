import { CssBaseline } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import EmployeeDetailsPage from './pages/EmployeeDetailsPage';
import EmployeeFormPage from './pages/EmployeeFormPage';
import EmployeeListPage from './pages/EmployeeListPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const App = () => (
  <>
    <CssBaseline />
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/employees" element={<EmployeeListPage />} />
        <Route path="/employees/new" element={<EmployeeFormPage />} />
        <Route path="/employees/:id" element={<EmployeeDetailsPage />} />
        <Route path="/employees/:id/edit" element={<EmployeeFormPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </>
);

export default App;
