import React from 'react';
import Modal from '../common/Modal';
import { AlertTriangle } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, studentName }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion" maxWidth="max-w-md">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">Delete Student Record?</h4>
          <p className="text-xs text-slate-500 mt-1">
            Are you sure you want to delete the record for <span className="font-semibold text-slate-900">{studentName}</span>? Institutional rankings will be automatically recalculated.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition">Yes, Delete Record</button>
        </div>
      </div>
    </Modal>
  );
}
