import { useState, useEffect, useRef } from "react";

function Notes({ currentUser, setCurrentUser }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [notes, setNotes] = useState([0]);
  const [activeIdx, setActiveIdx] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef(null);

  useEffect(() => {
  const saved = JSON.parse(localStorage.getItem(currentUser)) || [];
  setNotes(saved);
  if (saved.length > 0) {
    setTitle(saved[0].title);
    setBody(saved[0].body);
    setActiveIdx(0);
  }
}, [currentUser]);

  const persist = (data) => {
    setNotes(data);
    localStorage.setItem(currentUser, JSON.stringify(data));
  };

  const newNote = () => {
    setActiveIdx(null);
    setTitle("");
    setBody("");
    setIsNew(true);
  };

  const openNote = (i) => {
    setActiveIdx(i);
    setTitle(notes[i].title);
    setBody(notes[i].body);
    setIsNew(false);
  };

  const discard = () => {
    setActiveIdx(null);
    setIsNew(false);
    setTitle("");
    setBody("");
  };

  const saveNote = () => {
    if (!title.trim() || !body.trim()) return;

    let updated;

    if (isNew) {
      updated = [{ title, body }, ...notes];
      setActiveIdx(0);
      setIsNew(false);
    } else {
      updated = notes.map((n, i) =>
        i === activeIdx ? { ...n, title, body } : n
      );
    }

    persist(updated);

    setToastVisible(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2000);
  };

  const deleteNote = (e, i) => {
    e.stopPropagation();
    const updated = notes.filter((_, idx) => idx !== i);
    persist(updated);
    if (activeIdx === i) discard();
    else if (activeIdx > i) setActiveIdx(activeIdx - 1);
  };

  const isEditing = isNew || activeIdx !== null;
  const canSave = title.trim().length > 0 && body.trim().length > 0;

  return (
    <div className="app-layout">

      <aside className="sidebar">
        <div className="sidebar-header">
          <p className="sidebar-eyebrow">Workspace for</p>
          <p className="sidebar-user">{currentUser}</p>
          <p className="sidebar-count">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </p>
        </div>

        <button className="sidebar-new-btn" onClick={newNote}>
          <span style={{ fontSize: "18px" }}>+</span> New Note
        </button>

        <div className="notes-list">
          {notes.length === 0 && (
            <div className="empty-state">
              No notes yet.<br />Create your first one.
            </div>
          )}

          {notes.map((note, i) => (
            <div
              key={i}
              className={`note-card ${activeIdx === i && !isNew ? "active" : ""}`}
              style={{ animationDelay: `${i * 40}ms` }}
              onClick={() => openNote(i)}
            >
              <div className="note-title">{note.title}</div>
              <div className="note-body">{note.body}</div>
              <div className="note-buttons">
                <button onClick={(e) => { e.stopPropagation(); openNote(i); }}>
                  Edit
                </button>
                <button className="delete" onClick={(e) => deleteNote(e, i)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main className="editor">
        {!isEditing ? (
          <div className="welcome">
            <div className="welcome-icon"></div>
            <p className="welcome-title">Write a note</p>
            <p className="welcome-sub">
              Have you imaginationns, ideas or thoughts you want to capture? Write them down and keep them organized in one place.
            </p>
          </div>
        ) : (
          <>
            <div className="editor-topbar">
              <span className="editor-mode-badge">
                {isNew ? "New Note" : "Editing Mode"}
              </span>
              <div className="editor-action-row">
                <button className="editor-discard" onClick={discard}>
                  Discard
                </button>
                <button
                  className="editor-save"
                  onClick={saveNote}
                  disabled={!canSave}
                >
                  {isNew ? "Save Note" : "Update"}
                </button>
              </div>
            </div>

            <div className="editor-body">
              <input
                className="input-title"
                placeholder="Note title…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
              <textarea
                className="input-body"
                placeholder="Start writing…"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>

            <div className="editor-footer">
              <span className="char-count">{body.length} characters</span>
              <span className={`saved-toast ${toastVisible ? "visible" : ""}`}>
                ✓ Saved
              </span>
            </div>
          </>
        )}
      </main>

      <button className="logout-btn" onClick={() => setCurrentUser("")}>Logout</button>
    </div>
  );
}

export default Notes;