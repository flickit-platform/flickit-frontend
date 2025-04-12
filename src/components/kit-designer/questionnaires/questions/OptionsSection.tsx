import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import { Trans } from "react-i18next";
import OptionList from "./OptionsList";
import OptionForm from "./OptionForm";
import { useServiceContext } from "@/providers/ServiceProvider";
import { useQuery } from "@/utils/useQuery";
import toastError from "@/utils/toastError";
import { ICustomError } from "@/utils/CustomError";
import { dropdownStyle } from "./ImpactForm";
import languageDetector from "@/utils/languageDetector";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import EmptyState from "../../common/EmptyState";
import { t } from "i18next";
import { TId } from "@/types";

const OptionsSection = ({
  question,
  kitVersionId,
  fetchOptions,
  selectedAnswerRange,
  setSelectedAnswerRange,
}: {
  kitVersionId: string;
  question?: any;
  fetchOptions?: any;
  selectedAnswerRange: any;
  setSelectedAnswerRange: any;
}) => {
  const { service } = useServiceContext();

  const fetchAnswerRanges = useQuery({
    service: (args, config) =>
      service.kitVersions.answerRanges.getAll(args ?? { kitVersionId }, config),
    runOnMount: true,
  });

  const postAnswerOptionsKit = useQuery({
    service: (args, config) =>
      service.kitVersions.answerOptions.createOption(
        args ?? { kitVersionId, data: {} },
        config,
      ),
    runOnMount: false,
  });

  const [newOption, setNewOption] = useState({
    title: "",
    index: 1,
    value: 1,
    id: null,
  });
  const [showNewOptionForm, setShowNewOptionForm] = useState(false);
  const [disableAddOption, setDisableAddOption] = useState(false);

  useEffect(() => {
    const item = fetchAnswerRanges?.data?.items.find(
      (r: any) => r.id === selectedAnswerRange,
    );
    setDisableAddOption(Boolean(item));
  }, [fetchAnswerRanges?.data?.items, selectedAnswerRange]);
  const handleAnswerRangeChange = async (event: any) => {
    const requestData = {
      ...question,
      answerRangeId: event.target.value,
    };
    try {
      await service.kitVersions.questions
        .update({
          ...question,
          kitVersionId,
          questionId: question?.id,
          data: requestData,
        })
        .then(() => {
          setSelectedAnswerRange(event.target.value);
          fetchOptions.query();
          setDisableAddOption(true);
        });
    } catch (err) {
      const error = err as ICustomError;
      toastError(error);
    }
  };
  const handleAddNewRow = () => setShowNewOptionForm(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === "value" ? parseInt(value) || 1 : value;
    setNewOption((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSave = async () => {
    console.log("object");
    try {
      const data = {
        kitVersionId,
        index: newOption.index,
        value: newOption.value,
        title: newOption.title,
        questionId: question?.id,
      };
      await postAnswerOptionsKit.query({ kitVersionId, data });
      fetchOptions.query();
      setShowNewOptionForm(false);
      setNewOption({
        title: "",
        index: (fetchOptions.data?.items.length ?? 0) + 1,
        value: (fetchOptions.data?.items.length ?? 0) + 1,
        id: null,
      });
    } catch (e) {
      toastError(e as ICustomError);
    }
  };

  const handleCancel = () => {
    setShowNewOptionForm(false);
    setNewOption({
      title: "",
      index: (fetchOptions.data?.items.length ?? 0) + 1,
      value: (fetchOptions.data?.items.length ?? 0) + 1,
      id: null,
    });
  };

  const handleAddOption = async (item: any) => {
    try {
      await postAnswerOptionsKit
        .query({
          kitVersionId,
          data: { ...item, questionId: question?.id },
        })
        .then(() => {
          fetchOptions.query();
          setShowNewOptionForm(false);
        });
    } catch (err) {
      const error = err as ICustomError;
      toastError(error);
    }
  };

  return (
    <Grid item xs={12}>
      <Box
        mt={1.5}
        p={1.5}
        sx={{
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography variant="body2">
          <Trans i18nKey="answerOptions" />
        </Typography>
        <Tooltip
          title={
            fetchAnswerRanges?.data?.items.length === 0 && t("emptyAnswerRange")
          }
        >
          <Select
            value={selectedAnswerRange ?? ""}
            onChange={handleAnswerRangeChange}
            sx={{ ...dropdownStyle, fontFamily: farsiFontFamily }}
            size="small"
            displayEmpty
            disabled={fetchAnswerRanges?.data?.items?.length === 0}
          >
            <MenuItem value="" disabled>
              <Trans i18nKey="chooseAnswerRange" />
            </MenuItem>
            {fetchAnswerRanges?.data?.items?.map((range: any) => (
              <MenuItem
                key={range.id}
                value={range.id}
                sx={{
                  fontFamily: languageDetector(range.title)
                    ? farsiFontFamily
                    : primaryFontFamily,
                }}
              >
                {range.title}
              </MenuItem>
            ))}
          </Select>
        </Tooltip>
      </Box>
      {fetchOptions?.data?.answerOptions?.length > 0 ? (
        <Box maxHeight={500} overflow="auto">
          <OptionList
            Options={fetchOptions?.data?.answerOptions}
            onEdit={handleAddNewRow}
            onDelete={handleAddNewRow}
            onReorder={handleAddNewRow}
            onAdd={handleAddOption}
            isAddingNew={showNewOptionForm}
            setIsAddingNew={setShowNewOptionForm}
            disableAddOption={disableAddOption}
          />
        </Box>
      ) : (
        <>
          {showNewOptionForm ? (
            <OptionForm
              newItem={newOption}
              handleInputChange={handleInputChange}
              handleSave={handleSave}
              handleCancel={handleCancel}
            />
          ) : (
            <EmptyState
              btnTitle="newOption"
              title="optionsEmptyState"
              SubTitle="optionsEmptyStateDetailed"
              onAddNewRow={handleAddNewRow}
              disabled={Boolean(selectedAnswerRange)}
              disableTextBox={<Trans i18nKey={"emptyAnswerRange"} />}
            />
          )}
        </>
      )}
      <Divider sx={{ my: 1, mt: 4 }} />
    </Grid>
  );
};

export default OptionsSection;
