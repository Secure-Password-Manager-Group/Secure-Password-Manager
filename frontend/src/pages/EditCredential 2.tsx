import { Skeleton, Stack, Text, Title } from '@mantine/core'; //Loader removed
import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import apiClient from '../common/api';
import { Credential } from '../common/types';
import CredentialForm from '../components/CredentialForm';
import Loading from '../components/Loading';
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
        return <Loading />;
    }

    if (!token) {
        return <Navigate to='/' />;
    }

    const getContent = () => {
        if (isPending || isFetching) {
            return (
                <Stack gap="xl" mt={20}>
                    <Skeleton height={40} />
                    <Skeleton height={40} />
                    <Skeleton height={40} />
                </Stack>
            );
        }

        if (isError) {
            if (isAxiosError(error) && error.response?.status === 403) {
                return <Navigate to='/dashboard' />;
            }
            return <Text>Failed to fetch credential. Please try again.</Text>;
        }

        return <CredentialForm credential={data.data} />;
    };

    return (
        <Layout>
            <Stack>
                <Title order={1} mx='auto'>
                    Edit Credential
                </Title>
                {getContent()}
            </Stack>
        </Layout>
    );
}
