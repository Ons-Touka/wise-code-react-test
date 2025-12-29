'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirection directe vers les catégories
    router.push('/dashboard/categories');
  }, [router]);

  return null;
}
