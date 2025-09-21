import { useState } from "react";
import "./CommentForm.scss";

const CommentForm = ({ handleAddComment, user }) => {
  const [formData, setFormData] = useState({ content: "" });
  const [error, setError] = useState("");

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!user) {
      setError("You must be logged in to comment.");
      return;
    }
    handleAddComment(formData);
    setFormData({ content: "" });
    setError("");
  };

  return (
    <div className="comment-form">
      <form onSubmit={handleSubmit}>
        <textarea
          required
          name="content"
          id="text-input"
          placeholder="Add a comment..."
          value={formData.content}
          onChange={handleChange}
          disabled={!user}
        />
        <button type="submit" disabled={!user}>
          Post
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default CommentForm;
