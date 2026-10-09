export type ReadingStatus = 'want-to-read' | 'currently-reading' | 'completed';

export interface Book {
  id: string;
  title: string;
  author: string;
  status: ReadingStatus;
  genre: string;
  notes?: string;
  rating?: number;
  createdAt: string;
}

export type ReviewerMode = 'auto' | 'loading' | 'error' | 'timeout' | 'empty' | 'populated';

export interface FetchError {
  code: string | number;
  title: string;
  whatFailed: string;
  suggestedAction: string;
  isRetryable: boolean;
  permanentExplanation?: string;
  timestamp: string;
}

export interface ReadingListState {
  status: 'loading' | 'error' | 'empty' | 'populated';
  books: Book[];
  error: FetchError | null;
  lastFetchedAt: string | null;
  reviewerMode: ReviewerMode;
  latencyMs: number;
}
