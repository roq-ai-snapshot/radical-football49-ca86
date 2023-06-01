import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createCommunication } from 'apiSdk/communications';
import { Error } from 'components/error';
import { communicationValidationSchema } from 'validationSchema/communications';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { CommunicationInterface } from 'interfaces/communication';

function CommunicationCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CommunicationInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCommunication(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CommunicationInterface>({
    initialValues: {
      message: '',
      timestamp: new Date(new Date().toDateString()),
      sender_id: (router.query.sender_id as string) ?? null,
      receiver_id: (router.query.receiver_id as string) ?? null,
    },
    validationSchema: communicationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Communication
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="message" mb="4" isInvalid={!!formik.errors?.message}>
            <FormLabel>message</FormLabel>
            <Input type="text" name="message" value={formik.values?.message} onChange={formik.handleChange} />
            {formik.errors.message && <FormErrorMessage>{formik.errors?.message}</FormErrorMessage>}
          </FormControl>
          <FormControl id="timestamp" mb="4">
            <FormLabel>timestamp</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.timestamp}
              onChange={(value: Date) => formik.setFieldValue('timestamp', value)}
            />
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'sender_id'}
            label={'sender_id'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.id}
              </option>
            )}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'receiver_id'}
            label={'receiver_id'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.id}
              </option>
            )}
          />
          <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'communication',
  operation: AccessOperationEnum.CREATE,
})(CommunicationCreatePage);
