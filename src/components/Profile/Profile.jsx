import { useEffect, useState } from "react";
import * as profileservice from "../../services/profileService";
import { confirm } from "material-ui-confirm";
import { useNavigate, Link } from "react-router-dom";
import "./Profile.scss";

const Profile = (props) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", picture: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileservice.getProfile();
        setProfile(data);
        setFormData({ username: data.username, picture: data.picture });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const update = await profileservice.updateProfile(formData);
      setProfile(update);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "picture" && files?.length > 0) {
      setFormData((prev) => ({ ...prev, picture: files[0] })); // file upload
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

const handleDelete = async () => {
  try {
    const { confirmed } = await confirm({
      title: "Are You Sure?",
      description: <span style={{ fontWeight: 'bold' }}>This account will be deleted permanently!</span>, // bold description
      confirmationText: "Delete",
      cancellationText: "Cancel",
      confirmationButtonProps: {
        style: { backgroundColor: '#e74c3c', color: '#fff' }, // red delete button
      },
      cancellationButtonProps: {
        style: { backgroundColor: '#ccc', color: '#333' }, // optional style for cancel
      },
      dialogProps: {
        PaperProps: { style: { borderRadius: '1rem', padding: '1rem' } }, // optional: make dialog rounded
      },
    });

    if (!confirmed) return;

    await profileservice.deleteAccount();
    localStorage.removeItem("token");
    props.onSignOut?.();
    navigate("/");
  } catch (err) {
    console.error("Error deleting account:", err);
  }
};

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!profile) return <p>No profile found</p>;

  return (
    <div className="profile-container">
      <h1>My Profile</h1>

      <div className="profile-header">
        <img
          src={profile.picture} // Cloudinary already gives full URL
          alt="Profile"
          className="profile-pic"
        />
        <div className="profile-info">
          <p>
            <strong>Username:</strong> {profile.username}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
        </div>
      </div>

      {editing ? (
        <div className="edit-form">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="New Username"
          />
          <input
            type="file"
            name="picture"
            accept="image/*"
            onChange={handleChange}
          />
          <div className="form-buttons">
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <button
          className="edit-profile-btn"
          onClick={() => setEditing(true)}
        >
          Edit Profile
        </button>
      )}

      <h3>My Notes</h3>
      {profile.myNotes?.length > 0 ? (
        <div className="note-grid">
          {profile.myNotes.map((note) => (
            <Link
              key={note._id}
              to={`/${note.college}/notes/${note._id}`}
              state={{ fromProfile: true }}
            >
              <div className="note-card">
                <h4>{note.title}</h4>
                <p>{note.description}</p>
                <span>
                  Posted on {new Date(note.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No notes yet.</p>
      )}

      <h3>My Events</h3>
      {profile.myEvents?.length > 0 ? (
        <div className="event-grid">
          {profile.myEvents.map((event) => (
            <Link
              key={event._id}
              to={`/${event.college}/events/${event._id}`}
              state={{ fromProfile: true }}
            >
              <div className="event-card-window">
                <h4>{event.title}</h4>
                <p>{event.description}</p>
                <span>
                  Posted on {new Date(event.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No events yet.</p>
      )}

      <button className="delete-button" onClick={handleDelete}>
        Delete Account
      </button>
    </div>
  );
};

export default Profile;
