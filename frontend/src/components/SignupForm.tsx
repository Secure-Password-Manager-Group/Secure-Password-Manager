import { TextInput, Group, Button, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { z } from 'zod';
import { zodResolver } from 'mantine-form-zod-resolver';
import { passwordSchema } from '../common/helpers';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../common/api';
import { isAxiosError } from 'axios';

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
        onSuccess: () => {
            form.reset();
            setTab('login');
        },
        onError: (err) => {
            let msg = 'Failed to signup. Please try again.';
            if (isAxiosError(err)) {
                msg =
                    err.response?.data?.Error ||
                    'Failed to signup. Please try again.';
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
            <TextInput
                withAsterisk
                label='Confirm Password'
                placeholder='Confirm Password'
                type='password'
                key={form.key('confirmPassword')}
                {...form.getInputProps('confirmPassword')}
            />
            {form.errors.apiError && (
                <Alert title='Error' color='red'>
                    {form.errors.apiError}
                </Alert>
            )}
            <Group justify='flex-end' mt='md'>
                <Button type='submit'>Submit</Button>
            </Group>
        </form>
    );
}
