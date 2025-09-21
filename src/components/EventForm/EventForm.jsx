import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as eventServices from "../../services/eventServics";
import MapBox from "../MapBox/MapBox.jsx";
import 'mapbox-gl/dist/mapbox-gl.css';
import './EventForm.scss';
const EventForm = (props) => {
  const navigate = useNavigate();
  const { college, eventId } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "", 
    coordinates: null, 
  });

  useEffect(() => {
    const fetchEvent = async () => {
      const data = await eventServices.showEvent(college, eventId);
      setFormData({
        title: data.title,
        description: data.description,
        location: `${data.coordinates.lat},${data.coordinates.lng}`,
        coordinates: data.coordinates,
      });
    };
    if (eventId) fetchEvent();
  }, [college, eventId]);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const payload = {
      title: formData.title,
      description: formData.description,
      coordinates: formData.coordinates,
      location: `${formData.coordinates.lat},${formData.coordinates.lng}`, 
    };

    if (eventId) {
      await props.handleUpdateEvent(college, eventId, payload);
      navigate(`/${college}/events/${eventId}`);
    } else {
      await eventServices.createEvent(payload, college);
      navigate(`/${college}/events`);
    }
  };

  return (
<main className="event-form-container">
  <form onSubmit={handleSubmit}>
    <h1>{eventId ? "Edit Event" : "Add an Event"}</h1>

    <label htmlFor="title">Title</label>
    <input name="title" value={formData.title} onChange={handleChange} required />

    <label htmlFor="description">Description</label>
    <textarea name="description" value={formData.description} onChange={handleChange} required />

    <label htmlFor="location">Location coordinate</label>
    <input name="location" value={formData.location} disabled />

    <div className="mapbox-container">
      <MapBox
        coordinates={formData.coordinates}
        onLocationChange={(coords) =>
          setFormData({
            ...formData,
            coordinates: coords,
            location: `${coords.lat.toFixed(6)},${coords.lng.toFixed(6)}`,
          })
        }
      />
    </div>

    <button type="submit">SUBMIT</button>
  </form>
</main>

  );
};

export default EventForm;
