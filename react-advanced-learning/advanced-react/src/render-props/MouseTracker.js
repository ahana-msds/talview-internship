import React, { useState } from "react";

export default function MouseTracker({ render }) {
    const [pos, setPos] = useState({ x: 0, y: 0 });

    return (
        <div
            onMouseMove={(e) =>
                setPos({ x: e.clientX, y: e.clientY })
            }
            style={{ height: "200px" }}
        >
            {render(pos)}
        </div>
    );
}
