'use client';

import Link from 'next/link';
import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export const metadata = { title: `404 Page Not Found! | ${CONFIG.appName}` };

export default function NotFoundPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f5f5f5',
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
      }}>
        {/* Icône 404 */}
        <div style={{
          fontSize: '120px',
          fontWeight: 'bold',
          color: '#e0e0e0',
          marginBottom: '20px',
          lineHeight: 1,
        }}>
          404
        </div>

        {/* Message */}
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '12px',
        }}>
          Page non trouvée
        </h1>

        <p style={{
          fontSize: '16px',
          color: '#666',
          marginBottom: '32px',
        }}>
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        {/* Bouton retour */}
        <Link
          href="/dashboard/categories"
          style={{
            display: 'inline-block',
            padding: '12px 32px',
            backgroundColor: '#1976d2',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 500,
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1565c0'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#1976d2'}
        >
          Retour aux catégories
        </Link>
      </div>
    </div>
  );
}
