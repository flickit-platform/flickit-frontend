import SupTitleBreadcrumb from "@/components/common/SupTitleBreadcrumb";
import Title from "@/components/common/Title";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import i18next, { t } from "i18next";
import { useNavigate } from "react-router-dom";

const PageTitle = ({
  title,
  expertGroupId,
  expertGroupTitle,
}: {
  title: string;
  expertGroupTitle: string;
  expertGroupId?: string;
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/user/expert-groups/${expertGroupId}/`);
  };
  return (
    <Title
      backLink={"/"}
      size="large"
      wrapperProps={{
        sx: {
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "flex-end" },
        },
      }}
      sup={
        <SupTitleBreadcrumb
          routes={[
            {
              title: t("expertGroups.expertGroups") as string,
              to: `/user/expert-groups`,
            },
            {
              title: expertGroupTitle,
              to: `/user/expert-groups/${expertGroupId}`,
            },
            {
              title,
            },
          ]}
          displayChip
        />
      }
    >
      <Box
        my={3.125}
        display="flex"
        justifyContent="space-between"
        width="100%"
        alignItems="center"
      >
        <Box>
          <IconButton color="primary" onClick={handleBack} size="small">
            {i18next.language === "fa" ? (
              <ArrowForward sx={(theme) => theme.typography.headlineMedium} />
            ) : (
              <ArrowBack sx={(theme) => theme.typography.headlineMedium} />
            )}
          </IconButton>
          {title}
        </Box>
      </Box>
    </Title>
  );
};
export default PageTitle;
