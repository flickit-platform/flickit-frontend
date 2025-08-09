import Box, { BoxProps } from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CircularProgress from "@mui/material/CircularProgress";
import Menu from "@mui/material/Menu";
import MenuItem, { MenuItemProps } from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import uniqueId from "@/utils/uniqueId";

interface IMoreActionsProps {
  boxProps?: BoxProps;
  open: boolean;
  openMenu: (e: any) => void;
  closeMenu: (e: any) => void;
  loading?: boolean;
  hideInnerIconButton?: boolean;
  anchorEl?: Element | ((element: Element) => Element) | null;
  fontSize?: "inherit" | "small" | "large" | "medium";
  items: (
    | {
        icon?: JSX.Element;
        onClick?: React.MouseEventHandler<HTMLLIElement>;
        text: JSX.Element;
        menuItemProps?: MenuItemProps & { "data-cy"?: string };
      }
    | null
    | undefined
    | false
  )[];
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

  const menuItems = items.filter((item) => !!item) as {
    icon?: JSX.Element;
    onClick?: React.MouseEventHandler<HTMLLIElement>;
    text: JSX.Element;
    menuItemProps?: MenuItemProps & { "data-cy"?: string };
  }[];

  return menuItems.length > 0 ? (
    <Box {...boxProps}>
      {!hideInnerIconButton && (
        <IconButton
          data-cy="more-action-btn"
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
        PaperProps={{ sx: { minWidth: "160px" } }}
      >
        {menuItems.map((item, index) => {
          const {
            onClick = () => {},
            icon,
            text,
            menuItemProps = {},
          } = item ?? {};
          return (
            <MenuItem
              key={uniqueId()}
              {...menuItemProps}
              onClick={(e: any) => {
                closeMenu(e);
                onClick(e);
              }}
            >
              {icon && <ListItemIcon>{icon}</ListItemIcon>}
              <ListItemText>{text}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  ) : null;
};

export default MoreActions;
