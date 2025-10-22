import { render, fireEvent, screen } from "@testing-library/react";
import { vi } from "vitest";
import ListOfItems from "@/components/kit-designer/questionnaires/QuestionnaireList";
import { KitLanguageProvider } from "@/providers/kit-provider";

const mockQuestionnaires = [
  {
    id: 1,
    title: "title test 1",
    value: 1,
    index: 1,
    description: "description test 1",
    questionsCount: 0,
  },
];

const mockOnEdit = vi.fn();
const mockOnReorder = vi.fn();
const mockSetOpenDeleteDialog = vi.fn();

describe("questionnairesList", () => {
  beforeEach(() => {
    render(
      <KitLanguageProvider>
        <ListOfItems
          items={mockQuestionnaires}
          onEdit={mockOnEdit}
          onReorder={mockOnReorder}
          setOpenDeleteDialog={mockSetOpenDeleteDialog}
        />
      </KitLanguageProvider>,
    );
  });

  it("renders ques levels correctly", () => {
    expect(screen.getByText("title test 1")).be
  });

  it("allows editing a questionnaires", () => {
    // Click edit button for Level 1
    fireEvent.click(screen.getAllByTestId("items-edit-icon")[0]);

    // Change title and description
    fireEvent.change(screen.getByTestId("title-id"), {
      target: { value: "Updated title 1" },
    });
    fireEvent.change(screen.getByTestId("description-id"), {
      target: { value: "Updated Description 1" },
    });

    // Save the changes
    fireEvent.click(screen.getByTestId("items-check-icon"));

    // Check if onEdit was called with the updated values
    expect(mockOnEdit).calledWith({
      id: 1,
      index: 1,
      value: 1,
      title: "Updated title 1",
      description: "Updated Description 1",
    });
  });

  it("opens delete dialog when delete button is clicked", () => {
    fireEvent.click(screen.getAllByTestId("items-delete-icon")[0]);
    expect(mockSetOpenDeleteDialog).calledWith({
      status: true,
      id: 1,
      title: "title test 1",
    });
  });
});
