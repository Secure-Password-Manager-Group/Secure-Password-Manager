import { Stack, Title } from '@mantine/core';
import { Navigate } from 'react-router-dom';
import CredentialForm from '../components/CredentialForm';
import Layout from '../layouts/Layout';
import { useAuthStore } from '../store/auth';
import useCheckToken from '../hooks/useCheckToken';
import Loading from '../components/Loading';

export default function AddCredential() {
    const token = useAuthStore((state) => state.token);
    const { isChecking } = useCheckToken();

    if (isChecking) {
        return <Loading />;
    }

    if (!token) {
        return <Navigate to='/' />;
    }

    return (
        <Layout>
            <Stack>
                <Title order={1} mx='auto'>
                    Add Credential
                </Title>
                <CredentialForm />
            </Stack>
        </Layout>
    );
}
