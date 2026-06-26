export const SYNC_EVENT = 'helloStay_sync';

export function triggerSync() {
  window.dispatchEvent(new Event(SYNC_EVENT));
}

export function getMigrationFlag() {
  try {
    return localStorage.getItem('helloStay_migration_v1_complete') === 'true';
  } catch {
    return false;
  }
}

export function setMigrationFlag() {
  localStorage.setItem('helloStay_migration_v1_complete', 'true');
}

// ---- ROOMS ----
export function getRooms() {
  try { return JSON.parse(localStorage.getItem('helloStay_rooms') || '[]'); }
  catch { return []; }
}

export function saveRooms(rooms, silent = false) {
  localStorage.setItem('helloStay_rooms', JSON.stringify(rooms));
  if (!silent) triggerSync();
}

// ---- GUESTS ----
export function getGuests() {
  try { return JSON.parse(localStorage.getItem('helloStay_guests') || '[]'); }
  catch { return []; }
}

export function saveGuests(guests, silent = false) {
  localStorage.setItem('helloStay_guests', JSON.stringify(guests));
  if (!silent) triggerSync();
}

// ---- BOOKINGS ----
export function getBookings() {
  try { return JSON.parse(localStorage.getItem('helloStay_bookings') || '[]'); }
  catch { return []; }
}

export function saveBookings(bookings, silent = false) {
  localStorage.setItem('helloStay_bookings', JSON.stringify(bookings));
  if (!silent) triggerSync();
}

