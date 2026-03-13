import Modal from './Modal';

function ConfirmDialog({ isOpen, title, description, confirmLabel, onCancel, onConfirm, loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <div className="w-full max-w-md bg-[#101010] rounded-[24px] border border-zinc-800 shadow-2xl overflow-hidden p-8 animate-in fade-in zoom-in-95 duration-300">
        <h2 className="text-xl font-bold text-white mb-2 tracking-tight">{title}</h2>
        <p className="text-[14px] text-zinc-500 font-medium leading-[1.6] mb-8">{description}</p>
        
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button 
            type="button" 
            onClick={onCancel} 
            disabled={loading}
            className="px-6 py-2.5 text-sm font-bold text-zinc-400 hover:text-white transition-colors"
          >
            Go back
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-8 py-2.5 bg-red-600/10 border border-red-600/20 text-red-500 rounded-[12px] text-sm font-bold hover:bg-red-600/20 transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
