import { Center, Loader, Table, Text } from '@mantine/core';
import useCredentialsQuery from '../hooks/useCredentialsQuery';
import CredentialsTableRow from './CredenitalsTableRow';

export default function CredentialsTable() {
    const { isPending, isRefetching, isError, data } = useCredentialsQuery();

    const getBody = () => {
        if (isPending) {
            return (
                <Table.Tr>
                    <Table.Td colSpan={4}>
                        <Center>
                            <Loader />
                        </Center>
                    </Table.Td>
                </Table.Tr>
            );
        }

        if (isError) {
            return (
                <Table.Tr>
                    <Table.Td colSpan={4}>
                        <Center>
                            <Text>Failed to fetch credentials</Text>
                        </Center>
                    </Table.Td>
                </Table.Tr>
            );
        }

        if (data && data.data.length === 0) {
            return (
                <Table.Tr>
                    <Table.Td colSpan={4}>
                        <Center>
                            <Text>No credentials found</Text>
                        </Center>
                    </Table.Td>
                </Table.Tr>
            );
        }

        return (
            <>
                {data.data.map((cred) => (
                    <CredentialsTableRow cred={cred} key={cred.id} />
                ))}
                {isRefetching && (
                    <Table.Tr>
                        <Table.Td colSpan={4}>
                            <Center>
                                <Loader />
                            </Center>
                        </Table.Td>
                    </Table.Tr>
                )}
            </>
        );
    };

    return (
        <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>
                        <Text>URL</Text>
                    </Table.Th>
                    <Table.Th>
                        <Text>Username</Text>
                    </Table.Th>
                    <Table.Th>
                        <Text>Password</Text>
                    </Table.Th>
                    <Table.Th>
                        <Text>Actions</Text>
                    </Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{getBody()}</Table.Tbody>
        </Table>
    );
}
