import EventImage from './EventImage/EventImage';
import EventInfo from './EventInfo/EventInfo';
import EventActions from './EventActions/EventActions';
import { formatPrice, getCheapestPrice } from '../../utils/currencyUtils';
import './EventCard.scss';

const EventCard = ({ 
  event, 
  isReminded,
  isPlaying,
  onReminderClick, 
  onMoreInfoClick,
  onPlayAudio 
}) => {
  const {
    id,
    name,
    images,
    date,
    sale_start_date,
    apple_music_tracks,
    spotify_tracks,
    featured,
    audio_preview_url,
    preview_url,
    venue,
    venues,
    location,
    ticket_types,
    sold_out,
    event_images,
    image,
    currency,
  } = event;

  const isFeatured = featured === true;
  
  const isOnSale = sale_start_date ? new Date(sale_start_date) <= new Date() : false;
  
  const hasAudio = Boolean(
    (apple_music_tracks && apple_music_tracks.length > 0) || 
    (spotify_tracks && spotify_tracks.length > 0) ||
    audio_preview_url ||
    preview_url
  );

  const eventDate = date ? new Date(date).toISOString().split('T')[0] : '';
  const eventTime = date ? new Date(date).toLocaleTimeString('en-GB', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  }) : '';

  const venueName = venue || 'Unknown Venue';
  const firstVenue = venues?.[0];
  const venueCity = firstVenue?.city;
  const venueCityName = venueCity?.name;
  const venueCityCountry = venueCity?.country_alpha3;
  const locationCity = location?.city || 'Unknown City';
  const locationCountry = location?.country || 'Unknown Country';
  const venueLocation = venueCityName && venueCityCountry
    ? `${venueCityName}, ${venueCityCountry}` 
    : `${locationCity}, ${locationCountry}`;

  const price = getCheapestPrice(ticket_types);

  const soldOut = sold_out;

  return (
    <article className="event-card">
      <EventImage
        imageUrl={event_images?.square || images?.[0]?.url || images?.url || image || ''}
        eventName={name}
        isFeatured={isFeatured}
        isOnSale={isOnSale}
        hasAudio={hasAudio}
        isPlaying={isPlaying}
        onPlayAudio={() => onPlayAudio(event)}
      />

      <div className="event-card__content">
        <EventInfo
          date={eventDate}
          time={eventTime}
          title={name}
          venue={venueName}
          location={venueLocation}
        />

        <div className="event-card__bottom">
          <div className="event-card__price">
            {formatPrice(price, currency)}
          </div>

          <EventActions
            saleStartDate={sale_start_date}
            soldOut={soldOut}
            isReminded={isReminded}
            onReminderClick={() => onReminderClick(id)}
            onMoreInfoClick={() => onMoreInfoClick(event)}
            event={event}
          />
        </div>
      </div>
    </article>
  );
};

export default EventCard;
