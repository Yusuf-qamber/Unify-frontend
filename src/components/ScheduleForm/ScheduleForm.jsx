import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useConfirm } from "material-ui-confirm";
import * as scheduleService from "../../services/scheduleService";
import "./ScheduleForm.scss";

const daysOptions = ["U", "M", "T", "W", "H"];


const isTimeOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1;
};

const ScheduleForm = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const confirm = useConfirm();

  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [form, setForm] = useState({
    courseCode: "",
    section: "1",
    days: [],
    startTime: "08:00",
    endTime: "09:00",
    place: "",
    examDate: "",
    examTime: "08:00",
  });

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      try {
        const fullSchedule = await scheduleService.getSchedule();
        setSchedule(fullSchedule?.courses || []);
        if (!courseId) return;

        const course = fullSchedule?.courses.find((c) => c._id === courseId);
        if (!course) {
          window.alert("Course not found");
          return navigate("/schedule");
        }
        setForm({
          courseCode: course.courseCode || "",
          section: course.section || 1,
          days: course.days || [],
          startTime: course.startTime || "08:00",
          endTime: course.endTime || "09:00",
          place: course.place || "",
          examDate: course.examDate || "",
          examTime: course.examTime || "08:00",
        });
      } catch (err) {
        window.alert(err.message || "Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [courseId, navigate]);

  const addOneHour = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    const newH = (h + 1) % 24;
    return `${newH.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

const handleChange = (e) => {
  const { name, value } = e.target;

  let updatedValue = value;

  if (name === "courseCode") {
    updatedValue = value.toUpperCase();
  }

  let updatedForm = { ...form, [name]: updatedValue };

  if (name === "startTime" && (!form.endTime || form.endTime <= value)) {
    updatedForm.endTime = addOneHour(value);
  }
  if (name === "endTime" && value <= form.startTime) {
    updatedForm.endTime = addOneHour(form.startTime);
  }

  setForm(updatedForm);
};


  const handleDaysChange = (day) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const checkConflicts = () => {
    const conflicts = [];
    schedule.forEach((course) => {
      if (courseId && course._id === courseId) return; 
      const overlappingDays = course.days.filter((d) => form.days.includes(d));
      if (overlappingDays.length === 0) return;

      if (isTimeOverlap(form.startTime, form.endTime, course.startTime, course.endTime)) {
        conflicts.push(course.courseCode);
      }
    });
    return conflicts;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.days.length) {
      window.alert("Please select at least one day");
      return;
    }
    if (Number(form.section) <= 0) {
      window.alert("Section must be greater than 0");
      return;
    }

    const conflicts = checkConflicts();
    if (conflicts.length) {
      window.alert(
        `Time conflict detected with course(s): ${conflicts.join(", ")}`
      );
      return;
    }
 
    const payload = { ...form };
    try {
      if (courseId) {
        await scheduleService.updateCourse(payload, courseId);
      } else {
        await scheduleService.createCourse(payload);
      }
      navigate("/schedule");
    } catch (err) {
      window.alert(err.message || "Error saving course");
    }
  };

  const handleDelete = async () => {
    if (!courseId) return;
    const { confirmed } = await confirm({
      title: "Delete Course",
      description: "Are you sure you want to delete this course?",
      confirmationText: "Delete",
      cancellationText: "Cancel",
    });

    if (confirmed) {
      await scheduleService.deleteCourse(courseId);
      navigate("/schedule");
    }
  };

  if (loading) return <p>Loading course...</p>;

  return (
    <form onSubmit={handleSubmit} className="schedule-form">
      <label>Course code:</label>
      <input
        name="courseCode"
        value={form.courseCode}
        onChange={handleChange}
        
        required
      />
      <label>Section:</label>
      <input
        name="section"
        type="String"
        
        value={form.section}
        onChange={handleChange}
        required
      />

      <div className="days-checkboxes">
        <label>Days:</label>
        {daysOptions.map((day) => (
          <label key={day}>
            <input
              type="checkbox"
              checked={form.days.includes(day)}
              onChange={() => handleDaysChange(day)}
            />{" "}
            {day}
          </label>
        ))}
      </div>

      <label>Start Time:</label>
      <input
        type="time"
        name="startTime"
        value={form.startTime}
        onChange={handleChange}
        required
      />

      <label>End Time:</label>
      <input
        type="time"
        name="endTime"
        value={form.endTime}
        onChange={handleChange}
        required
      />
      <label>place:</label>
      <input
        name="place"
        value={form.place}
        onChange={handleChange}
        required
      />

      <label>Exam Date:</label>
      <input
        type="date"
        name="examDate"
        value={form.examDate}
        onChange={handleChange}
        required
      />

      <label>Exam Time:</label>
      <input
        type="time"
        name="examTime"
        value={form.examTime}
        onChange={handleChange}
        required
      />

      <button type="submit">{courseId ? "Update" : "Add"} Course</button>

      {courseId && (
        <button type="button" className="delete-btn" onClick={handleDelete}>
          Delete Course
        </button>
      )}
    </form>
  );
};

export default ScheduleForm;
