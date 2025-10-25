import Box, { BoxProps } from "@mui/material/Box";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import { Text } from "../Text";
import { ReactElement } from "react";

interface IErrorEmptyDataProps extends BoxProps {
  suggests?: ReactElement;
  emptyMessage?: ReactElement;
  img?: ReactElement;
  useIllustration?: boolean;
  hideMessage?: boolean;
}

const ErrorEmptyData = (props: IErrorEmptyDataProps) => {
  const {
    emptyMessage = <Trans i18nKey="errors.thisPlaceIsEmpty" />,
    useIllustration = false,
    img = useIllustration ? (
      <img
        src="/assets/svg/no-content-empty-state.svg"
        alt="no-content-empty-state"
      />
    ) : (
      <HourglassEmptyRoundedIcon
        sx={{ fontSize: "4rem", mb: "16px", opacity: 0.8 }}
      />
    ),
    suggests,
    hideMessage,
    ...rest
  } = props;

  return (
    <Box
      sx={{ ...styles.centerCVH, opacity: 0.8 }}
      pt="64px"
      pb="44px"
      textAlign="center"
      {...rest}
    >
      {img}
      {!hideMessage && (
        <Text variant="h5" textAlign="center">
          {emptyMessage}
        </Text>
      )}
      {suggests}
    </Box>
  );
};

export default ErrorEmptyData;
