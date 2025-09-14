import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  Skeleton,
  TablePagination,
  Pagination,
} from "@mui/material";
import { Trans } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import QueryData from "@common/QueryData";
import useDialog from "@utils/useDialog";
import CreateSpaceDialog from "./CreateSpaceDialog";
import { SpacesList } from "./SpaceList";
import { useServiceContext } from "@providers/ServiceProvider";
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
import CreateNewFolderRoundedIcon from "@mui/icons-material/CreateNewFolderRounded";
import NewAssessmentIcon from "@/assets/icons/newAssessment";
import ExpandableSection from "../common/buttons/ExpandableSection";
import { useAuthContext } from "@providers/AuthProvider";
import AssessmentCEFromDialog from "../assessments/AssessmentCEFromDialog";
import AssessmenetInfoDialog from "../assessments/AssessmenetInfoDialog";
import { useFetchAssessments } from "../assessments/AssessmentContainer";
import { t } from "i18next";
import { AssessmentsList } from "../assessments/AssessmentList";
import LoadingAssessmentCards from "../common/loadings/LoadingAssessmentCards";
import EmptyState from "../kit-designer/common/EmptyState";
import uniqueId from "@/utils/uniqueId";
import NewTitle from "@common/newTitle";

const SpaceContainer = () => {
  const dialogProps = useDialog();
  const assessmentDialogProps = useDialog();
  const infoDialogProps = useDialog();
  const { currentSpace } = useAuthContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const assessmentPage = Number(searchParams.get("assessmentPage") ?? 1);
  const { userInfo: { defaultSpaceId } } = useAuthContext()
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
  } = useFetchAssessments(assessmentPage - 1, defaultSpaceId);

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

  const handleAddNewSpace = () => {
    dialogProps.openDialog({ type: "create" });
    window.location.hash = "#createSpace";
  };

  const handleCloseDialog = () => {
    dialogProps.onClose();
    window.location.hash = "";
  };

  const handleAddNewAssessment = () => {
    assessmentDialogProps.openDialog({
      type: "create",
      data: {
        space: {
          id: currentSpace?.id,
          title: currentSpace?.title,
        },
      },
    });
  };

  return (
    <Box pt={2}>
      <NewTitle borderBottom size="large">
        <Trans i18nKey="assessment.myAssessments" />
      </NewTitle>

      {/* Workspaces Section */}
      <ExpandableSection
        title={t("spaces.workSpaces")}
        endButtonText={t("spaces.newSpace") ?? ""}
        onEndButtonClick={spaceData.length ? handleAddNewSpace : undefined}
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
                <Grid item xs={12} sm={6} md={4} key={uniqueId()}>
                  <Skeleton
                    variant="rectangular"
                    sx={{ borderRadius: 2, height: "60px", mb: 1 }}
                  />
                </Grid>
              ))}
            </Grid>
          )}
          render={(data) =>
            data.length === 0 ? (
              <EmptyState
                btnTitle="spaces.newSpace"
                title="spaces.noSpaceHere"
                SubTitle="spaces.noSpacesHereDesc"
                onAddNewRow={handleAddNewSpace}
              />
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
        onEndButtonClick={
          assessments.length ? handleAddNewAssessment : undefined
        }
        endButtonIcon={<NewAssessmentIcon width={20} />}
        sx={{ mt: 4 }}
      >
        <QueryData
          data={assessments}
          loading={assessmentsLoading}
          error={assessmentsError}
          errorObject={assessmentsErrorObject}
          loaded={!assessmentsLoading && !!assessments}
          renderLoading={() => <LoadingAssessmentCards />}
          render={(data) => (
            <>
              {!data.length ? (
                <EmptyState
                  btnTitle="assessment.newAssessment"
                  title="assessment.noAssesmentHere"
                  SubTitle="assessment.createAnAssessmentWith"
                  onAddNewRow={handleAddNewAssessment}
                />
              ) : (
                <>
                  {" "}
                  <AssessmentsList
                    data={data}
                    dialogProps={assessmentDialogProps}
                    space={{ id: 6, title: "draft" }}
                    deleteAssessment={deleteAssessment}
                    fetchAssessments={fetchAssessments}
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