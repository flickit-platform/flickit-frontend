import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import Tooltip from "@mui/material/Tooltip";
import { alpha, useTheme } from "@mui/material/styles";
import { ReactElement } from "react";
import { Text } from "@/components/common/Text";

interface EmptyStateProps {
  onAddNewRow?: () => void;
  btnTitle: string;
  title: string;
  SubTitle: string;
  disabled?: boolean;
  disableTextBox?: ReactElement<any, any>;
}

const EmptyStateOptions = ({
  onAddNewRow,
  btnTitle,
  title,
  SubTitle,
  disabled,
  disableTextBox,
}: EmptyStateProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        ...styles.centerCVH,
        background: alpha(theme.palette.error.main, 0.04),
        borderRadius: "0 0 8px 8px",
      }}
      minHeight="180px"
      gap={2}
    >
      <Text
        variant="headlineSmall"
        fontWeight="bold"
        color={alpha(theme.palette.error.main, 0.3)}
      >
        <Trans i18nKey={title} />
      </Text>
      <Text
        color={alpha(theme.palette.error.main, 0.3)}
        variant="bodyMedium"
      >
        <Trans i18nKey={SubTitle} />
      </Text>
      <Tooltip disableHoverListener={!disabled} title={disableTextBox}>
        <div>
          <Button
            variant="outlined"
            sx={{
              color: "error.main",
              borderColor: "error.main",
              "&:hover": {
                borderColor: "error.main",
                background: alpha(theme.palette.error.main, 0.04),
              },
            }}
            onClick={onAddNewRow}
            disabled={disabled}
          >
            <Trans i18nKey={btnTitle} />
          </Button>
        </div>
      </Tooltip>
    </Box>
  );
};

export default EmptyStateOptions;
