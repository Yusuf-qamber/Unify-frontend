import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import * as assignmentService from "../../services/assignmentService.js";
import './AssignmentDetails.scss'
const AssignmentDetails = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const data = await assignmentService.show(assignmentId);
        setAssignment(data);
      } catch (err) {
        console.error("Failed to fetch assignment:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [assignmentId]);

  const handleDelete = async () => {
  if (window.confirm("Are you sure you want to delete this assignment?")) {
    try {
      const res = await assignmentService.remove(assignmentId); // <-- use 'remove'
      console.log("Delete response:", res);
      navigate("/assignments");
    } catch (err) {
      console.error("Failed to delete assignment:", err);
    }
  }
};


  if (loading) return <p>Loading...</p>;
  if (!assignment) return <p>Assignment not found.</p>;

  return (
   <main className="assignment-details-container">
  <h1>{assignment.title}</h1>

  <div className="badges">
    <span className={`status ${
      assignment.completed ? "completed" :
      new Date(assignment.dueDate) < new Date() ? "overdue" : "pending"
    }`}>
      {assignment.completed ? "Completed" :
      new Date(assignment.dueDate) < new Date() ? "Overdue" : "Pending"}
    </span>

    <span className={`priority ${assignment.priority.toLowerCase()}`}>
      {assignment.priority} Priority
    </span>
  </div>

  <p><strong>Description:</strong> {assignment.description || "N/A"}</p>
  <p><strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</p>

  <div className="actions">
    <Link to={`/assignments/${assignmentId}/edit`}>Edit</Link>
    <button onClick={handleDelete}>Delete</button>
  </div>

  <Link to="/assignments" className="back-link">Back to Assignments</Link>
</main>

  );
};

export default AssignmentDetails;
