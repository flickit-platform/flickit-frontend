import { render, fireEvent, screen } from "@testing-library/react";
import MaturityLevelList from "../MaturityLevelList";
import { IMaturityLevel } from "@/types/index";
import { vi } from "vitest";
import { DeleteConfirmationDialog } from "@common/dialogs/DeleteConfirmationDialog";
import { KitLanguageProvider } from "@/providers/kit-provider";

// Mock data for maturity levels
const mockMaturityLevels: IMaturityLevel[] = [
  {
    id: 1,
    title: "Level 1",
    description: "Description 1",
    value: 1,
    index: 1,
    translations: { FA: { title: "fa", description: "fa" } },
  },
  { id: 2, title: "Level 2", description: "Description 2", value: 2, index: 2 },
];

const mockSetOpenDeleteDialog = vi.fn();
const mockOnEdit = vi.fn();
const mockOnDelete = vi.fn();
const mockOnReorder = vi.fn();

describe("MaturityLevelList", () => {
  it("renders maturity levels correctly", () => {
    render(
      <KitLanguageProvider>
        <MaturityLevelList
          maturityLevels={mockMaturityLevels}
          onEdit={mockOnEdit}
          onReorder={mockOnReorder}
          setOpenDeleteDialog={mockSetOpenDeleteDialog}
        />
      </KitLanguageProvider>,
    );

    expect(screen.getByText("Level 1")).toBeInTheDocument();
    expect(screen.getByText("Level 2")).toBeInTheDocument();
  });

  it("allows editing a maturity level", () => {
    render(
      <KitLanguageProvider>
        <MaturityLevelList
          maturityLevels={mockMaturityLevels}
          onEdit={mockOnEdit}
          onReorder={mockOnReorder}
          setOpenDeleteDialog={mockSetOpenDeleteDialog}
        />
      </KitLanguageProvider>,
    );

    // Click edit button for Level 1
    fireEvent.click(screen.getAllByTestId("edit-icon-id")[0]);

    // Change title and description
    fireEvent.change(screen.getByTestId("title-id"), {
      target: { value: "Updated Level 1" },
    });
    fireEvent.change(screen.getByTestId("description-id"), {
      target: { value: "Updated Description 1" },
    });

    // Save the changes
    fireEvent.click(screen.getByTestId("check-icon-id"));

    // Check if onEdit was called with the updated values
    expect(mockOnEdit).toHaveBeenCalledWith({
      id: 1,
      index: 1,
      value: 1,
      title: "Updated Level 1",
      description: "Updated Description 1",
      translations: undefined,
    });
  });

  it("allows deleting a maturity level", () => {
    render(
      <KitLanguageProvider>
        <MaturityLevelList
          maturityLevels={mockMaturityLevels}
          onEdit={mockOnEdit}
          onReorder={mockOnReorder}
          setOpenDeleteDialog={mockSetOpenDeleteDialog}
        />
        <DeleteConfirmationDialog
          open={true} // Simulate the dialog being open
          onClose={mockSetOpenDeleteDialog}
          onConfirm={mockOnDelete}
          title="Warning"
          content="Are you sure you want to delete this maturity level?"
        />
      </KitLanguageProvider>,
    );

    // Click delete button for Level 1
    fireEvent.click(screen.getAllByTestId("delete-icon-id")[0]);

    // Confirm delete action
    fireEvent.click(screen.getByTestId("submit"));

    // Check if onDelete was called
    expect(mockOnDelete).toHaveBeenCalled();

    // Close the dialog
    fireEvent.click(screen.getByTestId("cancel"));
    expect(mockSetOpenDeleteDialog).toHaveBeenCalled();
  });
});
