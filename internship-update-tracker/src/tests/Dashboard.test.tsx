import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import { expect, test } from "vitest";


test("shows loading state initially", () => {
    render(
        <BrowserRouter>
            <Dashboard />
        </BrowserRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
});
