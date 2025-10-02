import Drawer from '../shared/Drawer/Drawer';
import EventImage from '../EventCard/EventImage/EventImage';
import EventInfoDrawer from '../EventCard/EventInfo/EventInfoDrawer';
import EventActions from '../EventCard/EventActions/EventActions';
import { formatPrice, getCheapestPrice } from '../../utils/currencyUtils';
import './EventDrawer.scss';

const EventDrawer = ({ 
  isOpen, 
  onClose, 
  event, 
  isReminded,
  isPlaying,
  onReminderClick,
  onPlayAudio 
}) => {
  if (!event) return null;

  const {
    id,
    name,
    images,
    date,
    sale_start_date,
    description,
    apple_music_tracks,
    spotify_tracks,
    lineup = [],
    ticket_types = [],
    featured,
    audio_preview_url,
    preview_url,
    venue,
    venues,
    location,
    sold_out,
    event_images,
    image,
    currency,
  } = event;

  const isFeatured = featured === true;
  
  const isOnSale = sale_start_date ? new Date(sale_start_date) <= new Date() : true;
  
  const hasAudio = Boolean(
    // (apple_music_tracks && apple_music_tracks.length > 0) || 
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

  const venueName = venue;
  const venueCity = venues[0].city;
  const locationCity = location.city;
  const locationCountry = location.country;
  const venueLocation = venueCity.name && venueCity.country_alpha3
    ? `${venueCity.name}, ${venueCity.country_alpha3}` 
    : `${locationCity}, ${locationCountry}`;
  
  const price = getCheapestPrice(ticket_types);

  const soldOut = sold_out;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={name}>
      <div className="event-drawer">
        <EventImage
          imageUrl={event_images?.square || event_images?.landscape || images?.[0]?.url || images?.url || image || ''}
          eventName={name}
          isFeatured={isFeatured}
          isOnSale={isOnSale}
          hasAudio={hasAudio}
          isPlaying={isPlaying}
          onPlayAudio={() => onPlayAudio(event)}
        />

        <div className="event-drawer__content">
          <EventInfoDrawer
            date={eventDate}
            time={eventTime}
            title={name}
            venue={venueName}
            location={venueLocation}
            price={price}
            currency={currency}
          />

          <EventActions
            saleStartDate={sale_start_date}
            soldOut={soldOut}
            isReminded={isReminded}
            onReminderClick={() => onReminderClick(id)}
            showMoreInfo={false}
            event={event}
          />
        </div>

        {description && (
          <section className="event-drawer__section">
            <h3 className="event-drawer__section-title">More Info</h3>
            <div className="event-drawer__section-content">
              <p>{description}</p>
            </div>
          </section>
        )}

        {lineup && lineup.length > 0 && (
          <section className="event-drawer__section">
            <h3 className="event-drawer__section-title">Line Up</h3>
            <ul className="event-drawer__lineup">
              {lineup.map((item, index) => (
                <li key={index} className="event-drawer__lineup-item">
                  {item.time ? `${item.details} - ${item.time}` : item.details}
                </li>
              ))}
            </ul>
          </section>
        )}

        {ticket_types && ticket_types.length > 0 && (
          <section className="event-drawer__section">
            <h3 className="event-drawer__section-title">Tickets</h3>
            <ul className="event-drawer__tickets">
              {ticket_types.map((ticket, index) => (
                <li key={index} className="event-drawer__ticket-item">
                  <span className="event-drawer__ticket-type">
                    {ticket.name || `${ticket.type || 'General'} ${ticket.standing ? 'standing' : ''}`}
                  </span>
                  <span className="event-drawer__ticket-price">
                    {formatPrice(ticket.price.total, currency)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </Drawer>
  );
};

export default EventDrawer;
