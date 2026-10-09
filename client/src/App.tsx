import {Routes, Route,} from "react-router-dom";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import BookingFormPage from "./pages/BookingFormPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import ManageBookingPage from "./pages/ManageBookingPage";
import NavBar from "./components/NavBar";

export default function App() {
  return (
    <>
      <nav>
        <NavBar />
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
