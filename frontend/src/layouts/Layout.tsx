import { ReactNode } from 'react';
import Navbar from '../components/Navbar';
import { Box, Container } from '@mantine/core';

type Props = {
    children: ReactNode;
};

export default function Layout({ children }: Props) {
    return (
        <Box bg='dark.8' h='100vh'>
            <Navbar />
            <Container pt={30}>{children}</Container>
        </Box>
    );
}
