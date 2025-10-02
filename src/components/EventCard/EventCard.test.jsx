import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import EventCard from './EventCard';
import { mockFeaturedEvent, mockPreSaleEvent, mockSoldOutEvent, mockEventWithOnlyAppleMusic } from '../../test/mockData';

describe('EventCard - Core Functionality', () => {
  const defaultProps = {
    event: mockFeaturedEvent,
    isReminded: false,
    isPlaying: false,
    onReminderClick: vi.fn(),
    onMoreInfoClick: vi.fn(),
    onPlayAudio: vi.fn(),
  };

  it('shows featured badge when event is featured', () => {
    render(<EventCard {...defaultProps} />);
    // Test specifically for the badge element
    const badge = screen.getByText('Featured');
    expect(badge).toHaveClass('badge--black');
  });

  it('shows Book Now button when tickets are on sale', () => {
    render(<EventCard {...defaultProps} />);
    // Test by aria-label since that's what screen readers use
    expect(screen.getByRole('button', { name: /book tickets for this event/i })).toBeInTheDocument();
  });

  it('shows Set Reminder button when tickets are not yet on sale', () => {
    render(<EventCard {...defaultProps} event={mockPreSaleEvent} />);
    // Test by aria-label since that's what screen readers use  
    expect(screen.getByRole('button', { name: /set a reminder for when tickets go on sale/i })).toBeInTheDocument();
  });

  it('shows Sold Out button when event is sold out', () => {
    render(<EventCard {...defaultProps} event={mockSoldOutEvent} />);
    // Test by aria-label since that's what screen readers use
    expect(screen.getByRole('button', { name: /this event is sold out/i })).toBeInTheDocument();
  });

  it('does not call onReminderClick when Book Now button is clicked', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<EventCard {...defaultProps} />);

    // Use aria-label to find the button (more realistic)
    const bookButton = screen.getByRole('button', { name: /book tickets for this event/i });
    await user.click(bookButton);

    // Booking should show confirmation but NOT call onReminderClick
    expect(confirmSpy).toHaveBeenCalled();
    expect(defaultProps.onReminderClick).not.toHaveBeenCalled();
    
    confirmSpy.mockRestore();
  });

  it('has accessible audio controls with proper aria-labels', () => {
    render(<EventCard {...defaultProps} />);
    // Test that audio button has proper screen reader description
    expect(screen.getByRole('button', { name: /play audio preview for featured test event/i })).toBeInTheDocument();
  });

  it('shows On Sale badge when tickets are on sale', () => {
    render(<EventCard {...defaultProps} />);
    // Test that "On Sale Now" badge appears when tickets are available
    expect(screen.getByText('On Sale Now')).toBeInTheDocument();
  });

  it('does not show On Sale badge when tickets are not yet on sale', () => {
    render(<EventCard {...defaultProps} event={mockPreSaleEvent} />);
    // Test that "On Sale Now" badge does not appear for pre-sale events
    expect(screen.queryByText('On Sale Now')).not.toBeInTheDocument();
  });

  it('does not show audio button when only Apple Music tracks are available', () => {
    render(<EventCard {...defaultProps} event={mockEventWithOnlyAppleMusic} />);
    // Apple Music tracks are blocked by CORS, so no audio button should appear
    expect(screen.queryByRole('button', { name: /play audio preview/i })).not.toBeInTheDocument();
  });
});