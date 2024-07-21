import { Table } from '@mantine/core';
import Layout from '../layouts/Layout';
import { useAuthStore } from '../store/auth';
import { redirect, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useMounted } from '@mantine/hooks';

const tempData = [
    {
        id: 1,
        url: 'https://example.com',
        password: 'password1'
    },
    {
        id: 2,
        url: 'https://another.com',
        password: 'password2'
    },
    {
        id: 3,
        url: 'https://example.com',
        password: 'password3'
    },
    {
        id: 4,
        url: 'https://another.com',
        password: 'password4'
    }
];

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

    const rows = tempData.map((data) => (
        <Table.Tr key={data.id}>
            <Table.Td>{data.url}</Table.Td>
            <Table.Td>{data.password}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Layout>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>URL</Table.Th>
                        <Table.Th>Password</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Layout>
    );
}
