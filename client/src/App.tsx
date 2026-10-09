import {Routes, Route} from "react-router-dom";
import Navbar from "./components/NavBar";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import BookingFormPage from "./pages/BookingFormPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import ManageBookingPage from "./pages/ManageBookingPage";

export default function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/events/:id/book" element={<BookingFormPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/manage" element={<ManageBookingPage />} />
        </Routes>
      </main>
    </div>
  );
}
