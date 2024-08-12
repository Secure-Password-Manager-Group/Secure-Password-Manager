import { Button, Stack, TextInput, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import apiClient from '../common/api';
import { passwordSchema } from '../common/helpers';

const schema = z
    .object({
        username: z.string().min(5).max(20),
        password: passwordSchema,
        confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword']
    });

type SignupSchema = z.infer<typeof schema>;

type Props = {
    setTab: (tab: string) => void;
};

export default function SignupForm({ setTab }: Props) {
    const form = useForm({
        initialValues: {
            username: '',
            password: '',
            confirmPassword: ''
        },
        validate: zodResolver(schema)
    });

    const mutation = useMutation({
        mutationFn: (values: SignupSchema) =>
            apiClient.post<{ token: string }>('/signUp', {
                username: values.username,
                password: values.password
            }),
        onSuccess: (_, { username }) => {
            form.reset();
            notifications.show({
                color: 'green',
                title: 'Signup Success',
                message: `Thank you for signing up, ${username}! Please login.`
            });
            setTab('login');
        },
        onError: (err) => {
            if (isAxiosError(err) && err.response?.status === 401) {
                return;
            }
            let msg = 'Failed to signup. Please try again.';
            if (isAxiosError(err)) {
                msg =
                    err.response?.data?.Error ||
                    err.response?.data?.message ||
                    'Failed to signup. Please try again.';
            }
            notifications.show({
                color: 'red',
                title: 'Signup Failed',
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
                <PasswordInput
                    withAsterisk
                    label='Password'
                    placeholder='Password'
                    key={form.key('password')}
                    {...form.getInputProps('password')}
                />
                <PasswordInput
                    withAsterisk
                    label='Confirm Password'
                    placeholder='Confirm Password'
                    key={form.key('confirmPassword')}
                    {...form.getInputProps('confirmPassword')}
                />
                <Button mt='md' size='md' color='cyan' type='submit'>
                    Signup
                </Button>
            </Stack>
        </form>
    );
}
