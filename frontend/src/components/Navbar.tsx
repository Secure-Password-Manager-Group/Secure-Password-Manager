import { Box, Button, Container, Group, ThemeIcon, Title } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
import { useAuthStore } from '../store/auth';

export default function Navbar() {
    const { token, username, clearAuth } = useAuthStore();

    const handleLogout = () => {
        clearAuth();
    };

    return (
        <Box bg='dark.4' px='lg' h='50px'>
            <Container h='100%'>
                <Group justify='space-between' h='100%'>
                    <Group gap={0}>
                        <ThemeIcon color='cyan' variant='subtle' size='xl'>
                            <IconLock style={{ width: '70%', height: '70%' }} />
                        </ThemeIcon>
                        <Title order={3}>Secure Password Manager</Title>
                    </Group>
                    {token && (
                        <Group>
                            <Title order={5}>{username}</Title>
                            <Button
                                variant='outline'
                                color='red'
                                size='xs'
                                onClick={() => handleLogout()}
                            >
                                Logout
                            </Button>
                        </Group>
                    )}
                </Group>
            </Container>
        </Box>
    );
}
