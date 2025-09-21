import { Link, useParams, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import * as eventServics from "../../services/eventServics.js";
import MapBox from "../MapBox/MapBox.jsx";
import "./EventList.scss";

const validColleges = ["it", "business", "science", "law", "engineering", "art"];

const EventList = (props) => {
  const { college } = useParams();
  if (!validColleges.includes(college)) return <Navigate to="/" replace />;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventServics.index(college);
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [college]);

  if (loading) return <p>Loading...</p>;

  return (
<main className="event-list-container">
        <h1>{college === "it" ? college.toLocaleUpperCase() : college} Events</h1>

  {props.user && (
    <div className="add-event">
      <Link to={`/${college}/events/new`}>Add an Event</Link>
    </div>
  )}

  {!events.length ? (
    <p>No events found in {college}</p>
  ) : (
    <div className="event-window">
      <div className="event-grid">
        {events.map((event) => (
          <div key={event._id} className="event-card-window">
            <h2>{event.title}</h2>
            <span>
              {event.owner?.username} <hr /> {new Date(event.createdAt).toLocaleDateString()}
            </span>

            <div className="event-map">
              <MapBox
                coordinates={event.coordinates || { lat: 26.2235, lng: 50.5876 }}
                readOnly={true}
                onLocationChange={() => {}}
              />
            </div>

            <Link to={`/${college}/events/${event._id}`} className="details-link">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  )}
</main>

  );
};

export default EventList;
