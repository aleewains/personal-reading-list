import React from 'react';
import { Loader2, Info } from 'lucide-react';

interface LoadingStateProps {
  onCancel?: () => void;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ onCancel }) => {
  return (
    <div className="loading-view" role="status" aria-live="polite" data-testid="loading-state">
      <div className="loading-header-banner">
        <Loader2 className="spinner" size={18} />
        <span>STATUS: IN-FLIGHT REQUEST (UNMEASURED)</span>
      </div>

      <h3>Retrieving Your Reading List...</h3>
      <p>
        Communicating with the persistence store. We have not received data yet, so the list count is
        currently <strong>unmeasured</strong>, not zero.
      </p>

      <div className="loading-badge-note">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <Info size={15} style={{ color: 'var(--ink-secondary)' }} />
          <span>System State Notice:</span>
        </div>
        <div style={{ marginTop: '0.25rem', fontSize: '0.82rem', color: 'var(--ink-muted)' }}>
          This state indicates network latency or pending I/O. It is visually and conceptually distinct from an
          empty list because entries may appear once the request completes.
        </div>
      </div>

      {onCancel && (
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
          >
            Cancel Request
          </button>
        </div>
      )}

      {/* Realistic Skeleton placeholders for book cards */}
      <div className="skeleton-grid" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <div key={n} className="skeleton-card">
            <div className="skeleton-line title" />
            <div className="skeleton-line author" />
            <div className="skeleton-line badge" />
            <div style={{ marginTop: '0.5rem' }}>
              <div className="skeleton-line desc" />
              <div className="skeleton-line desc-short" style={{ marginTop: '0.4rem' }} />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '0.8rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                paddingTop: '0.8rem',
              }}
            >
              <div className="skeleton-line" style={{ width: '40%', height: '20px' }} />
              <div className="skeleton-line" style={{ width: '20%', height: '20px' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

