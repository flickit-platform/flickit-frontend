import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Trans } from "react-i18next";
import Grid from "@mui/material/Grid";
import i18next, { t } from "i18next";
import { ICustomError } from "@/utils/custom-error";
import { useServiceContext } from "@/providers/service-provider";
import { useQuery } from "@/hooks/useQuery";
import { useParams } from "react-router";
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
import firstCharDetector from "@/utils/first-char-detector";
import { keyframes } from "@emotion/react";
import { Link } from "react-router-dom";
import { LoadingSkeleton } from "@common/loadings/LoadingSkeleton";
import { AssessmentKitStatsType, AssessmentKitInfoType } from "@/types/index";
import SelectLanguage from "@/utils/select-language";
import { useConfigContext } from "@/providers/config-provider";
import uniqueId from "@/utils/unique-id";
import { getReadableDate } from "@/utils/readable-date";
import showToast from "@/utils/toast-error";
import { RenderGeneralField } from "@common/RenderGeneralField";
import useGeneralInfoField from "@/hooks/useGeneralInfoField";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";
import { styles } from "@styles";
import { Text } from "../common/Text";
import LanguageIcon from "@mui/icons-material/LanguageRounded";
import PriceIcon from "@common/icons/Price";
import { Button, useTheme } from "@mui/material";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { formatLanguageCodes } from "@utils/language-utils";

interface IAssessmentKitSectionAuthorInfo {
  setExpertGroup: any;
  setAssessmentKitTitle: any;
  setHasActiveVersion: any;
  handleDownloadDSL: any;
  handleUpdateDSL: any;
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
  const { setExpertGroup, setAssessmentKitTitle, setHasActiveVersion, handleDownloadDSL, handleUpdateDSL } = props;
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

        const infoBoxData = {
          "common.maturityLevel": maturityLevelsCount,
          "common.subjects": subjects?.map((sub: any) => sub?.title)?.length,
          "assessmentReport.subjectsAndAttributes": attributesCount,
          "common.questionnaire": questionnairesCount,
          "common.questions": questionsCount,
          "assessmentKit.numberMeasures": 1,
        };

        return (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
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
                <Box height="38px" width="100%" sx={{ ...styles.centerV }}>
                  <Text variant="body2" mr={4} minWidth="64px !important">
                    <Trans i18nKey="common.price" />
                  </Text>
                  <Text variant="body2" fontWeight="700" mr={4} ml={1}>
                    <Trans i18nKey="common.free" />
                  </Text>
                </Box>
                <Box
                  my={1.5}
                  justifyContent="space-between"
                  sx={{ ...styles.centerV }}
                >
                  <Text variant="body2" mr={4} minWidth="64px !important">
                    <Trans i18nKey="common.tags" />
                  </Text>
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
                              <Text variant="body2" fontWeight="700">
                                {tag.title}
                              </Text>
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
                        <Text variant="body2" mr={4} minWidth="64px !important">
                          <Trans i18nKey={label} />:
                        </Text>
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
                  <Text variant="body2" mr={4} minWidth="64px !important">
                    <Trans i18nKey="common.language" />
                  </Text>
                  <SelectLanguage
                    handleChange={handleLanguageChange}
                    mainLanguage={mainLanguage}
                    languages={languages}
                    editable={editable}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <InfoBox
                creationTime={creationTime}
                lastModificationTime={lastModificationTime}
                likes={likes}
                infoBoxData={infoBoxData}
                handleDownloadDSL={handleDownloadDSL}
                handleUpdateDSL={handleUpdateDSL}
                languages={languages}
                assessmentCounts={assessmentCounts }
              />
            </Grid>
          </Grid>
        );
      }}
    />
  );
};

