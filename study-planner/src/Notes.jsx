
import { useState } from "react";
import { addNote, deleteNote, updateNote } from "./notesService";
const subjects = [
  
  { id: "science", name: "Science", icon: "🔬", color: "#6B7280" },
  { id: "english", name: "English", icon: "📗", color: "#6B7280" },
  { id: "history", name: "History", icon: "🏛️", color: "#6B7280" },
];

const PAGE_TYPES = [
  { id: "lined", label: "Lined" },
  { id: "grid", label: "Grid" },
  { id: "plain", label: "Plain" },
];

function PageBackground({ type }) {
  if (type === "lined") {
    return (
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: 40 }).map((_, i) => (
          <line
            key={i}
            x1="0"
            y1={32 + i * 28}
            x2="100%"
            y2={32 + i * 28}
            stroke="#D1D5DB"
            strokeWidth="0.8"
          />
        ))}
      </svg>
    );
  }
  if (type === "grid") {
    return (
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#D1D5DB" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    );
  }
  return null;
}

function NoteModal({ note, subjects, onSave, onClose }) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [subject, setSubject] = useState(note?.subject || subjects[0].id);
  const [pageType, setPageType] = useState(note?.pageType || "lined");

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), content, subject, pageType });
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "#fff", borderRadius: 16, width: 560, maxWidth: "95vw",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)", overflow: "hidden",
        display: "flex", flexDirection: "column",
      }}>
        {/* Modal Header */}
        <div style={{
          padding: "16px 20px", borderBottom: "1px solid #E5E7EB",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontWeight: 600, fontSize: 16, color: "#111827" }}>
            {note ? "Edit Note" : "New Note"}
          </span>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 20, color: "#9CA3AF", lineHeight: 1,
          }}>×</button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Title */}
          <input
            autoFocus
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              border: "1px solid #D1D5DB", borderRadius: 8, padding: "10px 14px",
              fontSize: 15, fontWeight: 500, outline: "none",
              background: "#F9FAFB", color: "#111827",
            }}
          />

          {/* Subject & Page Type Row */}
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 6 }}>Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  width: "100%", border: "1px solid #D1D5DB", borderRadius: 8,
                  padding: "8px 12px", fontSize: 14, background: "#F9FAFB",
                  color: "#111827", outline: "none",
                }}
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: "#6B7280", display: "block", marginBottom: 6 }}>Page style</label>
              <div style={{ display: "flex", gap: 6 }}>
                {PAGE_TYPES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPageType(p.id)}
                    style={{
                      flex: 1, padding: "8px 0", fontSize: 12, borderRadius: 8,
                      border: pageType === p.id ? "2px solid #6B9B6E" : "1px solid #D1D5DB",
                      background: pageType === p.id ? "#EEF6EE" : "#F9FAFB",
                      color: pageType === p.id ? "#3B6B3E" : "#6B7280",
                      cursor: "pointer", fontWeight: pageType === p.id ? 600 : 400,
                      transition: "all 0.15s",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content area with page background */}
          <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: "1px solid #D1D5DB" }}>
            <PageBackground type={pageType} />
            <textarea
              placeholder="Start writing your notes..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              style={{
                position: "relative", zIndex: 1,
                width: "100%", resize: "none",
                background: "transparent", border: "none",
                padding: "12px 16px", fontSize: 14, lineHeight: "28px",
                color: "#1F2937", outline: "none",
                fontFamily: "inherit", boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 20px", borderTop: "1px solid #E5E7EB",
          display: "flex", justifyContent: "flex-end", gap: 10,
        }}>
          <button onClick={onClose} style={{
            padding: "9px 20px", borderRadius: 8, border: "1px solid #D1D5DB",
            background: "#fff", color: "#374151", fontSize: 14, cursor: "pointer",
          }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            style={{
              padding: "9px 20px", borderRadius: 8, border: "none",
              background: title.trim() ? "#6B9B6E" : "#C4D8C4",
              color: "#fff", fontSize: 14, cursor: title.trim() ? "pointer" : "default",
              fontWeight: 500,
            }}
          >
            {note ? "Save changes" : "Create note"}
          </button>
        </div>
      </div>
    </div>
  );
}

