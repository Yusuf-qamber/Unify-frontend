import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import gpaService from "../../services/gpaService.js";
import "./GpaForm.scss";

const GpaForm = () => {
  const { gpaId } = useParams();
  const navigate = useNavigate();

  const [gpaRecord, setGpaRecord] = useState({
    semester: "",
    courses: [{ name: "", creditHours: "", grade: "" }],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const gradePoints = {
    A: 4,
    "A-": 3.67,
    "B+": 3.33,
    B: 3,
    "B-": 2.67,
    "C+": 2.33,
    C: 2,
    "C-": 1.67,
    "D+": 1.33,
    D: 1,
    "D-": 0.67,
    F: 0,
  };

  useEffect(() => {
    if (gpaId) {
      const fetchGpa = async () => {
        setLoading(true);
        try {
          const data = await gpaService.show(gpaId);
          setGpaRecord(data);
        } catch (err) {
          console.error("Failed to fetch GPA record:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchGpa();
    }
  }, [gpaId]);

  const validateForm = () => {
    const newErrors = {};

    if (!gpaRecord.semester.trim()) {
      newErrors.semester = "Semester is required";
    }

    gpaRecord.courses.forEach((course, index) => {
      if (!course.name.trim()) {
        newErrors[`courseName_${index}`] = "Course name is required";
      }
      if (!course.creditHours || course.creditHours <= 0) {
        newErrors[`courseCredits_${index}`] = "Valid credit hours are required";
      }
      if (!course.grade) {
        newErrors[`courseGrade_${index}`] = "Grade is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGpaRecord((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
const handleCourseChange = (idx, field, value) => {
  const updated = [...gpaRecord.courses];

  if (field === "creditHours") {
    updated[idx][field] = value === "" ? "" : Number(value);
  } else {
    updated[idx][field] = value;
  }

  setGpaRecord((prev) => ({ ...prev, courses: updated }));
  
  // Clear error
  const errorKey = `course${field.charAt(0).toUpperCase() + field.slice(1)}_${idx}`;
  if (errors[errorKey]) setErrors(prev => ({ ...prev, [errorKey]: "" }));
};

  const addCourse = () => {
    setGpaRecord((prev) => ({
      ...prev,
      courses: [...prev.courses, { name: "", creditHours: "", grade: "" }],
    }));
  };

  const removeCourse = (idx) => {
    if (gpaRecord.courses.length > 1) {
      setGpaRecord((prev) => ({
        ...prev,
        courses: prev.courses.filter((_, i) => i !== idx),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    let totalPoints = 0;
let totalHours = 0;

gpaRecord.courses.forEach(c => {
  const grade = c.grade?.trim().toUpperCase();
  const credits = parseFloat(c.creditHours?.toString().trim());

  if (grade && !isNaN(credits) && credits > 0 && gradePoints[grade] !== undefined) {
    totalPoints += gradePoints[grade] * credits;
    totalHours += credits;
  }
});

const gpa = totalHours > 0 ? +(totalPoints / totalHours).toFixed(2) : 0;
;

    try {
      if (gpaId) {
        await gpaService.update(gpaId, { ...gpaRecord, semesterGpa: gpa });
      } else {
        await gpaService.create({ ...gpaRecord, semesterGpa: gpa });
      }
      navigate("/gpa");
    } catch (err) {
      console.error("Failed to save GPA record:", err);
    }
  };

  if (loading) return <p className="loading-msg">Loading...</p>;

  return (
    <main className="gpa-form-container">
      <div className="form-header">
        <h1 className="form-title">
          {gpaId ? "Edit GPA Record" : "Create New GPA Record"}
        </h1>
        <p className="form-subtitle">
          {gpaId
            ? "Update your semester information and courses"
            : "Add your semester information and courses to calculate GPA"}
        </p>
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
              placeholder="e.g., Fall 2024, Spring 2025"
              required
            />
            {errors.semester && (
              <span className="error-message">{errors.semester}</span>
            )}
          </label>
        </div>

        <div className="form-section">
          <h2 className="courses-title">Courses</h2>
          <div className="courses-list">
            {gpaRecord.courses.map((course, idx) => (
              <div key={idx} className="course-row">
                <div className="course-input-group">
                  <div className="input-field">
                    <input
                      placeholder="Course Name"
                      value={course.name}
                      onChange={(e) =>
                        handleCourseChange(idx, "name", e.target.value)
                      }
                      className={`course-input ${
                        errors[`courseName_${idx}`] ? "error" : ""
                      }`}
                      required
                    />
                    {errors[`courseName_${idx}`] && (
                      <span className="error-message">
                        {errors[`courseName_${idx}`]}
                      </span>
                    )}
                  </div>

                  <div className="input-field">
                    <input
                      type="number"
                      placeholder="Credit Hours"
                      value={course.creditHours}
                      onChange={(e) =>
                        handleCourseChange(idx, "creditHours", e.target.value)
                      }
                      className={`course-input ${
                        errors[`courseCredits_${idx}`] ? "error" : ""
                      }`}
                      min="1"
                      max="10"
                      required
                    />
                    {errors[`courseCredits_${idx}`] && (
                      <span className="error-message">
                        {errors[`courseCredits_${idx}`]}
                      </span>
                    )}
                  </div>

                  <div className="input-field">
                    <select
                      value={course.grade}
                      onChange={(e) =>
                        handleCourseChange(idx, "grade", e.target.value)
                      }
                      className={`course-select ${
                        errors[`courseGrade_${idx}`] ? "error" : ""
                      }`}
                      required
                    >
                      <option value="">Select Grade</option>
                      {Object.keys(gradePoints).map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                    {errors[`courseGrade_${idx}`] && (
                      <span className="error-message">
                        {errors[`courseGrade_${idx}`]}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="btn-remove-course"
                    onClick={() => removeCourse(idx)}
                    disabled={gpaRecord.courses.length === 1}
                  >
                    ✖
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button type="button" className="btn-add-course" onClick={addCourse}>
            <span className="plus-icon">+</span>
            Add Another Course
          </button>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/gpa")}
          >
            Cancel
          </button>
          <button type="submit" className="btn-submit">
            {gpaId ? "Update GPA Record" : "Create GPA Record"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default GpaForm;
