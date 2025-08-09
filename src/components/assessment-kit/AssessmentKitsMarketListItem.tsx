import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { styles } from "@styles";
import Title from "@common/Title";
import ThumbUpOffAltRoundedIcon from "@mui/icons-material/ThumbUpOffAltRounded";
import { Trans } from "react-i18next";
import Tooltip from "@mui/material/Tooltip";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import languageDetector from "@/utils/languageDetector";
import { useTheme } from "@mui/material";

const AssessmentKitsMarketListItem = ({ bg1, bg2, data = {} }: any) => {
  const HEIGHT_TITLE: number = 12;
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "280px",
        position: "relative",
        background: "#E5E5E5",
        borderRadius: 2,
        p: 4,
        color: "#000000de",
        boxShadow: 4,
        mt: 2,
        height: "calc(100% - 16px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Title
        size="small"
        sx={{ width: "100%", height: `${HEIGHT_TITLE}vh` }}
        sub={
          <Box
            sx={{
              ...styles.centerV,
              flexWrap: "wrap",
              fontSize: ".95rem",
              mt: 0.5,
              textTransform: "none",
              opacity: 0.9,
              minHeight: "27px",
              width: "100%",
            }}
          >
            {data.tags.map((tag: any) => {
              return (
                <Chip
                  key={tag.id}
                  label={tag?.title}
                  size="small"
                  sx={{ m: 0.2, background: "#bdbdbd36" }}
                />
              );
            })}
          </Box>
        }
        toolbarProps={{ alignSelf: "flex-start", p: 1 }}
      >
        <Box
          component={Link}
          to={`/assessment-kits/${data.id}`}
          sx={{
            textDecoration: "none",
            color: "#000000de",
            width: "100%",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontFamily: languageDetector(data.title)
              ? farsiFontFamily
              : primaryFontFamily,
          }}
        >
          {data.title}
        </Box>
      </Title>
      <Box mt={4} mb={2}>
        <Tooltip title={data?.summary.length > 55 && data?.summary}>
          <Typography
            sx={{
              wordBreak: "break-word",
              fontFamily: languageDetector(data.summary)
                ? farsiFontFamily
                : primaryFontFamily,
              direction: languageDetector(data.summary) ? "rtl" : "ltr",
            }}
          >
            {`${data.summary?.substring(0, 55)} ${data?.summary.length > 55 ? "..." : ""}`}
          </Typography>
        </Tooltip>
      </Box>
      <Box mt="auto">
        <CardHeader
          component={Link}
          to={`/user/expert-groups/${data.expertGroup?.id}`}
          sx={{ px: 0, textDecoration: "none" }}
          titleTypographyProps={{
            sx: { textDecoration: "none" },
            color: "white",
          }}
          avatar={<Avatar alt={data.expertGroup?.title} src={"/"} />}
          title={
            <Box
              component={"b"}
              fontSize=".95rem"
              textTransform={"capitalize"}
              color={"#000000de"}
              sx={{
                fontFamily: languageDetector(data.expertGroup?.title)
                  ? farsiFontFamily
                  : primaryFontFamily,
              }}
            >
              {data.expertGroup?.title}
            </Box>
          }
        />
      </Box>
      <Divider color="white" sx={{ opacity: 0.3 }} />
      <Box mt={2} sx={{ ...styles.centerV }}>
        <Box>
          <Box
            sx={{
              py: 0.3,
              px: 0.8,
              background: "#bdbdbd36",
              color: "gray",
              fontSize: ".8rem",
              borderRadius: 1,
              m: 0.2,
            }}
          >
            <Trans i18nKey="common.used" />:{" "}
            <Box component="span" color="black" textTransform="lowercase">
              {data.assessmentsCount} <Trans i18nKey="common.times" />
            </Box>
          </Box>
        </Box>
        <Box>
          <Box
            sx={{
              py: 0.3,
              px: 0.8,
              background: "#bdbdbd36",
              color: "gray",
              fontSize: ".8rem",
              borderRadius: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              m: 0.2,
            }}
          >
            <Box component="span" color="black" textTransform="lowercase">
              <ThumbUpOffAltRoundedIcon
                fontSize="inherit"
                sx={{
                  marginRight: theme.direction === "ltr" ? 0.5 : "unset",
                  marginLeft: theme.direction === "rtl" ? 0.5 : "unset",
                  pt: 0.2,
                }}
              />
              {data.likes ?? 0}
            </Box>
          </Box>
        </Box>
        <Typography
          fontWeight={"bold"}
          sx={{
            ml: theme.direction === "rtl" ? "unset" : "auto",
            mr: theme.direction !== "rtl" ? "unset" : "auto",
          }}
        >
          {data.price ?? "FREE"}
        </Typography>
      </Box>
    </Box>
  );
};

export default AssessmentKitsMarketListItem;
