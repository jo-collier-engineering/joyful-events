import VenueSearch from './VenueSearch/VenueSearch';
import './Header.scss';

const Header = ({ onVenueSearch }) => {
  return (
    <header className="header">
      <div className="header__container">
        <h1 className="header__title">
          jo-yful
        </h1>

        <div className="header__search">
          <VenueSearch onSearch={onVenueSearch} />
        </div>
      </div>
    </header>
  );
};

export default Header;
