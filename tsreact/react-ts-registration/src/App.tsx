import { useState } from "react";
import InputField from "./registration/InputField";
import StudentList from "./registration/StudentList";
import type { Student } from "./types";

// Main App component
function App() {

  // ---------------- STATE ----------------

  const [name, setName] = useState("");        // student name
  const [email, setEmail] = useState("");      // student email
  const [course, setCourse] = useState("");    // student course

  const [students, setStudents] = useState<Student[]>([]); // only user-added students

  const [error, setError] = useState("");      // error message

  // ---------------- FORM SUBMIT ----------------

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // prevent page refresh

    // -------- VALIDATION --------
    if (!name || !email || !course) {
      setError("All fields are required");
      return;
    }

    if (!email.includes("@")) {
      setError("Invalid email");
      return;
    }

    // Create student object
    const newStudent: Student = { name, email, course };

    // Add to existing list
    setStudents([...students, newStudent]);

    // Reset form
    setName("");
    setEmail("");
    setCourse("");

    setError("");
  }

  // ---------------- UI ----------------

  return (
    <div style={{ padding: "20px" }}>

      <h2>Student Registration</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit}>

        <InputField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <InputField
          label="Email"
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputField
          label="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />

        <button type="submit">Register</button>
      </form>

      {/* ERROR MESSAGE */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* STUDENT LIST */}
      <StudentList students={students} />

    </div>
  );
}

export default App;
