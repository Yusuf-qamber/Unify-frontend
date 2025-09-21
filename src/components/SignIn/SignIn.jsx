import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.scss";

const SignIn = (props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });

  useEffect(() => {
    if (props.user) navigate("/");
  }, [props.user]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    props.handleSignIn(formData);
    navigate("/");
  };

  return (
    <div className="auth-container">
      <form className="fade-in" onSubmit={handleSubmit}>
        <h1>Sign In</h1>
        <label>Username:</label>
        <input type="text" name="username" onChange={handleChange} />
        <label>Password:</label>
        <input type="password" name="password" onChange={handleChange} />
        <button type="submit">
          Sign In
        </button>

        <p className="toggle-text">
          Don't have an account?{" "}
          <span
            className="toggle-link"
            onClick={() => navigate("/sign-up")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
