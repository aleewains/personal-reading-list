import React, { useState, useMemo } from 'react';
import { Book, ReadingStatus } from '../types/readingList';
import { BookCard } from './BookCard';
import { Search, X } from 'lucide-react';

interface BookListProps {
  books: Book[];
  onRemoveBook: (id: string) => void;
  onUpdateStatus: (id: string, status: ReadingStatus) => void;
}

export const BookList: React.FC<BookListProps> = ({
  books,
  onRemoveBook,
  onUpdateStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ReadingStatus>('all');

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.genre && book.genre.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === 'all' ? true : book.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [books, searchQuery, statusFilter]);

  return (
    <section aria-label="Book collection">
      <div className="controls-bar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by title, author, or genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search reading list"
          />
          {searchQuery && (
            <button
              type="button"
              className="action-icon-btn"
              style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)' }}
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filter-tabs" role="tablist" aria-label="Filter books by status">
          <button
            type="button"
            className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
            role="tab"
            aria-selected={statusFilter === 'all'}
          >
            All ({books.length})
          </button>
          <button
            type="button"
            className={`filter-tab ${statusFilter === 'currently-reading' ? 'active' : ''}`}
            onClick={() => setStatusFilter('currently-reading')}
            role="tab"
            aria-selected={statusFilter === 'currently-reading'}
          >
            Reading ({books.filter((b) => b.status === 'currently-reading').length})
          </button>
          <button
            type="button"
            className={`filter-tab ${statusFilter === 'want-to-read' ? 'active' : ''}`}
            onClick={() => setStatusFilter('want-to-read')}
            role="tab"
            aria-selected={statusFilter === 'want-to-read'}
          >
            Want to Read ({books.filter((b) => b.status === 'want-to-read').length})
          </button>
          <button
            type="button"
            className={`filter-tab ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
            role="tab"
            aria-selected={statusFilter === 'completed'}
          >
            Completed ({books.filter((b) => b.status === 'completed').length})
          </button>
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '2.5rem',
            textAlign: 'center',
            color: 'var(--text-secondary)',
          }}
        >
          <p style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '0.5rem' }}>
            No books found matching &ldquo;{searchQuery || statusFilter}&rdquo;
          </p>
          <p style={{ fontSize: '0.85rem' }}>
            Try adjusting your search criteria or resetting the status filter.
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ marginTop: '1rem', fontSize: '0.85rem' }}
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="book-grid">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onRemove={onRemoveBook}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </div>
      )}
    </section>
  );
};
