import { useQuery } from '@tanstack/react-query';
import apiClient from '../common/api';
import { useAuthStore } from '../store/auth';

export default function useCheckToken() {
    const token = useAuthStore((state) => state.token);

    const { isPending, isFetching, isRefetching } = useQuery({
        queryKey: ['user'],
        queryFn: () => {
            const t = token;
            if (!t) {
                return Promise.resolve({ data: { username: '' } });
            }
            return apiClient.get<{ username: string }>('/user', {
                headers: {
                    'x-access-tokens': t
                }
            });
        },
        staleTime: 1000 * 60 * 10,
        retry: false
    });

    return {
        isChecking: isPending || isFetching || isRefetching
    };
}
