import { Grid, Stack, Tabs, Text, Title } from '@mantine/core';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Loading from '../components/Loading';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import useCheckToken from '../hooks/useCheckToken';
import Layout from '../layouts/Layout';
import { useAuthStore } from '../store/auth';

export default function Home() {
    const [tab, setTab] = useState<string>('login');
    const token = useAuthStore((state) => state.token);
    const { isChecking } = useCheckToken();

    if (isChecking) {
        return <Loading />;
    }

    if (token) {
        return <Navigate to='/dashboard' />;
    }

    return (
        <Layout>
            <Grid gutter='lg'>
                <Grid.Col span={6} mih={380}>
                    <Stack
                        align='stretch'
                        justify='space-evenly'
                        h='100%'
                        py='xl'
                    >
                        <Title order={1}>Welcome!</Title>
                        <Text size='lg'>
                            Use this app to store all your passwords! Rest
                            assured that all data is encrypted and secure!
                        </Text>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Tabs
                        color='cyan'
                        value={tab}
                        onChange={(value) => setTab(value || 'login')}
                    >
                        <Tabs.List grow justify='center'>
                            <Tabs.Tab value='login'>
                                <Text>Login</Text>
                            </Tabs.Tab>
                            <Tabs.Tab value='signup'>
                                <Text>Signup</Text>
                            </Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value='login' mt={20}>
                            <LoginForm />
                        </Tabs.Panel>
                        <Tabs.Panel value='signup' mt={20}>
                            <SignupForm setTab={setTab} />
                        </Tabs.Panel>
                    </Tabs>
                </Grid.Col>
            </Grid>
        </Layout>
    );
}
