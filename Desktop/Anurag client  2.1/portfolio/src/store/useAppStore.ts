import { create } from 'zustand';

interface AppState {
    isMenuOpen: boolean;
    setMenuOpen: (isOpen: boolean) => void;
    isLoading: boolean;
    setLoading: (isLoading: boolean) => void;
    cursorMode: 'default' | 'view' | 'link' | 'hidden';
    setCursorMode: (mode: 'default' | 'view' | 'link' | 'hidden') => void;
}

export const useAppStore = create<AppState>((set) => ({
    isMenuOpen: false,
    setMenuOpen: (isOpen) => set({ isMenuOpen: isOpen }),
    isLoading: true, // starts loading
    setLoading: (isLoading) => set({ isLoading }),
    cursorMode: 'default',
    setCursorMode: (mode) => set({ cursorMode: mode }),
}));
