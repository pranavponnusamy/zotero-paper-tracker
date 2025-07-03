"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function LoginPage() {
  const router = useRouter();
  const { data: user, error: userError } = useSWR('/api/auth/user', fetcher);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.isLoggedIn) {
      router.push('/');
    }
  }, [user, router]);

  const handleLogin = () => {
    setIsLoading(true);
    window.location.href = '/api/auth/login';
  };

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
  };

  const buttonStyles = {
    borderRadius: '6px',
    padding: '0.75rem 1.5rem',
    transition: 'all 0.2s ease',
    fontWeight: 500,
  };

  if (userError) {
    return (
      <div style={pageStyles}>
        <div style={cardStyles}>
          <div className="text-center">
            <h1 className="mb-4">Zotero Paper Tracker</h1>
            <div className="alert alert-danger">Failed to load user data</div>
            <button 
              className="btn btn-primary" 
              style={buttonStyles}
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (user && !user.isLoggedIn) {
    return (
      <div style={pageStyles}>
        <div style={cardStyles}>
          <div className="text-center">
            <h1 className="mb-4">Zotero Paper Tracker</h1>
            <p className="mb-4 text-secondary">Track the reading status of your Zotero papers</p>
            
            <div className="d-flex justify-content-center">
              <img 
                src="/zotero-logo.svg" 
                alt="Zotero Logo" 
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  marginBottom: '2rem' 
                }} 
              />
            </div>
            
            <p className="mb-4">
              Connect your Zotero account to track which papers you've read.
            </p>
            
            <button 
              className="btn btn-primary btn-lg w-100" 
              style={buttonStyles}
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Connecting...
                </>
              ) : (
                'Connect with Zotero'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyles}>
      <div style={cardStyles}>
        <div className="text-center">
          <h1 className="mb-4">Zotero Paper Tracker</h1>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
} 