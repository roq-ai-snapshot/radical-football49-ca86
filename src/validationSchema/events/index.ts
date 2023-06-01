import * as yup from 'yup';

export const eventValidationSchema = yup.object().shape({
  name: yup.string().required(),
  start_time: yup.date().required(),
  end_time: yup.date().required(),
  team_id: yup.string().nullable().required(),
});
