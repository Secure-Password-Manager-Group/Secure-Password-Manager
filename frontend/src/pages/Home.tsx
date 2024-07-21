import { Grid, Stack, Tabs, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import Layout from '../layouts/Layout';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useMounted } from '@mantine/hooks';

export default function Home() {
    const [tab, setTab] = useState<string>('login');
    const navigate = useNavigate();
    const mounted = useMounted();
    const { token } = useAuthStore();

    useEffect(() => {
        if (mounted) {
            if (token) {
                navigate('/dashboard');
            }
        }
    }, [mounted, navigate, token]);

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
