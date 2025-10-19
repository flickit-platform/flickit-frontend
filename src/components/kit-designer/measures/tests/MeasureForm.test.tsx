import { render, screen } from "@testing-library/react";
import MeasureForm from "../MeasureForm";
import { describe, it, vi, expect } from "vitest";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import userEvent from "@testing-library/user-event";
import { KitLanguageProvider } from "@/providers/kit-provider";

describe("MeasureForm", () => {
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
  const setNewMeasure = vi.fn();

  const setup = () => {
    render(
      <KitLanguageProvider>
        <I18nextProvider i18n={i18n}>
          <MeasureForm
            newMeasure={newItem}
            handleInputChange={handleInputChange}
            handleSave={handleSave}
            handleCancel={handleCancel}
            setNewMeasure={setNewMeasure}
          />
        </I18nextProvider>
      </KitLanguageProvider>,
    );

    return {
      titleInput: screen.getByTestId("title-id"),
      descriptionInput: screen.getByTestId("description-id"),
      valueInput: screen.getByTestId("value-id"),
      saveButton: screen.getByTestId("check-icon-id"),
      cancelButton: screen.getByTestId("close-icon-id"),
    };
  };

  it("renders with initial values", () => {
    const { titleInput, descriptionInput, valueInput } = setup();

    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveValue("title test");

    expect(descriptionInput).toBeInTheDocument();
    expect(descriptionInput).toHaveValue("description test");

    expect(valueInput).toBeInTheDocument();
    expect(valueInput).toHaveValue(2);
  });

  it("calls handleSave when clicking the save button", async () => {
    const { saveButton } = setup();
    await userEvent.click(saveButton);
    expect(handleSave).toHaveBeenCalled();
  });

  it("calls handleCancel when clicking the cancel button", async () => {
    const { cancelButton } = setup();
    await userEvent.click(cancelButton);
    expect(handleCancel).toHaveBeenCalled();
  });
});
