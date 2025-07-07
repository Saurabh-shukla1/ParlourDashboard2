"use client";
import React, { useEffect, useState } from "react";
import TaskDialog from "../../components/TaskDialog";
import ConfirmDialog from "../../components/ConfirmDialog";
import { API_BASE_URL } from "../../lib/config";

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  assignedTo: Employee;
  status: string;
  createdAt: string;
}

export default function TasksSection() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState<string>("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const [tasksRes, employeesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/tasks`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/employees`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const tasksData = await tasksRes.json();
      const employeesData = await employeesRes.json();
      if (!tasksRes.ok) setError(tasksData.message || "Failed to fetch tasks");
      else setTasks(tasksData);
      if (!employeesRes.ok) setError(employeesData.message || "Failed to fetch employees");
      else setEmployees(employeesData);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserRole(payload.role);
      } catch {}
    }
    fetchData();
     
  }, []);

  // Add Task
  const handleAdd = async (data: { title: string; description: string; assignedTo: string; status: string }) => {
    setActionLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.message || "Failed to add task");
      } else {
        setShowAdd(false);
        fetchData();
      }
    } catch {
      setError("Network error");
    } finally {
      setActionLoading(false);
    }
  };

  // Edit Task
  const handleEdit = async (data: { title: string; description: string; assignedTo: string; status: string }) => {
    if (!editTask) return;
    setActionLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${editTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.message || "Failed to update task");
      } else {
        setShowEdit(false);
        setEditTask(null);
        fetchData();
      }
    } catch {
      setError("Network error");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Task
  const handleDelete = async () => {
    if (!deleteTask) return;
    setActionLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${deleteTask._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.message || "Failed to delete task");
      } else {
        setShowDelete(false);
        setDeleteTask(null);
        fetchData();
      }
    } catch {
      setError("Network error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow text-center">
      <h2 className="text-2xl font-bold mb-4 text-green-300">Tasks</h2>
      {error && <div className="text-red-400 mb-4">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Assigned To</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Created</th>
                {userRole === "superadmin" && <th className="px-4 py-2">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} className="border-b border-gray-800 hover:bg-gray-800">
                  <td className="px-4 py-2">{task.title}</td>
                  <td className="px-4 py-2">{task.description}</td>
                  <td className="px-4 py-2">{task.assignedTo?.name || "-"}</td>
                  <td className="px-4 py-2 capitalize">{task.status}</td>
                  <td className="px-4 py-2">{new Date(task.createdAt).toLocaleDateString()}</td>
                  {userRole === "superadmin" && (
                    <td className="px-4 py-2 space-x-2">
                      <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded text-xs" onClick={() => { setEditTask(task); setShowEdit(true); }}>Edit</button>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs" onClick={() => { setDeleteTask(task); setShowDelete(true); }}>Delete</button>
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
          <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded font-semibold shadow" onClick={() => setShowAdd(true)}>Add Task</button>
        </div>
      )}
      {/* Add Dialog */}
      <TaskDialog open={showAdd} onOpenChange={setShowAdd} onSubmit={handleAdd} employees={employees} loading={actionLoading} />
      {/* Edit Dialog */}
      <TaskDialog open={showEdit} onOpenChange={setShowEdit} onSubmit={handleEdit} initialData={editTask ? { title: editTask.title, description: editTask.description, assignedTo: editTask.assignedTo?._id, status: editTask.status } : undefined} employees={employees} loading={actionLoading} />
      {/* Delete Dialog */}
      <ConfirmDialog open={showDelete} onOpenChange={setShowDelete} onConfirm={handleDelete} loading={actionLoading} message={`Are you sure you want to delete '${deleteTask?.title}'?`} />
    </div>
  );
}