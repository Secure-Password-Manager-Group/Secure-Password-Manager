import { Loader, Stack, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import apiClient from '../common/api';
import { Credential } from '../common/types';
import CredentialForm from '../components/CredentialForm';
import useCheckToken from '../hooks/useCheckToken';
import Layout from '../layouts/Layout';
import { useAuthStore } from '../store/auth';

export default function EditCredential() {
    const token = useAuthStore((state) => state.token);
    const { isChecking } = useCheckToken();
    const { id } = useParams();

    const { data, isError, isPending, isFetching, refetch, error } = useQuery({
        queryKey: ['credential', id],
        enabled: false,
        queryFn: () =>
            apiClient.get<Credential>(`/passwords/${id}`, {
                headers: { 'x-access-tokens': token }
            })
    });

    useEffect(() => {
        if (!isChecking && token) {
            refetch();
        }
    }, [isChecking, token, refetch]);

    if (isChecking) {
        return <Loader />;
    }

    if (!token) {
        return <Navigate to='/' />;
    }

    const getContent = () => {
        if (isPending || isFetching) {
            return <Loader />;
        }

        if (isError) {
            if (isAxiosError(error) && error.response?.status === 403) {
                return <Navigate to='/dashboard' />;
            }
            return <Text>Failed to fetch credential</Text>;
        }

        return <CredentialForm credential={data.data} />;
    };

    return (
        <Layout>
            <Stack>
                <Text mx='auto' size='xl'>
                    Edit Credential
                </Text>
                {getContent()}
            </Stack>
        </Layout>
    );
}
