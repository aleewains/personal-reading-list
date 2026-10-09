import React from 'react';
import { Book } from '../types/readingList';
import { Library, Plus, BookOpen, CheckCircle, Clock } from 'lucide-react';

interface HeaderProps {
  books: Book[];
  onOpenAddModal: () => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  books,
  onOpenAddModal,
  isLoading,
}) => {
  const total = books.length;
  const currentlyReading = books.filter((b) => b.status === 'currently-reading').length;
  const completed = books.filter((b) => b.status === 'completed').length;
  const wantToRead = books.filter((b) => b.status === 'want-to-read').length;

  return (
    <header className="main-header">
      <div className="main-title-group">
        <h1>
          <Library size={32} style={{ color: '#3b82f6' }} />
          Personal Reading List
        </h1>
        <p>
          Backed by persistent store • Distinguishing loading, error, and empty states.
        </p>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={onOpenAddModal}
          data-testid="header-add-book-button"
        >
          <Plus size={18} /> Add Book
        </button>
      </div>

      <div className="stats-ribbon" style={{ width: '100%', marginTop: '1.25rem' }}>
        <div className="stat-card">
          <div className="stat-icon total">
            <Library size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Books</div>
            <div className="stat-value">{isLoading ? '—' : total}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon reading">
            <BookOpen size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Currently Reading</div>
            <div className="stat-value">{isLoading ? '—' : currentlyReading}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed">
            <CheckCircle size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{isLoading ? '—' : completed}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon want">
            <Clock size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Want to Read</div>
            <div className="stat-value">{isLoading ? '—' : wantToRead}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
