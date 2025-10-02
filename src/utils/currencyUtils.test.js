import { describe, it, expect } from 'vitest';
import { getCurrencySymbol, formatPrice, getCheapestPrice } from './currencyUtils';

describe('currencyUtils', () => {
  describe('getCurrencySymbol', () => {
    it('returns correct symbol for known currencies', () => {
      expect(getCurrencySymbol('GBP')).toBe('£');
      expect(getCurrencySymbol('USD')).toBe('$');
      expect(getCurrencySymbol('EUR')).toBe('€');
      expect(getCurrencySymbol('JPY')).toBe('¥');
    });

    it('returns fallback symbol for unknown currencies', () => {
      expect(getCurrencySymbol('XYZ')).toBe('XYZ');
    });

    it('returns default fallback when no currency provided', () => {
      expect(getCurrencySymbol()).toBe('£');
      expect(getCurrencySymbol(null)).toBe('£');
      expect(getCurrencySymbol('')).toBe('£');
    });
  });

  describe('formatPrice', () => {
    it('formats price correctly with currency symbol', () => {
      expect(formatPrice(2500, 'GBP')).toBe('£25.00');
      expect(formatPrice(1500, 'USD')).toBe('$15.00');
      expect(formatPrice(3000, 'EUR')).toBe('€30.00');
    });

    it('converts from cents to decimal', () => {
      expect(formatPrice(100)).toBe('£1.00');
      expect(formatPrice(2500)).toBe('£25.00');
      expect(formatPrice(999)).toBe('£9.99');
    });

    it('handles null and undefined prices', () => {
      expect(formatPrice(null)).toBe('£0.00');
      expect(formatPrice(undefined)).toBe('£0.00');
    });

    it('uses default currency when not provided', () => {
      expect(formatPrice(2500)).toBe('£25.00');
    });

    it('handles zero price', () => {
      expect(formatPrice(0)).toBe('£0.00');
    });
  });

  describe('getCheapestPrice', () => {
    it('returns the cheapest price from multiple ticket types', () => {
      const ticketTypes = [
        { name: 'VIP', price: { total: 5000 } },
        { name: 'General', price: { total: 2500 } },
        { name: 'Student', price: { total: 1500 } },
      ];
      expect(getCheapestPrice(ticketTypes)).toBe(1500);
    });

    it('returns null when ticket_types is null or undefined', () => {
      expect(getCheapestPrice(null)).toBe(null);
      expect(getCheapestPrice(undefined)).toBe(null);
    });

    it('returns null when ticket_types is empty array', () => {
      expect(getCheapestPrice([])).toBe(null);
    });

    it('filters out null and undefined prices', () => {
      const ticketTypes = [
        { name: 'VIP', price: { total: 5000 } },
        { name: 'Invalid', price: { total: null } },
        { name: 'Missing', price: { total: undefined } },
        { name: 'General', price: { total: 2500 } },
      ];
      expect(getCheapestPrice(ticketTypes)).toBe(2500);
    });

    it('accepts zero price for free events', () => {
      const ticketTypes = [
        { name: 'VIP', price: { total: 5000 } },
        { name: 'Free', price: { total: 0 } },
        { name: 'General', price: { total: 2500 } },
      ];
      expect(getCheapestPrice(ticketTypes)).toBe(0);
    });

    it('returns zero when only free tickets exist', () => {
      const ticketTypes = [
        { name: 'Free', price: { total: 0 } },
      ];
      expect(getCheapestPrice(ticketTypes)).toBe(0);
    });

    it('returns null when no valid prices exist', () => {
      const ticketTypes = [
        { name: 'Invalid', price: { total: null } },
        { name: 'Missing', price: { total: undefined } },
      ];
      expect(getCheapestPrice(ticketTypes)).toBe(null);
    });

    it('filters out negative prices', () => {
      const ticketTypes = [
        { name: 'Invalid', price: { total: -100 } },
        { name: 'General', price: { total: 2500 } },
      ];
      expect(getCheapestPrice(ticketTypes)).toBe(2500);
    });

    it('returns null when only negative prices exist', () => {
      const ticketTypes = [
        { name: 'Invalid1', price: { total: -100 } },
        { name: 'Invalid2', price: { total: -50 } },
      ];
      expect(getCheapestPrice(ticketTypes)).toBe(null);
    });

    it('handles tickets with missing price property', () => {
      const ticketTypes = [
        { name: 'VIP', price: { total: 5000 } },
        { name: 'NoPriceProperty' },
        { name: 'General', price: { total: 2500 } },
      ];
      expect(getCheapestPrice(ticketTypes)).toBe(2500);
    });

    it('handles tickets with null price object', () => {
      const ticketTypes = [
        { name: 'VIP', price: { total: 5000 } },
        { name: 'NullPrice', price: null },
        { name: 'General', price: { total: 2500 } },
      ];
      expect(getCheapestPrice(ticketTypes)).toBe(2500);
    });

    it('returns the only price when single ticket type', () => {
      const ticketTypes = [
        { name: 'General', price: { total: 2500 } },
      ];
      expect(getCheapestPrice(ticketTypes)).toBe(2500);
    });
  });
});