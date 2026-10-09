import React from 'react';
import { FetchError } from '../types/readingList';
import { AlertOctagon, RotateCcw, AlertTriangle, HelpCircle } from 'lucide-react';

interface ErrorStateProps {
  error: FetchError | null;
  onRetry: () => void;
  onSwitchToSafeMode?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  onSwitchToSafeMode,
}) => {
  const fallbackError: FetchError = {
    code: '500 INTERNAL_ERROR',
    title: 'Unexpected Retrieval Failure',
    whatFailed: 'The client could not read from the persistent reading list store.',
    suggestedAction: 'Please click "Try Again" to re-attempt the connection.',
    isRetryable: true,
    permanentExplanation: 'If local storage is disabled by browser policies, retrying will not resolve this error.',
    timestamp: new Date().toLocaleTimeString(),
  };

  const activeError = error || fallbackError;

  return (
    <div className="error-view" role="alert" aria-live="assertive" data-testid="error-state">
      <div className="error-badge-pill">
        <AlertOctagon size={15} />
        <span>HTTP {activeError.code}</span>
      </div>

      <div className="error-header">
        <div className="error-icon-box">
          <AlertOctagon size={28} />
        </div>
        <div className="error-title-area">
          <h3>{activeError.title}</h3>
          <p style={{ color: '#fca5a5', fontSize: '0.9rem' }}>
            Request attempted at {activeError.timestamp}. The reading list could not be loaded.
          </p>
        </div>
      </div>

      <div className="error-breakdown-card">
        {/* What failed */}
        <div className="breakdown-section">
          <div className="breakdown-label">
            <AlertTriangle size={14} /> 1. What Failed
          </div>
          <div className="breakdown-text" data-testid="error-what-failed">
            {activeError.whatFailed}
          </div>
        </div>

        {/* What user can do next */}
        <div className="breakdown-section">
          <div className="breakdown-label">
            <HelpCircle size={14} /> 2. What You Can Do Next
          </div>
          <div className="breakdown-text" data-testid="error-suggested-action">
            {activeError.suggestedAction}
          </div>
        </div>

        {/* When retrying will not help */}
        {activeError.permanentExplanation && (
          <div className="permanent-warning-box" data-testid="error-permanent-explanation">
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>When retrying will NOT help:</strong> {activeError.permanentExplanation}
            </div>
          </div>
        )}
      </div>

      <div className="error-actions">
        <button
          type="button"
          className="btn btn-danger"
          onClick={onRetry}
          data-testid="error-retry-button"
        >
          <RotateCcw size={16} /> Try Again
        </button>

        {onSwitchToSafeMode && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onSwitchToSafeMode}
          >
            Switch to Local Auto Mode
          </button>
        )}
      </div>
    </div>
  );
};
