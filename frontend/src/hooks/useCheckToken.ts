import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../common/api';
import { useAuthStore } from '../store/auth';
import { useMounted } from '@mantine/hooks';

export default function useCheckToken() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { setAuth } = useAuthStore();
    const mounted = useMounted();

    const { mutate } = useMutation({
        mutationFn: (values: { token: string }) =>
            apiClient.get<{ username: string }>('/user', {
                headers: {
                    'x-access-tokens': values.token
                }
            }),
        onSuccess: (res, { token }) => {
            setAuth({ username: res.data.username, token });
            setIsLoading(false);
        },
        onError: () => {
            localStorage.removeItem('token');
            setIsLoading(false);
        }
    });

    useEffect(() => {
        if (mounted) {
            const token = localStorage.getItem('token');
            if (token) {
                mutate({ token });
            } else {
                setIsLoading(false);
            }
        }
    }, [mutate, mounted]);

    return { isLoading };
}
