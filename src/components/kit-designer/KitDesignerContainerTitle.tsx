import { useEffect } from "react";
import SupTitleBreadcrumb from "@/components/common/SupTitleBreadcrumb";
import setDocumentTitle from "@utils/setDocumentTitle";
import { t } from "i18next";
import { useConfigContext } from "@/providers/ConfgProvider";
import { IKitVersion } from "@/types/index";
import NewTitle from "@common/newTitle";

const KitDesignerTitle = ({ kitVersion }: { kitVersion: IKitVersion }) => {
  const { config } = useConfigContext();
  useEffect(() => {
    setDocumentTitle(`${t("kitDesigner.kitDesigner")}`, config.appTitle);
  }, []);

  return (
    <NewTitle
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
              title: kitVersion?.assessmentKit?.expertGroup?.title,
              to: `/user/expert-groups/${kitVersion?.assessmentKit?.expertGroup?.id}`,
            },

            { title: kitVersion?.assessmentKit?.title },
          ]}
          displayChip
        />
      }
    ></NewTitle>
  );
};

export default KitDesignerTitle;
