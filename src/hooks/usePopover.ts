import { useCallback, useState } from "react";

export default function usePopover() {
  const [anchorEl, setAnchorEl] = useState<{status: HTMLElement, data?: any } | null>(null);

  const handlePopoverOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>, data: any = null) => {
      setAnchorEl({ status: event.currentTarget, data });
    },
    [],
  );

  const handlePopoverClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return {
    anchorEl,
    open: Boolean(anchorEl?.status),
    handlePopoverOpen,
    handlePopoverClose,
  };
}
