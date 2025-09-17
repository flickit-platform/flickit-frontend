import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import { SpaceMembers } from "./SpaceMembers";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@/providers/service-provider";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { styles } from "@styles";
import { ISpaceModel } from "@/types/index";
import SupTitleBreadcrumb from "@common/SupTitleBreadcrumb";
import useDialog from "@utils/useDialog";
import CreateSpaceDialog from "./CreateSpaceDialog";
import LoadingButton from "@mui/lab/LoadingButton";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import Title from "@common/Title";
import { useState } from "react";

const SpaceSettingContainer = () => {
  const { spaceId = "" } = useParams();
  const { service } = useServiceContext();

  const { loading, data, query } = useQuery<ISpaceModel>({
    service: (args, config) => service.space.getById({ spaceId }, config),
  });

  const checkCreateSpace = useQuery({
    service: (args, config) => service.space.checkCreate(config),
    runOnMount: true,
  });

  const { title, editable } = data ?? {};

  return (
    <Box maxWidth="1440px" m="auto">
      <Title
        size="large"
        sup={
          <SupTitleBreadcrumb
            routes={[
              {
                to: "/spaces",
                title: "spaces",
                sup: "spaces",
              },
            ]}
          />
        }
        toolbar={
          editable ? (
            <EditSpaceButton
              allowCreateBasic={checkCreateSpace?.data?.allowCreateBasic}
              fetchSpace={query}
            />
          ) : (
            <div />
          )
        }
        backLink={"/"}
      >
        <Box sx={{ ...styles.centerV, opacity: 0.9, unicodeBidi: "plaintext" }}>
          {loading ? (
            <Skeleton
              variant="rounded"
              width="110px"
              sx={{
                marginInlineStart: "unset",
                marginInlineEnd: 1,
              }}
            />
          ) : (
            title
          )}{" "}
          <Trans i18nKey="common.settings" />
        </Box>
      </Title>
      <Box pt={3}>{!loading && <SpaceSettings editable={editable} />}</Box>
    </Box>
  );
};

const EditSpaceButton = (props: any) => {
  const { fetchSpace, allowCreateBasic } = props;
  const { service } = useServiceContext();
  const { spaceId } = useParams();
  const queryData = useQuery({
    service: (args, config) =>
      service.space.getById(args ?? { spaceId }, config),
    runOnMount: false,
  });
  const dialogProps = useDialog();

  const openEditDialog = async (e: any) => {
    const data = await queryData.query();
    dialogProps.openDialog({
      data,
      type: "update",
    });
  };

  return (
    <>
      <LoadingButton
        loading={queryData.loading}
        startIcon={<BorderColorRoundedIcon />}
        size="small"
        onClick={openEditDialog}
      >
        <Trans i18nKey="spaces.editSpace" />
      </LoadingButton>
      <CreateSpaceDialog
        {...dialogProps}
        onSubmitForm={fetchSpace}
        allowCreateBasic={allowCreateBasic}
        titleStyle={{ mb: 0 }}
        contentStyle={{ p: 0 }}
      />
    </>
  );
};

function SpaceSettings(props: any) {
  const { editable } = props;

  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box>
          <TabList onChange={handleChange}>
            <Tab
              label={
                <Box sx={{ ...styles.centerV }}>
                  <GroupsRoundedIcon
                    fontSize="small"
                    sx={{
                      marginInlineStart: 0,
                      marginInlineEnd: "8px",
                    }}
                  />
                  <Trans i18nKey="expertGroups.members" />
                </Box>
              }
              value="1"
            />
          </TabList>
        </Box>
        <TabPanel value="1">
          <SpaceMembers editable={editable} />
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default SpaceSettingContainer;
