import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import CreateSpaceDialog from "./CreateSpaceDialog";
import { ServiceProvider } from "@/providers/service-provider";
import { ToastContainer } from "react-toastify";
import axios from "axios";

vi.mock("@providers/ServiceProvider", () => ({
  useServiceContext: () => ({
    service: {
      createSpace: vi.fn().mockResolvedValue({ data: { id: 1 } }),
      updateSpace: vi.fn().mockResolvedValue({}),
      seenSpaceList: vi.fn().mockResolvedValue({}),
    },
  }),
}));

vi.mock("axios", () => ({
  default: {
    defaults: { headers: {}, withCredentials: false },
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),  },
}));
const mockOnClose = vi.fn();
const mockOnSubmitForm = vi.fn();
const renderDialog = (mockContext: any) =>{
  render(
      <MemoryRouter>
        <ServiceProvider>
          <CreateSpaceDialog
              open={true}
              openDialog={true}
              onClose={mockOnClose}
              onSubmitForm={mockOnSubmitForm}
              context={mockContext}
              allowCreateBasic={true}
              titleStyle={{ mb: 0 }}
              contentStyle={{ p: 0 }}
          />
        </ServiceProvider>
        <ToastContainer />
      </MemoryRouter>,
  )
}

describe("CreateSpaceDialog", () => {
  it("renders input field, buttons and handles submission properly", async () => {

    axios.post = vi.fn().mockResolvedValue({ data: { id: 1 } });
        renderDialog({
          type: "create"
        })
        const clickNext = screen.getByTestId("next-step-modal");
        fireEvent.click(clickNext);
        const inputContainer = screen.getByTestId("input-title");
        await expect(inputContainer).toBeInTheDocument();

        const inputElement = inputContainer.querySelector("input");
        expect(inputElement).toBeInTheDocument();
        expect(inputElement).toHaveAttribute("type", "text");

        if (inputElement) {
          await userEvent.clear(inputElement);
          await userEvent.type(inputElement, "New Space");
          expect(inputElement).toHaveValue("New Space");
        }
  });

  it("calls closeDialog when the cancel button is clicked", async () => {
    const mockOnClose = vi.fn();
    const mockOnSubmitForm = vi.fn();

    render(
      <MemoryRouter>
        <ServiceProvider>
          <CreateSpaceDialog
            open={true}
            onClose={mockOnClose}
            onSubmitForm={mockOnSubmitForm}
            allowCreateBasic={true}
            titleStyle={{ mb: 0 }}
            contentStyle={{ p: 0 }}
          />
        </ServiceProvider>
        <ToastContainer />
      </MemoryRouter>,
    );

    const cancelButton = screen.getByTestId("close-btn");
    expect(cancelButton).toBeInTheDocument();

    await userEvent.click(cancelButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("renders input field, pre-fills data for update, and handles submission properly", async () => {
    const mockContext = {
      type: "update",
      data: {
        id: 1,
        title: "Existing Space",
      },
    };


    // Mock axios.put for the update operation
      axios.put = vi.fn().mockResolvedValue({ data: { id: 1 } });
      renderDialog(mockContext)

            const inputContainer = screen.getByTestId("input-title");
            expect(inputContainer).toBeInTheDocument();

            const inputElement = inputContainer.querySelector("input");
            expect(inputElement).toBeInTheDocument();
            expect(inputElement).toHaveAttribute("type", "text");

            expect(inputElement).toHaveValue("Existing Space");

            if (inputElement) {
                await userEvent.clear(inputElement);
                await userEvent.type(inputElement, "Updated Space");
                expect(inputElement).toHaveValue("Updated Space");
            }

            const submitButton = screen.getByTestId("submit");
            const cancelButton = screen.getByTestId("close-btn");
            expect(submitButton).toBeInTheDocument();
            expect(cancelButton).toBeInTheDocument();

        await userEvent.click(submitButton);

        await waitFor(() => {
          expect(axios.put).toHaveBeenCalledWith(
            `/api/v1/spaces/${mockContext.data.id}/`,
            { title: "Updated Space", type: "PREMIUM" },
            expect.anything(),
          );
          expect(axios.put).toHaveBeenCalled();
          expect(axios.put).toHaveBeenCalledWith(
            `/api/v1/spaces/${mockContext.data.id}/seen/`,
            expect.anything(),
          );
        });
        expect(mockOnSubmitForm).toHaveBeenCalledTimes(1);
  });
});
