"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EmployeesSection from "../EmployeesSection";
import TasksSection from "../TasksSection";
import AttendanceSection from "../AttendanceSection";

export default function SuperAdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role !== "superadmin") {
        router.replace(`/dashboard/${payload.role}`);
      } else {
        setUser({ name: payload.name || "Super Admin", role: payload.role });
      }
    } catch {
      router.replace("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
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