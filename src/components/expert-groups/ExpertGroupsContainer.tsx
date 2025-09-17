import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { t } from "i18next";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import { useAuthContext } from "@/providers/auth-provider";
import { useServiceContext } from "@/providers/service-provider";
import { FLAGS, TQueryFunction } from "@/types/index";
import forLoopComponent from "@/utils/for-loop-component";
import useDialog from "@/hooks/useDialog";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { useQuery } from "@/hooks/useQuery";
import { LoadingSkeleton } from "@common/loadings/LoadingSkeleton";
import QueryData from "@common/QueryData";
import ExpertGroupCEFormDialog from "./ExpertGroupCEFormDialog";
import ExpertGroupsList from "./ExpertGroupsList";
import { useEffect, useState } from "react";
import flagsmith from "flagsmith";
import uniqueId from "@/utils/unique-id";

const ExpertGroupsContainer = () => {
  const { service } = useServiceContext();
  const { userInfo } = useAuthContext();
  const { id } = userInfo ?? {};
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 20;

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPageNumber(value);
  };

  const queryData = useQuery({
    service: (args, config) =>
      service.expertGroups.info.list(
        args ?? { id, size: pageSize, page: pageNumber },
        config,
      ),
  });

  useEffect(() => {
    queryData.query({ id, size: pageSize, page: pageNumber });
  }, [pageNumber]);

  const pageCount =
    !queryData.data || queryData.data?.size === 0
      ? 1
      : Math.ceil(queryData.data?.total / queryData.data?.size);

  useDocumentTitle(t("expertGroups.expertGroups") as string);
  const showGroups =
    flagsmith.hasFeature(FLAGS.display_expert_groups) || !flagsmith.initialised;

  return (
    <Box>
      {showGroups && (
        <Box
          bgcolor="background.containerLowest"
          py={1}
          px={2}
          mt={2}
          borderRadius={1}
          sx={{ ...styles.centerV }}
        >
          <Box></Box>
          <Box marginInlineStart="auto" marginInlineEnd="unset">
            {<CreateExpertGroupButton onSubmitForm={queryData.query} />}
          </Box>
        </Box>
      )}

      <QueryData
        {...queryData}
        renderLoading={() => {
          return (
            <Grid container spacing={3} mt={1}>
              {forLoopComponent(4, () => {
                return (
                  <Grid item key={uniqueId()} xs={12} sm={6} lg={4}>
                    <LoadingSkeleton height="174px" />
                  </Grid>
                );
              })}
            </Grid>
          );
        }}
        render={(data) => {
          return (
            <>
              <ExpertGroupsList data={data} />
              <Stack
                spacing={2}
                sx={{
                  mt: 3,
                  ...styles.centerVH,
                }}
              >
                <Pagination
                  variant="outlined"
                  color="primary"
                  count={pageCount}
                  onChange={handleChangePage}
                  page={pageNumber}
                />
              </Stack>
            </>
          );
        }}
      />
    </Box>
  );
};

const CreateExpertGroupButton = (props: { onSubmitForm: TQueryFunction }) => {
  const { onSubmitForm } = props;
  const dialogProps = useDialog();

  return (
    <>
      <Button
        variant="contained"
        sx={{
          marginInlineStart: "auto",
          marginInlineEnd: "unset",
        }}
        size="small"
        onClick={dialogProps.openDialog}
      >
        <Trans i18nKey="expertGroups.createExpertGroup" />
      </Button>
      <ExpertGroupCEFormDialog {...dialogProps} onSubmitForm={onSubmitForm} />
    </>
  );
};

export default ExpertGroupsContainer;
