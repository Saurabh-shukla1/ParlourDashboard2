"use client";
import { useAuth } from "@/hooks/useAuth";
import EmployeesSection from "../EmployeesSection";
import TasksSection from "../TasksSection";
import AttendanceSection from "../AttendanceSection";

export default function SuperAdminDashboardPage() {
  const { user, loading, logout } = useAuth("superadmin");

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Don't render anything if user is null (redirecting)
  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-center">Super Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            {user && (
              <div className="text-right">
                <div className="font-semibold text-blue-300">{user.name}</div>
                <div className="text-xs text-gray-400 capitalize">{user.role}</div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold shadow"
            >
              Logout
            </button>
          </div>
        </div>
        <EmployeesSection />
        <TasksSection />
        <AttendanceSection />
      </div>
    </div>
  );
} 