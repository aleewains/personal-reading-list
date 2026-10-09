import React from 'react';
import { Book, ReadingStatus } from '../types/readingList';
import { User, Trash2, Star, BookOpen, CheckCircle, Clock } from 'lucide-react';

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

  const getStatusBadge = (status: ReadingStatus) => {
    switch (status) {
      case 'currently-reading':
        return (
          <span className="status-badge currently-reading">
            <BookOpen size={12} /> Currently Reading
          </span>
        );
      case 'completed':
        return (
          <span className="status-badge completed">
            <CheckCircle size={12} /> Completed
          </span>
        );
      case 'want-to-read':
      default:
        return (
          <span className="status-badge want-to-read">
            <Clock size={12} /> Want to Read
          </span>
        );
    }
  };

  return (
    <article className="book-card" data-testid={`book-card-${book.id}`}>
      <div>
        <div className="card-top">
          <h4 className="book-title">{book.title}</h4>
          {getStatusBadge(book.status)}
        </div>

        <div className="book-author">
          <User size={14} /> {book.author}
        </div>

        {book.genre && <span className="book-genre-badge">{book.genre}</span>}

        {book.notes && (
          <div className="book-notes">
            &ldquo;{book.notes}&rdquo;
          </div>
        )}

        {book.rating && (
          <div style={{ display: 'flex', gap: '2px', marginBottom: '0.8rem', color: '#fbbf24' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < (book.rating || 0) ? '#fbbf24' : 'transparent'}
                stroke={i < (book.rating || 0) ? '#fbbf24' : '#64748b'}
              />
            ))}
          </div>
        )}
      </div>

      <div className="card-footer">
        <select
          className="form-select"
          style={{ width: 'auto', padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
          value={book.status}
          onChange={(e) => onUpdateStatus(book.id, e.target.value as ReadingStatus)}
          aria-label={`Update reading status for ${book.title}`}
        >
          <option value="want-to-read">Want to Read</option>
          <option value="currently-reading">Currently Reading</option>
          <option value="completed">Completed</option>
        </select>

        <div className="card-actions">
          {confirmDelete ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <button
                type="button"
                className="btn btn-danger"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                onClick={() => onRemove(book.id)}
                title="Confirm removal"
              >
                Confirm
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                onClick={() => setConfirmDelete(false)}
                title="Cancel removal"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="action-icon-btn delete"
              onClick={() => setConfirmDelete(true)}
              title="Remove book from reading list"
              aria-label={`Remove ${book.title}`}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
