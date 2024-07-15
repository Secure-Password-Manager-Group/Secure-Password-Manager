import { Container, Table } from '@mantine/core';
import Navbar from '../components/Navbar';

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
    const rows = tempData.map((data) => (
        <Table.Tr key={data.id}>
            <Table.Td>{data.url}</Table.Td>
            <Table.Td>{data.password}</Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            <Navbar />
            <Container>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>URL</Table.Th>
                            <Table.Th>Password</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </Container>
        </>
    );
}
