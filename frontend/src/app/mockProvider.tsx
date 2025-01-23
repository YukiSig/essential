'use client';
import { useEffect, useState } from 'react';

export function MockProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mockingEnabled, enableMocking] = useState(false);

  useEffect(() => {
    (async () => {
      if (
        typeof window !== 'undefined' &&
        process.env.NODE_ENV == 'development'
      ) {
        const { setupWorker } = await import('msw/browser');
        const { handlers } = await import('../mocks/handlers');
        await setupWorker(...handlers).start({
          onUnhandledRequest: 'bypass',
        });
        return enableMocking(true);
      }
    })();
  }, []);

  if (!mockingEnabled) {
    return null;
  }

  return <>{children}</>;
}
