import { useState } from "react";

function Login({ setCurrentUser }) {
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    if (!username.trim()) return;
    setCurrentUser(username.trim());
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="login-page">
      <h1 className="main-title">Write Notes</h1>
      <h1 className="main-title">With Notes<span>Haven</span></h1>
      <p className="subtitle">A quiet space for your thoughts and ideas</p>
      <input
        className="username-input"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleKey}
        autoFocus
      />
      <button className="enter-btn" onClick={handleLogin}>
        Continue →
      </button>
      <button className="enter-btn" onClick={() => setCurrentUser("Guest")}>
        Test it as "Guest"
      </button>
    </div>
  );
}

export default Login;