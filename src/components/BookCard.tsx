import React from 'react';
import { Book, ReadingStatus } from '../types/readingList';
import { Trash2, Star } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onRemove: (id: string) => void;
  onUpdateStatus: (id: string, status: ReadingStatus) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onRemove,
  onUpdateStatus,
}) => {
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  // Format relative or compact date
  const formatCompactDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <article className="book-card" data-testid={`book-card-${book.id}`}>
      {/* 1. Header Metadata: Genre & Date */}
      <div className="card-top-meta">
        <span className="card-genre">{book.genre || 'General'}</span>
        {book.createdAt && (
          <span className="card-date">Added {formatCompactDate(book.createdAt)}</span>
        )}
      </div>

      {/* 2. Full-Width Title (Zero cramped hyphenation) */}
      <h3 className="book-title">{book.title}</h3>

      {/* 3. Byline: Author & Stars on a single balanced line */}
      <div className="book-byline">
        <span className="book-author">by {book.author}</span>
        {book.rating && (
          <div className="book-stars" aria-label={`Rating: ${book.rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={13}
                fill={i < (book.rating || 0) ? 'var(--accent-ochre)' : 'transparent'}
                stroke={i < (book.rating || 0) ? 'var(--accent-ochre)' : 'var(--border-strong)'}
              />
            ))}
          </div>
        )}
      </div>

      {/* 4. Literary Margin Note / Paper Quote */}
      {book.notes && (
        <blockquote className="book-quote">
          &ldquo;{book.notes}&rdquo;
        </blockquote>
      )}

      {/* 5. Card Footer: Single Unified Status Pill + Delete */}
      <div className="card-footer">
        <div className="status-pill-container">
          <select
            className={`status-pill-select status-${book.status}`}
            value={book.status}
            onChange={(e) => onUpdateStatus(book.id, e.target.value as ReadingStatus)}
            aria-label={`Update reading status for ${book.title}`}
          >
            <option value="want-to-read">⏳ Want to Read</option>
            <option value="currently-reading">📖 Currently Reading</option>
            <option value="completed">✓ Completed</option>
          </select>
        </div>

        <div className="card-actions">
          <div className="delete-popover-anchor">
            <button
              type="button"
              className={`action-icon-btn delete ${confirmDelete ? 'active' : ''}`}
              onClick={() => setConfirmDelete(!confirmDelete)}
              title="Remove book from reading list"
              aria-label={`Remove ${book.title}`}
            >
              <Trash2 size={15} />
            </button>

            {confirmDelete && (
              <div className="delete-popover" role="dialog" aria-label="Confirm deletion">
                <span className="popover-prompt">Remove this book?</span>
                <div className="popover-actions">
                  <button
                    type="button"
                    className="popover-cancel-btn"
                    onClick={() => setConfirmDelete(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="popover-delete-btn"
                    onClick={() => {
                      setConfirmDelete(false);
                      onRemove(book.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
