import { useState, useEffect, useRef } from 'react';
import './VenueSearch.scss';

const DEBOUNCE_MS = 500;

const VenueSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const timeoutRef = useRef(null);
  const inputRef = useRef(null);
  const hasUserInteractedRef = useRef(false);

  useEffect(() => {
    if (!hasUserInteractedRef.current && query === '') {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSearch(query);
    }, DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, onSearch]);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleChange = (e) => {
    hasUserInteractedRef.current = true;
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
    setIsExpanded(false);
  };

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleButtonFocus = () => {
    setIsExpanded(true);
  };

  const handleBlur = () => {
    if (!query) {
      setIsExpanded(false);
    }
  };

  if (!isExpanded) {
    return (
      <button 
        className="venue-search__button"
        onClick={handleExpand}
        onFocus={handleButtonFocus}
        aria-label="Open venue search to find events by venue name. Try searching for popular venues like O2 Arena, Royal Albert Hall, or Wembley Stadium."
        tabIndex={0}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>

        <span>VENUE</span>
      </button>
    );
  }

  return (
    <form className="venue-search" role="search" aria-label="Search events by venue">
      <label htmlFor="venue-search-input" className="venue-search__label">
        Search for events by venue name. Type the name of a venue to find events happening there. You can search for full venue names.
      </label>

      <div className="venue-search__input-wrapper">
        <input
          ref={inputRef}
          id="venue-search-input"
          type="search"
          className="venue-search__input"
          placeholder="Search for a venue..."
          value={query}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="off"
        />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="venue-search__icon"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        {query && (
          <button
            type="button"
            className="venue-search__clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
};

export default VenueSearch;
