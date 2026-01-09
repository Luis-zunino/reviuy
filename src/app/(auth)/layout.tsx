import React from 'react';
import { House } from 'lucide-react';
import { BackButton } from '@/components/common';

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-96">
        <BackButton />
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full shadow-lg">
              <House className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ReviUy</h1>
          <p className="text-gray-600">Tu plataforma de reseñas inmobiliarias</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">{children}</div>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© 2025 ReviUy. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default layout;
