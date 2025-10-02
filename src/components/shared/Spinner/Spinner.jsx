import './Spinner.scss';

const Spinner = ({ size = 'medium', className = '', ariaLabel = 'Loading' }) => {
  const classes = ['spinner', `spinner--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div 
      className={classes}
      role="status"
      aria-label={ariaLabel}
    >
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};

export default Spinner;
