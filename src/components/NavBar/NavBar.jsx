import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState } from "react";
import "./NavBar.scss";

const NavBar = ({ user, handleSignOut }) => {
  const { college } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to="/">Unify</Link>
      </div>

    
      <button
        className="navbar__toggle"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      <ul className={`navbar__menu ${menuOpen ? "show" : ""}`}>
        <li><Link to={user ? "/schedule" : "/sign-in"}>My Schedule</Link></li>
<li><Link to={user ? "/assignments" : "/sign-in"}>Assignments</Link></li>
<li><Link to={user ? "/gpa" : "/sign-in"}>GPA Calculator</Link></li>
<li><Link to={user ? "/chat" : "/sign-in"}>Chat</Link></li>

<li className="navbar__welcome">
  <Link to={user ? "/profile" : "/sign-in"}>
    Hi, {user ? user.username : "Guest"}
  </Link>
</li>
{!user&&(
  <>
  <li><Link to="/sign-up">Sign Up</Link></li>
<li><Link to="/sign-in">Sign In</Link></li>
</>
)}
<li><Link to="/">Home</Link></li>


{user && (
  <li>
    <Link to="/" onClick={handleSignOut}>Sign Out</Link>
  </li>
)}

      </ul>
    </nav>
  );
};

export default NavBar;
