import { render, screen } from "@testing-library/react";
import SubjectForm from "../SubjectForm";
import { describe, it, vi, expect } from "vitest";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import userEvent from "@testing-library/user-event";

describe("SubjectForm", () => {
  const newItem = {
    title: "title test",
    description: "description test",
    index: 1,
    value: 2,
    weight: 3,
  };

  const handleInputChange = vi.fn();
  const handleSave = vi.fn();
  const handleCancel = vi.fn();

  const setup = () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SubjectForm
          newSubject={newItem}
          handleInputChange={handleInputChange}
          handleSave={handleSave}
          handleCancel={handleCancel}
        />
      </I18nextProvider>,
    );

    return {
      getTitleInput: () => screen.getByTestId("subject-title"),
      getDescriptionInput: () => screen.getByTestId("subject-description"),
      getValueInput: () => screen.getByTestId("subject-value"),
      getSaveButton: () => screen.getByTestId("subject-check-icon"),
      getCancelButton: () => screen.getByTestId("subject-close-icon"),
    };
  };

  it("renders with initial values", () => {
    const { getTitleInput, getDescriptionInput, getValueInput } = setup();

    expect(getTitleInput()).toBeInTheDocument();
    expect(getTitleInput()).toHaveValue("title test");

    expect(getDescriptionInput()).toBeInTheDocument();
    expect(getDescriptionInput()).toHaveValue("description test");

    expect(getValueInput()).toBeInTheDocument();
    expect(getValueInput()).toHaveValue(2);
  });

  it("calls handleSave when clicking the save button", async () => {
    const { getSaveButton } = setup();
    await userEvent.click(getSaveButton());
    expect(handleSave).toHaveBeenCalled();
  });

  it("calls handleCancel when clicking the cancel button", async () => {
    const { getCancelButton } = setup();
    await userEvent.click(getCancelButton());
    expect(handleCancel).toHaveBeenCalled();
  });
});
