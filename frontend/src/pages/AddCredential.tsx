import { Loader, Stack, Text } from '@mantine/core';
import { Navigate } from 'react-router-dom';
import CredentialForm from '../components/CredentialForm';
import Layout from '../layouts/Layout';
import { useAuthStore } from '../store/auth';
import useCheckToken from '../hooks/useCheckToken';

export default function AddCredential() {
    const token = useAuthStore((state) => state.token);
    const { isChecking } = useCheckToken();

    if (isChecking) {
        return <Loader />;
    }

    if (!token) {
        return <Navigate to='/' />;
    }

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
