'use client';

import { ChevronDown } from 'lucide-react';
import { Box, PageWithSidebar } from '@/components/common';
import { FAQSidebar } from './components/FAQSidebar';
import { useFAQComponent } from './hooks';
import { cn } from '@/lib/utils';

export const FAQComponent = () => {
  const {
    categories,
    filteredFAQ,
    selectedCategory,
    setSelectedCategory,
    openId,
    setOpenId,
    getCategoryLabel,
  } = useFAQComponent();

  return (
    <PageWithSidebar
      title="Preguntas precuentes"
      description="Encuentra respuestas a las preguntas más comunes"
      sidebar={
        <FAQSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          getCategoryLabel={getCategoryLabel}
        />
      }
    >
      <div className="flex flex-col gap-2">
        {filteredFAQ.map((item) => (
          <Box key={item.id} className=" rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
              className="w-full px-6 py-4 flex items-center justify-between transition-colors hover:cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-left">{item.question}</h3>
              <ChevronDown
                className={cn('w-5 h-5 text-gray-500 transition-transform shrink-0 ml-4', {
                  'rotate-180': openId === item.id,
                })}
              />
            </button>
            {openId === item.id && (
              <div className="px-6 py-4 border-t border-gray-200">
                <p>{item.answer}</p>
              </div>
            )}
          </Box>
        ))}
      </div>
    </PageWithSidebar>
  );
};
