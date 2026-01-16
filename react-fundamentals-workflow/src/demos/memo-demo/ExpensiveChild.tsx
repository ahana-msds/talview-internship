import React from "react";

interface Props {
    value: number;
}

function ExpensiveChild({ value }: Props) {
    console.log("Child rendered");
    return <p>Value received: {value}</p>;
}

export default React.memo(ExpensiveChild);
