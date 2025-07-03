"use client";

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Home() {
  const { data: user, error: userError, mutate } = useSWR('/api/auth/user', fetcher);

  const [library, setLibrary] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lastSelectedCollection') || '';
    }
    return '';
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hideRead, setHideRead] = useState(false);

  // Custom CSS for thicker checkboxes
  const checkboxStyle = {
    transform: 'scale(2.0)',
    marginLeft: '15px',
    cursor: 'pointer',
    borderWidth: '2px',
    borderRadius: '1px'
  };
  
  const switchStyle = {
    transform: 'scale(1.8)',
    cursor: 'pointer',
  };

  // Custom styles for the app
  const pageStyles = {
    background: '#f8f9fa',
    minHeight: '100vh',
    padding: '2rem 0',
  };

  const cardStyles = {
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    background: 'white',
    padding: '2rem',
  };

  const headerStyles = {
    borderBottom: '1px solid #eaeaea',
    paddingBottom: '1rem',
    marginBottom: '1.5rem',
  };

  const buttonStyles = {
    borderRadius: '6px',
    padding: '0.5rem 1.25rem',
    transition: 'all 0.2s ease',
    fontWeight: 500,
  };

  const paperItemStyles = {
    borderLeft: '4px solid transparent',
    transition: 'all 0.2s ease',
    marginBottom: '0.5rem',
    borderRadius: '4px',
  };

  useEffect(() => {
    if (user?.isLoggedIn) {
      fetchCollections();
    }
  }, [user]);

  useEffect(() => {
    if (user?.isLoggedIn) {
      fetchLibrary();
    }
  }, [user, selectedCollection]);

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/zotero/collections');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setCollections(data);
    } catch (e: any) {
      setError('Failed to fetch collections: ' + e.message);
    }
  };

  const fetchLibrary = async () => {
    setLoading(true);
    setError('');
    try {
      const url = selectedCollection
        ? `/api/zotero/items?collection=${selectedCollection}`
        : '/api/zotero/items';
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setLibrary(data);
    } catch (e: any) {
      setError('Failed to fetch library: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleReadStatus = async (item: any) => {
    try {
      const response = await fetch(`/api/zotero/items/${item.key}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tags: item.data.tags, version: item.version })
        });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update item');
      }

      const updatedItem = await response.json();
      setLibrary(library.map(libItem => libItem.key === item.key ? updatedItem : libItem));

    } catch (e: any) {
      setError(e.message);
    }
  };

  const filteredLibrary = hideRead
    ? library.filter(item => !item.data.tags.some((tag: any) => tag.tag === '_read'))
    : library;

  if (userError) return (
    <div style={pageStyles}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <div style={cardStyles}>
          <div className="text-center">
            <h1 className="mb-4">Zotero Paper Tracker</h1>
            <div className="alert alert-danger">Failed to load user data</div>
            <a href="/" className="btn btn-primary" style={buttonStyles}>Retry</a>
          </div>
        </div>
      </div>
    </div>
  );
  
  if (!user) return (
    <div style={pageStyles}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <div style={cardStyles}>
          <div className="text-center">
            <h1 className="mb-4">Zotero Paper Tracker</h1>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading user data...</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={pageStyles}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={cardStyles}>
          <div style={headerStyles}>
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="mb-0">Zotero Paper Tracker</h1>
              <div>
                {!user.isLoggedIn ? (
                  <Link href="/login" className="btn btn-primary" style={buttonStyles}>
                    Log in with Zotero
                  </Link>
                ) : (
                  <a href="/api/auth/logout" className="btn btn-outline-secondary" style={buttonStyles}>
                    Log out
                  </a>
                )}
              </div>
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {user.isLoggedIn && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className='d-flex align-items-center'>
                  <h4 className='me-3 mb-0'>Your Library</h4>
                  <select 
                    className="form-select" 
                    value={selectedCollection} 
                    onChange={(e) => {
                      setSelectedCollection(e.target.value);
                      localStorage.setItem('lastSelectedCollection', e.target.value);
                    }}
                    style={{width: '200px'}}
                  >
                    <option value="">All Papers</option>
                    {collections.map(collection => (
                      <option key={collection.key} value={collection.key}>
                        {collection.data.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={hideRead}
                    onChange={(e) => setHideRead(e.target.checked)}
                    id="hideReadCheck"
                    style={switchStyle}
                  />
                  <label className="form-check-label ms-2" htmlFor="hideReadCheck">
                    Hide Read Papers
                  </label>
                </div>
              </div>
              {loading ? (
                <div className="d-flex justify-content-center my-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : library.length > 0 ? (
                <div className="paper-list">
                  {filteredLibrary.map((item) => {
                    const isRead = item.data.tags.some((tag: any) => tag.tag === '_read');
                    const zoteroLink = selectedCollection
                      ? `https://www.zotero.org/${user.username}/collections/${selectedCollection}/items/${item.key}/collection`
                      : `https://www.zotero.org/${user.username}/items/${item.key}/collection`;
                    return (
                      <div 
                        key={item.key} 
                        className={`p-3 mb-3 paper-item ${isRead ? 'bg-light' : 'bg-white'}`} 
                        style={{
                          ...paperItemStyles,
                          borderLeft: isRead ? '4px solid #adb5bd' : '4px solid #0d6efd'
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div style={{ flexGrow: 1 }}>
                            <a href={zoteroLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                              <h5 className={isRead ? 'text-decoration-line-through text-muted' : 'text-dark'} style={{ marginBottom: '0.5rem' }}>
                                {item.data.title || 'No Title'}
                              </h5>
                            </a>
                            <p className={`mb-1 ${isRead ? 'text-decoration-line-through text-muted' : 'text-secondary'}`} style={{ fontSize: '0.95rem' }}>
                              {item.data.creators?.map((creator: any) => `${creator.firstName || ''} ${creator.lastName || ''}`.trim()).join(', ')}
                            </p>
                            <small className="text-muted">Added: {new Date(item.data.dateAdded).toLocaleDateString()}</small>
                          </div>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            style={checkboxStyle}
                            checked={isRead}
                            onChange={() => toggleReadStatus(item)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center my-5">
                  <p className="text-muted">This collection is empty.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
          