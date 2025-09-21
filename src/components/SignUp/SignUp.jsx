import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.scss";

const SignUp = (props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConf: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (props.user) navigate("/");
  }, [props.user]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const result = await props.handleSignUp(formData);
    if (result.success) navigate("/");
    else setError(result.message);
  };

  const formIsInvalid =
    !formData.username ||
    !formData.password ||
    formData.password !== formData.passwordConf;

  return (
    <div className="auth-container">
      <form className="fade-in" onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        {error && <p className="error">{error}</p>}
        <label>Username:</label>
        <input type="text" name="username" onChange={handleChange} />
        <label>Password:</label>
        <input type="password" name="password" onChange={handleChange} />
        <label>Confirm Password:</label>
        <input type="password" name="passwordConf" onChange={handleChange} />
        <button type="submit" disabled={formIsInvalid}>
          Sign Up
        </button>

        <p className="toggle-text">
          Already have an account?{" "}
          <span
            className="toggle-link"
            onClick={() => navigate("/sign-in")}
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
