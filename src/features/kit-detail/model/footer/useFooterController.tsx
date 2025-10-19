import { useMemo, useState } from "react";
import { KitDetailsType } from "../types";
import { resolveActive } from "../../config/config";

export function useFooterController(details: KitDetailsType) {
  const [selectedId, setSelectedId] = useState<string>("maturity-root");
  const cfg = useMemo(() => resolveActive(selectedId), [selectedId]);

  const currentProps = useMemo(
    () => (cfg?.propsFrom ? cfg.propsFrom(selectedId, details) : {}),
    [cfg, selectedId, details],
  );

  const ActiveComp = (cfg?.component as React.ComponentType<any>) ?? null;
  const activeProps = currentProps ?? {};

  return { selectedId, setSelectedId, ActiveComp, activeProps };
}
