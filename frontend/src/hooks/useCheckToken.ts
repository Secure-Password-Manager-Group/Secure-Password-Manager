import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../common/api';
import { useAuthStore } from '../store/auth';
import { useMounted } from '@mantine/hooks';

export default function useCheckToken() {
    const { clearAuth, setAuth } = useAuthStore();
    const token = useAuthStore((state) => state.token);
    const mounted = useMounted();

    const {
        isPending,
        isFetching,
        data,
        isError,
        refetch,
        isSuccess,
        isRefetching
    } = useQuery({
        queryKey: ['user'],
        queryFn: () => {
            const t = token || localStorage.getItem('token');
            if (!t) {
                return Promise.resolve({ data: { username: '' } });
            }
            return apiClient.get<{ username: string }>('/user', {
                headers: {
                    'x-access-tokens': t
                }
            });
        },
        enabled: false,
        staleTime: 0,
        retry: false
    });

    useEffect(() => {
        if (mounted) {
            refetch();
        }
    }, [refetch, mounted]);

    useEffect(() => {
        if (isSuccess && data && data.data.username && !token) {
            const t = localStorage.getItem('token');
            setAuth({ username: data.data.username, token: t });
        }
    }, [isSuccess, data, setAuth, token]);

    useEffect(() => {
        if (isError) {
            localStorage.removeItem('token');
            clearAuth();
        }
    }, [isError, clearAuth]);

    return {
        isChecking: isPending || isFetching || isRefetching
    };
}
