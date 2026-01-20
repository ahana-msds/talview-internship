import React from "react";

const withLogger = (WrappedComponent) => {
    return function Enhanced(props) {
        console.log("component rendered");
        return <WrappedComponent {...props} />;
    };
};

export default withLogger;
