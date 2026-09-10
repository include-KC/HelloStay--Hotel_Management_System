import { useEffect, useState } from "react";

import Card from "../components/ui/Card.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import Loading from "../components/ui/Loading.jsx";

import {
  createGuestStay,
  getGuestStays,
} from "../services/guestStayService.js";
import { getGuests } from "../services/guestService.js";
import { getStays } from "../services/stayService.js";

async function loadGuestStays() {
  const guestStaysData = await getGuestStays();

  if (!Array.isArray(guestStaysData)) {
    throw new Error("Unexpected GuestStay data received from the backend.");
  }

  return guestStaysData;
}

function GuestStaysPage() {
  const [guestStays, setGuestStays] = useState([]);
  const [guests, setGuests] = useState([]);
  const [stays, setStays] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedGuestId, setSelectedGuestId] = useState("");
  const [selectedStayId, setSelectedStayId] = useState("");
  const [isPrimaryGuest, setIsPrimaryGuest] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let shouldIgnoreResult = false;

    async function loadGuestStayData() {
      try {
        const [guestStaysData, guestsData, staysData] = await Promise.all([
          getGuestStays(),
          getGuests(),
          getStays(),
        ]);

        if (!Array.isArray(guestStaysData)) {
          throw new Error(
            "Unexpected GuestStay data received from the backend.",
          );
        }

        if (!Array.isArray(guestsData)) {
          throw new Error("Unexpected Guest data received from the backend.");
        }

        if (!Array.isArray(staysData)) {
          throw new Error("Unexpected Stay data received from the backend.");
        }

        if (shouldIgnoreResult) {
          return;
        }

        setGuestStays(guestStaysData);
        setGuests(guestsData);
        setStays(staysData);
        setError("");
      } catch (requestError) {
        if (shouldIgnoreResult) {
          return;
        }

        setGuestStays([]);
        setGuests([]);
        setStays([]);
        setError(
          requestError.message ||
            "Unable to load guest stays. Please try again.",
        );
      } finally {
        if (!shouldIgnoreResult) {
          setIsLoading(false);
        }
      }
    }

    loadGuestStayData();

    return () => {
      shouldIgnoreResult = true;
    };
  }, []);

  async function handleCreateGuestStay(event) {
    event.preventDefault();

    setSubmitError("");
    setSuccessMessage("");

    if (!selectedGuestId) {
      setSubmitError("Please select a guest.");
      return;
    }

    if (!selectedStayId) {
      setSubmitError("Please select a stay.");
      return;
    }

    setIsSubmitting(true);

    try {
      const guestStayData = {
        guest_id: Number(selectedGuestId),
        stay_id: Number(selectedStayId),
        is_primary_guest: isPrimaryGuest,
      };

      await createGuestStay(guestStayData);

      const guestStaysData = await loadGuestStays();

      setGuestStays(guestStaysData);

      setSelectedGuestId("");
      setSelectedStayId("");
      setIsPrimaryGuest(false);

      setSuccessMessage("GuestStay created successfully.");
    } catch (requestError) {
      setSubmitError(
        requestError.message ||
          "Unable to create guest stay. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="dashboard-page">
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Guest Stays</h1>

          <p className="dashboard-page-description">
            View guest and stay relationships recorded in the HelloStay backend.
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleCreateGuestStay}>
          <div className="form-group">
            <label htmlFor="guest-select">Guest</label>

            <select
              id="guest-select"
              value={selectedGuestId}
              onChange={(event) => setSelectedGuestId(event.target.value)}
            >
              <option value="">Select a guest</option>

              {guests.map((guest) => (
                <option key={guest.id} value={guest.id}>
                  {guest.guest_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="stay-select">Stay</label>

            <select
              id="stay-select"
              value={selectedStayId}
              onChange={(event) => setSelectedStayId(event.target.value)}
            >
              <option value="">Select a stay</option>

              {stays.map((stay) => (
                <option key={stay.stay_id} value={stay.stay_id}>
                  Stay #{stay.stay_id} — Room #{stay.room_id} —{" "}
                  {stay.stay_status}
                </option>
              ))}
            </select>
          </div>

          <div className="form-checkbox">
            <label>
              <input
                type="checkbox"
                checked={isPrimaryGuest}
                onChange={(event) => setIsPrimaryGuest(event.target.checked)}
              />

              <span>Primary Guest</span>
            </label>
          </div>

          {submitError && <ErrorMessage message={submitError} />}

          {successMessage && (
            <div className="success-message" role="status">
              {successMessage}
            </div>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create GuestStay"}
          </button>
        </form>
      </Card>

      {isLoading && <Loading message="Loading guest stays..." />}

      {!isLoading && error && <ErrorMessage message={error} />}

      {!isLoading && !error && guestStays.length === 0 && (
        <Card>
          <div className="empty-state">
            <h2>No guest stays found</h2>

            <p>
              Guest and stay relationships will appear here after they are
              recorded.
            </p>
          </div>
        </Card>
      )}
      {!isLoading && !error && guestStays.length > 0 && (
        <Card>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">GuestStay ID</th>
                  <th scope="col">Guest ID</th>
                  <th scope="col">Stay ID</th>
                  <th scope="col">Primary Guest</th>
                </tr>
              </thead>

              <tbody>
                {guestStays.map((guestStay) => (
                  <tr key={guestStay.id}>
                    <td>{guestStay.id}</td>
                    <td>{guestStay.guest_id}</td>
                    <td>{guestStay.stay_id}</td>
                    <td>{guestStay.is_primary_guest ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </section>
  );
}

export default GuestStaysPage;