// ---- UNIFIED ACTIONS ----
export function createBookingWithGuest(bookingData, guestData, isNewGuest) {
  const guests = getGuests();
  let guestId = guestData.id;

  if (isNewGuest) {
    guestId = Date.now().toString() + Math.random().toString(36).substring(7);
    const newGuest = {
      ...guestData,
      id: guestId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    guests.push(newGuest);
    saveGuests(guests, true);
  } else {
    // If it's an existing guest, update their details if changed
    const index = guests.findIndex(g => g.id === guestId);
    if (index !== -1) {
      guests[index] = { ...guests[index], ...guestData, updatedAt: new Date().toISOString() };
      saveGuests(guests, true);
    }
  }

  const newBooking = {
    ...bookingData,
    id: Date.now().toString(),
    guestId,
    guestName: guestData.name,
    guestPhone: guestData.phone,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const bookings = getBookings();
  bookings.push(newBooking);
  saveBookings(bookings, true);

  // Update room status
  const rooms = getRooms();
  const updatedRooms = rooms.map(r => 
    r.id === newBooking.roomId ? { ...r, roomStatus: 'Reserved' } : r
  );
  saveRooms(updatedRooms, false); // Trigger sync here
}

export function updateBookingStatus(bookingId, newStatus, paymentDetails = null) {
  const bookings = getBookings();
  const bookingIndex = bookings.findIndex(b => b.id === bookingId);
  if (bookingIndex === -1) return;

  const booking = bookings[bookingIndex];
  const now = new Date().toISOString();

  let updatedBooking = { ...booking, status: newStatus, updatedAt: now };

  if (newStatus === 'Checked In') updatedBooking.actualCheckIn = now;
  if (newStatus === 'Checked Out') {
    updatedBooking.actualCheckOut = now;
    if (paymentDetails) {
      updatedBooking.totalAmount = paymentDetails.totalAmount;
      updatedBooking.amountPaid = paymentDetails.amountPaid;
      updatedBooking.paymentStatus = paymentDetails.amountPaid >= paymentDetails.totalAmount ? 'Paid' : (paymentDetails.amountPaid > 0 ? 'Partial' : 'Pending');
      updatedBooking.extraCharge = paymentDetails.extraCharge;
    }
  }

  bookings[bookingIndex] = updatedBooking;
  saveBookings(bookings, true);

  // Sync Room
  const rooms = getRooms();
  let newRoomStatus = null;
  if (newStatus === 'Checked In') newRoomStatus = 'Occupied';
  else if (newStatus === 'Checked Out') newRoomStatus = 'Cleaning';
  else if (newStatus === 'Cancelled') {
    // Check if room has other active bookings
    const hasOtherActive = bookings.some(b => b.roomId === booking.roomId && b.id !== bookingId && b.status !== 'Cancelled' && b.status !== 'Checked Out');
    if (!hasOtherActive) newRoomStatus = 'Available';
  }

  if (newRoomStatus) {
    const updatedRooms = rooms.map(r => {
      if (r.id === booking.roomId) {
        return { ...r, roomStatus: newRoomStatus, statusUntil: undefined };
      }
      return r;
    });
    saveRooms(updatedRooms, false);
  } else {
    triggerSync();
  }
}

export function deleteBooking(bookingId) {
  const bookings = getBookings();
  const booking = bookings.find(b => b.id === bookingId);
  if (!booking) return;

  const filtered = bookings.filter(b => b.id !== bookingId);
  saveBookings(filtered, true);

  // Check room status
  if (booking.status !== 'Checked Out' && booking.status !== 'Cancelled') {
    const hasOtherActive = filtered.some(b =>
      b.roomId === booking.roomId &&
      b.status !== 'Cancelled' &&
      b.status !== 'Checked Out'
    );
    if (!hasOtherActive) {
      const rooms = getRooms();
      const updatedRooms = rooms.map(r => r.id === booking.roomId ? { ...r, roomStatus: 'Available' } : r);
      saveRooms(updatedRooms, false);
      return;
    }
  }
  triggerSync();
}

export function checkTimeBoundStatuses() {
  const rooms = getRooms();
  let changed = false;
  const now = new Date();

  const updatedRooms = rooms.map(r => {
    if (r.statusUntil) {
      const untilDate = new Date(r.statusUntil);
      if (now >= untilDate) {
        changed = true;
        return { ...r, roomStatus: 'Available', statusUntil: undefined };
      }
    }
    return r;
  });

  if (changed) {
    saveRooms(updatedRooms);
  }
}

export function deleteRoom(roomId) {
  const bookings = getBookings();
  const hasActiveBooking = bookings.some(b =>
    b.roomId === roomId &&
    ['Reserved', 'Checked In'].includes(b.status)
  );
  if (hasActiveBooking) {
    throw new Error('Cannot delete room: active or upcoming bookings exist');
  }

  const rooms = getRooms().filter(r => r.id !== roomId);
  saveRooms(rooms);
  triggerSync();
}

export function getGuestById(guestId) {
  return getGuests().find(g => g.id === guestId);
}

export function migrateLegacyBookings() {
  if (getMigrationFlag()) return { linked: 0, skipped: false };

  const bookings = getBookings();
  const guests = getGuests();
  let linked = 0;

  bookings.forEach(b => {
    if (!b.guestId && b.guestName && b.guestPhone) {
      const match = guests.find(g =>
        g.name.toLowerCase() === b.guestName.toLowerCase() &&
        g.phone === b.guestPhone
      );
      if (match) {
        b.guestId = match.id;
        linked++;
      }
    }
  });

  if (linked > 0) {
    saveBookings(bookings);
  }

  setMigrationFlag();
  return { linked, skipped: false };
}

export function getGuestActivity(guestId) {
  const bookings = getBookings().filter(b => b.guestId === guestId);
  return { bookings };
}

export function autoSetOccupancyFromRoomType(roomType) {
  if (!roomType) return null;
  const type = roomType.toLowerCase();
  if (type.includes('single')) return 1;
  if (type.includes('double') || type.includes('twin')) return 2;
  if (type.includes('triple')) return 3;
  if (type.includes('quad')) return 4;
  if (type.includes('suite') || type.includes('family') || type.includes('deluxe')) return 4;
  return null;
}
