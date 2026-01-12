import type { Student } from "../types";

// Props type for list
type Props = {
    students: Student[];
};

// Displays list of students
function StudentList({ students }: Props) {
    return (
        <div>
            <h3>Registered Students</h3>

            {/* Loop through students and display */}
            {students.map((s, index) => (
                <p key={index}>
                    {s.name} | {s.email} | {s.course}
                </p>
            ))}
        </div>
    );
}

export default StudentList;
