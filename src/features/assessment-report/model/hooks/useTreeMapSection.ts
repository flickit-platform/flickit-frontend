import { useMemo } from "react";

export function useTreeMapSection({
  subjects,
  selectedId,
}: {
  subjects: any[];
  selectedId: number | null;
}) {
  const treeMapData = useMemo(
    () =>
      subjects.flatMap((subject: any) =>
        subject.attributes.map((attribute: any) => ({
          name: attribute.title,
          description: attribute.description,
          id: attribute.id,
          count: attribute.weight,
          label: attribute.maturityLevel.value.toString(),
          maturityLevel: attribute.maturityLevel,
        }))
      ),
    [subjects]
  );

  const selectedAttribute = useMemo(
    () => treeMapData.find((a) => a.id === selectedId),
    [treeMapData, selectedId]
  );

  return { treeMapData, selectedAttribute };
}
