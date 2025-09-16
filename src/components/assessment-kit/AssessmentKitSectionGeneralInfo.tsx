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
import FormProviderWithForm from "@common/FormProviderWithForm";
import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import QueryBatchData from "@common/QueryBatchData";
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
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import languageDetector from "@/utils/languageDetector";
import SelectLanguage from "@utils/selectLanguage";
import { useConfigContext } from "@providers/ConfgProvider";
import uniqueId from "@/utils/uniqueId";
import { getReadableDate } from "@utils/readableDate";
import showToast from "@utils/toastError";
import { RenderGeneralField } from "@common/RenderGeneralField";
import useGeneralInfoField from "@/hooks/useGeneralInfoField";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";
import { styles } from "@styles";

interface IAssessmentKitSectionAuthorInfo {
  setExpertGroup: any;
  setAssessmentKitTitle: any;
  setHasActiveVersion: any;
}

const TextFields = [
  { name: "about", label: "common.what", multiline: true, useRichEditor: true },
  {
    name: "context",
    label: "common.who",
    multiline: true,
    useRichEditor: true,
  },
  { name: "goal", label: "common.when", multiline: true, useRichEditor: true },
] as const;

const AssessmentKitSectionGeneralInfo = (
  props: IAssessmentKitSectionAuthorInfo,
) => {
  const { setExpertGroup, setAssessmentKitTitle, setHasActiveVersion } = props;
  const {
    config: { languages: appLangs },
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

  const {
    handleSaveEdit,
    editableFields,
    setEditableFields,
    langCode,
    toggleTranslation,
    showTranslations,
    updatedValues,
    setUpdatedValues,
  } = useGeneralInfoField({ assessmentKitId, fetchAssessmentKitInfoQuery });
  const { updateTranslation } = useTranslationUpdater(langCode);
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
      showToast(err);
    }
  };
  const handleLanguageChange = async (e: any) => {
    const { value } = e.target;

    let adjustValue = appLangs.find(
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
      showToast(err);
    }
  };

  const handleCancelTextBox = (field: any) => {
    editableFields.delete(field);
    setUpdatedValues((prev: any) => ({
      ...prev,
    }));
  };

  const tagsAutocompleteProps = useConnectAutocompleteField({
    service: (args, config) => service.assessmentKit.info.getTags(args, config),
  });

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
          metadata,
          translations,
          languages,
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

        const handleFieldEdit = (field: "about") => {
          if (editable) {
            setEditableFields((prev) => new Set(prev).add(field));
          }
        };

        const updateAssessmentKitQuery = useQuery({
          service: (args, config) =>
            service.assessmentKit.info.updateStats(
              args ?? {
                assessmentKitId: assessmentKitId,
                data: { isPrivate },
              },
              config,
            ),
          runOnMount: false,
          toastError: true,
        });
        const updateAssessmentKit = async () => {
          const res = await updateAssessmentKitQuery.query();
          res.message && showToast(res.message, { variant: "success" });
          await fetchAssessmentKitInfoQuery.query();
        };

        return (
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Box
                mt={1}
                p={2.5}
                borderRadius={2}
                bgcolor="background.containerLowest"
                height="100%"
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
                  title={<Trans i18nKey="common.status" />}
                  updateAssessmentKit={updateAssessmentKit}
                  editable={editable}
                />
                <OnHoverVisibilityStatus
                  updateAssessmentKit={updateAssessmentKit}
                  title={<Trans i18nKey="common.visibility" />}
                  editable={editable}
                />
                <Box height="38px" width="100%" sx={{ ...styles.centerV }}>
                  <Typography variant="body2" mr={4} minWidth="64px !important">
                    <Trans i18nKey="common.price" />
                  </Typography>
                  <Typography variant="body2" fontWeight="700" mr={4} ml={1}>
                    <Trans i18nKey="common.free" />
                  </Typography>
                </Box>
                <Box
                  my={1.5}
                  justifyContent="space-between"
                  sx={{ ...styles.centerV }}
                >
                  <Typography variant="body2" mr={4} minWidth="64px !important">
                    <Trans i18nKey="common.tags" />
                  </Typography>
                  {editable && show ? (
                    <FormProviderWithForm formMethods={formMethods}>
                      <Box
                        width="100%"
                        justifyContent="space-between"
                        sx={{ ...styles.centerV }}
                      >
                        <AutocompleteAsyncField
                          {...tagsAutocompleteProps}
                          name="tags"
                          multiple={true}
                          defaultValue={tags}
                          searchOnType={false}
                          required={true}
                          label={""}
                          editable={true}
                          sx={{ width: "100%" }}
                        />
                        <Box height="100%" sx={{ ...styles.centerVH }}>
                          <IconButton
                            edge="end"
                            sx={{
                              bgcolor: "primary.main",
                              "&:hover": {
                                bgcolor: "primary.dark",
                              },
                              borderRadius: "3px",
                              height: "36px",
                              marginBottom: "2px",
                              marginInlineEnd: "3px",
                              marginInlineStart: "unset",
                            }}
                            onClick={formMethods.handleSubmit(onSubmit)}
                          >
                            <CheckCircleOutlineRoundedIcon
                              sx={{ color: "primary.contrastText" }}
                            />
                          </IconButton>
                          <IconButton
                            edge="end"
                            sx={{
                              bgcolor: "primary.main",
                              "&:hover": {
                                bgcolor: "primary.dark",
                              },
                              borderRadius: "4px",
                              height: "36px",
                              marginBottom: "2px",
                            }}
                            onClick={handleCancel}
                          >
                            <CancelRoundedIcon
                              sx={{ color: "primary.contrastText" }}
                            />
                          </IconButton>
                        </Box>
                      </Box>
                    </FormProviderWithForm>
                  ) : (
                    <Box
                      height="38px"
                      borderRadius={0.5}
                      paddingInlineStart="12px"
                      paddingInlineEnd="8px"
                      width="100%"
                      justifyContent="space-between"
                      sx={{
                        ...styles.centerV,
                        "&:hover": {
                          border: editable ? "1px solid #1976d299" : "unset",
                          borderColor: editable ? "primary.main" : "unset",
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
                              bgcolor="#00000014"
                              borderRadius={2}
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
                            bgcolor: "primary.main",
                            "&:hover": {
                              bgcolor: "primary.dark",
                            },
                            borderRadius: "3px",
                            height: "36px",
                          }}
                          onClick={() => setShow(!show)}
                        >
                          <EditRoundedIcon
                            sx={{ color: "primary.contrastText" }}
                          />
                        </IconButton>
                      )}
                    </Box>
                  )}
                </Box>

                {TextFields.map((field) => {
                  const { name, label, multiline, useRichEditor } = field;
                  const data = { about, metadata, translations };

                  return (
                    <Box key={name}>
                      <Box
                        my={1.5}
                        justifyContent="space-between"
                        sx={{ ...styles.centerV }}
                      >
                        <Typography
                          variant="body2"
                          mr={4}
                          minWidth="64px !important"
                        >
                          <Trans i18nKey={label} />:
                        </Typography>
                        <RenderGeneralField
                          field={name}
                          data={data}
                          editableFields={editableFields}
                          langCode={langCode}
                          updatedValues={updatedValues}
                          setUpdatedValues={setUpdatedValues}
                          showTranslations={showTranslations}
                          toggleTranslation={toggleTranslation}
                          handleFieldEdit={handleFieldEdit}
                          multiline={multiline}
                          useRichEditor={useRichEditor}
                          updateTranslation={updateTranslation}
                          handleSaveEdit={handleSaveEdit}
                          handleCancelTextBox={handleCancelTextBox}
                        />
                      </Box>
                    </Box>
                  );
                })}

                <Box
                  my={1.5}
                  justifyContent="space-between"
                  sx={{ ...styles.centerV }}
                >
                  <Typography variant="body2" mr={4} minWidth="64px !important">
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
                mt={1}
                p={2.5}
                borderRadius={2}
                bgcolor="background.containerLowest"
                height="100%"
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

                <Box display="flex" px={1} mt={4}>
                  <Box display="flex" mr={4}>
                    <FavoriteRoundedIcon color="primary" />
                    <Typography color="primary" ml={1}>
                      {likes}
                    </Typography>
                  </Box>
                  <Box display="flex">
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
      res.message && showToast(res.message, { variant: "success" });
      await infoQuery();
    } catch (e) {
      const err = e as ICustomError;
      if (Array.isArray(err.response?.data?.message)) {
        showToast(err.response?.data?.message[0]);
      } else if (err.response?.data?.hasOwnProperty("message")) {
        showToast(error);
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
        justifyContent="space-between"
        sx={{ ...styles.centerV }}
        width="100%"
      >
        <Typography variant="body2" mr={4} minWidth="64px !important">
          {title}
        </Typography>

        {editable && show ? (
          <Box display="flex" flexDirection="column" width="100%">
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
                      bgcolor: "primary.main",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                      borderRadius: "3px",
                      height: "36px",
                      margin: "3px",
                    }}
                    onClick={updateAssessmentKit}
                  >
                    <CheckCircleOutlineRoundedIcon
                      sx={{ color: "primary.contrastText" }}
                    />
                  </IconButton>
                  <IconButton
                    title="Cancel Edit"
                    edge="end"
                    sx={{
                      bgcolor: "primary.main",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                      borderRadius: "4px",
                      height: "36px",
                    }}
                    onClick={handleCancel}
                  >
                    <CancelRoundedIcon sx={{ color: "primary.contrastText" }} />
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
            minHeight="38px"
            borderRadius="4px"
            paddingInlineStart="12px"
            paddingInlineEnd="8px"
            width="100%"
            justifyContent="space-between"
            sx={{
              ...styles.centerV,
              wordBreak: "break-word",
              "&:hover": {
                border: editable ? "1px solid #1976d299" : "unset",
                borderColor: editable ? "primary.main" : "unset",
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
                  bgcolor: "primary.main",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                  borderRadius: "3px",
                  height: "36px",
                }}
                onClick={() => setShow(!show)}
              >
                <EditRoundedIcon sx={{ color: "primary.contrastText" }} />
              </IconButton>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

const OnHoverStatus = (props: any) => {
  const { data, title, updateAssessmentKit, editable } = props;

  const [selected, setSelected] = useState<boolean>(data);
  const handleToggle = async (status: boolean) => {
    if (editable) {
      setSelected(status);
      if (status !== data) {
        await updateAssessmentKit();
      }
    }
  };

  return (
    <Box>
      <Box my={1.5} sx={{ ...styles.centerV }}>
        <Typography variant="body2" mr={4} minWidth="64px !important">
          {title}
        </Typography>
        <Box
          display="flex"
          bgcolor="#00000014"
          borderRadius={1}
          justifyContent="space-between"
          width="fit-content"
          p="2px"
          gap="4px"
          ml={0.5}
        >
          <Box
            onClick={() => handleToggle(true)}
            p={0.5}
            bgcolor={selected ? "#2e7d32" : "transparent"}
            color={selected ? "background.containerLowest" : "text.primary"}
            borderRadius="6px"
            width="100px"
            textAlign="center"
            sx={{
              cursor: editable ? "pointer" : "default",
              transition: "background-color 0.3s ease",
              animation: `${fadeIn} 0.5s ease`,
            }}
          >
            <Typography
              variant="body2"
              fontWeight="700"
              textTransform="uppercase"
              sx={{ userSelect: "none" }}
              fontSize="0.75rem"
            >
              <Trans i18nKey="common.published" />
            </Typography>
          </Box>
          <Box
            onClick={() => handleToggle(false)}
            p={0.5}
            bgcolor={!selected ? "disabled.main" : "transparent"}
            color={!selected ? "background.containerLowest" : "text.primary"}
            borderRadius="6px"
            width="100px"
            textAlign="center"
            sx={{
              cursor: editable ? "pointer" : "default",
              transition: "background-color 0.3s ease",
              animation: `${fadeIn} 0.5s ease`,
            }}
          >
            <Typography
              variant="body2"
              fontWeight="700"
              textTransform="uppercase"
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
  const { data, title, updateAssessmentKit, editable } = props;
  const { assessmentKitId, expertGroupId } = useParams();
  const [selected, setSelected] = useState<boolean>(data);
  const handleToggle = (status: boolean) => {
    if (editable) {
      setSelected(status);
      if (status !== data) updateAssessmentKit();
    }
  };

  return (
    <Box>
      <Box my={1.5} sx={{ ...styles.centerV }}>
        <Typography variant="body2" mr={4} sx={{ minWidth: "64px !important" }}>
          {title}
        </Typography>
        <Box display="flex" width="100%">
          <Box
            display="flex"
            bgcolor="#00000014"
            borderRadius={1}
            justifyContent="space-between"
            width="fit-content"
            p="2px"
            gap="4px"
            ml={0.5}
          >
            <Box
              onClick={() => handleToggle(true)}
              p={0.5}
              bgcolor={selected ? "#7954B3" : "transparent"}
              color={selected ? "background.containerLowest" : "text.primary"}
              borderRadius="6px"
              width="100px"
              textAlign="center"
              sx={{
                cursor: editable ? "pointer" : "default",
                transition: "background-color 0.3s ease",
                animation: `${fadeIn} 0.5s ease`,
              }}
            >
              <Typography
                variant="body2"
                fontWeight="700"
                textTransform="uppercase"
                sx={{ userSelect: "none" }}
                fontSize=".75rem"
              >
                <Trans i18nKey="common.private" />
              </Typography>
            </Box>
            <Box
              onClick={() => handleToggle(false)}
              p={0.5}
              bgcolor={!selected ? "disabled.main" : "transparent"}
              color={!selected ? "background.containerLowest" : "text.primary"}
              borderRadius="6px"
              width="100px"
              textAlign="center"
              sx={{
                cursor: editable ? "pointer" : "default",
                transition: "background-color 0.3s ease",
                animation: `${fadeIn} 0.5s ease`,
              }}
            >
              <Typography
                variant="body2"
                fontWeight="700"
                textTransform="uppercase"
                sx={{ userSelect: "none" }}
                fontSize=".75rem"
              >
                <Trans i18nKey="common.public" />
              </Typography>
            </Box>
          </Box>
          {editable && selected && (
            <Box ml={1}>
              <Tooltip
                title={<Trans i18nKey="assessmentKit.managePermissions" />}
              >
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

export default AssessmentKitSectionGeneralInfo;

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;
