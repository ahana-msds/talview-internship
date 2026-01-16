import { render, screen, fireEvent } from "@testing-library/react";
import ControlledUpdateForm from "../components/forms/ControlledUpdateForm";
import { expect, test } from "vitest";

test("shows error on empty submit", () => {
    render(<ControlledUpdateForm />);

    fireEvent.click(screen.getByText(/add/i));

    expect(screen.getByText(/required/i)).toBeInTheDocument();
});
