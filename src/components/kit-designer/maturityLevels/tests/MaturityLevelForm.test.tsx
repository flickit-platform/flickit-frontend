import { render, screen } from "@testing-library/react";
import MaturityLevelForm from "../MaturityLevelForm";
import { describe, it, vi, expect } from "vitest";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import userEvent from "@testing-library/user-event";
import { KitLanguageProvider } from "@/providers/KitProvider";

describe("MaturityLevelForm", () => {
  const newMaturityLevel = {
    title: "Test Level",
    description: "Test description",
    index: 1,
    value: 5,
  };

  const handleInputChange = vi.fn();
  const handleSave = vi.fn();
  const handleCancel = vi.fn();
  const setNewMaturityLevel = vi.fn();

  const renderForm = () =>
    render(
      <I18nextProvider i18n={i18n}>
        <MaturityLevelForm
          newMaturityLevel={newMaturityLevel}
          setNewMaturityLevel={setNewMaturityLevel}
          handleInputChange={handleInputChange}
          handleSave={handleSave}
          handleCancel={handleCancel}
        />
      </I18nextProvider>,
    );

  it("renders with initial values", async () => {
    renderForm();

    const titleInput = screen.getByTestId("title-id");
    const descriptionInput = screen.getByTestId("description-id");
    const valueInput = screen.getByTestId("value-id");

    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveValue("Test Level");

    expect(descriptionInput).toBeInTheDocument();
    expect(descriptionInput).toHaveValue("Test description");

    expect(valueInput).toBeInTheDocument();
    expect(valueInput).toHaveValue(5);
  });

  it("calls handleSave when clicking the save button", async () => {
    renderForm();

    const saveButton = screen.getByTestId("check-icon-id");
    await userEvent.click(saveButton);

    expect(handleSave).toHaveBeenCalled();
  });

  it("calls handleCancel when clicking the cancel button", async () => {
    renderForm();

    const cancelButton = screen.getByTestId("close-icon-id");
    await userEvent.click(cancelButton);

    expect(handleCancel).toHaveBeenCalled();
  });
});
