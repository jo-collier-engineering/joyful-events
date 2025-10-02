import './EventInfo.scss';

const EventInfo = ({ date, time, title, venue, location }) => {
  const formatDateTime = () => {
    if (!date) return '';
    const dateObj = new Date(date);
    const dayName = dateObj.toLocaleDateString('en-GB', { weekday: 'long' });
    const monthName = dateObj.toLocaleDateString('en-GB', { month: 'short' });
    const day = dateObj.getDate();
    const timeStr = time || '';
    
    return `${dayName} · ${monthName} ${day} · ${timeStr}`;
  };


  return (
    <div className="event-info">
      <time className="event-info__date" dateTime={date}>
        {formatDateTime()}
      </time>

      <h3 className="event-info__title">
        {title}
      </h3>

      <address className="event-info__venue">
        {venue}
      </address>

      <address className="event-info__location">
        {location}
      </address>
    </div>
  );
};

export default EventInfo;
