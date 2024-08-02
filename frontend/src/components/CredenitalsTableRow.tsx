import {
    ActionIcon,
    CopyButton,
    Flex,
    Group,
    Overlay,
    Table,
    Text
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
    IconCheck,
    IconCopy,
    IconEdit,
    IconEye,
    IconEyeOff,
    IconTrash
} from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../common/api';
import { Credential } from '../common/types';
import { useAuthStore } from '../store/auth';

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
            notifications.show({
                color: 'green',
                title: 'Delete Credential Success',
                message: 'Credential has been successfully deleted'
            });
            queryClient.invalidateQueries({ queryKey: ['credentials'] });
        },
        onError: (err) => {
            if (isAxiosError(err) && err.response?.status === 401) {
                return;
            }
            let msg = 'Failed to delete credential. Please try again';
            if (isAxiosError(err)) {
                msg =
                    err.response?.data?.Error ||
                    err.response?.data?.message ||
                    'Failed to delete credential. Please try again';
            }
            notifications.show({
                color: 'red',
                title: 'Delete Credential Failed',
                message: msg
            });
        }
    });

    return (
        <Table.Tr>
            <Table.Td>
                <Group gap='xs'>
                    <Text>{cred.url}</Text>
                    <CopyButton value={cred.url} timeout={500}>
                        {({ copied, copy }) => (
                            <ActionIcon
                                color={copied ? 'cyan' : 'gray'}
                                size='sm'
                                variant='subtle'
                                onClick={copy}
                            >
                                {copied ? <IconCheck /> : <IconCopy />}
                            </ActionIcon>
                        )}
                    </CopyButton>
                </Group>
            </Table.Td>
            <Table.Td>
                <Group gap='xs'>
                    <Text>{cred.username}</Text>
                    <CopyButton value={cred.username} timeout={500}>
                        {({ copied, copy }) => (
                            <ActionIcon
                                color={copied ? 'cyan' : 'gray'}
                                size='sm'
                                variant='subtle'
                                onClick={copy}
                            >
                                {copied ? <IconCheck /> : <IconCopy />}
                            </ActionIcon>
                        )}
                    </CopyButton>
                </Group>
            </Table.Td>
            <Table.Td>
                <Group gap='xs'>
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
                    <ActionIcon
                        onClick={() => setVisible(!visible)}
                        variant='subtle'
                        color='gray'
                        size='sm'
                    >
                        {!visible ? <IconEye /> : <IconEyeOff />}
                    </ActionIcon>
                    <CopyButton value={cred.password} timeout={500}>
                        {({ copied, copy }) => (
                            <ActionIcon
                                color={copied ? 'cyan' : 'gray'}
                                size='sm'
                                variant='subtle'
                                onClick={copy}
                            >
                                {copied ? <IconCheck /> : <IconCopy />}
                            </ActionIcon>
                        )}
                    </CopyButton>
                </Group>
            </Table.Td>
            <Table.Td>
                <Group gap='xs'>
                    <ActionIcon
                        component={Link}
                        variant='subtle'
                        color='cyan'
                        to={`/edit-credential/${cred.id}`}
                    >
                        <IconEdit />
                    </ActionIcon>
                    <ActionIcon
                        color='red'
                        variant='subtle'
                        loading={mutation.isPending}
                        onClick={() => mutation.mutate(cred.id)}
                    >
                        <IconTrash />
                    </ActionIcon>
                </Group>
            </Table.Td>
        </Table.Tr>
    );
}
