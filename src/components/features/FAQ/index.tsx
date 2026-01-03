'use client';

import { ChevronDown } from 'lucide-react';
import { PageWithSidebar } from '@/components/common';
import { FAQSidebar } from './components/FAQSidebar';
import { useFAQComponent } from './hooks';

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
          <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900 text-left">{item.question}</h3>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ml-4 ${
                  openId === item.id ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openId === item.id && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <p className="text-gray-700">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </PageWithSidebar>
  );
};
