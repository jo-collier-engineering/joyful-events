import { useState, useEffect, useCallback, useRef } from 'react';
import Header from '../../components/Header/Header';
import EventCard from '../../components/EventCard/EventCard';
import EventDrawer from '../../components/EventDrawer/EventDrawer';
import EventGrid from '../../components/EventGrid/EventGrid';
import LoadingState from '../../components/shared/LoadingState/LoadingState';
import NoResultsState from '../../components/shared/NoResultsState/NoResultsState';
import Button from '../../components/shared/Button/Button';
import { fetchEvents, DEFAULT_PAGE_SIZE } from '../../api/eventsApi';
import { audioPlayer } from '../../utils/audioPlayer';
import { getErrorMessage, showErrorMessage } from '../../utils/errorPrevention';
import './EventsPage.scss';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [venueQuery, setVenueQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [remindedEvents, setRemindedEvents] = useState(new Set());
  const [currentlyPlayingEventId, setCurrentlyPlayingEventId] = useState(null);
  
  const hasInitializedRef = useRef(false);

  const loadEvents = useCallback(async (venue = '', page = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      const { events: newEvents, hasMore: moreAvailable } = await fetchEvents({
        venue,
        page,
        pageSize: DEFAULT_PAGE_SIZE,
      });

      if (append) {
        setEvents((prev) => {
          const updated = [...prev, ...newEvents];
          return updated;
        });
      } else {
        setEvents(newEvents);
      }

      setHasMore(moreAvailable);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading events:', error);
      const message = getErrorMessage(error);
      showErrorMessage(message, 'Failed to Load Events');
      setLoading(false);
      setLoadingMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      
      const loadInitialEvents = async () => {
        try {
          setLoading(true);
          
          const { events: newEvents, hasMore: moreAvailable } = await fetchEvents({
            venue: '',
            page: 1,
            pageSize: DEFAULT_PAGE_SIZE,
          });

          setEvents(newEvents);
          setHasMore(moreAvailable);
          setCurrentPage(1);
          
        } catch (error) {
          console.error('Error loading initial events:', error);
          const message = getErrorMessage(error);
          showErrorMessage(message, 'Failed to Load Events');
        } finally {
          setLoading(false);
        }
      };
      
      loadInitialEvents();
    }
  }, []);

  const handleVenueSearch = useCallback((venue) => {
    setVenueQuery(venue);
    setCurrentPage(1);
    loadEvents(venue, 1, false);
  }, [loadEvents]);

  const handleLoadMore = () => {
    if (loadingMore) return;
    loadEvents(venueQuery, currentPage + 1, true);
  };

  const handleReminderClick = (eventId) => {
    setRemindedEvents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const handleMoreInfoClick = (event) => {
    setSelectedEvent(event);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setSelectedEvent(null);
    }, 300);
  };

  const handlePlayAudio = (event) => {
    if (currentlyPlayingEventId === event.id) {
      audioPlayer.stop();
      setCurrentlyPlayingEventId(null);
      return;
    }

    if (audioPlayer.isPlaying()) {
      audioPlayer.stop();
    }

    const spotifyTrack = event.spotify_tracks?.[0];
    // Note: Apple Music preview URLs blocked by CORS - would require backend proxy
    // const appleMusicTrack = event.apple_music_tracks?.[0];
    // const track = spotifyTrack || appleMusicTrack;
    const previewUrl = spotifyTrack?.preview_url;
    
    if (previewUrl) {
      audioPlayer.play(previewUrl, (error) => {
        setCurrentlyPlayingEventId(null);
      });
      setCurrentlyPlayingEventId(event.id);
    }
  };

  return (
    <div className="events-page">
      <Header onVenueSearch={handleVenueSearch} />
      
      <main className="events-page__main">
        <div className="events-page__container">
          {loading ? (
            <LoadingState />
          ) : events.length === 0 ? (
            <NoResultsState venue={venueQuery} />
          ) : (
            <>
              <EventGrid>
                {events.map((event) => (
                  <li key={event.id}>
                    <EventCard
                      event={event}
                      isReminded={remindedEvents.has(event.id)}
                      isPlaying={currentlyPlayingEventId === event.id}
                      onReminderClick={handleReminderClick}
                      onMoreInfoClick={handleMoreInfoClick}
                      onPlayAudio={handlePlayAudio}
                    />
                  </li>
                ))}
              </EventGrid>

              {hasMore && (
                <div className="events-page__load-more">
                  <Button
                    variant="primary"
                    onClick={handleLoadMore}
                    isLoading={loadingMore}
                    ariaLabel="Load more events"
                    className="button--large"
                  >
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <EventDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        event={selectedEvent}
        isReminded={selectedEvent ? remindedEvents.has(selectedEvent.id) : false}
        isPlaying={selectedEvent ? currentlyPlayingEventId === selectedEvent.id : false}
        onReminderClick={handleReminderClick}
        onPlayAudio={handlePlayAudio}
      />
    </div>
  );
};

export default EventsPage;
