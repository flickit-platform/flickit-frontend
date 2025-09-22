import AssessmentCEFromDialog from "../AssessmentCEFromDialog";
import { describe, it, vi, expect } from "vitest";
import {render, screen, waitFor, within} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {ServiceProvider} from "@providers/ServiceProvider";
import { AppProvider } from "@providers/AppProvider";
import userEvent from "@testing-library/user-event";

const mockCreate = vi.fn().mockResolvedValue({});
const mockUpdate = vi.fn().mockResolvedValue({});
const SubmitForm = vi.fn()


vi.mock("@providers/ServiceProvider", () => {
    return {
        useServiceContext: () => ({
            service: {
                assessments: {
                    info: {
                        create: mockCreate,
                        update: mockUpdate,
                    },
                },
            },
        }),
    };
});


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

    // {
    //     "title": "test 1 ",
    //     "shortTitle": "testy",
    //     "assessment_kit": {"id": 463, "title": "Maziyar - Paid kits Test", "isPrivate": false, "mainLanguage": {"code": "EN", "title": "English"},
    //     "languages": [{"code": "EN", "title": "English"}]},
    //     "language": {"code": "EN", "title": "English"}
    // }

  it("open dialog", () => {
    renderDialog();
    const title = screen.getByTestId("input-title");
    const shortTitle = screen.getByTestId("input-shortTitle");

    expect(title).toBeInTheDocument();
    expect(shortTitle).toBeInTheDocument();
  });

    it("submits assessment form and calls axios.post", async () => {
        renderDialog();

        const inputBox = within(screen.getByTestId("input-title")).getByRole("textbox");
        await userEvent.type(inputBox, "My New Assessment");

        const shortTitleBox = within(screen.getByTestId("input-shortTitle")).getByRole("textbox");
        await userEvent.type(shortTitleBox, "MNA");

        const languageInput = screen.getByTestId("inputLanguage");
        await userEvent.type(languageInput, "fa");

        expect(screen.getByTestId("submit")).toBeInTheDocument();
        await userEvent.click(screen.getByTestId("submit"));

        await waitFor(() => {
       expect(mockCreate).toHaveBeenCalled()
        });
    });

});
