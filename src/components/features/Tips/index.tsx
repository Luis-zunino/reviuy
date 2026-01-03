'use client';

import { PagesUrls } from '@/enums';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTipsComponent } from './hooks';
import { PageWithSidebar } from '@/components/common';
import { TipsSidebar } from './components/TipsSidebar';

export const TipsPageComponent = () => {
  const { categories, filteredArticles, selectedCategory, setSelectedCategory } =
    useTipsComponent();

  return (
    <PageWithSidebar
      title="Consejos y guías para alquilar"
      description="Aprende todo lo que necesitas saber para alquilar de forma segura"
      sidebar={
        <TipsSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      }
    >
      <div className="flex flex-col gap-2">
        {filteredArticles.map((article) => (
          <Link
            key={article.id}
            href={PagesUrls.TIPS_DETAILS?.replace(':id', article?.id.toString())}
            className="hover:shadow-lg transition-shadow"
          >
            <article className="bg-white rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 md:col-span-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      {article.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{article.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-blue-600">
                    {article.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4">{article.excerpt}</p>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {article.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {article.category}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </PageWithSidebar>
  );
};
