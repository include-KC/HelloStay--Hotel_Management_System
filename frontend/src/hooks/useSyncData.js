import { useState, useEffect } from 'react';
import { getRooms, getBookings, getGuests, SYNC_EVENT } from '../utils/dataStore';

export function useSyncData() {
  const [rooms, setRooms] = useState(getRooms());
  const [bookings, setBookings] = useState(getBookings());
  const [guests, setGuests] = useState(getGuests());

  useEffect(() => {
    const handleSync = () => {
      setRooms(getRooms());
      setBookings(getBookings());
      setGuests(getGuests());
    };

    window.addEventListener(SYNC_EVENT, handleSync);
    
    // Also sync if another tab changes local storage
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener(SYNC_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  return { rooms, bookings, guests };
}
