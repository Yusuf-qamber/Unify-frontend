import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../../services/authService";
import "./SignIn.scss";

const SignIn = (props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(""); 

  useEffect(() => {
    if (props.user) navigate("/");
  }, [props.user]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
    setError(""); 
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setError(""); // reset error before submitting

    try {
      const user = await authService.signIn(formData);
      if (user) {
        props.setUser(user); // optional global user state
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Invalid username or password");
    }
  };

  const formIsInvalid = !formData.username || !formData.password;

  return (
    <div className="auth-container">
      <form className="fade-in" onSubmit={handleSubmit}>
        <h1>Sign In</h1>

        {error && <div className="error-box">{error}</div>}

        <label>Username:</label>
        <input type="text" name="username" onChange={handleChange} />

        <label>Password:</label>
        <input type="password" name="password" onChange={handleChange} />

        <button type="submit" disabled={formIsInvalid}>
          Sign In
        </button>

        <p className="toggle-text">
          Don't have an account?{" "}
          <span className="toggle-link" onClick={() => navigate("/sign-up")}>
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
