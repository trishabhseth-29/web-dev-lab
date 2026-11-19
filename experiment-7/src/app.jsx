
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  function addNote() {
    if (note.trim() === "") {
      alert("Please write something!");
      return;
    }

    setNotes([...notes, { id: Date.now(), text: note }]);
    setNote("");
  }

  function deleteNote(id) {
    setNotes(notes.filter((item) => item.id !== id));
  }

  return (
    <div className="app">
      <h1>My Notes App</h1>
      <p>Write and save your notes</p>

      <textarea
        placeholder="Write your note here..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button onClick={addNote}>Add Note</button>

      <div className="notes-container">
        {notes.map((item) => (
          <div className="note-card" key={item.id}>
            <p>{item.text}</p>
            <button onClick={() => deleteNote(item.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
