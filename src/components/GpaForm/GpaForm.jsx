import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import gpaService from "../../services/gpaService.js";
import "./GpaForm.scss";

const GpaForm = () => {
  const { gpaId } = useParams();
  const navigate = useNavigate();

  const [gpaRecord, setGpaRecord] = useState({
    semester: "",
    courses: [{ name: "", creditHours: "", grade: "", major: false }],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load GPA for editing
  useEffect(() => {
    if (!gpaId) return;
    setLoading(true);
    gpaService.show(gpaId)
      .then(data => {
        const courses = data.courses.map(c => ({ ...c, major: !!c.major }));
        setGpaRecord({ ...data, courses });
      })
      .catch(err => console.error("Failed to fetch GPA record:", err))
      .finally(() => setLoading(false));
  }, [gpaId]);

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!gpaRecord.semester.trim()) newErrors.semester = "Semester is required";

    gpaRecord.courses.forEach((c, i) => {
      if (!c.name.trim()) newErrors[`courseName_${i}`] = "Course name is required";
      if (!c.creditHours || c.creditHours <= 0 || c.creditHours > 10)
        newErrors[`courseCredits_${i}`] = "Credit hours must be 1-10";
      if (!c.grade) newErrors[`courseGrade_${i}`] = "Grade is required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGpaRecord(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleCourseChange = (idx, field, value) => {
    const courses = [...gpaRecord.courses];
    courses[idx][field] = field === "creditHours" ? Number(value) : value;
    if (field === "major") courses[idx][field] = !!value; // ensure boolean
    setGpaRecord(prev => ({ ...prev, courses }));
    const errorKey = `course${field.charAt(0).toUpperCase() + field.slice(1)}_${idx}`;
    if (errors[errorKey]) setErrors(prev => ({ ...prev, [errorKey]: "" }));
  };

  const addCourse = () =>
    setGpaRecord(prev => ({
      ...prev,
      courses: [...prev.courses, { name: "", creditHours: "", grade: "", major: false }]
    }));

  const removeCourse = (idx) => {
    if (gpaRecord.courses.length === 1) return;
    setGpaRecord(prev => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (gpaId) await gpaService.update(gpaId, gpaRecord);
      else await gpaService.create(gpaRecord);
      navigate("/gpa");
    } catch (err) {
      console.error("Failed to save GPA record:", err);
    }
  };

  if (loading) return <p className="loading-msg">Loading...</p>;

  return (
    <main className="gpa-form-container">
      <div className="form-header">
        <h1 className="form-title">{gpaId ? "Edit GPA Record" : "Create New GPA Record"}</h1>
        <p className="form-subtitle">{gpaId ? "Update semester & courses" : "Add semester & courses to calculate GPA"}</p>
      </div>

      <form onSubmit={handleSubmit} className="gpa-form">
        <div className="form-section">
          <label className="form-label">
            Semester
            <input
              type="text"
              name="semester"
              value={gpaRecord.semester}
              onChange={handleChange}
              className={`form-input ${errors.semester ? "error" : ""}`}
              placeholder="e.g., Fall 2024"
              required
            />
            {errors.semester && <span className="error-message">{errors.semester}</span>}
          </label>
        </div>

        <div className="form-section">
          <h2 className="courses-title">Courses</h2>
          <div className="courses-list">
            {gpaRecord.courses.map((course, idx) => (
              <div key={idx} className="course-row">
                <input
                  placeholder="Course Name"
                  value={course.name}
                  onChange={e => handleCourseChange(idx, "name", e.target.value)}
                  className={`course-input ${errors[`courseName_${idx}`] ? "error" : ""}`}
                  required
                />
                <input
                  type="number"
                  placeholder="Credit Hours"
                  value={course.creditHours}
                  onChange={e => handleCourseChange(idx, "creditHours", e.target.value)}
                  className={`course-input ${errors[`courseCredits_${idx}`] ? "error" : ""}`}
                  min={1} max={10}
                  required
                />
                <select
                  value={course.grade}
                  onChange={e => handleCourseChange(idx, "grade", e.target.value)}
                  className={`course-select ${errors[`courseGrade_${idx}`] ? "error" : ""}`}
                  required
                >
                  <option value="">Select Grade</option>
                  {["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <label className="major-checkbox">
                  <input
                    type="checkbox"
                    checked={course.major}
                    onChange={e => handleCourseChange(idx, "major", e.target.checked)}
                  />  Major
                </label>
                <button type="button" className="btn-remove-course" onClick={() => removeCourse(idx)} disabled={gpaRecord.courses.length === 1}>✖</button>
              </div>
            ))}
          </div>
          <button type="button" className="btn-add-course" onClick={addCourse}>+ Add Course</button>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate("/gpa")}>Cancel</button>
          <button type="submit" className="btn-submit">{gpaId ? "Update GPA" : "Create GPA"}</button>
        </div>
      </form>
    </main>
  );
};

export default GpaForm;
