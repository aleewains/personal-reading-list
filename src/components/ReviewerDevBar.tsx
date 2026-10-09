import React from 'react';
import { ReviewerMode } from '../types/readingList';
import {
  Sliders,
  RotateCcw,
  Trash2,
  Clock,
  AlertTriangle,
  Inbox,
  BookOpen,
  CheckCircle,
  Copy,
  Check
} from 'lucide-react';

interface ReviewerDevBarProps {
  currentMode: ReviewerMode;
  onSelectMode: (mode: ReviewerMode) => void;
  latencyMs: number;
  onChangeLatency: (ms: number) => void;
  onResetDefaults: () => void;
  onClearStorage: () => void;
  onRefresh: () => void;
  activeStatus: 'loading' | 'error' | 'empty' | 'populated';
}

export const ReviewerDevBar: React.FC<ReviewerDevBarProps> = ({
  currentMode,
  onSelectMode,
  latencyMs,
  onChangeLatency,
  onResetDefaults,
  onClearStorage,
  onRefresh,
  activeStatus,
}) => {
  const [copied, setCopied] = React.useState(false);

  const getQueryParamForMode = (m: ReviewerMode) => {
    if (m === 'auto') return '';
    return `?state=${m}`;
  };

  const currentUrl = `${window.location.origin}${window.location.pathname}${getQueryParamForMode(currentMode)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="devbar-wrapper" aria-label="Reviewer state controls">
      <div className="devbar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="devbar-badge">
            <Sliders size={14} /> Reviewer State Switcher
          </span>
          <span style={{ fontSize: '0.85rem', color: '#93c5fd' }}>
            Current UI State:{' '}
            <strong
              style={{
                textTransform: 'uppercase',
                color:
                  activeStatus === 'loading'
                    ? '#60a5fa'
                    : activeStatus === 'error'
                    ? '#f43f5e'
                    : activeStatus === 'empty'
                    ? '#34d399'
                    : '#a78bfa',
              }}
            >
              {activeStatus}
            </strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem' }}
            onClick={onResetDefaults}
            title="Reset storage to default 3 books"
          >
            <RotateCcw size={13} /> Reset Demo Books
          </button>
          <button
            type="button"
            className="btn btn-outline-danger"
            style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem' }}
            onClick={onClearStorage}
            title="Wipe localStorage to test genuine zero-item state"
          >
            <Trash2 size={13} /> Clear Storage
          </button>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="devbar-grid">
        <button
          type="button"
          className={`devbar-btn ${currentMode === 'auto' ? 'active' : ''}`}
          onClick={() => onSelectMode('auto')}
          title="Normal live mode backed by persistent localStorage"
        >
          <CheckCircle size={15} /> 1. Live Store (Auto)
        </button>

        <button
          type="button"
          className={`devbar-btn ${currentMode === 'loading' ? 'active' : ''}`}
          onClick={() => onSelectMode('loading')}
          title="Simulate unmeasured in-flight request (?state=loading)"
        >
          <Clock size={15} /> 2. Force Loading State
        </button>

        <button
          type="button"
          className={`devbar-btn ${currentMode === 'error' ? 'active' : ''}`}
          onClick={() => onSelectMode('error')}
          title="Simulate 503 Service Unavailable (?state=error)"
        >
          <AlertTriangle size={15} /> 3. Force Error (503)
        </button>

        <button
          type="button"
          className={`devbar-btn ${currentMode === 'timeout' ? 'active' : ''}`}
          onClick={() => onSelectMode('timeout')}
          title="Simulate 408 Network Request Timeout (?state=timeout)"
        >
          <AlertTriangle size={15} /> 4. Force Timeout (408)
        </button>

        <button
          type="button"
          className={`devbar-btn ${currentMode === 'empty' ? 'active' : ''}`}
          onClick={() => onSelectMode('empty')}
          title="Simulate zero-result verified empty shelf (?state=empty)"
        >
          <Inbox size={15} /> 5. Force Empty State
        </button>

        <button
          type="button"
          className={`devbar-btn ${currentMode === 'populated' ? 'active' : ''}`}
          onClick={() => onSelectMode('populated')}
          title="Simulate populated shelf (?state=populated)"
        >
          <BookOpen size={15} /> 6. Force Populated
        </button>
      </div>

      {/* Latency and URL links */}
      <div className="devbar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Simulated Latency:</span>
          {[0, 400, 1000, 2500].map((ms) => (
            <button
              key={ms}
              type="button"
              className="devbar-btn"
              style={{
                padding: '0.2rem 0.5rem',
                fontSize: '0.75rem',
                backgroundColor: latencyMs === ms ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
                borderColor: latencyMs === ms ? '#3b82f6' : 'var(--border-color)',
                color: latencyMs === ms ? '#ffffff' : 'var(--text-secondary)',
              }}
              onClick={() => onChangeLatency(ms)}
            >
              {ms === 0 ? 'Instant (0ms)' : `${ms}ms`}
            </button>
          ))}
          <button
            type="button"
            className="devbar-btn"
            style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
            onClick={onRefresh}
            title="Trigger re-fetch"
          >
            <RotateCcw size={12} /> Refetch
          </button>
        </div>

        <div className="devbar-links" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>Reviewer URL Param:</span>
          <code>{getQueryParamForMode(currentMode) || '(default)'}</code>
          <button
            type="button"
            className="devbar-btn"
            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
            onClick={handleCopyLink}
            title="Copy URL for direct evaluation"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy URL'}
          </button>
        </div>
      </div>
    </aside>
  );
};
