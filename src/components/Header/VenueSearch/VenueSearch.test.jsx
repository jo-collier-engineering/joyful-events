import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import VenueSearch from './VenueSearch';

describe('VenueSearch - Core Functionality', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders venue button initially', () => {
    render(<VenueSearch onSearch={mockOnSearch} />);
    expect(screen.getByLabelText(/open venue search/i)).toBeInTheDocument();
    expect(screen.getByText(/venue/i)).toBeInTheDocument();
  });

  it('expands to search input when button is clicked', async () => {
    const user = userEvent.setup();
    render(<VenueSearch onSearch={mockOnSearch} />);

    const venueButton = screen.getByLabelText(/open venue search/i);
    await user.click(venueButton);

    expect(screen.getByPlaceholderText(/search for a venue/i)).toBeInTheDocument();
  });

  it('debounces search callback', async () => {
    const user = userEvent.setup();
    render(<VenueSearch onSearch={mockOnSearch} />);

    const venueButton = screen.getByLabelText(/open venue search/i);
    await user.click(venueButton);

    const searchInput = screen.getByPlaceholderText(/search for a venue/i);
    await user.type(searchInput, 'O2');

    // Should not call immediately
    expect(mockOnSearch).not.toHaveBeenCalled();

    // Wait for debounce (500ms + buffer)
    await new Promise(resolve => setTimeout(resolve, 600));
    expect(mockOnSearch).toHaveBeenCalledWith('O2');
  });
});