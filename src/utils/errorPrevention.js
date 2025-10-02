import { getCheapestPrice } from './currencyUtils';

export const confirmDestructiveAction = (message) => {
  return new Promise((resolve) => {
    const confirmed = window.confirm(
      `${message}\n\n⚠️ This action cannot be undone.\n\nAre you sure you want to proceed?`
    );
    resolve(confirmed);
  });
};

export const confirmBooking = (event) => {
  return new Promise((resolve) => {
    const { ticket_types, currency = 'GBP', name, date, venue } = event;
    
    const price = getCheapestPrice(ticket_types);
    
    let priceDisplay = 'TBA';
    if (price !== null && price !== undefined) {
      const amount = price / 100;
      priceDisplay = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    }
    
    const eventDate = new Date(date).toLocaleDateString();
    const message = `Book ticket for "${name}"?\n\n` +
      `📅 Date: ${eventDate}\n` +
      `📍 Venue: ${venue}\n` +
      `💰 Price: ${priceDisplay}`;
    
    const confirmed = window.confirm(message);
    resolve(confirmed);
  });
};

export const confirmReminder = (event) => {
  return new Promise((resolve) => {
    const { name, date, venue } = event;
    const eventDate = new Date(date).toLocaleDateString();
    
    const message = `Set reminder for "${name}"?\n\n` +
      `📅 Date: ${eventDate}\n` +
      `📍 Venue: ${venue}\n\n` +
      `You'll be notified when tickets go on sale.`;
    
    const confirmed = window.confirm(message);
    resolve(confirmed);
  });
};

export const getErrorMessage = (error) => {
  if (error.message?.includes('API key')) {
    return 'Configuration error. Please check your API key.';
  }
  
  if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }
  
  if (error.message?.includes('401')) {
    return 'Authentication failed. Please check your API credentials.';
  }
  
  if (error.message?.includes('403')) {
    return 'Access denied. You do not have permission to access this resource.';
  }
  
  if (error.message?.includes('404')) {
    return 'The requested resource could not be found.';
  }
  
  if (error.message?.includes('500') || error.message?.includes('502') || error.message?.includes('503')) {
    return 'Server error. Please try again later.';
  }
  
  if (error.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }
  
  return 'Something went wrong. Please try again or contact support if the problem persists.';
};

export const showErrorMessage = (message, title = 'Error') => {
  alert(`${title}\n\n${message}`);
};
