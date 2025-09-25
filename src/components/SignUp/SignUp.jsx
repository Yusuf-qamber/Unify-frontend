import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.scss";

const SignUp = (props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConf: "",
  });
  const [errors, setErrors] = useState({}); 

  // password rules
  const passwordRules = {
    length: formData.password.length >= 12,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[\W_]/.test(formData.password),
  };

  useEffect(() => {
    if (props.user) navigate("/");
  }, [props.user]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
    setErrors({ ...errors, [evt.target.name]: null }); 
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    let newErrors = {};

   
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;

    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 12 characters and include uppercase, lowercase, number, and special character.";
    }

    if (formData.password !== formData.passwordConf) {
      newErrors.passwordConf = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await props.handleSignUp(formData);

    if (result.success) {
      navigate("/");
    } else {
      // backend error handling (e.g., "Email already in use", "Password already used")
      if (result.field) {
        setErrors({ [result.field]: result.message });
      } else {
        setErrors({ general: result.message });
      }
    }
  };

  const formIsInvalid =
    !formData.username ||
    !formData.password ||
    !formData.email ||
    formData.password !== formData.passwordConf;

  return (
    <div className="auth-container">
      <form className="fade-in" onSubmit={handleSubmit}>
        <h1>Sign Up</h1>

        {errors.general && <div className="error-box">{errors.general}</div>}

        <label>Username:</label>
        <input type="text" name="username" onChange={handleChange} />
        {errors.username && <p className="field-error">{errors.username}</p>}

        <label>Email</label>
        <input type="email" name="email" onChange={handleChange} />
        {errors.email && <p className="field-error">{errors.email}</p>}

        <label>Password:</label>
        <input type="password" name="password" onChange={handleChange} />
        {errors.password && <p className="field-error">{errors.password}</p>}

        

        <label>Confirm Password:</label>
        <input type="password" name="passwordConf" onChange={handleChange} />
        {/* Password Checklist */}
        <div className="password-rules">
          <h4>Password must include:</h4>
          <ul>
            <li className={passwordRules.length ? "valid" : "invalid"}>
              • At least 12 characters
            </li>
            <li className={passwordRules.upper ? "valid" : "invalid"}>
              • One uppercase letter
            </li>
            <li className={passwordRules.lower ? "valid" : "invalid"}>
              • One lowercase letter
            </li>
            <li className={passwordRules.number ? "valid" : "invalid"}>
              • One number
            </li>
            <li className={passwordRules.special ? "valid" : "invalid"}>
              • One special character
            </li>
          </ul>
        </div>
        {errors.passwordConf && (
          <p className="field-error">{errors.passwordConf}</p>
        )}

        <button type="submit" disabled={formIsInvalid}>
          Sign Up
        </button>

        <p className="toggle-text">
          Already have an account?{" "}
          <span className="toggle-link" onClick={() => navigate("/sign-in")}>
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