const InfoBox = (props: any) => {
  const { creationTime, lastModificationTime, infoBoxData, handleUpdateDSL, handleDownloadDSL, likes, languages, assessmentCounts  } = props;
  const theme = useTheme();

  return (
    <Box sx={{ ...styles.centerCH, gap: 2, mt: "8px" }}>
      <Grid container spacing={2}>
        <RowSplit
          title={t("common.creationDate")}
          value={getReadableDate(creationTime)}
          xs={6}
        />
        <RowSplit
          title={t("common.lastUpdated")}
          value={getReadableDate(lastModificationTime)}
          xs={6}
        />
      </Grid>
      <Grid
        container
        sx={{
          background: "#fff",
          borderRadius: "12px",
          p: "16px 48px",
          flex: 1,
        }}
      >
        {[...Object.entries(infoBoxData)].map(([title, value], index) => {
          const columns = 3;
          const centerIndex = Math.floor(columns / 2);
          const isMiddle = index % columns === centerIndex;
          const isTop = index < columns;

          return (
            <TotalInfo
              key={title}
              title={t(title)}
              value={value}
              xs={4}
              isMiddle={isMiddle}
              isTop={isTop}
            />
          );
        })}
      </Grid>

      <Grid container>
        <FullRow
          firstTitle={t("common.supportedLanguages")}
          secondTitle={t("common.price")}
          firstValue={formatLanguageCodes(languages, i18next.language)}
          secondValue={t("common.free")}
          xs={12}
          firstIcon={<LanguageIcon fontSize="large" sx={{ color: "primary.main" }} />}
          secondIcon={
            <PriceIcon
              color={theme.palette.primary.dark}
              width="33px"
              height="33px"
            />
          }
        />
      </Grid>
      <Grid container>
        <FullRow
          firstTitle={t("assessmentKit.createdAssessments")}
          secondTitle={t("common.liked")}
          firstValue={assessmentCounts}
          secondValue={<>
            {likes} {" "} {t("common.times")}
          </>}
          xs={12}
          firstIcon={
            <AssignmentOutlinedIcon fontSize="large" sx={{ color: "primary.main" }} />
          }
          secondIcon={
            <FavoriteBorderOutlinedIcon
              sx={{ color: theme.palette.primary.dark }}
              width="33px"
              height="33px"
            />
          }
        />
      </Grid>
      <Grid container >
        <Grid item xs={12}>
          <Button disabled fullWidth variant={"contained"} startIcon={<EditIcon />} >
            <Text variant={"bodyLarge"}>
              {t("assessment.editKit")}
            </Text>
          </Button>
        </Grid>
      </Grid>
      <Grid container >
        <Grid item xs={12} sx={{display: "flex", gap: "16px"}} >
          <Button onClick={handleDownloadDSL} sx={{width: "100%"}}  variant={"outlined"} startIcon={<FileDownloadOutlinedIcon />} >
            <Text variant={"bodyLarge"}>
              {t("assessmentKit.downloadDSLKit")}
            </Text>
          </Button>
          <Button onClick={handleUpdateDSL} sx={{width: "100%"}} variant={"outlined"} startIcon={<FileUploadOutlinedIcon />} >
            <Text variant={"bodyLarge"}>
              {t("assessmentKit.updateDSLKit")}
            </Text>
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

const FullRow = (props: any) => {
  const { firstTitle, secondTitle, firstValue, secondValue, firstIcon, secondIcon, ...rest } = props;

  return (
    <Grid item {...rest}>
      <Box
        sx={{
          ...styles.centerV,
          alignItems: "center",
          background: "#fff",
          borderRadius: "12px",
          p: 2,
          flex: 1,
        }}
      >
        <Grid container>
          {[{ title: firstTitle, value: firstValue, Icon: firstIcon }, { title: secondTitle, value: secondValue, Icon: secondIcon }].map(
            ({ title, value, Icon }, idx) => (
              <Grid item xs={6} key={idx}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {Icon}
                  <Box sx={{ ...styles.centerCV }}>
                    <Text
                      variant="bodyMedium"
                      color="info.main"
                      sx={{ ...styles.rtlStyle(firstCharDetector(title)) }}
                    >
                      {title}
                    </Text>
                    <Text
                      variant="bodyLarge"
                      color="background.secondaryDark"
                      sx={{ ...styles.rtlStyle(firstCharDetector(title)) }}
                    >
                      {value}
                    </Text>
                  </Box>
                </Box>
              </Grid>
            )
          )}
        </Grid>
      </Box>
    </Grid>
  );
};

const TotalInfo = (props: any) => {
  const { title, value, isMiddle, isTop, ...rest } = props;

  return (
    <Grid
      item
      {...rest}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        position: "relative",
        px: 2,
        mb: isTop ? 3 : 0,
        ...(isMiddle && {
          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: "12%",
            height: "76%",
            width: "1px",
            bgcolor: "#C7CCD1",
            display: { xs: "none", sm: "block" },
          },
          "&::after": {
            content: '""',
            position: "absolute",
            right: 0,
            top: "12%",
            height: "76%",
            width: "1px",
            bgcolor: "#C7CCD1",
            display: { xs: "none", sm: "block" },
          },
        }),
      }}
    >
      <Box
        sx={{
          ...styles.centerCH,
          justifyContent: "space-between",
          textAlign: "center",
          height: "59px",
        }}
      >
        <Text variant="bodyMedium" color="info.main">
          {title}
        </Text>
        <Text variant="bodyLarge" color="background.secondaryDark">
          {value}
        </Text>
      </Box>
    </Grid>
  );
};

