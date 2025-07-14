import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Title from "@common/Title";
import QueryData from "@common/QueryData";
import ErrorEmptyData from "@common/errors/ErrorEmptyData";
import useDialog from "@utils/useDialog";
import CreateSpaceDialog from "./CreateSpaceDialog";
import { SpacesList } from "./SpaceList";
import { useServiceContext } from "@providers/ServiceProvider";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import SpaceEmptyStateSVG from "@assets/svg/spaceEmptyState.svg";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { animations } from "@styles";
import { Grid, TablePagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
import { t } from "i18next";
import ExpandableSection from "../common/buttons/ExpandableSection";
import CreateNewFolderRoundedIcon from "@mui/icons-material/CreateNewFolderRounded";
import NewAssessmentIcon from "@/assets/icons/newAssessment";

const SpaceContainer = () => {
  const dialogProps = useDialog();
  const navigate = useNavigate();

  const [rowsPerPage, setRowsPerPage] = useState<number>(6);
  const [page, setPage] = useState<number>(0);

  const {
    data,
    total,
    loading,
    error,
    errorObject,
    allowCreateBasic,
    fetchSpace,
  } = useFetchSpace(page, rowsPerPage);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    navigate(`/spaces/${newPage}`);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    setPage(0);
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
      <ExpandableSection
        title={t("spaces.workSpaces")}
        endButtonText={t("spaces.newSpace") ?? ""}
        onEndButtonClick={() => {
          handleOpenDialog();
        }}
        endButtonIcon={<CreateNewFolderRoundedIcon />}
      >
        <Box>
          <QueryData
            data={data}
            loading={loading}
            error={error}
            errorObject={errorObject}
            loaded={!loading && !!data}
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
                      animation: `${animations.pomp} 1.6s infinite cubic-bezier(0.280, 0.840, 0.420, 1)`,
                      "&:hover": {
                        animation: `${animations.noPomp}`,
                      },
                    }}
                  >
                    <Typography fontSize="1.25rem" variant="button">
                      <Trans i18nKey="spaces.createYourFirstSpace" />
                    </Typography>
                  </Button>
                </Box>
              ) : (
                <SpacesList
                  dialogProps={dialogProps}
                  data={data}
                  fetchSpaces={fetchSpace}
                />
              )
            }
          />

          {data.length !== 0 && (
            <TablePagination
              sx={{ mt: 2 }}
              component="div"
              count={total}
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
          )}
        </Box>
      </ExpandableSection>
      <ExpandableSection
        title={t("assessment.assessments")}
        endButtonText={t("assessment.newAssessment") ?? ""}
        onEndButtonClick={() => {
          handleOpenDialog();
        }}
        endButtonIcon={<NewAssessmentIcon width={20}/>}
      >
        {" "}
      </ExpandableSection>
      <CreateSpaceDialog
        {...dialogProps}
        allowCreateBasic={allowCreateBasic}
        onSubmitForm={fetchSpace}
        titleStyle={{ mb: 0 }}
        contentStyle={{ p: 0 }}
        onClose={handleCloseDialog}
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
