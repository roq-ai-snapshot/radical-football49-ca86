import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getCommunications, deleteCommunicationById } from 'apiSdk/communications';
import { CommunicationInterface } from 'interfaces/communication';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function CommunicationListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<CommunicationInterface[]>(
    () => '/communications',
    () =>
      getCommunications({
        relations: ['user_communication_sender_idTouser', 'user_communication_receiver_idTouser'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteCommunicationById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Communication
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('communication', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/communications/create`}>
            <Button colorScheme="blue" mr="4">
              Create
            </Button>
          </Link>
        )}
        {error && <Error error={error} />}
        {deleteError && <Error error={deleteError} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>id</Th>
                  <Th>message</Th>
                  <Th>timestamp</Th>
                  {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>sender_id</Th>}
                  {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>receiver_id</Th>}

                  {hasAccess('communication', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && <Th>Edit</Th>}
                  {hasAccess('communication', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>View</Th>}
                  {hasAccess('communication', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && <Th>Delete</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.id}</Td>
                    <Td>{record.message}</Td>
                    <Td>{record.timestamp as unknown as string}</Td>
                    {hasAccess(
                      'user_communication_sender_idTouser',
                      AccessOperationEnum.READ,
                      AccessServiceEnum.PROJECT,
                    ) && (
                      <Td>
                        <Link href={`/users/view/${record.user_communication_sender_idTouser?.id}`}>
                          {record.user_communication_sender_idTouser?.id}
                        </Link>
                      </Td>
                    )}
                    {hasAccess(
                      'user_communication_receiver_idTouser',
                      AccessOperationEnum.READ,
                      AccessServiceEnum.PROJECT,
                    ) && (
                      <Td>
                        <Link href={`/users/view/${record.user_communication_receiver_idTouser?.id}`}>
                          {record.user_communication_receiver_idTouser?.id}
                        </Link>
                      </Td>
                    )}

                    {hasAccess('communication', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/communications/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </Link>
                      </Td>
                    )}
                    {hasAccess('communication', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link href={`/communications/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </Link>
                      </Td>
                    )}
                    {hasAccess('communication', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Button onClick={() => handleDelete(record.id)}>Delete</Button>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'communication',
  operation: AccessOperationEnum.READ,
})(CommunicationListPage);
