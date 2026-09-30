import { useEffect, useMemo, useState } from "react";
import "./App.css";

const initialEmployees = [
  {
    id: "1",
    name: "Ankita Jana",
    employeeId: "EMP101",
    department: "IT",
    designation: "Software Developer",
    gender: "Female",
    phone: "9876543210",
    email: "ankita.jana@company.com",
    joiningDate: "2024-06-15",
    status: "Active",
    localAddress: "Kolkata, West Bengal",
    permanentAddress: "Kolkata, West Bengal",
  },
  {
    id: "2",
    name: "Rahul Das",
    employeeId: "EMP102",
    department: "HR",
    designation: "HR Executive",
    gender: "Male",
    phone: "9876501234",
    email: "rahul.das@company.com",
    joiningDate: "2023-09-10",
    status: "Active",
    localAddress: "Salt Lake, Kolkata",
    permanentAddress: "Howrah, West Bengal",
  },
  {
    id: "3",
    name: "Sneha Roy",
    employeeId: "EMP103",
    department: "Finance",
    designation: "Accountant",
    gender: "Female",
    phone: "9830012345",
    email: "sneha.roy@company.com",
    joiningDate: "2022-03-20",
    status: "On Leave",
    localAddress: "New Town, Kolkata",
    permanentAddress: "Durgapur, West Bengal",
  },
  {
    id: "4",
    name: "Arjun Sen",
    employeeId: "EMP104",
    department: "Marketing",
    designation: "Marketing Executive",
    gender: "Male",
    phone: "9123456789",
    email: "arjun.sen@company.com",
    joiningDate: "2024-01-08",
    status: "Active",
    localAddress: "Park Street, Kolkata",
    permanentAddress: "Siliguri, West Bengal",
  },
];

const emptyForm = {
  name: "",
  employeeId: "",
  department: "IT",
  designation: "",
  gender: "Other",
  phone: "",
  email: "",
  joiningDate: "",
  status: "Active",
  localAddress: "",
  permanentAddress: "",
};

const makeId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const normalizeEmployee = (employee = {}) => ({
  id: employee.id || makeId(),
  name: employee.name || "",
  employeeId: employee.employeeId || "",
  department: employee.department || "IT",
  designation: employee.designation || "Employee",
  gender: employee.gender || "Other",
  phone: employee.phone || "",
  email: employee.email || "",
  joiningDate: employee.joiningDate || "",
  status: employee.status || "Active",
  localAddress: employee.localAddress || "",
  permanentAddress: employee.permanentAddress || "",
});

