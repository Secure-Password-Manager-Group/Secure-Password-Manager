import { Button, Container, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

export default function Error() {
    return (
        <Container>
            <Text>Error!</Text>
            <Text>Something went wrong</Text>
            <Button component={Link} to='/'>
                Go Home
            </Button>
        </Container>
    );
}
