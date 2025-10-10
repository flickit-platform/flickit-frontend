import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { KitDetailsType } from "../../model/types";
import { useKitDetailContainer } from "../../model/useKitDetailContainer";
import QueryData from "@/components/common/QueryData";
import MaturityLevels from "./MaturityLevels";
import KitDetailsTreeView from "./KitDetailsTreeView";

const FooterContainer = () => {
  const { assessmentKitId } = useParams();

  const {
    fetchKitDetailQuery,
    details,
  } = useKitDetailContainer(assessmentKitId);

  return (
    <QueryData
      {...fetchKitDetailQuery}
      render={(detailsData) => {
        const _details = (details ?? detailsData) as KitDetailsType;

        return (
          <Grid container sm={12} xs={12} mt={4}>
            <Grid
              item
              sm={2}
              xs={12}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <KitDetailsTreeView details={_details} />
            </Grid>

            <Grid
              item
              sm={9.8}
              xs={12}
              sx={{
                height: "100%",
                padding: "16px 32px",
                bgcolor: "background.containerLowest",
                borderStartEndRadius: "12px",
                borderEndEndRadius: "12px",
              }}
            >
              <MaturityLevels maturityLevels={_details.maturityLevels} />
            </Grid>
          </Grid>
        );
      }}
    />
  );
};

export default FooterContainer;
