import { ReactNode } from 'react';
import Navbar from '../components/Navbar';
import { Container } from '@mantine/core';

type Props = {
    children: ReactNode;
};

export default function Layout({ children }: Props) {
    return (
        <>
            <Navbar />
            <Container>{children}</Container>
        </>
    );
}
