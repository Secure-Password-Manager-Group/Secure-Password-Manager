import Layout from '../layouts/Layout';
import { useAuthStore } from '../store/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useMounted } from '@mantine/hooks';
import CredentialsTable from '../components/CredentialsTable';

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
            <CredentialsTable />
        </Layout>
    );
}
