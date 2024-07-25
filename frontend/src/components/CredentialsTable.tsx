import {
    Button,
    Center,
    Loader,
    Modal,
    Stack,
    Table,
    Text
} from '@mantine/core';
import CredentialsTableRow from './CredenitalsTableRow';
import CredentialForm from './CredentialForm';
import { useDisclosure } from '@mantine/hooks';
import useCredentialsQuery from '../hooks/useCredentialsQuery';

export default function CredentialsTable() {
    const [opened, { open, close }] = useDisclosure(false);

    const { isPending, isRefetching, isError, data } = useCredentialsQuery();

    const getBody = () => {
        if (isPending) {
            return (
                <Table.Tr>
                    <Table.Td colSpan={4}>
                        <Center>
                            <Loader />
                        </Center>
                    </Table.Td>
                </Table.Tr>
            );
        }

        if (isError) {
            return (
                <Table.Tr>
                    <Table.Td colSpan={4}>
                        <Center>
                            <Text>Failed to fetch credentials</Text>
                        </Center>
                    </Table.Td>
                </Table.Tr>
            );
        }

        if (data && data.data.length === 0) {
            return (
                <Table.Tr>
                    <Table.Td colSpan={4}>
                        <Center>
                            <Text>No credentials found</Text>
                        </Center>
                    </Table.Td>
                </Table.Tr>
            );
        }

        return (
            <>
                {data.data.map((cred) => (
                    <CredentialsTableRow cred={cred} key={cred.id} />
                ))}
                {isRefetching && (
                    <Table.Tr>
                        <Table.Td colSpan={4}>
                            <Center>
                                <Loader />
                            </Center>
                        </Table.Td>
                    </Table.Tr>
                )}
            </>
        );
    };

    return (
        <>
            <Modal opened={opened} onClose={close} title='Add Credential'>
                <CredentialForm close={close} />
            </Modal>
            <Stack pb={10}>
                <Text mx='auto' size='xl'>
                    Credentials
                </Text>
                <Button onClick={open}>Add Credential</Button>
            </Stack>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>
                            <Text>URL</Text>
                        </Table.Th>
                        <Table.Th>
                            <Text>Username</Text>
                        </Table.Th>
                        <Table.Th>
                            <Text>Password</Text>
                        </Table.Th>
                        <Table.Th>
                            <Text>Actions</Text>
                        </Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{getBody()}</Table.Tbody>
            </Table>
        </>
    );
}
