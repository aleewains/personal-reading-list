import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { FetchError } from '../types/readingList';
import { clearStorage, resetStorageToDefaults } from '../services/readingListApi';

describe('Reading List - Acceptance Criteria: Loading, Error, Empty & Populated States', () => {
  beforeEach(() => {
    localStorage.clear();
    resetStorageToDefaults();
    window.history.replaceState(null, '', '/');
  });

  describe('1. Loading State', () => {
    it('is visually and textually distinct, communicating unmeasured data pending retrieval', () => {
      render(<LoadingState />);

      // Distinct text identifying the in-flight, unmeasured nature
      expect(
        screen.getByText(/STATUS: IN-FLIGHT REQUEST \(UNMEASURED\)/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Retrieving Your Reading List/i)).toBeInTheDocument();
      expect(screen.getByText(/count is currently/i)).toBeInTheDocument();
      expect(screen.getAllByText(/unmeasured/i).length).toBeGreaterThanOrEqual(1);

      // Verified loading skeleton grid is present
      const loadingContainer = screen.getByTestId('loading-state');
      expect(loadingContainer.querySelectorAll('.skeleton-card').length).toBe(3);
    });

    it('can be reached via ?state=loading query parameter without code changes', async () => {
      window.history.replaceState(null, '', '/?state=loading');
      render(<App />);

      expect(await screen.findByTestId('loading-state')).toBeInTheDocument();
      expect(screen.getByText(/STATUS: IN-FLIGHT REQUEST \(UNMEASURED\)/i)).toBeInTheDocument();
    });
  });

  describe('2. Error State', () => {
    it('states what failed, what the user can do next, and where retrying will not help', () => {
      const mockError: FetchError = {
        code: '503 SERVICE_UNAVAILABLE',
        title: 'Database Gateway Unreachable',
        whatFailed: 'Database connection refused during replica election.',
        suggestedAction: 'Click "Try Again" below once replica elected.',
        isRetryable: true,
        permanentExplanation: 'If cluster is undergoing maintenance, immediate retries will fail.',
        timestamp: '12:00:00 PM',
      };

      const retryFn = vi.fn();
      render(<ErrorState error={mockError} onRetry={retryFn} />);

      // What failed
      expect(screen.getByTestId('error-what-failed')).toHaveTextContent(
        'Database connection refused during replica election.'
      );

      // What user can do next
      expect(screen.getByTestId('error-suggested-action')).toHaveTextContent(
        'Click "Try Again" below once replica elected.'
      );

      // Where retrying will not help
      expect(screen.getByTestId('error-permanent-explanation')).toHaveTextContent(
        'When retrying will NOT help: If cluster is undergoing maintenance, immediate retries will fail.'
      );

      // Actionable retry button
      const retryBtn = screen.getByTestId('error-retry-button');
      fireEvent.click(retryBtn);
      expect(retryFn).toHaveBeenCalledTimes(1);
    });

    it('can be reached via ?state=error query parameter without code changes', async () => {
      window.history.replaceState(null, '', '/?state=error');
      render(<App />);

      expect(await screen.findByTestId('error-state')).toBeInTheDocument();
      expect(screen.getByText(/Database Gateway Unreachable/i)).toBeInTheDocument();
      expect(screen.getByTestId('error-what-failed')).toBeInTheDocument();
      expect(screen.getByTestId('error-suggested-action')).toBeInTheDocument();
      expect(screen.getByTestId('error-permanent-explanation')).toBeInTheDocument();
    });
  });

  describe('3. Empty State', () => {
    it('explains what the reading list is for and offers the first action', () => {
      const addFirstBookFn = vi.fn();
      render(<EmptyState onAddFirstBook={addFirstBookFn} />);

      // Explanation of feature
      expect(screen.getByTestId('empty-explanation')).toBeInTheDocument();
      expect(screen.getByText(/Personal Reading List/i)).toBeInTheDocument();
      expect(screen.getByText(/keep track of books you plan to read/i)).toBeInTheDocument();

      // Verified 0 entries badge (distinguishing from unmeasured)
      expect(screen.getByText(/STORE STATUS: VERIFIED 0 ENTRIES/i)).toBeInTheDocument();

      // First action button
      const addBtn = screen.getByTestId('empty-add-first-book-button');
      expect(addBtn).toBeInTheDocument();
      fireEvent.click(addBtn);
      expect(addFirstBookFn).toHaveBeenCalledTimes(1);
    });

    it('can be reached via ?state=empty query parameter without code changes', async () => {
      window.history.replaceState(null, '', '/?state=empty');
      render(<App />);

      expect(await screen.findByTestId('empty-state')).toBeInTheDocument();
      expect(screen.getByTestId('empty-explanation')).toBeInTheDocument();
      expect(screen.getByTestId('empty-add-first-book-button')).toBeInTheDocument();
    });

    it('can be reached naturally by clearing stored entries', async () => {
      clearStorage();
      window.history.replaceState(null, '', '/');
      render(<App />);

      expect(await screen.findByTestId('empty-state')).toBeInTheDocument();
    });
  });

  describe('4. Populated State with Adding and Removing Entries', () => {
    it('renders persistent books and supports adding and removing entries', async () => {
      window.history.replaceState(null, '', '/?state=populated');
      render(<App />);

      // Should display books
      expect(
        await screen.findByText('Designing Data-Intensive Applications')
      ).toBeInTheDocument();
      expect(screen.getByText('The Design of Everyday Things')).toBeInTheDocument();

      // Open Add Modal
      const addBtn = screen.getByTestId('header-add-book-button');
      fireEvent.click(addBtn);

      // Check modal inputs
      const titleInput = screen.getByLabelText(/Book Title \*/i);
      const authorInput = screen.getByLabelText(/Author \*/i);
      fireEvent.change(titleInput, { target: { value: 'Refactoring' } });
      fireEvent.change(authorInput, { target: { value: 'Martin Fowler' } });

      const submitBtn = screen.getByTestId('modal-submit-add-book');
      fireEvent.click(submitBtn);

      // Verified book added to reading list
      await waitFor(() => {
        expect(screen.getByText('Refactoring')).toBeInTheDocument();
        expect(screen.getByText(/Martin Fowler/i)).toBeInTheDocument();
      });
    });
  });

  describe('5. Reviewer Switcher Controls', () => {
    it('allows reviewer to toggle between states dynamically', async () => {
      render(<App />);

      // Switch to Error state via UI DevBar button
      const errorPresetBtn = await screen.findByRole('button', {
        name: /3\. Force Error \(503\)/i,
      });
      fireEvent.click(errorPresetBtn);

      expect(await screen.findByTestId('error-state')).toBeInTheDocument();
      expect(window.location.search).toContain('state=error');

      // Switch to Empty state via UI DevBar button
      const emptyPresetBtn = screen.getByRole('button', {
        name: /5\. Force Empty State/i,
      });
      fireEvent.click(emptyPresetBtn);

      expect(await screen.findByTestId('empty-state')).toBeInTheDocument();
      expect(window.location.search).toContain('state=empty');
    });
  });
});
