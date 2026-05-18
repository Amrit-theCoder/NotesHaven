import { useState } from "react";
import Login from "./components/Login.jsx";
import Notes from "./components/Notes.jsx";
import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState("");

  return (
    <>
      {!currentUser ? (
        <Login setCurrentUser={setCurrentUser} />
      ) : (
        <Notes currentUser={currentUser} setCurrentUser={setCurrentUser} />
      )}
    </>
  );
}

export default App;