// Centralized mock data for tests - matches DICE API structure

export const mockEventBase = {
  age_limit: "18+",
  sale_end_date: "2024-03-01T23:59:59Z",
  raw_description: "Raw event description",
  status: "active",
  images: [],
  apple_music_tracks: [
    {
      open_url: "https://music.apple.com/track/123",
      preview_url: "test-preview.mp3",
      title: "Test Track"
    }
  ],
  event_images: {
    brand: null,
    landscape: "https://dice-media.imgix.net/attachments/2025-02-27/test-image.jpg",
    portrait: "https://dice-media.imgix.net/attachments/2025-02-27/test-portrait.jpg",
    square: "https://dice-media.imgix.net/attachments/2025-02-27/test-square.jpg"
  },
  name: "Test Event",
  presented_by: "Test Promoter",
  genre_tags: [],
  hash: "test-hash-123",
  venue: "Test Venue",
  detailed_artists: [
    {
      headliner: true,
      id: 1,
      name: "Main Artist"
    }
  ],
  type: "concert",
  price: null,
  venues: [
    {
      city: {
        code: "LON",
        country_alpha3: "GBR",
        country_id: "1",
        country_name: "United Kingdom",
        id: "1",
        name: "London"
      },
      id: 1,
      name: "Test Venue"
    }
  ],
  url: "https://dice.fm/event/test-event",
  address: "Test Street, London",
  announcement_date: "2024-01-01T00:00:00Z",
  currency: "GBP",
  id: "test-event-1",
  spotify_tracks: [
    {
      open_url: "https://open.spotify.com/track/123",
      preview_url: "test-spotify-preview.mp3",
      title: "Test Spotify Track"
    }
  ],
  show_price_breakdown: true,
  ticket_types: [
    {
      id: 1,
      name: "General Admission",
      price: {
        face_value: 2000,
        fees: 500,
        total: 2500
      },
      sold_out: false
    }
  ],
  external_url: null,
  promoters: [
    {
      id: 1,
      name: "Test Promoter"
    }
  ],
  int_id: 1,
  destination_event_perm_name: null,
  type_tags: [],
  cities: [
    {
      code: "LON",
      country_alpha3: "GBR",
      country_id: "1",
      country_name: "United Kingdom",
      id: "1",
      name: "London"
    }
  ],
  checksum: "test-checksum-123",
  featured: false,
  sold_out: false,
  date: "2024-02-15T20:00:00Z",
  date_end: "2024-02-15T23:00:00Z",
  location: {
    accuracy: 0,
    city: "London",
    country: "United Kingdom",
    lat: 51.5074,
    lng: -0.1278,
    place: "Test Venue",
    street: "Test Street",
    zip: "SW1A 1AA",
    region: "London",
    state: "England"
  },
  flags: [],
  perm_name: "test-event",
  links: [],
  artists: [],
  timezone: "Europe/London",
  tags: [],
  destination_event_id: null,
  sale_start_date: "2024-01-01T00:00:00Z",
  lineup: [
    {
      details: "Main Artist",
      time: "20:00"
    },
    {
      details: "Support Act",
      time: "19:00"
    }
  ],
  linkout_type: null,
  description: "Test event description with more details"
};

// Specific event variants for different test scenarios
export const mockFeaturedEvent = {
  ...mockEventBase,
  id: "featured-event-1",
  name: "Featured Test Event",
  featured: true,
  sale_start_date: "2024-01-01T00:00:00Z", // On sale
};

export const mockOnSaleEvent = {
  ...mockEventBase,
  id: "on-sale-event-1",
  name: "On Sale Event",
  featured: false,
  sale_start_date: "2024-01-01T00:00:00Z", // On sale
};

export const mockPreSaleEvent = {
  ...mockEventBase,
  id: "pre-sale-event-1",
  name: "Pre-Sale Event",
  featured: false,
  sale_start_date: "2025-12-01T00:00:00Z", // Not yet on sale (future date)
};

export const mockSoldOutEvent = {
  ...mockEventBase,
  id: "sold-out-event-1",
  name: "Sold Out Event",
  featured: false,
  sold_out: true,
  sale_start_date: "2024-01-01T00:00:00Z",
};

