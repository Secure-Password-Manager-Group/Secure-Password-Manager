import { ReactNode } from 'react';
import Navbar from '../components/Navbar';
import { Center, Container, Loader } from '@mantine/core';
import useCheckToken from '../hooks/useCheckToken';

type Props = {
    children: ReactNode;
};

export default function Layout({ children }: Props) {
    const { isLoading } = useCheckToken();

    if (isLoading) {
        return (
            <Center mt={30}>
                <Loader />
            </Center>
        );
    }

    return (
        <>
            <Navbar />
            <Container>{children}</Container>
        </>
    );
}
