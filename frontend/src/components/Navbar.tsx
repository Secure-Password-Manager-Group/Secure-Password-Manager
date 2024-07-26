import { Group, Button, Box, Text } from '@mantine/core';
import { useAuthStore } from '../store/auth';

export default function Navbar() {
    const { token, username, clearAuth } = useAuthStore();

    const handleLogout = () => {
        localStorage.removeItem('token');
        clearAuth();
    };

    return (
        <Box bg='red' px='lg' h='50px'>
            <Group justify='space-between' h='100%'>
                <div>Secure Password Manager</div>
                {token && (
                    <Group>
                        <Text>{username}</Text>
                        <Button onClick={() => handleLogout()}>Logout</Button>
                    </Group>
                )}
            </Group>
        </Box>
    );
}
