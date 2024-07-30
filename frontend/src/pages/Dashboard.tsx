import { ActionIcon, Group, Loader, Stack, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { Navigate, useNavigate } from 'react-router-dom';
import CredentialsTable from '../components/CredentialsTable';
import useCheckToken from '../hooks/useCheckToken';
import Layout from '../layouts/Layout';
import { useAuthStore } from '../store/auth';

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
                <Group mx='auto'>
                    <Title order={1}>Credentials</Title>
                    <ActionIcon
                        size='lg'
                        color='cyan'
                        onClick={() => navigate('/add-credential')}
                    >
                        <IconPlus />
                    </ActionIcon>
                </Group>
                <CredentialsTable />
            </Stack>
        </Layout>
    );
}
