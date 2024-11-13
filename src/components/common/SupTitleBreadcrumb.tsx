import Breadcrumbs, { BreadcrumbsProps } from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import { Link } from "react-router-dom";
import { styles } from "@styles";
import Box from "@mui/material/Box";
import { LoadingSkeleton } from "./loadings/LoadingSkeleton";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import { Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";

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
  return (
    <Breadcrumbs {...rest}>
      {routes.map((route, index) => {
        const { to, title, sup, icon } = route;
        const disabled =
          (routes.length - 1 === index || !to) &&
          (!route.hasOwnProperty("disabled") || route.disabled);
        const isActive = routes.length - 1 === index;
        return (
          <Box display="flex" flexDirection={"column"} key={route?.sup}>
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
                color: rest?.color
                  ? rest.color
                  : disabled
                    ? "GrayText"
                    : "primary.dark",
                "&:hover": {
                  textDecoration: "none",
                },
              }}
              variant="bodyLarge"
            >
              {icon}
              {(
                <Chip
                  label={title}
                  size="small"
                  sx={{
                    cursor: isActive ? mouseCursor : "pointer",
                    alignSelf: "flex-start",
                    background: isActive
                      ? "#D0E4FF"
                      : "rgba(206, 211, 217, 0.4)",
                    color: isActive ? "#2466A8" : "#73808C",
                    textTransform: "none",
                    borderRadius: "8px",
                    padding: "4px",
                    "& .MuiChip-label": {
                      ...theme.typography.bodyLarge,
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

/**
 * fetch the passed arguments ids title
 */
export const useSupTitleBreadcrumb = (
  params: Record<string, string | undefined>,
) => {
  const { service } = useServiceContext();

  const { loading, data } = useQuery({
    service: (args = params, config) =>
      service.fetchBreadcrumbInfo(args, config),
  });

  return {
    space: !loading ? data?.space_id || "spaces" : data?.space_id,
    assessment: !loading
      ? data?.assessment_id || "assessments"
      : data?.assessment_id,
    questionnaire: !loading
      ? data?.questionnaire_id || "questionnaires"
      : data?.questionnaire_id,
  };
};

export default SupTitleBreadcrumb;
