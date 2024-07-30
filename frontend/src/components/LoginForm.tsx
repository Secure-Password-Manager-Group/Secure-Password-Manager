import { Button, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import apiClient from '../common/api';
import { useAuthStore } from '../store/auth';

const schema = z.object({
    username: z.string().min(1, { message: 'Username is required' }),
    password: z.string().min(1, { message: 'Password is required' })
});

type LoginSchema = z.infer<typeof schema>;

export default function LoginForm() {
    const { setAuth } = useAuthStore();
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            username: '',
            password: ''
        },
        validate: zodResolver(schema)
    });

    const mutation = useMutation({
        mutationFn: (values: LoginSchema) =>
            apiClient.post<{ token: string }>('/login', values),
        onSuccess: (res, { username }) => {
            localStorage.setItem('token', res.data.token);
            setAuth({ username: username, token: res.data.token });
            form.reset();
            notifications.show({
                color: 'green',
                title: 'Login Success',
                message: `Welcome back, ${username}!`
            });
            navigate('/dashboard');
        },
        onError: (err) => {
            let msg = 'Failed to login. Please try again';
            if (isAxiosError(err)) {
                msg =
                    err.response?.data?.Error ||
                    'Failed to login. Please try again.';
            }
            notifications.show({
                color: 'red',
                title: 'Login Error',
                message: msg
            });
        }
    });

    return (
        <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
            <Stack gap='md'>
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
                <Button
                    color='cyan'
                    mt='md'
                    loading={mutation.isPending}
                    type='submit'
                    size='md'
                >
                    Login
                </Button>
            </Stack>
        </form>
    );
}
