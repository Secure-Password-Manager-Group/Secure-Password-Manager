import { ActionIcon, Group, Stack, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { Link, Navigate } from 'react-router-dom';
import CredentialsTable from '../components/CredentialsTable';
import Loading from '../components/Loading';
import useCheckToken from '../hooks/useCheckToken';
import Layout from '../layouts/Layout';
import { useAuthStore } from '../store/auth';

export default function Dashboard() {
    const { isChecking } = useCheckToken();
    const token = useAuthStore((state) => state.token);

    if (isChecking) {
        return <Loading />;
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
                        component={Link}
                        color='cyan'
                        to='/add-credential'
                    >
                        <IconPlus />
                    </ActionIcon>
                </Group>
                <CredentialsTable />
            </Stack>
        </Layout>
    );
}
