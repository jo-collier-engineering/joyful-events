import Button from '../../shared/Button/Button';
import { confirmBooking, confirmReminder } from '../../../utils/errorPrevention';
import './EventActions.scss';

const EventActions = ({ 
  saleStartDate, 
  soldOut, 
  isReminded, 
  onReminderClick, 
  onMoreInfoClick,
  showMoreInfo = true,
  event
}) => {
  const now = new Date();
  const saleDate = saleStartDate ? new Date(saleStartDate) : null;

  const getButtonConfig = () => {
    if (soldOut) {
      return {
        text: 'Sold Out',
        variant: 'primary',
        disabled: true,
        ariaLabel: 'This event is sold out',
      };
    }

    if (!saleDate || saleDate <= now) {
      return {
        text: 'Book Now',
        variant: 'primary',
        disabled: false,
        ariaLabel: 'Book tickets for this event. This will open the booking process where you can select your tickets and complete your purchase.',
      };
    }

    if (isReminded) {
      return {
        text: 'Reminded',
        variant: 'secondary',
        disabled: false,
        ariaLabel: 'You have set a reminder for this event. You will be notified when tickets go on sale.',
      };
    }

    return {
      text: 'Set Reminder',
      variant: 'primary',
      disabled: false,
      ariaLabel: 'Set a reminder for when tickets go on sale. You will be notified when tickets become available for purchase.',
    };
  };

  const buttonConfig = getButtonConfig();

  const handleActionButton = async () => {
    if (soldOut || !event) {
      return;
    }
  
    if (!saleDate || saleDate <= now) {
      await confirmBooking(event);
    } else {
      const confirmed = await confirmReminder(event);
      
      if (confirmed) {
        onReminderClick();
      }
    }
  };

  return (
    <div className="event-actions">
      <Button
        variant={buttonConfig.variant}
        disabled={buttonConfig.disabled}
        onClick={handleActionButton}
        ariaLabel={buttonConfig.ariaLabel}
        className="event-actions__primary"
      >
        {buttonConfig.text}
      </Button>

      {showMoreInfo && (
        <Button
          variant="secondary"
          onClick={onMoreInfoClick}
          ariaLabel="Show more information about this event including full description, lineup details, ticket information, and venue details"
          className="event-actions__secondary"
        >
          + More Info
        </Button>
      )}
    </div>
  );
};

export default EventActions;
