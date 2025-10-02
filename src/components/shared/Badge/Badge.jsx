import './Badge.scss';

const Badge = ({ children, variant = 'black' }) => {
  const classes = ['badge', `badge--${variant}`]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      {children}
    </span>
  );
};

export default Badge;
