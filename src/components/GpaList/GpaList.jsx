import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import gpaService from "../../services/gpaService.js";
import "./GpaList.scss";

const GpaList = ({ user }) => {
  const [gpaRecords, setGpaRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cumulativeGpa, setCumulativeGpa] = useState(null);

  useEffect(() => {
    const fetchGpa = async () => {
      try {
        const data = await gpaService.index();
        setGpaRecords(data);

        // Calculate cumulative GPA
        if (data.length) {
          let totalPoints = 0;
          let totalCredits = 0;

          data.forEach(record => {
            record.courses.forEach(course => {
              const gradePoints = {
                "A": 4.0, "A-": 3.67, "B+": 3.33, "B": 3.0, "B-": 2.67,
                "C+": 2.33, "C": 2.0, "C-": 1.67, "D+": 1.33, "D": 1.0,
                "D-": 0.67, "F": 0
              };
              totalPoints += gradePoints[course.grade] * course.creditHours;
              totalCredits += course.creditHours;
            });
          });

          setCumulativeGpa(totalCredits > 0 ? totalPoints / totalCredits : 0);
        }

      } catch (err) {
        console.error("Failed to fetch GPA records:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGpa();
  }, []);

  if (loading) return <p className="loading-msg">Loading GPA records...</p>;
  // if (!gpaRecords.length) return <p className="no-gpa-msg">No GPA records found.</p>;

  return (
    <main className="gpa-list-container">
  <header className="gpa-list-header">
    <h1 className="gpa-list-title">GPA Records</h1>

    {cumulativeGpa !== null && gpaRecords.length > 0 && (
      <div className="cumulative-gpa">
        Cumulative GPA: <strong>{cumulativeGpa.toFixed(2)}</strong>
      </div>
    )}

    <div className="add-gpa-button">
      <Link to="/gpa/new">
        <button className="btn-add-gpa">➕ Add GPA</button>
      </Link>
    </div>
  </header>

  {loading ? (
    <p className="loading-msg">Loading GPA records...</p>
  ) : gpaRecords.length === 0 ? (
    <p className="no-gpa-msg">No GPA records found.</p>
  ) : (
    <ul className="gpa-list">
      {gpaRecords.map((record) => (
        <li key={record._id} className="gpa-card">
          <Link to={`/gpa/${record._id}`} className="gpa-card-link">
            <div className="gpa-header">
              <h2 className="semester-name">{record.semester}</h2>
              <span className="gpa-status">
                GPA: {record.semesterGpa?.toFixed(2) ?? "N/A"}
              </span>
            </div>
            <div className="gpa-footer">
              <span className="course-count">Courses: {record.courses.length}</span>
              <span className="created-date">
                Created: {new Date(record.createdAt).toLocaleDateString()}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )}
</main>

  );
};

export default GpaList;
