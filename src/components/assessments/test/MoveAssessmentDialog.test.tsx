import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";


const assessmentMoveTargetSpy = vi.fn().mockResolvedValue({ ok: true });

vi.mock("@/providers/service-provider", () => ({
  useServiceContext: () => ({
    service: {
      assessments: {
        info: { AssessmentMoveTarget: assessmentMoveTargetSpy },
      },
    },
  }),
  ServiceProvider: ({ children }: any) => <>{children}</>,
}));

vi.mock("@providers/service-provider", () => ({
  useServiceContext: () => ({
    service: {
      assessments: {
        info: { AssessmentMoveTarget: assessmentMoveTargetSpy },
      },
    },
  }),
  ServiceProvider: ({ children }: any) => <>{children}</>,
}));


vi.mock("../../../providers/service-provider", () => ({
  useServiceContext: () => ({
    service: {
      assessments: {
        info: { AssessmentMoveTarget: assessmentMoveTargetSpy },
      },
    },
  }),
  ServiceProvider: ({ children }: any) => <>{children}</>,
}));

const useQueryMockImpl = (opts: any) => ({
  query: vi.fn((args?: any, config?: any) => opts.service(args, config)),
  loading: false,
  data: undefined,
  error: undefined,
});
vi.mock("@/hooks/useQuery", () => ({ useQuery: useQueryMockImpl }));
vi.mock("../../../hooks/useQuery", () => ({ useQuery: useQueryMockImpl }));


let MoveAssessmentDialog: any;
beforeEach(async () => {
  assessmentMoveTargetSpy.mockClear();
  ({ default: MoveAssessmentDialog } = await import("../MoveAssessmentDialog"));
});


describe("MoveAssessmentDialog", () => {
  const onClose = vi.fn();
  const onSubmitForm = vi.fn();

  const staticData = {
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
  };

  const baseProps = {
    open: true,
    onClose,
    onSubmitForm,
    openDialog: vi.fn(),
    context: { type: "create", staticData },
    assessmentId: "assessmentId",
    titleStyle: { mb: 0 },
    contentStyle: { p: 0 },
  };

  const renderDialog = (override?: Partial<typeof baseProps>) => {
    const props = { ...baseProps, ...(override ?? {}) };
    return render(
      <MemoryRouter>
        <MoveAssessmentDialog {...(props as any)} />
        <ToastContainer />
      </MemoryRouter>,
    );
  };

  it("renders the target space field when dialog opens", () => {
    renderDialog();
    expect(screen.getByTestId("target-space-field")).toBeInTheDocument();
  });

  it("lets user pick a space and shows the selection", async () => {
    renderDialog();
    const u = userEvent.setup();

    const combo = within(screen.getByTestId("target-space-field")).getByRole(
      "combobox",
    );
    await u.click(combo);
    await u.click(await screen.findByText("space"));

    expect(screen.getByDisplayValue("space")).toBeInTheDocument();
  });

  it("calls onClose when cancel button is clicked", async () => {
    renderDialog();
    const u = userEvent.setup();

    const cancelBtn = screen.getByTestId("close-btn");
    expect(cancelBtn).toBeInTheDocument();

    await u.click(cancelBtn);
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("submits and calls the API with correct payload, then triggers onSubmitForm and onClose", async () => {
    renderDialog();
    const u = userEvent.setup();

    const combo = within(screen.getByTestId("target-space-field")).getByRole(
      "combobox",
    );
    await u.click(combo);
    await u.click(await screen.findByText("space"));

    const submitBtn = screen.getByTestId("submit");
    expect(submitBtn).toBeInTheDocument();
    await u.click(submitBtn);

    await waitFor(() => {
      expect(assessmentMoveTargetSpy).toHaveBeenCalledTimes(1);

      expect(assessmentMoveTargetSpy).toHaveBeenCalledWith(
        { id: "assessmentId", targetSpaceId: 1 },
        undefined,
      );
      expect(onSubmitForm).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalled();
    });
  });
});
