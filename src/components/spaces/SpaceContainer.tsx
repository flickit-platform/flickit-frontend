import { useEffect, useRef, useState } from "react";
import { SpaceLayout } from "./SpaceLayout";
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
import { ToolbarCreateItemBtn } from "@common/buttons/ToolbarCreateItemBtn";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import SpaceEmptyStateSVG from "@assets/svg/spaceEmptyState.svg";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { styles, animations } from "@styles";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useNavigate, useParams } from "react-router-dom";
import { ICustomError } from "@utils/CustomError";
import showToast from "@utils/toastError";

const SpaceContainer = () => {
  const dialogProps = useDialog();
  const navigate = useNavigate();
  const { page } = useParams();
  const pageNumber = Number(page);
  const { fetchSpace, ...rest } = useFetchSpace();
  const { data, size, total, allowCreateBasic } = rest;

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    if (
      Math.ceil(total / size) > Number(page) ||
      Math.ceil(total / size) == Number(page)
    ) {
      navigate(`/spaces/${value}`);
    }
  };

  const pageCount = size === 0 ? 1 : Math.ceil(total / size);
  if (Math.ceil(total / size) < Number(page) && pageCount) {
    navigate(`/spaces/${pageCount}`);
  }

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
    <SpaceLayout
      title={
        <Box sx={{ ...styles.centerVH, mb: "40px" }}>
          <Title
            borderBottom={true}
            size="large"
            sx={{ width: "100%" }}
            toolbarProps={{ whiteSpace: "nowrap" }}
            toolbar={
              data?.length !== 0 ? (
                <ToolbarCreateItemBtn
                  icon={
                    <CreateNewFolderOutlinedIcon
                      sx={{ marginInlineStart: 1, marginInlineEnd: 0 }}
                    />
                  }
                  onClick={handleOpenDialog}
                  shouldAnimate={data?.length === 0}
                  text="spaces.newSpace"
                />
              ) : (
                <></>
              )
            }
          >
            <Trans i18nKey="spaces.spaces" />
          </Title>
          {}
        </Box>
      }
    >
      <QueryData
        {...rest}
        renderLoading={() => (
          <Box mt={5}>
            {[1, 2, 3, 4, 5].map((item) => {
              return (
                <Skeleton
                  key={item}
                  variant="rectangular"
                  sx={{ borderRadius: 2, height: "60px", mb: 1 }}
                />
              );
            })}
          </Box>
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
        render={(data) => {
          return (
            <>
              {data?.length == 0 && (
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
                  <img
                    src={SpaceEmptyStateSVG}
                    alt={"Oh! You have no space?"}
                    width="240px"
                  />
                  <Typography
                    textAlign="center"
                    variant="headlineLarge"
                    sx={{
                      color: "#9DA7B3",
                      fontSize: "3rem",
                      fontWeight: "900",
                      width: "60%",
                    }}
                  >
                    <Trans i18nKey="spaces.noSpaceHere" />
                  </Typography>
                  <Typography
                    textAlign="center"
                    variant="h1"
                    sx={{
                      color: "#9DA7B3",
                      fontSize: "1rem",
                      fontWeight: "500",
                      width: "60%",
                    }}
                  >
                    <Trans i18nKey="spaces.spacesAreEssentialForCreating" />
                  </Typography>
                  <Box>
                    <Button
                      startIcon={<AddRoundedIcon />}
                      variant="contained"
                      onClick={() => dialogProps.openDialog({ type: "create" })}
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
                </Box>
              )}
              <SpacesList
                dialogProps={dialogProps}
                data={data}
                fetchSpaces={fetchSpace}
              />
            </>
          );
        }}
      />
      {data.length !== 0 && (
        <Stack
          spacing={2}
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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
      )}
      <CreateSpaceDialog
        {...dialogProps}
        allowCreateBasic={allowCreateBasic}
        onSubmitForm={fetchSpace}
        titleStyle={{ mb: 0 }}
        contentStyle={{ p: 0 }}
        onClose={handleCloseDialog}
      />
    </SpaceLayout>
  );
};

const useFetchSpace = () => {
  const [data, setData] = useState<any>({});
  const [allowCreateBasic, setAllowCreateBasic] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorObject, setErrorObject] = useState<undefined | ICustomError>(
    undefined,
  );
  const { page } = useParams();
  const { service } = useServiceContext();
  const abortController = useRef(new AbortController());
  const pageNumber = Number(page);
  const PAGESIZE: number = 10;

  useEffect(() => {
    fetchSpace();
  }, [pageNumber]);

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
      showToast(err, { filterByStatus: [404] });
    }
  };
  const fetchSpace = async () => {
    setLoading(true);
    setErrorObject(undefined);
    try {
      checkLimitExceeded();
      const { data: res } = await service.space.getList(
        { size: PAGESIZE, page: pageNumber },
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
      showToast(err, { filterByStatus: [404] });
      setLoading(false);
      setError(true);
      setErrorObject(err);
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
    allowCreateBasic,
    fetchSpace,
  };
};

export default SpaceContainer;
