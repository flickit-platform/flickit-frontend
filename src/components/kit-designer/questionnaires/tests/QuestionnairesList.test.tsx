import { render, fireEvent, screen } from "@testing-library/react";
import { vi } from "vitest";
import ListOfItems from "@/components/kit-designer/questionnaires/QuestionnaireList";

const mockQuestionnaires = [
  {
    id: 1,
    title: "title test 1",
    value: 1,
    index: 1,
    description: "description test 1",
    questionsCount: 0,
  },
  {
    id: 2,
    title: "title test 2",
    value: 2,
    index: 2,
    description: "description test 2",
    questionsCount: 3,
  },
];

const mockOnEdit = vi.fn();
const mockOnDelete = vi.fn();
const mockOnReorder = vi.fn();
const mockName = "questionnaires";
const deleteBtn = true;
const mockSetOpenDeleteDialog = vi.fn();

describe("questionnairesList", () => {
  beforeEach(() => {
    render(
      <ListOfItems
        items={mockQuestionnaires}
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
    expect(screen.getByText("title test 2")).toBeInTheDocument();
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
