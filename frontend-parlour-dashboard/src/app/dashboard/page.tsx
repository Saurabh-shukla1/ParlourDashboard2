"use client";
import React, { useState } from "react";
import { useAuthRedirect } from "@/hooks/useAuth";
import EmployeesSection from "./EmployeesSection";
import TasksSection from "./TasksSection";
import AttendanceSection from "./AttendanceSection";

const tabs = [
  { label: "Employees", value: "employees" },
  { label: "Tasks", value: "tasks" },
  { label: "Attendance", value: "attendance" },
];

export default function DashboardPage() {
  const [selectedTab, setSelectedTab] = useState("employees");
  
  // This will redirect users to their role-specific dashboard
  useAuthRedirect();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Parlour Admin Dashboard</h1>
        <div className="flex space-x-4 mb-8 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedTab(tab.value)}
              className={`px-4 py-2 rounded-t font-semibold transition border-b-2 focus:outline-none ${
                selectedTab === tab.value
                  ? "border-blue-500 bg-gray-800 text-blue-400"
                  : "border-transparent bg-gray-700 hover:bg-gray-600 text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="bg-gray-800 rounded-b-xl shadow p-6 min-h-[300px]">
          {selectedTab === "employees" && <EmployeesSection />}
          {selectedTab === "tasks" && <TasksSection />}
          {selectedTab === "attendance" && <AttendanceSection />}
        </div>
      </div>
    </div>
  );
} 