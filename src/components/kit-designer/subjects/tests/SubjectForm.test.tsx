import { render, screen } from "@testing-library/react";
import SubjectForm from "../SubjectForm";
import { describe, it, vi, expect } from "vitest";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import userEvent from "@testing-library/user-event";
import { KitLanguageProvider } from "@/providers/KitProvider";

describe("SubjectForm", () => {
  const newItem = {
    title: "title test",
    description: "description test",
    translations: {
      FA: {
        title: "title-translations-test",
        description: "descriptions-translations-test",
      },
    },
    index: 1,
    value: 2,
    weight: 3,
  };

  const handleInputChange = vi.fn();
  const handleSave = vi.fn();
  const handleCancel = vi.fn();
  const setNewSubject = vi.fn();

  const setup = () => {
    render(
      <KitLanguageProvider>
        <I18nextProvider i18n={i18n}>
          <SubjectForm
            newSubject={newItem}
            handleInputChange={handleInputChange}
            handleSave={handleSave}
            handleCancel={handleCancel}
            setNewSubject={setNewSubject}
          />
        </I18nextProvider>
      </KitLanguageProvider>,
    );

    return {
      getTitleInput: () => screen.getByTestId("title-id"),
      getDescriptionInput: () => screen.getByTestId("description-id"),
      getValueInput: () => screen.getByTestId("value-id"),
      getSaveButton: () => screen.getByTestId("check-icon-id"),
      getCancelButton: () => screen.getByTestId("close-icon-id"),
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
