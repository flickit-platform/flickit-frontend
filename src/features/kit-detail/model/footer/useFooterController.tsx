import { useEffect, useMemo, useState } from "react";
import { KitDetailsType } from "../types";
import { resolveActive } from "../../config/config";

type StickyView = {
  Comp: React.ComponentType<any>;
  props: Record<string, any>;
  key: string;
} | null;

export function useFooterController(details: KitDetailsType) {
  const [selectedId, setSelectedId] = useState<string>("maturity-root");
  const cfg = useMemo(() => resolveActive(selectedId), [selectedId]);

  // const [sticky, setSticky] = useState<StickyView>(null);

  const currentProps = useMemo(
    () => (cfg?.propsFrom ? cfg.propsFrom(selectedId, details) : {}),
    [cfg, selectedId, details],
  );

  // useEffect(() => {
  //   if (cfg?.component) {
  //     setSticky({
  //       Comp: cfg.component as React.ComponentType<any>,
  //       props: currentProps,
  //       key: selectedId,
  //     });
  //   }
  // }, [cfg, selectedId, currentProps]);

  const ActiveComp = (cfg?.component as React.ComponentType<any>) ?? null;
  const activeProps = currentProps ?? {};

  return { selectedId, setSelectedId, ActiveComp, activeProps };
}
