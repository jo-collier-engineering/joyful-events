const API_BASE_URL = 'https://events-api.dice.fm/v1';
const API_KEY = import.meta.env.VITE_DICE_API_KEY;

export const DEFAULT_PAGE_SIZE = 12;

export const fetchEvents = async ({ venue = '', page = 1, pageSize = DEFAULT_PAGE_SIZE }) => {
  if (!API_KEY) {
    throw new Error('API key not found. Please check your environment variables.');
  }
  
  const now = new Date().toISOString(); 
  
  const params = new URLSearchParams({
    'page[size]': pageSize,
    'page[number]': page,
    'filter[date_from]': now,
  });

  if (venue) {
    params.append('filter[venues]', venue);
  }

  const response = await fetch(`${API_BASE_URL}/events?${params}`, {
    headers: {
      'x-api-key': API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const { data: events = [], links: pagination = {} } = data;
  
  return {
    events,
    pagination,
    hasMore: !!pagination?.next,
  };
};
