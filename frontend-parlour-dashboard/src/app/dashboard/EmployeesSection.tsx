"use client";
import React, { useEffect, useState } from "react";
import EmployeeDialog from "../../components/EmployeeDialog";
import ConfirmDialog from "../../components/ConfirmDialog";
import { API_BASE_URL } from "../../lib/config";

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function EmployeesSection() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState<string>("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to fetch employees");
      } else {
        setEmployees(data);
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get user role from JWT
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserRole(payload.role);
      } catch {}
    }
    fetchEmployees();
     
  }, []);

  // Add Employee
  const handleAdd = async (data: { name: string; email: string; role: string }) => {
    setActionLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/api/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.message || "Failed to add employee");
      } else {
        setShowAdd(false);
        fetchEmployees();
      }
    } catch {
      setError("Network error");
    } finally {
      setActionLoading(false);
    }
  };

  // Edit Employee
  const handleEdit = async (data: { name: string; email: string; role: string }) => {
    if (!editEmployee) return;
    setActionLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/api/employees/${editEmployee._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.message || "Failed to update employee");
      } else {
        setShowEdit(false);
        setEditEmployee(null);
        fetchEmployees();
      }
    } catch {
      setError("Network error");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Employee
  const handleDelete = async () => {
    if (!deleteEmployee) return;
    setActionLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/api/employees/${deleteEmployee._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.message || "Failed to delete employee");
      } else {
        setShowDelete(false);
        setDeleteEmployee(null);
        fetchEmployees();
      }
    } catch {
      setError("Network error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow text-center">
      <h2 className="text-2xl font-bold mb-4 text-blue-300">Employees</h2>
      {error && <div className="text-red-400 mb-4">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Joined</th>
                {userRole === "superadmin" && <th className="px-4 py-2">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id} className="border-b border-gray-800 hover:bg-gray-800">
                  <td className="px-4 py-2">{emp.name}</td>
                  <td className="px-4 py-2">{emp.email}</td>
                  <td className="px-4 py-2 capitalize">{emp.role}</td>
                  <td className="px-4 py-2">{new Date(emp.createdAt).toLocaleDateString()}</td>
                  {userRole === "superadmin" && (
                    <td className="px-4 py-2 space-x-2">
                      <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded text-xs" onClick={() => { setEditEmployee(emp); setShowEdit(true); }}>Edit</button>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs" onClick={() => { setDeleteEmployee(emp); setShowDelete(true); }}>Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {userRole === "superadmin" && (
        <div className="mt-6 text-left">
          <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded font-semibold shadow" onClick={() => setShowAdd(true)}>Add Employee</button>
        </div>
      )}
      {/* Add Dialog */}
      <EmployeeDialog open={showAdd} onOpenChange={setShowAdd} onSubmit={handleAdd} loading={actionLoading} />
      {/* Edit Dialog */}
      <EmployeeDialog open={showEdit} onOpenChange={setShowEdit} onSubmit={handleEdit} initialData={editEmployee ? { name: editEmployee.name, email: editEmployee.email, role: editEmployee.role } : undefined} loading={actionLoading} />
      {/* Delete Dialog */}
      <ConfirmDialog open={showDelete} onOpenChange={setShowDelete} onConfirm={handleDelete} loading={actionLoading} message={`Are you sure you want to delete ${deleteEmployee?.name}?`} />
    </div>
  );
}