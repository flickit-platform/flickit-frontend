import { useCallback, useState } from "react";

export function useAccordion<T extends string | number>(initial: T | null = null) {
  const [expandedId, setExpandedId] = useState<T | null>(initial);

  const isExpanded = useCallback((id: T) => expandedId === id, [expandedId]);

  const onChange =
    (id: T) =>
    (_e: React.SyntheticEvent, isOpen: boolean) => {
      setExpandedId(isOpen ? id : (expandedId === id ? null : expandedId));
    };

  return { expandedId, isExpanded, onChange, setExpandedId };
}
