import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import gpaService from "../../services/gpaService.js";
import "./GpaDetails.scss";

const GpaDetails = () => {
  const { gpaId } = useParams();
  const navigate = useNavigate();
  const [gpa, setGpa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGpa = async () => {
      try {
        const data = await gpaService.show(gpaId);
        setGpa(data);
      } catch (err) {
        console.error("Failed to fetch GPA record:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGpa();
  }, [gpaId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this GPA record?")) return;
    try {
      await gpaService.remove(gpaId);
      navigate("/gpa");
    } catch (err) {
      console.error("Failed to delete GPA record:", err);
    }
  };

  if (loading) return <p className="loading-msg">Loading GPA...</p>;
  if (!gpa) return <p className="not-found-msg">GPA not found.</p>;

  return (
    <main className="gpa-details-container">
      <header className="gpa-details-header">
        <div className="header-content">
          <h1 className="semester-title">{gpa.semester}</h1>
          <div className="gpa-display">
            <span className="gpa-label">Semester GPA</span>
            <span className="gpa-value">{gpa.semesterGpa?.toFixed(2)}</span>
          </div>
        </div>
      </header>

      <section className="courses-section">
        <h2 className="courses-title">Courses</h2>
        <div className="courses-grid">
          {gpa.courses.map((course, idx) => (
            <div key={idx} className="course-card">
              <div className="course-icon">📘</div>
              <div className="course-info">
                <h3 className="course-name">{course.name}</h3>
                <div className="course-details">
                  <span className="credit-hours">{course.creditHours} Credits</span>
                  <span className="course-grade">Grade: {course.grade}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="gpa-actions">
        <Link to={`/gpa/${gpa._id}/edit`}>
          <button className="btn-edit">✏ Edit GPA</button>
        </Link>
        <button className="btn-delete" onClick={handleDelete}>🗑 Delete GPA</button>
      </div>
    </main>
  );
};

export default GpaDetails;