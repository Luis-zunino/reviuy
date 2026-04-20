import { PageWithSidebar } from '@/components/common';
import { Contact } from '@/components/features';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'Contacto | ReviUy',
  description: 'Ponte en contacto con el equipo de ReviUy para consultas y sugerencias.',
  path: '/contact',
});

const ContactPage = () => {
  return (
    <PageWithSidebar
      title="Contáctanos"
      description="Si tienes dudas o sugerencias, envíanos un mensaje."
    >
      <Contact />
    </PageWithSidebar>
  );
};

export default ContactPage;
