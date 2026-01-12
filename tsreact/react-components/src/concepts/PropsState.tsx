import { useState } from "react";

// Type for props
type CourseProps = {
  name: string;
};

// Child component receives data via props
function CourseCard(props: CourseProps) {
  return <p>Course: {props.name}</p>;
}

function PropsState() {

  // State controlled inside component
  const [count, setCount] = useState(0);

  return (
    <div>

      <h3>Props vs State</h3>

      {/* Props passed from parent */}
      <CourseCard name="AI Fundamentals" />
      <CourseCard name="Web Development" />

      {/* State is internal */}
      <p>Registrations Today: {count}</p>

      <button onClick={() => setCount(count + 1)}>
        Add Registration
      </button>

    </div>
  );
}

export default PropsState;
