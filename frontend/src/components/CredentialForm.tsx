import { Button, Group, Stack, TextInput, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { zodResolver } from 'mantine-form-zod-resolver';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import apiClient from '../common/api';
import { Credential } from '../common/types';
import { useAuthStore } from '../store/auth';

const schema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
    url: z.string().min(1)
});

type CredentialSchema = z.infer<typeof schema>;

type Props = {
    credential?: Credential;
};

export default function CredentialForm({ credential }: Props) {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            username: credential?.username || '',
            password: credential?.password || '',
            url: credential?.url || ''
        },
        validate: zodResolver(schema)
    });

    const mutation = useMutation({
        mutationFn: (values: CredentialSchema) => {
            if (credential) {
                return apiClient.patch<{ token: string }>(
                    `/update/${credential.id}`,
                    values,
                    {
                        headers: { 'x-access-tokens': token }
                    }
                );
            }
            return apiClient.post<{ token: string }>('/add', values, {
                headers: { 'x-access-tokens': token }
            });
        },
        onSuccess: () => {
            form.reset();
            queryClient.invalidateQueries({ queryKey: ['credentials'] });
            notifications.show({
                color: 'green',
                title: `${credential ? 'Edit' : 'Add'} Credential Success`,
                message: `Credential ${credential ? 'edited' : 'added'} successfully`
            });
            navigate('/dashboard');
        },
        onError: (err) => {
            if (isAxiosError(err) && err.response?.status === 401) {
                return;
            }
            let msg = `Failed to ${credential ? 'edit' : 'add'} credential. Please try again`;
            if (isAxiosError(err)) {
                msg =
                    err.response?.data?.Error ||
                    err.response?.data?.message ||
                    `Failed to ${credential ? 'edit' : 'add'} credential. Please try again`;
            }
            notifications.show({
                color: 'red',
                title: `${credential ? 'Edit' : 'Add'} Credential Failed`,
                message: msg
            });
        }
    });

    return (
        <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
            <Stack>
                <TextInput
                    withAsterisk
                    label='Username'
                    placeholder='myusername'
                    key={form.key('username')}
                    {...form.getInputProps('username')}
                />
                <TextInput
                    withAsterisk
                    label='URL'
                    placeholder='https://myapp.com'
                    key={form.key('url')}
                    {...form.getInputProps('url')}
                />
                <PasswordInput
                    withAsterisk
                    label='Password'
                    placeholder='mypassword'
                    key={form.key('password')}
                    {...form.getInputProps('password')}
                />
                <Group justify='flex-end' mt='md'>
                    <Button
                        component={Link}
                        color='red'
                        variant='outline'
                        to='/dashboard'
                    >
                        Cancel
                    </Button>
                    <Button
                        loading={mutation.isPending}
                        type='submit'
                        color='cyan'
                    >
                        {credential ? 'Edit' : 'Add'} Credential
                    </Button>
                </Group>
            </Stack>
        </form>
    );
}
