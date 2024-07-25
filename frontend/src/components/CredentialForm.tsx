import { TextInput, Group, Button, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { z } from 'zod';
import { zodResolver } from 'mantine-form-zod-resolver';
import apiClient from '../common/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useAuthStore } from '../store/auth';

const schema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
    url: z.string().min(1)
});

type CredentialSchema = z.infer<typeof schema>;

type Props = {
    close: () => void;
};

export default function CredentialForm({ close }: Props) {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();

    const form = useForm({
        initialValues: {
            username: '',
            password: '',
            url: ''
        },
        validate: zodResolver(schema)
    });

    const mutation = useMutation({
        mutationFn: (values: CredentialSchema) =>
            apiClient.post<{ token: string }>('/add', values, {
                headers: { 'x-access-tokens': token }
            }),
        onSuccess: () => {
            form.reset();
            queryClient.invalidateQueries({ queryKey: ['credentials'] });
            close();
        },
        onError: (err) => {
            let msg = 'Failed to add credential. Please try again';
            if (isAxiosError(err)) {
                msg =
                    err.response?.data?.Error ||
                    'Failed to add credential. Please try again.';
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
                    Add Credential
                </Button>
            </Group>
        </form>
    );
}
