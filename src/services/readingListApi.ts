import { Book, FetchError, ReviewerMode } from '../types/readingList';

const STORAGE_KEY = 'personal_reading_list_books_v1';

export const DEFAULT_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    status: 'currently-reading',
    genre: 'Computer Science',
    notes: 'Chapter 5: Leaders and Followers replication topologies.',
    rating: 5,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'book-2',
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    status: 'completed',
    genre: 'Design & UX',
    notes: 'Affordances, signifiers, and conceptual models in human interface design.',
    rating: 5,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'book-3',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    status: 'want-to-read',
    genre: 'Software Engineering',
    notes: 'Recommended for code refactoring and naming principles.',
    rating: 4,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

// Helper to get raw stored books from localStorage
export function getStoredBooks(): Book[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      // First initialization: default books
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BOOKS));
      return DEFAULT_BOOKS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_BOOKS;
  }
}

// Helper to save books to localStorage
export function saveStoredBooks(books: Book[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

/**
 * Fetch books with explicit simulation parameters for reviewer testing.
 */
export async function fetchBooksApi(
  mode: ReviewerMode = 'auto',
  latencyMs: number = 600,
  signal?: AbortSignal
): Promise<Book[]> {
  // Check if abort signal is already triggered
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  // Artificial latency simulation
  if (latencyMs > 0) {
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(resolve, latencyMs);
      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new DOMException('Aborted', 'AbortError'));
        });
      }
    });
  }

  // 1. Loading state scenario: If reviewer explicitly requested infinite loading
  if (mode === 'loading') {
    return new Promise<Book[]>((_, reject) => {
      if (signal) {
        signal.addEventListener('abort', () => {
          reject(new DOMException('Aborted', 'AbortError'));
        });
      }
      // Never resolves unless aborted or unmounted
    });
  }

  // 2. Error state scenarios
  if (mode === 'error') {
    const err: FetchError = {
      code: '503 SERVICE_UNAVAILABLE',
      title: 'Database Gateway Unreachable',
      whatFailed:
        'The reading list persistence engine failed to establish a secure handshake with the primary storage cluster (connection timed out after 3 retries).',
      suggestedAction:
        'Click "Try Again" below to attempt reconnection. If the issue persists, the storage replica is undergoing scheduled maintenance and retrying immediately may not resolve the issue.',
      isRetryable: true,
      permanentExplanation:
        'Note: If the upstream persistence cluster is down for maintenance, rapid retries will continue failing until the maintenance window concludes at 15:30 UTC.',
      timestamp: new Date().toLocaleTimeString(),
    };
    throw err;
  }

  if (mode === 'timeout') {
    const err: FetchError = {
      code: '408 REQUEST_TIMEOUT',
      title: 'Network Request Timed Out',
      whatFailed:
        'The fetch request exceeded the 3000ms threshold before receiving an acknowledgment header from the server.',
      suggestedAction:
        'Verify your local internet connectivity or VPN settings, then click "Try Again". If you are on an offline network, retrying will not help until connectivity is restored.',
      isRetryable: true,
      permanentExplanation:
        'Notice: Retrying without active network connectivity will immediately result in an offline socket error.',
      timestamp: new Date().toLocaleTimeString(),
    };
    throw err;
  }

  // 3. Empty state scenario: Reviewer requested explicit empty state
  if (mode === 'empty') {
    return [];
  }

  // 4. Populated state scenario: Explicit sample books
  if (mode === 'populated') {
    return DEFAULT_BOOKS;
  }

  // 5. 'auto' mode: Real persisted store
  return getStoredBooks();
}

/**
 * Add a new book to the persistent store.
 */
export async function addBookApi(
  bookData: Omit<Book, 'id' | 'createdAt'>,
  latencyMs: number = 300
): Promise<Book> {
  if (latencyMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, latencyMs));
  }

  const newBook: Book = {
    ...bookData,
    id: `book-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    createdAt: new Date().toISOString(),
  };

  const currentBooks = getStoredBooks();
  const updated = [newBook, ...currentBooks];
  saveStoredBooks(updated);
  return newBook;
}

/**
 * Remove a book from the persistent store.
 */
export async function removeBookApi(id: string, latencyMs: number = 200): Promise<void> {
  if (latencyMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, latencyMs));
  }

  const currentBooks = getStoredBooks();
  const updated = currentBooks.filter((b) => b.id !== id);
  saveStoredBooks(updated);
}

/**
 * Update book status in persistent store.
 */
export async function updateBookStatusApi(
  id: string,
  status: Book['status'],
  latencyMs: number = 200
): Promise<Book> {
  if (latencyMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, latencyMs));
  }

  const currentBooks = getStoredBooks();
  const index = currentBooks.findIndex((b) => b.id === id);
  if (index === -1) {
    throw new Error('Book not found');
  }

  const updatedBook = { ...currentBooks[index], status };
  currentBooks[index] = updatedBook;
  saveStoredBooks(currentBooks);
  return updatedBook;
}

/**
 * Reset persistent store to default sample books.
 */
export function resetStorageToDefaults(): Book[] {
  saveStoredBooks(DEFAULT_BOOKS);
  return DEFAULT_BOOKS;
}

/**
 * Clear all books in persistent store (genuine empty state in auto mode).
 */
export function clearStorage(): Book[] {
  saveStoredBooks([]);
  return [];
}

