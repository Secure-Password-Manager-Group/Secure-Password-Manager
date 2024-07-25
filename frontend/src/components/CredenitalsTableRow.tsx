import { Button, Flex, Group, Overlay, Table, Text } from '@mantine/core';
import { Credential } from '../common/types';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth';
import apiClient from '../common/api';

type Props = {
    cred: Credential;
};

export default function CredentialsTableRow({ cred }: Props) {
    const { token } = useAuthStore();
    const [visible, setVisible] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: number) =>
            apiClient.delete(`/delete/${id}`, {
                headers: { 'x-access-tokens': token }
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['credentials'] });
        }
    });

    return (
        <Table.Tr>
            <Table.Td>
                <Text>{cred.url}</Text>
            </Table.Td>
            <Table.Td>
                <Text>{cred.username}</Text>
            </Table.Td>
            <Table.Td>
                <Flex gap={10}>
                    <Flex pos='relative'>
                        <Text>{cred.password}</Text>
                        {!visible && (
                            <Overlay
                                radius='sm'
                                color='#000'
                                backgroundOpacity={0.1}
                                blur={5}
                            />
                        )}
                    </Flex>
                    <Button onClick={() => setVisible(!visible)}>
                        {!visible ? 'Show' : 'Hide'}
                    </Button>
                </Flex>
            </Table.Td>
            <Table.Td>
                <Group>
                    <Button>Edit</Button>
                    <Button
                        loading={mutation.isPending}
                        onClick={() => mutation.mutate(cred.id)}
                    >
                        Delete
                    </Button>
                </Group>
            </Table.Td>
        </Table.Tr>
    );
}
