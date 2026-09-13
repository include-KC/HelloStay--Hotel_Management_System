import { useEffect, useState } from "react";

import Card from "../components/ui/Card.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";

import {
  createGuestStay,
  getGuestStays,
  updateGuestStay,
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

  const [editingGuestStayId, setEditingGuestStayId] = useState(null);

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

  async function handleSubmitGuestStay(event) {
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

      if (editingGuestStayId === null) {
        await createGuestStay(guestStayData);
      } else {
        await updateGuestStay(editingGuestStayId, guestStayData);
      }

      const guestStaysData = await loadGuestStays();

      setGuestStays(guestStaysData);

      setSelectedGuestId("");
      setSelectedStayId("");
      setIsPrimaryGuest(false);
      setEditingGuestStayId(null);

      setSuccessMessage(
        editingGuestStayId === null
          ? "GuestStay created successfully."
          : "GuestStay updated successfully.",
      );
    } catch (requestError) {
      setSubmitError(
        requestError.message ||
          "Unable to create guest stay. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEditGuestStay(guestStay) {
    setEditingGuestStayId(guestStay.id);

    setSelectedGuestId(String(guestStay.guest_id));
    setSelectedStayId(String(guestStay.stay_id));
    setIsPrimaryGuest(guestStay.is_primary_guest);

    setSubmitError("");
    setSuccessMessage("");
  }

  function handleCancelEdit() {
    setEditingGuestStayId(null);

    setSelectedGuestId("");
    setSelectedStayId("");
    setIsPrimaryGuest(false);

    setSubmitError("");
    setSuccessMessage("");
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
        <div className="form-section-header">
          <h2>
            {editingGuestStayId === null
              ? "Create GuestStay"
              : "Edit GuestStay"}
          </h2>

          <p>
            {editingGuestStayId === null
              ? "Assign a guest to a stay."
              : "Update the guest and stay relationship."}
          </p>
        </div>


        <form className="guest-stay-form" onSubmit={handleSubmitGuestStay}>
          <div className="form-field">
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

          <div className="form-field">
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

          <div className="guest-stay-primary-checkbox">
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
            <div className="alert alert-success" role="status">
              {successMessage}
            </div>
          )}

          {editingGuestStayId !== null && (
            <button
              className="button button-secondary"
              type="button"
              onClick={handleCancelEdit}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}

          <button className="button button-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting 
            ? editingGuestStayId === null
              ? "Creating GuestStay..."
              : "Updating GuestStay..."
            : editingGuestStayId === null
              ? "Create GuestStay"
              : "Update GuestStay"}
          </button>
        </form>
      </Card> 
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
                  <th scope="col">Actions</th>
                </tr>
              </thead>

              <tbody>
                {guestStays.map((guestStay) => (
                  <tr key={guestStay.id}>
                    <td>{guestStay.id}</td>
                    <td>{guestStay.guest_id}</td>
                    <td>{guestStay.stay_id}</td>
                    <td>{guestStay.is_primary_guest ? "Yes" : "No"}</td>

                    <td>
                      <button
                        type="button"
                        className="button button-secondary"
                        onClick={() => handleEditGuestStay(guestStay)}
                      >
                        Edit
                      </button>
                    </td>
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
