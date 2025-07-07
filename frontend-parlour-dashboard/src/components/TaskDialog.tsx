"use client";
import * as React from "react";

interface Employee {
  _id: string;
  name: string;
}

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { title: string; description: string; assignedTo: string; status: string }) => void;
  initialData?: { title: string; description: string; assignedTo: string; status: string };
  employees: Employee[];
  loading?: boolean;
}

export default function TaskDialog({ open, onOpenChange, onSubmit, initialData, employees, loading }: TaskDialogProps) {
  const [title, setTitle] = React.useState(initialData?.title || "");
  const [description, setDescription] = React.useState(initialData?.description || "");
  const [assignedTo, setAssignedTo] = React.useState(initialData?.assignedTo || (employees[0]?._id || ""));
  const [status, setStatus] = React.useState(initialData?.status || "pending");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setTitle(initialData?.title || "");
    setDescription(initialData?.description || "");
    setAssignedTo(initialData?.assignedTo || (employees[0]?._id || ""));
    setStatus(initialData?.status || "pending");
    setError("");
  }, [initialData, open, employees]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !assignedTo || !status) {
      setError("All fields are required");
      return;
    }
    onSubmit({ title, description, assignedTo, status });
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${open ? "" : "hidden"}`}>
      <div className="bg-black bg-opacity-50 absolute inset-0" onClick={() => onOpenChange(false)} />
      <div className="relative bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-xl z-10">
        <h3 className="text-xl font-bold mb-4 text-green-300">{initialData ? "Edit Task" : "Add Task"}</h3>
        {error && <div className="text-red-400 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-200 mb-1">Title</label>
            <input className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none" value={title} onChange={e => setTitle(e.target.value)} disabled={loading} />
          </div>
          <div>
            <label className="block text-gray-200 mb-1">Description</label>
            <textarea className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none" value={description} onChange={e => setDescription(e.target.value)} disabled={loading} />
          </div>
          <div>
            <label className="block text-gray-200 mb-1">Assign To</label>
            <select className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none" value={assignedTo} onChange={e => setAssignedTo(e.target.value)} disabled={loading}>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-200 mb-1">Status</label>
            <select className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none" value={status} onChange={e => setStatus(e.target.value)} disabled={loading}>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-green-700 text-white font-semibold hover:bg-green-800" disabled={loading}>{loading ? "Saving..." : initialData ? "Save" : "Add"}</button>
          </div>
        </form>
      </div>
    </div>
  );
} 