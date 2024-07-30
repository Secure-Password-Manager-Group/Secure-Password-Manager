import { Box, Button, Container, Group, Text } from '@mantine/core';
import { useAuthStore } from '../store/auth';

export default function Navbar() {
    const { token, username, clearAuth } = useAuthStore();

    const handleLogout = () => {
        localStorage.removeItem('token');
        clearAuth();
    };

    return (
        <Box bg='dark.4' px='lg' h='50px'>
            <Container h='100%'>
                {' '}
                <Group justify='space-between' h='100%'>
                    <Text size='xl'>Secure Password Manager</Text>
                    {token && (
                        <Group>
                            <Text>{username}</Text>
                            <Button
                                variant='filled'
                                color='red'
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
