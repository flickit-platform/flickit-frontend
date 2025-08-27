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
          count: attribute.weight,
          label: attribute.maturityLevel.value.toString(),
          ...attribute,
        })),
      ),
    [subjects],
  );

  const selectedAttribute = useMemo(
    () => treeMapData.find((a) => a.id === selectedId),
    [treeMapData, selectedId],
  );

  return { treeMapData, selectedAttribute };
}
