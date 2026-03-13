import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { getEventTypes, bulkUpdateEventTypesAvailability } from '../../api/eventTypesApi';
import { useToastStore } from '../../store/toastStore';

function BulkUpdateModal({ isOpen, onClose, scheduleId }) {
  const [eventTypes, setEventTypes] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const pushToast = useToastStore((s) => s.pushToast);

  useEffect(() => {
    if (isOpen) {
      const fetchEventTypes = async () => {
        setLoading(true);
        try {
          const res = await getEventTypes();
          setEventTypes(res.data);
          // Auto-select all by default as shown in the GIF
          setSelectedIds(res.data.map(et => et.id));
        } catch (err) {
          pushToast({ type: 'error', title: 'Failed to load event types' });
        } finally {
          setLoading(false);
        }
      };
      fetchEventTypes();
    } else {
        // Reset when closed
        setSelectedIds([]);
        setEventTypes([]);
    }
  }, [isOpen, pushToast]);

  const toggleSelectAll = () => {
    if (selectedIds.length === eventTypes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(eventTypes.map(et => et.id));
    }
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleUpdate = async () => {
    if (selectedIds.length === 0) return;
    setUpdating(true);
    try {
      await bulkUpdateEventTypesAvailability({ ids: selectedIds, scheduleId });
      pushToast({ type: 'success', title: 'Event types updated successfully' });
      onClose();
    } catch (err) {
      pushToast({ type: 'error', title: 'Failed to update event types' });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-lg bg-[#0A0A0A] rounded-[24px] border border-zinc-800 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 p-8">
        <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Bulk update existing event types</h2>
        <p className="text-[14px] text-zinc-500 mb-8 font-medium">Update the schedules for the selected event types</p>

        <div className="space-y-3 mb-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          <div 
            onClick={toggleSelectAll}
            className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-zinc-900/40 transition-all cursor-pointer group"
          >
            <div className={`h-5 w-5 rounded transition-all flex items-center justify-center ${eventTypes.length > 0 && selectedIds.length === eventTypes.length ? 'bg-[#006FEE] border-transparent' : 'border-2 border-zinc-700 bg-transparent group-hover:border-zinc-500'}`}>
              {eventTypes.length > 0 && selectedIds.length === eventTypes.length && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span className="text-[15px] font-bold text-white">Select all</span>
          </div>

          {loading ? (
             <div className="py-10 text-center text-zinc-500 font-medium animate-pulse">Loading event types...</div>
          ) : eventTypes.length === 0 ? (
             <div className="py-10 text-center text-zinc-500 font-medium">No event types found</div>
          ) : (
            eventTypes.map(et => (
              <div 
                key={et.id}
                onClick={() => toggleSelect(et.id)}
                className="flex items-center gap-4 py-3.5 px-4 rounded-xl bg-[#111111]/50 border border-zinc-900 hover:bg-zinc-900/80 transition-all cursor-pointer group"
              >
                <div className={`h-5 w-5 rounded transition-all flex items-center justify-center ${selectedIds.includes(et.id) ? 'bg-[#006FEE] border-transparent' : 'border-2 border-zinc-700 bg-transparent group-hover:border-zinc-500'}`}>
                  {selectedIds.includes(et.id) && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-[15px] font-medium text-zinc-300">{et.title}</span>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-end gap-3 mt-auto">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors"
          >
            Close
          </button>
          <button 
            onClick={handleUpdate}
            disabled={selectedIds.length === 0 || updating}
            className="bg-white text-black px-6 py-2 rounded-lg text-[13px] font-bold hover:bg-zinc-200 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {updating ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default BulkUpdateModal;
