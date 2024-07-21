import { TextInput, Group, Button, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { z } from 'zod';
import { zodResolver } from 'mantine-form-zod-resolver';
import { passwordSchema } from '../common/helpers';
import apiClient from '../common/api';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useAuthStore } from '../store/auth';

const schema = z.object({
    username: z.string().min(5).max(20),
    password: passwordSchema
});

type LoginSchema = z.infer<typeof schema>;

export default function LoginForm() {
    const form = useForm({
        initialValues: {
            username: '',
            password: ''
        },
        validate: zodResolver(schema)
    });

    const { setAuth } = useAuthStore();

    const mutation = useMutation({
        mutationFn: (values: LoginSchema) =>
            apiClient.post<{ token: string }>('/login', values),
        onSuccess: (res, { username }) => {
            localStorage.setItem('token', res.data.token);
            setAuth({ username: username, token: res.data.token });
            form.reset();
        },
        onError: (err) => {
            let msg = 'Failed to login. Please try again';
            if (isAxiosError(err)) {
                msg =
                    err.response?.data?.Error ||
                    'Failed to login. Please try again.';
            }
            form.setErrors({ apiError: msg });
        }
    });

    return (
        <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
            <TextInput
                withAsterisk
                label='Username'
                placeholder='username'
                key={form.key('username')}
                {...form.getInputProps('username')}
            />
            <TextInput
                withAsterisk
                label='Password'
                placeholder='Password'
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
                    Submit
                </Button>
            </Group>
        </form>
    );
}
