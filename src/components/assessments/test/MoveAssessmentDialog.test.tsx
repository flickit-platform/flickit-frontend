import { describe, it, vi, expect } from "vitest";
import MoveAssessmentDialog from "../MoveAssessmentDialog";
import { render, screen } from "@testing-library/react";

describe("test for move assessment", () => {
  const SubmitForm = vi.fn();

  const moveAssessmentDialogProps = {
    context: {
      type: "create",
      staticData: {
        assessment_kit: { id: undefined, title: undefined },
        langList: [],
        queryDataSpaces: vi.fn(),
        spaceList: [
          {
            id: 1,
            isDefault: false,
            selected: false,
            title: "test",
            type: { code: "BASIC", title: "پایه" },
          },
        ],
      },
    },
    onClose: vi.fn(),
    open: true,
    openDialog: vi.fn(),
  };

  beforeEach(() => {
    render(
      <MoveAssessmentDialog
        {...moveAssessmentDialogProps}
        assessmentId={"assessmentId"}
        onSubmitForm={SubmitForm}
      />,
    );
  });

  it("open dialog", () => {
    const spaceField = screen.getByTestId("moveSpaceField")
    expect(spaceField).toBeInTheDocument()
  });
});
