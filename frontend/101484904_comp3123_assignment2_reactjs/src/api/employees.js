import apiClient from './client';

export const fetchEmployees = async (filters = {}) => {
  const sanitizedFilters = {};
  if (filters.department) {
    sanitizedFilters.department = filters.department;
  }
  if (filters.position) {
    sanitizedFilters.position = filters.position;
  }

  const endpoint =
    sanitizedFilters.department || sanitizedFilters.position
      ? '/emp/employees/search'
      : '/emp/employees';

  const { data } = await apiClient.get(endpoint, {
    params: sanitizedFilters,
  });
  return data;
};

export const fetchEmployee = async (id) => {
  const { data } = await apiClient.get(`/emp/employees/${id}`);
  return data;
};

export const deleteEmployee = async (id) => {
  const { data } = await apiClient.delete(`/emp/employees/${id}`);
  return data;
};

export const createEmployee = async (payload) => {
  const { data } = await apiClient.post('/emp/employees', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const updateEmployee = async (id, payload) => {
  const { data } = await apiClient.put(`/emp/employees/${id}`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
