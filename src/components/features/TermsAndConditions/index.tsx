import { PageWithSidebar } from '@/components/common';
import { LEGAL_TERMS_SECTIONS_DATA } from '@/constants/legal-terms.constant';

const renderSectionContent = (section: (typeof LEGAL_TERMS_SECTIONS_DATA)[number]) => {
  // Section with list items (e.g., Conducta Prohibida)
  if (section.listItems && section.listItems.length > 0) {
    return (
      <ul className="text-gray-700 leading-relaxed space-y-2 list-disc ml-6">
        {section.listItems.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }

  // Sections with paragraphs
  return section.paragraphs.map((paragraph, i) => {
    const isFirst = i === 0;
    return (
      <p key={i} className={`text-gray-700 leading-relaxed${!isFirst ? ' mt-2' : ''}`}>
        {section.strongText && isFirst ? (
          <>
            {paragraph.slice(0, paragraph.indexOf(section.strongText))}
            <strong>{section.strongText}</strong>
            {paragraph.slice(paragraph.indexOf(section.strongText) + section.strongText.length)}
          </>
        ) : (
          paragraph
        )}
      </p>
    );
  });
};

export const TermsAndConditionsComponent = () => {
  return (
    <PageWithSidebar
      title="Términos y condiciones"
      description="Última actualización: 21 de mayo de 2026"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          {LEGAL_TERMS_SECTIONS_DATA.map((section) => (
            <section key={section.number}>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                {section.number} {section.title}
              </h2>
              {renderSectionContent(section)}
            </section>
          ))}
        </div>
      </div>
    </PageWithSidebar>
  );
};
