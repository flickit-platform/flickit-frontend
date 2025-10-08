import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ILanguage } from "@/types";
import useMenu from "@/hooks/useMenu";

export type LanguagePickerBehavior = {
  matchButtonWidth?: boolean;
  lockPrimaryOnTop?: boolean;
  blockReselect?: boolean;
};

export function useLanguagePicker(
  languages: ILanguage[],
  selectedCode: string,
  primaryCode?: string,
  behavior: LanguagePickerBehavior = {},
) {
  const {
    matchButtonWidth = true,
    lockPrimaryOnTop = true,
    blockReselect = false,
  } = behavior;

  const buttonId = useId();
  const menuId = useId();

  const menuState = useMenu();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [panelWidth, setPanelWidth] = useState<number>();

  useEffect(() => {
    if (!matchButtonWidth || !buttonRef.current) return;

    const el = buttonRef.current;
    const updateWidth = () => setPanelWidth(el.offsetWidth);
    updateWidth();

    const RO = (window as any).ResizeObserver;
    const ro = RO ? new RO(updateWidth) : null;
    ro?.observe?.(el);

    return () => ro?.disconnect?.();
  }, [matchButtonWidth]);

  const ordered = useMemo(() => {
    const head = languages.filter((l) => l.code === primaryCode);
    const tail = languages.filter((l) => l.code !== primaryCode);
    return [...head, ...tail];
  }, [languages, lockPrimaryOnTop, primaryCode]);

  const isCurrent = useCallback(
    (code: string) => code === selectedCode,
    [selectedCode],
  );

  return {
    aria: { buttonId, menuId },
    buttonRef,
    menuState,
    panelWidth,
    items: ordered,
    isCurrent,
    behavior: { blockReselect },
  };
}
