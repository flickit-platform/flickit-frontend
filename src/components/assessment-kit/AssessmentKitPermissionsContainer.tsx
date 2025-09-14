import Box from "@mui/material/Box";
import { useServiceContext } from "@providers/ServiceProvider";
import { useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import QueryBatchData from "@common/QueryBatchData";
import { Trans } from "react-i18next";
import SupTitleBreadcrumb from "@common/SupTitleBreadcrumb";
import { t } from "i18next";
import setDocumentTitle from "@utils/setDocumentTitle";
import { useConfigContext } from "@/providers/ConfgProvider";
import MemberList from "@/components/assessment-kit/AssessmentKitMemberList";
import Title from "@common/Title";

const AssessmentKitPermissionsContainer = () => {
  const { service } = useServiceContext();
  const { assessmentKitId } = useParams();
  const assessmentKitUsersListQueryData = useQuery({
    service: (args, config) =>
      service.assessmentKit.member.getList(args ?? { assessmentKitId }, config),
  });
  const assessmentKitMinInfoQueryData = useQuery({
    service: (args, config) =>
      service.assessmentKit.info.getMinInfo(args ?? { assessmentKitId }, config),
  });

  const { config } = useConfigContext();
  return (
    <QueryBatchData
      queryBatchData={[
        assessmentKitUsersListQueryData,
        assessmentKitMinInfoQueryData,
      ]}
      render={([data = {}, info = {}]) => {
        setDocumentTitle(
          `${t("assessmentKit.assessmentKit")}: ${info?.expertGroup?.title ?? ""}`,
          config.appTitle,
        );
        return (
          <AssessmentKitPermisson
            data={data}
            query={assessmentKitUsersListQueryData}
            info={info}
          />
        );
      }}
    />
  );
};

const AssessmentKitPermisson = (props: any) => {
  const { data, query, info } = props;
  const { items } = data;
  const { id, title, expertGroup } = info;

  interface Column {
    id: "displayName" | "email" | "remove";
    label: string;
    minWidth?: string;
    align?: "right";
    display?: string;
    position: string;
  }

  const columns: readonly Column[] = [
    {
      id: "displayName",
      label: "user.name",
      minWidth: "29%",
      position: "left",
    },
    {
      id: "email",
      label: "user.email",
      display: "none",
      minWidth: "30%",
      position: "center",
    },
    {
      id: "remove",
      label: "common.remove",
      align: "right",
      minWidth: "30%",
      position: "center",
    },
  ];

  return (
    <Box>
      <Title
        inPageLink="assessmentKitPermissions"
        size="large"
        letterSpacing=".08em"
        sup={
          <SupTitleBreadcrumb
            routes={[
              {
                title: t("expertGroups.expertGroups") as string,
                to: `/user/expert-groups`,
              },
              {
                title: expertGroup.title,
                to: `/user/expert-groups/${expertGroup.id}`,
              },
              {
                title: title,
                to: `/user/expert-groups/${expertGroup.id}/assessment-kits/${id}`,
              },
              {
                title: "permissions",
                to: `/user/expert-groups/${expertGroup.id}/assessment-kits/${id}/permissions`,
              },
            ]}
          />
        }
      >
        <Trans
          i18nKey={"assessmentKit.assessmentKitPermissions"}
          values={{ assessmentKit: title }}
        />
      </Title>
      <Box mt={2}>
        <MemberList
          title="expertGroups.members"
          hasBtn={true}
          btnLabel="expertGroups.addMember"
          listOfUser={items}
          query={query}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default AssessmentKitPermissionsContainer;
