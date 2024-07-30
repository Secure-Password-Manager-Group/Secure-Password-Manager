import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type AuthState = {
    username: string | null;
    token: string | null;
    setAuth: (data: { username: string | null; token: string | null }) => void;
    clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
    devtools(
        (set) => ({
            token: null,
            username: null,
            setAuth: (data) => set((state) => ({ ...state, ...data })),
            clearAuth: () =>
                set((state) => ({ ...state, token: null, username: null }))
        }),
        {
            name: 'authStore'
        }
    )
);
