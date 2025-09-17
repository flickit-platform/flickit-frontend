import { useState } from "react";
import Box from "@mui/material/Box";
import { styles } from "@styles";
import IconButton from "@mui/material/IconButton";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useParams } from "react-router-dom";
import { IOption, KitDesignListItems, MultiLangs } from "@/types/index";
import TextField from "@mui/material/TextField";
import { Trans } from "react-i18next";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@/providers/service-provider";
import languageDetector from "@utils/languageDetector";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";
import MultiLangTextField from "@common/fields/MultiLangTextField";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";
import { useKitDesignerContext } from "@/providers/kit-provider";
import TitleWithTranslation from "@/components/common/fields/TranslationText";

interface ITempValues {
  title: string;
  translations?: MultiLangs | null;
  value: any;
}

const OptionContain = (props: any) => {
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
          sx={{
            ...styles.centerVH,
            bgcolor: "background.container",
            width: { xs: "65px", md: "95px" },
            justifyContent: "space-around",
          }}
          borderRadius="0.5rem"
          mr={2}
          px={0.2}
        >
          <Typography variant="semiBoldLarge">{`${answerOption?.index}`}</Typography>
        </Box>

        <Box
          sx={{
            width: { xs: "50%", md: "60%" },
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
              label={<Trans i18nKey="common.title" />}
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
          <TextField
            required
            value={tempValues.value}
            onChange={(e) =>
              setTempValues({
                ...tempValues,
                value: e.target.value,
              })
            }
            variant="outlined"
            fullWidth
            size="small"
            sx={{
              mb: 1,
              fontSize: 14,
              "& .MuiInputBase-root": {
                fontSize: 14,
                overflow: "auto",
              },
              "& .MuiFormLabel-root": {
                fontSize: 14,
              },
              width: { xs: "20%", md: "10%" },
              bgcolor: "background.containerLowest",
              borderRadius: "8px",
            }}
            name="title"
            label={<Trans i18nKey="common.value" />}
          />
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
            <IconButton
              size="small"
              data-testid="item-edit-option-icon"
              onClick={() => handleEditClick(answerOption)}
              sx={{ ml: 1 }}
            >
              <ModeEditOutlineOutlinedIcon fontSize="small" />
            </IconButton>
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
