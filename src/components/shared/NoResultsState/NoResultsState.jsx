import './NoResultsState.scss';

const NoResultsState = ({ venue }) => {
  return (
    <div className="no-results-state" role="status" aria-live="polite">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="no-results-state__icon"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>

      <h2 className="no-results-state__title">No events found</h2>

      <p className="no-results-state__text">
        {venue 
          ? `No events found for "${venue}". Try searching for a different venue.`
          : 'No events are currently available.'}
      </p>
    </div>
  );
};

export default NoResultsState;
