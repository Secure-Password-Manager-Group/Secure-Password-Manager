import { Button, Flex, Group, Overlay, Table, Text } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../common/api';
import { Credential } from '../common/types';
import { useAuthStore } from '../store/auth';
import { notifications } from '@mantine/notifications';
import { isAxiosError } from 'axios';

type Props = {
    cred: Credential;
};

export default function CredentialsTableRow({ cred }: Props) {
    const { token } = useAuthStore();
    const [visible, setVisible] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (id: number) =>
            apiClient.delete(`/delete/${id}`, {
                headers: { 'x-access-tokens': token }
            }),
        onSuccess: () => {
            notifications.show({
                color: 'green',
                title: 'Credential Deleted',
                message: 'Credential has been successfully deleted'
            });
            queryClient.invalidateQueries({ queryKey: ['credentials'] });
        },
        onError: (err) => {
            if (isAxiosError(err) && err.response?.status !== 401) {
                notifications.show({
                    color: 'red',
                    title: 'Failed to delete credential',
                    message: 'Please try again'
                });
            }
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
                    <Button
                        onClick={() => navigate(`/edit-credential/${cred.id}`)}
                    >
                        Edit
                    </Button>
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
