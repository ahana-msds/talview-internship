import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { test } from "vitest";

test("renders app without crashing", () => {
    render(
        <MemoryRouter>
            <App />
        </MemoryRouter>
    );
});
