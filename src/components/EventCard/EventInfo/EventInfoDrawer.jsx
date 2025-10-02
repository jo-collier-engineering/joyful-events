import './EventInfo.scss';
import { formatPrice } from '../../../utils/currencyUtils';

const EventInfoDrawer = ({ date, time, title, venue, location, price, currency = 'GBP' }) => {
  const formatDateTime = () => {
    if (!date) return '';
    const dateObj = new Date(date);
    const dayName = dateObj.toLocaleDateString('en-GB', { weekday: 'long' });
    const monthName = dateObj.toLocaleDateString('en-GB', { month: 'short' });
    const day = dateObj.getDate();
    const timeStr = time || '';
    
    return `${dayName} · ${monthName} ${day} · ${timeStr}`;
  };

  const formatEventPrice = () => {
    return formatPrice(price, currency);
  };

  return (
    <div className="event-info event-info--drawer">
      <time className="event-info__date" dateTime={date}>
        {formatDateTime()}
      </time>

      <h3 className="event-info__title event-info__title--drawer">{title}</h3>

      <address className="event-info__venue">
        {venue}
      </address>

      <address className="event-info__location">
        {location}
      </address>

      {(price || price === 0 || price === null) && (
        <p className="event-info__price">{formatEventPrice()}</p>
      )}
    </div>
  );
};

export default EventInfoDrawer;