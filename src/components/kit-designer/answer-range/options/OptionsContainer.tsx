import { useState } from "react";
import Box from "@mui/material/Box";
import { styles } from "@styles";
import IconButton from "@mui/material/IconButton";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Divider from "@mui/material/Divider";
import { useParams } from "react-router-dom";
import { IOption, KitDesignListItems, MultiLangs } from "@/types/index";
import TextField from "@mui/material/TextField";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@/providers/service-provider";
import languageDetector from "@/utils/language-detector";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";
import MultiLangTextField from "@common/fields/MultiLangTextField";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";
import { useKitDesignerContext } from "@/providers/kit-provider";
import TitleWithTranslation from "@/components/common/fields/TranslationText";
import { Text } from "@/components/common/Text";
import { Trans, useTranslation } from "react-i18next";
import { NumberField } from "@/components/common/fields/NumberField";

interface ITempValues {
  title: string;
  translations?: MultiLangs | null;
  value: any;
}

const OptionContain = (props: any) => {
  const { t } = useTranslation();
  const { kitState } = useKitDesignerContext();
  const langCode = kitState.translatedLanguage?.code;

  const { updateTranslation } = useTranslationUpdater(langCode);

  const { answerOption, setChangeData } = props;
  const { kitVersionId = "" } = useParams();
  const { service } = useServiceContext();
  const [editMode, setEditMode] = useState<any>(null);
  const [tempValues, setTempValues] = useState<ITempValues>({
    title: "",
    translations: null,
    value: 0,
  });
  const EditAnswerRangeOption = useQuery({
    service: (args, config) =>
      service.kitVersions.answerOptions.updateOption(args, config),
    runOnMount: false,
  });

  const handleEditClick = (answerOption: KitDesignListItems) => {
    const { id, title, value, translations } = answerOption;
    setEditMode(id);
    setTempValues({
      title: title,
      translations: translations,
      value: value,
    });
  };

  const handleSaveClick = async (item: IOption) => {
    setEditMode(null);
    const data = {
      ...item,
      title: tempValues.title,
      translations: tempValues.translations,
      value: tempValues.value,
    };
    let answerOptionId = item.id;
    await EditAnswerRangeOption.query({
      kitVersionId,
      answerOptionId,
      data,
    }).then(() => {
      setChangeData((prev: any) => !prev);
    });
  };

  const handleCancelClick = () => {
    setEditMode(null);
    setTempValues({ title: "", translations: null, value: 0 });
  };

  return (
    <>
      <Box sx={{ display: "flex", py: ".8rem", px: "1rem" }}>
        <Box
          minWidth="30px"
          sx={{
            ...styles.centerVH,
            bgcolor: "background.container",
            justifyContent: "space-around",
          }}
          borderRadius="0.5rem"
          mx={1}
          px={0.5}
        >
          <Text variant="semiBoldLarge">{`${answerOption?.index}`}</Text>
        </Box>

        <Box
          sx={{
            width: { xs: "50%", md: "70%" },
          }}
        >
          {editMode === answerOption.id ? (
            <MultiLangTextField
              name="title"
              value={tempValues.title}
              onChange={(e) =>
                setTempValues({
                  ...tempValues,
                  title: e.target.value,
                })
              }
              inputProps={{
                style: {
                  fontFamily: languageDetector(tempValues.title)
                    ? farsiFontFamily
                    : primaryFontFamily,
                },
              }}
              translationValue={
                langCode
                  ? (tempValues.translations?.[langCode]?.title ?? "")
                  : ""
              }
              onTranslationChange={updateTranslation("title", setTempValues)}
              label={t("common.title")}
            />
          ) : (
            <TitleWithTranslation
              title={answerOption.title}
              translation={
                langCode ? answerOption.translations?.[langCode]?.title : ""
              }
              variant="semiBoldMedium"
            />
          )}
        </Box>
        {editMode === answerOption.id ? (
          <Box sx={{ width: { xs: "20%", md: "10%" }, textAlign: "center" }}>
            <NumberField
              required
              label={<Trans i18nKey="common.score" />}
              name="value"
              value={tempValues.value ?? ""}
              onChange={(next) =>
                setTempValues((prev: any) => ({ ...prev, value: next }))
              }
              min={0}
              max={1}
              type="float"
              fullWidth
              inputProps={{
                "data-testid": "title-id",
                style: { width: 40, textAlign: "center" },
              }}
              margin="normal"
            />
          </Box>
        ) : (
          <Box sx={{ width: { xs: "20%", md: "10%" }, textAlign: "center" }}>
            {answerOption?.value}
          </Box>
        )}
        <Box
          width={{ xs: "20%", md: "10%" }}
          marginLeft="auto"
          sx={{ ...styles.centerH }}
        >
          {editMode === answerOption.id ? (
            <>
              <IconButton
                size="small"
                data-testid="item-save-option-icon"
                onClick={() => handleSaveClick(answerOption)}
                sx={{ ml: 1 }}
                color="success"
              >
                <CheckRoundedIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleCancelClick}
                sx={{ ml: 1 }}
                color="secondary"
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <Box>
              <IconButton
                size="small"
                data-testid="item-edit-option-icon"
                onClick={() => handleEditClick(answerOption)}
                sx={{ ml: 1 }}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>
      {answerOption.index !== answerOption.total && (
        <Divider sx={{ width: "95%", mx: "auto" }} />
      )}
    </>
  );
};

export default OptionContain;
