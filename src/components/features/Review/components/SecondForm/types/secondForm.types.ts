import type {
  Control,
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayReplace,
} from 'react-hook-form';
import type { ReviewFormData } from '@/types';

export interface SecondFormProps {
  control: Control<ReviewFormData>;
  fields: FieldArrayWithId<ReviewFormData, 'review_rooms', 'id'>[];
  append: UseFieldArrayAppend<ReviewFormData, 'review_rooms'>;
  remove: UseFieldArrayRemove;
  replace: UseFieldArrayReplace<ReviewFormData, 'review_rooms'>;
}
