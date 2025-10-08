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

  const menu = useMenu();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!matchButtonWidth || !buttonRef.current) return;

    const el = buttonRef.current;
    const updateMenuWidthFromButton = () => setMenuWidth(el.offsetWidth);
    updateMenuWidthFromButton();

    const ResizeObs = globalThis.ResizeObserver;
    const resizeObserver = ResizeObs
      ? new ResizeObs(updateMenuWidthFromButton)
      : null;

    resizeObserver?.observe?.(el);
    return () => resizeObserver?.disconnect?.();
  }, [matchButtonWidth]);

  const orderedLanguages = useMemo(() => {
    if (!lockPrimaryOnTop || !primaryCode) return languages;
    const primary = languages.filter((l) => l.code === primaryCode);
    const others = languages.filter((l) => l.code !== primaryCode);
    return [...primary, ...others];
  }, [languages, lockPrimaryOnTop, primaryCode]);

  const isSelectedCode = useCallback(
    (code: string) => code === selectedCode,
    [selectedCode],
  );

  return {
    aria: { buttonId, menuId },
    buttonRef,
    menu,
    menuWidth,
    items: orderedLanguages,
    isSelectedCode,
    flags: { blockReselect },
  };
}
