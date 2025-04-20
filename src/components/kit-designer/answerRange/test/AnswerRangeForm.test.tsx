import { describe, it, vi, expect } from "vitest";
import AnswerRangeForm from "@components/kit-designer/answerRange/AnswerRangeForm";
import { fireEvent, render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import userEvent from "@testing-library/user-event";

describe("answer range test form", () => {
  const mockHandleInputChange = vi.fn();
  const mockHandleSave = vi.fn();
  const mockHandleCancel = vi.fn();
  const setNewAnswerRange = vi.fn();

  const mockNewAnswerRange = {
    title: "title 1",
    translations: {
      FA: {
        title: "translation title test",
        description: "translation description test",
      },
    },
    index: 1,
    id: null,
  };

  const renderForm = () => {
    render(
      <I18nextProvider i18n={i18n}>
        <AnswerRangeForm
          newItem={mockNewAnswerRange}
          handleInputChange={mockHandleInputChange}
          handleSave={mockHandleSave}
          handleCancel={mockHandleCancel}
          setNewAnswerRange={setNewAnswerRange}
        />
      </I18nextProvider>,
    );
  };

  it("renders with initial values", () => {
    renderForm();

    const titleInput: any = screen.getByTestId("title-id");
    expect(titleInput).toBeInTheDocument();
    expect(titleInput.value).toBe("title 1");
  });

  it("calls handleSave when clicking the save button", () => {
    renderForm();
    const titleInput = screen.getByTestId("title-id");
    const saveBtn = screen.getByTestId("check-icon");
    expect(titleInput).toBeInTheDocument();
    fireEvent.change(titleInput, { target: { value: "update title 1" } });
    fireEvent.click(saveBtn);
    expect(mockHandleSave).toHaveBeenCalled();
  });

  it("calls handleCancel when clicking the cancel button", async () => {
    renderForm();
    const cancelButton = screen.getByTestId("close-icon");
    await userEvent.click(cancelButton);
    expect(mockHandleCancel).toHaveBeenCalled();
  });
});
