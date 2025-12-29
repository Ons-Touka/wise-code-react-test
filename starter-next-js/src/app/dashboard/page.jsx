'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ----------------------------------------------------------------------

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirection automatique vers les catégories
    router.push('/dashboard/categories');
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ color: '#666' }}>Redirection vers les catégories...</p>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
