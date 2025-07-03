import Link from 'next/link';

export default function NotFound() {
  const pageStyles = {
    background: '#f8f9fa',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  };

  const cardStyles = {
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    background: 'white',
    padding: '2.5rem',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center' as const,
  };

  const buttonStyles = {
    borderRadius: '6px',
    padding: '0.75rem 1.5rem',
    transition: 'all 0.2s ease',
    fontWeight: 500,
  };

  return (
    <div style={pageStyles}>
      <div style={cardStyles}>
        <h1 className="display-1 mb-4">404</h1>
        <h2 className="mb-4">Page Not Found</h2>
        <p className="text-muted mb-4">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="btn btn-primary" style={buttonStyles}>
          Return to Home
        </Link>
      </div>
    </div>
  );
} 