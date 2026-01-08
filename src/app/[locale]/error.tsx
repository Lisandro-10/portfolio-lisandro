'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Error');

  useEffect(() => {
    console.error('Locale error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark px-4">
      <div className="max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          {t('title')}
        </h2>
        <p className="text-gray-400 mb-8">
          {t('description')}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
        >
          {t('tryAgain')}
        </button>
      </div>
    </div>
  );
}
