import { TextInput, Group, Button } from '@mantine/core';
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

export default function SignupForm() {
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
        onSuccess: (data) => {
            console.log(data);
        }
    });

    const handleSubmit = async (values: SignupSchema) => {
        try {
            await mutation.mutateAsync(values);
        } catch (err) {
            if (isAxiosError(err)) {
                if (err.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(err.response.data);
                    console.log(err.response.status);
                    console.log(err.response.headers);
                } else if (err.request) {
                    // The request was made but no response was received
                    // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(err.request);
                } else {
                    // Something happened in setting up the request that triggered an err
                    console.log('err', err.message);
                }
            }
        }
    };

    return (
        <form
            onSubmit={form.onSubmit((values) => {
                handleSubmit(values);
            })}
        >
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
            <Group justify='flex-end' mt='md'>
                <Button type='submit'>Submit</Button>
            </Group>
        </form>
    );
}
