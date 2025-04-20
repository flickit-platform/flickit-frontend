import React, { useState } from "react";
import Box from "@mui/material/Box";
import { styles } from "@styles";
import IconButton from "@mui/material/IconButton";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useParams } from "react-router-dom";
import { IOption, KitDesignListItems } from "@/types/index";
import TextField from "@mui/material/TextField";
import { Trans } from "react-i18next";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import languageDetector from "@utils/languageDetector";
import {farsiFontFamily, primaryFontFamily} from "@config/theme";
import MultiLangTextField from "@common/fields/MultiLangTextField";

interface ITempValues {
  title: string;
  translations: any;
  value: any;
}

const OptionContain = (props: any) => {
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
    service: (args, config) => service.kitVersions.answerOptions.updateOption(args, config),
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
  console.log(tempValues,"tempValuestempValues")
  return (
    <>
      <Box sx={{ display: "flex", py: ".8rem", px: "1rem" }}>
        <Box
          sx={{
            ...styles.centerVH,
            background: "#F3F5F6",
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
                    "data-testid": "items-option-title",
                    style: {
                      fontFamily: languageDetector(tempValues.title)
                          ? farsiFontFamily
                          : primaryFontFamily,
                    },
                  }}
                  translationValue={
                      tempValues.translations?.FA?.title ?? ""
                  }
                  onTranslationChange={(e) =>
                      setTempValues((prev) => ({
                        ...prev,
                        translations: {
                          ...prev.translations,
                          FA: {
                            ...prev.translations?.FA,
                            title: e.target.value,
                          },
                        },
                      }))
                  }
                  label={<Trans i18nKey="title" />}
              />
          ) : (
            <Box sx={{ width: "90%", fontFamily: languageDetector(answerOption?.title) ? farsiFontFamily : primaryFontFamily }}>{answerOption?.title}</Box>
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
            inputProps={{
              "data-testid": "items-option-value",
            }}
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
              background: "#fff",
              borderRadius: "8px",
            }}
            name="title"
            label={<Trans i18nKey="value" />}
          />
        ) : (
          <Box sx={{ width: { xs: "20%", md: "10%" }, textAlign: "center" }}>
            {answerOption?.value}
          </Box>
        )}
        <Box
          sx={{
            width: { xs: "20%", md: "10%" },
            display: "flex",
            justifyContent: "center",
            marginLeft: "auto",
          }}
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
