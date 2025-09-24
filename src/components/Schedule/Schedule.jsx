import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as scheduleService from "../../services/scheduleService";
import "./Schedule.scss";

const dayNames = { U: "Sunday", M: "Monday", T: "Tuesday", W: "Wednesday", H: "Thursday" };

const Schedule = ({ user }) => {
  const [schedule, setSchedule] = useState({ courses: [] });

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await scheduleService.getSchedule();
        setSchedule(data || { courses: [] });
      } catch (err) {
        console.error("Failed to load schedule:", err.message);
      }
    };
    fetchSchedule();
  }, []);

  const sortedCourses = [...(schedule.courses || [])].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  return (
    <div className="schedule-container">
      <h2 className="schedule-header">My Schedule</h2>
      {user && (
        <div className="add-course-wrapper">
          <Link to={`/schedule/new`} className="add-course-link">
            + Add Course
          </Link>
        </div>
      )}

      <div className="schedule-grid">
        {Object.entries(dayNames).map(([abbr, name]) => (
          <div key={abbr} className="day-column">
            <h3>{abbr}</h3>
            {sortedCourses
              .filter((c) => c.days.includes(abbr))
              .map((c) => (
                <div key={c._id} className="course-card">
                  <div className="course-content">
                    <strong>{c.courseCode}</strong> (Sec {c.section})
                    <br />
                    {c.startTime} – {c.endTime}
                    <br />
                    Place: {c.place}
                    <br />
                    Exam: {c.examDate} {c.examTime}
                    <br />
                    {user && (
                      <div className="edit-btn-wrapper">
                        <Link to={`/schedule/${c._id}/edit`} className="edit-btn">
                          Edit
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
