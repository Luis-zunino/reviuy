'use client';

import React from 'react';
import { useTip } from './hooks';
import { PageWithSidebar } from '@/components/common';
import type { ContentBlock, ContentSection } from '@/types';
import { PagesUrls } from '@/enums';

const renderContentBlock = (block: ContentBlock, index: number): React.ReactNode => {
  const key = `${block.type}-${index}`;

  switch (block.type) {
    case 'h1':
      return (
        <h1 key={key} className="text-4xl font-bold text-foreground mb-6 mt-8">
          {block.text}
        </h1>
      );
    case 'h2':
      return (
        <h2 key={key} className="text-3xl font-bold text-foreground mb-4 mt-6">
          {block.text}
        </h2>
      );
    case 'h3':
      return (
        <h3 key={key} className="text-2xl font-semibold text-foreground mb-3 mt-5">
          {block.text}
        </h3>
      );
    case 'p':
      return (
        <p key={key} className="text-base text-muted-foreground mb-4 leading-relaxed">
          {block.text}
        </p>
      );
    case 'ul':
      return (
        <ul key={key} className="list-disc list-inside mb-4 space-y-2 ml-4">
          {block.children?.map((child, childIndex) => renderContentBlock(child, childIndex))}
        </ul>
      );
    case 'ol':
      return (
        <ol key={key} className="list-decimal list-inside mb-4 space-y-2 ml-4">
          {block.children?.map((child, childIndex) => renderContentBlock(child, childIndex))}
        </ol>
      );
    case 'li':
      return (
        <li key={key} className="text-muted-foreground">
          {block.text}
          {block.children && block.children.length > 0 && (
            <div className="ml-4 mt-1">
              {block.children.map((child, childIndex) => renderContentBlock(child, childIndex))}
            </div>
          )}
        </li>
      );
    case 'strong':
      return (
        <strong key={key} className="font-bold text-foreground">
          {block.text}
        </strong>
      );
    case 'em':
      return (
        <em key={key} className="italic">
          {block.text}
        </em>
      );
    case 'blockquote':
      return (
        <blockquote
          key={key}
          className="border-l-4 border-blue-500 pl-4 py-2 mb-4 italic text-muted-foreground bg-blue-50"
        >
          {block.text}
        </blockquote>
      );
    case 'code':
      return (
        <code key={key} className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
          {block.text}
        </code>
      );
    default:
      return null;
  }
};

const renderContentSection = (section: ContentSection, sectionIndex: number) => {
  return (
    <div key={`section-${sectionIndex}`} className="mb-8">
      {section.map((block, blockIndex) => renderContentBlock(block, blockIndex))}
    </div>
  );
};

export const TipComponent = () => {
  const { tip } = useTip();

  return (
    <PageWithSidebar
      title={tip?.title ?? ''}
      description=""
      isError={!tip}
      breadcrumbItems={[
        { label: 'Consejos y guías', href: PagesUrls.TIPS },
        { label: tip?.title ?? '' },
      ]}
    >
      <div className="prose prose-lg max-w-none px-4 md:px-10">
        {Array.isArray(tip?.content) ? (
          tip.content.map((section, index) => renderContentSection(section, index))
        ) : (
          <div className="whitespace-pre-wrap">{tip?.content}</div>
        )}
      </div>
    </PageWithSidebar>
  );
};
