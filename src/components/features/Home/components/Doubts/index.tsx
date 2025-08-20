"use client";

import React from "react";
import { getDoubtsItems } from "./utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Doubts = () => {
  const { data } = getDoubtsItems();
  return (
    <div className="px-24 py-8 bg-white">
      <h3 className="text-2xl font-bold text-center">Preguntas frecuentes</h3>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="item-1"
      >
        {data.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
