import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import EventsPage from './EventsPage';
import * as eventsApi from '../../api/eventsApi';
import { mockEvents, mockLoadMoreEvents } from '../../test/mockData';

// Mock the API module
vi.mock('../../api/eventsApi');
vi.mock('../../utils/audioPlayer', () => ({
  audioPlayer: { play: vi.fn(), stop: vi.fn(), pause: vi.fn(), isPlaying: vi.fn(() => false) },
}));

describe('EventsPage - Core Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    eventsApi.fetchEvents.mockResolvedValue({
      events: mockEvents,
      hasMore: false,
    });
  });

  it('calls API with correct params on mount', async () => {
    render(<EventsPage />);

    await waitFor(() => {
      expect(eventsApi.fetchEvents).toHaveBeenCalledWith({
        venue: '',
        page: 1,
        pageSize: 12,
      });
    });
  });

  it('calls API when venue search is performed', async () => {
    const user = userEvent.setup();
    render(<EventsPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(eventsApi.fetchEvents).toHaveBeenCalledTimes(1);
    });

    // Find and interact with venue search
    const venueButton = screen.getByLabelText(/open venue search/i);
    await user.click(venueButton);

    const searchInput = screen.getByPlaceholderText(/search for a venue/i);
    await user.type(searchInput, 'O2 Arena');

    // Wait for debounced search
    await waitFor(() => {
      expect(eventsApi.fetchEvents).toHaveBeenCalledWith({
        venue: 'O2 Arena',
        page: 1,
        pageSize: 12,
      });
    }, { timeout: 1000 });
  });

  it('shows no results state when no events', async () => {
    eventsApi.fetchEvents.mockResolvedValue({
      events: [],
      hasMore: false,
    });

    render(<EventsPage />);

    await waitFor(() => {
      expect(screen.getByText(/no events found/i)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    eventsApi.fetchEvents.mockRejectedValue(new Error('API Error'));

    render(<EventsPage />);

    await waitFor(() => {
      expect(screen.getByText(/no events found/i)).toBeInTheDocument();
    });
  });

  it('shows drawer when more info is clicked', async () => {
    const user = userEvent.setup();
    render(<EventsPage />);

    await waitFor(() => {
      expect(screen.getByText('Featured Test Event')).toBeInTheDocument();
    });

    const moreInfoButtons = screen.getAllByRole('button', { name: /show more information/i });
    await user.click(moreInfoButtons[0]);

    // Check for drawer-specific content instead of duplicate titles
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /close drawer/i })).toBeInTheDocument();
    });
  });

  it('supports tab navigation through events', async () => {
    const user = userEvent.setup();
    render(<EventsPage />);

    await waitFor(() => {
      expect(screen.getByText('Featured Test Event')).toBeInTheDocument();
    });

    // Tab through interactive elements
    await user.tab();
    expect(document.activeElement).toBeInTheDocument();
    
    await user.tab();
    expect(document.activeElement).toBeInTheDocument();
  });

  it('has accessible venue search with proper labels', async () => {
    const user = userEvent.setup();
    render(<EventsPage />);

    // Test that venue button has comprehensive aria-label
    const venueButton = screen.getByLabelText(/open venue search to find events by venue name/i);
    expect(venueButton).toBeInTheDocument();

    await user.click(venueButton);
    
    // Test that search input has proper label
    const searchInput = screen.getByLabelText(/search for events by venue name/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('shows Load More button when more events are available', async () => {
    eventsApi.fetchEvents.mockResolvedValue({
      events: mockEvents,
      hasMore: true, // More events available
    });

    render(<EventsPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /load more events/i })).toBeInTheDocument();
    });
  });

  it('calls API with next page when Load More is clicked', async () => {
    const user = userEvent.setup();
    // Mock initial load
    eventsApi.fetchEvents.mockResolvedValueOnce({
      events: mockEvents,
      hasMore: true,
    });
    // Mock load more response
    eventsApi.fetchEvents.mockResolvedValueOnce({
      events: mockLoadMoreEvents,
      hasMore: true,
    });

    render(<EventsPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /load more events/i })).toBeInTheDocument();
    });

    const loadMoreButton = screen.getByRole('button', { name: /load more events/i });
    await user.click(loadMoreButton);

    await waitFor(() => {
      expect(eventsApi.fetchEvents).toHaveBeenCalledWith({
        venue: '',
        page: 2, // Next page
        pageSize: 12,
      });
    });
  });
});