const RowSplit = (props: any) => {
  const { title, value, ...rest } = props;

  return (
    <Grid item {...rest}>
      <Box
        sx={{
          ...styles.centerCH,
          background: "#fff",
          borderRadius: "12px",
          py: 2,
          flex: 1,
        }}
      >
        <Text variant="bodyMedium" color="info.main">
          {title}
        </Text>
        <Text variant="bodyLarge" color="background.secondaryDark">
          {value}
        </Text>
      </Box>
    </Grid>
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
        <Text variant="body2" mr={4} minWidth="64px !important">
          {title}
        </Text>

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
              <Text color="#ba000d" variant="caption">
                {error?.data?.[type]}
              </Text>
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
            <Text variant="body2" fontWeight="700">
              {data?.replace(/<\/?p>/g, "")}
            </Text>
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
    res.message && showToast(res.message, { variant: "success" });
    await infoQuery();
  };
  return (
    <Box>
      <Box my={1.5} sx={{ ...styles.centerV }}>
        <Text variant="body2" mr={4} minWidth="64px !important">
          {title}
        </Text>
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
            <Text
              variant="body2"
              fontWeight="700"
              textTransform="uppercase"
              sx={{ userSelect: "none" }}
              fontSize="0.75rem"
            >
              <Trans i18nKey="common.published" />
            </Text>
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
            <Text
              variant="body2"
              fontWeight="700"
              textTransform="uppercase"
              sx={{ userSelect: "none" }}
              fontSize=".75rem"
            >
              <Trans i18nKey="common.unpublished" />
            </Text>
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
    res.message && showToast(res.message, { variant: "success" });
    await infoQuery();
  };
  return (
    <Box>
      <Box my={1.5} sx={{ ...styles.centerV }}>
        <Text variant="body2" mr={4} sx={{ minWidth: "64px !important" }}>
          {title}
        </Text>
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
              <Text
                variant="body2"
                fontWeight="700"
                textTransform="uppercase"
                sx={{ userSelect: "none" }}
                fontSize=".75rem"
              >
                <Trans i18nKey="common.private" />
              </Text>
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
              <Text
                variant="body2"
                fontWeight="700"
                textTransform="uppercase"
                sx={{ userSelect: "none" }}
                fontSize=".75rem"
              >
                <Trans i18nKey="common.public" />
              </Text>
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
