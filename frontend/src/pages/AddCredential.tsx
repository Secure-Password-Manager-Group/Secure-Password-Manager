import { Stack, Text } from '@mantine/core';
import { useMounted } from '@mantine/hooks';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CredentialForm from '../components/CredentialForm';
import Layout from '../layouts/Layout';
import { useAuthStore } from '../store/auth';

export default function AddCredential() {
    const { token } = useAuthStore();
    const mounted = useMounted();
    const navigate = useNavigate();

    useEffect(() => {
        if (mounted) {
            if (!token) {
                navigate('/');
            }
        }
    }, [mounted, navigate, token]);

    return (
        <Layout>
            <Stack>
                <Text mx='auto' size='xl'>
                    Add Credential
                </Text>
                <CredentialForm />
            </Stack>
        </Layout>
    );
}
