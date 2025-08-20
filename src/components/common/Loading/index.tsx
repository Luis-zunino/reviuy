import { Loader2 } from "lucide-react";
import React from "react";

export const Loading = (props: { message?: string }) => {
  const { message = "Cargando..." } = props;
  return (
    <div className="h-full w-full flex flex-col items-center justify-center align-middle">
      <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
};
