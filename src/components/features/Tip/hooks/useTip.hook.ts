import { articles } from '@/services/mocks/articles.mock';
import type { UseTipProps } from './types';

export const useTip = (props: UseTipProps) => {
  const { id } = props;

  return {
    tip: articles[id - 1],
  };
};
