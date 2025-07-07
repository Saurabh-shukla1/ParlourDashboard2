"use client";
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AttendanceLog {
  _id: string;
  employee: Employee;
  type: "in" | "out";
  timestamp: string;
}

let socket: Socket | null = null;

export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch employees and logs
  const fetchData = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const [empRes, logRes] = await Promise.all([
        fetch("http://localhost:5000/api/employees", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/api/attendance", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const empData = await empRes.json();
      const logData = await logRes.json();
      if (!empRes.ok) setError(empData.message || "Failed to fetch employees");
      else setEmployees(empData);
      if (!logRes.ok) setError(logData.message || "Failed to fetch logs");
      else setLogs(logData);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (!socket) {
      socket = io("http://localhost:5000");
    }
    socket.on("attendance_update", ({ log }: { log: AttendanceLog }) => {
      setLogs((prev) => [log, ...prev]);
    });
    return () => {
      socket?.off("attendance_update");
    };
     
  }, []);

  // Get last punch type for employee
  const getLastType = (empId: string) => {
    const log = logs.find((l) => l.employee._id === empId);
    return log?.type || "out";
  };

  // Punch In/Out
  const handlePunch = async (empId: string, type: "in" | "out") => {
    setActionLoading(empId + type);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/attendance/punch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ employeeId: empId, type }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.message || "Failed to punch");
      else {
        // Optimistically update logs for instant UI feedback
        setLogs((prev) => [{ ...data, employee: employees.find(e => e._id === empId) }, ...prev]);
      }
      // log will also be added via WebSocket, but this makes UI instant
    } catch {
      setError("Network error");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-yellow-300">Attendance Punch</h1>
        {error && <div className="text-red-400 mb-4 text-center">{error}</div>}
        {loading ? (
          <div className="text-gray-400 text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {employees.map((emp) => {
              const lastType = getLastType(emp._id);
              const nextType = lastType === "in" ? "out" : "in";
              return (
                <div key={emp._id} className="bg-gray-800 rounded-lg p-6 shadow flex flex-col items-center">
                  <div className="text-lg font-bold mb-2 text-blue-200">{emp.name}</div>
                  <div className="text-gray-400 mb-4">{emp.email}</div>
                  <button
                    className={`px-6 py-2 rounded font-semibold shadow text-white transition ${
                      nextType === "in"
                        ? "bg-green-700 hover:bg-green-800"
                        : "bg-red-700 hover:bg-red-800"
                    }`}
                    disabled={!!actionLoading}
                    onClick={() => handlePunch(emp._id, nextType as "in" | "out")}
                  >
                    {actionLoading === emp._id + nextType ? "Processing..." : nextType === "in" ? "Punch In" : "Punch Out"}
                  </button>
                  <div className="mt-2 text-xs text-gray-500">
                    Last: {lastType === "in" ? "Punched In" : "Punched Out"}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 