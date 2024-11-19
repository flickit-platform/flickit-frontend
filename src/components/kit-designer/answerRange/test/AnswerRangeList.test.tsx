import {render, fireEvent, screen, waitFor} from "@testing-library/react";
import ListOfItems from "../AnswerRangeList";
import { vi } from "vitest";
import OptionContain from "@components/kit-designer/answerRange/options/optionsContain";
import React from "react";
import axios from "axios";
import {ServiceContext, ServiceProvider, useServiceContext} from "@providers/ServiceProvider";

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
const fetchQuery = vi.fn();
const EditAnswerRangeOption= vi.fn()

const MockServiceProvider = ({ children }: any) => {
    return <ServiceProvider>{children}</ServiceProvider>;
};

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
    // Click edit button for  edit
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

  it("allows editing options on answer Ranges",async ()=>{
    axios.post = vi.fn();
   await beforeEach(()=>{
      render(<MockServiceProvider>{mockAnswerRange.map(answerOption=>
          (
              <OptionContain
                  fetchQuery={fetchQuery}
                  key={answerOption.id}
                  answerOption={answerOption.answerOptions}
                  setChangeData={setChangeData}
              />
          ))
      }</MockServiceProvider>)
    })


    fireEvent.click(screen.getAllByTestId("item-edit-option-icon")[0]);
    fireEvent.change(screen.getByTestId("items-option-title"), {
      target: { value: "Updated option 1" },
    });
    fireEvent.change(screen.getByTestId("items-option-value"), {
      target: { value: 2 },
    });

    expect((screen.getByTestId("items-option-title")as any).value).toBe("Updated option 1")
    expect((screen.getByTestId("items-option-value")as any).value).toBe("2")
    // fireEvent.click(screen.getByTestId("item-save-option-icon"))
  })
});
