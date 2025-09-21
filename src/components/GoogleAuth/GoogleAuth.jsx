// src/components/GoogleAuth.jsx
import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const GoogleAuth = ({ onAuthSuccess }) => {
  const clientId = "351326681445-jqvb82f2508o0ap2op6b3okvg1d4dqas.apps.googleusercontent.com";

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("http://localhost:3000/auth/google-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          credential: credentialResponse.credential,
          client_id: clientId,
        }),
      });

      const data = await res.json();
      console.log("Server response:", data);

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        if (onAuthSuccess) onAuthSuccess(data.user);
      } else {
        console.error("Auth failed:", data);
      }
    } catch (err) {
      console.error("Error sending credential to backend:", err);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => console.log("Login Failed")}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
