import Box, { BoxProps } from "@mui/material/Box";
import ReportGmailerrorredRoundedIcon from "@mui/icons-material/ReportGmailerrorredRounded";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

interface IErrorDataLoadingProps extends BoxProps {}

const ErrorDataLoading = (props: IErrorDataLoadingProps) => {
  const { ...rest } = props;
  return (
    <Box sx={{ ...styles.centerCVH }} pt="64px" pb="44px" {...rest}>
      <ReportGmailerrorredRoundedIcon sx={{ fontSize: "4rem", mb: "16px" }} />
      <Typography>
        <Trans i18nKey="someThingWentWrong" />
      </Typography >
      <Button sx={{mt:"50px"}} variant="contained" size="small" component={Link} to={"/"}>
        <Trans i18nKey={"backToHome"} />
      </Button>
    </Box>
  );
};

export default ErrorDataLoading;
