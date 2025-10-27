import { useCallback, useState } from "react";

export default function usePopover() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [data, setData]= useState<any>(null)
  const handlePopoverOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>, receivedData?: any) => {
      setAnchorEl(event.currentTarget );
      setData(receivedData)
    },
    [],
  );

  const handlePopoverClose = useCallback(() => {
    setAnchorEl(null);
    setData(null)
  }, []);

  return {
    anchorEl,
    open: Boolean(anchorEl),
    data,
    handlePopoverOpen,
    handlePopoverClose,
  };
}
