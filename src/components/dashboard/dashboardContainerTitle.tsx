import { useEffect } from "react";
import Title from "@common/TitleComponent";
import SupTitleBreadcrumb from "@/components/common/SupTitleBreadcrumb";
import setDocumentTitle from "@utils/setDocumentTitle";
import { t } from "i18next";
import { useConfigContext } from "@/providers/ConfgProvider";
import { useParams } from "react-router-dom";

const DashboardTitle = (props: any) => {
  const { pathInfo } = props;
  const { spaceId, page } = useParams();
  const { space, assessment } = pathInfo;

  const { config } = useConfigContext();
  useEffect(() => {
    setDocumentTitle(`${t("dashboard")}`, config.appTitle);
  }, []);

  return (
    <Title
      backLink="/"
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
              title: space?.title,
              to: `/${spaceId}/assessments/${page}`,
            },
            // {
            //     title: `${assessment?.title} ${t("insights")}`,
            //     to: `/${spaceId}/assessments/${page}/${assessment.id}/insights`,
            // },
            {
              title: `${assessment?.title} ${t(location.pathname.split("/")[5])}`,
            },
          ]}
          displayChip
        />
      }
    ></Title>
  );
};

export default DashboardTitle;
