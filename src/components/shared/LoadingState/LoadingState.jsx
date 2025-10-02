import Spinner from '../Spinner/Spinner';
import './LoadingState.scss';

const LoadingState = () => {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <Spinner size="large" ariaLabel="Loading events" />
    </div>
  );
};

export default LoadingState;
