import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Trans } from "react-i18next";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import InfoItem from "@common/InfoItem";
import { t } from "i18next";
import { ICustomError } from "@utils/CustomError";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import { useParams } from "react-router";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import toastError from "@utils/toastError";
import { toast } from "react-toastify";
import FormProviderWithForm from "@common/FormProviderWithForm";
import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import QueryBatchData from "@common/QueryBatchData";
import RichEditorField from "@common/fields/RichEditorField";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import Tooltip from "@mui/material/Tooltip";
import AutocompleteAsyncField, {
  useConnectAutocompleteField,
} from "@common/fields/AutocompleteAsyncField";
import firstCharDetector from "@/utils/firstCharDetector";
import { keyframes } from "@emotion/react";
import { Link } from "react-router-dom";
import { LoadingSkeleton } from "@common/loadings/LoadingSkeleton";
import { AssessmentKitStatsType, AssessmentKitInfoType } from "@/types/index";
import { farsiFontFamily, primaryFontFamily, theme } from "@/config/theme";
import languageDetector from "@/utils/languageDetector";
import SelectLanguage from "@utils/selectLanguage";
import { useConfigContext } from "@providers/ConfgProvider";
import uniqueId from "@/utils/uniqueId";
import { getReadableDate } from "@utils/readableDate";

interface IAssessmentKitSectionAuthorInfo {
  setExpertGroup: any;
  setAssessmentKitTitle: any;
  setHasActiveVersion: any;
}

