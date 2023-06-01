import * as yup from 'yup';

export const communicationValidationSchema = yup.object().shape({
  message: yup.string().required(),
  timestamp: yup.date().required(),
  sender_id: yup.string().nullable().required(),
  receiver_id: yup.string().nullable().required(),
});
