import type {
  Control,
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayReplace,
} from 'react-hook-form';
import { FormReviewSchema } from '../../../constants';

export interface SecondFormProps {
  control: Control<FormReviewSchema>;
  fields: FieldArrayWithId<FormReviewSchema, 'review_rooms', 'id'>[];
  append: UseFieldArrayAppend<FormReviewSchema, 'review_rooms'>;
  remove: UseFieldArrayRemove;
  replace: UseFieldArrayReplace<FormReviewSchema, 'review_rooms'>;
}
