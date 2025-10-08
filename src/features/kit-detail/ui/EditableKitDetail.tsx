import { Fragment, useMemo } from "react";
import { Box, Grid } from "@mui/material";
import { Trans } from "react-i18next";
import { Text } from "@/components/common/Text";
import { RenderGeneralField } from "@/components/common/RenderGeneralField";
import type { AssessmentKitInfoType } from "@/types";
import { FieldName, useEditableKitDetail } from "../model/useEditableKitDetail";
import LanguagePicker from "./LanguagePicker";
import i18next from "i18next";

type Props = {
  fetchAssessmentKitInfoQuery: any;
  info: AssessmentKitInfoType;
};

const EditableKitDetail = ({ fetchAssessmentKitInfoQuery, info }: Props) => {
  const {
    // data
    dataForField,
    generalFields,
    selectedCodes,
    selectedTitles,
    languages,

    // state
    editableFields,
    langCode,
    showTranslations,
    updatedValues,

    // actions
    toggleTranslation,
    setUpdatedValues,
    handleFieldEdit,
    handleSaveEdit,
    handleCancelTextBox,
    updateTranslation,
    handleAddLanguage,
  } = useEditableKitDetail(info, fetchAssessmentKitInfoQuery);

  const fields = useMemo(() => generalFields, [generalFields]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={3}
      sx={{ background: "#fff", borderRadius: "12px", py: 2, px: 4 }}
    >
      <Grid container spacing={2}>
        {fields.map((field: any) => {
          const {
            name,
            label,
            multiline,
            useRichEditor,
            md,
            type,
            options,
            disabled,
            width
          } = field;

          return (
            <Fragment key={name}>
              <Grid item xs={12} md={md}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  sx={{
                    gap: { xs: 0, md: useRichEditor ? 0 : 5 },
                    flexDirection: {
                      xs: "column",
                      md: useRichEditor ? "column" : "row",
                    },
                    alignItems: {
                      xs: "flex-start",
                      md: useRichEditor ? "flex-start" : "center",
                    },
                  }}
                >
                  <Text
                    variant="titleSmall"
                    mt="2px"
                    height="100%"
                    minWidth={width}
                    whiteSpace="nowrap"
                  >
                    <Trans i18nKey={label} />
                  </Text>
                  <Box sx={{ display: "flex", width: "100%" }}>
                    <RenderGeneralField
                      field={name as FieldName}
                      fieldType={type}
                      data={dataForField}
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
                      options={options}
                      label={<Trans i18nKey={label} />}
                      disabled={disabled}
                      editable={info.editable}
                    />
                  </Box>
                </Box>
              </Grid>

              {name === "summary" && (
                <Grid
                  item
                  xs={12}
                  md={6}
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Box>
                    <Text variant="titleSmall" mt="2px" height="100%">
                      <Trans i18nKey={"common.supportedLanguages"} />
                    </Text>
                  </Box>
                  <Box
                    sx={{ display: "flex", width: "50%" }}
                    color="outline.variant"
                  >
                    <LanguagePicker
                      languages={languages}
                      values={selectedCodes}
                      primaryCode={info.mainLanguage?.code}
                      onAdd={handleAddLanguage}
                      label={selectedTitles}
                      size="small"
                      fullWidth
                      disabled={!info.editable}
                      behavior={{
                        matchButtonWidth: true,
                        lockPrimaryOnTop: true,
                      }}
                    />
                  </Box>
                </Grid>
              )}
            </Fragment>
          );
        })}
      </Grid>
    </Box>
  );
};

export default EditableKitDetail;
