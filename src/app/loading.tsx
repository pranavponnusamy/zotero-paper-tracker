export default function Loading() {
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

  return (
    <div style={pageStyles}>
      <div style={cardStyles}>
        <h1 className="mb-4">Zotero Paper Tracker</h1>
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <p className="mt-3 text-muted">Loading your papers...</p>
      </div>
    </div>
  );
} 