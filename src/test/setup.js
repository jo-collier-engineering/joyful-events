import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.confirm globally
Object.defineProperty(window, 'confirm', {
  value: vi.fn(() => true),
  writable: true,
});