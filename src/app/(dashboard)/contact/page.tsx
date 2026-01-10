import React from 'react';
import { PageWithSidebar } from '@/components/common';
import { Contact } from '@/components/features';

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
