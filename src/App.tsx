import { useState, useEffect, useCallback, useRef } from 'react';
import { Book, ReviewerMode, FetchError, ReadingStatus } from './types/readingList';
import {
  fetchBooksApi,
  addBookApi,
  removeBookApi,
  updateBookStatusApi,
  resetStorageToDefaults,
  clearStorage,
} from './services/readingListApi';
import { ReviewerDevBar } from './components/ReviewerDevBar';
import { Header } from './components/Header';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { EmptyState } from './components/EmptyState';
import { BookList } from './components/BookList';
import { AddBookModal } from './components/AddBookModal';

export function App() {
  // Parse initial reviewer mode from URL query parameters (?state=loading, ?state=error, etc.)
  const getInitialMode = (): ReviewerMode => {
    const params = new URLSearchParams(window.location.search);
    const stateParam = params.get('state')?.toLowerCase();
    if (stateParam === 'loading') return 'loading';
    if (stateParam === 'error') return 'error';
    if (stateParam === 'timeout') return 'timeout';
    if (stateParam === 'empty') return 'empty';
    if (stateParam === 'populated') return 'populated';
    return 'auto';
  };

  const [reviewerMode, setReviewerMode] = useState<ReviewerMode>(getInitialMode);
  const [latencyMs, setLatencyMs] = useState<number>(400);
  const [books, setBooks] = useState<Book[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'empty' | 'populated'>('loading');
  const [error, setError] = useState<FetchError | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Update browser URL query param to match reviewerMode
  const updateUrlParam = (mode: ReviewerMode) => {
    const url = new URL(window.location.href);
    if (mode === 'auto') {
      url.searchParams.delete('state');
    } else {
      url.searchParams.set('state', mode);
    }
    window.history.replaceState(null, '', url.toString());
  };

  // Primary data fetching routine
  const loadReadingList = useCallback(
    async (mode: ReviewerMode, latency: number) => {
      // Abort any existing in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setStatus('loading');
      setError(null);

      try {
        const fetched = await fetchBooksApi(mode, latency, controller.signal);

        // Success: check if empty or populated
        setBooks(fetched);
        if (fetched.length === 0) {
          setStatus('empty');
        } else {
          setStatus('populated');
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // Request was aborted cleanly, ignore
          return;
        }

        const fetchErr = err as FetchError;
        setError(fetchErr);
        setStatus('error');
      }
    },
    []
  );

  // Trigger fetch when reviewerMode or latencyMs changes
  useEffect(() => {
    loadReadingList(reviewerMode, latencyMs);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [reviewerMode, latencyMs, loadReadingList]);

  // Handle reviewer mode change from DevBar
  const handleSelectMode = (newMode: ReviewerMode) => {
    setReviewerMode(newMode);
    updateUrlParam(newMode);
  };

  // Handle adding a new book
  const handleAddBook = async (bookData: Omit<Book, 'id' | 'createdAt'>) => {
    const created = await addBookApi(bookData);
    showToast(`Added "${created.title}" to reading list.`);

    // If currently in forced empty or forced mode, switch back to auto so the user sees their change
    if (reviewerMode === 'empty') {
      setReviewerMode('auto');
      updateUrlParam('auto');
    } else {
      setBooks((prev) => [created, ...prev]);
      setStatus('populated');
    }
  };

  // Handle removing a book
  const handleRemoveBook = async (id: string) => {
    const bookToRemove = books.find((b) => b.id === id);
    await removeBookApi(id);
    const updated = books.filter((b) => b.id !== id);
    setBooks(updated);

    if (updated.length === 0) {
      setStatus('empty');
    }

    showToast(`Removed "${bookToRemove?.title || 'Book'}" from reading list.`);
  };

  // Handle status update
  const handleUpdateStatus = async (id: string, newStatus: ReadingStatus) => {
    await updateBookStatusApi(id, newStatus);
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    showToast('Updated reading status.');
  };

  // DevBar Reset & Clear actions
  const handleResetDefaults = () => {
    const defaults = resetStorageToDefaults();
    setBooks(defaults);
    setReviewerMode('auto');
    updateUrlParam('auto');
    setStatus('populated');
    showToast('Reset persistent store to default demo books.');
  };

  const handleClearStorage = () => {
    clearStorage();
    setBooks([]);
    setReviewerMode('auto');
    updateUrlParam('auto');
    setStatus('empty');
    showToast('Cleared all books from store (genuine empty state).');
  };

  return (
    <div className="app-container">
      {/* Reviewer Demonstration Control Bar */}
      <ReviewerDevBar
        currentMode={reviewerMode}
        onSelectMode={handleSelectMode}
        latencyMs={latencyMs}
        onChangeLatency={setLatencyMs}
        onResetDefaults={handleResetDefaults}
        onClearStorage={handleClearStorage}
        onRefresh={() => loadReadingList(reviewerMode, latencyMs)}
        activeStatus={status}
      />

      {/* Main Header with Stats */}
      <Header
        books={books}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        isLoading={status === 'loading'}
      />

      {/* Main Content Area: Renders the active distinct state */}
      <main id="main-content">
        {status === 'loading' && (
          <LoadingState
            onCancel={() => {
              if (abortControllerRef.current) {
                abortControllerRef.current.abort();
              }
              setStatus('empty');
            }}
          />
        )}

        {status === 'error' && (
          <ErrorState
            error={error}
            onRetry={() => loadReadingList(reviewerMode, latencyMs)}
            onSwitchToSafeMode={() => handleSelectMode('auto')}
          />
        )}

        {status === 'empty' && (
          <EmptyState
            onAddFirstBook={() => setIsAddModalOpen(true)}
            onLoadSampleBooks={handleResetDefaults}
          />
        )}

        {status === 'populated' && (
          <BookList
            books={books}
            onRemoveBook={handleRemoveBook}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </main>

      {/* Add Book Modal Dialog */}
      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddBook={handleAddBook}
      />

      {/* Toast Notice */}
      {toastMessage && (
        <aside className="toast-notice" role="status" aria-live="polite">
          <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
          <span style={{ fontSize: '0.88rem' }}>{toastMessage}</span>
        </aside>
      )}
    </div>
  );
}

export default App;
