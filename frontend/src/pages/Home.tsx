import {
    Center,
    Container,
    Grid,
    Loader,
    Stack,
    Tabs,
    Text
} from '@mantine/core';
import { useEffect, useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import Navbar from '../components/Navbar';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../common/api';
import { useAuthStore } from '../store/auth';
import { useMounted } from '@mantine/hooks';

export default function Home() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [tab, setTab] = useState<string>('login');
    const { setAuth } = useAuthStore();
    const mounted = useMounted();

    const { mutate } = useMutation({
        mutationFn: (values: { token: string }) =>
            apiClient.get<{ username: string }>('/user', {
                headers: {
                    'x-access-tokens': values.token
                }
            }),
        onSuccess: (res, { token }) => {
            setAuth({ username: res.data.username, token });
            setIsLoading(false);
        },
        onError: () => {
            localStorage.removeItem('token');
            setIsLoading(false);
        }
    });

    useEffect(() => {
        if (mounted) {
            const token = localStorage.getItem('token');
            if (token) {
                mutate({ token });
            } else {
                setIsLoading(false);
            }
        }
    }, [mutate, mounted]);

    if (isLoading) {
        return (
            <Center mt={30}>
                <Loader />
            </Center>
        );
    }

    return (
        <>
            <Navbar />
            <Container>
                <Grid>
                    <Grid.Col span={6}>
                        <Stack>
                            <Text>Welcome!</Text>
                            <Text>
                                Use this app to store all your passwords! Rest
                                assured that all data is encrypted and secure!
                            </Text>
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Tabs
                            value={tab}
                            onChange={(value) => setTab(value || 'login')}
                        >
                            <Tabs.List grow justify='center'>
                                <Tabs.Tab value='login'>Login</Tabs.Tab>
                                <Tabs.Tab value='signup'>Signup</Tabs.Tab>
                            </Tabs.List>

                            <Tabs.Panel value='login'>
                                <LoginForm />
                            </Tabs.Panel>
                            <Tabs.Panel value='signup'>
                                <SignupForm setTab={setTab} />
                            </Tabs.Panel>
                        </Tabs>
                    </Grid.Col>
                </Grid>
            </Container>
        </>
    );
}
