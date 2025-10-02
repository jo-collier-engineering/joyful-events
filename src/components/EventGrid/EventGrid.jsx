import './EventGrid.scss';

const EventGrid = ({ children }) => {
  return (
    <ul className="event-grid" aria-label="Events list">
      {children}
    </ul>
  );
};

export default EventGrid;
