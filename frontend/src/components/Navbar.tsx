import { Group, Button, Box } from '@mantine/core';
import { useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();

    return (
        <Box bg='red' px='lg' h='50px'>
            <Group justify='space-between' h='100%'>
                <div>Secure Password Manager</div>
                {location.pathname === '/dashboard' && (
                    <Group>
                        <Button>Logout</Button>
                    </Group>
                )}
            </Group>
        </Box>
    );
}
