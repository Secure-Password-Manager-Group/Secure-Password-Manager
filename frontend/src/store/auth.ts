import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type AuthState = {
    token: string | null;
    setToken: (token: string | null) => void;
};

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                token: null,
                setToken: (token) => set({ token })
            }),
            { name: 'authStore' }
        )
    )
);
