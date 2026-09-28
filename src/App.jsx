import { useEffect, useMemo, useState } from "react";

const initialEmployees = [
  {
    id: 1,
    name: "Ankita Jana",
    employeeId: "EMP101",
    department: "IT",
    gender: "Female",
    phone: "9876543210",
    localAddress: "Kolkata, West Bengal",
    permanentAddress: "Kolkata, West Bengal",
  },
  {
    id: 2,
    name: "Rahul Das",
    employeeId: "EMP102",
    department: "HR",
    gender: "Male",
    phone: "9876543211",
    localAddress: "Howrah, West Bengal",
    permanentAddress: "Burdwan, West Bengal",
  },
  {
    id: 3,
    name: "Sneha Roy",
    employeeId: "EMP103",
    department: "Finance",
    gender: "Female",
    phone: "9876543212",
    localAddress: "Salt Lake, Kolkata",
    permanentAddress: "Durgapur, West Bengal",
  },
];

const emptyForm = {
  name: "",
  employeeId: "",
  department: "IT",
  gender: "Male",
  phone: "",
  localAddress: "",
  permanentAddress: "",
};

function App() {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem("employees");
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [toast, setToast] = useState("");

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openAddForm = () => {
    setEditId(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (employee) => {
    setEditId(employee.id);
    setFormData(employee);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setFormData(emptyForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.values(formData).some((value) => !value.trim())) {
      showToast("⚠️ Please fill all fields");
      return;
    }

    if (formData.phone.length !== 10) {
      showToast("⚠️ Phone number must be 10 digits");
      return;
    }

    if (editId) {
      setEmployees((prev) =>
        prev.map((employee) =>
          employee.id === editId
            ? { ...formData, id: editId }
            : employee
        )
      );
      showToast("✅ Employee updated successfully");
    } else {
      setEmployees((prev) => [
        ...prev,
        {
          ...formData,
          id: Date.now(),
        },
      ]);
      showToast("🎉 Employee added successfully");
    }

    closeForm();
  };

  const confirmDelete = () => {
    setEmployees((prev) =>
      prev.filter((employee) => employee.id !== deleteId)
    );
    setDeleteId(null);
    showToast("🗑️ Employee deleted successfully");
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const text = search.toLowerCase();

      const matchesSearch =
        employee.name.toLowerCase().includes(text) ||
        employee.employeeId.toLowerCase().includes(text) ||
        employee.department.toLowerCase().includes(text);

      const matchesDepartment =
        department === "All" || employee.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [employees, search, department]);

  const total = employees.length;
  const itCount = employees.filter((e) => e.department === "IT").length;
  const hrCount = employees.filter((e) => e.department === "HR").length;
  const financeCount = employees.filter(
    (e) => e.department === "Finance"
  ).length;

  return (
    <div className={darkMode ? "app dark" : "app"}>
      {/* HEADER */}
      <header className="header">
        <div className="brand">
          <div className="logo">👥</div>
          <div>
            <h1>Employee Directory</h1>
            <p>Smart Employee Management System</p>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="theme-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          <button className="add-btn" onClick={openAddForm}>
            ＋ Add Employee
          </button>
        </div>
      </header>

      {/* WELCOME */}
      <section className="welcome">
        <div>
          <span>WELCOME BACK 👋</span>
          <h2>Manage your team efficiently</h2>
          <p>
            Add, edit, search and manage all employee information
            from one place.
          </p>
        </div>

        <div className="welcome-icon">📊</div>
      </section>

      {/* STATS */}
      <section className="stats">
        <Stat icon="👥" title="Total Employees" value={total} />
        <Stat icon="💻" title="IT Department" value={itCount} />
        <Stat icon="🧑‍💼" title="HR Department" value={hrCount} />
        <Stat icon="💰" title="Finance" value={financeCount} />
      </section>

      {/* TOOLBAR */}
      <section className="toolbar">
        <div className="search-box">
          <span>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee, ID or department..."
          />
          {search && (
            <button onClick={() => setSearch("")}>✕</button>
          )}
        </div>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="All">All Departments</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
        </select>
      </section>

      {/* TABLE */}
      <section className="table-card">
        <div className="table-title">
          <div>
            <h2>Employee List</h2>
            <p>
              {filteredEmployees.length} employee
              {filteredEmployees.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="online">
            <span></span> System Active
          </div>
        </div>

        {filteredEmployees.length === 0 ? (
          <div className="empty">
            <div>🔎</div>
            <h3>No Employees Found</h3>
            <p>Try another search or department.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>ID</th>
                  <th>Department</th>
                  <th>Gender</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <div className="employee">
                        <div className="avatar">
                          {employee.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <strong>{employee.name}</strong>
                          <small>Employee</small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="id-badge">
                        {employee.employeeId}
                      </span>
                    </td>

                    <td>
                      <span className="department-badge">
                        {employee.department}
                      </span>
                    </td>

                    <td>{employee.gender}</td>

                    <td>📞 {employee.phone}</td>

                    <td>
                      <span className="address">
                        📍 {employee.localAddress}
                      </span>
                    </td>

                    <td>
                      <div className="actions">
                        <button
                          className="edit"
                          onClick={() => openEditForm(employee)}
                          title="Edit"
                        >
                          ✏️
                        </button>

                        <button
                          className="delete"
                          onClick={() => setDeleteId(employee.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ADD / EDIT MODAL */}
      {showForm && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-head">
              <div>
                <span className="modal-label">
                  {editId ? "EDIT PROFILE" : "NEW PROFILE"}
                </span>

                <h2>
                  {editId
                    ? "✏️ Edit Employee"
                    : "➕ Add New Employee"}
                </h2>

                <p>Enter the employee details below.</p>
              </div>

              <button className="close" onClick={closeForm}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />

                <Input
                  label="Employee ID"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="Example: EMP104"
                />

                <div className="form-group">
                  <label>Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  >
                    <option>IT</option>
                    <option>HR</option>
                    <option>Finance</option>
                    <option>Marketing</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <Input
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10 digit number"
                />

                <Input
                  label="Local Address"
                  name="localAddress"
                  value={formData.localAddress}
                  onChange={handleChange}
                  placeholder="Enter local address"
                />

                <div className="form-group full">
                  <label>Permanent Address</label>
                  <textarea
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleChange}
                    placeholder="Enter permanent address"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button type="submit" className="save">
                  {editId
                    ? "✓ Update Employee"
                    : "✓ Save Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="overlay">
          <div className="delete-modal">
            <div className="warning-icon">🗑️</div>

            <h2>Delete Employee?</h2>

            <p>
              Are you sure you want to delete this employee?
              This action cannot be undone.
            </p>

            <div className="delete-actions">
              <button
                className="cancel"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>

              <button
                className="confirm-delete"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && <div className="toast">{toast}</div>}

      <footer>
        <p>Employee Directory • React Assignment</p>
        <span>Built with React ⚛️ • Local Storage Enabled</span>
      </footer>
    </div>
  );
}

/* STAT COMPONENT */
function Stat({ icon, title, value }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <p>{title}</p>
        <h3>{value}</h3>
      </div>
    </div>
  );
}

/* INPUT COMPONENT */
function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

export default App;