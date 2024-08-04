import { Button, Container, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

export default function Error() {
    return (
        <Container>
            <Stack>
                <Title order={1}>Error!</Title>
                <Text size='xl'>Something went wrong</Text>
                <Button component={Link} to='/' color='cyan'>
                    Go Home
                </Button>
            </Stack>
        </Container>
    );
}
