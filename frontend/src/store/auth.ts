import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type AuthState = {
    username: string | null;
    token: string | null;
    setAuth: (data: { username: string | null; token: string | null }) => void;
    clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                token: null,
                username: null,
                setAuth: (data) => set(data),
                clearAuth: () => set({ token: null, username: null })
            }),
            { name: 'authStore' }
        )
    )
);
