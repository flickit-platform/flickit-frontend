import AssessmentCEFromDialog from "../AssessmentCEFromDialog";
import { describe, it, vi, expect } from "vitest";
import {render, screen, within} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {ServiceProvider} from "@providers/ServiceProvider";
import { AppProvider } from "@providers/AppProvider";
import userEvent from "@testing-library/user-event";

const SubmitForm = vi.fn()

let usedDialog = {
    openDialog: () => {},
    onClose: () => {},
    context: {
        type: "create",
        space: {
            id: "6",
            title: "admin"
        },
    },
    open: true,
};

const MockProviders = ({ children }: any) => (
    <MemoryRouter>
        <AppProvider>
            <ServiceProvider>
                {children}
            </ServiceProvider>
        </AppProvider>
    </MemoryRouter>
);

const renderDialog = () => {
    render(
        <MockProviders>
            <AssessmentCEFromDialog {...usedDialog} onSubmitForm={SubmitForm} />
        </MockProviders>,
    );
};

describe("create new assessment by dialog", () => {

    afterEach(() => {
        vi.clearAllMocks();
    });

  it("open dialog", () => {
    renderDialog();
    const title = screen.getByTestId("input-title");
    const shortTitle = screen.getByTestId("input-shortTitle");

    expect(title).toBeInTheDocument();
    expect(shortTitle).toBeInTheDocument();
  });

    it("create new assessment", async () => {
        renderDialog();

        const inputBox = within(screen.getByTestId("input-title")).getByRole("textbox");
        await userEvent.type(inputBox, "My New Assessment");
        expect(screen.getByDisplayValue("My New Assessment")).toBeInTheDocument();

        const shortTitleBox = within(screen.getByTestId("input-shortTitle")).getByRole("textbox");
        await userEvent.type(shortTitleBox, "MNA");
        expect(screen.getByDisplayValue("MNA")).toBeInTheDocument();

        const languageInput = screen.getByTestId("language-value");
        await userEvent.type(languageInput, "fa");

        // todo
        expect(screen.getByTestId("submit")).toBeInTheDocument();
        await userEvent.click(screen.getByTestId("submit"));

    });

});
