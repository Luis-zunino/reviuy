"use client";

import React from "react";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative">
        <Nav />
        <div className="max-w-[90%] mx-auto py-6">{children}</div>
        <Footer />
      </div>
    </QueryClientProvider>
  );
};
