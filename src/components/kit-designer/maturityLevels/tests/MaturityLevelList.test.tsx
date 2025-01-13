import { render, fireEvent, screen } from "@testing-library/react";
import MaturityLevelList from "../MaturityLevelList";
import { IMaturityLevel } from "@/types";
import { vi } from "vitest";
import { DeleteConfirmationDialog } from "@common/dialogs/DeleteConfirmationDialog";

// Mock data for maturity levels
const mockMaturityLevels: IMaturityLevel[] = [
  { id: 1, title: "Level 1", description: "Description 1", value: 1, index: 1 },
  { id: 2, title: "Level 2", description: "Description 2", value: 2, index: 2 },
];

const mockSetOpenDeleteDialog = vi.fn();
const mockOnEdit = vi.fn();
const mockOnDelete = vi.fn();
const mockOnReorder = vi.fn();

describe("MaturityLevelList", () => {
  it("renders maturity levels correctly", () => {
    render(
      <MaturityLevelList
        maturityLevels={mockMaturityLevels}
        onEdit={mockOnEdit}
        onReorder={mockOnReorder}
        setOpenDeleteDialog={mockSetOpenDeleteDialog}
      />
    );

    expect(screen.getByText("Level 1")).toBeInTheDocument();
    expect(screen.getByText("Level 2")).toBeInTheDocument();
  });

  it("allows editing a maturity level", () => {
    render(
      <MaturityLevelList
        maturityLevels={mockMaturityLevels}
        onEdit={mockOnEdit}
        onReorder={mockOnReorder}
        setOpenDeleteDialog={mockSetOpenDeleteDialog}
      />
    );

    // Click edit button for Level 1
    fireEvent.click(screen.getAllByTestId("maturity-level-edit-icon")[0]);

    // Change title and description
    fireEvent.change(screen.getByTestId("maturity-level-title"), {
      target: { value: "Updated Level 1" },
    });
    fireEvent.change(screen.getByTestId("maturity-level-description"), {
      target: { value: "Updated Description 1" },
    });

    // Save the changes
    fireEvent.click(screen.getByTestId("maturity-level-check-icon"));

    // Check if onEdit was called with the updated values
    expect(mockOnEdit).toHaveBeenCalledWith({
      id: 1,
      index: 1,
      value: 1,
      title: "Updated Level 1",
      description: "Updated Description 1",
    });
  });

  it("allows deleting a maturity level", () => {
    // Render the list and delete confirmation dialog together
    render(
      <>
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
      </>
    );

    // Click delete button for Level 1
    fireEvent.click(screen.getAllByTestId("maturity-level-delete-icon")[0]);


    // Confirm delete action
    fireEvent.click(screen.getByTestId("submit"));

    // Check if onDelete was called
    expect(mockOnDelete).toHaveBeenCalled();

    // Close the dialog
    fireEvent.click(screen.getByTestId("cancel"));
    expect(mockSetOpenDeleteDialog).toHaveBeenCalled();
  });
});
