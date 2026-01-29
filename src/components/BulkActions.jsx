import { useState } from 'react';
import { Trash2, CheckCircle, Clock, XCircle, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

function BulkActions({ selectedTickets, onBulkDelete, onBulkStatusUpdate, onClearSelection }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  if (selectedTickets.length === 0) return null;

  const handleBulkDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmBulkDelete = async () => {
    await onBulkDelete(selectedTickets);
    setShowDeleteConfirm(false);
  };

  const handleStatusUpdate = async (newStatus) => {
    await onBulkStatusUpdate(selectedTickets, newStatus);
    setShowStatusMenu(false);
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-40 animate-slide-up">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-semibold text-slate-800">
              {selectedTickets.length} selected
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200"></div>

          {/* Status Update */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-sm font-medium"
            >
              <Clock className="w-4 h-4" />
              Update Status
            </button>

            {showStatusMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-xl border border-slate-200 py-2 min-w-[150px]">
                <button
                  onClick={() => handleStatusUpdate('todo')}
                  className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors text-sm flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  To Do
                </button>
                <button
                  onClick={() => handleStatusUpdate('in-progress')}
                  className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors text-sm flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  In Progress
                </button>
                <button
                  onClick={() => handleStatusUpdate('done')}
                  className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors text-sm flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Done
                </button>
              </div>
            )}
          </div>

          {/* Delete */}
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>

          {/* Clear Selection */}
          <button
            onClick={onClearSelection}
            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium text-slate-600"
          >
            <XCircle className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Delete Tickets?</h2>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete {selectedTickets.length} ticket
              {selectedTickets.length > 1 ? 's' : ''}? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmBulkDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-semibold transition-all"
              >
                Delete {selectedTickets.length} Ticket{selectedTickets.length > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BulkActions;