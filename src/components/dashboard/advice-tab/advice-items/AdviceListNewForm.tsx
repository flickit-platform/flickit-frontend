import Box from "@mui/material/Box";
import { styles } from "@styles";
import TextField from "@mui/material/TextField";
import { Trans } from "react-i18next";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Grid from "@mui/material/Grid";
import FormProviderWithForm from "@common/FormProviderWithForm";
import { useForm } from "react-hook-form";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@/providers/service-provider";
import { useEffect, useState } from "react";
import { ICustomError } from "@/utils/custom-error";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import Impact from "@common/icons/Impact";
import languageDetector from "@/utils/language-detector";
import { t } from "i18next";
import RichEditorField from "@/components/common/fields/RichEditorField";
import showToast from "@/utils/toast-error";
import { useTheme } from "@mui/material";
import { Text } from "@/components/common/Text";

interface IAdviceListProps {
  newAdvice: any;
  handleInputChange: (e: any) => void;
  handleSave: () => void;
  handleCancel: () => void;
  setNewAdvice: any;
  removeDescriptionAdvice: any;
  postAdviceItem: any;
  errormessage?: any;
}

const DESCRIPTION_CHAR_LIMIT = 1500;

const AdviceListNewForm = ({
  newAdvice,
  handleInputChange,
  handleSave,
  handleCancel,
  setNewAdvice,
  removeDescriptionAdvice,
  postAdviceItem,
  errormessage,
}: IAdviceListProps) => {
  const theme = useTheme();

  const formMethods = useForm({ shouldUnregister: true });
  const selectAdvice = ["priority", "impact", "cost"];
  const { service } = useServiceContext();
  const [adviceOption, setAdviceOption] = useState<any>({
    impact: [],
    priority: [],
    cost: [],
  });

  const fetchAdviceImpactList = useQuery<any>({
    service: (args, config) => service.advice.getImpactLevels(config),
    runOnMount: false,
  });
  const fetchAdvicePriorityList = useQuery<any>({
    service: (args, config) => service.advice.getPriorityLevels(config),
    runOnMount: false,
  });
  const fetchCostList = useQuery<any>({
    service: (args, config) => service.advice.getCostLevels(config),
    runOnMount: false,
  });

  useEffect(() => {
    const fetchAdviceOptions = async () => {
      try {
        const [impactRes, priorityRes, costRes] = await Promise.all([
          fetchAdviceImpactList.query(),
          fetchAdvicePriorityList.query(),
          fetchCostList.query(),
        ]);
        setAdviceOption({
          impact: impactRes.levels,
          cost: costRes.levels,
          priority: priorityRes.levels,
        });
        if (newAdvice?.assessmentId) {
          setNewAdvice((prevState: any) => ({
            ...prevState,
            impact: impactRes.levels[1]?.code,
            priority: priorityRes.levels[1]?.code,
            cost: costRes.levels[1]?.code,
          }));
        }
      } catch (e) {
        const err = e as ICustomError;
        showToast(err);
      }
    };
    fetchAdviceOptions();
  }, []);

  const getIcon = (type: string) => {
    let element;
    if (type === "cost") {
      element = <AttachMoneyOutlinedIcon fontSize="small" color="primary" />;
    } else if (type === "impact") {
      element = (
        <Impact
          styles={{
            color: theme.palette.primary.dark,
            width: "16px",
            px: 4,
          }}
        />
      );
    } else {
      element = <PriorityHighIcon fontSize="small" color="primary" />;
    }
    return element;
  };

  useEffect(() => {
    setNewAdvice((prevState: any) => ({
      ...prevState,
      description: formMethods.getValues()["advice-description"],
    }));
  }, [formMethods.watch("advice-description")]);

  const rawDescription =
    (formMethods.watch("advice-description") as string) ??
    newAdvice.description ??
    "";
  const plainDescription = rawDescription
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
  const currentLength = plainDescription.length;
  const isDescriptionOverLimit = currentLength > DESCRIPTION_CHAR_LIMIT;
  const isRtlDescription = languageDetector(
    rawDescription || newAdvice.description || "",
  );

  const handleSaveWithLimit = () => {
    if (isDescriptionOverLimit) {
      const msg = t("common.maxCharacters", {
        count: DESCRIPTION_CHAR_LIMIT,
      });
      showToast(msg as any);
      return;
    }

    handleSave();
  };

  return (
    <Box
      mt={1.5}
      p={{ xs: 0.2, sm: 1.5 }}
      bgcolor="background.container"
      borderRadius="8px"
      border="0.3px solid #73808c30"
      display="flex"
      alignItems="flex-start"
      position="relative"
      width="100%"
    >
      <Box
        width="100%"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-evenly"
        bgcolor="background.container"
        borderRadius={2}
        p={2}
        sx={{ ...styles.centerVH }}
      >
        <Box sx={{ width: "100%" }} mx={1}>
          <Grid container spacing={1.4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                error={errormessage?.title}
                id="new-advice-item"
                required
                label={<Trans i18nKey="common.title" />}
                name="title"
                value={newAdvice.title}
                onChange={handleInputChange}
                fullWidth
                size="small"
                margin="normal"
                sx={{
                  mt: 0,
                  fontSize: 14,
                  "& .MuiInputBase-root": {
                    fontSize: 14,
                    ...styles.rtlStyle(languageDetector(newAdvice.title ?? "")),
                  },
                  "& .MuiFormLabel-root": {
                    fontSize: 14,
                  },
                  bgcolor: "background.containerLowest",
                }}
              />
              {errormessage?.title && (
                <FormHelperText error>{t(errormessage?.title)}</FormHelperText>
              )}
            </Grid>

            {selectAdvice?.map((item: any) => {
              return (
                <Grid
                  size={{ xs: 12, md: 2 }}
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "center" },
                    gap: { xs: 0.3, sm: "unset" },
                    "& .MuiGrid-root > .MuiGrid-item": {
                      paddingTop: "0px",
                    },
                  }}
                  key={item}
                >
                  <FormControl sx={{ width: { xs: "100%" } }}>
                    <InputLabel id="demo-multiple-name-label">
                      <Trans i18nKey={`common.${item}`} />
                    </InputLabel>
                    <Select
                      size="small"
                      labelId={`${item}-select-label`}
                      id={`${item}-select`}
                      value={newAdvice[item]?.toUpperCase()}
                      IconComponent={KeyboardArrowDownIcon}
                      name={item}
                      displayEmpty
                      input={<OutlinedInput label={t("user.name")} />}
                      onChange={(e) => handleInputChange(e)}
                      sx={{
                        fontSize: "14px",
                        bgcolor: "background.containerLowest",
                        px: "0px",
                        height: "36px",
                        "& .MuiSelect-select": {
                          display: "flex",
                          alignItems: "center",
                        },
                      }}
                    >
                      <MenuItem disabled value="">
                        <Text
                          color="primary"
                          variant="labelMedium"
                          sx={{
                            ...styles.centerV,
                            height: "24px",
                          }}
                        >
                          {getIcon(item)}
                          <Trans i18nKey={item.toLowerCase()} />
                        </Text>
                      </MenuItem>
                      {adviceOption[item]?.map((option: any, index: number) => (
                        <MenuItem key={option} value={option.code}>
                          {getIcon(item)}
                          <Trans i18nKey={option.title.toLowerCase()} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              );
            })}
          </Grid>

          <FormProviderWithForm formMethods={formMethods}>
            <Box
              width="100%"
              justifyContent="space-between"
              sx={{ ...styles.centerV }}
            >
              <Box sx={{ width: "100%", position: "relative" }}>
                <RichEditorField
                  name="advice-description"
                  placeholder={t("common.description")}
                  disable_label={false}
                  required={true}
                  defaultValue={newAdvice.description}
                  errorMessage={errormessage?.description}
                  type={
                    errormessage?.description || isDescriptionOverLimit
                      ? "error"
                      : ""
                  }
                  showEditorMenu={true}
                  menuProps={{
                    variant: "inline",
                  }}
                />

                {/* شمارنده کاراکتر داخل خود ادیتور */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 6,
                    right: isRtlDescription ? "unset" : 10,
                    left: isRtlDescription ? 10 : "unset",
                    px: 0.75,
                    py: 0.25,
                    borderRadius: "8px",
                    pointerEvents: "none",
                  }}
                >
                  <Text
                    variant="caption"
                    sx={{
                      color: isDescriptionOverLimit
                        ? theme.palette.error.main
                        : theme.palette.text.secondary,
                    }}
                  >
                    {currentLength}/{DESCRIPTION_CHAR_LIMIT}
                  </Text>
                </Box>
              </Box>
            </Box>
          </FormProviderWithForm>

          {errormessage?.description && (
            <FormHelperText error>
              {t(errormessage?.description)}
            </FormHelperText>
          )}
        </Box>

        {/* Check and Close Buttons */}
        <Box
          display="flex"
          alignSelf={{ xs: "flex-end", sm: "flex-start" }}
          flexDirection="column"
          gap={"20px"}
        >
          <Link
            href="#"
            sx={{
              ...styles.centerV,
              textDecoration: "none",
              opacity: 0.9,
              fontWeight: "bold",
              gap: "20px",
              flexDirection: { xs: "row-reverse", sm: "column" },
              mt: { xs: 2, sm: "unset" },
            }}
          >
            <IconButton
              size="small"
              color="primary"
              onClick={handleSaveWithLimit}
            >
              {postAdviceItem.loading ? <CircularProgress /> : <CheckIcon />}
            </IconButton>
            <IconButton size="small" color="secondary" onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default AdviceListNewForm;
