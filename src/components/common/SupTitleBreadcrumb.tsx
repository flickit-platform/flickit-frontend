import Breadcrumbs, { BreadcrumbsProps } from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import { Link } from "react-router-dom";
import { styles } from "@styles";
import Box from "@mui/material/Box";
import { LoadingSkeleton } from "./loadings/LoadingSkeleton";
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";
import uniqueId from "@/utils/unique-id";
import languageDetector from "@/utils/language-detector";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";

interface ISupTitleBreadcrumbProps {
  routes: {
    sup?: string;
    to?: string;
    icon?: JSX.Element;
    title?: string | JSX.Element;
    disabled?: boolean;
  }[];
  displayChip?: boolean;
  colorSetting?: string;
  bgColorSetting?: string;
  mouseCursor?: string;
}

const SupTitleBreadcrumb = (
  props: ISupTitleBreadcrumbProps & BreadcrumbsProps,
) => {
  const { displayChip, mouseCursor = "auto", routes = [], ...rest } = props;
  const theme = useTheme();
  const filteredRoutes = routes.filter(
    (route) => route.title !== "Default Space",
  );
  return (
    <Breadcrumbs {...rest}>
      {filteredRoutes.map((route, index) => {
        const { to, title, icon } = route;
        const disabled =
          (filteredRoutes.length - 1 === index || !to) &&
          (!route.hasOwnProperty("disabled") || route.disabled);
        const isActive = filteredRoutes.length - 1 === index;
        return (
          <Box display="flex" flexDirection={"column"} key={uniqueId()}>
            <MuiLink
              component={disabled ? "div" : Link}
              underline={disabled ? "none" : "hover"}
              color="inherit"
              to={to}
              onClick={(e) => disabled && e.preventDefault()}
              sx={{
                ...styles.centerV,
                cursor: "pointer",
                opacity: 0.8,
                color: (rest?.color ?? disabled) ? "GrayText" : "primary.dark",
                "&:hover": {
                  textDecoration: "none",
                },
              }}
              variant="bodyLarge"
            >
              {(
                <Chip
                  icon={icon}
                  label={title}
                  size="small"
                  sx={{
                    cursor: isActive ? mouseCursor : "pointer",
                    alignSelf: "flex-start",
                    bgcolor: isActive ? "#D0E4FF" : "rgba(206,211,217,0.4)",
                    color: isActive ? "#2466A8" : "outline.outline",
                    textTransform: "none",
                    borderRadius: "8px",
                    py: "16px",
                    px: "8px",
                    display: "inline-flex",
                    gap: 0.75,
                    "& .MuiChip-icon": {
                      color: "currentColor",
                      marginInlineStart: 0,
                      fontSize: 18,
                    },

                    "& .MuiChip-label": {
                      ...theme.typography.bodyLarge,
                      fontFamily: languageDetector(title as string)
                        ? farsiFontFamily
                        : primaryFontFamily,
                      fontWeight: 300,
                    },
                  }}
                />
              ) || <LoadingSkeleton width={"70px"} sx={{ borderRadius: 1 }} />}
            </MuiLink>
          </Box>
        );
      })}
    </Breadcrumbs>
  );
};

export default SupTitleBreadcrumb;
