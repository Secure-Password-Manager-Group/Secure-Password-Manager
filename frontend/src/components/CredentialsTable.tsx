import {
    Button,
    Center,
    Loader,
    Skeleton,
    Stack,
    Table,
    Text
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import apiClient from '../common/api';
import { Credential } from '../common/types';
import { useAuthStore } from '../store/auth';
import CredentialsTableRow from './CredenitalsTableRow';

export default function CredentialsTable() {
    const token = useAuthStore((state) => state.token);

    const { isPending, isFetching, isError, data } = useQuery({
        queryKey: ['credentials'],
        queryFn: () => {
            return apiClient.get<Credential[]>('/passwords', {
                headers: { 'x-access-tokens': token }
            });
        }
    });

    const getBody = () => {
        if (isPending || isFetching) {
            return (
                <Table.Tr>
                    <Table.Td colSpan={4}>
                        <Skeleton height={100} />
                    </Table.Td>
                </Table.Tr>
            );
        }

        if (isError) {
            return (
                <Table.Tr>
                    <Table.Td colSpan={4}>
                        <Center>
                            <Text size='xl'>
                                Failed to fetch credentials. Please try again
                                later.
                            </Text>
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
                            <Stack>
                                <Text size='xl'>No credentials found.</Text>
                                <Button
                                    component={Link}
                                    size='md'
                                    leftSection={<IconPlus />}
                                    color='cyan'
                                    to='/add-credential'
                                >
                                    Add Credential
                                </Button>
                            </Stack>
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
