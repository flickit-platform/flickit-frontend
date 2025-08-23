import React, { useEffect, useRef, useState } from "react";
import { Trans } from "react-i18next";
import Title from "@common/Title";
import QueryData from "@common/QueryData";
import ErrorEmptyData from "@common/errors/ErrorEmptyData";
import AssessmentEmptyState from "@assets/svg/assessmentEmptyState.svg";
import { useServiceContext } from "@providers/ServiceProvider";
import useDialog from "@utils/useDialog";
import { AssessmentsList } from "./AssessmentList";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ICustomError } from "@utils/CustomError";
import { useParams, useNavigate } from "react-router-dom";
import toastError from "@utils/toastError";
import { ToolbarCreateItemBtn } from "@common/buttons/ToolbarCreateItemBtn";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { styles, animations } from "@styles";
import AssessmentCEFromDialog from "./AssessmentCEFromDialog";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useAuthContext } from "@providers/AuthProvider";
import AssessmentTitle from "./AssessmentTitle";
import PermissionControl from "../common/PermissionControl";
import SettingIcon from "@/assets/icons/settingIcon";
import NewAssessmentIcon from "@/assets/icons/newAssessment";
import AssessmenetInfoDialog from "@components/assessments/AssessmenetInfoDialog";
import { useQuery } from "@/utils/useQuery";
import useScreenResize from "@utils/useScreenResize";
import LoadingAssessmentCards from "../common/loadings/LoadingAssessmentCards";
import { useTheme } from "@mui/material";

