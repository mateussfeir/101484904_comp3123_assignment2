const fs = require('fs');
const path = require('path');
const Employee = require('../models/Employee');

const buildEmployeePayload = (body) => {
  const payload = {};
  const allowedFields = [
    'first_name',
    'last_name',
    'email',
    'position',
    'salary',
    'date_of_joining',
    'department',
  ];

  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      payload[field] = body[field];
    }
  });

  if (payload.salary !== undefined) {
    if (payload.salary === '') {
      delete payload.salary;
    } else {
      payload.salary = Number(payload.salary);
    }
  }

  if (payload.date_of_joining !== undefined) {
    if (payload.date_of_joining === '') {
      delete payload.date_of_joining;
    } else {
      payload.date_of_joining = new Date(payload.date_of_joining);
    }
  }

  return payload;
};

const removeProfilePicture = async (pictureName) => {
  if (!pictureName) return;

  const absolutePath = path.join(__dirname, '..', 'uploads', pictureName);
  try {
    await fs.promises.unlink(absolutePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error(`Failed to remove file ${absolutePath}`, error.message);
    }
  }
};

const formatEmployee = (employee, req) => {
  const employeeObject = employee.toObject ? employee.toObject() : employee;
  if (employeeObject.profile_picture) {
    employeeObject.profile_picture_url = `${req.protocol}://${req.get('host')}/uploads/${employeeObject.profile_picture}`;
  } else {
    employeeObject.profile_picture_url = null;
  }
  return employeeObject;
};

// GET /api/v1/emp/employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ created_at: -1 });
    res.status(200).json(employees.map((employee) => formatEmployee(employee, req)));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/v1/emp/employees/search
exports.searchEmployees = async (req, res) => {
  try {
    const { department, position } = req.query;
    const filters = {};
    if (department) {
      filters.department = department;
    }
    if (position) {
      filters.position = position;
    }

    const employees = await Employee.find(filters);
    res.status(200).json(employees.map((employee) => formatEmployee(employee, req)));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/v1/emp/employees
exports.createEmployee = async (req, res) => {
  try {
    const payload = buildEmployeePayload(req.body);
    if (req.file) {
      payload.profile_picture = req.file.filename;
    }

    const employee = await Employee.create(payload);
    res.status(201).json({
      message: 'Employee created successfully.',
      employee: formatEmployee(employee, req),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/v1/emp/employees/:eid
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.eid);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }
    res.status(200).json(formatEmployee(employee, req));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/v1/emp/employees/:eid
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.eid);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    const updates = buildEmployeePayload(req.body);
    if (req.file) {
      await removeProfilePicture(employee.profile_picture);
      updates.profile_picture = req.file.filename;
    }

    Object.assign(employee, updates);
    await employee.save();

    res.status(200).json({
      message: 'Employee details updated successfully.',
      employee: formatEmployee(employee, req),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/v1/emp/employees/:eid
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.eid);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    await removeProfilePicture(employee.profile_picture);
    await employee.deleteOne();

    res.status(200).json({ message: 'Employee deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
