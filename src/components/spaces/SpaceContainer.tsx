import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Skeleton,
  TablePagination,
  Typography,
  Pagination,
} from "@mui/material";
import { Trans } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

import Title from "@common/Title";
import QueryData from "@common/QueryData";
import ErrorEmptyData from "@common/errors/ErrorEmptyData";
import useDialog from "@utils/useDialog";
import CreateSpaceDialog from "./CreateSpaceDialog";
import { SpacesList } from "./SpaceList";
import { useServiceContext } from "@providers/ServiceProvider";
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CreateNewFolderRoundedIcon from "@mui/icons-material/CreateNewFolderRounded";
import NewAssessmentIcon from "@/assets/icons/newAssessment";
import SpaceEmptyStateSVG from "@assets/svg/spaceEmptyState.svg";
import { animations } from "@styles";
import ExpandableSection from "../common/buttons/ExpandableSection";
import { useAuthContext } from "@providers/AuthProvider";
import AssessmentCEFromDialog from "../assessments/AssessmentCEFromDialog";
import AssessmenetInfoDialog from "../assessments/AssessmenetInfoDialog";
import { useFetchAssessments } from "../assessments/AssessmentContainer";
import { t } from "i18next";
import { AssessmentsList } from "../assessments/AssessmentList";
import LoadingAssessmentCards from "../common/loadings/LoadingAssessmentCards";

