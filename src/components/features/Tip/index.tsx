import React from 'react';
import { useTip } from './hooks';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';

export const TipComponent = (props: { id: number }) => {
  const { tip } = useTip(props);
  return (
    <div className="max-w-5xl mx-auto my-20 rounded-2xl p-8 bg-white">
      <div className=" bg-white  ">
        <div className="opacity-100 flex space-y-10 p-4 md:p-10">
          <h1 className="text-4xl font-bold text-gray-900 ">{tip.title}</h1>
          <Button variant="outline">
            <Share /> Compartir
          </Button>
        </div>
        <h2 className=" h-plain ">{tip.content}</h2>
      </div>
    </div>
  );
};
