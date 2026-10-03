import {
  createContext,
  useContext,
  useState,
} from 'react';

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [trip, setTrip] = useState({
    state: '',
    city: '',
    places: [],
    days: 0,
  });

  return (
    <TripContext.Provider
      value={{
        trip,
        setTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  return useContext(TripContext);
}