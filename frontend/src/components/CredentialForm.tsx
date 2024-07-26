import { Alert, Button, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import apiClient from '../common/api';
import { Credential } from '../common/types';
import { useAuthStore } from '../store/auth';
import { useNavigate } from 'react-router-dom';

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
            navigate('/dashboard');
        },
        onError: (err) => {
            let msg = `Failed to ${credential ? 'edit' : 'add'} credential. Please try again`;
            if (isAxiosError(err)) {
                msg =
                    err.response?.data?.Error ||
                    `Failed to ${credential ? 'edit' : 'add'} credential. Please try again`;
            }
            form.setErrors({ apiError: msg });
        }
    });

    return (
        <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
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
            <TextInput
                withAsterisk
                label='Password'
                placeholder='mypassword'
                type='password'
                key={form.key('password')}
                {...form.getInputProps('password')}
            />
            {form.errors.apiError && (
                <Alert title='Error' color='red'>
                    {form.errors.apiError}
                </Alert>
            )}
            <Group justify='flex-end' mt='md'>
                <Button loading={mutation.isPending} type='submit'>
                    {credential ? 'Edit' : 'Add'} Credential
                </Button>
            </Group>
        </form>
    );
}