const AssessmentKitSectionGeneralInfo = (
  props: IAssessmentKitSectionAuthorInfo,
) => {
  const { setExpertGroup, setAssessmentKitTitle, setHasActiveVersion } = props;
  const {
    config: { languages },
  }: any = useConfigContext();
  const { assessmentKitId } = useParams();
  const { service } = useServiceContext();
  const formMethods = useForm({ shouldUnregister: true });
  const fetchAssessmentKitInfoQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.info.getInfo(args ?? { assessmentKitId }, config),
    runOnMount: true,
  });
  const fetchAssessmentKitStatsQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.info.getStats(args ?? { assessmentKitId }, config),
    runOnMount: true,
  });

  const abortController = useRef(new AbortController());
  const [show, setShow] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = (editable: boolean) => {
    editable && setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  const handleCancel = () => {
    setShow(false);
  };

  const onSubmit = async (data: any, event: any, shouldView?: boolean) => {
    event.preventDefault();
    try {
      await service.assessmentKit.info.updateStats(
        {
          assessmentKitId: assessmentKitId ?? "",
          data: { tags: data?.tags?.map((t: any) => t.id) },
        },
        { signal: abortController.current.signal },
      );

      await fetchAssessmentKitInfoQuery.query();
      handleCancel();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };
  const handleLanguageChange = async (e: any) => {
    const { value } = e.target;

    let adjustValue = languages.find(
      (item: { code: string; title: string }) => item.title == value,
    );

    try {
      await service.assessmentKit.info.updateStats(
        {
          assessmentKitId: assessmentKitId ?? "",
          data: { lang: adjustValue?.code },
        },
        { signal: abortController.current.signal },
      );
      await fetchAssessmentKitInfoQuery.query();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  return (
    <QueryBatchData
      queryBatchData={[
        fetchAssessmentKitInfoQuery,
        fetchAssessmentKitStatsQuery,
      ]}
      loadingComponent={
        <LoadingSkeleton
          width="100%"
          height="360px"
          sx={{ mt: 1, borderRadius: 2 }}
        />
      }
      render={([info, stats]) => {
        const {
          title,
          summary,
          published,
          isPrivate,
          about,
          tags,
          editable,
          hasActiveVersion,
          mainLanguage,
        } = info as AssessmentKitInfoType;
        const {
          creationTime,
          lastModificationTime,
          questionnairesCount,
          attributesCount,
          questionsCount,
          maturityLevelsCount,
          likes,
          assessmentCounts,
          subjects,
          expertGroup,
        } = stats as AssessmentKitStatsType;
        setAssessmentKitTitle(title);
        setHasActiveVersion(hasActiveVersion);
        setExpertGroup(expertGroup);
        return (
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Box
                sx={{
                  mt: 1,
                  p: 2.5,
                  borderRadius: 2,
                  background: "white",
                  height: "100%",
                }}
              >
                <OnHoverInput
                  formMethods={formMethods}
                  data={title}
                  title={<Trans i18nKey="common.title" />}
                  infoQuery={fetchAssessmentKitInfoQuery.query}
                  type="title"
                  editable={editable}
                />
                <OnHoverInput
                  formMethods={formMethods}
                  data={summary}
                  title={<Trans i18nKey="common.summary" />}
                  infoQuery={fetchAssessmentKitInfoQuery.query}
                  type="summary"
                  editable={editable}
                />
                <OnHoverStatus
                  data={published}
                  title={<Trans i18nKey="common.status" />}
                  infoQuery={fetchAssessmentKitInfoQuery.query}
                  editable={editable}
                />
                <OnHoverVisibilityStatus
                  data={isPrivate}
                  title={<Trans i18nKey="common.visibility" />}
                  infoQuery={fetchAssessmentKitInfoQuery.query}
                  editable={editable}
                />
                <Box
                  sx={{
                    height: "38px",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    mr={4}
                    sx={{ minWidth: "64px !important" }}
                  >
                    <Trans i18nKey="common.price" />
                  </Typography>
                  <Typography variant="body2" fontWeight="700" mr={4} ml={1}>
                    <Trans i18nKey="common.free" />
                  </Typography>
                </Box>
                <Box
                  my={1.5}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    mr={4}
                    sx={{ minWidth: "64px !important" }}
                  >
                    <Trans i18nKey="common.tags" />
                  </Typography>
                  {editable && show ? (
                    <FormProviderWithForm formMethods={formMethods}>
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <AutocompleteAsyncField
                          {...useConnectAutocompleteField({
                            service: (args, config) =>
                              service.assessmentKit.info.getTags(args, config),
                          })}
                          name="tags"
                          multiple={true}
                          defaultValue={tags}
                          searchOnType={false}
                          required={true}
                          label={""}
                          editable={true}
                          sx={{ width: "100%" }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          <IconButton
                            edge="end"
                            sx={{
                              background: theme.palette.primary.main,
                              "&:hover": {
                                background: theme.palette.primary.dark,
                              },
                              borderRadius: "3px",
                              height: "36px",
                              marginBottom: "2px",
                              marginRight:
                                theme.direction === "ltr" ? "3px" : "unset",
                              marginLeft:
                                theme.direction === "rtl" ? "3px" : "unset",
                            }}
                            onClick={formMethods.handleSubmit(onSubmit)}
                          >
                            <CheckCircleOutlineRoundedIcon
                              sx={{ color: "#fff" }}
                            />
                          </IconButton>
                          <IconButton
                            edge="end"
                            sx={{
                              background: theme.palette.primary.main,
                              "&:hover": {
                                background: theme.palette.primary.dark,
                              },
                              borderRadius: "4px",
                              height: "36px",
                              marginBottom: "2px",
                            }}
                            onClick={handleCancel}
                          >
                            <CancelRoundedIcon sx={{ color: "#fff" }} />
                          </IconButton>
                        </Box>
                      </Box>
                    </FormProviderWithForm>
                  ) : (
                    <Box
                      sx={{
                        height: "38px",
                        borderRadius: "4px",
                        paddingLeft: theme.direction === "ltr" ? "12px" : "0px",
                        paddingRight:
                          theme.direction === "rtl" ? "12px" : "8px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        "&:hover": {
                          border: editable ? "1px solid #1976d299" : "unset",
                          borderColor: editable
                            ? theme.palette.primary.main
                            : "unset",
                        },
                      }}
                      onClick={() => setShow(!show)}
                      onMouseOver={() => handleMouseOver(editable ?? false)}
                      onMouseOut={handleMouseOut}
                    >
                      <Box sx={{ display: "flex" }}>
                        {tags.map((tag: any) => {
                          return (
                            <Box
                              key={uniqueId()}
                              sx={{
                                background: "#00000014",
                                fontSize: "0.875rem",
                                borderRadius: "8px",
                                fontWeight: "700",
                              }}
                              mr={1}
                              px={1}
                            >
                              <Typography variant="body2" fontWeight="700">
                                {tag.title}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Box>
                      {isHovering && (
                        <IconButton
                          title="Edit"
                          edge="end"
                          sx={{
                            background: theme.palette.primary.main,
                            "&:hover": {
                              background: theme.palette.primary.dark,
                            },
                            borderRadius: "3px",
                            height: "36px",
                          }}
                          onClick={() => setShow(!show)}
                        >
                          <EditRoundedIcon sx={{ color: "#fff" }} />
                        </IconButton>
                      )}
                    </Box>
                  )}
                </Box>

                <OnHoverRichEditor
                  data={about}
                  title={<Trans i18nKey="common.about" />}
                  infoQuery={fetchAssessmentKitInfoQuery.query}
                  editable={editable}
                />
                <Box
                  my={1.5}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    mr={4}
                    sx={{ minWidth: "64px !important" }}
                  >
                    <Trans i18nKey="common.language" />
                  </Typography>
                  <SelectLanguage
                    handleChange={handleLanguageChange}
                    mainLanguage={mainLanguage}
                    languages={languages}
                    editable={editable}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  mt: 1,
                  p: 2.5,
                  borderRadius: 2,
                  background: "white",
                  height: "100%",
                }}
              >
                {creationTime && (
                  <Box my={1.5}>
                    <InfoItem
                      bg="white"
                      info={{
                        item: getReadableDate(creationTime),
                        title: t("common.creationDate"),
                      }}
                    />
                  </Box>
                )}
                {lastModificationTime && (
                  <Box my={1.5}>
                    <InfoItem
                      bg="white"
                      info={{
                        item: getReadableDate(lastModificationTime),
                        title: t("common.lastUpdated"),
                      }}
                    />
                  </Box>
                )}

                <Box my={1.5}>
                  <InfoItem
                    bg="white"
                    info={{
                      item: subjects?.map((sub: any) => sub?.title),
                      title: t("common.subjects"),
                      type: "array",
                    }}
                  />
                </Box>
                <Box my={1.5}>
                  <InfoItem
                    bg="white"
                    info={{
                      item: questionnairesCount,
                      title: t("common.questionnairesCount"),
                    }}
                  />
                </Box>
                <Box my={1.5}>
                  <InfoItem
                    bg="white"
                    info={{
                      item: attributesCount,
                      title: t("assessmentKit.attributesCount"),
                    }}
                  />
                </Box>
                <Box my={1.5}>
                  <InfoItem
                    bg="white"
                    info={{
                      item: questionsCount,
                      title: t("assessmentKit.totalQuestionsCount"),
                    }}
                  />
                </Box>
                <Box my={1.5}>
                  <InfoItem
                    bg="white"
                    info={{
                      item: maturityLevelsCount,
                      title: t("common.maturityLevels"),
                    }}
                  />
                </Box>

                <Box sx={{ display: "flex" }} px={1} mt={4}>
                  <Box sx={{ display: "flex" }} mr={4}>
                    <FavoriteRoundedIcon color="primary" />
                    <Typography color="primary" ml={1}>
                      {likes}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex" }}>
                    <ShoppingCartRoundedIcon color="primary" />
                    <Typography color="primary" ml={1}>
                      {assessmentCounts}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        );
      }}
    />
  );
};

const OnHoverInput = (props: any) => {
  const [show, setShow] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    editable && setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  const { data, title, editable, infoQuery, type } = props;
  const [hasError, setHasError] = useState<boolean>(false);
  const [error, setError] = useState<any>({});
  const [inputData, setInputData] = useState<string>(data);
  const handleCancel = () => {
    setShow(false);
    setInputData(data);
    setError({});
    setHasError(false);
  };
  const { assessmentKitId } = useParams();
  const { service } = useServiceContext();
  const updateAssessmentKitQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.info.updateStats(
        args ?? {
          assessmentKitId: assessmentKitId,
          data: { [type]: inputData },
        },
        config,
      ),
    runOnMount: false,
  });
  const updateAssessmentKit = async () => {
    try {
      const res = await updateAssessmentKitQuery.query();
      res.message && toast.success(res.message);
      await infoQuery();
    } catch (e) {
      const err = e as ICustomError;
      if (Array.isArray(err.response?.data?.message)) {
        toastError(err.response?.data?.message[0]);
      } else if (err.response?.data?.hasOwnProperty("message")) {
        toastError(error);
      }
      setError(err);
      setHasError(true);
    }
  };
  const inputProps: React.HTMLProps<HTMLInputElement> = {
    style: {
      textAlign: firstCharDetector(inputData) ? "right" : "left",
    },
  };

  return (
    <Box>
      <Box
        my={1.5}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        width="100%"
      >
        <Typography
          variant="body2"
          mr={4}
          sx={{
            minWidth: "64px !important",
          }}
        >
          {title}
        </Typography>

        {editable && show ? (
          <Box
            sx={{ display: "flex", flexDirection: "column", width: "100% " }}
          >
            <OutlinedInput
              inputProps={inputProps}
              error={hasError}
              fullWidth
              name={title}
              defaultValue={data ?? ""}
              onChange={(e) => setInputData(e.target.value)}
              value={inputData}
              required={true}
              multiline={true}
              sx={{
                minHeight: "38px",
                borderRadius: "4px",
                paddingRight: "12px;",
                fontWeight: "700",
                fontSize: "0.875rem",
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    title="Submit Edit"
                    edge="end"
                    sx={{
                      background: theme.palette.primary.main,
                      "&:hover": {
                        background: theme.palette.primary.dark,
                      },
                      borderRadius: "3px",
                      height: "36px",
                      margin: "3px",
                    }}
                    onClick={updateAssessmentKit}
                  >
                    <CheckCircleOutlineRoundedIcon sx={{ color: "#fff" }} />
                  </IconButton>
                  <IconButton
                    title="Cancel Edit"
                    edge="end"
                    sx={{
                      background: theme.palette.primary.main,
                      "&:hover": {
                        background: theme.palette.primary.dark,
                      },
                      borderRadius: "4px",
                      height: "36px",
                    }}
                    onClick={handleCancel}
                  >
                    <CancelRoundedIcon sx={{ color: "#fff" }} />
                  </IconButton>
                </InputAdornment>
              }
            />
            {hasError && (
              <Typography color="#ba000d" variant="caption">
                {error?.data?.[type]}
              </Typography>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              minHeight: "38px",
              borderRadius: "4px",
              paddingLeft: theme.direction === "ltr" ? "12px" : "0px",
              paddingRight: theme.direction === "ltr" ? "12px" : "8px",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              wordBreak: "break-word",
              "&:hover": {
                border: editable ? "1px solid #1976d299" : "unset",
                borderColor: editable ? theme.palette.primary.main : "unset",
              },
            }}
            onClick={() => setShow(!show)}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            <Typography
              sx={{
                fontFamily: languageDetector(data)
                  ? farsiFontFamily
                  : primaryFontFamily,
              }}
              variant="body2"
              fontWeight="700"
            >
              {data?.replace(/<\/?p>/g, "")}
            </Typography>
            {isHovering && (
              <IconButton
                title="Edit"
                edge="end"
                sx={{
                  background: theme.palette.primary.main,
                  "&:hover": {
                    background: theme.palette.primary.dark,
                  },
                  borderRadius: "3px",
                  height: "36px",
                }}
                onClick={() => setShow(!show)}
              >
                <EditRoundedIcon sx={{ color: "#fff" }} />
              </IconButton>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

const OnHoverStatus = (props: any) => {
  const { data, title, infoQuery, editable } = props;
  const { assessmentKitId } = useParams();
  const { service } = useServiceContext();
  const [selected, setSelected] = useState<boolean>(data);
  const handleToggle = async (status: boolean) => {
    if (editable) {
      setSelected(status);
      if (status !== data) {
        await updateAssessmentKit();
      }
    }
  };
  const updateAssessmentKitQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.info.updateStats(
        args ?? {
          assessmentKitId: assessmentKitId,
          data: { published: !data },
        },
        config,
      ),
    runOnMount: false,
    toastError: true,
  });
  const updateAssessmentKit = async () => {
    const res = await updateAssessmentKitQuery.query();
    res.message && toast.success(res.message);
    await infoQuery();
  };
  return (
    <Box>
      <Box
        my={1.5}
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" mr={4} sx={{ minWidth: "64px !important" }}>
          {title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            background: "#00000014",
            borderRadius: "8px",
            justifyContent: "space-between",
            width: "fit-content",
            p: "2px",
            gap: "4px  ",
            ml: 0.5,
          }}
        >
          <Box
            onClick={() => handleToggle(true)}
            sx={{
              padding: 0.5,
              backgroundColor: selected ? "#2e7d32" : "transparent",
              color: selected ? "#fff" : "#000",
              cursor: editable ? "pointer" : "default",
              transition: "background-color 0.3s ease",
              animation: `${fadeIn} 0.5s ease`,
              borderRadius: "6px",
              width: "100px",
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              fontWeight="700"
              textTransform={"uppercase"}
              sx={{ userSelect: "none" }}
              fontSize="0.75rem"
            >
              <Trans i18nKey="common.published" />
            </Typography>
          </Box>
          <Box
            onClick={() => handleToggle(false)}
            sx={{
              padding: 0.5,
              backgroundColor: !selected ? "gray" : "transparent",
              cursor: editable ? "pointer" : "default",
              transition: "background-color 0.3s ease",
              animation: `${fadeIn} 0.5s ease`,
              borderRadius: "6px",
              color: !selected ? "#fff" : "#000",
              width: "100px",
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              fontWeight="700"
              textTransform={"uppercase"}
              sx={{ userSelect: "none" }}
              fontSize=".75rem"
            >
              <Trans i18nKey="common.unpublished" />
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
const OnHoverVisibilityStatus = (props: any) => {
  const { data, title, infoQuery, editable } = props;
  const { assessmentKitId, expertGroupId } = useParams();
  const { service } = useServiceContext();
  const [selected, setSelected] = useState<boolean>(data);
  const handleToggle = (status: boolean) => {
    if (editable) {
      setSelected(status);
      if (status !== data) updateAssessmentKit();
    }
  };
  const updateAssessmentKitQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.info.updateStats(
        args ?? {
          assessmentKitId: assessmentKitId,
          data: { isPrivate: !data },
        },
        config,
      ),
    runOnMount: false,
    toastError: true,
  });
  const updateAssessmentKit = async () => {
    const res = await updateAssessmentKitQuery.query();
    res.message && toast.success(res.message);
    await infoQuery();
  };
  return (
    <Box>
      <Box
        my={1.5}
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" mr={4} sx={{ minWidth: "64px !important" }}>
          {title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              background: "#00000014",
              borderRadius: "8px",
              justifyContent: "space-between",
              width: "fit-content",
              p: "2px",
              gap: "4px  ",
              ml: 0.5,
            }}
          >
            <Box
              onClick={() => handleToggle(true)}
              sx={{
                padding: 0.5,
                backgroundColor: selected ? "#7954B3;" : "transparent",
                color: selected ? "#fff" : "#000",
                cursor: editable ? "pointer" : "default",
                transition: "background-color 0.3s ease",
                animation: `${fadeIn} 0.5s ease`,
                borderRadius: "6px",
                width: "100px",
                textAlign: "center",
              }}
            >
              <Typography
                variant="body2"
                fontWeight="700"
                textTransform={"uppercase"}
                sx={{ userSelect: "none" }}
                fontSize=".75rem"
              >
                <Trans i18nKey="common.private" />
              </Typography>
            </Box>
            <Box
              onClick={() => handleToggle(false)}
              sx={{
                padding: 0.5,
                backgroundColor: !selected ? "gray" : "transparent",
                cursor: editable ? "pointer" : "default",
                transition: "background-color 0.3s ease",
                animation: `${fadeIn} 0.5s ease`,
                borderRadius: "6px",
                color: !selected ? "#fff" : "#000",
                width: "100px",
                textAlign: "center",
              }}
            >
              <Typography
                variant="body2"
                fontWeight="700"
                textTransform={"uppercase"}
                sx={{ userSelect: "none" }}
                fontSize=".75rem"
              >
                <Trans i18nKey="common.public" />
              </Typography>
            </Box>
          </Box>
          {editable && selected && (
            <Box sx={{ ml: 1 }}>
              <Tooltip title={<Trans i18nKey="assessmentKit.managePermissions" />}>
                <IconButton
                  sx={{ width: "20px", height: "20px" }}
                  color="primary"
                  component={Link}
                  to={`/user/expert-groups/${expertGroupId}/assessment-kits/${assessmentKitId}/permissions`}
                >
                  <SettingsRoundedIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
const OnHoverRichEditor = (props: any) => {
  const abortController = useRef(new AbortController());
  const [show, setShow] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    editable && setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  const { data, title, infoQuery, editable } = props;
  const [hasError, setHasError] = useState<boolean>(false);
  const [error, setError] = useState<any>({});
  const handleCancel = () => {
    setShow(false);
    setError({});
    setHasError(false);
  };
  const { assessmentKitId } = useParams();
  const { service } = useServiceContext();
  const formMethods = useForm({ shouldUnregister: true });
  const onSubmit = async (data: any, event: any, shouldView?: boolean) => {
    event.preventDefault();
    try {
      await service.assessmentKit.info.updateStats(
        { assessmentKitId: assessmentKitId ?? "", data: { about: data.about } },
        { signal: abortController.current.signal },
      );
      await infoQuery();
      await setShow(false);
    } catch (e) {
      const err = e as ICustomError;
      setError(err);
      setHasError(true);
    }
  };
  return (
    <Box>
      <Box
        my={1.5}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" mr={4} sx={{ minWidth: "64px !important" }}>
          {title}
        </Typography>
        {editable && show ? (
          <FormProviderWithForm formMethods={formMethods}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <RichEditorField
                name="about"
                label={<Box></Box>}
                disable_label={true}
                required={true}
                defaultValue={data ?? ""}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <IconButton
                  sx={{
                    background: theme.palette.primary.main,
                    "&:hover": {
                      background: theme.palette.primary.dark,
                    },
                    borderRadius: languageDetector(data)
                      ? "8px 0 0 0"
                      : "0 8px 0 0",
                    height: "49%",
                  }}
                  onClick={formMethods.handleSubmit(onSubmit)}
                >
                  <CheckCircleOutlineRoundedIcon sx={{ color: "#fff" }} />
                </IconButton>
                <IconButton
                  sx={{
                    background: theme.palette.primary.main,
                    "&:hover": {
                      background: theme.palette.primary.dark,
                    },
                    borderRadius: languageDetector(data)
                      ? "0 0 0 8px"
                      : "0 0 8px 0",
                    height: "49%",
                  }}
                  onClick={handleCancel}
                >
                  <CancelRoundedIcon sx={{ color: "#fff" }} />
                </IconButton>
              </Box>
              {hasError && (
                <Typography color="#ba000d" variant="caption">
                  {error?.data?.about}
                </Typography>
              )}
            </Box>
          </FormProviderWithForm>
        ) : (
          <Box
            sx={{
              minHeight: "38px",
              borderRadius: "8px",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              wordBreak: "break-word",
              pr: languageDetector(data) ? 1 : 5,
              pl: languageDetector(data) ? 5 : 1,
              border: "1px solid #fff",
              "&:hover": {
                border: editable ? "1px solid #1976d299" : "1px solid #fff",
                borderColor: editable
                  ? theme.palette.primary.main
                  : "1px solid #fff",
              },
              position: "relative",
            }}
            onClick={() => setShow(!show)}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            <Typography
              variant="body2"
              fontWeight="700"
              sx={{
                fontFamily: languageDetector(data?.replace(/<\/?p>/g, ""))
                  ? farsiFontFamily
                  : primaryFontFamily,
              }}
              dangerouslySetInnerHTML={{ __html: data }}
            />
            {isHovering && (
              <IconButton
                title="Edit"
                sx={{
                  background: theme.palette.primary.main,
                  "&:hover": {
                    background: theme.palette.primary.dark,
                  },
                  borderRadius: languageDetector(data)
                    ? "8px 0 0 8px"
                    : "0 8px 8px 0",
                  height: "100%",
                  position: "absolute",
                  right: languageDetector(data) ? "unset" : 0,
                  left: languageDetector(data) ? 0 : "unset",
                  top: 0,
                }}
                onClick={() => setShow(!show)}
              >
                <EditRoundedIcon sx={{ color: "#fff" }} />
              </IconButton>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
export default AssessmentKitSectionGeneralInfo;

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;
