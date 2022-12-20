import * as yup from 'yup';
import { containerImageRegex } from '../../../ImportForm/utils/validation-utils';

const k8sResourceNameRegex =
  /^\s*?[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*\s*?$/;

export const integrationTestValidationSchema = yup.object({
  integrationTest: yup.object({
    name: yup
      .string()
      .required('Required')
      .matches(
        k8sResourceNameRegex,
        'Must start with a letter and end with a letter or number. Valid characters include lowercase letters from a to z, numbers from 0 to 9, and hyphens ( - ).',
      ),
    pipeline: yup.string().required('Required'),
    bundle: yup
      .string()
      .required('Required')
      .max(2000, 'Please enter a URL that is less than 2000 characters.')
      .matches(containerImageRegex, 'Invalid container image'),
  }),
});
