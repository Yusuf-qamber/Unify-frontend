import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as assignmentService from "../../services/assignmentService.js";
import './AssignmentForm.scss'
const AssignmentForm = () => {
  const { assignmentId } = useParams(); // if editing
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    completed: false
  });

  const [loading, setLoading] = useState(false);

  // If editing, fetch assignment data
  useEffect(() => {
    if (assignmentId) {
      const fetchAssignment = async () => {
        setLoading(true);
        try {
          const data = await assignmentService.show(assignmentId);
          setAssignment({
            ...data,
            dueDate: data.dueDate.slice(0, 10) // format for input[type=date]
          });
        } catch (err) {
          console.error("Failed to fetch assignment:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchAssignment();
    }
  }, [assignmentId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAssignment(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (assignmentId) {
        await assignmentService.update(assignmentId, assignment);
      } else {
        await assignmentService.create(assignment);
      }
      navigate("/assignments");
    } catch (err) {
      console.error("Failed to save assignment:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main className="assignment-form-container">
      <h1>{assignmentId ? "Edit Assignment" : "New Assignment"}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={assignment.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={assignment.description}
            onChange={handleChange}
          />
        </label>

        <label>
          Due Date:
          <input
            type="date"
            name="dueDate"
            value={assignment.dueDate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Priority:
          <select
            name="priority"
            value={assignment.priority}
            onChange={handleChange}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>

        <label>
          Completed:
          <input
            type="checkbox"
            name="completed"
            checked={assignment.completed}
            onChange={handleChange}
          />
        </label>

        <button type="submit">
          {assignmentId ? "Update" : "Create"} Assignment
        </button>
      </form>
    </main>
  );
};

export default AssignmentForm;
