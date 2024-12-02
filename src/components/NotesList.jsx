import axios from "axios";
import React, { useEffect, useState } from "react";

function NotesList() {
    const [notes, setNotes] = useState([]);
    const [userName, setUserName] = useState("");
    const [userLast, setLast] = useState("");
    const [editingNote, setEditingNote] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");

    useEffect(() => {
        fetchNotes();
        const storedName = localStorage.getItem("first");
        const storedlast = localStorage.getItem("last");
        if (storedName && storedlast) {
            setUserName(storedName);
            setLast(storedlast);
        }
    }, []);

    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem("token");
            const resp = await axios.get('https://notes.devlop.tech/api/notes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setNotes(resp.data);
        } catch (err) {
            console.error("Error fetching notes:", err.response ? err.response.data : err.message);
            alert("Failed to fetch notes. Please try again.");
        }
    };

    const delet = async (noteId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://notes.devlop.tech/api/notes/${noteId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
        
        } catch (err) {
            console.error("Error deleting note:", err.response ? err.response.data : err.message);
            alert("Failed to delete the note. Please try again.");
        }
    };

    const updateNote = async (noteId, updatedData) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `https://notes.devlop.tech/api/notes/${noteId}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note.id === noteId ? { ...note, ...updatedData } : note
                )
            );
         
        } catch (err) {
            console.error("Error updating note:", err.response ? err.response.data : err.message);
            alert("Failed to update the note. Please try again.");
        }
    };

    return (
        <div className="container mt-5 ">
            <h1 className="text-center mb-4">Notes List</h1>
            <h4>Welcome, {userName} {userLast}</h4> 
            <div className="mb-3 d-flex justify-content-between">
                <button className="btn btn-danger" onClick={()=>{
                    alert('Hatin tochkan sber ka')
                }}>Log Out</button>

                <button className="btn btn-success" onClick={()=>{
                    alert('Hatin tochkan sber ka')
                }}>Add New Note</button>
            </div>
            {notes.length > 0 ? (
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Title</th>
                            <th scope="col">Content</th>
                            <th>Events</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notes.map((note, index) => (
                            <>
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{note.title}</td>
                                    <td>{note.content}</td>
                                    <td>
                                        <div className="d-flex justify-content-start gap-1">
                                            <button
                                                className="btn btn-success mr-2"
                                                onClick={() => {
                                                    setEditingNote(note);
                                                    setEditTitle(note.title);
                                                    setEditContent(note.content);
                                                }}
                                            >
                                                Update
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => delet(note.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {editingNote && editingNote.id === note.id && (
                                    <tr>
                                        <td colSpan="4">
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    updateNote(editingNote.id, { title: editTitle, content: editContent });
                                                    setEditingNote(null);
                                                }}
                                            >
                                                <div className="mb-3">
                                                    <label htmlFor="editTitle" className="form-label">Title</label>
                                                    <input
                                                        type="text"
                                                        id="editTitle"
                                                        className="form-control"
                                                        value={editTitle}
                                                        onChange={(e) => setEditTitle(e.target.value)}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="editContent" className="form-label">Content</label>
                                                    <textarea
                                                        id="editContent"
                                                        className="form-control"
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                    />
                                                </div>
                                                <div className="d-flex justify-content-start gap-2">
                                                    <button type="submit" className="btn btn-primary">Save</button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        onClick={() => setEditingNote(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-muted">No notes available.</p>
            )}

        </div>
    );
}

export default NotesList;