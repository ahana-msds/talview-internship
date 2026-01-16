import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import Button from "./Button";

test("button renders and handles click", () => {
    const handleClick = vi.fn();

    render(<Button onClick={handleClick} />);

    const button = screen.getByText("Click Me");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
});
