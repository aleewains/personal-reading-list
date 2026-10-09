import React from 'react';
import { BookOpen, Plus, BookmarkCheck, Sparkles, BookMarked, Check } from 'lucide-react';

interface EmptyStateProps {
  onAddFirstBook: () => void;
  onLoadSampleBooks?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onAddFirstBook,
  onLoadSampleBooks,
}) => {
  return (
    <div className="empty-view" role="region" aria-label="Empty reading list" data-testid="empty-state">
      <div className="empty-badge-pill">
        <Check size={14} />
        <span>STORE STATUS: VERIFIED 0 ENTRIES (EMPTY LIST)</span>
      </div>

      <div className="empty-icon-circle">
        <BookOpen size={36} />
      </div>

      <h3>Your Reading List is Empty</h3>

      {/* Explains what the list is for */}
      <p className="empty-explanation" data-testid="empty-explanation">
        The <strong>Personal Reading List</strong> is your dedicated knowledge hub to organize your reading
        journey. Here you can keep track of books you plan to read, record key takeaways while reading, and
        archive finished books to look back on what you've learned.
      </p>

      {/* Feature breakdown / value props */}
      <div className="empty-feature-list">
        <div className="feature-pill">
          <BookmarkCheck size={20} className="feature-pill-icon" />
          <div>
            <div className="feature-pill-title">Track Statuses</div>
            <div className="feature-pill-desc">Group books into Want to Read, Currently Reading, or Completed.</div>
          </div>
        </div>

        <div className="feature-pill">
          <Sparkles size={20} className="feature-pill-icon" />
          <div>
            <div className="feature-pill-title">Capture Notes</div>
            <div className="feature-pill-desc">Record quotes, key chapters, and your personal ratings.</div>
          </div>
        </div>

        <div className="feature-pill">
          <BookMarked size={20} className="feature-pill-icon" />
          <div>
            <div className="feature-pill-title">Persistent Shelf</div>
            <div className="feature-pill-desc">All entries are safely saved and stay preserved between sessions.</div>
          </div>
        </div>
      </div>

      {/* Offers the first action */}
      <div className="empty-cta-group">
        <button
          type="button"
          className="btn btn-primary"
          style={{ padding: '0.8rem 1.6rem', fontSize: '1rem' }}
          onClick={onAddFirstBook}
          data-testid="empty-add-first-book-button"
        >
          <Plus size={18} /> Add Your First Book
        </button>

        {onLoadSampleBooks && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onLoadSampleBooks}
            data-testid="empty-load-samples-button"
          >
            Load Starter Recommendations
          </button>
        )}
      </div>
    </div>
  );
};
