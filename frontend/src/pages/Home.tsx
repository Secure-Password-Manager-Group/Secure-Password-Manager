import { Grid, Loader, Stack, Tabs, Text } from '@mantine/core';
import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import Layout from '../layouts/Layout';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import useCheckToken from '../hooks/useCheckToken';

export default function Home() {
    const [tab, setTab] = useState<string>('login');
    const token = useAuthStore((state) => state.token);
    const { isChecking } = useCheckToken();

    if (isChecking) {
        return <Loader />;
    }

    if (token) {
        return <Navigate to='/dashboard' />;
    }

    return (
        <Layout>
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
        </Layout>
    );
}
