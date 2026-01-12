// Importing reusable StudentCard component
import StudentCard from "./student/StudentCard";

// Main App component
function App() {

  // Data that will be passed to components as props
  const students = [
    { name: "Ahana", course: "Data Science", year: 2 },
    { name: "Harsha", course: "Interior Designing", year: 1 },
    { name: "Prantika", course: "MBA", year: 3 }
  ];

  // JSX returned by App component
  return (
    <div style={{ padding: "20px" }}>

      {/* App heading */}
      <h2>Student Profiles</h2>

      {/* Loop through students array and create StudentCard for each */}
      {students.map((student, index) => (

        // Passing props to StudentCard component
        <StudentCard
          key={index}                // unique key for React rendering
          name={student.name}        // passing name
          course={student.course}    // passing course
          year={student.year}        // passing year
        />
      ))}

    </div>
  );
}

// Export App component to be rendered by ReactDOM
export default App;
