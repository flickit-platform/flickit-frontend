import { useMemo, useState } from "react";
import { resolveActive } from "../../config/config";
import { KitDetailsType } from "../types";

export function useFooterController(
  details: KitDetailsType,
  initialId = "maturity-root",
) {
  const [selectedId, setSelectedId] = useState<string>(initialId);

  const active = useMemo(() => resolveActive(selectedId), [selectedId]);
  const ActiveComp = active.component as any;
  const activeProps = useMemo(
    () => active.propsFrom(selectedId, details),
    [active, selectedId, details],
  );

  return { selectedId, setSelectedId, ActiveComp, activeProps };
}
