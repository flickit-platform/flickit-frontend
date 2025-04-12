import { useCallback, useState } from "react";

export default function usePopover() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [],
  );

  const handlePopoverClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return {
    anchorEl,
    open: Boolean(anchorEl),
    handlePopoverOpen,
    handlePopoverClose,
  };
}
