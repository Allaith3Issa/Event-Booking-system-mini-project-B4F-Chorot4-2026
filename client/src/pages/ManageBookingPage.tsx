import {useState} from "react";
import ErrorMessage from "../components/ErrorMessage";
import LoadingMessage from "../components/LoadingMessage";
import BookingSearchForm from "../components/BookingSearchForm";
import BookingCard from "../components/BookingCard";
import {cancelBooking, findBooking} from "../api/manageApi";
import type {Booking} from "../types";

function ManageBookingPage() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  async function handleSearch() {
    setBooking(null);
    setError("");
    setMessage("");
    setIsSearching(true);

    try {
      const result = await findBooking(phone.trim(), code.trim());
      setBooking(result);
    } catch (searchError) {
      setError(
        searchError instanceof Error
          ? searchError.message
          : "Unable to find this booking.",
      );
    } finally {
      setIsSearching(false);
    }
  }

  async function handleCancel() {
    if (!booking) {
      return;
    }

    if (
      !window.confirm(
        `Cancel this booking and return ${booking.places} places?`,
      )
    ) {
      return;
    }

    setError("");
    setMessage("");
    setIsCancelling(true);

    try {
      const cancelled = await cancelBooking(booking.id, booking.customerPhone);
      setBooking(cancelled);
      setMessage(
        `Booking cancelled. ${cancelled.places} place(s) returned to the event.`,
      );
    } catch (cancelError) {
      setError(
        cancelError instanceof Error
          ? cancelError.message
          : "Unable to cancel this booking.",
      );
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <section className="manage-booking">
      <header className="page-heading">
        <h1>Find or manage a booking</h1>
        <p>Enter the phone number and booking code used when you booked.</p>
      </header>

      <BookingSearchForm
        phone={phone}
        code={code}
        onPhoneChange={setPhone}
        onCodeChange={setCode}
        onSubmit={handleSearch}
        isSearching={isSearching}
      />

      {isSearching && <LoadingMessage />}
      {error !== "" && <ErrorMessage message={error} />}
      {message !== "" && (
        <p className="success-message" role="status">
          {message}
        </p>
      )}

      {booking && (
        <BookingCard
          booking={booking}
          isCancelling={isCancelling}
          onCancel={handleCancel}
        />
      )}
    </section>
  );
}

export default ManageBookingPage;
