import { Group, Button, Box } from '@mantine/core';
import { useAuthStore } from '../store/auth';

export default function Navbar() {
    const { token, clearAuth } = useAuthStore();

    const handleLogout = () => {
        clearAuth();
        localStorage.removeItem('token');
    };

    return (
        <Box bg='red' px='lg' h='50px'>
            <Group justify='space-between' h='100%'>
                <div>Secure Password Manager</div>
                {token && (
                    <Group>
                        <Button onClick={() => handleLogout()}>Logout</Button>
                    </Group>
                )}
            </Group>
        </Box>
    );
}
