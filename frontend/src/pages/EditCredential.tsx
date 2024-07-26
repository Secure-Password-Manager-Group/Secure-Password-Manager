import { Loader, Stack, Text } from '@mantine/core';
import { useMounted } from '@mantine/hooks';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CredentialForm from '../components/CredentialForm';
import Layout from '../layouts/Layout';
import { useAuthStore } from '../store/auth';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../common/api';
import { Credential } from '../common/types';

export default function EditCredential() {
    const { token } = useAuthStore();
    const mounted = useMounted();
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, isError, isPending, isFetching, refetch } = useQuery({
        queryKey: ['credential', id],
        enabled: false,
        queryFn: () =>
            apiClient.get<Credential>(`/passwords/${id}`, {
                headers: { 'x-access-tokens': token }
            })
    });

    useEffect(() => {
        if (mounted) {
            if (!token) {
                navigate('/');
            }
            refetch();
        }
    }, [mounted, navigate, token, refetch]);

    const getContent = () => {
        if (isPending || isFetching) {
            return <Loader />;
        }

        if (isError) {
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
