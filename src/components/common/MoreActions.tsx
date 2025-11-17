import Box, { BoxProps } from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CircularProgress from "@mui/material/CircularProgress";
import Menu from "@mui/material/Menu";
import MenuItem, { MenuItemProps } from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { ReactNode } from "react";

interface IMoreActionsProps {
  boxProps?: BoxProps;
  open: boolean;
  openMenu: (e: any) => void;
  closeMenu: (e: any) => void;
  loading?: boolean;
  hideInnerIconButton?: boolean;
  anchorEl?: Element | (() => Element | null) | null;
  fontSize?: "inherit" | "small" | "large" | "medium";
  items: any;
  setShowTooltip?: (e: boolean) => void;
  color?: string;
  IconButtonProps?: any;
}

const MoreActions = (props: IMoreActionsProps) => {
  const {
    boxProps = {},
    openMenu,
    closeMenu,
    loading = false,
    open,
    anchorEl,
    items = [],
    hideInnerIconButton = false,
    fontSize = "inherit",
    setShowTooltip,
    color,
  } = props;

  const menuItems = items.filter((item: any) => !!item) as {
    icon?: ReactNode;
    onClick?: React.MouseEventHandler<HTMLLIElement>;
    text: ReactNode;
    menuItemProps?: MenuItemProps & { "data-cy"?: string };
    id: string;
  }[];

  return menuItems.length > 0 ? (
    <Box onClick={(e) => e.stopPropagation()} {...boxProps}>
      {!hideInnerIconButton && (
        <IconButton
          data-cy="more-action-btn"
          data-testid="more-action-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            !loading && openMenu(e);
            setShowTooltip?.(false);
          }}
        >
          {loading ? (
            <CircularProgress size="1.25rem" />
          ) : (
            <MoreVertIcon sx={{ fill: color }} fontSize={fontSize ?? "small"} />
          )}
        </IconButton>
      )}

      <Menu
        open={open}
        onClose={closeMenu}
        anchorEl={anchorEl}
        PaperProps={{ sx: { minWidth: "120px" } }}
      >
        {menuItems.map((item, index) => {
          const {
            onClick = () => {},
            icon,
            text,
            menuItemProps = {},
            id,
          } = item ?? {};
          return (
            <MenuItem
              key={id}
              {...menuItemProps}
              onClick={(e: any) => {
                closeMenu(e);
                onClick(e);
              }}
              id={id}
              sx={{ display: "flex", gap: "4px" }}
            >
              {icon && (
                <ListItemIcon sx={{ minWidth: "16px !important" }}>
                  {icon}
                </ListItemIcon>
              )}
             {text}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  ) : null;
};

export default MoreActions;
