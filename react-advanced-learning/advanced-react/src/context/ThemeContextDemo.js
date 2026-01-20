import React, { createContext, useContext } from "react";

const ThemeContext = createContext("light");

export default function ThemeContextDemo() {
    return (
        <ThemeContext.Provider value="dark">
            <Child />
        </ThemeContext.Provider>
    );
}

function Child() {
    const theme = useContext(ThemeContext);
    return <div>current theme: {theme}</div>;
}
