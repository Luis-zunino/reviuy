import { ThumbsDown, ThumbsUp } from "lucide-react";
import React from "react";

export const FeedBackBadge = (props: { recommended: boolean }) => {
  const { recommended } = props;
  return (
    <div className="lg:flex items-center lg:py-4 lg:px-6 w-full lg:justify-between grid grid-rows">
      {recommended ? (
        <div className="font-bold uppercase justify-center rounded-full text-xs flex px-3 items-center gap-2 lg:rounded-full h-10 bg-green-500 text-white">
          <ThumbsUp className="h-5 w-5" />
          <p className="tracking-wider font-bold">Lo recomiendo</p>
        </div>
      ) : (
        <div className="font-bold uppercase justify-center rounded-full text-xs flex px-3 items-center gap-2 lg:rounded-full h-10 bg-red-500 text-white">
          <ThumbsDown className="h-5 w-5" />
          <p className="tracking-wider font-bold">No recomiendo</p>
        </div>
      )}
    </div>
  );
};
