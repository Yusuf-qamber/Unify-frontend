import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import gpaService from "../../services/gpaService.js";
import "./GpaList.scss";

const GpaList = () => {
  const [gpaRecords, setGpaRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cumulativeGpa, setCumulativeGpa] = useState(0);
  const [cumulativeMajorGpa, setCumulativeMajorGpa] = useState(0);

  useEffect(() => {
    const fetchGpa = async () => {
      try {
        const data = await gpaService.index();
        setGpaRecords(data);

        // Calculate cumulative GPA using semesterGpa weighted by semester credits
        let totalCredits = 0;
        let totalPoints = 0;
        let totalMajorCredits = 0;
        let totalMajorPoints = 0;

        data.forEach((record) => {
          const semesterCredits = record.courses.reduce(
            (sum, c) => sum + c.creditHours,
            0
          );
          totalCredits += semesterCredits;
          totalPoints += (record.semesterGpa || 0) * semesterCredits;

          const majorCredits = record.courses
            .filter((c) => c.major)
            .reduce((sum, c) => sum + c.creditHours, 0);
          totalMajorCredits += majorCredits;
          totalMajorPoints += (record.majorGpa || 0) * majorCredits;
        });

        setCumulativeGpa(totalCredits ? totalPoints / totalCredits : 0);
        setCumulativeMajorGpa(
          totalMajorCredits ? totalMajorPoints / totalMajorCredits : 0
        );
      } catch (err) {
        console.error("Failed to fetch GPA records:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGpa();
  }, []);

  if (loading)
    return <p className="loading-msg">Loading GPA records...</p>;

  if (!gpaRecords.length)
    return <p className="no-gpa-msg">No GPA records found.</p>;

  return (
    <main className="gpa-list-container">
      <header className="gpa-list-header">
        <h1 className="gpa-list-title">GPA Records</h1>

        <div className="cumulative-gpa">
          CGPA: <strong>{cumulativeGpa.toFixed(2)}</strong> | 
          MCGPA: <strong>{cumulativeMajorGpa.toFixed(2)}</strong>
        </div>

        <div className="add-gpa-button">
          <Link to="/gpa/new">
            <button className="btn-add-gpa">➕ Add GPA</button>
          </Link>
        </div>
      </header>

      <ul className="gpa-list">
        {gpaRecords.map((record) => (
          <li key={record._id} className="gpa-card">
            <Link to={`/gpa/${record._id}`} className="gpa-card-link">
              <div className="gpa-header">
                <h2 className="semester-name">{record.semester}</h2>
                <span className="gpa-status">
                  GPA: {record.semesterGpa?.toFixed(2) || "N/A"} | 
                  Major GPA: {record.majorGpa?.toFixed(2) || "N/A"}
                </span>
              </div>
              <div className="gpa-footer">
                <span className="course-count">
                  Courses: {record.courses.length}
                </span>
                <span className="created-date">
                  Created: {new Date(record.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default GpaList;
