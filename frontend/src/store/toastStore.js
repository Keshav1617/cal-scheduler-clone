import { create } from 'zustand';

let idCounter = 1;

export const useToastStore = create((set) => ({
  toasts: [],
  pushToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id: idCounter++,
          type: toast.type || 'info',
          title: toast.title,
          message: toast.message,
        },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

