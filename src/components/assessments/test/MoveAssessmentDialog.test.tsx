import { describe, it, vi, expect } from "vitest";
import MoveAssessmentDialog from "../MoveAssessmentDialog";
import {fireEvent, render, screen, within} from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { SpaceField } from "@common/fields/SpaceField";
import userEvent from "@testing-library/user-event";

const mockAssessmentMoveTarget = vi.fn();

vi.mock("@/providers/service-provider", () => ({
  useServiceContext: () => ({
    service: {
      assessments: {
        info: {
          AssessmentMoveTarget: mockAssessmentMoveTarget,
        },
      },
    },
  }),
}));

describe("test for move assessment", () => {
  const SubmitForm = vi.fn();
  let methodsRef: any;
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
            title: "space",
            type: { code: "BASIC", title: "پایه" },
          },
        ],
      },
    },
    onClose: vi.fn(),
    open: true,
    openDialog: vi.fn(),
  };

  const renderMoveDialog = () => {
    render(
      <MoveAssessmentDialog
        {...moveAssessmentDialogProps}
        assessmentId={"assessmentId"}
        onSubmitForm={SubmitForm}
      />,
    );
  };

  const Wrapper = () => {
    const methods = useForm({ defaultValues: { space: null } });
    methodsRef = methods;
    return (
        <FormProvider {...methods}>
          <SpaceField
              spaces={moveAssessmentDialogProps.context.staticData.spaceList}
              name="space"
              data-testid={"moveSpaceField"}
          />
        </FormProvider>
    );
  };

  it("open move dialog", () => {
    renderMoveDialog();
    const spaceField = screen.getByTestId("moveSpaceField");
    expect(spaceField).toBeInTheDocument();
  });

  it("should update value when user selects a space", async () => {

    render(<Wrapper />);
    const inputBox = within(screen.getByTestId("moveSpaceField")).getByRole(
      "combobox",
    );
    await userEvent.click(inputBox);
    const option = await screen.findByText("space");
    await userEvent.click(option);

    const value = methodsRef.getValues("space");
    expect(value).toEqual({
      id: 1,
      isDefault: false,
      selected: false,
      title: "space",
      type: { code: "BASIC", title: "پایه" },
    });
  });

  // it("submit move",async ()=>{
    // renderMoveDialog();


    // باز کردن Autocomplete
    // const inputBox = within(screen.getByTestId("moveSpaceField")).getByRole("combobox");
    // await userEvent.click(inputBox);

    // انتخاب گزینه space
    // const option = await screen.findByText("space");
    // await userEvent.click(option);

    // کلیک روی submit
    // const submit = screen.getByTestId("submit");
    // await userEvent.click(submit);

    // انتظار: سرویس صدا زده شود
    // expect(mockAssessmentMoveTarget).toHaveBeenCalled();

    // و اینکه با آرگومان درست صدا زده شود
    // expect(mockAssessmentMoveTarget).toHaveBeenCalledWith(
    //     {
    //       id: "assessmentId",
    //       targetSpaceId: 1,
    //     },
    //     expect.anything(), // config
    // );
  // })


});
