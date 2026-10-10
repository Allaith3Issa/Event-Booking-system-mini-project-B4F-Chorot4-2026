import {Routes, Route, Link} from "react-router-dom";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import BookingFormPage from "./pages/BookingFormPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import ManageBookingPage from "./pages/ManageBookingPage";
import Navbar from "./components/NavBar";
import WrongDoor from "./pages/WrongDoor";

export default function App() {
  return (
    <>
     
        <Navbar/>
      
      <Routes>
        <Route path="/" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/events/:id/book" element={<BookingFormPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/manage" element={<ManageBookingPage />} />
        <Route path="/*" element={<WrongDoor />} />
      </Routes>
    </>
  );
}
