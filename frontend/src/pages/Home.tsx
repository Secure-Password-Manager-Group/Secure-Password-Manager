import { Container, Grid, Stack, Tabs, Text } from '@mantine/core';
import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import Navbar from '../components/Navbar';

export default function Home() {
    const [tab, setTab] = useState<string>('login');

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
                                <SignupForm />
                            </Tabs.Panel>
                        </Tabs>
                    </Grid.Col>
                </Grid>
            </Container>
        </>
    );
}
