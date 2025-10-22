import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import SubjectTable from "@components/kit-designer/attributes/SubjectTable";
import { KitLanguageProvider } from "@/providers/kit-provider";

const mockAttributeList = [
  {
    id: 1,
    title: "attribute 1",
    translations: {FA: {title: "translations title", description : "translations description"}},
    description: "description 1",
    subject: {
      id: 1,
      title: "title-id",
    },
    weight: 1,
    index: 1,
    isEditing: true,
  },
];

const SubjectMock = [
  {
    id: 1,
    title: "title",
    description: "description",
    weight: 1,
  },
];

const handleAddNewRow = vi.fn();
const handleReorder = vi.fn();
const handleCancel = vi.fn();
const handleSave = vi.fn();
const setNewAttribute = vi.fn();
const handleEdit = vi.fn();
const setOpenDeleteDialog = vi.fn();

describe("MaturityLevelList", () => {
  beforeEach(() => {
    render(
      <KitLanguageProvider>
        <SubjectTable
          subjects={SubjectMock}
          initialAttributes={mockAttributeList}
          onAddAttribute={handleAddNewRow}
          onReorder={handleReorder}
          showNewAttributeForm={true}
          handleCancel={handleCancel}
          handleSave={handleSave}
          newAttribute={true}
          setNewAttribute={setNewAttribute}
          handleEdit={handleEdit}
        />
      </KitLanguageProvider>,
    );
  });

  it("renders attribute correctly", () => {
    const title: any = screen.getByTestId("display-attribute-title");
    const description: any = screen.getByTestId("display-attribute-description");
    expect(title).be;
    expect(description).be;
    expect(screen.getByTestId("display-attribute-title")).text(
      "attribute 1",
    );
    expect(
      screen.getByTestId("display-attribute-description"),
    ).text("description 1");
    expect(screen.getByTestId("display-attribute-weight")).text(
      "1",
    );
  });
});
