import { useState } from "react";

function VirtualDom() {

    // State for number of registered students
    const [registered, setRegistered] = useState(10);

    return (
        <div>

            <h3>Course Registration Counter</h3>

            {/* UI reflects state */}
            <p>Registered Students: {registered}</p>

            {/* React updates only this part using Virtual DOM */}
            <button onClick={() => setRegistered(registered + 1)}>
                Register Student
            </button>

        </div>
    );
}

export default VirtualDom;
