import { render, fireEvent, screen } from "@testing-library/react";
import { vi } from "vitest";
import ListOfItems from "../../common/GeneralList";
import { KitLanguageProvider } from "@/providers/KitProvider";

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

describe("ListOfItems (measure)", () => {
  const setup = () => {
    render(
      <ListOfItems
        items={mockItems}
        onEdit={mockOnEdit}
        onReorder={mockOnReorder}
        setOpenDeleteDialog={mockSetOpenDeleteDialog}
      />,
    );

    return {
      getTitle: () => screen.getByText("title test 1"),
      getEditButton: () => screen.getAllByTestId("items-edit-icon")[0],
      getDeleteButton: () => screen.getAllByTestId("items-delete-icon")[0],
      getTitleInput: () => screen.getByTestId("title-id"),
      getDescriptionInput: () => screen.getByTestId("description-id"),
      getSubmitButton: () => screen.getByTestId("items-check-icon"),
    };
  };

  it("renders item titles correctly", () => {
    const { getTitle } = setup();
    expect(getTitle()).toBeInTheDocument();
  });

  it("allows editing an item", () => {
    const {
      getEditButton,
      getTitleInput,
      getDescriptionInput,
      getSubmitButton,
    } = setup();

    fireEvent.click(getEditButton());

    fireEvent.change(getTitleInput(), {
      target: { value: "Updated title 1" },
    });
    fireEvent.change(getDescriptionInput(), {
      target: { value: "Updated Description 1" },
    });

    fireEvent.click(getSubmitButton());

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
    const { getDeleteButton } = setup();

    fireEvent.click(getDeleteButton());

    expect(mockSetOpenDeleteDialog).toHaveBeenCalledWith({
      status: true,
      id: 1,
    });
  });
});
