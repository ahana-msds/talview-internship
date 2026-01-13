import React from "react";

type Props = {
    name: string;
};

function Student({ name }: Props) {
    console.log("student component rendered");
    return <p>student: {name}</p>;
}

// React.memo prevents re-render if props do not change
export default React.memo(Student);