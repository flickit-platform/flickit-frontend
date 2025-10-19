import { Box, Chip, Divider } from "@mui/material";
import { IOption } from "../../model/types";
import { Text } from "@/components/common/Text";
import { t } from "i18next";
import { getTranslation } from "../footer/SubjectPanel";

export const OptionsSection = ({ options }: { options: IOption[] }) => {
  return (
    <>
      {Boolean(options?.length) && (
        <Box px={2} pb={2}>
          <Text variant="titleSmall" sx={{ mb: 1 }}>
            {t("common.options")}
          </Text>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {options.map((option: IOption) => (
              <Box
                key={option.index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  marginInlineEnd: 3,
                  mb: 2,
                  py: 1,
                  px: 2,
                  borderRadius: 2,
                  border: "0.5px solid",
                  borderColor: "outline.variant",
                  width: "fit-content",
                }}
              >
                <Box display="flex" flexDirection="column">
                  {" "}
                  <Box>
                    <Text variant="bodyMedium">{option.index}.</Text>{" "}
                    <Text variant="bodyMedium"> {option.title}</Text>
                  </Box>
                  {getTranslation(option.translations, "title") && (
                    <>
                      <Divider
                        variant="fullWidth"
                        orientation="horizontal"
                        flexItem
                      />
                      <Text variant="bodyMedium">
                        {getTranslation(option.translations, "title")}
                      </Text>
                    </>
                  )}
                </Box>

                <Chip
                  label={
                    <Box>
                      <Text variant="bodySmall">{t("common.score")}</Text>:{" "}
                      <Text
                        variant="bodySmall"
                        sx={{ paddingInlineStart: "2.5px" }}
                      >
                        {option?.value}
                      </Text>
                    </Box>
                  }
                  sx={{
                    borderRadius: "16px",
                    bgcolor: "background.container",
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};
