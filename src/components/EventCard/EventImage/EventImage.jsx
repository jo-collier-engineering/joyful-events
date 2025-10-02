import Badge from '../../shared/Badge/Badge';
import './EventImage.scss';

const EventImage = ({ 
  imageUrl, 
  eventName, 
  isFeatured, 
  isOnSale, 
  hasAudio,
  isPlaying,
  onPlayAudio 
}) => {

  const getImgixUrl = (url) => {
    if (!url) return '';
    
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}ar=1:1&fit=crop&crop=entropy&w=400&auto=format&q=80`;
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (onPlayAudio) {
      onPlayAudio();
    }
  };

  return (
    <div className="event-image">
      {imageUrl ? (
        <img
          src={getImgixUrl(imageUrl)}
          alt={eventName}
          className="event-image__img"
          loading="lazy"
        />
      ) : (
        <div className="event-image__placeholder">No image available</div>
      )}
      
      <ul className="event-image__badges">
        {isFeatured && (
          <li>
            <Badge variant="black">Featured</Badge>
          </li>
        )}

        {isOnSale && (
          <li>
            <Badge variant="yellow">On Sale Now</Badge>
          </li>
        )}
      </ul>

      {hasAudio && (
        <div className="event-image__overlay">
          <div className="event-image__audio-controls">
            <button
              className="event-image__play-button"
              onClick={handlePlayClick}
              aria-label={isPlaying ? `Pause audio preview for ${eventName}. Currently playing audio preview.` : `Play audio preview for ${eventName}. Audio preview available.`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                {isPlaying ? (
                  <>
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </>
                ) : (
                  <path d="M8 5v14l11-7z" />
                )}
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventImage;
