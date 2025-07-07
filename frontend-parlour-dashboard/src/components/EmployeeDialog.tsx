"use client";
import * as React from "react";

interface EmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; email: string; role: string }) => void;
  initialData?: { name: string; email: string; role: string };
  loading?: boolean;
}

export default function EmployeeDialog({ open, onOpenChange, onSubmit, initialData, loading }: EmployeeDialogProps) {
  const [name, setName] = React.useState(initialData?.name || "");
  const [email, setEmail] = React.useState(initialData?.email || "");
  const [role, setRole] = React.useState(initialData?.role || "");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setName(initialData?.name || "");
    setEmail(initialData?.email || "");
    setRole(initialData?.role || "");
    setError("");
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !role) {
      setError("All fields are required");
      return;
    }
    onSubmit({ name, email, role });
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${open ? "" : "hidden"}`}>
      <div className="bg-black bg-opacity-50 absolute inset-0" onClick={() => onOpenChange(false)} />
      <div className="relative bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-xl z-10">
        <h3 className="text-xl font-bold mb-4 text-blue-300">{initialData ? "Edit Employee" : "Add Employee"}</h3>
        {error && <div className="text-red-400 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-200 mb-1">Name</label>
            <input className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none" value={name} onChange={e => setName(e.target.value)} disabled={loading} />
          </div>
          <div>
            <label className="block text-gray-200 mb-1">Email</label>
            <input className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none" value={email} onChange={e => setEmail(e.target.value)} disabled={!!initialData || loading} />
          </div>
          <div>
            <label className="block text-gray-200 mb-1">Role</label>
            <input className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none" value={role} onChange={e => setRole(e.target.value)} disabled={loading} />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-700 text-white font-semibold hover:bg-blue-800" disabled={loading}>{loading ? "Saving..." : initialData ? "Save" : "Add"}</button>
          </div>
        </form>
      </div>
    </div>
  );
} 