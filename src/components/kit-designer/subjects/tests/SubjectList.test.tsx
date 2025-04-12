import { render, fireEvent, screen } from "@testing-library/react";
import { vi } from "vitest";
import ListOfItems from "../../common/GeneralList";

const mockItems = [
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
const mockSetOpenDeleteDialog = vi.fn();

describe("ListOfItems (subject)", () => {
  beforeEach(() => {
    render(
      <ListOfItems
        items={mockItems}
        onEdit={mockOnEdit}
        deleteBtn={true}
        onReorder={mockOnReorder}
        name="subject"
        setOpenDeleteDialog={mockSetOpenDeleteDialog}
      />,
    );
  });

  it("renders item titles correctly", () => {
    expect(screen.getByText("title test 1")).toBeInTheDocument();
  });

  it("allows editing an item", () => {
    const editButtons = screen.getAllByTestId("items-edit-icon");
    fireEvent.click(editButtons[0]);

    fireEvent.change(screen.getByTestId("items-title"), {
      target: { value: "Updated title 1" },
    });
    fireEvent.change(screen.getByTestId("items-description"), {
      target: { value: "Updated Description 1" },
    });

    fireEvent.click(screen.getByTestId("items-check-icon"));

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

  it("triggers delete dialog when delete icon is clicked", () => {
    const deleteButtons = screen.getAllByTestId("items-delete-icon");
    fireEvent.click(deleteButtons[0]);

    expect(mockSetOpenDeleteDialog).toHaveBeenCalledWith({
      status: true,
      id: 1,
    });
  });
});
