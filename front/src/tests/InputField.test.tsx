/// <reference types="vitest" />
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import InputField from "../components/global/inputField";

describe("InputField component", () => {
  const label = "Adresse";
  const placeholder = "Tapez une adresse";
  let value = "";
  const setValue = vi.fn((val: string) => {
    value = val;
  });

  beforeEach(() => {
    value = "";
    setValue.mockClear();
  });

  it("renders label and input with initial value", () => {
    render(
      <InputField
        label={label}
        placeholder={placeholder}
        value={value}
        setValue={setValue}
      />
    );

    expect(screen.getByLabelText(label)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(placeholder)).toHaveValue("");
  });

  it("calls setValue on typing", () => {
    render(
      <InputField
        label={label}
        placeholder={placeholder}
        value={value}
        setValue={setValue}
      />
    );

    const input = screen.getByPlaceholderText(placeholder);
    fireEvent.change(input, { target: { value: "Paris" } });

    expect(setValue).toHaveBeenCalledWith("Paris");
  });
});
