import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import Drawer from './Drawer';

describe('Drawer - Core Functionality', () => {
  const defaultProps = {
    isOpen: false,
    onClose: vi.fn(),
    children: <div>Test Content</div>,
  };

  it('does not render when closed', () => {
    render(<Drawer {...defaultProps} />);
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(<Drawer {...defaultProps} isOpen={true} />);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('calls onClose when Escape key is pressed', async () => {
    const user = userEvent.setup();
    render(<Drawer {...defaultProps} isOpen={true} />);

    await user.keyboard('{Escape}');
    // Wait for the animation delay (300ms) before checking if onClose was called
    await new Promise(resolve => setTimeout(resolve, 350));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('has accessible close button with proper aria-label', () => {
    render(<Drawer {...defaultProps} isOpen={true} />);
    // Test that close button has proper screen reader description
    expect(screen.getByRole('button', { name: /close drawer/i })).toBeInTheDocument();
  });

  it('traps focus within drawer when open', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button>Outside Button</button>
        <Drawer {...defaultProps} isOpen={true}>
          <div>
            <button>Inside Button 1</button>
            <button>Inside Button 2</button>
          </div>
        </Drawer>
      </div>
    );

    const closeButton = screen.getByRole('button', { name: /close drawer/i });
    const insideButton1 = screen.getByText('Inside Button 1');
    const insideButton2 = screen.getByText('Inside Button 2');

    // Manually focus the close button to test focus trapping
    closeButton.focus();
    expect(closeButton).toHaveFocus();

    // Tab should cycle within drawer
    await user.tab();
    expect(insideButton1).toHaveFocus();

    await user.tab();
    expect(insideButton2).toHaveFocus();

    // Tab again should go back to close button (focus trap)
    await user.tab();
    expect(closeButton).toHaveFocus();
  });
});