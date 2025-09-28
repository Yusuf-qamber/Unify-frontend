import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import * as assignmentService from "../../services/assignmentService.js";
import './AssignmentList.scss';

const AssignmentList = ({ user }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await assignmentService.index();
        setAssignments(data);
      } catch (err) {
        console.error("Failed to fetch assignments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  if (loading) return <p>Loading assignments...</p>;

  const priorities = ["High", "Medium", "Low"];

return (
  <main className="assignment-list-container">
    <h1>Assignments</h1>

    {user && (
      <div className="add-assignment-button">
        <Link to="/assignments/new">
          <button>+ Add Assignment</button>
        </Link>
      </div>
    )}

    {!assignments.length ? (
      <p>No assignments found</p>
    ) : (
      priorities.map((priority) => {
        const filtered = assignments.filter(a => a.priority === priority);
        if (!filtered.length) return null;

        return (
          <section key={priority} className={`priority-section ${priority.toLowerCase()}`}>
            <h2>{priority} Priority</h2>
            <ul>
              {filtered.map((assignment) => {
                const now = new Date();
                const due = new Date(assignment.dueDate);
                let statusClass = "pending";
                let statusText = "Pending";

                if (assignment.completed) {
                  statusClass = "completed";
                  statusText = "Completed";
                } else if (due < now) {
                  statusClass = "overdue";
                  statusText = "Overdue";
                }

                return (
                  <li key={assignment._id} className="assignment-card">
                    <span className={`status ${statusClass}`}>{statusText}</span>
                    <Link to={`/assignments/${assignment._id}`}>
                      <h3>{assignment.title}</h3>
                      <span>Due: {due.toLocaleDateString()}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })
    )}
  </main>
);

};

export default AssignmentList;
