import { render, fireEvent, screen } from "@testing-library/react";
import { vi } from "vitest";
import ListOfItems from "../../common/GeneralList";

const mockQSubject = [
  {
    id: 1,
    title: "title test 1",
    value: 1,
    index: 1,
    description: "description test 1",
    weight: 0,
  },
];

const mockOnEdit = vi.fn();
const mockOnReorder = vi.fn();
const mockName = "subject";
const deleteBtn = true;
const mockSetOpenDeleteDialog = vi.fn();

describe("subjectList", () => {
  beforeEach(() => {
    render(
      <ListOfItems
        items={mockQSubject}
        onEdit={mockOnEdit}
        deleteBtn={deleteBtn}
        onReorder={mockOnReorder}
        name={mockName}
        setOpenDeleteDialog={mockSetOpenDeleteDialog}
      />,
    );
  });

  it("renders ques levels correctly", () => {
    expect(screen.getByText("title test 1")).toBeInTheDocument();
  });

  it("allows editing a questionnaires", () => {
    // Click edit button for Level 1
    fireEvent.click(screen.getAllByTestId("items-edit-icon")[0]);

    // Change title and description
    fireEvent.change(screen.getByTestId("items-title"), {
      target: { value: "Updated title 1" },
    });
    fireEvent.change(screen.getByTestId("items-description"), {
      target: { value: "Updated Description 1" },
    });

    // Save the changes
    fireEvent.click(screen.getByTestId("items-check-icon"));

    // Check if onEdit was called with the updated values
    expect(mockOnEdit).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        index: 1,
        value: 1,
        title: "Updated title 1",
        description: "Updated Description 1",
      }),
    );
  });

  it("opens delete dialog when delete button is clicked", () => {
    fireEvent.click(screen.getAllByTestId("items-delete-icon")[0]);
    expect(mockSetOpenDeleteDialog).toHaveBeenCalledWith({
      status: true,
      id: 1,
    });
  });
});