const SpaceContainer = () => {
  const dialogProps = useDialog();
  const assessmentDialogProps = useDialog();
  const infoDialogProps = useDialog();
  const navigate = useNavigate();
  const { currentSpace } = useAuthContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const assessmentPage = Number(searchParams.get("assessmentPage") ?? 1);

  const [rowsPerPage, setRowsPerPage] = useState<number>(6);
  const [page, setPage] = useState<number>(0);

  const {
    data: spaceData,
    total: spaceTotal,
    loading: spaceLoading,
    error: spaceError,
    errorObject: spaceErrorObject,
    allowCreateBasic,
    fetchSpace,
  } = useFetchSpace(page, rowsPerPage);

  const {
    data: assessments,
    total: assessmentsTotal,
    loading: assessmentsLoading,
    error: assessmentsError,
    errorObject: assessmentsErrorObject,
    deleteAssessment,
    fetchAssessments,
  } = useFetchAssessments(assessmentPage - 1);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    setPage(0);
  };

  const handleAssessmentPagination = (
    _: React.ChangeEvent<unknown>,
    newPage: number,
  ) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      updated.set("assessmentPage", newPage.toString());
      return updated;
    });
  };

  useEffect(() => {
    if (window.location.hash === "#createSpace") {
      dialogProps.openDialog({ type: "create" });
      window.location.hash = "";
    }
  }, []);

  const handleOpenDialog = () => {
    dialogProps.openDialog({ type: "create" });
    window.location.hash = "#createSpace";
  };

  const handleCloseDialog = () => {
    dialogProps.onClose();
    window.location.hash = "";
  };

  return (
    <Box>
      <Title borderBottom size="large" sx={{ width: "100%" }}>
        <Trans i18nKey="assessment.myAssessments" />
      </Title>

      {/* Workspaces Section */}
      <ExpandableSection
        title={t("spaces.workSpaces")}
        endButtonText={t("spaces.newSpace") ?? ""}
        onEndButtonClick={handleOpenDialog}
        endButtonIcon={<CreateNewFolderRoundedIcon />}
      >
        <QueryData
          data={spaceData}
          loading={spaceLoading}
          error={spaceError}
          errorObject={spaceErrorObject}
          loaded={!spaceLoading && !!spaceData}
          renderLoading={() => (
            <Grid container spacing={3}>
              {[...Array(6)].map((_, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Skeleton
                    variant="rectangular"
                    sx={{ borderRadius: 2, height: "60px", mb: 1 }}
                  />
                </Grid>
              ))}
            </Grid>
          )}
          emptyDataComponent={
            <ErrorEmptyData
              emptyMessage={<Trans i18nKey="notification.nothingToSeeHere" />}
              suggests={
                <Typography variant="subtitle1" textAlign="center">
                  <Trans i18nKey="spaces.tryCreatingNewSpace" />
                </Typography>
              }
            />
          }
          render={(data) =>
            data.length === 0 ? (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  mt: 6,
                  gap: 4,
                }}
              >
                <img src={SpaceEmptyStateSVG} width="240px" />
                <Typography
                  textAlign="center"
                  variant="headlineLarge"
                  sx={{
                    color: "#9DA7B3",
                    fontSize: "3rem",
                    fontWeight: "900",
                  }}
                >
                  <Trans i18nKey="spaces.noSpaceHere" />
                </Typography>
                <Typography
                  textAlign="center"
                  sx={{ color: "#9DA7B3", fontSize: "1rem", fontWeight: 500 }}
                >
                  <Trans i18nKey="spaces.spacesAreEssentialForCreating" />
                </Typography>
                <Button
                  startIcon={<AddRoundedIcon />}
                  variant="contained"
                  onClick={handleOpenDialog}
                  sx={{
                    animation: `${animations.pomp} 1.6s infinite`,
                    "&:hover": {
                      animation: animations.noPomp,
                    },
                  }}
                >
                  <Typography fontSize="1.25rem" variant="button">
                    <Trans i18nKey="spaces.createYourFirstSpace" />
                  </Typography>
                </Button>
              </Box>
            ) : (
              <>
                <SpacesList
                  dialogProps={dialogProps}
                  data={data}
                  fetchSpaces={fetchSpace}
                />
                <TablePagination
                  sx={{ mt: 2 }}
                  component="div"
                  count={spaceTotal}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[6, 12, 24, 48]}
                  labelRowsPerPage={t("common.rowsPerPage")}
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to}  ${t("common.of")} ${
                      count !== -1 ? count : `${t("common.moreThan")} ${to}`
                    }`
                  }
                />
              </>
            )
          }
        />
      </ExpandableSection>

      {/* Assessments Section */}
      <ExpandableSection
        title={t("assessment.assessments")}
        endButtonText={t("assessment.newAssessment") ?? ""}
        onEndButtonClick={() =>
          assessmentDialogProps.openDialog({
            type: "create",
            data: {
              space: {
                id: currentSpace?.id,
                title: currentSpace?.title,
              },
            },
          })
        }
        endButtonIcon={<NewAssessmentIcon width={20} />}
      >
        <QueryData
          data={assessments}
          loading={assessmentsLoading}
          error={assessmentsError}
          errorObject={assessmentsErrorObject}
          loaded={!assessmentsLoading && !!assessments}
          renderLoading={() => <LoadingAssessmentCards />}
          emptyDataComponent={
            <ErrorEmptyData
              emptyMessage={<Trans i18nKey="notification.nothingToSeeHere" />}
              suggests={
                <Typography variant="subtitle1" textAlign="center">
                  <Trans i18nKey="assessment.tryCreatingNewAssessment" />
                </Typography>
              }
            />
          }
          render={(data) => (
            <>
              <AssessmentsList
                data={data}
                dialogProps={assessmentDialogProps}
                space={{ id: 1329, title: "draft" }}
                deleteAssessment={deleteAssessment}
              />
              {assessmentsTotal > 8 && (
                <Box mt={2} display="flex" justifyContent="center">
                  <Pagination
                    variant="outlined"
                    color="primary"
                    count={Math.ceil(assessmentsTotal / 8)}
                    page={assessmentPage}
                    onChange={handleAssessmentPagination}
                  />
                </Box>
              )}
            </>
          )}
        />
      </ExpandableSection>

      {/* Dialogs */}
      <CreateSpaceDialog
        {...dialogProps}
        allowCreateBasic={allowCreateBasic}
        onSubmitForm={fetchSpace}
        titleStyle={{ mb: 0 }}
        contentStyle={{ p: 0 }}
        onClose={handleCloseDialog}
      />

      <AssessmentCEFromDialog
        {...assessmentDialogProps}
        onSubmitForm={fetchAssessments}
      />

      <AssessmenetInfoDialog
        {...infoDialogProps}
        titleStyle={{ mb: 0 }}
        contentStyle={{ p: 0 }}
      />
    </Box>
  );
};

const useFetchSpace = (page: number, size: number) => {
  const [data, setData] = useState<any>({});
  const [allowCreateBasic, setAllowCreateBasic] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorObject, setErrorObject] = useState<undefined | ICustomError>(
    undefined,
  );
  const { service } = useServiceContext();
  const abortController = useRef(new AbortController());

  const fetchSpace = async () => {
    setLoading(true);
    setErrorObject(undefined);
    try {
      checkLimitExceeded();
      const { data: res } = await service.space.getList(
        { size, page: page + 1 },
        { signal: abortController.current.signal },
      );
      if (res) {
        setData(res);
        setError(false);
      } else {
        setData({});
        setError(true);
      }
    } catch (e) {
      const err = e as ICustomError;
      toastError(err, { filterByStatus: [404] });
      setError(true);
      setErrorObject(err);
    } finally {
      setLoading(false);
    }
  };

  const checkLimitExceeded = async () => {
    try {
      const {
        data: { allowCreateBasic },
      } = await service.space.checkCreate({
        signal: abortController.current.signal,
      });
      setAllowCreateBasic(allowCreateBasic);
    } catch (e) {
      const err = e as ICustomError;
      toastError(err, { filterByStatus: [404] });
    }
  };

  useEffect(() => {
    fetchSpace();
  }, [page, size]);

  return {
    data: data.items ?? [],
    total: data.total ?? 0,
    loading,
    error,
    errorObject,
    allowCreateBasic,
    fetchSpace,
  };
};

export default SpaceContainer;
