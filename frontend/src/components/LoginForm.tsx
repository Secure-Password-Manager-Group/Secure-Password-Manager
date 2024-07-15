import { TextInput, Group, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { z } from 'zod';
import { zodResolver } from 'mantine-form-zod-resolver';
import { passwordSchema } from '../common/helpers';

const schema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: passwordSchema
});

export default function LoginForm() {
    const form = useForm({
        initialValues: {
            email: '',
            password: ''
        },
        validate: zodResolver(schema)
    });

    return (
        <form
            onSubmit={form.onSubmit((values) => {
                console.log(values);
            })}
        >
            <TextInput
                withAsterisk
                label='Email'
                placeholder='your@email.com'
                key={form.key('email')}
                {...form.getInputProps('email')}
            />
            <TextInput
                withAsterisk
                label='Password'
                placeholder='Password'
                type='password'
                key={form.key('password')}
                {...form.getInputProps('password')}
            />
            <Group justify='flex-end' mt='md'>
                <Button type='submit'>Submit</Button>
            </Group>
        </form>
    );
}
