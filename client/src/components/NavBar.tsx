import {NavLink} from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Event Booking</div>
      <div className="navbar-links">
        <NavLink
          to="/"
          className={({isActive}) =>
            isActive ? "nav-link active" : "nav-link"
          }
          end
        >
          Events
        </NavLink>
        <NavLink
          to="/manage"
          className={({isActive}) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Search & Manage booking
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;