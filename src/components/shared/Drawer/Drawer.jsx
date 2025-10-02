import { useEffect, useRef, useState, useCallback } from 'react';
import './Drawer.scss';

const Drawer = ({ 
  isOpen, 
  onClose, 
  children, 
  title 
}) => {
  const drawerRef = useRef(null);
  const previousActiveElement = useRef(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }, [isClosing, onClose]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    const handleTabKey = (e) => {
      if (e.key !== 'Tab' || !isOpen) return;

      const drawer = drawerRef.current;
      if (!drawer) return;

      const focusableElements = drawer.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleTabKey);
      document.body.style.overflow = 'hidden';
      
      setTimeout(() => {
        if (drawerRef.current) {
          const firstFocusable = drawerRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (firstFocusable) {
            firstFocusable.focus();
          }
        }
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTabKey);
      document.body.style.overflow = 'unset';
      
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, handleClose]);

  if (!isOpen && !isClosing) return null;

  return (
    <div 
      className={`drawer ${isClosing ? 'drawer--closing' : ''}`} 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="drawer-title"
      style={{ pointerEvents: isClosing ? 'none' : 'auto' }}
    >
      <div 
        className="drawer__overlay"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="drawer__panel" ref={drawerRef}>
        <div className="drawer__header">
          {title && <h2 id="drawer-title" className="sr-only">{title}</h2>}

          <button
            className="drawer__close"
            onClick={handleClose}
            aria-label="Close drawer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </button>
        </div>

        <div className="drawer__content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Drawer;
