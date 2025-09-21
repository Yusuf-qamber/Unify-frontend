import { Link } from "react-router-dom";
import "./Landing.scss";

const colleges = [
  { name: "it", icon: "💻" },
  { name: "business", icon: "📊" },
  { name: "science", icon: "🔬" },
  { name: "law", icon: "⚖️" },
  { name: "engineering", icon: "🛠️" },
  { name: "art", icon: "🎨" },
];

const Landing = () => {
  return (
    <main className="landing-page">
      <div className="landing-container">
        
        <div className="college-container">
          {colleges.map((college, index) => (
            <div key={index} className="college-card-wrapper">
              <Link to={`/${college.name}`} className="college-card">
                <span className="icon">{college.icon}</span>
                <span className="label">{college.name.toUpperCase()}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Landing;
