
import { Link } from "react-router-dom";

export default function WrongDoor() {
  return (
    <div className="wrong-door">
      <div className="wrong-door__card">
        <span className="wrong-door__code">404</span>

        <h1 className="wrong-door__title">Wrong door </h1>

        <p className="wrong-door__message">
          This page doesn't exist — or the event you're looking for has already
          left the building.
        </p>

        <div className="wrong-door__actions">
          <Link
            to="/events"
            className="wrong-door__btn wrong-door__btn--primary"
          >
            Back to Events
          </Link>

          <Link to="/manage" className="wrong-door__btn">
            Find my booking
          </Link>
        </div>
      </div>
    </div>
  );
}