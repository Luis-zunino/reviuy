'use client';

import { Star } from 'lucide-react';
import React, { Dispatch, SetStateAction, useState } from 'react';

export const StarRating = (props: {
  rating: number;
  onRatingChange?: Dispatch<SetStateAction<number>>;
}) => {
  const [hover, setHover] = useState(0);
  const { rating, onRatingChange } = props;
  const stars = [
    { value: 1, key: 'one' },
    { value: 2, key: 'two' },
    { value: 3, key: 'three' },
    { value: 4, key: 'four' },
    { value: 5, key: 'five' },
  ];
  return (
    <div className="flex items-center mb-2">
      {stars.map(({ value, key }) => (
        <Star
          key={`star-${value}-${key}`}
          className={`h-4 w-4 text-sm cursor-pointer ${
            value <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          onClick={() => {
            if (onRatingChange) {
              onRatingChange(value);
            }
          }}
          color={value <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
          fill={value <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
          onMouseEnter={() => {
            if (onRatingChange) setHover(value);
          }}
          onMouseLeave={() => {
            if (onRatingChange) setHover(0);
          }}
        />
      ))}
      <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
    </div>
  );
};
