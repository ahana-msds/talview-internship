// Defining the structure (type) of props that this component will receive
type StudentProps = {
    name: string;          // student's name must be a string
    course: string;        // course name must be a string
    year: number;          // year must be a number
};

// Functional React component with typed props
function StudentCard(props: StudentProps) {

    // JSX returned by the component (UI part)
    return (
        <div style={{ border: "1px solid gray", padding: "10px", margin: "10px" }}>
            {/* Display student name */}
            <h3>{props.name}</h3>

            {/* Display course */}
            <p>Course: {props.course}</p>

            {/* Display academic year */}
            <p>Year: {props.year}</p>
        </div>
    );
}

// Exporting component so it can be used in other files
export default StudentCard;
