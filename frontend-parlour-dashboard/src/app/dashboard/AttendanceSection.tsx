"use client";
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface AttendanceLog {
  _id: string;
  employee: { name: string; email: string; role: string };
  type: "in" | "out";
  timestamp: string;
}

let socket: Socket | null = null;

export default function AttendanceSection() {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/attendance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) setError(data.message || "Failed to fetch attendance logs");
      else setLogs(data);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // Setup WebSocket
    if (!socket) {
      socket = io("http://localhost:5000");
    }
    socket.on("attendance_update", ({ log }) => {
      setLogs((prev) => [log, ...prev]);
    });
    return () => {
      socket?.off("attendance_update");
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow text-center">
      <h2 className="text-2xl font-bold mb-4 text-yellow-300">Attendance</h2>
      {error && <div className="text-red-400 mb-4">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-4 py-2">Employee</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-b border-gray-800 hover:bg-gray-800">
                  <td className="px-4 py-2">{log.employee?.name || "-"}</td>
                  <td className="px-4 py-2 capitalize">{log.type}</td>
                  <td className="px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 