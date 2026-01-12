import { useEffect, useState } from "react";

function UseStateEffect() {

    const [seats, setSeats] = useState(50);

    // Runs when seats change
    useEffect(() => {
        console.log("Seats updated:", seats);
    }, [seats]);

    return (
        <div>

            <h3>Seat Availability</h3>

            <p>Remaining Seats: {seats}</p>

            <button onClick={() => setSeats(seats - 1)}>
                Enroll Student
            </button>

        </div>
    );
}

export default UseStateEffect;
