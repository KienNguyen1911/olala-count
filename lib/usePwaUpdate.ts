import { useEffect, useState, useRef } from 'react';

interface PwaUpdateEvent {
  registration: ServiceWorkerRegistration;
  waiting: ServiceWorker;
}

export const usePwaUpdate = () => {
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registrationRef.current = registration;

        // Check for updates every hour
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      });

      // Listen for SW controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setNewVersionAvailable(false);
        // Optionally reload the page
        window.location.reload();
      });

      // Listen for install state change
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SKIP_WAITING') {
          setNewVersionAvailable(true);
        }
      });
    }

    return () => {
      if (registrationRef.current) {
        registrationRef.current.unregister();
      }
    };
  }, []);

  const skipWaiting = () => {
    if (registrationRef.current?.waiting) {
      registrationRef.current.waiting.postMessage({
        type: 'SKIP_WAITING',
      });
    }
  };

  return {
    newVersionAvailable,
    skipWaiting,
  };
};

export default usePwaUpdate;
