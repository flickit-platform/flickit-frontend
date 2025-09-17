// AssessmentCEFromDialog.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AssessmentCEFromDialog from "@components/assessments/AssessmentCEFromDialog";


describe("AssessmentCEFromDialog", () => {
  it("renders when open", () => {
    render(
      <AssessmentCEFromDialog
        open={true}
        onClose={() => {}}
        onSubmitForm={() => {}}
      />,
    );

    // متن یا عنوان دیالوگ رو که داخلش هست پیدا کن (بسته به پیاده‌سازی کامپوننت)
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("calls onSubmitForm when form is submitted", () => {
    const mockSubmit = vi.fn();

    render(
      <AssessmentCEFromDialog
        open={true}
        onClose={() => {}}
        onSubmitForm={mockSubmit}
      />,
    );

    // فرض می‌کنیم دکمه‌ی ثبت وجود داره
    const submitButton = screen.getByRole("button", { name: /create/i });
    fireEvent.click(submitButton);

    expect(mockSubmit).toHaveBeenCalled();
  });

  it("calls onClose when close button is clicked", () => {
    const mockClose = vi.fn();

    render(
      <AssessmentCEFromDialog
        open={true}
        onClose={mockClose}
        onSubmitForm={() => {}}
      />,
    );

    // فرض می‌کنیم دکمه‌ی بستن وجود داره
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockClose).toHaveBeenCalled();
  });
});
