import {
    ActionIcon,
    CopyButton,
    Flex,
    Group,
    Overlay,
    Table,
    Text,
    Tooltip
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
import { useNavigate } from 'react-router-dom';
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
                    <Tooltip
                        label={visible ? 'Hide password' : 'Show password'}
                        withArrow
                        position='bottom'
                    >
                        <ActionIcon
                            onClick={() => setVisible(!visible)}
                            variant='subtle'
                            color='gray'
                            size='sm'
                        >
                            {!visible ? <IconEye /> : <IconEyeOff />}
                        </ActionIcon>
                    </Tooltip>
                    <CopyButton value={cred.password} timeout={2000}>
                        {({ copied, copy }) => (
                            <Tooltip
                                label={copied ? 'Copied' : 'Copy'}
                                withArrow
                                position='bottom'
                            >
                                <ActionIcon
                                    color={copied ? 'cyan' : 'gray'}
                                    size='sm'
                                    variant='subtle'
                                    onClick={copy}
                                >
                                    {copied ? <IconCheck /> : <IconCopy />}
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </CopyButton>
                </Group>
            </Table.Td>
            <Table.Td>
                <Group gap='xs'>
                    <ActionIcon
                        variant='subtle'
                        color='cyan'
                        onClick={() => navigate(`/edit-credential/${cred.id}`)}
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
