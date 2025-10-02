import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import EventDrawer from './EventDrawer';
import { mockFeaturedEvent, mockEventWithOnlyAppleMusic } from '../../test/mockData';

describe('EventDrawer - Core Functionality', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    event: mockFeaturedEvent,
    isReminded: false,
    isPlaying: false,
    onReminderClick: vi.fn(),
    onPlayAudio: vi.fn(),
  };

  it('does not show more info button in drawer', () => {
    render(<EventDrawer {...defaultProps} />);
    // Look specifically for the button, not section titles
    expect(screen.queryByRole('button', { name: /more info/i })).not.toBeInTheDocument();
  });

  it('calls onClose when Escape key is pressed', async () => {
    const user = userEvent.setup();
    render(<EventDrawer {...defaultProps} />);

    await user.keyboard('{Escape}');
    // Wait for the animation delay (300ms) before checking if onClose was called
    await new Promise(resolve => setTimeout(resolve, 350));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when background overlay is clicked', async () => {
    const user = userEvent.setup();
    render(<EventDrawer {...defaultProps} />);

    // Find and click the drawer overlay (background)
    const overlay = document.querySelector('.drawer__overlay');
    expect(overlay).toBeInTheDocument();
    
    await user.click(overlay);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('shows Book Now button when tickets are on sale', () => {
    render(<EventDrawer {...defaultProps} />);
    expect(screen.getByRole('button', { name: /book tickets for this event/i })).toBeInTheDocument();
  });

  it('shows Set Reminder button when tickets are not yet on sale', () => {
    const mockPreSaleEvent = {
      ...mockFeaturedEvent,
      sale_start_date: '2025-12-01T00:00:00Z', // Future date
    };
    render(<EventDrawer {...defaultProps} event={mockPreSaleEvent} />);
    expect(screen.getByRole('button', { name: /set a reminder for when tickets go on sale/i })).toBeInTheDocument();
  });

  it('shows Sold Out button when event is sold out', () => {
    const mockSoldOutEvent = {
      ...mockFeaturedEvent,
      sold_out: true,
    };
    render(<EventDrawer {...defaultProps} event={mockSoldOutEvent} />);
    expect(screen.getByRole('button', { name: /this event is sold out/i })).toBeInTheDocument();
  });

  it('does not call onReminderClick when Book Now button is clicked', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<EventDrawer {...defaultProps} />);

    const bookButton = screen.getByRole('button', { name: /book tickets for this event/i });
    await user.click(bookButton);

    // Booking should show confirmation but NOT call onReminderClick
    expect(confirmSpy).toHaveBeenCalled();
    expect(defaultProps.onReminderClick).not.toHaveBeenCalled();
    
    confirmSpy.mockRestore();
  });

  it('calls onReminderClick when Set Reminder button is clicked', async () => {
    const user = userEvent.setup();
    const mockPreSaleEvent = {
      ...mockFeaturedEvent,
      sale_start_date: '2025-12-01T00:00:00Z', // Future date
    };
    render(<EventDrawer {...defaultProps} event={mockPreSaleEvent} />);

    const reminderButton = screen.getByRole('button', { name: /set a reminder for when tickets go on sale/i });
    await user.click(reminderButton);

    expect(defaultProps.onReminderClick).toHaveBeenCalledWith('featured-event-1');
  });

  it('shows confirmation dialog for booking action', async () => {
    const user = userEvent.setup();
    render(<EventDrawer {...defaultProps} />);

    const bookButton = screen.getByRole('button', { name: /book tickets for this event/i });
    await user.click(bookButton);

    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringContaining('Book ticket for')
    );
  });

  it('shows confirmation dialog for reminder action', async () => {
    const user = userEvent.setup();
    const mockPreSaleEvent = {
      ...mockFeaturedEvent,
      sale_start_date: '2025-12-01T00:00:00Z', // Future date
    };
    render(<EventDrawer {...defaultProps} event={mockPreSaleEvent} />);

    const reminderButton = screen.getByRole('button', { name: /set a reminder for when tickets go on sale/i });
    await user.click(reminderButton);

    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringContaining('Set reminder for')
    );
  });

  it('does not show audio button when only Apple Music tracks are available', () => {
    render(<EventDrawer {...defaultProps} event={mockEventWithOnlyAppleMusic} />);
    // Apple Music tracks are blocked by CORS, so no audio button should appear
    expect(screen.queryByRole('button', { name: /play audio preview/i })).not.toBeInTheDocument();
  });
});