"use client";
import * as React from "react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
  message: string;
}

export default function ConfirmDialog({ open, onOpenChange, onConfirm, loading, message }: ConfirmDialogProps) {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${open ? "" : "hidden"}`}>
      <div className="bg-black bg-opacity-50 absolute inset-0" onClick={() => onOpenChange(false)} />
      <div className="relative bg-gray-900 rounded-lg p-6 w-full max-w-sm shadow-xl z-10">
        <h3 className="text-lg font-bold mb-4 text-red-400">Confirm</h3>
        <div className="mb-6 text-gray-200">{message}</div>
        <div className="flex justify-end space-x-2">
          <button type="button" className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</button>
          <button type="button" className="px-4 py-2 rounded bg-red-700 text-white font-semibold hover:bg-red-800" onClick={onConfirm} disabled={loading}>{loading ? "Deleting..." : "Delete"}</button>
        </div>
      </div>
    </div>
  );
} 