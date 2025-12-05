import { Link, Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./College.scss";

const validColleges = ["it", "business", "science", "law", "engineering", "art"];

const College = ({user}) => {
  const { college } = useParams();

  if (!validColleges.includes(college)) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="college-page">
      <h1 className="college-title">{college.toUpperCase()}</h1>

      <section className="college-grid">
        <Link to={`/${college}/notes`} className="college-card">
          <div className="college-card__content">
            <h2>📘 Notes</h2>
            <p>Browse, upload, and share study notes with peers.</p>
          </div>
        </Link>

        <Link to={`/${college}/events`} className="college-card">
          <div className="college-card__content">
            <h2>📅 Events</h2>
            <p>Stay updated with upcoming college events.</p>
          </div>
        </Link>
    {user ? (
  <Link to={`/${college}/chat`} className="college-card">
    <div className="college-card__content">
      <h2>💬 Chat</h2>
      <p>Join live chat with {college} students.</p>
    </div>
  </Link>
) : (
  <Link to="/sign-in" className="college-card">
    <div className="college-card__content">
      <h2>💬 Chat</h2>
      <p>You must sign in to access the chat.</p>
    </div>
  </Link>
)}


      </section>
    </main>
  );
};

export default College;