const AssessmentContainer = () => {
  const { service } = useServiceContext();
  const dialogProps = useDialog();
  const infoDialogProps = useDialog();
  const { currentSpace } = useAuthContext();
  const { spaceId, page } = useParams();
  const navigate = useNavigate();
  const { fetchAssessments, ...rest } = useFetchAssessments(
    Number(page) - 1,
    Number(spaceId),
  );
  const { data, errorObject, size, total, loading } = rest;
  const isEmpty = data.length === 0;
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    if (
      Math.ceil(total / size) > Number(page) ||
      Math.ceil(total / size) == Number(page)
    ) {
      navigate(`/${spaceId}/assessments/${value}`);
    }
  };
  const pageCount = size === 0 ? 1 : Math.ceil(total / size);
  if (Math.ceil(total / size) < Number(page) && pageCount) {
    navigate(`/${spaceId}/assessments/${pageCount}`);
  }

  const fetchSpaceInfo = useQuery({
    service: (args = { spaceId }, config) =>
      service.space.getById(args, config),
    runOnMount: false,
  });

  useEffect(() => {
    fetchSpaceInfo.query();
  }, []);
  const isSmallScreen = useScreenResize("sm");

  const theme = useTheme();

  return (
    <PermissionControl error={[errorObject?.response]}>
      <Box display="flex" flexDirection="column" m="auto">
        <AssessmentTitle data={currentSpace} />
        {!fetchSpaceInfo.data?.canCreateAssessment && (
          <Typography
            variant="semiBoldSmall"
            onClick={() => infoDialogProps.openDialog({})}
            sx={{
              textDecoration: "underline",
              cursor: "pointer",
              textAlign: "end",
              mb: { xs: "5px", sm: "unset" },
            }}
            color="primary"
          >
            <Trans i18nKey="assessment.learnWhyThisIsUnavailable" />
          </Typography>
        )}
        <Box sx={{ ...styles.centerVH, mb: "40px", mt: 1 }}>
          <Title
            borderBottom={true}
            size="large"
            sx={{ width: "100%" }}
            toolbarProps={{ whiteSpace: "nowrap" }}
            toolbar={
              data?.length !== 0 ? (
                <Box
                  sx={{ ...styles.centerVH, gap: "9px", position: "relative" }}
                >
                  <ToolbarCreateItemBtn
                    icon={
                      <SettingIcon
                        width="20px"
                        height="20px"
                        color={`${theme.palette.primary.main}`}
                      />
                    }
                    onClick={() => navigate(`/${spaceId}/setting`)}
                    shouldAnimate={data?.length === 0}
                    variantType="outlined"
                    text={isSmallScreen ? "" : "common.settings"}
                    sx={{
                      px: isSmallScreen ? 0 : 1,
                      "& .MuiButton-endIcon": {
                        mx: isSmallScreen ? "0px !important" : "unset",
                      },
                    }}
                  />
                  <ToolbarCreateItemBtn
                    icon={
                      <NewAssessmentIcon
                        width="20px"
                        height="20px"
                        color={
                          !fetchSpaceInfo.data?.canCreateAssessment
                            ? "#3D4D5C80"
                            : theme.palette.background.containerLowest
                        }
                      />
                    }
                    onClick={() =>
                      dialogProps.openDialog({
                        type: "create",
                        data: {
                          space: { id: spaceId, title: currentSpace?.title },
                        },
                      })
                    }
                    shouldAnimate={data?.length === 0}
                    disabled={!fetchSpaceInfo.data?.canCreateAssessment}
                    text={isSmallScreen ? "" : "assessment.createAssessment"}
                    sx={{
                      px: isSmallScreen ? 0 : 1,
                      "& .MuiButton-endIcon": {
                        mx: isSmallScreen ? "0px !important" : "unset",
                      },
                    }}
                  />
                </Box>
              ) : (
                <></>
              )
            }
          >
            <Trans i18nKey="assessment.assessments" />
          </Title>
          {}
        </Box>
        {isEmpty && !loading && (
          <Box width="100%" mt={6} gap={4} sx={{ ...styles.centerCVH }}>
            <img
              src={AssessmentEmptyState}
              alt={"No assesment here!"}
              width="240px"
            />
            <Typography
              textAlign="center"
              variant="h3"
              color="#9DA7B3"
              sx={{
                fontSize: "3rem",
                fontWeight: "900",
                width: "60%",
              }}
            >
              <Trans i18nKey="assessment.noAssesmentHere" />
            </Typography>
            <Typography
              textAlign="center"
              variant="h1"
              color="#9DA7B3"
              sx={{
                fontSize: "1rem",
                fontWeight: "500",
                width: "60%",
              }}
            >
              <Trans i18nKey="assessment.createAnAssessmentWith" />
            </Typography>
            <Box>
              <Button
                startIcon={<AddRoundedIcon />}
                variant="contained"
                sx={{
                  animation: `${animations.pomp} 1.6s infinite cubic-bezier(0.280, 0.840, 0.420, 1)`,
                  "&:hover": {
                    animation: `${animations.noPomp}`,
                  },
                }}
                onClick={() =>
                  dialogProps.openDialog({
                    type: "create",
                    data: {
                      space: { id: spaceId, title: currentSpace?.title },
                    },
                  })
                }
              >
                <Typography sx={{ fontSize: "1.25rem" }} variant="button">
                  <Trans i18nKey="assessment.newAssessment" />
                </Typography>
              </Button>
            </Box>
          </Box>
        )}

        <QueryData
          {...rest}
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
          render={(data) => {
            return (
              <>
                <AssessmentsList
                  {...rest}
                  data={data}
                  space={{ id: spaceId, title: currentSpace?.title }}
                  dialogProps={dialogProps}
                  fetchAssessments={fetchAssessments}
                />
                {pageCount > 1 && !isEmpty && (
                  <Stack spacing={2} mt={3} sx={{ ...styles.centerVH }}>
                    <Pagination
                      variant="outlined"
                      color="primary"
                      count={pageCount}
                      page={Number(page)}
                      onChange={handleChange}
                    />
                  </Stack>
                )}
              </>
            );
          }}
        />
        <AssessmentCEFromDialog
          {...dialogProps}
          onSubmitForm={fetchAssessments}
        />
        <AssessmenetInfoDialog
          {...infoDialogProps}
          titleStyle={{ mb: 0 }}
          contentStyle={{ p: 0 }}
        />
      </Box>
    </PermissionControl>
  );
};

export const useFetchAssessments = (page: any, spaceId: any) => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorObject, setErrorObject] = useState<undefined | ICustomError>(
    undefined,
  );
  const { service } = useServiceContext();
  const abortController = useRef(new AbortController());

  useEffect(() => {
    if (spaceId) {
      fetchAssessments();
    }
  }, [page, spaceId]);
  const fetchAssessments = async () => {
    setLoading(true);
    setErrorObject(undefined);
    try {
      const { data: res } = await service.assessments.info.getList(
        { spaceId, size: 8, page },
        { signal: abortController.current.signal },
      );
      if (res) {
        setData(res);
        setError(false);
      } else {
        setData({});
        setError(true);
      }

      setLoading(false);
    } catch (e) {
      const err = e as ICustomError;
      toastError(err, { filterByStatus: [404] });
      setLoading(false);
      setError(true);
      setErrorObject(err);
    }
  };

  const deleteAssessment = async (id: any) => {
    setLoading(true);
    try {
      await service.assessments.info.remove(
        { id },
        { signal: abortController.current.signal },
      );
      fetchAssessments();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
      setLoading(false);
      setError(true);
    }
  };

  return {
    data: data.items ?? [],
    page: data.page ?? 0,
    size: data.size ?? 0,
    total: data.total ?? 0,
    requested_space: data.requested_space,
    loading,
    loaded: !!data,
    error,
    errorObject,
    fetchAssessments,
    deleteAssessment,
  };
};

export default AssessmentContainer;
