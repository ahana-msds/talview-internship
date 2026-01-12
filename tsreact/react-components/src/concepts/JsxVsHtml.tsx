function JsxVsHtml() {

    // Course name stored in JS variable
    const courseName = "Data Science";

    // Number of seats
    const seats = 40;

    return (
        <div>

            {/* JSX uses className not class */}
            <h3 className="title">Course Info (JSX Demo)</h3>

            {/* Inject JS variable */}
            <p>Course: {courseName}</p>

            {/* Expression inside JSX */}
            <p>Available Seats: {seats - 5}</p>

            {/* Self-closing tag required in JSX */}
            <input placeholder="Search course" />

        </div>
    );
}

export default JsxVsHtml;
