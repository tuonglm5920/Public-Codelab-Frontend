import { Branding } from '../models/Branding';
import { TagProps } from '~/shared/reactjs';

export const StatusMappingToTagColor: Record<Branding['status'], TagProps['color']> = {
  ACTIVE: 'success',
  DEACTIVE: 'error',
};
