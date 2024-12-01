import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import userEvent from "@testing-library/user-event";
import AttributeForm from "@components/kit-designer/attributes/AttributeForm";

describe("AttributeForm", () => {
    const newAttributeForm = {
        title: "Test attribute title",
        description: "Test attribute description",
        weight:3,
        index: 1,
        value: 5,
    };



    const handleInputChange = vi.fn();
    const handleSave = vi.fn();
    const handleCancel = vi.fn();

    const renderForm = () =>
        render(
            <I18nextProvider i18n={i18n}>
                <AttributeForm
                    newAttribute={newAttributeForm}
                    handleCancel={handleCancel}
                    handleSave={handleSave}
                    handleInputChange={handleInputChange}
                />
            </I18nextProvider>
        );



    it("renders with initial values", async () => {
        renderForm();
        let titleInput : any = screen.getByTestId("attribute-from-title");
        let descriptionInput : any = screen.getByTestId("attribute-from-description");
        let weightInput : any = screen.getByTestId("attribute-from-weight");

        expect(titleInput).toBeInTheDocument();
        expect(titleInput).toHaveValue("Test attribute title");

        expect(descriptionInput).toBeInTheDocument();
        expect(descriptionInput).toHaveValue("Test attribute description");

        expect(weightInput).toBeInTheDocument();
        expect(weightInput).toHaveValue(3);

    });

    it("calls handleSave when clicking the save button", async () => {
        renderForm();

        const saveButton = screen.getByTestId("attribute-save-icon");
        expect(saveButton).toBeInTheDocument()
        await userEvent.click(saveButton);

        expect(handleSave).toHaveBeenCalled();
    });

    it("calls handleCancel when clicking the cancel button", async () => {
        renderForm();

        const cancelButton =  screen.getByTestId("attribute-close-icon");
        expect(cancelButton).toBeInTheDocument()
        await userEvent.click(cancelButton);

        expect(handleCancel).toHaveBeenCalled();
    });

    it("calls handel change when clicking the edit button", async () => {

       await  renderForm();

       fireEvent.change(screen.getByTestId("attribute-from-title") ,{
            target: { value: "Updated Test attribute title" },
        })

        fireEvent.change(screen.getByTestId("attribute-from-description") ,{
            target: { value: "Updated Test attribute description" },
        })

        fireEvent.change(screen.getByTestId("attribute-from-weight") ,{
            target: { value: "Updated Test attribute weight" },
        })

        const saveButton = screen.getByTestId("attribute-save-icon");
         fireEvent.click(saveButton);

        expect(handleInputChange).toHaveBeenCalled()
        expect(handleInputChange).toHaveBeenCalledTimes(3)

    });
});
