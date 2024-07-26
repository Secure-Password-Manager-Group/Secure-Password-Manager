import { Button, Stack, Text } from '@mantine/core';
import { useMounted } from '@mantine/hooks';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CredentialsTable from '../components/CredentialsTable';
import Layout from '../layouts/Layout';
import { useAuthStore } from '../store/auth';

export default function Dashboard() {
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
                    Credentials
                </Text>
                <Button onClick={() => navigate('/add-credential')}>Add Credential</Button>
                <CredentialsTable />
            </Stack>
        </Layout>
    );
}
