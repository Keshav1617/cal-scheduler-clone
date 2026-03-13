import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

function NewScheduleModal({ isOpen, onClose, onConfirm }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onConfirm(name);
    setName('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full md:w-[380px] bg-[#111111] rounded-[16px] border border-zinc-800 shadow-2xl overflow-hidden">
        <div className="p-8 sm:p-10 pb-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Add a new schedule</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="px-8 sm:px-10 pb-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[14px] font-bold text-white">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-[10px] border border-zinc-800 bg-[#0A0A0A] px-4 py-3 text-[14px] text-white placeholder-zinc-600 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 font-medium transition-all"
              placeholder="Working hours"
              autoFocus
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-zinc-500 hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="bg-white text-black px-8 py-2.5 rounded-[12px] text-sm font-bold hover:bg-zinc-200 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default NewScheduleModal;
