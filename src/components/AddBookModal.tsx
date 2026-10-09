import React, { useState } from 'react';
import { Book, ReadingStatus } from '../types/readingList';
import { X, PlusCircle } from 'lucide-react';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (book: Omit<Book, 'id' | 'createdAt'>) => Promise<void>;
}

export const AddBookModal: React.FC<AddBookModalProps> = ({
  isOpen,
  onClose,
  onAddBook,
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState<ReadingStatus>('want-to-read');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      setError('Please provide both book title and author.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onAddBook({
        title: title.trim(),
        author: author.trim(),
        genre: genre.trim() || 'General',
        status,
        notes: notes.trim() || undefined,
        rating,
      });

      // Reset form
      setTitle('');
      setAuthor('');
      setGenre('');
      setStatus('want-to-read');
      setNotes('');
      setRating(5);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add book');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PlusCircle size={18} style={{ color: 'var(--ink-primary)' }} />
            Add to Reading List
          </h2>
          <button
            type="button"
            className="action-icon-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div
                style={{
                  backgroundColor: 'var(--danger-bg)',
                  border: '1px solid var(--danger-border)',
                  color: 'var(--danger-text)',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.85rem',
                }}
              >
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="book-title">Book Title *</label>
              <input
                id="book-title"
                type="text"
                className="form-input"
                placeholder="e.g. Structure and Interpretation of Computer Programs"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="book-author">Author *</label>
              <input
                id="book-author"
                type="text"
                className="form-input"
                placeholder="e.g. Harold Abelson, Gerald Jay Sussman"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="book-genre">Genre / Category</label>
                <input
                  id="book-genre"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Philosophy, Computer Science"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="book-status">Initial Status</label>
                <select
                  id="book-status"
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ReadingStatus)}
                >
                  <option value="want-to-read">Want to Read</option>
                  <option value="currently-reading">Currently Reading</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="book-rating">Rating (1 to 5 Stars)</label>
              <select
                id="book-rating"
                className="form-select"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 - Masterpiece)</option>
                <option value={4}>⭐⭐⭐⭐ (4 - Great)</option>
                <option value={3}>⭐⭐⭐ (3 - Good)</option>
                <option value={2}>⭐⭐ (2 - Mediocre)</option>
                <option value={1}>⭐ (1 - Disappointing)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="book-notes">Reading Notes / Key Takeaways</label>
              <textarea
                id="book-notes"
                className="form-textarea"
                rows={3}
                placeholder="Why do you want to read this? Key concepts or bookmark pages..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              data-testid="modal-submit-add-book"
            >
              {isSubmitting ? 'Saving...' : 'Add Book to Shelf'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
