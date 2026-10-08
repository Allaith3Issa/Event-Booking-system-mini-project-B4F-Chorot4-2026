import {Routes, Route, Link} from "react-router-dom";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import BookingFormPage from "./pages/BookingFormPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import ManageBookingPage from "./pages/ManageBookingPage";

export default function App() {
  return (
    <>
      <nav>
        <Link to="/">Events</Link> |{" "}
        <Link to="/manage">Find / Manage Booking</Link>
      </nav>
      <Routes>
        <Route path="/" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/events/:id/book" element={<BookingFormPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/manage" element={<ManageBookingPage />} />
      </Routes>
    </>
  );
}
