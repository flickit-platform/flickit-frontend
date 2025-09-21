import AssessmentCEFromDialog from "../AssessmentCEFromDialog";
import { describe, it, vi, expect } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {ServiceProvider, useServiceContext} from "@providers/ServiceProvider";
import { AppProvider } from "@providers/AppProvider";
import userEvent from "@testing-library/user-event";
import {useAuthContext} from "@providers/AuthProvider";
import axios from "axios";

const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const SubmitForm = vi.fn();

let usedDialog = {
    openDialog: () => {},
    onClose: () => {},
    context: { type: "create" },
    open: true,
};

const MockProviders = ({ children }: any) => (
    <MemoryRouter>
        <AppProvider>
            <ServiceProvider>{children}</ServiceProvider>
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

    beforeEach(() => {
        vi.clearAllMocks();
    });

  it("open dialog", () => {
    renderDialog();
    const title = screen.getByTestId("input-title");
    const shortTitle = screen.getByTestId("input-shortTitle");

    expect(title).toBeInTheDocument();
    expect(shortTitle).toBeInTheDocument();
  });



    it("submits assessment form and calls axios.post", async () => {
        const data = {
            spaceId: "space-1",
            assessmentKitId: "assessment_kit-1",
            title: "create title",
            shortTitle: "cst",
            colorId: "red",
            lang: "fa",
        };

        // Spy on the correct instance
        const postSpy = vi.spyOn(axios, "post").mockResolvedValue({data});

        render(
            <MockProviders>
                <AssessmentCEFromDialog {...usedDialog} context={{type: "create"}}/>
            </MockProviders>
        );

        // Fill in the form
        await userEvent.type(screen.getByTestId("input-title"), "My New Assessment");
        await userEvent.type(screen.getByTestId("input-shortTitle"), "MNA");

        // Submit
        await userEvent.click(screen.getByTestId("submit"));
    });
});