function App() {
  const [adminLoggedIn, setAdminLoggedIn] = useState(() => {
    return localStorage.getItem("adminLoggedIn") === "true";
  });

  const [adminLogin, setAdminLogin] = useState({
    username: "",
    password: "",
  });

  const [employees, setEmployees] = useState(() => {
    try {
      const saved = localStorage.getItem("employees");

      if (!saved) {
        return initialEmployees.map(normalizeEmployee);
      }

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed)) {
        return initialEmployees.map(normalizeEmployee);
      }

      return parsed.map(normalizeEmployee);
    } catch {
      return initialEmployees.map(normalizeEmployee);
    }
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [showProfile, setShowProfile] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [showAdminProfile, setShowAdminProfile] = useState(false);

  const [formData, setFormData] = useState(emptyForm);

  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast("");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (employee) => employee.status === "Active"
  ).length;

  const onLeaveEmployees = employees.filter(
    (employee) => employee.status === "On Leave"
  ).length;

  const inactiveEmployees = employees.filter(
    (employee) => employee.status === "Inactive"
  ).length;

  const filteredEmployees = useMemo(() => {
    const text = search.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch = [
        employee.name,
        employee.employeeId,
        employee.department,
        employee.designation,
        employee.email,
        employee.phone,
      ].some((value) =>
        String(value || "").toLowerCase().includes(text)
      );

      const matchesDepartment =
        departmentFilter === "All" ||
        employee.department === departmentFilter;

      const matchesStatus =
        statusFilter === "All" ||
        employee.status === statusFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [
    employees,
    search,
    departmentFilter,
    statusFilter,
  ]);

  const handleLogin = (event) => {
    event.preventDefault();

    if (
      adminLogin.username.trim() === "admin" &&
      adminLogin.password === "admin123"
    ) {
      localStorage.setItem("adminLoggedIn", "true");
      setAdminLoggedIn(true);
      setToast("Admin login successful");
    } else {
      setToast("Invalid username or password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    setAdminLoggedIn(false);

    setAdminLogin({
      username: "",
      password: "",
    });

    setToast("Logged out successfully");
  };

  const openAddForm = () => {
    setEditId(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (employee) => {
    setEditId(employee.id);

    setFormData({
      name: employee.name,
      employeeId: employee.employeeId,
      department: employee.department,
      designation: employee.designation,
      gender: employee.gender,
      phone: employee.phone,
      email: employee.email,
      joiningDate: employee.joiningDate,
      status: employee.status,
      localAddress: employee.localAddress,
      permanentAddress: employee.permanentAddress,
    });

    setShowForm(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanedData = {
      ...formData,
      name: formData.name.trim(),
      employeeId: formData.employeeId.trim(),
      designation: formData.designation.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      localAddress: formData.localAddress.trim(),
      permanentAddress: formData.permanentAddress.trim(),
    };

    /* =========================
       REQUIRED FIELD VALIDATION
    ========================== */

    if (!cleanedData.name) {
      setToast("Employee name is required");
      return;
    }

    if (!cleanedData.employeeId) {
      setToast("Employee ID is required");
      return;
    }

    if (!cleanedData.designation) {
      setToast("Designation is required");
      return;
    }

    if (!cleanedData.joiningDate) {
      setToast("Please select date of joining");
      return;
    }

    /* =========================
       EMAIL VALIDATION
    ========================== */

    if (cleanedData.email) {
      const emailPattern =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailPattern.test(cleanedData.email)) {
        setToast("Please enter a valid email address");
        return;
      }
    }

    /* =========================
       PHONE VALIDATION
    ========================== */

    if (cleanedData.phone) {
      const phonePattern = /^[6-9]\d{9}$/;

      if (!phonePattern.test(cleanedData.phone)) {
        setToast(
          "Please enter a valid 10-digit Indian phone number"
        );
        return;
      }
    }

    /* =========================
       DATE VALIDATION
    ========================== */

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(cleanedData.joiningDate)) {
      setToast("Please enter a valid date of joining");
      return;
    }

    const selectedDate = new Date(
      `${cleanedData.joiningDate}T00:00:00`
    );

    if (Number.isNaN(selectedDate.getTime())) {
      setToast("Please enter a valid date of joining");
      return;
    }

    /*
      Prevent impossible dates such as
      2026-02-31
    */

    const [year, month, day] =
      cleanedData.joiningDate.split("-").map(Number);

    if (
      selectedDate.getFullYear() !== year ||
      selectedDate.getMonth() + 1 !== month ||
      selectedDate.getDate() !== day
    ) {
      setToast("Please enter a valid date of joining");
      return;
    }

    /* =========================
       FUTURE DATE VALIDATION
    ========================== */

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      setToast(
        "Date of joining cannot be a future date"
      );
      return;
    }

    /* =========================
       DUPLICATE EMPLOYEE ID
    ========================== */

    const duplicateEmployeeId = employees.some(
      (employee) =>
        employee.employeeId.toLowerCase() ===
          cleanedData.employeeId.toLowerCase() &&
        employee.id !== editId
    );

    if (duplicateEmployeeId) {
      setToast("Employee ID already exists");
      return;
    }

    /* =========================
       ADD / UPDATE
    ========================== */

    if (editId) {
      setEmployees((previous) =>
        previous.map((employee) =>
          employee.id === editId
            ? {
                ...employee,
                ...cleanedData,
              }
            : employee
        )
      );

      setToast("Employee updated successfully");
    } else {
      const newEmployee = normalizeEmployee({
        ...cleanedData,
        id: makeId(),
      });

      setEmployees((previous) => [
        ...previous,
        newEmployee,
      ]);

      setToast("Employee added successfully");
    }

    setFormData(emptyForm);
    setEditId(null);
    setShowForm(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    setEmployees((previous) =>
      previous.filter(
        (employee) => employee.id !== deleteTarget.id
      )
    );

    if (
      selectedEmployee &&
      selectedEmployee.id === deleteTarget.id
    ) {
      setShowProfile(false);
      setSelectedEmployee(null);
    }

    setDeleteTarget(null);

    setToast("Employee deleted successfully");
  };

  const openProfile = (employee) => {
    setSelectedEmployee(employee);
    setShowProfile(true);
  };

  const editFromProfile = () => {
    if (!selectedEmployee) return;

    setShowProfile(false);
    openEditForm(selectedEmployee);
  };

  const deleteFromProfile = () => {
    if (!selectedEmployee) return;

    setShowProfile(false);
    setDeleteTarget(selectedEmployee);
  };

  /* =========================
     LOGIN PAGE
  ========================== */

  if (!adminLoggedIn) {
    return (
      <div
        className={`app ${
          darkMode ? "dark-mode" : ""
        }`}
      >
        <div className="login-page">
          <div className="login-decoration decoration-one"></div>
          <div className="login-decoration decoration-two"></div>

          <div className="login-card">
            <div className="brand-large">
              <div className="brand-icon">A</div>

              <div>
                <h1>ADMINCORE</h1>
                <span>EMPLOYEE MANAGEMENT SYSTEM</span>
              </div>
            </div>

            <div className="login-heading">
              <p className="eyebrow">
                ADMINISTRATOR ACCESS
              </p>

              <h2>Welcome Back</h2>

              <p>
                Sign in to manage your organization
                and employees.
              </p>
            </div>

            <form
              className="login-form"
              onSubmit={handleLogin}
            >
              <label>Username</label>

              <div className="input-with-icon">
                <span>👤</span>

                <input
                  type="text"
                  placeholder="Enter username"
                  value={adminLogin.username}
                  onChange={(event) =>
                    setAdminLogin({
                      ...adminLogin,
                      username: event.target.value,
                    })
                  }
                  required
                />
              </div>

              <label>Password</label>

              <div className="input-with-icon">
                <span>🔒</span>

                <input
                  type="password"
                  placeholder="Enter password"
                  value={adminLogin.password}
                  onChange={(event) =>
                    setAdminLogin({
                      ...adminLogin,
                      password: event.target.value,
                    })
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="primary-btn login-btn"
              >
                🔐 Login as Administrator
              </button>
            </form>

            <div className="demo-box">
              <strong>Demo Access</strong>

              <span>
                Username: <b>admin</b>
              </span>

              <span>
                Password: <b>admin123</b>
              </span>
            </div>

            <button
              className="theme-login-btn"
              onClick={() =>
                setDarkMode((previous) => !previous)
              }
            >
              {darkMode
                ? "☀️ Light Mode"
                : "🌙 Dark Mode"}
            </button>

            <div className="login-footer">
              Secure Administrative Portal
            </div>
          </div>
        </div>

        {toast && (
          <div className="toast error-toast">
            ⚠️ {toast}
          </div>
        )}
      </div>
    );
  }

  /* =========================
     DASHBOARD
  ========================== */

  return (
    <div
      className={`app ${
        darkMode ? "dark-mode" : ""
      }`}
    >
      <header className="topbar">
        <div className="topbar-brand">
          <div className="brand-icon small">A</div>

          <div>
            <h1>ADMINCORE</h1>
            <span>EMPLOYEE MANAGEMENT</span>
          </div>
        </div>

        <div className="topbar-actions">
          <button
            className="icon-btn"
            onClick={() =>
              setDarkMode((previous) => !previous)
            }
            title="Toggle Theme"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <button
            className="admin-button"
            onClick={() =>
              setShowAdminProfile(true)
            }
          >
            <div className="admin-avatar">A</div>

            <div className="admin-info">
              <strong>Administrator</strong>
              <span>Admin Account</span>
            </div>
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard">
        <section className="hero-section">
          <div>
            <p className="eyebrow">
              ADMINISTRATOR DASHBOARD
            </p>

            <h2>
              Manage your
              <span> workforce.</span>
            </h2>

            <p className="hero-description">
              Manage employees, track workforce
              activity and maintain your organization
              records from one centralized dashboard.
            </p>
          </div>

          <button
            className="primary-btn add-main-btn"
            onClick={openAddForm}
          >
            <span>＋</span>
            Add Employee
          </button>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">
              👥
            </div>

            <div>
              <span>Total Employees</span>
              <strong>{totalEmployees}</strong>
              <small>Workforce size</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              ✓
            </div>

            <div>
              <span>Active Employees</span>
              <strong>{activeEmployees}</strong>
              <small>Currently active</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              ◷
            </div>

            <div>
              <span>On Leave</span>
              <strong>{onLeaveEmployees}</strong>
              <small>Currently away</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon red">
              ●
            </div>

            <div>
              <span>Inactive</span>
              <strong>{inactiveEmployees}</strong>
              <small>Inactive employees</small>
            </div>
          </div>
        </section>

        <section className="directory-card">
          <div className="directory-header">
            <div>
              <p className="eyebrow">
                PEOPLE & ORGANIZATION
              </p>

              <h3>Employee Directory</h3>

              <p>
                Search and manage all employee records.
              </p>
            </div>

            <div className="directory-count">
              {filteredEmployees.length} employees
            </div>
          </div>

          <div className="toolbar">
            <div className="search-box">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search by name, ID, department..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <select
              value={departmentFilter}
              onChange={(event) =>
                setDepartmentFilter(
                  event.target.value
                )
              }
            >
              <option value="All">
                All Departments
              </option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">
                Finance
              </option>
              <option value="Marketing">
                Marketing
              </option>
              <option value="Operations">
                Operations
              </option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="On Leave">
                On Leave
              </option>
              <option value="Inactive">
                Inactive
              </option>
            </select>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th>DEPARTMENT</th>
                  <th>DESIGNATION</th>
                  <th>STATUS</th>
                  <th>JOINED</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map(
                    (employee) => (
                      <tr key={employee.id}>
                        <td>
                          <div className="employee-cell">
                            <div className="employee-avatar">
                              {employee.name
                                ?.charAt(0)
                                ?.toUpperCase() || "E"}
                            </div>

                            <div>
                              <strong>
                                {employee.name}
                              </strong>

                              <span>
                                {employee.employeeId}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="department-text">
                            {employee.department}
                          </span>
                        </td>

                        <td>
                          {employee.designation}
                        </td>

                        <td>
                          <span
                            className={`status ${
                              employee.status
                                .toLowerCase()
                                .replace(
                                  " ",
                                  "-"
                                )
                            }`}
                          >
                            <i></i>
                            {employee.status}
                          </span>
                        </td>

                        <td>
                          {employee.joiningDate
                            ? new Date(
                                `${employee.joiningDate}T00:00:00`
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "—"}
                        </td>

                        <td>
                          <div className="action-buttons">
                            <button
                              className="view-action"
                              title="View"
                              onClick={() =>
                                openProfile(
                                  employee
                                )
                              }
                            >
                              👁
                            </button>

                            <button
                              className="edit-action"
                              title="Edit"
                              onClick={() =>
                                openEditForm(
                                  employee
                                )
                              }
                            >
                              ✎
                            </button>

                            <button
                              className="delete-action"
                              title="Delete"
                              onClick={() =>
                                setDeleteTarget(
                                  employee
                                )
                              }
                            >
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="empty-state"
                    >
                      <div>
                        <span>🔍</span>
                        <h4>
                          No employees found
                        </h4>
                        <p>
                          Try changing your search or
                          filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="dashboard-footer">
          <span>
            © 2026 ADMINCORE Employee Management
            System
          </span>

          <span>
            Secure • Reliable • Professional
          </span>
        </footer>
      </main>

      {/* =========================
          ADD / EDIT MODAL
      ========================== */}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal large-modal">
            <div className="modal-header">
              <div>
                <p className="eyebrow">
                  EMPLOYEE RECORD
                </p>

                <h3>
                  {editId
                    ? "Edit Employee"
                    : "Add Employee"}
                </h3>
              </div>

              <button
                className="close-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                  setFormData(emptyForm);
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    Employee Name *
                  </label>

                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Employee ID *
                  </label>

                  <input
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleFormChange}
                    placeholder="Example: EMP105"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleFormChange}
                  >
                    <option value="Male">
                      Male
                    </option>
                    <option value="Female">
                      Female
                    </option>
                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    Date of Joining *
                  </label>

                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleFormChange}
                    max={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Department</label>

                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleFormChange}
                  >
                    <option value="IT">
                      IT
                    </option>
                    <option value="HR">
                      HR
                    </option>
                    <option value="Finance">
                      Finance
                    </option>
                    <option value="Marketing">
                      Marketing
                    </option>
                    <option value="Operations">
                      Operations
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    Designation *
                  </label>

                  <input
                    name="designation"
                    value={formData.designation}
                    onChange={handleFormChange}
                    placeholder="Software Developer"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                  >
                    <option value="Active">
                      Active
                    </option>
                    <option value="On Leave">
                      On Leave
                    </option>
                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Phone</label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="10-digit mobile number"
                    maxLength="10"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="employee@example.com"
                  />
                </div>

                <div className="form-group full">
                  <label>
                    Current / Local Address
                  </label>

                  <textarea
                    name="localAddress"
                    value={formData.localAddress}
                    onChange={handleFormChange}
                    placeholder="Enter current address"
                    rows="3"
                  />
                </div>

                <div className="form-group full">
                  <label>
                    Permanent Address
                  </label>

                  <textarea
                    name="permanentAddress"
                    value={
                      formData.permanentAddress
                    }
                    onChange={handleFormChange}
                    placeholder="Enter permanent address"
                    rows="3"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    setShowForm(false);
                    setEditId(null);
                    setFormData(emptyForm);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                >
                  {editId
                    ? "Save Changes"
                    : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          PROFILE MODAL
      ========================== */}

      {showProfile && selectedEmployee && (
        <div className="modal-overlay">
          <div className="modal profile-modal">
            <div className="profile-top">
              <button
                className="close-btn"
                onClick={() =>
                  setShowProfile(false)
                }
              >
                ×
              </button>

              <div className="big-avatar">
                {selectedEmployee.name
                  ?.charAt(0)
                  ?.toUpperCase()}
              </div>

              <h3>{selectedEmployee.name}</h3>

              <p>
                {selectedEmployee.designation}
              </p>

              <span className="profile-id">
                {selectedEmployee.employeeId}
              </span>
            </div>

            <div className="profile-details">
              <div className="detail-item">
                <span>Department</span>
                <strong>
                  {selectedEmployee.department}
                </strong>
              </div>

              <div className="detail-item">
                <span>Designation</span>
                <strong>
                  {selectedEmployee.designation}
                </strong>
              </div>

              <div className="detail-item">
                <span>Gender</span>
                <strong>
                  {selectedEmployee.gender}
                </strong>
              </div>

              <div className="detail-item">
                <span>Status</span>
                <strong>
                  {selectedEmployee.status}
                </strong>
              </div>

              <div className="detail-item">
                <span>Date of Joining</span>
                <strong>
                  {selectedEmployee.joiningDate ||
                    "—"}
                </strong>
              </div>

              <div className="detail-item">
                <span>Phone</span>
                <strong>
                  {selectedEmployee.phone || "—"}
                </strong>
              </div>

              <div className="detail-item">
                <span>Email</span>
                <strong>
                  {selectedEmployee.email || "—"}
                </strong>
              </div>

              <div className="detail-item full">
                <span>Current / Local Address</span>
                <strong>
                  {selectedEmployee.localAddress ||
                    "—"}
                </strong>
              </div>

              <div className="detail-item full">
                <span>Permanent Address</span>
                <strong>
                  {selectedEmployee.permanentAddress ||
                    "—"}
                </strong>
              </div>
            </div>

            <div className="profile-actions">
              <button
                className="secondary-btn"
                onClick={editFromProfile}
              >
                ✎ Edit
              </button>

              <button
                className="danger-btn"
                onClick={deleteFromProfile}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          DELETE MODAL
      ========================== */}

      {deleteTarget && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <div className="delete-icon">
              🗑
            </div>

            <h3>Delete Employee?</h3>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                {deleteTarget.name}
              </strong>
              ?
            </p>

            <p className="warning-text">
              This action cannot be undone.
            </p>

            <div className="modal-actions">
              <button
                className="secondary-btn"
                onClick={() =>
                  setDeleteTarget(null)
                }
              >
                Cancel
              </button>

              <button
                className="danger-btn"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          ADMIN PROFILE MODAL
      ========================== */}

      {showAdminProfile && (
        <div className="modal-overlay">
          <div className="modal admin-profile-modal">
            <button
              className="close-btn"
              onClick={() =>
                setShowAdminProfile(false)
              }
            >
              ×
            </button>

            <div className="admin-profile-avatar">
              A
            </div>

            <p className="eyebrow">
              SYSTEM ADMINISTRATOR
            </p>

            <h3>Administrator</h3>

            <div className="admin-profile-info">
              <div>
                <span>Username</span>
                <strong>admin</strong>
              </div>

              <div>
                <span>Role</span>
                <strong>Administrator</strong>
              </div>

              <div>
                <span>Access Level</span>
                <strong>Full Access</strong>
              </div>

              <div>
                <span>System</span>
                <strong>ADMINCORE</strong>
              </div>
            </div>

            <button
              className="primary-btn full-btn"
              onClick={() =>
                setShowAdminProfile(false)
              }
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* =========================
          TOAST
      ========================== */}

      {toast && (
        <div className="toast">
          ✓ {toast}
        </div>
      )}
    </div>
  );
}

export default App;