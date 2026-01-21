
import React from 'react';

// hoc that adds logging functionality to any component
// it intercepts props and logs when an action occurs
const withActionLogger = (WrappedComponent) => {
    return (props) => {
        // custom log function injected into wrapped component
        const logAction = (actionName) => {
            console.log(`[action logger]: ${actionName} triggered at ${new Date().toLocaleTimeString()}`);
        };

        // pass original props and the new logAction prop
        return <WrappedComponent {...props} logAction={logAction} />;
    };
};

export default withActionLogger;
