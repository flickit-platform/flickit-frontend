import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import QueryData from "@common/QueryData";
import Title from "@common/Title";
import CompareResult from "./CompareResult";
import Button from "@mui/material/Button";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";

const CompareResultContainer = () => {
  const location = useLocation();
  const { service } = useServiceContext();
  const compareResultQueryData = useQuery<any>({
    service: (args, config) =>
      service.common.compareAssessments({ data: location.search }, config),
  });

  const navigate = useNavigate();
  return (
    <QueryData
      {...compareResultQueryData}
      render={(data) => {
        return (
          <Box>
            <Title
              size="large"
              borderBottom={true}
              toolbar={
                <Button
                  startIcon={<BorderColorRoundedIcon />}
                  size="small"
                  onClick={() =>
                    navigate({ pathname: "/compare", search: location.search })
                  }
                >
                  <Trans i18nKey="compare.editComparisonItems" />
                </Button>
              }
            >
              <Trans i18nKey="compare.comparisonResult" />{" "}
            </Title>

            <CompareResult data={data} />
          </Box>
        );
      }}
    />
  );
};

export default CompareResultContainer;
