import './Button.scss';

const Button = ({ 
  children, 
  variant = 'primary', 
  disabled = false, 
  onClick, 
  isLoading = false,
  className = '',
  ariaLabel,
  ...props 
}) => {
  const classes = [
    'button',
    `button--${variant}`,
    disabled && 'button--disabled',
    isLoading && 'button--loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      {...props}
    >
      {isLoading && (
        <span className="button__spinner" aria-hidden="true"></span>
      )}

      <span className={isLoading ? 'button__text--hidden' : ''}>
        {children}
      </span>
    </button>
  );
};

export default Button;
