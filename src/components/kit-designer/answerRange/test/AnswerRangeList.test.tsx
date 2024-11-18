import { render, fireEvent, screen } from "@testing-library/react";
import ListOfItems from "../AnswerRangeList";
import { vi } from "vitest";

const mockAnswerRange = [
  { key:1, id: 1, answerOptions: [
          {id: 11, title: 'option1', index: 1, value: 1}],
      title: "title 1"},
  { key: 2, id: 2, answerOptions: [
          {id: 22, title: 'option2', index: 1, value: 1}],
      title: "title 2"},
];

const mockOnEdit = vi.fn();
const mockOnDelete = vi.fn();
const mockOnReorder = vi.fn();
const setChangeData = vi.fn();
describe("AnswerRangeList", () => {
  beforeEach(() => {
    render(
      <ListOfItems
          items={mockAnswerRange}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          deleteBtn={false}
          onReorder={mockOnReorder}
          setChangeData={setChangeData}
          name={"answerRange"}
      />,
    );
  });

  it("renders Answer Range correctly", () => {
    expect(screen.getByText("title 1")).toBeInTheDocument();
    expect(screen.getByText("title 2")).toBeInTheDocument();
  });

  it("allows editing a answer Ranges", () => {
    // Click edit button for Level 1
    fireEvent.click(screen.getAllByTestId("items-edit-icon")[0]);

    // Change title and description
    fireEvent.change(screen.getByTestId("items-title"), {
      target: { value: "Updated title 1" },
    });

    // Save the changes
    fireEvent.click(screen.getByTestId("items-check-icon"))

    // Check if onEdit was called with the updated values
    expect(mockOnEdit).toHaveBeenCalledWith({
      id: 1,
      key:1,
      title: "Updated title 1",
      answerOptions:[{id: 11, title: 'option1', index: 1, value: 1}]
    });
  });
});
