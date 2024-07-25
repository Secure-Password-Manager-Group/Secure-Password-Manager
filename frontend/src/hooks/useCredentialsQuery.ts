import { useQuery } from '@tanstack/react-query';
import apiClient from '../common/api';
import { useAuthStore } from '../store/auth';
import { Credential } from '../common/types';

export default function useCredentialsQuery() {
    const { token } = useAuthStore();

    const credentialsQuery = useQuery({
        queryKey: ['credentials'],
        queryFn: () => {
            return apiClient.get<Credential[]>('/passwords', {
                headers: { 'x-access-tokens': token }
            });
        }
    });

    return credentialsQuery;
}
