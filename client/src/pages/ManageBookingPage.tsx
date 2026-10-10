import {useState} from "react";
import type {FormEvent} from "react";
import ManageBooking from "../components/ManageBooking";
import {cancelBooking, findBooking} from "../api/manageApi";
import type {Booking} from "../types";

export default function ManageBookingPage() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
          : "Unable to find this booking",
      );
    } finally {
      setIsSearching(false);
    }
  }

  async function handleCancel() {
    if (
      !booking ||
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
      const cancelledBooking = await cancelBooking(booking.id, phone.trim());
      setBooking(cancelledBooking);
      setMessage(
        `Booking cancelled. ${cancelledBooking.places} place${cancelledBooking.places === 1 ? "" : "s"} returned to the event.`,
      );
    } catch (cancelError) {
      setError(
        cancelError instanceof Error
          ? cancelError.message
          : "Unable to cancel this booking",
      );
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <ManageBooking
      booking={booking}
      code={code}
      error={error}
      isCancelling={isCancelling}
      isSearching={isSearching}
      message={message}
      onCancel={handleCancel}
      onCodeChange={setCode}
      onPhoneChange={setPhone}
      onSearch={handleSearch}
      phone={phone}
    />
  );
}
