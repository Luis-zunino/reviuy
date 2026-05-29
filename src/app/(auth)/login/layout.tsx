import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'Iniciar sesión | ReviUy',
  description: 'Accede a tu cuenta para gestionar reseñas y tu perfil en ReviUy.',
  path: '/login',
  noIndex: true,
});

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-screen bg-fog dark:bg-reviuy-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-96">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src="/favicon.png" alt="ReviUy" className="size-16" />
          </div>
          <h1 className="text-3xl font-semibold text-ink dark:text-reviuy-gray-100 mb-2">ReviUy</h1>
          <p className="text-muted-gray dark:text-reviuy-gray-400">
            Tu plataforma de reseñas inmobiliarias
          </p>
        </div>

        <div className="rounded-2xl border border-reviuy-gray-200/70 dark:border-reviuy-gray-700 bg-canvas-white dark:bg-reviuy-gray-800 p-8">
          {children}
        </div>

        <div className="text-center mt-6 text-sm text-muted-gray dark:text-reviuy-gray-400">
          <p>© 2025 ReviUy. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default layout;