function NoteViewer({ note, onEdit, onDelete, onClose }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Viewer Header */}
      <div style={{
        padding: "14px 20px", borderBottom: "1px solid #E5E7EB",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexShrink: 0,
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#111827" }}>{note.title}</h2>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>
            {subjects.find((s) => s.id === note.subject)?.icon}{" "}
            {subjects.find((s) => s.id === note.subject)?.name} · {note.pageType} · {note.updatedAt}
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onEdit} style={{
            padding: "7px 14px", borderRadius: 8, border: "1px solid #D1D5DB",
            background: "#fff", color: "#374151", fontSize: 13, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            ✏️ Edit
          </button>
          {confirmDelete ? (
            <>
              <button onClick={() => setConfirmDelete(false)} style={{
                padding: "7px 12px", borderRadius: 8, border: "1px solid #D1D5DB",
                background: "#fff", color: "#6B7280", fontSize: 13, cursor: "pointer",
              }}>Cancel</button>
              <button onClick={onDelete} style={{
                padding: "7px 12px", borderRadius: 8, border: "none",
                background: "#EF4444", color: "#fff", fontSize: 13, cursor: "pointer",
              }}>Delete</button>
            </>
          ) : (
            <button onClick={() => setConfirmDelete(true)} style={{
              padding: "7px 14px", borderRadius: 8, border: "1px solid #FECACA",
              background: "#FFF5F5", color: "#DC2626", fontSize: 13, cursor: "pointer",
            }}>
              🗑️ Delete
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ position: "relative", flex: 1, overflow: "auto" }}>
        <PageBackground type={note.pageType} />
        <div style={{
          position: "relative", zIndex: 1,
          padding: "16px 20px", fontSize: 14, lineHeight: "28px",
          color: "#1F2937", whiteSpace: "pre-wrap", minHeight: "100%",
        }}>
          {note.content || <span style={{ color: "#9CA3AF" }}>No content yet.</span>}
        </div>
      </div>
    </div>
  );
}

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [modal, setModal] = useState(null); // null | 'create' | 'edit'
  const [search, setSearch] = useState("");

  const now = () => new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  const filteredNotes = notes.filter((n) => {
    const matchSubject = selectedSubject ? n.subject === selectedSubject : true;
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    return matchSubject && matchSearch;
  });

  const subjectCount = (id) => notes.filter((n) => n.subject === id).length;


const handleCreate = async (data) => {
  try {
    const newNote = {
      ...data,
      updatedAt: new Date().toLocaleDateString()
    };

    try {
  const docRef = await addNote({
    ...data,
    updatedAt: new Date().toLocaleDateString(),
  });

  // Update UI
  setNotes((prev) => [
    { ...data, updatedAt: new Date().toLocaleDateString(), id: docRef.id },
    ...prev
  ]);

  setSelectedNote({ ...data, updatedAt: new Date().toLocaleDateString(), id: docRef.id });
  setModal(null);

  console.log("Saved to Firestore ✅");
} catch (error) {
  console.error("Error saving:", error);
}

  } catch (error) {
    console.error("Error saving:", error);
  }
};

  const handleEdit = async (data) => {
  try {
    // Update note in Firestore
    await updateNote(selectedNote.id, { ...data, updatedAt: new Date().toLocaleDateString() });

    // Update local state
    setNotes((prev) =>
      prev.map((n) => n.id === selectedNote.id ? { ...n, ...data, updatedAt: new Date().toLocaleDateString() } : n)
    );
    setSelectedNote((prev) => ({ ...prev, ...data, updatedAt: new Date().toLocaleDateString() }));
    setModal(null);

    console.log("Note updated in Firestore ✅");
  } catch (error) {
    console.error("Error updating note:", error);
  }
};

  const handleDelete = async () => {
  try {
    // Delete from Firestore
    await deleteNote(selectedNote.id);

    // Update local state
    setNotes((prev) => prev.filter((n) => n.id !== selectedNote.id));
    setSelectedNote(null);

    console.log("Note deleted from Firestore ✅");
  } catch (error) {
    console.error("Error deleting note:", error);
  }
};

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Inter, sans-serif", background: "#F9FAFB" }}>

    

      
      {/* Subjects Panel */}
      <div style={{
        width: 200, background: "#fff", borderRight: "1px solid #E5E7EB",
        display: "flex", flexDirection: "column", flexShrink: 0,
      }}>
        <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid #E5E7EB" }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>Subjects</h2>
        </div>
        <div style={{ padding: "10px 10px", flex: 1 }}>
          <div
            onClick={() => setSelectedSubject(null)}
            style={{
              padding: "8px 10px", borderRadius: 8, cursor: "pointer", marginBottom: 4,
              background: selectedSubject === null ? "#EEF6EE" : "transparent",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}
          >
            <span style={{ fontSize: 14, color: selectedSubject === null ? "#3B6B3E" : "#374151", fontWeight: selectedSubject === null ? 600 : 400 }}>All</span>
            <span style={{ fontSize: 12, color: "#9CA3AF", background: "#F3F4F6", borderRadius: 12, padding: "1px 7px" }}>{notes.length}</span>
          </div>
          {subjects.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelectedSubject(s.id === selectedSubject ? null : s.id)}
              style={{
                padding: "8px 10px", borderRadius: 8, cursor: "pointer", marginBottom: 4,
                background: selectedSubject === s.id ? "#EEF6EE" : "transparent",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}
            >
              <span style={{ fontSize: 14, display: "flex", alignItems: "center", gap: 7, color: selectedSubject === s.id ? "#3B6B3E" : "#374151", fontWeight: selectedSubject === s.id ? 600 : 400 }}>
                <span style={{ fontSize: 14 }}>{s.icon}</span> {s.name}
              </span>
              <span style={{ fontSize: 12, color: "#9CA3AF", background: "#F3F4F6", borderRadius: 12, padding: "1px 7px" }}>{subjectCount(s.id)}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 14px", borderTop: "1px solid #E5E7EB" }}>
          <button
            onClick={() => setModal("create")}
            style={{
              width: "100%", padding: "9px 0", borderRadius: 8,
              border: "1px solid #D1D5DB", background: "#fff",
              color: "#374151", fontSize: 13, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New Note
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div style={{
        width: 240, background: "#F9FAFB", borderRight: "1px solid #E5E7EB",
        display: "flex", flexDirection: "column", flexShrink: 0,
      }}>
        <div style={{ padding: "16px 14px 10px", borderBottom: "1px solid #E5E7EB" }}>
          <h3 style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 600, color: "#374151" }}>Notes</h3>
          <input
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "7px 11px", borderRadius: 8,
              border: "1px solid #E5E7EB", background: "#fff",
              fontSize: 13, color: "#374151", outline: "none", boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {filteredNotes.length === 0 ? (
            <div style={{ textAlign: "center", color: "#9CA3AF", fontSize: 13, marginTop: 40 }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📄</div>
              {search ? "No notes found" : "No notes yet"}
            </div>
          ) : (
            filteredNotes.map((note) => {
              const sub = subjects.find((s) => s.id === note.subject);
              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  style={{
                    padding: "10px 12px", borderRadius: 10, cursor: "pointer", marginBottom: 6,
                    background: selectedNote?.id === note.id ? "#fff" : "transparent",
                    border: selectedNote?.id === note.id ? "1px solid #D1FAE5" : "1px solid transparent",
                    boxShadow: selectedNote?.id === note.id ? "0 1px 4px rgba(0,0,0,0.07)" : "none",
                    transition: "all 0.12s",
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#111827", marginBottom: 3 }}>{note.title}</div>
                  <div style={{ fontSize: 12, color: "#6B7280", display: "flex", justifyContent: "space-between" }}>
                    <span>{sub?.icon} {sub?.name}</span>
                    <span>{note.updatedAt}</span>
                  </div>
                  {note.content && (
                    <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {note.content.slice(0, 50)}{note.content.length > 50 ? "…" : ""}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Note Viewer / Empty state */}
      <div style={{ flex: 1, background: "#fff", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {selectedNote ? (
          <NoteViewer
            note={selectedNote}
            onEdit={() => setModal("edit")}
            onDelete={handleDelete}
            onClose={() => setSelectedNote(null)}
          />
        ) : (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", color: "#9CA3AF",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
            <p style={{ fontSize: 16, fontWeight: 500, color: "#6B7280", margin: "0 0 8px" }}>Select a note</p>
            <p style={{ fontSize: 13, margin: "0 0 20px" }}>Or create a new one to get started</p>
            <button
              onClick={() => setModal("create")}
              style={{
                padding: "10px 24px", borderRadius: 10, border: "none",
                background: "#6B9B6E", color: "#fff", fontSize: 14, cursor: "pointer", fontWeight: 500,
              }}
            >
              + New Note
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal === "create" && (
        <NoteModal subjects={subjects} onSave={handleCreate} onClose={() => setModal(null)} />
      )}
      {modal === "edit" && selectedNote && (
        <NoteModal note={selectedNote} subjects={subjects} onSave={handleEdit} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
