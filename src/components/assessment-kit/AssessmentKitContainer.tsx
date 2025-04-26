import React from "react";
import Box from "@mui/material/Box";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { theme } from "@config/theme";
import Typography from "@mui/material/Typography";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import { useConfigContext } from "@providers/ConfgProvider";
import { ECustomErrorType } from "@/types";
import { ErrorNotFoundOrAccessDenied } from "@common/errors/ErrorNotFoundOrAccessDenied";
import QueryData from "@common/QueryData";
import setDocumentTitle from "@utils/setDocumentTitle";
import { t } from "i18next";
import { Link, useParams } from "react-router-dom";
import AssessmentKitAbout from "@components/assessment-kit/AssessmentKitAbout";

const AssessmentKitContainer = () => {
  const { service } = useServiceContext();
  const { assessmentKitId } = useParams();
  const assessmentKitQueryData = useQuery({
    service: (args, config) =>
      service.assessmentKit.info.getById(
        args ?? { id: assessmentKitId },
        config,
      ),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });
  const { config } = useConfigContext();

  return assessmentKitQueryData.errorObject?.response?.data?.code ===
    ECustomErrorType.ACCESS_DENIED ||
    assessmentKitQueryData.errorObject?.response?.data?.code ===
      ECustomErrorType.NOT_FOUND ? (
    <ErrorNotFoundOrAccessDenied />
  ) : (
    <QueryData
      {...assessmentKitQueryData}
      render={(data) => {
        setDocumentTitle(
          `${t("assessmentKit")}: ${data.title ?? ""}`,
          config.appTitle,
        );
        return (
            <AssessmentKit data={data} query={assessmentKitQueryData.query} />
        );
      }}
    />
  );
};

export default AssessmentKitContainer;

const AssessmentKit = (props: any) => {
  const { data } = props;

  const { title: assessmentTitle, expertGroupId } = data ?? {};
  const { service } = useServiceContext();
  const expertGroupQueryData = useQuery({
    service: (args, config) =>
      service.expertGroups.info.getById(args ?? { id: expertGroupId }, config),
  });

  return (
    <QueryData
      {...expertGroupQueryData}
      loading={false}
      render={(data) => {
        return (
          <>
            <AssessmentKitBanner assessmentTitle={assessmentTitle} {...data} />
            <Box sx={{  py: 6,
              paddingInlineStart: { xs: 1, md: 8 }
            }}>
              <AssessmentKitAbout />
            </Box>
          </>
        );
      }}
    />
  );
};

const AssessmentKitBanner = (props: any) => {
  const { assessmentTitle, title: expertGroupTitle, id, pictureLink } = props;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        background: "#2466A814",
        width: "100%",
        height: "200px",
        py: 6,
        paddingInlineStart: { xs: 1, md: 8 },
        gap: 5,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Box
          sx={{ display: "flex", alignItems: "center" }}
          component={Link}
          to={"./../"}
        >
          <ArrowBackRoundedIcon
            sx={{
              color: theme.palette.primary.dark,
              transform: theme.direction == "rtl" ? "rotate(180deg)" : "",
              fontSize: "3rem",
            }}
          />
        </Box>
        <Typography
          sx={{
            ...theme.typography.headlineLarge,
            color: theme.palette.primary.dark,
          }}
        >
          {assessmentTitle}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <img
          style={{ width: "24px", height: "24px" }}
          src={pictureLink}
          alt={`${expertGroupTitle} pic`}
        />
        <Typography sx={{ ...theme.typography.semiBoldLarge }}>
          {expertGroupTitle}
        </Typography>
      </Box>
    </Box>
  );
};
