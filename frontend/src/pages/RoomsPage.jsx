import { useEffect, useState } from "react";

import Card from "../components/ui/Card.jsx";
import Loading from "../components/ui/Loading.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import { getRooms } from "../services/roomService.js";

function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isComponentActive = true;

    async function loadRooms() {
      try {
        setIsLoading(true);
        setError("");

        const roomData = await getRooms();

        if (isComponentActive) {
          setRooms(roomData);
        }
      } catch (err) {
        if (isComponentActive) {
          setError(err.message || "Unable to load rooms.");
        }
      } finally {
        if (isComponentActive) {
          setIsLoading(false);
        }
      }
    }

    loadRooms();

    return () => {
      isComponentActive = false;
    };
  }, []);

  return (
    <main className="rooms-page">
      <div className="rooms-header">
        <div>
          <h1 className="page-title">Rooms</h1>
          <p className="page-description">
            View all rooms currently registered in HelloStay.
          </p>
        </div>
      </div>

      {isLoading && <Loading message="Loading rooms..." />}

      {!isLoading && error && (
        <ErrorMessage message={error} />
      )}

      {!isLoading && !error && rooms.length === 0 && (
        <Card>
          <h2>No rooms found</h2>
          <p className="page-description">
            No rooms are available in the system yet. Room creation will be
            added in a later milestone.
          </p>
        </Card>
      )}

      {!isLoading && !error && rooms.length > 0 && (
        <div className="rooms-grid">
          {rooms.map((room) => (
            <Card key={room.id}>
              <div className="room-card-header">
                <div>
                  <h2 className="room-title">Room {room.room_number}</h2>
                  <p className="room-subtitle">
                    {room.room_type || "Room type not set"}
                  </p>
                </div>

                <span className="room-status">
                  {room.room_status}
                </span>
              </div>

              <dl className="room-details">
                <div>
                  <dt>Price per night</dt>
                  <dd>{room.price_per_night}</dd>
                </div>

                <div>
                  <dt>Max occupancy</dt>
                  <dd>{room.max_occupancy ?? "Not set"}</dd>
                </div>

                <div>
                  <dt>Facilities</dt>
                  <dd>{room.facilities || "No facilities listed"}</dd>
                </div>
              </dl>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}

export default RoomsPage;