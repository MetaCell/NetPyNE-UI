import { useEffect, useRef } from 'react';

/**
 * Interval hook taken from: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 *
 * @param callback
 * @param delay
 */
const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick () {
      savedCallback.current();
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export default useInterval;
