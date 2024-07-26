import { Button, Loader, Stack, Text } from '@mantine/core';
import { Navigate, useNavigate } from 'react-router-dom';
import CredentialsTable from '../components/CredentialsTable';
import Layout from '../layouts/Layout';
import { useAuthStore } from '../store/auth';
import useCheckToken from '../hooks/useCheckToken';

export default function Dashboard() {
    const { isChecking } = useCheckToken();
    const token = useAuthStore((state) => state.token);
    const navigate = useNavigate();

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
                    Credentials
                </Text>
                <Button onClick={() => navigate('/add-credential')}>
                    Add Credential
                </Button>
                <CredentialsTable />
            </Stack>
        </Layout>
    );
}