export const mockEventWithAudio = {
  ...mockEventBase,
  id: "audio-event-1",
  name: "Event With Audio",
  apple_music_tracks: [
    {
      open_url: "https://music.apple.com/track/123",
      preview_url: "test-preview.mp3",
      title: "Test Track"
    }
  ],
  spotify_tracks: [
    {
      open_url: "https://open.spotify.com/track/456",
      preview_url: "test-spotify-preview.mp3",
      title: "Test Spotify Track"
    }
  ],
};

export const mockEventWithoutAudio = {
  ...mockEventBase,
  id: "no-audio-event-1",
  name: "Event Without Audio",
  apple_music_tracks: [],
  spotify_tracks: [],
};

export const mockEventWithOnlyAppleMusic = {
  ...mockEventBase,
  id: "apple-only-event-1",
  name: "Event With Only Apple Music",
  apple_music_tracks: [
    {
      open_url: "https://music.apple.com/track/789",
      preview_url: "test-apple-preview.mp3",
      title: "Test Apple Track"
    }
  ],
  spotify_tracks: [], // No Spotify tracks
};

// Multiple events for pagination tests
export const mockEvents = [
  mockFeaturedEvent,
  mockOnSaleEvent,
  {
    ...mockEventBase,
    id: "event-2",
    name: "Second Test Event",
    venue: "Another Venue",
    date: "2024-02-16T21:00:00Z",
    sale_start_date: "2024-02-01T00:00:00Z",
    ticket_types: [
      {
        id: 2,
        name: "VIP",
        price: {
          face_value: 4500,
          fees: 500,
          total: 5000
        },
        sold_out: false
      }
    ],
    venues: [
      {
        city: {
          code: "MAN",
          country_alpha3: "GBR",
          country_id: "1",
          country_name: "United Kingdom",
          id: "2",
          name: "Manchester"
        },
        id: 2,
        name: "Another Venue"
      }
    ],
    location: {
      ...mockEventBase.location,
      city: "Manchester",
      lat: 53.4808,
      lng: -2.2426,
      place: "Another Venue",
    }
  }
];

// Additional events for load more testing (with unique IDs)
export const mockLoadMoreEvents = [
  {
    ...mockEventBase,
    id: "load-more-event-1",
    name: "Load More Event 1",
    venue: "Load More Venue 1",
    date: "2024-03-01T20:00:00Z",
    sale_start_date: "2024-02-01T00:00:00Z",
    ticket_types: [
      {
        id: 10,
        name: "General Admission",
        price: {
          face_value: 2500,
          fees: 250,
          total: 2750
        },
        sold_out: false
      }
    ],
    venues: [
      {
        ...mockEventBase.venues[0],
        id: 10,
        name: "Load More Venue 1"
      }
    ],
    location: {
      ...mockEventBase.location,
      city: "Birmingham",
      lat: 52.4862,
      lng: -1.8904,
      place: "Load More Venue 1",
    }
  },
  {
    ...mockEventBase,
    id: "load-more-event-2",
    name: "Load More Event 2",
    venue: "Load More Venue 2",
    date: "2024-03-02T19:30:00Z",
    sale_start_date: "2024-02-01T00:00:00Z",
    ticket_types: [
      {
        id: 11,
        name: "Standard",
        price: {
          face_value: 3000,
          fees: 300,
          total: 3300
        },
        sold_out: false
      }
    ],
    venues: [
      {
        ...mockEventBase.venues[0],
        id: 11,
        name: "Load More Venue 2"
      }
    ],
    location: {
      ...mockEventBase.location,
      city: "Leeds",
      lat: 53.8008,
      lng: -1.5491,
      place: "Load More Venue 2",
    }
  },
  {
    ...mockEventBase,
    id: "load-more-event-3",
    name: "Load More Event 3",
    venue: "Load More Venue 3",
    date: "2024-03-03T21:00:00Z",
    sale_start_date: "2024-02-01T00:00:00Z",
    ticket_types: [
      {
        id: 12,
        name: "Premium",
        price: {
          face_value: 5000,
          fees: 500,
          total: 5500
        },
        sold_out: false
      }
    ],
    venues: [
      {
        ...mockEventBase.venues[0],
        id: 12,
        name: "Load More Venue 3"
      }
    ],
    location: {
      ...mockEventBase.location,
      city: "Liverpool",
      lat: 53.4084,
      lng: -2.9916,
      place: "Load More Venue 3",
    }
  }
];